import 'reflect-metadata';
import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { INestApplication, ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { config } from '../src/config';
import { DatabaseService } from '../src/database.service';
import { GeminiService } from '../src/chats/gemini.service';
import { setup } from '../src/setup';

config.databasePath = ':memory:';

class FakeAI {
  calls: { profile: { language: string; courseId?: string; audience?: string }; input: Record<string, unknown>[] }[] = [];
  fail = false;
  wait: Promise<void> | undefined;
  async reply(profile: { language: string; courseId?: string; audience?: string }, input: Record<string, unknown>[]) {
    this.calls.push({ profile, input });
    if (this.wait) await this.wait;
    if (this.fail) throw new ServiceUnavailableException('Provedor indisponível');
    const text = 'Hello! Vamos praticar.';
    return { text, output: [
      { id: 'rs_test', type: 'reasoning', summary: [], encrypted_content: 'opaque-context' },
      { id: `msg_${this.calls.length}`, type: 'message', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text, annotations: [] }] },
    ] };
  }
}

describe('Chat API', () => {
  let app: INestApplication;
  let ai: FakeAI;
  let token: string;
  const auth = () => ({ Authorization: `Bearer ${token}` });
  const createChat = async () => (await request(app.getHttpServer()).post('/api/chats').set(auth()).send({ language: 'fr' }).expect(201)).body.id as string;
  const send = (id: string, content: string, requestId: string = randomUUID()) => request(app.getHttpServer()).post(`/api/chats/${id}/messages`).set(auth()).send({ content, requestId });

  beforeEach(async () => {
    ai = new FakeAI();
    const module = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(GeminiService).useValue(ai).compile();
    app = module.createNestApplication();
    setup(app);
    await app.init();
    token = (await request(app.getHttpServer()).post('/api/sessions').expect(201)).body.token;
  });
  afterEach(async () => { await app.close(); });

  it('replays complete ordered context and keeps histories separated', async () => {
    const first = await createChat();
    await send(first, 'Meu nome é Ana.').expect(200);
    await send(first, 'Qual é meu nome?').expect(200);
    assert.equal(ai.calls[1].profile.language, 'fr');
    assert.equal(ai.calls[1].profile.audience, 'general');
    assert.deepEqual(ai.calls[1].input.map(item => item.type || ('role' in item ? item.role : '')), ['user', 'reasoning', 'message', 'user']);
    assert.equal((ai.calls[1].input[1] as { encrypted_content: string }).encrypted_content, 'opaque-context');
    assert.equal((ai.calls[1].input[0] as { content: string }).content, 'Meu nome é Ana.');
    const second = await createChat();
    await send(second, 'Nova conversa').expect(200);
    assert.equal(ai.calls[2].input.length, 1);
    const history = (await request(app.getHttpServer()).get(`/api/chats/${first}/messages?limit=1&offset=1`).set(auth()).expect(200)).body;
    assert.equal(history.total, 2);
    assert.equal(history.items.length, 2);
    assert.equal(history.items[0].content, 'Qual é meu nome?');
    assert.ok(!JSON.stringify(history).includes('encrypted_content'));
    const list = (await request(app.getHttpServer()).get('/api/chats?limit=1').set(auth()).expect(200)).body;
    assert.equal(list.total, 2);
    assert.equal(list.items.length, 1);
  });

  it('rejects missing credentials and access by a different session', async () => {
    const id = await createChat();
    await send(id, 'Privado').expect(200);
    await request(app.getHttpServer()).get('/api/chats').expect(401);
    token = (await request(app.getHttpServer()).post('/api/sessions').expect(201)).body.token;
    for (const path of [`/api/chats/${id}`, `/api/chats/${id}/messages`]) {
      await request(app.getHttpServer()).get(path).set(auth()).expect(404);
    }
    await send(id, 'Intrusão').expect(404);
    await request(app.getHttpServer()).delete(`/api/chats/${id}`).set(auth()).expect(404);
    assert.equal((await request(app.getHttpServer()).get('/api/chats').set(auth())).body.total, 0);
  });

  it('validates message, language, pagination, UUID and forbidden fields', async () => {
    const id = await createChat();
    await send(id, '   ').expect(400);
    await send(id, 'a'.repeat(4001)).expect(400);
    await send(id, 'oi', 'invalid').expect(400);
    await request(app.getHttpServer()).post(`/api/chats/${id}/messages`).set(auth()).send({ content: 'oi', requestId: randomUUID(), role: 'system' }).expect(400);
    await request(app.getHttpServer()).post('/api/chats').set(auth()).send({ language: 'invalid' }).expect(400);
    await request(app.getHttpServer()).post('/api/chats').set(auth()).send({ audience: 'aliens' }).expect(400);
    await request(app.getHttpServer()).get('/api/chats?offset=-1').set(auth()).expect(400);
    await request(app.getHttpServer()).get('/api/chats/not-a-uuid').set(auth()).expect(400);
    assert.equal(ai.calls.length, 0);
  });

  it('deduplicates retries and rejects reusing a key for a different message', async () => {
    const id = await createChat();
    const key = randomUUID();
    const first = await send(id, 'Oi', key).expect(200);
    const second = await send(id, 'Oi', key).expect(200);
    assert.deepEqual(first.body, second.body);
    assert.equal(ai.calls.length, 1);
    await send(id, 'Outra mensagem', key).expect(409);
  });

  it('does not persist partial turns on provider failure and allows retry', async () => {
    const id = await createChat();
    const key = randomUUID();
    ai.fail = true;
    await send(id, 'Oi', key).expect(503);
    const history = await request(app.getHttpServer()).get(`/api/chats/${id}/messages`).set(auth()).expect(200);
    assert.equal(history.body.total, 0);
    ai.fail = false;
    await send(id, 'Oi', key).expect(200);
    assert.equal(ai.calls[1].input.length, 1);
  });

  it('rejects overlapping sends and deletion while generation is running', async () => {
    const id = await createChat();
    let release!: () => void;
    ai.wait = new Promise<void>(resolve => { release = resolve; });
    const first = send(id, 'Primeira').then(response => response);
    try {
      for (let attempt = 0; ai.calls.length === 0 && attempt < 100; attempt++) await new Promise(resolve => setTimeout(resolve, 10));
      assert.equal(ai.calls.length, 1);
      await send(id, 'Segunda').expect(409);
      await request(app.getHttpServer()).delete(`/api/chats/${id}`).set(auth()).expect(409);
    } finally { release(); }
    assert.equal((await first).status, 200);
    await request(app.getHttpServer()).delete(`/api/chats/${id}`).set(auth()).expect(204);
    await request(app.getHttpServer()).get(`/api/chats/${id}/messages`).set(auth()).expect(404);
    const database = app.get(DatabaseService);
    assert.equal(database.db.prepare('SELECT COUNT(*) AS total FROM turns').get()!.total, 0);
  });

  it('enforces a context budget without truncating saved history', async () => {
    const id = await createChat();
    await send(id, 'Mensagem antiga').expect(200);
    const original = config.maxContextBytes;
    config.maxContextBytes = 10;
    try {
      await send(id, 'Nova mensagem').expect(422);
      const history = await request(app.getHttpServer()).get(`/api/chats/${id}/messages`).set(auth()).expect(200);
      assert.equal(history.body.total, 1);
      assert.equal(ai.calls.length, 1);
    } finally { config.maxContextBytes = original; }
  });

  it('rate limits generation requests', async () => {
    const id = await createChat();
    for (let index = 0; index < 10; index++) await send(id, `Mensagem ${index}`).expect(200);
    await send(id, 'Excedente').expect(429);
  });

  it('registers and logs in users with isolated chat history', async () => {
    const first = await request(app.getHttpServer()).post('/api/auth/register')
      .send({ name: 'Ana', email: 'ana@example.com', password: 'segredo1' }).expect(201);
    assert.equal(first.body.user.email, 'ana@example.com');
    token = first.body.token;
    const id = (await request(app.getHttpServer()).post('/api/chats').set(auth())
      .send({ language: 'en', courseId: 'kids', audience: 'kids' }).expect(201)).body.id as string;
    await send(id, 'Oi').expect(200);
    assert.equal(ai.calls.at(-1)!.profile.audience, 'kids');

    await request(app.getHttpServer()).post('/api/auth/register')
      .send({ name: 'Ana', email: 'ana@example.com', password: 'segredo1' }).expect(409);
    await request(app.getHttpServer()).post('/api/auth/login')
      .send({ email: 'ana@example.com', password: 'errada' }).expect(401);

    const logged = await request(app.getHttpServer()).post('/api/auth/login')
      .send({ email: 'ana@example.com', password: 'segredo1' }).expect(201);
    token = logged.body.token;
    assert.equal((await request(app.getHttpServer()).get('/api/chats').set(auth()).expect(200)).body.total, 1);
    const profile = await request(app.getHttpServer()).get('/api/profile').set(auth()).expect(200);
    assert.equal(profile.body.user.name, 'Ana');
    assert.equal(profile.body.stats.messageCount, 1);
    await request(app.getHttpServer()).patch('/api/profile').set(auth())
      .send({ name: 'Ana Maria', defaultLanguage: 'en', avatarUrl: 'data:image/png;base64,test' }).expect(200);

    const other = await request(app.getHttpServer()).post('/api/auth/register')
      .send({ name: 'Bia', email: 'bia@example.com', password: 'segredo1' }).expect(201);
    token = other.body.token;
    assert.equal((await request(app.getHttpServer()).get('/api/chats').set(auth()).expect(200)).body.total, 0);
  });
});

