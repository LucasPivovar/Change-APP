import { afterEach, beforeEach, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { BadGatewayException, ServiceUnavailableException, UnprocessableEntityException } from '@nestjs/common';
import { GeminiService } from '../src/chats/gemini.service';

let originalKey: string | undefined;
let originalProvider: string | undefined;
let originalGroqKey: string | undefined;
beforeEach(() => {
  originalKey = process.env.GEMINI_API_KEY;
  originalProvider = process.env.AI_PROVIDER;
  originalGroqKey = process.env.GROQ_API_KEY;
  process.env.AI_PROVIDER = 'gemini';
  process.env.GEMINI_API_KEY = 'test-only-key';
});
afterEach(() => {
  mock.restoreAll();
  if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalKey;
  if (originalProvider === undefined) delete process.env.AI_PROVIDER;
  else process.env.AI_PROVIDER = originalProvider;
  if (originalGroqKey === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = originalGroqKey;
});

it('sends the expected Gemini API payload and extracts provider text', async () => {
  let payload: Record<string, unknown> = {};
  mock.method(globalThis, 'fetch', async (_url: unknown, init: RequestInit) => {
    payload = JSON.parse(init.body as string);
    return new Response(
      JSON.stringify({
        candidates: [
          {
            content: {
              parts: [{ text: 'Bonjour!' }],
              role: 'model',
            },
            finishReason: 'STOP',
          },
        ],
      }),
      { headers: { 'content-type': 'application/json' } }
    );
  });
  const result = await new GeminiService().reply('fr', [{ role: 'user', content: 'Olá' }]);
  assert.equal(result.text, 'Bonjour!');
  assert.equal(result.output.length, 1);
  assert.match((payload.system_instruction as { parts: { text: string }[] }).parts[0].text, /fr/);
  assert.deepEqual(payload.contents, [{ role: 'user', parts: [{ text: 'Olá' }] }]);
});

it('sends the expected Groq chat payload and extracts provider text', async () => {
  process.env.AI_PROVIDER = 'groq';
  process.env.GROQ_API_KEY = 'test-only-groq-key';
  let payload: Record<string, unknown> = {};
  mock.method(globalThis, 'fetch', async (_url: unknown, init: RequestInit) => {
    payload = JSON.parse(init.body as string);
    return new Response(
      JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Hello!' } }] }),
      { headers: { 'content-type': 'application/json' } }
    );
  });
  const result = await new GeminiService().reply('en', [
    { role: 'user', content: 'Oi' },
    { role: 'assistant', content: [{ text: 'Hi!' }] },
    { role: 'user', content: 'Tudo bem?' },
  ]);
  assert.equal(result.text, 'Hello!');
  assert.equal(payload.model, process.env.GROQ_MODEL || 'openai/gpt-oss-20b');
  const messages = payload.messages as Array<{ role: string; content: string }>;
  assert.equal(messages[0].role, 'system');
  assert.match(messages[0].content, /inglês/);
  assert.deepEqual(messages.slice(1), [
    { role: 'user', content: 'Oi' },
    { role: 'assistant', content: 'Hi!' },
    { role: 'user', content: 'Tudo bem?' },
  ]);
});

it('does not accept incomplete model output as a completed turn', async () => {
  mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '' }] } }] }), {
      headers: { 'content-type': 'application/json' },
    })
  );
  await assert.rejects(() => new GeminiService().reply('en', []), BadGatewayException);
});

it('maps context overflow to 422 and sanitizes other provider errors', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () =>
    new Response(
      JSON.stringify({ error: { message: 'context length exceeded limit', code: 400 } }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    )
  );
  await assert.rejects(() => new GeminiService().reply('en', []), UnprocessableEntityException);
  fetchMock.mock.mockImplementation(async () =>
    new Response(
      JSON.stringify({ error: { message: 'private-provider-detail', code: 401 } }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  );
  await assert.rejects(
    () => new GeminiService().reply('en', []),
    (error: unknown) => {
      assert.ok(error instanceof ServiceUnavailableException);
      assert.ok(!error.message.includes('private-provider-detail'));
      return true;
    }
  );
});

it('preserves a model response as a visible response', async () => {
  mock.method(globalThis, 'fetch', async () =>
    new Response(
      JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Não posso ajudar com isso.' }] } }],
      }),
      { headers: { 'content-type': 'application/json' } }
    )
  );
  assert.equal((await new GeminiService().reply('pt', [])).text, 'Não posso ajudar com isso.');
});

it('removes lightweight markdown from visible assistant text', async () => {
  mock.method(globalThis, 'fetch', async () =>
    new Response(
      JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Você pode dizer: **I like studying**.' }] } }],
      }),
      { headers: { 'content-type': 'application/json' } }
    )
  );
  assert.equal((await new GeminiService().reply('en', [])).text, 'Você pode dizer: I like studying.');
});

it('translates and cleans transcript with focused prompts', async () => {
  const requests: unknown[] = [];
  mock.method(globalThis, 'fetch', async (_url: unknown, init: RequestInit) => {
    const payload = JSON.parse(init.body as string);
    requests.push(payload);
    return new Response(
      JSON.stringify({ candidates: [{ content: { parts: [{ text: requests.length === 1 ? 'Como foi seu dia?' : 'Hello, how are you?' }] } }] }),
      { headers: { 'content-type': 'application/json' } }
    );
  });
  const service = new GeminiService();
  assert.equal(await service.translate('How was your day?', 'pt'), 'Como foi seu dia?');
  assert.equal(await service.cleanTranscript('helo how ar yu', 'en'), 'Hello, how are you?');
  assert.match(JSON.stringify(requests[0]), /Traduza/);
  assert.match(JSON.stringify(requests[1]), /transcrições de voz/);
});
