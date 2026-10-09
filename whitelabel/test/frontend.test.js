const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, name), 'utf8');
function fixture() {
  const nodes = new Map();
  const node = () => ({ innerHTML: '', value: '', style: {}, dataset: {}, children: [], classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } }, addEventListener() {}, setAttribute() {}, appendChild() {}, prepend() {}, remove() {}, querySelectorAll() { return []; }, querySelector() { return null; } });
  const document = { getElementById(id) { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); }, querySelectorAll() { return []; }, querySelector() { return null; }, addEventListener() {}, createElement: node, head: node(), body: node() };
  let data;
  const context = vm.createContext({ document, window: { addEventListener() {}, location: { hash: '#/auth/escola' } }, localStorage: { getItem() { return data || null; }, setItem(key, value) { data = value; } }, console, crypto, structuredClone, setInterval() {}, setTimeout() {}, location: { hash: '#/auth/escola', origin: 'http://localhost:3000' }, URL, AbortSignal });
  vm.runInContext(source('database.js') + '\nthis.DB=PratikaDB;', context);
  context.DB.getDB = () => JSON.parse(JSON.stringify(context.data));
  context.DB.saveDB = db => { context.data = db; };
  context.data = vm.runInContext('JSON.parse(JSON.stringify(DEFAULT_DATABASE))', context);
  vm.runInContext(source('app.js') + '\nthis.App=PratikaApp;', context);
  context.App.prototype.init = function() {};
  return { context, nodes, node };
}
test('todos os handlers de botões referenciam métodos existentes', () => {
  const { context } = fixture();
  const all = source('app.js') + source('backend-client.js') + source('academic-client.js');
  const extensions = new Set([...all.matchAll(/PratikaApp\.prototype\.([\w$]+)\s*=/g)].map(m => m[1]));
  const refs = new Set([...all.matchAll(/\bapp\.([A-Za-z_$][\w$]*)\s*\(/g)].map(m => m[1]));
  for (const name of refs) assert.ok(typeof context.App.prototype[name] === 'function' || extensions.has(name), `Handler ausente: ${name}`);
  assert.ok(refs.size > 70, 'Inventário deve cobrir os controles dos portais');
});

test('atalhos dos modais não dependem de variáveis locais inacessíveis ao clique', () => {
  const all = source('app.js') + source('backend-client.js') + source('academic-client.js');
  for (const match of all.matchAll(/onclick="([^"]*)"/g)) {
    assert.ok(!/\bmodalRoot\b/.test(match[1]), `Referência fora do escopo: ${match[1]}`);
  }
});

