import { Body, Controller, Get, Injectable, NotFoundException, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsString, Max, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';
import { randomBytes, randomUUID } from 'node:crypto';
import { DatabaseService } from './database.service';
import { SessionGuard, SessionRequest } from './session';

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;
class CreateGroupDto {
  @IsString() @Transform(trim) @MinLength(2) @MaxLength(60) name!: string;
  @ValidateIf((_o, v) => v !== undefined) @IsInt() @Min(2) @Max(50) maxMembers = 10;
  @ValidateIf((_o, v) => v !== undefined) @IsBoolean() isPublic = false;
}
class SendGroupMessageDto { @IsString() @Transform(trim) @MinLength(1) @MaxLength(2000) content!: string; }

@Injectable()
export class GroupsService {
  constructor(private readonly database: DatabaseService) {}
  private user(req: SessionRequest) { if (!req.userId) throw new UnauthorizedException('Entre na conta para usar grupos.'); return req.userId; }
  private code() { return randomBytes(5).toString('base64url'); }
  private member(groupId: string, userId: string) { return this.database.db.prepare('SELECT * FROM group_members WHERE group_id = ? AND user_id = ?').get(groupId, userId); }
  private groupSummary(group: any, userId: string) {
    const members = this.database.db.prepare('SELECT COUNT(*) AS total FROM group_members WHERE group_id = ?').get(group.id) as { total: number };
    return { id: group.id, name: group.name, inviteCode: group.invite_code, maxMembers: group.max_members, isPublic: !!group.is_public, memberCount: members.total, isMember: !!this.member(group.id, userId), createdAt: group.created_at };
  }
  create(req: SessionRequest, dto: CreateGroupDto) {
    const userId = this.user(req); const id = randomUUID(); const now = new Date().toISOString(); let invite = this.code();
    while (this.database.db.prepare('SELECT id FROM groups WHERE invite_code = ?').get(invite)) invite = this.code();
    this.database.transaction(() => {
      this.database.db.prepare('INSERT INTO groups (id, owner_id, name, invite_code, max_members, is_public, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, userId, dto.name, invite, dto.maxMembers, dto.isPublic ? 1 : 0, now, now);
      this.database.db.prepare('INSERT INTO group_members (id, group_id, user_id, role, joined_at) VALUES (?, ?, ?, ?, ?)').run(randomUUID(), id, userId, 'owner', now);
    });
    return this.get(req, id);
  }
  list(req: SessionRequest) {
    const userId = this.user(req);
    const rows = this.database.db.prepare('SELECT groups.* FROM groups JOIN group_members ON group_members.group_id = groups.id WHERE group_members.user_id = ? ORDER BY groups.updated_at DESC').all(userId) as any[];
    return { items: rows.map(row => this.groupSummary(row, userId)) };
  }
  get(req: SessionRequest, id: string) {
    const userId = this.user(req); const group = this.database.db.prepare('SELECT * FROM groups WHERE id = ?').get(id) as any;
    if (!group) throw new NotFoundException('Grupo não encontrado.');
    const members = this.database.db.prepare('SELECT users.id, users.name, users.username, users.avatar_url AS avatarUrl, group_members.role FROM group_members JOIN users ON users.id = group_members.user_id WHERE group_members.group_id = ? ORDER BY group_members.joined_at ASC').all(id);
    return { ...this.groupSummary(group, userId), members };
  }
  invite(req: SessionRequest, code: string) {
    const userId = this.user(req); const group = this.database.db.prepare('SELECT * FROM groups WHERE invite_code = ?').get(code) as any;
    if (!group) throw new NotFoundException('Convite não encontrado.');
    return this.groupSummary(group, userId);
  }
  join(req: SessionRequest, code: string) {
    const userId = this.user(req); const group = this.database.db.prepare('SELECT * FROM groups WHERE invite_code = ?').get(code) as any;
    if (!group) throw new NotFoundException('Convite não encontrado.');
    if (!this.member(group.id, userId)) {
      const count = this.database.db.prepare('SELECT COUNT(*) AS total FROM group_members WHERE group_id = ?').get(group.id) as { total: number };
      if (count.total >= group.max_members) throw new NotFoundException('Este grupo está cheio.');
      this.database.db.prepare('INSERT INTO group_members (id, group_id, user_id, role, joined_at) VALUES (?, ?, ?, ?, ?)').run(randomUUID(), group.id, userId, 'member', new Date().toISOString());
    }
    return this.get(req, group.id);
  }
  messages(req: SessionRequest, id: string) {
    const userId = this.user(req); if (!this.member(id, userId)) throw new NotFoundException('Você não faz parte deste grupo.');
    const items = this.database.db.prepare('SELECT group_messages.id, group_messages.sender_id AS senderId, group_messages.content, group_messages.created_at AS createdAt, users.name, users.username, users.avatar_url AS avatarUrl FROM group_messages JOIN users ON users.id = group_messages.sender_id WHERE group_messages.group_id = ? ORDER BY group_messages.sequence ASC LIMIT 200').all(id);
    return { items };
  }
  send(req: SessionRequest, id: string, dto: SendGroupMessageDto) {
    const userId = this.user(req); if (!this.member(id, userId)) throw new NotFoundException('Você não faz parte deste grupo.');
    const now = new Date().toISOString(); const messageId = randomUUID();
    this.database.transaction(() => {
      this.database.db.prepare('INSERT INTO group_messages (id, group_id, sender_id, content, created_at) VALUES (?, ?, ?, ?, ?)').run(messageId, id, userId, dto.content, now);
      this.database.db.prepare('UPDATE groups SET updated_at = ? WHERE id = ?').run(now, id);
    });
    return { message: { id: messageId, senderId: userId, content: dto.content, createdAt: now } };
  }
}

@Controller('groups')
@UseGuards(SessionGuard)
export class GroupsController {
  constructor(private readonly groups: GroupsService) {}
  @Get() list(@Req() req: SessionRequest) { return this.groups.list(req); }
  @Post() create(@Req() req: SessionRequest, @Body() dto: CreateGroupDto) { return this.groups.create(req, dto); }
  @Get('invite/:code') invite(@Req() req: SessionRequest, @Param('code') code: string) { return this.groups.invite(req, code); }
  @Post('invite/:code/join') join(@Req() req: SessionRequest, @Param('code') code: string) { return this.groups.join(req, code); }
  @Get(':id') get(@Req() req: SessionRequest, @Param('id') id: string) { return this.groups.get(req, id); }
  @Get(':id/messages') messages(@Req() req: SessionRequest, @Param('id') id: string) { return this.groups.messages(req, id); }
  @Post(':id/messages') send(@Req() req: SessionRequest, @Param('id') id: string, @Body() dto: SendGroupMessageDto) { return this.groups.send(req, id, dto); }
}
