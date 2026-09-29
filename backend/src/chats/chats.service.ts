import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database.service';
import { config } from '../config';
import { CreateChatDto, PageDto, SendMessageDto } from './dto';
import { GeminiService, instructionsFor } from './gemini.service';

type Chat = { id: string; title: string; language: string; courseId: string; audience: string; createdAt: string; updatedAt: string };
type Turn = { id: string; request_id: string; user_text: string; assistant_text: string; output_json: string; created_at: string };
type StoredContextItem = Record<string, unknown>;
const chatColumns = 'id, title, language, course_id AS courseId, audience, created_at AS createdAt, updated_at AS updatedAt';

@Injectable()
export class ChatsService {
  // This MVP runs as one process. A distributed deployment needs a shared lock/queue.
  private readonly busy = new Set<string>();
  constructor(private readonly database: DatabaseService, private readonly ai: GeminiService) {}

  create(owner: string, dto: CreateChatDto) {
    const id = randomUUID();
    const now = new Date().toISOString();
    this.database.db.prepare('INSERT INTO chats (id, session_id, title, language, course_id, audience, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, owner, dto.title ?? 'Nova conversa', dto.language, dto.courseId, dto.audience, now, now);
    return this.get(owner, id);
  }

  list(owner: string, page: PageDto) {
    const items = this.database.db.prepare(`SELECT ${chatColumns} FROM chats WHERE session_id = ? ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`)
      .all(owner, page.limit, page.offset);
    const total = this.database.db.prepare('SELECT COUNT(*) AS total FROM chats WHERE session_id = ?').get(owner)!.total;
    return { items, total, ...page };
  }

  get(owner: string, id: string): Chat {
    const chat = this.database.db.prepare(`SELECT ${chatColumns} FROM chats WHERE id = ? AND session_id = ?`).get(id, owner);
    if (!chat) throw new NotFoundException('Conversa não encontrada.');
    return chat as Chat;
  }

  private messages(turn: Turn, translation = '') {
    return [
      { id: `${turn.id}:user`, role: 'user', content: turn.user_text, createdAt: turn.created_at },
      { id: `${turn.id}:assistant`, role: 'assistant', content: turn.assistant_text, translation, createdAt: turn.created_at },
    ];
  }

  private userProfile(owner: string) {
    const user = this.database.db.prepare('SELECT name, default_language AS defaultLanguage FROM users WHERE id = ?').get(owner) as
      | { name: string; defaultLanguage: string }
      | undefined;
    return {
      firstName: user?.name?.trim().split(/\s+/)[0],
      defaultLanguage: user?.defaultLanguage || 'pt',
    };
  }

  history(owner: string, id: string, page: PageDto) {
    this.get(owner, id);
    const turns = this.database.db.prepare('SELECT * FROM turns WHERE chat_id = ? ORDER BY sequence ASC LIMIT ? OFFSET ?')
      .all(id, page.limit, page.offset) as Turn[];
    const total = this.database.db.prepare('SELECT COUNT(*) AS total FROM turns WHERE chat_id = ?').get(id)!.total;
    return { items: turns.flatMap(turn => this.messages(turn)), total, ...page };
  }

  remove(owner: string, id: string) {
    this.get(owner, id);
    if (this.busy.has(id)) throw new ConflictException('Aguarde a resposta antes de excluir esta conversa.');
    this.database.db.prepare('DELETE FROM chats WHERE id = ? AND session_id = ?').run(id, owner);
  }

  update(owner: string, id: string, dto: { title: string }) {
    this.get(owner, id);
    const now = new Date().toISOString();
    this.database.db.prepare('UPDATE chats SET title = ?, updated_at = ? WHERE id = ? AND session_id = ?')
      .run(dto.title, now, id, owner);
    return this.get(owner, id);
  }

  async send(owner: string, id: string, dto: SendMessageDto) {
    const chat = this.get(owner, id);
    if (this.busy.has(id)) throw new ConflictException('Já existe uma resposta em andamento neste chat.');
    const saved = this.database.db.prepare('SELECT * FROM turns WHERE chat_id = ? AND request_id = ?').get(id, dto.requestId) as Turn | undefined;
    if (saved) {
      if (saved.user_text !== dto.content) throw new ConflictException('requestId já utilizado com outro conteúdo.');
      return { messages: this.messages(saved) };
    }
    this.busy.add(id);
    try {
      const turns = this.database.db.prepare('SELECT * FROM turns WHERE chat_id = ? ORDER BY sequence ASC').all(id) as Turn[];
      const input: StoredContextItem[] = turns.flatMap(turn => [
        { role: 'user' as const, content: turn.user_text },
        ...JSON.parse(turn.output_json) as StoredContextItem[],
      ]);
      input.push({ role: 'user', content: dto.content });
      const profile = { language: chat.language, courseId: chat.courseId, audience: chat.audience, ...this.userProfile(owner) };
      if (Buffer.byteLength(JSON.stringify(input) + instructionsFor(profile), 'utf8') > config.maxContextBytes) {
        throw new UnprocessableEntityException('Esta conversa atingiu o limite de contexto. Inicie um novo chat; o histórico foi preservado.');
      }
      const response = await this.ai.reply(profile, input);
      const translation = dto.translate ? await this.ai.translate(response.text, profile.defaultLanguage) : '';
      const turn: Turn = {
        id: randomUUID(), request_id: dto.requestId, user_text: dto.content,
        assistant_text: response.text, output_json: JSON.stringify(response.output), created_at: new Date().toISOString(),
      };
      this.database.transaction(() => {
        this.database.db.prepare(`INSERT INTO turns (id, chat_id, request_id, user_text, assistant_text, output_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
          .run(turn.id, id, turn.request_id, turn.user_text, turn.assistant_text, turn.output_json, turn.created_at);
        this.database.db.prepare('UPDATE chats SET title = ?, updated_at = ? WHERE id = ?')
          .run(turns.length === 0 && chat.title === 'Nova conversa' ? dto.content.slice(0, 80) : chat.title, turn.created_at, id);
      });
      return { messages: this.messages(turn, translation) };
    } finally {
      this.busy.delete(id);
    }
  }

  cleanTranscript(owner: string, dto: { text: string; defaultLanguage: string }) {
    this.userProfile(owner);
    return this.ai.cleanTranscript(dto.text, dto.defaultLanguage);
  }
}
