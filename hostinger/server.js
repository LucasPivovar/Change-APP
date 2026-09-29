const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

loadEnv(path.join(__dirname, '.env'));

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.resolve(__dirname, process.env.DATA_FILE || './data/db.json');
const MAX_BODY = 1024 * 1024;

const languageNames = { en: 'inglês', es: 'espanhol', fr: 'francês', pt: 'português' };
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function emptyDb() {
  return { users: [], sessions: [], chats: [], turns: [], friendships: [], friendConversations: [], friendMessages: [] };
}
function ensureDb() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(emptyDb(), null, 2));
}
function readDb() {
  ensureDb();
  try { return { ...emptyDb(), ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) }; }
  catch { return emptyDb(); }
}
function writeDb(db) {
  ensureDb();
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}
function id() { return crypto.randomUUID(); }
function now() { return new Date().toISOString(); }
function token() { return crypto.randomBytes(32).toString('hex'); }
function normalizeUsername(value) { return String(value || '').trim().replace(/^@+/, '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 24); }
function firstName(name) { return String(name || '').trim().split(/\s+/)[0] || ''; }
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(String(password), salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), test);
}
function publicUser(user) {
  return user && { id: user.id, name: user.name, username: user.username, email: user.email, avatarUrl: user.avatarUrl || '', defaultLanguage: user.defaultLanguage || 'pt', createdAt: user.createdAt };
}
function avatarUser(user) {
  return user && { id: user.id, name: user.name, username: user.username, avatarUrl: user.avatarUrl || '', defaultLanguage: user.defaultLanguage || 'pt' };
}
function requireAuth(req, db) {
  const header = req.headers.authorization || '';
  const value = header.startsWith('Bearer ') ? header.slice(7) : '';
  const session = db.sessions.find((item) => item.token === value);
  if (!session) throw httpError(401, 'Entre na conta para continuar.');
  return { session, owner: session.userId || session.id, user: session.userId ? db.users.find((u) => u.id === session.userId) : null };
}
function httpError(status, message) { const err = new Error(message); err.status = status; return err; }
function validateText(value, name, min = 1, max = 4000) {
  const text = String(value || '').trim();
  if (text.length < min || text.length > max) throw httpError(400, `${name} inválido.`);
  return text;
}
function parseUrl(req) { return new URL(req.url, `http://${req.headers.host || 'localhost'}`); }
function send(res, status, data) {
  if (status === 204) { res.writeHead(204); res.end(); return; }
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}
async function body(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw httpError(413, 'Requisição muito grande.');
  }
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { throw httpError(400, 'JSON inválido.'); }
}
function chatMessages(turn, translation = '') {
  return [
    { id: `${turn.id}:user`, role: 'user', content: turn.userText, createdAt: turn.createdAt },
    { id: `${turn.id}:assistant`, role: 'assistant', content: turn.assistantText, translation, createdAt: turn.createdAt },
  ];
}
function chatDto(chat) {
  return { id: chat.id, title: chat.title, language: chat.language, courseId: chat.courseId, audience: chat.audience, createdAt: chat.createdAt, updatedAt: chat.updatedAt };
}
function instructionsFor(profile) {
  const language = languageNames[profile.language] || profile.language || 'inglês';
  const defaultLanguage = languageNames[profile.defaultLanguage || 'pt'] || 'português';
  const nameLine = profile.firstName ? `Chame o aluno pelo primeiro nome, ${profile.firstName}, de forma natural e sem repetir em toda mensagem.` : 'Use o primeiro nome do aluno se souber.';
  return `Você é o Camaleão IA da Change Skills, um amigo-professor de idiomas. Idioma de prática: ${language}. Idioma principal para explicar: ${defaultLanguage}. ${nameLine}
Aja como uma pessoa amigável, natural e presente. Se o aluno perguntar como foi seu dia, responda de forma social, sem dizer que é IA ou que não tem dias.
Não use Markdown, asteriscos, títulos, listas nem emoji. Não coloque palavras em negrito.
Mantenha prática real do idioma. Entenda português e o idioma de prática. Se o aluno usar português por falta de vocabulário, ofereça uma forma natural no idioma de prática e continue a conversa.
Se o aluno disser “eu gosto de estudar”, diga algo como “Você pode dizer: I like studying. That's great. What subject do you like?”
Use frases curtas para crianças e ajuste o nível pela conversa. Corrija com gentileza apenas quando for útil. Não invente dados externos.`;
}
function cleanVisibleText(text) { return String(text || '').replace(/\*\*([^*\n]+)\*\*/g, '$1').replace(/\*([^*\n]+)\*/g, '$1').trim(); }
function formatChatInput(input) { return input.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })).filter((m) => m.content); }
async function generateAi(systemText, input, maxTokens = 2000) {
  const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase();
  if (provider === 'gemini') return generateGemini(systemText, input, maxTokens);
  return generateGroq(systemText, input, maxTokens);
}
async function generateGroq(systemText, input, maxTokens) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw httpError(503, 'Configure GROQ_API_KEY no servidor.');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b', messages: [{ role: 'system', content: systemText }, ...formatChatInput(input)], max_completion_tokens: maxTokens, temperature: 0.7 }),
  });
  if (!response.ok) throw httpError(response.status === 429 ? 503 : 502, 'Não foi possível obter a resposta da IA.');
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw httpError(502, 'A IA não concluiu a resposta.');
  return cleanVisibleText(text);
}
async function generateGemini(systemText, input, maxTokens) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw httpError(503, 'Configure GEMINI_API_KEY no servidor.');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const contents = input.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })).filter((m) => m.parts[0].text);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system_instruction: { parts: [{ text: systemText }] }, contents, generationConfig: { maxOutputTokens: maxTokens } }),
  });
  if (!response.ok) throw httpError(response.status === 429 ? 503 : 502, 'Não foi possível obter a resposta da IA.');
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw httpError(502, 'A IA não concluiu a resposta.');
  return cleanVisibleText(text);
}
async function translate(text, lang) {
  try { return await generateAi(`Traduza para ${languageNames[lang] || 'português'}. Responda apenas com a tradução.`, [{ role: 'user', content: text }], 800); }
  catch { return ''; }
}
function profileStats(db, userId) {
  const turns = db.turns.filter((t) => db.chats.some((c) => c.id === t.chatId && c.ownerId === userId));
  const days = new Set(turns.map((t) => t.createdAt.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toISOString().slice(0, 10))) { streak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  const friends = db.friendships.filter((f) => f.status === 'accepted' && (f.requesterId === userId || f.addresseeId === userId)).length;
  return { streakDays: streak, friends, practicedSeconds: turns.length * 60, messageCount: turns.length };
}
function friendStreak(db, userId, friendId) {
  const conv = findFriendConversation(db, userId, friendId);
  const messages = conv ? db.friendMessages.filter((m) => m.conversationId === conv.id) : [];
  const byDay = new Map();
  for (const msg of messages) {
    const day = msg.createdAt.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, new Set());
    byDay.get(day).add(msg.senderId);
  }
  const valid = new Set([...byDay.entries()].filter(([, senders]) => senders.has(userId) && senders.has(friendId)).map(([day]) => day));
  let streak = 0;
  const cursor = new Date();
  while (valid.has(cursor.toISOString().slice(0, 10))) { streak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  return { streakDays: streak, messageCount: messages.length, lastMessageAt: messages.at(-1)?.createdAt || null };
}
function friendshipBetween(db, a, b) { return db.friendships.find((f) => (f.requesterId === a && f.addresseeId === b) || (f.requesterId === b && f.addresseeId === a)); }
function findFriendConversation(db, a, b) { return db.friendConversations.find((c) => (c.userAId === a && c.userBId === b) || (c.userAId === b && c.userBId === a)); }
function sortedPair(a, b) { return a < b ? [a, b] : [b, a]; }

async function api(req, res) {
  const url = parseUrl(req);
  const route = url.pathname.replace(/^\/api/, '') || '/';
  const method = req.method;
  const db = readDb();

  if (method === 'GET' && route === '/health') return send(res, 200, { status: 'ok' });
  if (method === 'POST' && route === '/sessions') {
    const session = { id: id(), token: token(), userId: null, createdAt: now() };
    db.sessions.push(session); writeDb(db); return send(res, 201, { token: session.token });
  }
  if (method === 'POST' && route === '/auth/register') {
    const data = await body(req);
    const name = validateText(data.name, 'Nome', 2, 120);
    const username = normalizeUsername(validateText(data.username, 'Nome de usuário', 3, 24));
    const email = validateText(data.email, 'Email', 5, 180).toLowerCase();
    const password = validateText(data.password, 'Senha', 6, 200);
    if (db.users.some((u) => u.email === email)) throw httpError(409, 'Este email já está cadastrado.');
    if (db.users.some((u) => u.username === username)) throw httpError(409, 'Este nome de usuário já está em uso.');
    const user = { id: id(), name, username, email, passwordHash: hashPassword(password), avatarUrl: '', defaultLanguage: 'pt', createdAt: now() };
    const session = { id: id(), token: token(), userId: user.id, createdAt: now() };
    db.users.push(user); db.sessions.push(session); writeDb(db); return send(res, 201, { token: session.token, user: publicUser(user) });
  }
  if (method === 'POST' && route === '/auth/login') {
    const data = await body(req);
    const login = validateText(data.email, 'Login', 1, 180).toLowerCase().replace(/^@+/, '');
    const password = validateText(data.password, 'Senha', 1, 200);
    const user = db.users.find((u) => u.email === login || u.username === login);
    if (!user || !verifyPassword(password, user.passwordHash)) throw httpError(401, 'Credenciais inválidas.');
    const session = { id: id(), token: token(), userId: user.id, createdAt: now() };
    db.sessions.push(session); writeDb(db); return send(res, 200, { token: session.token, user: publicUser(user) });
  }

  const auth = requireAuth(req, db);

  if (route === '/profile' && method === 'GET') return send(res, 200, { user: publicUser(auth.user), stats: auth.user ? profileStats(db, auth.user.id) : { streakDays: 0, friends: 0, practicedSeconds: 0, messageCount: 0 } });
  if (route === '/profile' && method === 'PATCH') {
    if (!auth.user) throw httpError(401, 'Entre na conta para editar o perfil.');
    const data = await body(req);
    if (data.name !== undefined) auth.user.name = validateText(data.name, 'Nome', 2, 120);
    if (data.username !== undefined) {
      const username = normalizeUsername(validateText(data.username, 'Nome de usuário', 3, 24));
      if (db.users.some((u) => u.id !== auth.user.id && u.username === username)) throw httpError(409, 'Este nome de usuário já está em uso.');
      auth.user.username = username;
    }
    if (data.avatarUrl !== undefined) auth.user.avatarUrl = String(data.avatarUrl || '').slice(0, 200000);
    if (data.defaultLanguage !== undefined) auth.user.defaultLanguage = ['pt', 'en', 'es', 'fr'].includes(data.defaultLanguage) ? data.defaultLanguage : auth.user.defaultLanguage;
    writeDb(db); return send(res, 200, { user: publicUser(auth.user), stats: profileStats(db, auth.user.id) });
  }

  if (route === '/chats/speech/clean' && method === 'POST') {
    const data = await body(req);
    const text = validateText(data.text, 'Texto', 1, 4000);
    const lang = data.defaultLanguage || auth.user?.defaultLanguage || 'pt';
    const cleaned = await generateAi(`Corrija apenas erros óbvios de transcrição. Idioma principal: ${languageNames[lang] || 'português'}. Responda apenas com a frase final.`, [{ role: 'user', content: text }], 300).catch(() => text);
    return send(res, 200, { text: cleaned });
  }
  if (route === '/chats' && method === 'POST') {
    const data = await body(req);
    const item = { id: id(), ownerId: auth.owner, title: data.title || 'Nova conversa', language: data.language || 'en', courseId: data.courseId || 'general', audience: data.audience || 'general', createdAt: now(), updatedAt: now() };
    db.chats.push(item); writeDb(db); return send(res, 201, chatDto(item));
  }
  if (route === '/chats' && method === 'GET') {
    const limit = Math.min(Number(url.searchParams.get('limit') || 30), 100);
    const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0);
    const items = db.chats.filter((c) => c.ownerId === auth.owner).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return send(res, 200, { items: items.slice(offset, offset + limit).map(chatDto), total: items.length, limit, offset });
  }
  let match = route.match(/^\/chats\/([^/]+)$/);
  if (match) {
    const chat = db.chats.find((c) => c.id === match[1] && c.ownerId === auth.owner);
    if (!chat) throw httpError(404, 'Conversa não encontrada.');
    if (method === 'GET') return send(res, 200, chatDto(chat));
    if (method === 'PATCH') { const data = await body(req); chat.title = validateText(data.title, 'Título', 1, 120); chat.updatedAt = now(); writeDb(db); return send(res, 200, chatDto(chat)); }
    if (method === 'DELETE') { db.chats = db.chats.filter((c) => c.id !== chat.id); db.turns = db.turns.filter((t) => t.chatId !== chat.id); writeDb(db); return send(res, 204); }
  }
  match = route.match(/^\/chats\/([^/]+)\/messages$/);
  if (match) {
    const chat = db.chats.find((c) => c.id === match[1] && c.ownerId === auth.owner);
    if (!chat) throw httpError(404, 'Conversa não encontrada.');
    if (method === 'GET') {
      const limit = Math.min(Number(url.searchParams.get('limit') || 100), 100);
      const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0);
      const turns = db.turns.filter((t) => t.chatId === chat.id).sort((a, b) => a.sequence - b.sequence);
      return send(res, 200, { items: turns.slice(offset, offset + limit).flatMap((t) => chatMessages(t)), total: turns.length, limit, offset });
    }
    if (method === 'POST') {
      const data = await body(req);
      const content = validateText(data.content, 'Mensagem', 1, 4000);
      const requestId = validateText(data.requestId, 'requestId', 1, 100);
      const saved = db.turns.find((t) => t.chatId === chat.id && t.requestId === requestId);
      if (saved) return send(res, 200, { messages: chatMessages(saved) });
      const turns = db.turns.filter((t) => t.chatId === chat.id).sort((a, b) => a.sequence - b.sequence);
      const context = turns.flatMap((t) => [{ role: 'user', content: t.userText }, { role: 'assistant', content: t.assistantText }]);
      context.push({ role: 'user', content });
      const profile = { language: chat.language, courseId: chat.courseId, audience: chat.audience, firstName: firstName(auth.user?.name), defaultLanguage: auth.user?.defaultLanguage || 'pt' };
      const assistantText = await generateAi(instructionsFor(profile), context, 2000);
      const translation = data.translate ? await translate(assistantText, profile.defaultLanguage) : '';
      const turn = { id: id(), chatId: chat.id, requestId, sequence: turns.length + 1, userText: content, assistantText, createdAt: now() };
      db.turns.push(turn); chat.updatedAt = turn.createdAt; if (turns.length === 0 && chat.title === 'Nova conversa') chat.title = content.slice(0, 80);
      writeDb(db); return send(res, 200, { messages: chatMessages(turn, translation) });
    }
  }

  if (route === '/friends/search' && method === 'GET') {
    if (!auth.user) throw httpError(401, 'Entre na conta para usar amigos.');
    const q = normalizeUsername(url.searchParams.get('q') || '').toLowerCase();
    const items = q ? db.users.filter((u) => u.id !== auth.user.id && (u.username.includes(q) || u.name.toLowerCase().includes(q))).slice(0, 20).map((u) => {
      const rel = friendshipBetween(db, auth.user.id, u.id);
      return { ...avatarUser(u), isFriend: rel?.status === 'accepted', requestSent: rel?.status === 'pending' && rel.requesterId === auth.user.id, requestReceived: rel?.status === 'pending' && rel.addresseeId === auth.user.id };
    }) : [];
    return send(res, 200, { items });
  }
  if (route === '/friends' && method === 'GET') {
    if (!auth.user) throw httpError(401, 'Entre na conta para usar amigos.');
    const items = db.friendships.filter((f) => f.status === 'accepted' && (f.requesterId === auth.user.id || f.addresseeId === auth.user.id)).map((f) => {
      const friendId = f.requesterId === auth.user.id ? f.addresseeId : f.requesterId;
      const friend = db.users.find((u) => u.id === friendId);
      return { ...avatarUser(friend), ...friendStreak(db, auth.user.id, friendId) };
    }).filter(Boolean);
    return send(res, 200, { items });
  }
  if (route === '/friends' && method === 'POST') {
    if (!auth.user) throw httpError(401, 'Entre na conta para usar amigos.');
    const data = await body(req);
    const username = normalizeUsername(data.username);
    const friend = db.users.find((u) => u.username === username);
    if (!friend) throw httpError(404, 'Usuário não encontrado.');
    if (friend.id === auth.user.id) throw httpError(409, 'Você não pode adicionar a si mesmo.');
    let rel = friendshipBetween(db, auth.user.id, friend.id);
    if (rel?.status === 'pending' && rel.addresseeId === auth.user.id) rel.status = 'accepted';
    else if (!rel) { rel = { id: id(), requesterId: auth.user.id, addresseeId: friend.id, status: 'pending', createdAt: now() }; db.friendships.push(rel); }
    writeDb(db); return send(res, 200, { friend: { ...avatarUser(friend), isFriend: rel.status === 'accepted', requestSent: rel.status === 'pending' && rel.requesterId === auth.user.id } });
  }
  if (route === '/friends/requests' && method === 'GET') {
    if (!auth.user) throw httpError(401, 'Entre na conta para usar amigos.');
    const incoming = db.friendships.filter((f) => f.status === 'pending' && f.addresseeId === auth.user.id).map((f) => ({ requestId: f.id, createdAt: f.createdAt, ...avatarUser(db.users.find((u) => u.id === f.requesterId)) }));
    const outgoing = db.friendships.filter((f) => f.status === 'pending' && f.requesterId === auth.user.id).map((f) => ({ requestId: f.id, createdAt: f.createdAt, ...avatarUser(db.users.find((u) => u.id === f.addresseeId)) }));
    return send(res, 200, { incoming, outgoing });
  }
  match = route.match(/^\/friends\/requests\/([^/]+)\/accept$/);
  if (match && method === 'POST') {
    if (!auth.user) throw httpError(401, 'Entre na conta para usar amigos.');
    const rel = db.friendships.find((f) => f.id === match[1] && f.addresseeId === auth.user.id && f.status === 'pending');
    if (!rel) throw httpError(404, 'Pedido de amizade não encontrado.');
    rel.status = 'accepted'; writeDb(db); return send(res, 200, { friend: avatarUser(db.users.find((u) => u.id === rel.requesterId)) });
  }
  match = route.match(/^\/friends\/([^/]+)\/conversation$/);
  if (match && method === 'POST') {
    if (!auth.user) throw httpError(401, 'Entre na conta para usar amigos.');
    const friend = db.users.find((u) => u.id === match[1]);
    if (!friend) throw httpError(404, 'Amigo não encontrado.');
    const rel = friendshipBetween(db, auth.user.id, friend.id);
    if (rel?.status !== 'accepted') throw httpError(404, 'Adicione esta pessoa antes de conversar.');
    let conv = findFriendConversation(db, auth.user.id, friend.id);
    if (!conv) { const [a, b] = sortedPair(auth.user.id, friend.id); conv = { id: id(), userAId: a, userBId: b, createdAt: now(), updatedAt: now() }; db.friendConversations.push(conv); writeDb(db); }
    return send(res, 200, { id: conv.id, friend: avatarUser(friend), updatedAt: conv.updatedAt, ...friendStreak(db, auth.user.id, friend.id) });
  }
  if (route === '/friends/conversations' && method === 'GET') {
    if (!auth.user) throw httpError(401, 'Entre na conta para usar amigos.');
    const items = db.friendConversations.filter((c) => c.userAId === auth.user.id || c.userBId === auth.user.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((c) => {
      const friendId = c.userAId === auth.user.id ? c.userBId : c.userAId;
      const friend = db.users.find((u) => u.id === friendId);
      return { id: c.id, updatedAt: c.updatedAt, friend: avatarUser(friend), ...friendStreak(db, auth.user.id, friendId) };
    });
    return send(res, 200, { items });
  }
  match = route.match(/^\/friends\/conversations\/([^/]+)\/messages$/);
  if (match) {
    if (!auth.user) throw httpError(401, 'Entre na conta para usar amigos.');
    const conv = db.friendConversations.find((c) => c.id === match[1] && (c.userAId === auth.user.id || c.userBId === auth.user.id));
    if (!conv) throw httpError(404, 'Conversa não encontrada.');
    if (method === 'GET') return send(res, 200, { items: db.friendMessages.filter((m) => m.conversationId === conv.id).sort((a, b) => a.sequence - b.sequence).map((m) => ({ id: m.id, senderId: m.senderId, content: m.content, createdAt: m.createdAt })) });
    if (method === 'POST') {
      const data = await body(req); const content = validateText(data.content, 'Mensagem', 1, 4000);
      const sequence = db.friendMessages.filter((m) => m.conversationId === conv.id).length + 1;
      const msg = { id: id(), conversationId: conv.id, senderId: auth.user.id, content, sequence, createdAt: now() };
      db.friendMessages.push(msg); conv.updatedAt = msg.createdAt; writeDb(db);
      return send(res, 200, { message: { id: msg.id, senderId: msg.senderId, content: msg.content, createdAt: msg.createdAt } });
    }
  }
  throw httpError(404, 'Rota não encontrada.');
}

function staticFile(req, res) {
  const url = parseUrl(req);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.includes('\0')) return send404(res);
  let file = path.join(PUBLIC_DIR, pathname);
  if (!file.startsWith(PUBLIC_DIR)) return send404(res);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) file = path.join(PUBLIC_DIR, 'index.html');
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}
function send404(res) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); }

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api')) return await api(req, res);
    return staticFile(req, res);
  } catch (error) {
    const status = error.status || 500;
    send(res, status, { message: error.message || 'Erro interno.' });
  }
});
server.listen(PORT, HOST, () => console.log(`Change APP rodando em http://${HOST}:${PORT}`));
