'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const learning = require('./learning');
const { promisify } = require('node:util');
const scrypt = promisify(crypto.scrypt);
const ROOT = __dirname;
const DATA = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const FILE = path.join(DATA, 'database.json');
const production = process.env.NODE_ENV === 'production';
const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const id = () => crypto.randomUUID();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const clone = value => structuredClone(value);
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const safeUser = u => ({ id: u.id, role: u.role, schoolId: u.schoolId, userId: u.profileId || u.id, userName: u.name, userEmail: u.email, userPic: u.photo || '' });
const emailOf = value => String(value || '').trim().toLowerCase();
function validatePassword(value) { if (typeof value !== 'string' || value.length < 10 || value.length > 128) fail(400, 'A senha deve ter entre 10 e 128 caracteres.'); }
function validateEmail(value) { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254) fail(400, 'E-mail inválido.'); }
// Validação temporária para campos interpolados pelos templates legados.
function validateLegacy(value, depth = 0) {
  if (depth > 15) fail(400, 'Estrutura muito profunda.');
  if (typeof value === 'string') {
    if (value.length > 2000000 || /[<>"'`\\\u0000-\u0008\u2028\u2029]|&#|&(?:quot|apos|lt|gt);|^\s*(?:javascript|vbscript):/i.test(value)) fail(400, 'Use texto simples, sem HTML, aspas ou caracteres de escape nos campos de cadastro.');
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) fail(400, 'Campo inválido.');
      if (['name', 'title', 'email', 'phone', 'schoolId', 'status', 'domain', 'description', 'statement', 'studentNotes', 'feedback', 'fontFamily'].includes(key) && typeof child !== 'string') fail(400, `O campo ${key} deve ser texto.`);
      if (/^(primaryColor|secondaryColor)$/.test(key) && !/^#[\da-f]{6}$/i.test(child)) fail(400, 'Cor inválida.');
      if (key === 'fontFamily' && !/^[a-zA-Z\s-]{1,60}$/.test(child)) fail(400, 'Fonte inválida.');
      if (/^(url|videoUrl|thumbnail|photo|profilePic|downloadUrl)$/.test(key) && child && child !== '#' && !/^(https?:\/\/|\/api\/files\/)/i.test(child)) fail(400, 'URL inválida.');
      if (key === 'favicon' && /^data:/i.test(child) && !/^data:image\/(png|jpeg|webp|x-icon);base64,[a-z\d+/=]+$/i.test(child)) fail(400, 'Formato de favicon inválido.');
      validateLegacy(child, depth + 1);
    }
  }
}
async function passwordHash(password) { const salt = crypto.randomBytes(16).toString('hex'); return salt + ':' + (await scrypt(password, salt, 64)).toString('hex'); }
async function passwordMatches(password, stored) { if (typeof password !== 'string' || password.length > 128 || typeof stored !== 'string') return false; const [salt, digest] = stored.split(':'); if (!/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{128}$/.test(digest || '')) return false; const actual = await scrypt(password, salt, 64); return crypto.timingSafeEqual(actual, Buffer.from(digest, 'hex')); }
function persist(value) {
  fs.mkdirSync(DATA, { recursive: true });
  const temp = FILE + '.tmp';
  const fd = fs.openSync(temp, 'w', 0o600);
  try { fs.writeFileSync(fd, JSON.stringify(value, null, 2)); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  if (fs.existsSync(FILE)) fs.copyFileSync(FILE, FILE + '.bak');
  fs.renameSync(temp, FILE);
}
const source = fs.readFileSync(path.join(ROOT, 'database.js'), 'utf8');
function legacyContext(initial) {
  let current = clone(initial);
  const context = vm.createContext({ window: {}, console, crypto: { randomUUID: crypto.randomUUID }, localStorage: { getItem: () => JSON.stringify(current), setItem: (_key, value) => { current = JSON.parse(value); } } });
  vm.runInContext(source + '\nthis.seed = DEFAULT_DATABASE; this.DB = PratikaDB;', context, { timeout: 1000 });
  context.DB.getDB = () => current;
  context.DB.saveDB = value => { current = value; };
  return { context, get: () => current };
}
let store;
let queue = Promise.resolve();
function transaction(fn) {
  const work = queue.then(async () => { const draft = clone(store); const result = await fn(draft); persist(draft); store = draft; return result; });
  queue = work.catch(() => {});
  return work;
}
const collections = ['schools', 'students', 'teachers', 'classes', 'lessons', 'materials', 'tasks', 'financial', 'events', 'plans', 'courses'];
function scope(db, user) {
  const out = clone(db);
  if (user.role !== 'admin') {
    for (const key of collections) if (!['plans'].includes(key)) out[key] = (out[key] || []).filter(row => key === 'schools' ? row.id === user.schoolId : row.schoolId === user.schoolId);
    out.adminSettings = {};
    if (user.role === 'aluno') {
      const student = out.students.find(s => s.id === user.profileId);
      out.students = out.students.filter(s => s.id === user.profileId);
      out.financial = out.financial.filter(r => ownsFinancial(db, r, student));
      out.tasks = out.tasks.filter(r => !r.studentId || r.studentId === user.profileId);
      out.courses = out.courses.filter(c => learning.canSeeCourse(c, user));
      for (const course of out.courses) for (const mod of course.modules || []) mod.items = (mod.items || []).filter(learning.published);
      for (const course of out.courses) delete course.studentIds;
      for (const course of out.courses) for (const mod of course.modules || []) for (const item of mod.items || []) {
        item.submissions = (item.submissions || []).filter(s => s.studentId === user.profileId);
        item.completedBy = (item.completedBy || []).filter(s => s === user.profileId);
      }
    } else if (user.role === 'professor') {
      out.financial = [];
      out.courses = out.courses.filter(c => c.teacherId === user.profileId);
    }
  }
  for (const school of out.schools || []) { for (const key of Object.keys(school)) if (/token|password|secret/i.test(key) || ['aluno', 'professor'].includes(user.role) && /smtp/i.test(key)) delete school[key]; }
  if (user.role === 'aluno') {
    const lessons = out.courses.flatMap(c => (c.modules || []).flatMap(m => (m.items || []).filter(i => i.type === 'lesson')));
    const profile = out.students.find(s => s.id === user.profileId);
    if (profile) profile.progress = lessons.length ? Math.round(100 * lessons.filter(i => i.completedBy?.includes(user.profileId)).length / lessons.length) : 0;
    for (const event of out.events || []) event.attendanceConfirmed = (event.attendanceBy || []).includes(user.profileId);
    for (const task of out.tasks || []) {
      const submission = (task.submissions || []).find(s => s.studentId === user.profileId);
      task.submissions = submission ? [submission] : [];
      if (submission) task.status = submission.grade == null ? 'Entregue' : 'Concluído';
    }
  }
  for (const key of ['students', 'teachers']) for (const profile of out[key] || []) { delete profile.password; delete profile.passwordHash; }
  return out;
}
function ownsFinancial(db, record, student) {
  if (!student || record.schoolId !== student.schoolId) return false;
  if (record.studentId) return record.studentId === student.id;
  const matches = db.students.filter(s => s.schoolId === record.schoolId && s.name === record.studentName);
  return matches.length === 1 && matches[0].id === student.id;
}
function assertAccountAccess(data, user) {
  if (!user || user.active === false) fail(401, 'Conta indisponível.');
  if (['aluno', 'professor'].includes(user.role)) {
    const profile = data.db[user.role === 'aluno' ? 'students' : 'teachers'].find(p => p.id === user.profileId);
    if (!profile || profile.schoolId !== user.schoolId || /bloque|inativ/i.test(profile.status || '')) fail(403, 'Acesso bloqueado. Contate a escola.');
  }
  if (user.schoolId && !data.db.schools.some(s => s.id === user.schoolId && !/bloque|inativ/i.test(s.status || ''))) fail(403, 'Escola indisponível.');
}
function validateRecords(db) {
  for (const key of collections) {
    if (!Array.isArray(db[key])) fail(400, `Coleção inválida: ${key}.`);
    const ids = new Set();
    for (const row of db[key]) {
      if (!row || typeof row !== 'object' || typeof row.id !== 'string' || ids.has(row.id)) fail(400, `Registro inválido ou duplicado: ${key}.`);
      ids.add(row.id);
      for (const field of ['modules', 'items', 'submissions', 'completedBy', 'attendanceBy']) if (row[field] !== undefined && !Array.isArray(row[field])) fail(400, `O campo ${field} deve ser uma lista.`);
      if (row.modules) for (const mod of row.modules) {
        if (!mod || typeof mod.id !== 'string' || !Array.isArray(mod.items)) fail(400, 'Módulo inválido.');
        for (const item of mod.items) if (!item || typeof item.id !== 'string' || !['lesson', 'activity'].includes(item.type) || item.submissions !== undefined && !Array.isArray(item.submissions) || item.completedBy !== undefined && !Array.isArray(item.completedBy)) fail(400, 'Item de módulo inválido.');
      }
      for (const field of ['value', 'amount', 'price', 'mrr', 'setupFee']) if (row[field] !== undefined && (!['number', 'string'].includes(typeof row[field]) || String(row[field]).trim() === '' || !Number.isFinite(Number(row[field])) || Number(row[field]) < 0)) fail(400, `Valor inválido: ${field}.`);
    }
  }
}
function sessionUser(req) {
  const cookie = (req.headers.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith('cs_session='));
  const token = cookie?.slice(11);
  const session = token && store.sessions.find(s => s.tokenHash === hash(token) && s.expires > Date.now());
  const user = session && store.users.find(u => u.id === session.userId && u.active !== false);
  if (!user) fail(401, 'Entre na sua conta para continuar.');
  assertAccountAccess(store, user);
  return user;
}
function cookie(res, token, maxAge = 86400) { res.setHeader('Set-Cookie', `cs_session=${token}; HttpOnly; SameSite=Lax; Path=/whitelabel/; Max-Age=${maxAge}${production ? '; Secure' : ''}`); }
function createSession(draft, user) { const token = crypto.randomBytes(32).toString('hex'); const school = draft.db.schools.find(s => s.id === user.schoolId); const duration = ({ '1h': 3600000, '4h': 14400000, '8h': 28800000, '24h': 86400000 })[school?.sessionTimeout] || 86400000; draft.sessions = draft.sessions.filter(s => s.expires > Date.now()); draft.sessions.push({ tokenHash: hash(token), userId: user.id, expires: Date.now() + duration }); return token; }
async function mail(to, subject, text) {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) { const transport=require("nodemailer").createTransport({host:process.env.SMTP_HOST || "smtp.hostinger.com",port:Number(process.env.SMTP_PORT || 465),secure:Number(process.env.SMTP_PORT || 465)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:15000,socketTimeout:30000});const result=await transport.sendMail({from:process.env.SMTP_FROM || process.env.SMTP_USER,to,subject,text});if(!result.accepted?.length) throw new Error("Falha no envio de e-mail.");return; }
  if (process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.MAIL_FROM, to, subject, text }), signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Falha no serviço de e-mail.');
  } else {
    if (production) fail(503, 'Serviço de e-mail não configurado.');
    const directory = path.join(DATA, 'mail'); fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, `${Date.now()}-${id()}.json`), JSON.stringify({ to, subject, text }, null, 2), { mode: 0o600 });
  }
}
const buckets = new Map();
function limit(req, category, max = 15, identity = '') {
  const key = `${req.socket.remoteAddress}:${category}:${identity}`; const now = Date.now();
  for (const [k, v] of buckets) if (v.until < now) buckets.delete(k);
  const value = buckets.get(key) || { count: 0, until: now + 900000 }; value.count++; buckets.set(key, value);
  if (value.count > max) fail(429, 'Muitas tentativas. Tente novamente em 15 minutos.');
}
async function body(req) {
  let size = 0; const chunks = [];
  for await (const chunk of req) { size += chunk.length; if (size > 15 * 1024 * 1024) fail(413, 'Arquivo/requisição muito grande.'); chunks.push(chunk); }
  try { const parsed = JSON.parse((Buffer.concat(chunks).toString() || '{}').replaceAll('/whitelabel/api/', '/api/')); if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') fail(400, 'JSON inválido.'); return parsed; } catch { fail(400, 'JSON inválido.'); }
}
const studentWrites = new Set(['submitStudentActivity', 'toggleLessonCompletion', 'toggleAttendance', 'submitStudentTask']);
const teacherWrites = new Set(['updateTeacher', 'addCourse', 'updateCourse', 'deleteCourse', 'addModule', 'updateModule', 'deleteModule', 'addLessonToModule', 'addMaterialToModule', 'addActivityToModule', 'updateModuleItem', 'deleteModuleItem', 'moveModuleItem', 'addLesson', 'addMaterial', 'addTask', 'updateTask', 'addEvent', 'updateEvent', 'deleteEvent']);
const masterWrites = new Set(['addSchool', 'paySchoolSetup', 'transferStudentSchool', 'addPlan', 'updatePlan', 'deletePlan']);
function rpc(draft, user, method, args) {
  const legacy = legacyContext(draft.db); const DB = legacy.context.DB;
  const allowed = Object.getOwnPropertyNames(DB).filter(k => /^(get|add|update|delete|transfer|pay|renew|toggle|submit|move)/.test(k) && k !== 'getDB');
  if (!allowed.includes(method) || !Array.isArray(args) || args.length > 12) fail(400, 'Operação inválida.');
  const read = method.startsWith('get');
  if (read) { DB.getDB = () => scope(draft.db, user); return DB[method](...args) ?? null; }
  if (user.role === 'aluno' && !studentWrites.has(method)) fail(403, 'Sem permissão para esta operação.');
  if (user.role === 'professor' && !teacherWrites.has(method)) fail(403, 'Sem permissão para esta operação.');
  if (user.role !== 'admin' && masterWrites.has(method)) fail(403, 'Operação exclusiva do administrador.');
  assertAccountAccess(draft, draft.users.find(u => u.id === user.id));
  // O motor legado opera somente sobre registros do tenant autorizado; o merge preserva os demais.
  const working = clone(draft.db);
  if (user.role !== 'admin') for (const key of collections) if (key !== 'plans') working[key] = (working[key] || []).filter(r => key === 'schools' ? r.id === user.schoolId : r.schoolId === user.schoolId);
  DB.getDB = () => working; DB.saveDB = () => {};
  args = clone(args);
  validateLegacy(args);
  const object = args.find(a => a && typeof a === 'object' && !Array.isArray(a));
  if (object) {
    if (object.twoFactor === true) fail(400, 'O segundo fator exige uma integração de autenticação adicional. Mantenha desativado nesta versão.');
    for (const key of ['id', 'password', 'passwordHash', '__proto__', 'constructor', 'prototype']) delete object[key];
    if (user.role !== 'admin') object.schoolId = user.schoolId;
    if (user.role === 'professor' && method === 'addCourse') object.teacherId = user.profileId;
    const targetSchool = user.role === 'admin' ? object.schoolId || draft.db.courses.find(c => c.id === args[0])?.schoolId || draft.db.students.find(s => s.id === args[0])?.schoolId || draft.db.teachers.find(t => t.id === args[0])?.schoolId : user.schoolId;
    if (object.email !== undefined) { object.email = emailOf(object.email); validateEmail(object.email); }
    if (object.teacherId && !draft.db.teachers.some(t => t.id === object.teacherId && t.schoolId === targetSchool)) fail(400, 'Professor não pertence à escola.');
    if (object.classId && !draft.db.classes.some(c => c.id === object.classId && c.schoolId === targetSchool)) fail(400, 'Turma não pertence à escola.');
    if (user.role !== 'aluno' && object.studentId && !draft.db.students.some(s => s.id === object.studentId && s.schoolId === targetSchool)) fail(400, 'Aluno não pertence à escola.');
    if (method === 'addCourse' && !object.teacherId) {
      const teacher = draft.db.teachers.find(t => t.schoolId === targetSchool);
      object.teacherId = teacher?.id || null; object.instructor = teacher?.name || 'A definir';
    }
    if (method === 'addFinancial' && (object.studentId || object.studentName)) {
      const matches = draft.db.students.filter(s => s.schoolId === targetSchool && (object.studentId ? s.id === object.studentId : s.name === object.studentName));
      if (matches.length !== 1) fail(400, 'Selecione um aluno válido para a cobrança.');
      object.studentId = matches[0].id; object.studentName = matches[0].name;
    }
  }
  if (method === 'renewStudentPlan' && user.role !== 'admin') args[4] = user.schoolId;
  if (method === 'transferStudentSchool' && !draft.db.schools.some(s => s.id === args[1])) fail(400, 'Escola de destino inválida.');
  if (user.role === 'professor' && method === 'updateTeacher') {
    if (args[0] !== user.profileId) fail(403, 'Edite apenas seu perfil.');
    if (object?.email && emailOf(object.email) !== user.email) fail(400, 'Altere o e-mail em uma operação de conta verificada.');
  }
  if (method === 'updateSchool' && user.role !== 'admin' && object) {
    const allowed = new Set(['name', 'domain', 'slogan', 'primaryColor', 'secondaryColor', 'fontFamily', 'favicon', 'customDomain', 'smtpSender', 'smtpEmail', 'smtpHost', 'smtpPort', 'autoReminders', 'twoFactor', 'sessionTimeout', 'pixKey', 'paymentGateway', 'veencaToken', 'schoolId']);
    if (Object.keys(object).some(key => !allowed.has(key))) fail(403, 'A escola não pode alterar sua licença, plano ou situação financeira.');
  }
  if (user.role === 'professor' && /Course|Module/.test(method) && method !== 'addCourse') {
    const course = working.courses.find(c => c.id === args[0]);
    if (!course || course.teacherId !== user.profileId) fail(403, 'Curso não atribuído a este professor.');
  }
  if (user.role === 'aluno' && ['submitStudentActivity', 'toggleLessonCompletion'].includes(method)) {
    const course = working.courses.find(c => c.id === args[0]);
    const item = course?.modules?.find(m => m.id === args[1])?.items?.find(i => i.id === args[2]);
    if (!learning.canSeeCourse(course, user) || !item || !learning.published(item)) fail(404, 'Conteúdo não encontrado.');
    if (method === 'submitStudentActivity') { learning.assertSubmissionWindow(item); if (item.submissions?.some(s => s.studentId === user.profileId && (s.gradedAt || s.grade != null))) fail(409, 'Esta entrega já foi corrigida. Peça ao professor para reabrir.'); }
  }
  if (method === 'submitStudentActivity') args[3] = { fileName: args[3]?.fileName, fileSize: args[3]?.fileSize, studentNotes: args[3]?.studentNotes, studentId: user.profileId, studentName: user.name };
  if (method === 'toggleLessonCompletion') args[3] = user.profileId;
  let result;
  if (method === 'toggleAttendance') {
    const event = working.events.find(e => e.id === args[0]); if (!event) fail(404, 'Evento não encontrado.');
    event.attendanceBy ||= []; const i = event.attendanceBy.indexOf(user.profileId); if (i < 0) event.attendanceBy.push(user.profileId); else event.attendanceBy.splice(i, 1);
    result = { ...event, attendanceConfirmed: i < 0 };
  } else if (method === 'submitStudentTask') {
    const task = working.tasks.find(t => t.id === args[0]); if (!task || (task.studentId && task.studentId !== user.profileId)) fail(404, 'Tarefa não encontrada.');
    task.submissions ||= []; task.submissions = task.submissions.filter(s => s.studentId !== user.profileId);
    task.submissions.push({ studentId: user.profileId, submittedAt: new Date().toISOString(), notes: String(args[1]?.notes || ''), grade: null }); result = task;
  } else result = DB[method](...args);
  for (const key of collections) {
    if (user.role !== 'admin' && !['schools', 'plans'].includes(key) && working[key].some(row => row.schoolId !== user.schoolId)) fail(403, 'Operação fora da escola autorizada.');
    if (user.role === 'admin') draft.db[key] = working[key];
    else if (key !== 'plans') draft.db[key] = [...(draft.db[key] || []).filter(r => key === 'schools' ? r.id !== user.schoolId : r.schoolId !== user.schoolId), ...(working[key] || [])];
  }
  validateRecords(draft.db);
  for (const plan of draft.db.plans) if (!plan.name?.trim() || !Array.isArray(plan.features) || plan.features.some(f => typeof f !== 'string') || !Number.isFinite(Number(plan.price)) || Number(plan.price) < 0) fail(400, 'Plano inválido. Informe nome, preço e lista de recursos.');
  for (const account of draft.users) {
    if (!account.profileId) continue;
    const profile = draft.db[account.role === 'aluno' ? 'students' : 'teachers'].find(p => p.id === account.profileId);
    if (profile) {
      const nextEmail = emailOf(profile.email);
      if (draft.users.some(other => other.id !== account.id && other.email === nextEmail)) fail(409, 'E-mail já utilizado por outra conta.');
      if (account.email !== nextEmail || account.schoolId !== profile.schoolId) { draft.sessions = draft.sessions.filter(s => s.userId !== account.id); draft.resets = draft.resets.filter(r => r.userId !== account.id); }
      account.schoolId = profile.schoolId; account.name = profile.name; account.email = nextEmail; account.photo = profile.photo || profile.profilePic || '';
    }
  }
  draft.audit.push({ at: new Date().toISOString(), userId: user.id, method }); draft.audit = draft.audit.slice(-2000);
  if (result && typeof result === 'object') {
    result = clone(result);
    if (user.role === 'aluno' && method === 'submitStudentTask') result.submissions = (result.submissions || []).filter(s => s.studentId === user.profileId);
    const strip = value => { if (!value || typeof value !== 'object') return; for (const key of Object.keys(value)) { if (/password|token|secret|smtp/i.test(key)) delete value[key]; else strip(value[key]); } }; strip(result);
  }
  return result ?? null;
}
async function api(req, res, pathname) {
  if (!['GET', 'POST'].includes(req.method)) fail(405, 'Método não permitido.');
  if (req.method === 'POST') {
    const origin = req.headers.origin;
    if (origin && origin !== new URL(baseURL).origin) fail(403, 'Origem não permitida.');
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) fail(415, 'Use application/json.');
  }
  const input = req.method === 'POST' ? await body(req) : {};
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const email = emailOf(input.email); limit(req, 'login', 100); limit(req, 'login-account', 15, hash(email));
    const user = store.users.find(u => u.email === email && u.active !== false);
    const valid = await passwordMatches(input.password, user?.passwordHash || store.dummyHash);
    if (!user || !valid || (input.role && input.role !== user.role)) fail(401, 'E-mail, senha ou perfil incorretos.');
    const result = await transaction(d => {
      const current = d.users.find(u => u.id === user.id);
      if (!current || current.passwordHash !== user.passwordHash) fail(401, 'Credenciais alteradas. Entre novamente.');
      assertAccountAccess(d, current); return { token: createSession(d, current), user: safeUser(current) };
    }); cookie(res, result.token); return { user: result.user };
  }
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    limit(req, 'register', 10); const email = emailOf(input.email); validateEmail(email); validatePassword(input.password);
    const name = String(input.name || '').trim(); const schoolName = String(input.schoolName || '').trim();
    validateLegacy({ name, schoolName, email });
    if (!name || !schoolName || name.length > 120 || schoolName.length > 160) fail(400, 'Informe seu nome e o nome da escola.');
    const digest = await passwordHash(input.password);
    const result = await transaction(d => {
      if (d.users.some(u => u.email === email)) fail(409, 'E-mail já cadastrado.');
      const schoolId = 'escola-' + id();
      d.db.schools.push({ id: schoolId, name: schoolName, domain: '', logo: '', primaryColor: '#246BFD', secondaryColor: '#031735', fontFamily: 'Outfit', status: 'Ativo', plan: 'Starter', studentCount: 0, teacherCount: 0, mrr: 0 });
      const user = { id: id(), role: 'escola', schoolId, name, email, passwordHash: digest, active: true }; d.users.push(user);
      return { token: createSession(d, user), user: safeUser(user) };
    }); cookie(res, result.token); return { user: result.user };
  }
  if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
    const email = emailOf(input.email); validateEmail(email); limit(req, 'forgot', 30); limit(req, 'forgot-account', 6, hash(email));
    const user = store.users.find(u => u.email === email && u.active !== false);
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      await transaction(d => { d.resets = d.resets.filter(r => r.userId !== user.id && r.expires > Date.now()); d.resets.push({ tokenHash: hash(token), userId: user.id, expires: Date.now() + 1800000 }); });
      await mail(email, 'Recuperação de senha — Change Skills', `Redefina sua senha em até 30 minutos: ${baseURL}/#/auth/reset/${token}`);
    }
    return { message: 'Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.' };
  }
  if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
    limit(req, 'reset'); validatePassword(input.password); const digest = await passwordHash(input.password);
    await transaction(d => {
      const reset = d.resets.find(r => r.tokenHash === hash(String(input.token || '')) && r.expires > Date.now()); if (!reset) fail(400, 'Link inválido ou expirado.');
      const account = d.users.find(u => u.id === reset.userId); if (!account || account.active === false) fail(400, 'Link inválido ou expirado.');
      account.passwordHash = digest;
      d.sessions = d.sessions.filter(s => s.userId !== reset.userId); d.resets = d.resets.filter(r => r.userId !== reset.userId);
    }); return { message: 'Senha redefinida. Entre com sua nova senha.' };
  }
  if (pathname === '/api/public/schools' && req.method === 'GET') return store.db.schools.filter(s => !/bloque|inativ/i.test(s.status || '')).map(s => ({ id: s.id, name: s.name, primaryColor: s.primaryColor, secondaryColor: s.secondaryColor, logo: s.logo }));
  const user = sessionUser(req);
  if (pathname.startsWith('/api/learning/') && req.method === 'POST') {
    return transaction(d => {
      const actor = d.users.find(u => u.id === user.id); assertAccountAccess(d, actor);
      const result = learning.mutate(d, actor, pathname.slice('/api/learning/'.length), input, validateLegacy);
      validateRecords(d.db);
      d.audit.push({ at: new Date().toISOString(), userId: actor.id, method: pathname, courseId: input.courseId }); d.audit = d.audit.slice(-2000);
      return result;
    });
  }
  if (pathname === '/api/auth/me' && req.method === 'GET') return { user: safeUser(user) };
  if (pathname === '/api/auth/logout' && req.method === 'POST') { await transaction(d => { d.sessions = d.sessions.filter(s => s.userId !== user.id); }); cookie(res, '', 0); return { ok: true }; }
  if (pathname === '/api/auth/change-password' && req.method === 'POST') {
    limit(req, 'change'); if (!await passwordMatches(input.currentPassword, user.passwordHash)) fail(400, 'Senha atual incorreta.'); validatePassword(input.password); const digest = await passwordHash(input.password);
    await transaction(d => { const current = d.users.find(u => u.id === user.id); if (!current || current.passwordHash !== user.passwordHash) fail(401, 'Credenciais alteradas. Entre novamente.'); assertAccountAccess(d, current); current.passwordHash = digest; d.sessions = d.sessions.filter(s => s.userId !== user.id); d.resets = d.resets.filter(r => r.userId !== user.id); }); cookie(res, '', 0); return { ok: true };
  }
  if (pathname === '/api/bootstrap' && req.method === 'GET') return scope(store.db, user);
  if (pathname === '/api/admin/settings') {
    if (user.role !== 'admin') fail(403, 'Sem permissão.');
    if (req.method === 'GET') return store.db.adminSettings?.forms || {};
    if (!['general', 'streaming', 'smtp', 'split', 'security'].includes(input.tab) || !Array.isArray(input.values) || input.values.length > 40) fail(400, 'Configuração inválida.');
    if (JSON.stringify(input.values).length > 100000) fail(400, 'Configuração muito grande.');
    return transaction(d => { d.db.adminSettings.forms ||= {}; d.db.adminSettings.forms[input.tab] = input.values.map(v => ({ value: String(v.value || ''), checked: !!v.checked })); return { ok: true }; });
  }
  if (pathname === '/api/email/test' && req.method === 'POST') {
    if (!['admin', 'escola'].includes(user.role)) fail(403, 'Sem permissão.'); limit(req, 'email', 5);
    await mail(user.email, 'Teste de e-mail — Change Skills', 'O envio de e-mail da plataforma está funcionando.'); return { message: process.env.RESEND_API_KEY ? 'E-mail enviado para sua conta.' : 'Mensagem salva na caixa de desenvolvimento: data/mail.' };
  }
  if (pathname === '/api/email/receipt' && req.method === 'POST') {
    limit(req, 'email', 5); const record = scope(store.db, user).financial.find(f => f.id === input.financialId); if (!record) fail(404, 'Cobrança não encontrada.');
    const student = store.db.students.find(s => s.schoolId === record.schoolId && ownsFinancial(store.db, record, s));
    if (!student?.email) fail(400, 'Aluno sem e-mail cadastrado.');
    await mail(student.email, 'Comprovante financeiro — Change Skills', `Aluno: ${record.studentName || student.name}\nDescrição: ${record.description || record.desc || 'Mensalidade'}\nValor: R$ ${Number(record.value || record.amount || 0).toFixed(2)}\nStatus: ${record.status}\nReferência: ${record.id}`);
    return { message: process.env.RESEND_API_KEY ? 'Comprovante enviado.' : 'Comprovante salvo em data/mail.' };
  }
  if (pathname === '/api/export' && req.method === 'GET') {
    if (!['admin', 'escola'].includes(user.role)) fail(403, 'Sem permissão.');
    const collection = new URL(req.url, baseURL).searchParams.get('collection') || 'schools';
    if (!['schools', 'students', 'teachers', 'financial'].includes(collection)) fail(400, 'Exportação inválida.');
    const rows = scope(store.db, user)[collection]; const keys = [...new Set(rows.flatMap(r => Object.keys(r).filter(k => typeof r[k] !== 'object' && !/logo|token|password|secret|smtp/i.test(k))))];
    const cell = value => '"' + String(value ?? '').replace(/^[=+\-@]/, s => "'" + s).replaceAll('"', '""') + '"';
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${collection}.csv"` }); res.end('\ufeff' + [keys.map(cell).join(';'), ...rows.map(r => keys.map(k => cell(r[k])).join(';'))].join('\r\n')); return undefined;
  }
  if (pathname === '/api/profile' && req.method === 'POST') {
    const fields = Object.fromEntries(['name', 'phone', 'language', 'photo', 'specialty', 'bio'].filter(key => input[key] !== undefined).map(key => [key, String(input[key]).trim()]));
    validateLegacy(fields);
    if (fields.name !== undefined && (!fields.name || fields.name.length > 120)) fail(400, 'Informe um nome com até 120 caracteres.');
    if (input.email !== undefined && emailOf(input.email) !== user.email) fail(400, 'Peça à escola para alterar o e-mail da conta.');
    let digest;
    if (input.newPassword) {
      validatePassword(input.newPassword);
      if (!await passwordMatches(input.currentPassword, user.passwordHash)) fail(400, 'Senha atual incorreta.');
      digest = await passwordHash(input.newPassword);
    }
    const result = await transaction(d => {
      const account = d.users.find(u => u.id === user.id); assertAccountAccess(d, account);
      if (account.passwordHash !== user.passwordHash) fail(401, 'Credenciais alteradas. Entre novamente.');
      if (fields.name !== undefined) account.name = fields.name;
      if (fields.photo !== undefined) account.photo = fields.photo;
      const collection = user.role === 'aluno' ? 'students' : 'teachers'; const profile = d.db[collection].find(p => p.id === user.profileId);
      if (profile) Object.assign(profile, fields, { name: account.name });
      if (digest) { account.passwordHash = digest; d.sessions = d.sessions.filter(s => s.userId !== user.id); d.resets = d.resets.filter(r => r.userId !== user.id); }
      return { user: safeUser(account), passwordChanged: !!digest };
    });
    if (digest) cookie(res, '', 0);
    return result;
  }
  if (pathname === '/api/grades' && req.method === 'POST') {
    if (!['admin', 'escola', 'professor'].includes(user.role)) fail(403, 'Sem permissão.');
    return transaction(d => {
      const course = d.db.courses.find(c => c.id === input.courseId);
      if (!course || (user.role !== 'admin' && course.schoolId !== user.schoolId) || (user.role === 'professor' && course.teacherId !== user.profileId)) fail(404, 'Curso não encontrado.');
      const item = course.modules?.find(m => m.id === input.moduleId)?.items?.find(i => i.id === input.itemId);
      const submission = item?.submissions?.find(s => s.studentId === input.studentId);
      const grade = Number(input.grade); if (!submission || !['number', 'string'].includes(typeof input.grade) || String(input.grade).trim() === '' || !Number.isFinite(grade) || grade < 0 || grade > Number(item.maxGrade ?? 10)) fail(400, 'Entrega ou nota inválida.');
      validateLegacy(input.feedback || ''); submission.grade = grade; submission.feedback = String(input.feedback || '').slice(0, 5000); submission.gradedAt = new Date().toISOString(); submission.gradedBy = user.id; return submission;
    });
  }
  if (pathname === '/api/attachments' && req.method === 'POST') {
    return transaction(d => {
      const file = d.files.find(f => f.id === input.fileId && f.ownerId === user.id); if (!file) fail(404, 'Arquivo não encontrado.');
      const course = d.db.courses.find(c => c.id === input.courseId);
      if (!course || (user.role !== 'admin' && course.schoolId !== user.schoolId)) fail(404, 'Curso não encontrado.');
      if (!learning.canSeeCourse(course, user)) fail(404, 'Curso não encontrado.');
      const item = course.modules?.find(m => m.id === input.moduleId)?.items?.find(i => i.id === input.itemId); if (!item) fail(404, 'Item não encontrado.');
      if (user.role === 'aluno') {
        if (!learning.published(item)) fail(404, 'Item não encontrado.'); learning.assertSubmissionWindow(item);
        const submission = item.submissions?.find(s => s.studentId === user.profileId); if (!submission) fail(400, 'Envie a atividade primeiro.'); submission.fileId = file.id; submission.url = file.url;
        if (submission.gradedAt || submission.grade != null) fail(409, 'Esta entrega já foi corrigida. Peça ao professor para reabrir.');
      } else {
        if (user.role === 'professor' && course.teacherId !== user.profileId) fail(403, 'Sem permissão.');
        item.materials ||= []; item.materials.push({ id: file.id, title: file.name, url: file.url, size: `${(file.size / 1048576).toFixed(1)} MB`, type: 'Arquivo' });
      }
      return { ok: true };
    });
  }
  if (pathname === '/api/rpc' && req.method === 'POST') {
    if (typeof input.method === 'string' && input.method.startsWith('get')) return rpc(store, user, input.method, input.args);
    return transaction(d => rpc(d, user, input.method, input.args));
  }
  if (pathname === '/api/accounts' && req.method === 'GET') {
    if (!['escola', 'admin'].includes(user.role)) fail(403, 'Sem permissão.');
    return store.users.filter(u => u.role !== 'admin' && (user.role === 'admin' || u.schoolId === user.schoolId && ['aluno', 'professor'].includes(u.role))).map(u => { let canLogin = true; try { assertAccountAccess(store, u); } catch { canLogin = false; } return { ...safeUser(u), active: u.active !== false, canLogin }; });
  }
  if (['/api/accounts/update', '/api/accounts/delete'].includes(pathname) && req.method === 'POST') {
    if (!['escola', 'admin'].includes(user.role)) fail(403, 'Sem permissão.');
    return transaction(d => {
      assertAccountAccess(d, d.users.find(u => u.id === user.id));
      const target = d.users.find(u => u.id === input.id && u.role !== 'admin' && (user.role === 'admin' || u.schoolId === user.schoolId && ['aluno', 'professor'].includes(u.role)));
      if (!target) fail(404, 'Usuário não encontrado.');
      if (target.id === user.id) fail(400, 'Não é possível remover ou bloquear seu próprio acesso.');
      if (pathname.endsWith('/delete')) {
        d.users = d.users.filter(u => u.id !== target.id); d.sessions = d.sessions.filter(s => s.userId !== target.id); d.resets = d.resets.filter(r => r.userId !== target.id);
        d.audit.push({ at: new Date().toISOString(), userId: user.id, method: 'deleteAccount', targetId: target.id });
        return { ok: true };
      }
      if (Object.keys(input).some(key => !['id', 'name', 'email', 'active'].includes(key))) fail(400, 'Altere apenas nome, e-mail e situação do acesso.');
      const name = input.name === undefined ? target.name : String(input.name).trim();
      const email = input.email === undefined ? target.email : emailOf(input.email);
      if (!name || name.length > 120) fail(400, 'Informe um nome com até 120 caracteres.'); validateEmail(email); validateLegacy({ name, email });
      if (input.active !== undefined && typeof input.active !== 'boolean') fail(400, 'Situação do acesso inválida.');
      if (d.users.some(u => u.id !== target.id && u.email === email)) fail(409, 'E-mail já cadastrado.');
      const collection = target.role === 'aluno' ? 'students' : 'teachers';
      if (target.profileId && d.db[collection].some(p => p.id !== target.profileId && p.schoolId === target.schoolId && emailOf(p.email) === email)) fail(409, 'E-mail já utilizado em outro cadastro.');
      if (email !== target.email || input.active === false) { d.sessions = d.sessions.filter(s => s.userId !== target.id); d.resets = d.resets.filter(r => r.userId !== target.id); }
      target.name = name; target.email = email; if (input.active !== undefined) target.active = input.active;
      const profile = d.db[collection].find(p => p.id === target.profileId); if (profile) Object.assign(profile, { name, email });
      d.audit.push({ at: new Date().toISOString(), userId: user.id, method: 'updateAccount', targetId: target.id });
      return { user: { ...safeUser(target), active: target.active !== false } };
    });
  }
  if (pathname === '/api/accounts' && req.method === 'POST') {
    if (!['escola', 'admin'].includes(user.role)) fail(403, 'Sem permissão.');
    const role = input.role; if (!['aluno', 'professor', 'escola'].includes(role) || (user.role !== 'admin' && role === 'escola')) fail(400, 'Perfil inválido.');
    const email = emailOf(input.email); const name = String(input.name || '').trim();
    if (!name || name.length > 120) fail(400, 'Informe um nome com até 120 caracteres.');
    validateEmail(email); validatePassword(input.password); validateLegacy({ name, email }); const digest = await passwordHash(input.password);
    return transaction(d => {
      assertAccountAccess(d, d.users.find(u => u.id === user.id));
      if (d.users.some(u => u.email === email)) fail(409, 'E-mail já cadastrado.');
      const schoolId = user.role === 'admin' ? input.schoolId : user.schoolId;
      if (!d.db.schools.some(s => s.id === schoolId)) fail(400, 'Escola inválida.');
      const collection = role === 'aluno' ? 'students' : 'teachers'; let profile;
      if (role !== 'escola') {
        const matching = d.db[collection].filter(p => emailOf(p.email) === email && p.schoolId === schoolId);
        if (matching.length > 1) fail(409, 'Existe mais de um cadastro com esse e-mail. Corrija os cadastros antes de criar o acesso.');
        profile = matching[0];
        if (!profile) {
          profile = { id: collection + '-' + id(), schoolId, name: String(input.name || email), email, status: 'Ativo', ...(role === 'aluno' ? { progress: 0, lastAccess: 'Nunca', course: '', classId: null, profilePic: '' } : { classes: [], specialty: '', photo: '' }) };
          d.db[collection].push(profile);
          const school = d.db.schools.find(s => s.id === schoolId); const count = role === 'aluno' ? 'studentCount' : 'teacherCount'; school[count] = d.db[collection].filter(p => p.schoolId === schoolId).length;
        }
      }
      if (profile) profile.name = name;
      const account = { id: id(), email, name, role, schoolId, profileId: profile?.id, photo: profile?.photo || profile?.profilePic || '', passwordHash: digest, active: true }; d.users.push(account); return { user: safeUser(account) };
    });
  }
  if (pathname === '/api/messages' && req.method === 'GET') return store.messages.filter(m => (m.senderId === user.id || m.recipientId === user.id) && (m.schoolId ? m.schoolId === user.schoolId : store.users.find(u => u.id === m.senderId)?.schoolId === user.schoolId && store.users.find(u => u.id === m.recipientId)?.schoolId === user.schoolId)).slice(-500);
  if (pathname === '/api/messages' && req.method === 'POST') {
    const recipient = store.users.find(u => u.id === input.recipientId || u.profileId === input.recipientId);
    if (!recipient || recipient.schoolId !== user.schoolId || recipient.active === false) fail(404, 'Destinatário não encontrado.');
    assertAccountAccess(store, recipient);
    const text = String(input.text || '').trim(); if (!text || text.length > 5000) fail(400, 'Mensagem inválida.');
    return transaction(d => { const message = { id: id(), schoolId: user.schoolId, senderId: user.id, senderProfileId: user.profileId || user.id, recipientId: recipient.id, recipientProfileId: recipient.profileId || recipient.id, text, createdAt: new Date().toISOString() }; d.messages.push(message); return message; });
  }
  if (pathname === '/api/files' && req.method === 'POST') {
    const encoded = input.base64; if (typeof encoded !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) fail(400, 'Conteúdo base64 inválido.');
    const content = Buffer.from(encoded, 'base64'); if (!content.length || content.length > 10 * 1024 * 1024) fail(400, 'O arquivo deve ter até 10 MB.');
    const fileName = path.basename(String(input.name || 'arquivo')); validateLegacy(fileName); if (fileName.length > 200) fail(400, 'Nome de arquivo muito longo.');
    const schoolId = user.role === 'admin' ? input.schoolId || user.schoolId : user.schoolId;
    if (schoolId && !store.db.schools.some(s => s.id === schoolId)) fail(400, 'Escola inválida.');
    const fileId = id(); fs.mkdirSync(path.join(DATA, 'uploads'), { recursive: true });
    fs.writeFileSync(path.join(DATA, 'uploads', fileId), content, { mode: 0o600 });
    return transaction(d => { const file = { id: fileId, schoolId, ownerId: user.id, ownerRole: user.role, name: fileName, size: content.length, url: `/api/files/${fileId}` }; d.files.push(file); return file; });
  }
  if (pathname.startsWith('/api/files/') && req.method === 'GET') {
    const file = store.files.find(f => f.id === pathname.slice(11));
    if (!file || !learning.canDownload(store, file, user)) fail(404, 'Arquivo não encontrado.');
    const target = path.join(DATA, 'uploads', file.id); if (!fs.existsSync(target)) fail(404, 'Arquivo não encontrado.');
    res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}` }); fs.createReadStream(target).on('error', () => res.destroy()).pipe(res); return undefined;
  }
  fail(404, 'Rota não encontrada.');
}
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'same-origin'); res.setHeader('X-Frame-Options', 'DENY');
  try {
    let pathname; try { pathname = decodeURIComponent(new URL(req.url, baseURL).pathname).replace(/^\/whitelabel(?=\/)/, ""); } catch { fail(400, 'Endereço inválido.'); }
    if (pathname.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store'); const result = await api(req, res, pathname);
      if (result !== undefined) { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(result).replaceAll('/api/', '/whitelabel/api/')); } return;
    }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!['index.html', 'app.js', 'database.js', 'backend-client.js', 'academic-client.js', 'style.css', 'academic.css'].includes(relative) && !relative.startsWith('assets/')) fail(404, 'Não encontrado.');
    const target = path.resolve(ROOT, relative); if (!target.startsWith(ROOT + path.sep)) fail(404, 'Não encontrado.');
    const real = fs.realpathSync(target); if (!real.startsWith(ROOT + path.sep) || (relative.startsWith('assets/') && !real.startsWith(path.join(ROOT, 'assets') + path.sep))) fail(404, 'Não encontrado.');
    if (!fs.statSync(real).isFile()) fail(404, 'Não encontrado.');
    res.setHeader('Cache-Control', relative.startsWith('assets/') ? 'public, max-age=3600' : 'no-store');
    res.writeHead(200, { 'Content-Type': mime[path.extname(real)] || 'application/octet-stream' }); fs.createReadStream(real).on('error', () => res.destroy()).pipe(res);
  } catch (error) {
    if (res.headersSent) { res.destroy(); return; }
    const status = error.status || (error.code === 'ENOENT' ? 404 : 500);
    if (status === 500) console.error(error);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify({ error: status === 500 ? 'Erro interno do servidor.' : error.message }));
  }
}
async function start() {
  fs.mkdirSync(DATA, { recursive: true });
  const lock = path.join(DATA, 'server.lock');
  try { fs.writeFileSync(lock, String(process.pid), { flag: 'wx' }); } catch (e) {
    if (e.code !== 'EEXIST') throw e;
    const pid = Number(fs.readFileSync(lock, 'utf8')); let alive = true; try { process.kill(pid, 0); } catch (error) { if (error.code === 'ESRCH') alive = false; }
    if (alive) throw new Error('Já existe um servidor usando este banco JSON.');
    fs.unlinkSync(lock); fs.writeFileSync(lock, String(process.pid), { flag: 'wx' });
  }
  process.on('exit', () => { try { fs.unlinkSync(lock); } catch {} });
  if (fs.existsSync(FILE)) store = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  else {
    const context = legacyContext({}); const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(18).toString('base64url'); validatePassword(password);
    store = { version: 1, db: JSON.parse(JSON.stringify(context.context.seed)), users: [{ id: id(), role: 'admin', schoolId: null, name: 'Administrador', email: emailOf(process.env.ADMIN_EMAIL || 'admin@changeskills.com.br'), passwordHash: await passwordHash(password), active: true }], sessions: [], resets: [], files: [], messages: [], audit: [], dummyHash: await passwordHash(crypto.randomBytes(32).toString('hex')) };
    persist(store); console.log(`Administrador inicial: ${store.users[0].email}`); if (!process.env.ADMIN_PASSWORD) console.log(`Senha inicial (guarde em local seguro): ${password}`);
  }
  const server = http.createServer(handler); server.requestTimeout = 30000; server.headersTimeout = 15000;
  server.listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => console.log(`Change Skills disponível em ${baseURL}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
  return server;
}
if (require.main === module) start().catch(e => { console.error(e.message); process.exit(1); });
module.exports = { start };
