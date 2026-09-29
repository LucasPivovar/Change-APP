const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

loadEnv(path.join(__dirname, '.env'));

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3001);
const MAX_BODY = 1024 * 1024;
const languageNames = { en: 'inglês', es: 'espanhol', fr: 'francês', pt: 'português' };
let pool;

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
function id() { return crypto.randomUUID(); }
function now() { return new Date().toISOString(); }
function token() { return crypto.randomBytes(32).toString('hex'); }
function normalizeUsername(value) { return String(value || '').trim().replace(/^@+/, '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 24); }
function firstName(name) { return String(name || '').trim().split(/\s+/)[0] || ''; }
function hashPassword(password) { const salt = crypto.randomBytes(16).toString('hex'); const hash = crypto.scryptSync(String(password), salt, 64).toString('hex'); return `${salt}:${hash}`; }
function verifyPassword(password, stored) { const [salt, hash] = String(stored || '').split(':'); if (!salt || !hash) return false; const test = crypto.scryptSync(String(password), salt, 64); return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), test); }
function httpError(status, message) { const err = new Error(message); err.status = status; return err; }
function send(res, status, data) { if (status === 204) { res.writeHead(204); res.end(); return; } res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); }
function parseUrl(req) { return new URL(req.url, `http://${req.headers.host || 'localhost'}`); }
function validateText(value, name, min = 1, max = 4000) { const text = String(value || '').trim(); if (text.length < min || text.length > max) throw httpError(400, `${name} inválido.`); return text; }
async function body(req) { let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > MAX_BODY) throw httpError(413, 'Requisição muito grande.'); } if (!raw) return {}; try { return JSON.parse(raw); } catch { throw httpError(400, 'JSON inválido.'); } }
function publicUser(u) { return u && { id: u.id, name: u.name, username: u.username, email: u.email, avatarUrl: u.avatar_url || u.avatarUrl || '', defaultLanguage: u.default_language || u.defaultLanguage || 'pt', createdAt: u.created_at || u.createdAt }; }
function friendUser(u) { return u && { id: u.id, name: u.name, username: u.username, avatarUrl: u.avatar_url || '', defaultLanguage: u.default_language || 'pt' }; }