it('persists data across database restarts', () => {
  const directory = mkdtempSync(join(tmpdir(), 'change-chat-test-'));
  const previous = config.databasePath;
  config.databasePath = join(directory, 'test.sqlite');
  let db: DatabaseService | undefined;
  try {
    db = new DatabaseService();
    db.db.prepare('INSERT INTO users (id, name, email, password_hash, avatar_url, default_language, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run('user', 'Ana', 'ana@example.com', 'hash', null, 'pt', 'now');
    db.db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').run('session', 'user', 'hash', 'now');
    db.db.prepare('INSERT INTO chats (id, session_id, title, language, course_id, audience, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run('chat', 'user', 'Conversa', 'en', 'kids', 'kids', 'now', 'now');
    db.db.prepare('INSERT INTO turns (id, chat_id, request_id, user_text, assistant_text, output_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run('turn', 'chat', 'key', 'oi', 'olá', '[]', 'now');
    db.onModuleDestroy();
    db = new DatabaseService();
    assert.equal(db.db.prepare('SELECT user_text FROM turns').get()!.user_text, 'oi');
    assert.equal(db.db.prepare('SELECT token_hash FROM sessions').get()!.token_hash, 'hash');
  } finally {
    db?.onModuleDestroy();
    config.databasePath = previous;
    rmSync(directory, { recursive: true, force: true });
  }
});

it('missing API key returns an actionable error', async () => {
  const previousGemini = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    await assert.rejects(() => new GeminiService().reply('en', []), ServiceUnavailableException);
  } finally {
    if (previousGemini !== undefined) process.env.GEMINI_API_KEY = previousGemini;
  }
});

