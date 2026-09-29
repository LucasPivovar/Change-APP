import { Body, ConflictException, Controller, Get, Injectable, NotFoundException, Param, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from './database.service';
import { normalizeUsernameValue, SessionGuard, SessionRequest } from './session';

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;
const username = ({ value }: { value: unknown }) => typeof value === 'string' ? normalizeUsernameValue(value) : value;

class AddFriendDto {
  @IsString() @Transform(username) @MinLength(3) @MaxLength(24)
  username!: string;
}

class SendFriendMessageDto {
  @IsString() @Transform(trim) @MinLength(1) @MaxLength(4000)
  content!: string;
}

class SearchDto {
  @IsString() @Transform(username) @MinLength(1) @MaxLength(24)
  q!: string;
}

type UserRow = { id: string; name: string; username: string; avatarUrl: string | null; defaultLanguage: string };

function userSelect(alias = 'users') {
  return `${alias}.id, ${alias}.name, ${alias}.username, ${alias}.avatar_url AS avatarUrl, ${alias}.default_language AS defaultLanguage`;
}

@Injectable()
export class FriendsService {
  constructor(private readonly database: DatabaseService) {}

  private requireUser(req: SessionRequest) {
    if (!req.userId) throw new UnauthorizedException('Entre na conta para usar amigos.');
    return req.userId;
  }

  private normalizePair(a: string, b: string) {
    return a < b ? [a, b] : [b, a];
  }

  private friendStreak(userId: string, friendId: string) {
    const rows = this.database.db.prepare(`
      SELECT friend_messages.created_at AS createdAt, friend_messages.sender_id AS senderId
      FROM friend_messages
      JOIN friend_conversations ON friend_conversations.id = friend_messages.conversation_id
      WHERE (friend_conversations.user_a_id = ? AND friend_conversations.user_b_id = ?)
         OR (friend_conversations.user_a_id = ? AND friend_conversations.user_b_id = ?)
      ORDER BY friend_messages.created_at ASC
    `).all(userId, friendId, friendId, userId) as Array<{ createdAt: string; senderId: string }>;
    const participantsByDay = new Map<string, Set<string>>();
    for (const row of rows) {
      const day = row.createdAt.slice(0, 10);
      const participants = participantsByDay.get(day) || new Set<string>();
      participants.add(row.senderId);
      participantsByDay.set(day, participants);
    }
    const seen = new Set([...participantsByDay.entries()].filter(([, senders]) => senders.has(userId) && senders.has(friendId)).map(([day]) => day));
    let streak = 0;
    const cursor = new Date();
    while (seen.has(cursor.toISOString().slice(0, 10))) {
      streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    return { streakDays: streak, messageCount: rows.length, lastMessageAt: rows.at(-1)?.createdAt || null };
  }

  search(req: SessionRequest, dto: SearchDto) {
    const userId = this.requireUser(req);
    const items = this.database.db.prepare(`
      SELECT ${userSelect()}
      FROM users
      WHERE id != ? AND (username LIKE ? OR lower(name) LIKE ?)
      ORDER BY name ASC, username ASC
      LIMIT 20
    `).all(userId, `%${dto.q}%`, `%${dto.q.toLowerCase()}%`) as UserRow[];
    const friendships = this.database.db.prepare(`
      SELECT requester_id AS requesterId, addressee_id AS addresseeId, status
      FROM friendships
      WHERE requester_id = ? OR addressee_id = ?
    `).all(userId, userId) as Array<{ requesterId: string; addresseeId: string; status: string }>;
    const relation = new Map(friendships.map(row => [row.requesterId === userId ? row.addresseeId : row.requesterId, row]));
    return {
      items: items.map(item => {
        const row = relation.get(item.id);
        return {
          ...item,
          isFriend: row?.status === 'accepted',
          requestSent: row?.status === 'pending' && row.requesterId === userId,
          requestReceived: row?.status === 'pending' && row.addresseeId === userId,
        };
      }),
    };
  }

  add(req: SessionRequest, dto: AddFriendDto) {
    const userId = this.requireUser(req);
    const friend = this.database.db.prepare(`SELECT ${userSelect()} FROM users WHERE username = ?`).get(dto.username) as UserRow | undefined;
    if (!friend) throw new NotFoundException('Usuário não encontrado.');
    if (friend.id === userId) throw new ConflictException('Você não pode adicionar a si mesmo.');
    const existing = this.database.db.prepare(`
      SELECT id, requester_id AS requesterId, addressee_id AS addresseeId, status FROM friendships
      WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)
    `).get(userId, friend.id, friend.id, userId) as { id: string; requesterId: string; addresseeId: string; status: string } | undefined;
    if (existing?.status === 'accepted') return { friend: { ...friend, ...this.friendStreak(userId, friend.id), isFriend: true } };
    if (existing?.status === 'pending') {
      if (existing.addresseeId === userId) return this.accept(req, existing.id);
      return { friend: { ...friend, requestSent: true } };
    }
    try {
      this.database.db.prepare('INSERT INTO friendships (id, requester_id, addressee_id, status, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(randomUUID(), userId, friend.id, 'pending', new Date().toISOString());
    } catch {}
    return { friend: { ...friend, requestSent: true } };
  }

  requests(req: SessionRequest) {
    const userId = this.requireUser(req);
    const incoming = this.database.db.prepare(`
      SELECT friendships.id AS requestId, friendships.created_at AS createdAt, ${userSelect('requester')}
      FROM friendships
      JOIN users AS requester ON requester.id = friendships.requester_id
      WHERE friendships.addressee_id = ? AND friendships.status = 'pending'
      ORDER BY friendships.created_at DESC
    `).all(userId);
    const outgoing = this.database.db.prepare(`
      SELECT friendships.id AS requestId, friendships.created_at AS createdAt, ${userSelect('addressee')}
      FROM friendships
      JOIN users AS addressee ON addressee.id = friendships.addressee_id
      WHERE friendships.requester_id = ? AND friendships.status = 'pending'
      ORDER BY friendships.created_at DESC
    `).all(userId);
    return { incoming, outgoing };
  }

  accept(req: SessionRequest, requestId: string) {
    const userId = this.requireUser(req);
    const request = this.database.db.prepare(`
      SELECT friendships.id AS requestId, friendships.requester_id AS requesterId, ${userSelect('requester')}
      FROM friendships
      JOIN users AS requester ON requester.id = friendships.requester_id
      WHERE friendships.id = ? AND friendships.addressee_id = ? AND friendships.status = 'pending'
    `).get(requestId, userId) as (UserRow & { requestId: string; requesterId: string }) | undefined;
    if (!request) throw new NotFoundException('Pedido de amizade não encontrado.');
    this.database.db.prepare('UPDATE friendships SET status = ? WHERE id = ?').run('accepted', requestId);
    return { friend: { id: request.requesterId, name: request.name, username: request.username, avatarUrl: request.avatarUrl, defaultLanguage: request.defaultLanguage, ...this.friendStreak(userId, request.requesterId) } };
  }

  list(req: SessionRequest) {
    const userId = this.requireUser(req);
    const rows = this.database.db.prepare(`
      SELECT ${userSelect('friend')}
      FROM friendships
      JOIN users AS friend ON friend.id = CASE
        WHEN friendships.requester_id = ? THEN friendships.addressee_id
        ELSE friendships.requester_id
      END
      WHERE friendships.status = 'accepted' AND (friendships.requester_id = ? OR friendships.addressee_id = ?)
      ORDER BY friend.name ASC
    `).all(userId, userId, userId) as UserRow[];
    return { items: rows.map(friend => ({ ...friend, ...this.friendStreak(userId, friend.id) })) };
  }

  conversation(req: SessionRequest, friendId: string) {
    const userId = this.requireUser(req);
    const friend = this.database.db.prepare(`SELECT ${userSelect()} FROM users WHERE id = ?`).get(friendId) as UserRow | undefined;
    if (!friend) throw new NotFoundException('Amigo não encontrado.');
    const friendship = this.database.db.prepare(`
      SELECT id FROM friendships
      WHERE status = 'accepted' AND ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?))
    `).get(userId, friendId, friendId, userId);
    if (!friendship) throw new NotFoundException('Adicione esta pessoa antes de conversar.');
    const [a, b] = this.normalizePair(userId, friendId);
    const now = new Date().toISOString();
    let conversation = this.database.db.prepare('SELECT * FROM friend_conversations WHERE user_a_id = ? AND user_b_id = ?').get(a, b) as any;
    if (!conversation) {
      const id = randomUUID();
      this.database.db.prepare('INSERT INTO friend_conversations (id, user_a_id, user_b_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
        .run(id, a, b, now, now);
      conversation = this.database.db.prepare('SELECT * FROM friend_conversations WHERE id = ?').get(id);
    }
    return { id: conversation.id, friend, updatedAt: conversation.updated_at, ...this.friendStreak(userId, friendId) };
  }

  conversations(req: SessionRequest) {
    const userId = this.requireUser(req);
    const rows = this.database.db.prepare(`
      SELECT friend_conversations.id AS conversationId, friend_conversations.updated_at AS updatedAt, ${userSelect('friend')}
      FROM friend_conversations
      JOIN users AS friend ON friend.id = CASE
        WHEN friend_conversations.user_a_id = ? THEN friend_conversations.user_b_id
        ELSE friend_conversations.user_a_id
      END
      WHERE friend_conversations.user_a_id = ? OR friend_conversations.user_b_id = ?
      ORDER BY friend_conversations.updated_at DESC
      LIMIT 50
    `).all(userId, userId, userId) as Array<UserRow & { conversationId: string; updatedAt: string }>;
    return { items: rows.map(row => ({
      id: row.conversationId,
      updatedAt: row.updatedAt,
      friend: { id: row.id, name: row.name, username: row.username, avatarUrl: row.avatarUrl },
      ...this.friendStreak(userId, row.id),
    })) };
  }

  messages(req: SessionRequest, conversationId: string) {
    const userId = this.requireUser(req);
    const conversation = this.database.db.prepare('SELECT * FROM friend_conversations WHERE id = ? AND (user_a_id = ? OR user_b_id = ?)').get(conversationId, userId, userId);
    if (!conversation) throw new NotFoundException('Conversa não encontrada.');
    const items = this.database.db.prepare(`
      SELECT id, sender_id AS senderId, content, created_at AS createdAt
      FROM friend_messages
      WHERE conversation_id = ?
      ORDER BY sequence ASC
      LIMIT 100
    `).all(conversationId);
    return { items };
  }

  send(req: SessionRequest, conversationId: string, dto: SendFriendMessageDto) {
    const userId = this.requireUser(req);
    const conversation = this.database.db.prepare('SELECT * FROM friend_conversations WHERE id = ? AND (user_a_id = ? OR user_b_id = ?)').get(conversationId, userId, userId);
    if (!conversation) throw new NotFoundException('Conversa não encontrada.');
    const now = new Date().toISOString();
    const id = randomUUID();
    this.database.transaction(() => {
      this.database.db.prepare('INSERT INTO friend_messages (id, conversation_id, sender_id, content, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(id, conversationId, userId, dto.content, now);
      this.database.db.prepare('UPDATE friend_conversations SET updated_at = ? WHERE id = ?').run(now, conversationId);
    });
    return { message: { id, senderId: userId, content: dto.content, createdAt: now } };
  }
}

@Controller('friends')
@UseGuards(SessionGuard)
export class FriendsController {
  constructor(private readonly friends: FriendsService) {}

  @Get('search') search(@Req() req: SessionRequest, @Query() dto: SearchDto) { return this.friends.search(req, dto); }
  @Get() list(@Req() req: SessionRequest) { return this.friends.list(req); }
  @Post() add(@Req() req: SessionRequest, @Body() dto: AddFriendDto) { return this.friends.add(req, dto); }
  @Get('requests') requests(@Req() req: SessionRequest) { return this.friends.requests(req); }
  @Post('requests/:id/accept') accept(@Req() req: SessionRequest, @Param('id') id: string) { return this.friends.accept(req, id); }
  @Post(':friendId/conversation') conversation(@Req() req: SessionRequest, @Param('friendId') friendId: string) { return this.friends.conversation(req, friendId); }
  @Get('conversations') conversations(@Req() req: SessionRequest) { return this.friends.conversations(req); }
  @Get('conversations/:id/messages') messages(@Req() req: SessionRequest, @Param('id') id: string) { return this.friends.messages(req, id); }
  @Post('conversations/:id/messages') send(@Req() req: SessionRequest, @Param('id') id: string, @Body() dto: SendFriendMessageDto) { return this.friends.send(req, id, dto); }
}