test('modais publicados abrem com registros existentes sem exceções', () => {
  const { context, nodes } = fixture();
  const child = () => ({ value: 'escola-1', checked: true, focus() {}, style: {}, querySelector: child, querySelectorAll: () => [], elements: new Proxy({}, { get: child }), addEventListener() {} });
  for (const id of ['action-modal-root', 'academic-modal-root']) context.document.getElementById(id).querySelector = child;
  vm.runInContext(source('backend-client.js').replace('  boot();', '  cache = structuredClone(data);'), context);
  context.Backend = context.window.Backend;
  vm.runInContext(source('academic-client.js'), context);
  const app = new context.App();
  app.session = { role: 'escola', schoolId: 'escola-1', userId: 'aluno-1' };
  const data = context.data;
  const course = data.courses[0], mod = course.modules[0];
  const ids = { schoolId: data.schools[0].id, studentId: data.students[0].id,
    teacherId: data.teachers[0].id, classId: data.classes[0].id,
    financialId: data.financial[0].id, eventId: data.events[0]?.id,
    taskId: data.tasks[0]?.id, lessonId: data.lessons[0]?.id,
    materialId: data.materials[0]?.id, courseId: course.id, moduleId: mod.id,
    itemId: mod.items[0].id, prefillDate: '2026-10-09' };
  const failures = [];
  const methods = [...source('app.js').matchAll(/^  (show\w+Modal)\(([^)]*)\)/gm)];
  for (const [, name, signature] of methods) {
    const args = signature ? signature.split(',').map(p => ids[p.trim().split(/\s*=/)[0]]) : [];
    try { app[name](...args); }
    catch (error) { failures.push(`${name}: ${error.message}`); }
    for (const n of nodes.values()) n.innerHTML = '';
  }
  assert.deepEqual(failures, []);
  assert.ok(methods.length >= 35);
});
test('telas principais dos quatro perfis renderizam sem exceções', () => {
  const { context, node } = fixture();
  const app = new context.App();
  const routes = {
    admin: ['dashboard', 'escolas', 'alunos', 'financeiro', 'planos', 'configuracoes', 'cursos'],
    escola: ['dashboard', 'alunos', 'professores', 'turmas', 'calendario', 'aulas', 'financeiro', 'comunicacao', 'configuracoes', 'cursos'],
    professor: ['dashboard', 'cursos', 'alunos', 'aulas', 'atividades', 'materiais', 'mensagens', 'perfil'],
    aluno: ['home', 'cursos', 'turmas', 'aulas', 'calendario', 'tarefas', 'materiais', 'mensagens', 'financeiro', 'perfil']
  };
  for (const [role, views] of Object.entries(routes)) {
    app.session = { role, schoolId: 'escola-1', userId: role === 'professor' ? 'prof-1' : 'aluno-1', userName: 'Teste', userEmail: 'teste@example.com' };
    for (const view of views) {
      const container = node(); app.currentView = view; app.routeParams = [];
      const render = { admin: 'renderAdminViews', escola: 'renderSchoolViews', professor: 'renderTeacherViews', aluno: 'renderStudentViews' }[role];
      assert.doesNotThrow(() => role === 'admin' ? app[render](view, container) : app[render](view, 'escola-1', container), `${role}/${view}`);
      assert.ok(container.innerHTML.length > 0, `Tela vazia: ${role}/${view}`);
    }
  }
});
test('editar plano preserva ID e pagamento manual registra data', () => {
  const { context } = fixture();
  const plan = context.DB.updatePlan('plan-1', { name: 'Novo Starter', price: 12.5, features: ['Recurso'] });
  assert.equal(plan.id, 'plan-1'); assert.equal(context.DB.getPlans()[0].price, 12.5);
  const bill = context.DB.getFinancial()[0];
  const paid = context.DB.payFinancial(bill.id);
  assert.equal(paid.status, 'Pago'); assert.ok(Number.isFinite(Date.parse(paid.paidAt)));
  assert.equal(context.DB.payFinancial(bill.id).paidAt, paid.paidAt);
});
test('interface acadêmica renderiza conteúdo escapado, vídeo, progresso e nota zero', () => {
  const { context, nodes, node } = fixture();
  context.Backend = { escape: value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) };
  vm.runInContext(source('academic-client.js'), context);
  const container = node(); const children = new Map();
  container.querySelector = selector => { if (!children.has(selector)) children.set(selector, node()); return children.get(selector); };
  nodes.set('portal-main-view', container);
  const app = new context.App();
  app.session = { role: 'aluno', userId: 'aluno-1', schoolId: 'escola-1' };
  const course = context.data.courses[0]; const mod = course.modules[0];
  const lesson = mod.items.find(i => i.type === 'lesson'); const activity = mod.items.find(i => i.type === 'activity');
  course.description = '<script>alert(1)</script>';
  lesson.videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; lesson.completedBy = ['aluno-1'];
  activity.statement = "I'm studying <img src=x onerror=alert(1)>";
  activity.submissions = [{ studentId: 'aluno-1', studentNotes: '<script>bad()</script>', grade: 0, gradedAt: '2026-10-01T00:00:00Z', feedback: 'Refazer' }];
  for (const role of ['aluno', 'professor', 'escola', 'admin']) {
    app.session.role = role;
    for (const view of ['cursos', 'curso', 'assistir', 'atividade', 'aulas', 'tarefas', 'atividades', 'materiais']) {
      app.currentView = view; app.routeParams = [course.id, mod.id, view === 'atividade' ? activity.id : lesson.id];
      assert.doesNotThrow(() => app.renderInternalView(), `${role}/${view}`);
      assert.ok(container.innerHTML.length > 0);
      assert.ok(!container.innerHTML.includes('<script>'));
      assert.ok(!container.innerHTML.includes('<img src=x'));
      if (view === 'assistir') assert.match(container.innerHTML, /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
      if (view === 'atividade') assert.match(container.innerHTML, /Nota: 0/);
      if (role === 'escola') {
        assert.ok(!/data-action="(?:course|module|lesson|activity|delete-course|delete-item|grade|submit)"/.test(container.innerHTML), 'Escola deve consultar cursos sem editar conteúdo ou enviar entregas');
      }
    }
  }
  app.currentView = 'curso'; app.routeParams = ['curso-inexistente']; app.renderInternalView();
  assert.match(container.innerHTML, /Conteúdo não encontrado/);
});