async function init() {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
  });
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id VARCHAR(36) PRIMARY KEY, name VARCHAR(120) NOT NULL, username VARCHAR(24) NOT NULL UNIQUE, email VARCHAR(180) NOT NULL UNIQUE, password_hash VARCHAR(220) NOT NULL, avatar_url MEDIUMTEXT NULL, default_language VARCHAR(8) NOT NULL DEFAULT 'pt', created_at VARCHAR(40) NOT NULL) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS sessions (id VARCHAR(36) PRIMARY KEY, token VARCHAR(80) NOT NULL UNIQUE, user_id VARCHAR(36) NULL, created_at VARCHAR(40) NOT NULL, INDEX(token), INDEX(user_id)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS chats (id VARCHAR(36) PRIMARY KEY, owner_id VARCHAR(36) NOT NULL, title VARCHAR(120) NOT NULL, language VARCHAR(8) NOT NULL, course_id VARCHAR(80) NOT NULL, audience VARCHAR(40) NOT NULL, created_at VARCHAR(40) NOT NULL, updated_at VARCHAR(40) NOT NULL, INDEX(owner_id), INDEX(updated_at)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS turns (id VARCHAR(36) PRIMARY KEY, chat_id VARCHAR(36) NOT NULL, request_id VARCHAR(100) NOT NULL, sequence INT NOT NULL, user_text MEDIUMTEXT NOT NULL, assistant_text MEDIUMTEXT NOT NULL, created_at VARCHAR(40) NOT NULL, UNIQUE KEY chat_request (chat_id, request_id), INDEX(chat_id, sequence)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS friendships (id VARCHAR(36) PRIMARY KEY, requester_id VARCHAR(36) NOT NULL, addressee_id VARCHAR(36) NOT NULL, status VARCHAR(20) NOT NULL, created_at VARCHAR(40) NOT NULL, UNIQUE KEY pair_unique (requester_id, addressee_id), INDEX(addressee_id), INDEX(status)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS friend_conversations (id VARCHAR(36) PRIMARY KEY, user_a_id VARCHAR(36) NOT NULL, user_b_id VARCHAR(36) NOT NULL, created_at VARCHAR(40) NOT NULL, updated_at VARCHAR(40) NOT NULL, UNIQUE KEY pair_unique (user_a_id, user_b_id), INDEX(updated_at)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS friend_messages (id VARCHAR(36) PRIMARY KEY, conversation_id VARCHAR(36) NOT NULL, sender_id VARCHAR(36) NOT NULL, content MEDIUMTEXT NOT NULL, sequence INT NOT NULL, created_at VARCHAR(40) NOT NULL, INDEX(conversation_id, sequence)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
}
async function one(sql, params = []) { const [rows] = await pool.query(sql, params); return rows[0] || null; }
async function all(sql, params = []) { const [rows] = await pool.query(sql, params); return rows; }
async function exec(sql, params = []) { const [result] = await pool.query(sql, params); return result; }
async function auth(req) {
  const header = req.headers.authorization || '';
  const value = header.startsWith('Bearer ') ? header.slice(7) : '';
  const session = await one('SELECT * FROM sessions WHERE token = ?', [value]);
  if (!session) throw httpError(401, 'Entre na conta para continuar.');
  const user = session.user_id ? await one('SELECT * FROM users WHERE id = ?', [session.user_id]) : null;
  return { session, user, owner: session.user_id || session.id };
}
function instructionsFor(profile) {
  const language = languageNames[profile.language] || profile.language || 'inglês';
  const defaultLanguage = languageNames[profile.defaultLanguage || 'pt'] || 'português';
  return `Você é o Camaleão IA da Change Skills, um amigo-professor de idiomas. Idioma de prática: ${language}. Idioma principal para explicar: ${defaultLanguage}. ${profile.firstName ? `Chame o aluno pelo primeiro nome, ${profile.firstName}, de forma natural.` : ''}
Aja como uma pessoa amigável. Se o aluno perguntar como foi seu dia, responda socialmente, sem dizer que é IA. Não use Markdown, asteriscos, títulos, listas nem emoji. Entenda português e o idioma de prática. Se o aluno usar português por falta de vocabulário, ofereça uma forma natural no idioma de prática e continue. Corrija com gentileza só quando for útil.`;
}
function cleanText(text) { return String(text || '').replace(/\*\*([^*\n]+)\*\*/g, '$1').replace(/\*([^*\n]+)\*/g, '$1').trim(); }
async function generateAi(systemText, input, maxTokens = 2000) { return (process.env.AI_PROVIDER || 'groq').toLowerCase() === 'gemini' ? generateGemini(systemText, input, maxTokens) : generateGroq(systemText, input, maxTokens); }
async function generateGroq(systemText, input, maxTokens) {
  if (!process.env.GROQ_API_KEY) throw httpError(503, 'Configure GROQ_API_KEY no servidor.');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, body: JSON.stringify({ model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b', messages: [{ role: 'system', content: systemText }, ...input.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))], max_completion_tokens: maxTokens, temperature: 0.7 }) });
  if (!response.ok) throw httpError(response.status === 429 ? 503 : 502, 'Não foi possível obter a resposta da IA.');
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw httpError(502, 'A IA não concluiu a resposta.');
  return cleanText(text);
}
async function generateGemini(systemText, input, maxTokens) {
  if (!process.env.GEMINI_API_KEY) throw httpError(503, 'Configure GEMINI_API_KEY no servidor.');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const contents = input.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_instruction: { parts: [{ text: systemText }] }, contents, generationConfig: { maxOutputTokens: maxTokens } }) });
  if (!response.ok) throw httpError(response.status === 429 ? 503 : 502, 'Não foi possível obter a resposta da IA.');
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw httpError(502, 'A IA não concluiu a resposta.');
  return cleanText(text);
}
async function translate(text, lang) { try { return await generateAi(`Traduza para ${languageNames[lang] || 'português'}. Responda apenas com a tradução.`, [{ role: 'user', content: text }], 800); } catch { return ''; } }
function chatMessages(t, translation = '') { return [{ id: `${t.id}:user`, role: 'user', content: t.user_text, createdAt: t.created_at }, { id: `${t.id}:assistant`, role: 'assistant', content: t.assistant_text, translation, createdAt: t.created_at }]; }
function chatDto(c) { return { id: c.id, title: c.title, language: c.language, courseId: c.course_id, audience: c.audience, createdAt: c.created_at, updatedAt: c.updated_at }; }
async function profileStats(userId) {
  const turns = await all('SELECT t.created_at FROM turns t JOIN chats c ON c.id = t.chat_id WHERE c.owner_id = ?', [userId]);
  const days = new Set(turns.map(t => t.created_at.slice(0, 10))); let streak = 0; const cursor = new Date(); while (days.has(cursor.toISOString().slice(0,10))) { streak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  const f = await one('SELECT COUNT(*) total FROM friendships WHERE status = ? AND (requester_id = ? OR addressee_id = ?)', ['accepted', userId, userId]);
  return { streakDays: streak, friends: Number(f.total || 0), practicedSeconds: turns.length * 60, messageCount: turns.length };
}
async function friendship(a,b){ return one('SELECT * FROM friendships WHERE (requester_id=? AND addressee_id=?) OR (requester_id=? AND addressee_id=?)',[a,b,b,a]); }
function pair(a,b){ return a < b ? [a,b] : [b,a]; }
async function friendStreak(userId, friendId){
  const conv = await one('SELECT * FROM friend_conversations WHERE (user_a_id=? AND user_b_id=?) OR (user_a_id=? AND user_b_id=?)',[userId,friendId,friendId,userId]);
  if(!conv) return { streakDays:0, messageCount:0, lastMessageAt:null };
  const msgs = await all('SELECT sender_id, created_at FROM friend_messages WHERE conversation_id=? ORDER BY sequence ASC',[conv.id]);
  const byDay = new Map(); for(const m of msgs){ const d=m.created_at.slice(0,10); if(!byDay.has(d)) byDay.set(d,new Set()); byDay.get(d).add(m.sender_id); }
  const valid = new Set([...byDay.entries()].filter(([,s])=>s.has(userId)&&s.has(friendId)).map(([d])=>d)); let streak=0; const cursor=new Date(); while(valid.has(cursor.toISOString().slice(0,10))){ streak++; cursor.setUTCDate(cursor.getUTCDate()-1); }
  return { streakDays: streak, messageCount: msgs.length, lastMessageAt: msgs.at(-1)?.created_at || null };
}

async function api(req, res) {
  const url = parseUrl(req); const route = url.pathname.replace(/^\/api/, '') || '/'; const method = req.method;
  if (method === 'GET' && route === '/health') return send(res, 200, { status: 'ok' });
  if (method === 'POST' && route === '/sessions') { const s = { id:id(), token:token(), created_at:now() }; await exec('INSERT INTO sessions (id, token, user_id, created_at) VALUES (?, ?, NULL, ?)', [s.id,s.token,s.created_at]); return send(res,201,{token:s.token}); }
  if (method === 'POST' && route === '/auth/register') { const data=await body(req); const name=validateText(data.name,'Nome',2,120); const username=normalizeUsername(validateText(data.username,'Nome de usuário',3,24)); const email=validateText(data.email,'Email',5,180).toLowerCase(); const password=validateText(data.password,'Senha',6,200); if(await one('SELECT id FROM users WHERE email=? OR username=?',[email,username])) throw httpError(409,'Email ou nome de usuário já está em uso.'); const user={id:id(),name,username,email,passwordHash:hashPassword(password),createdAt:now()}; await exec('INSERT INTO users (id,name,username,email,password_hash,avatar_url,default_language,created_at) VALUES (?,?,?,?,?,?,?,?)',[user.id,name,username,email,user.passwordHash,'','pt',user.createdAt]); const s={id:id(),token:token(),createdAt:now()}; await exec('INSERT INTO sessions (id,token,user_id,created_at) VALUES (?,?,?,?)',[s.id,s.token,user.id,s.createdAt]); return send(res,201,{token:s.token,user:publicUser({...user,password_hash:user.passwordHash,avatar_url:'',default_language:'pt',created_at:user.createdAt})}); }
  if (method === 'POST' && route === '/auth/login') { const data=await body(req); const login=validateText(data.email,'Login',1,180).toLowerCase().replace(/^@+/,''); const pass=validateText(data.password,'Senha',1,200); const user=await one('SELECT * FROM users WHERE email=? OR username=?',[login,login]); if(!user || !verifyPassword(pass,user.password_hash)) throw httpError(401,'Credenciais inválidas.'); const s={id:id(),token:token(),createdAt:now()}; await exec('INSERT INTO sessions (id,token,user_id,created_at) VALUES (?,?,?,?)',[s.id,s.token,user.id,s.createdAt]); return send(res,200,{token:s.token,user:publicUser(user)}); }
  const a = await auth(req);
  if (route === '/profile' && method === 'GET') return send(res,200,{user:publicUser(a.user),stats:a.user?await profileStats(a.user.id):{streakDays:0,friends:0,practicedSeconds:0,messageCount:0}});
  if (route === '/profile' && method === 'PATCH') { if(!a.user) throw httpError(401,'Entre na conta.'); const d=await body(req); const fields=[]; const params=[]; if(d.name!==undefined){fields.push('name=?');params.push(validateText(d.name,'Nome',2,120));} if(d.username!==undefined){const u=normalizeUsername(validateText(d.username,'Nome de usuário',3,24)); const exists=await one('SELECT id FROM users WHERE username=? AND id<>?',[u,a.user.id]); if(exists) throw httpError(409,'Este nome de usuário já está em uso.'); fields.push('username=?');params.push(u);} if(d.avatarUrl!==undefined){fields.push('avatar_url=?');params.push(String(d.avatarUrl||''));} if(d.defaultLanguage!==undefined && ['pt','en','es','fr'].includes(d.defaultLanguage)){fields.push('default_language=?');params.push(d.defaultLanguage);} if(fields.length) await exec(`UPDATE users SET ${fields.join(', ')} WHERE id=?`,[...params,a.user.id]); const user=await one('SELECT * FROM users WHERE id=?',[a.user.id]); return send(res,200,{user:publicUser(user),stats:await profileStats(a.user.id)}); }
  if (route === '/chats/speech/clean' && method === 'POST') { const d=await body(req); const text=validateText(d.text,'Texto',1,4000); const cleaned=await generateAi(`Corrija apenas erros óbvios de transcrição. Responda apenas com a frase final.`,[{role:'user',content:text}],300).catch(()=>text); return send(res,200,{text:cleaned}); }
  if (route === '/chats' && method === 'POST') { const d=await body(req); const c={id:id(),owner:a.owner,title:d.title||'Nova conversa',language:d.language||'en',courseId:d.courseId||'general',audience:d.audience||'general',createdAt:now(),updatedAt:now()}; await exec('INSERT INTO chats (id,owner_id,title,language,course_id,audience,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)',[c.id,c.owner,c.title,c.language,c.courseId,c.audience,c.createdAt,c.updatedAt]); return send(res,201,{id:c.id,title:c.title,language:c.language,courseId:c.courseId,audience:c.audience,createdAt:c.createdAt,updatedAt:c.updatedAt}); }
  if (route === '/chats' && method === 'GET') { const limit=Math.min(Number(url.searchParams.get('limit')||30),100); const offset=Math.max(Number(url.searchParams.get('offset')||0),0); const items=await all('SELECT * FROM chats WHERE owner_id=? ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?',[a.owner,limit,offset]); const total=await one('SELECT COUNT(*) total FROM chats WHERE owner_id=?',[a.owner]); return send(res,200,{items:items.map(chatDto),total:Number(total.total||0),limit,offset}); }
  let m = route.match(/^\/chats\/([^/]+)$/); if(m){ const c=await one('SELECT * FROM chats WHERE id=? AND owner_id=?',[m[1],a.owner]); if(!c) throw httpError(404,'Conversa não encontrada.'); if(method==='GET') return send(res,200,chatDto(c)); if(method==='PATCH'){const d=await body(req); await exec('UPDATE chats SET title=?, updated_at=? WHERE id=?',[validateText(d.title,'Título',1,120),now(),c.id]); return send(res,200,chatDto(await one('SELECT * FROM chats WHERE id=?',[c.id])));} if(method==='DELETE'){ await exec('DELETE FROM turns WHERE chat_id=?',[c.id]); await exec('DELETE FROM chats WHERE id=?',[c.id]); return send(res,204); } }
  m = route.match(/^\/chats\/([^/]+)\/messages$/); if(m){ const c=await one('SELECT * FROM chats WHERE id=? AND owner_id=?',[m[1],a.owner]); if(!c) throw httpError(404,'Conversa não encontrada.'); if(method==='GET'){const limit=Math.min(Number(url.searchParams.get('limit')||100),100); const offset=Math.max(Number(url.searchParams.get('offset')||0),0); const turns=await all('SELECT * FROM turns WHERE chat_id=? ORDER BY sequence ASC LIMIT ? OFFSET ?',[c.id,limit,offset]); const total=await one('SELECT COUNT(*) total FROM turns WHERE chat_id=?',[c.id]); return send(res,200,{items:turns.flatMap(t=>chatMessages(t)),total:Number(total.total||0),limit,offset});} if(method==='POST'){const d=await body(req); const content=validateText(d.content,'Mensagem',1,4000); const requestId=validateText(d.requestId,'requestId',1,100); const saved=await one('SELECT * FROM turns WHERE chat_id=? AND request_id=?',[c.id,requestId]); if(saved) return send(res,200,{messages:chatMessages(saved)}); const turns=await all('SELECT * FROM turns WHERE chat_id=? ORDER BY sequence ASC',[c.id]); const context=turns.flatMap(t=>[{role:'user',content:t.user_text},{role:'assistant',content:t.assistant_text}]); context.push({role:'user',content}); const profile={language:c.language,courseId:c.course_id,audience:c.audience,firstName:firstName(a.user?.name),defaultLanguage:a.user?.default_language||'pt'}; const assistantText=await generateAi(instructionsFor(profile),context,2000); const tr=d.translate?await translate(assistantText,profile.defaultLanguage):''; const t={id:id(),createdAt:now(),sequence:turns.length+1}; await exec('INSERT INTO turns (id,chat_id,request_id,sequence,user_text,assistant_text,created_at) VALUES (?,?,?,?,?,?,?)',[t.id,c.id,requestId,t.sequence,content,assistantText,t.createdAt]); await exec('UPDATE chats SET title=?, updated_at=? WHERE id=?',[turns.length===0&&c.title==='Nova conversa'?content.slice(0,80):c.title,t.createdAt,c.id]); return send(res,200,{messages:chatMessages({id:t.id,user_text:content,assistant_text:assistantText,created_at:t.createdAt},tr)});} }
  if (route === '/friends/search' && method === 'GET') { if(!a.user) throw httpError(401,'Entre na conta.'); const q=normalizeUsername(url.searchParams.get('q')||''); const users=q?await all('SELECT * FROM users WHERE id<>? AND (username LIKE ? OR LOWER(name) LIKE ?) ORDER BY name ASC LIMIT 20',[a.user.id,`%${q}%`,`%${q}%`]):[]; const items=[]; for(const u of users){const rel=await friendship(a.user.id,u.id); items.push({...friendUser(u),isFriend:rel?.status==='accepted',requestSent:rel?.status==='pending'&&rel.requester_id===a.user.id,requestReceived:rel?.status==='pending'&&rel.addressee_id===a.user.id});} return send(res,200,{items}); }
  if (route === '/friends' && method === 'GET') { if(!a.user) throw httpError(401,'Entre na conta.'); const rows=await all('SELECT f.*, u.* FROM friendships f JOIN users u ON u.id = IF(f.requester_id=?, f.addressee_id, f.requester_id) WHERE f.status=? AND (f.requester_id=? OR f.addressee_id=?) ORDER BY u.name ASC',[a.user.id,'accepted',a.user.id,a.user.id]); const items=[]; for(const r of rows) items.push({...friendUser(r),...(await friendStreak(a.user.id,r.id))}); return send(res,200,{items}); }
  if (route === '/friends' && method === 'POST') { if(!a.user) throw httpError(401,'Entre na conta.'); const d=await body(req); const username=normalizeUsername(d.username); const friend=await one('SELECT * FROM users WHERE username=?',[username]); if(!friend) throw httpError(404,'Usuário não encontrado.'); if(friend.id===a.user.id) throw httpError(409,'Você não pode adicionar a si mesmo.'); let rel=await friendship(a.user.id,friend.id); if(rel?.status==='pending'&&rel.addressee_id===a.user.id){await exec('UPDATE friendships SET status=? WHERE id=?',['accepted',rel.id]); rel.status='accepted';} else if(!rel){const [r,ad]=[a.user.id,friend.id]; rel={id:id(),requester_id:r,addressee_id:ad,status:'pending'}; await exec('INSERT INTO friendships (id,requester_id,addressee_id,status,created_at) VALUES (?,?,?,?,?)',[rel.id,r,ad,'pending',now()]);} return send(res,200,{friend:{...friendUser(friend),isFriend:rel.status==='accepted',requestSent:rel.status==='pending'&&rel.requester_id===a.user.id}}); }
  if (route === '/friends/requests' && method === 'GET') { if(!a.user) throw httpError(401,'Entre na conta.'); const incoming=(await all('SELECT f.id requestId, f.created_at createdAt, u.* FROM friendships f JOIN users u ON u.id=f.requester_id WHERE f.addressee_id=? AND f.status=? ORDER BY f.created_at DESC',[a.user.id,'pending'])).map(r=>({requestId:r.requestId,createdAt:r.createdAt,...friendUser(r)})); const outgoing=(await all('SELECT f.id requestId, f.created_at createdAt, u.* FROM friendships f JOIN users u ON u.id=f.addressee_id WHERE f.requester_id=? AND f.status=? ORDER BY f.created_at DESC',[a.user.id,'pending'])).map(r=>({requestId:r.requestId,createdAt:r.createdAt,...friendUser(r)})); return send(res,200,{incoming,outgoing}); }
  m=route.match(/^\/friends\/requests\/([^/]+)\/accept$/); if(m&&method==='POST'){ if(!a.user) throw httpError(401,'Entre na conta.'); const rel=await one('SELECT * FROM friendships WHERE id=? AND addressee_id=? AND status=?',[m[1],a.user.id,'pending']); if(!rel) throw httpError(404,'Pedido não encontrado.'); await exec('UPDATE friendships SET status=? WHERE id=?',['accepted',rel.id]); return send(res,200,{friend:friendUser(await one('SELECT * FROM users WHERE id=?',[rel.requester_id]))}); }
  m=route.match(/^\/friends\/([^/]+)\/conversation$/); if(m&&method==='POST'){ if(!a.user) throw httpError(401,'Entre na conta.'); const friend=await one('SELECT * FROM users WHERE id=?',[m[1]]); if(!friend) throw httpError(404,'Amigo não encontrado.'); const rel=await friendship(a.user.id,friend.id); if(rel?.status!=='accepted') throw httpError(404,'Adicione esta pessoa antes de conversar.'); let conv=await one('SELECT * FROM friend_conversations WHERE (user_a_id=? AND user_b_id=?) OR (user_a_id=? AND user_b_id=?)',[a.user.id,friend.id,friend.id,a.user.id]); if(!conv){const [pa,pb]=pair(a.user.id,friend.id); const cid=id(); const n=now(); await exec('INSERT INTO friend_conversations (id,user_a_id,user_b_id,created_at,updated_at) VALUES (?,?,?,?,?)',[cid,pa,pb,n,n]); conv=await one('SELECT * FROM friend_conversations WHERE id=?',[cid]);} return send(res,200,{id:conv.id,friend:friendUser(friend),updatedAt:conv.updated_at,...(await friendStreak(a.user.id,friend.id))}); }
  if(route==='/friends/conversations'&&method==='GET'){ if(!a.user) throw httpError(401,'Entre na conta.'); const convs=await all('SELECT * FROM friend_conversations WHERE user_a_id=? OR user_b_id=? ORDER BY updated_at DESC',[a.user.id,a.user.id]); const items=[]; for(const c of convs){const fid=c.user_a_id===a.user.id?c.user_b_id:c.user_a_id; const f=await one('SELECT * FROM users WHERE id=?',[fid]); items.push({id:c.id,updatedAt:c.updated_at,friend:friendUser(f),...(await friendStreak(a.user.id,fid))});} return send(res,200,{items}); }
  m=route.match(/^\/friends\/conversations\/([^/]+)\/messages$/); if(m){ if(!a.user) throw httpError(401,'Entre na conta.'); const conv=await one('SELECT * FROM friend_conversations WHERE id=? AND (user_a_id=? OR user_b_id=?)',[m[1],a.user.id,a.user.id]); if(!conv) throw httpError(404,'Conversa não encontrada.'); if(method==='GET'){const items=(await all('SELECT * FROM friend_messages WHERE conversation_id=? ORDER BY sequence ASC',[conv.id])).map(x=>({id:x.id,senderId:x.sender_id,content:x.content,createdAt:x.created_at})); return send(res,200,{items});} if(method==='POST'){const d=await body(req); const content=validateText(d.content,'Mensagem',1,4000); const count=await one('SELECT COUNT(*) total FROM friend_messages WHERE conversation_id=?',[conv.id]); const msg={id:id(),seq:Number(count.total||0)+1,createdAt:now()}; await exec('INSERT INTO friend_messages (id,conversation_id,sender_id,content,sequence,created_at) VALUES (?,?,?,?,?,?)',[msg.id,conv.id,a.user.id,content,msg.seq,msg.createdAt]); await exec('UPDATE friend_conversations SET updated_at=? WHERE id=?',[msg.createdAt,conv.id]); return send(res,200,{message:{id:msg.id,senderId:a.user.id,content,createdAt:msg.createdAt}});} }
  throw httpError(404,'Rota não encontrada.');
}
const server = http.createServer(async (req,res)=>{ try { if(!req.url.startsWith('/api')) throw httpError(404,'Rota não encontrada.'); await api(req,res); } catch(e){ send(res,e.status||500,{message:e.message||'Erro interno.'}); } });
init().then(()=>server.listen(PORT,HOST,()=>console.log(`Change server on ${HOST}:${PORT}`))).catch((e)=>{ console.error(e); process.exit(1); });
