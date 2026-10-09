/* Ponte para os formulários legados: leituras em cache, gravações confirmadas no servidor. */
(() => {
  const emptyCache = () => ({ schools: [], students: [], teachers: [], courses: [], classes: [], lessons: [], materials: [], tasks: [], financial: [], events: [], plans: [], adminSettings: {} });
  let cache = emptyCache();
  let cacheVersion = 0;
  function discardSession(role = 'escola') {
    cacheVersion++; cache = emptyCache();
    if (window.app) { window.app.session = { role: null, schoolId: null }; window.app.activeChatContact = null; window.app.closeModal(); window.app.applyWhiteLabelTheme(null); location.hash = `#/auth/${role}`; }
  }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function connectLabels(root) {
    for (const label of root.querySelectorAll('label')) {
      if (label.control) continue;
      const field = label.closest('.form-group')?.querySelector('input, select, textarea') || (label.nextElementSibling?.matches('input, select, textarea') ? label.nextElementSibling : null);
      if (field) { field.id ||= 'field-' + crypto.randomUUID(); label.htmlFor = field.id; }
    }
  }
  async function request(url, data) {
    const response = await fetch(url, { credentials: 'same-origin', headers: data ? { 'Content-Type': 'application/json' } : {}, method: data ? 'POST' : 'GET', body: data ? JSON.stringify(data) : undefined, signal: AbortSignal.timeout(20000) });
    const value = await response.json(); if (!response.ok) {
      if (response.status === 401 && !['/whitelabel/api/auth/login', '/whitelabel/api/auth/register'].includes(url)) discardSession(window.app?.session.role || 'escola');
      throw Object.assign(new Error(value.error || 'Falha na comunicação com o servidor.'), { status: response.status });
    } return value;
  }
  function sync(url, data) {
    const xhr = new XMLHttpRequest(); xhr.open(data ? 'POST' : 'GET', url, false);
    if (data) xhr.setRequestHeader('Content-Type', 'application/json'); xhr.send(data ? JSON.stringify(data) : null);
    let value; try { value = JSON.parse(xhr.responseText); } catch { throw new Error('Servidor indisponível.'); }
    if (xhr.status >= 400) { if (xhr.status === 401) discardSession(window.app?.session.role || 'escola'); throw Object.assign(new Error(value.error || 'Não foi possível salvar.'), { status: xhr.status }); } return value;
  }
  window.Backend = { request, escape, refresh: async () => { const version = cacheVersion; const next = await request('/whitelabel/api/bootstrap'); if (version === cacheVersion) cache = next; } };
  PratikaDB.getDB = () => structuredClone(cache);
  PratikaDB.saveDB = () => { throw new Error('Use uma operação específica para salvar no servidor.'); };
  for (const name of Object.getOwnPropertyNames(PratikaDB)) {
    if (!/^(add|update|delete|transfer|pay|renew|toggle|submit|move)/.test(name)) continue;
    PratikaDB[name] = (...args) => {
      try { const value = sync('/whitelabel/api/rpc', { method: name, args }); cache = sync('/whitelabel/api/bootstrap'); return value; }
      catch (error) { window.app?.showToast(error.message, 'warning'); throw error; }
    };
  }
  const originalAuth = PratikaApp.prototype.renderAuthPortal;
  PratikaApp.prototype.renderAuthPortal = function(view) {
    if (!['register', 'recover', 'reset'].includes(view)) {
      originalAuth.call(this, view);
      document.querySelectorAll('input[type="password"], input[type="email"]').forEach(input => { input.value = ''; });
      return;
    }
    const title = { register: 'Cadastre sua escola', recover: 'Recuperar senha', reset: 'Criar nova senha' }[view];
    document.getElementById('app-root').innerHTML = `<div style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#031735"><div class="auth-card" style="width:100%;max-width:460px;background:white;padding:32px;border-radius:16px;color:#031735"><h2>${title}</h2><form id="backend-auth-form">${view === 'register' ? '<div class="form-group"><label>Seu nome</label><input name="name" class="form-control" maxlength="120" required></div><div class="form-group"><label>Nome da escola</label><input name="schoolName" class="form-control" maxlength="160" required></div>' : ''}${view !== 'reset' ? '<div class="form-group"><label>E-mail</label><input name="email" class="form-control" type="email" autocomplete="email" required></div>' : ''}${view !== 'recover' ? '<div class="form-group"><label>Senha (mínimo 10 caracteres)</label><input name="password" class="form-control" type="password" minlength="10" maxlength="128" autocomplete="new-password" required></div><div class="form-group"><label>Confirme a senha</label><input name="confirm" class="form-control" type="password" minlength="10" autocomplete="new-password" required></div>' : ''}<p id="auth-result" role="status"></p><button class="btn btn-primary btn-full" type="submit">${view === 'recover' ? 'Enviar recuperação' : 'Salvar'}</button></form><p style="margin-top:18px"><a href="#/auth/escola">Voltar ao login</a></p></div></div>`;
    connectLabels(document.getElementById('app-root'));
    document.getElementById('backend-auth-form').onsubmit = async event => {
      event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); const result = document.getElementById('auth-result');
      if (view !== 'recover' && data.password !== data.confirm) { result.textContent = 'As senhas não conferem.'; return; }
      form.querySelector('button').disabled = true;
      try {
        if (view === 'register') { const response = await request('/whitelabel/api/auth/register', data); await this.acceptSession(response.user); }
        else { const response = await request(view === 'recover' ? '/whitelabel/api/auth/forgot-password' : '/whitelabel/api/auth/reset-password', { ...data, token: location.hash.split('/')[3] }); result.textContent = response.message; form.reset(); }
      } catch (error) { result.textContent = error.message; } finally { form.querySelector('button').disabled = false; }
    };
  };
  PratikaApp.prototype.acceptSession = async function(user) {
    cacheVersion++; cache = emptyCache(); this.activeChatContact = null;
    this.session = { role: user.role, schoolId: user.schoolId, userId: user.userId, userName: user.userName, userEmail: user.userEmail, userPic: user.userPic };
    await Backend.refresh(); this.applyWhiteLabelTheme(user.schoolId);
    const route = `#/${user.role}/${user.role === 'aluno' ? 'home' : user.role === 'professor' ? 'cursos' : 'dashboard'}`;
    if (location.hash === route) this.handleRouting(); else location.hash = route;
  };
  PratikaApp.prototype.login = async function(role, email) {
    const input = document.querySelector('#app-root input[type="password"]');
    if (!input) { this.showToast('Use o login da conta da escola para acessar o portal.', 'info'); return; }
    const button = document.querySelector('#app-root button[type="submit"]'); if (button) button.disabled = true;
    try { const response = await request('/whitelabel/api/auth/login', { role, email, password: input.value }); await this.acceptSession(response.user); }
    catch (error) { this.showToast(error.message, 'warning'); } finally { if (button) button.disabled = false; }
  };
  PratikaApp.prototype.logout = async function() {
    try { await request('/whitelabel/api/auth/logout', {}); discardSession(); cache.schools = await request('/whitelabel/api/public/schools'); this.renderAuthPortal('escola'); }
    catch (error) { this.showToast(error.message, 'warning'); }
  };
  const originalRouting = PratikaApp.prototype.handleRouting;
  const originalTitle = PratikaApp.prototype.getViewTitle;
  const originalSubtitle = PratikaApp.prototype.getViewSubtitle;
  PratikaApp.prototype.getViewTitle = function() { return this.session.role === 'admin' && this.currentView === 'cursos' ? 'Cursos Globais' : originalTitle.call(this); };
  PratikaApp.prototype.getViewSubtitle = function() { return this.session.role === 'admin' && this.currentView === 'cursos' ? 'Organize os cursos de cada escola e os professores responsáveis.' : originalSubtitle.call(this); };
  PratikaApp.prototype.handleRouting = function() {
    const portal = location.hash.replace('#/', '').split('/')[0];
    if (portal !== 'auth' && portal !== 'livekit' && this.session.role && portal !== this.session.role) { location.hash = `#/${this.session.role}/dashboard`; return; }
    if (portal === 'livekit') { this.showToast('Videoconferência depende da configuração de um servidor LiveKit.', 'info'); location.hash = this.lastPortalRoute || `#/${this.session.role || 'auth'}/${this.session.role ? 'dashboard' : 'escola'}`; return; }
    originalRouting.call(this);
    if (portal !== 'auth') this.lastPortalRoute = location.hash;
  };
  const originalLayout = PratikaApp.prototype.renderPortalLayout;
  const originalInternalView = PratikaApp.prototype.renderInternalView;
  PratikaApp.prototype.renderInternalView = function() {
    if (['curso', 'assistir', 'atividade'].includes(this.currentView) && this.routeParams?.[0]) {
      const [courseId, moduleId, itemId] = this.routeParams; const course = cache.courses.find(c => c.id === courseId);
      const mod = course?.modules?.find(m => m.id === moduleId);
      if (!course || ['assistir', 'atividade'].includes(this.currentView) && (!mod || !mod.items.some(i => i.id === itemId))) {
        const main = document.getElementById('portal-main-view'); main.replaceChildren();
        const message = document.createElement('p'); message.textContent = 'Conteúdo não encontrado ou indisponível para sua conta.'; main.appendChild(message);
        const link = document.createElement('a'); link.href = `#/${this.session.role}/cursos`; link.className = 'btn btn-primary'; link.textContent = 'Voltar aos cursos'; main.appendChild(link); return;
      }
    }
    originalInternalView.call(this); connectLabels(document.getElementById('app-root'));
  };
  PratikaApp.prototype.renderPortalLayout = function() {
    originalLayout.call(this);
    connectLabels(document.getElementById('app-root'));
    const profile = document.getElementById('student-profile-form');
    if (profile) {
      const student = cache.students.find(s => s.id === this.session.userId);
      document.getElementById('prof-student-phone').value = student?.phone || '';
      if (student?.language) document.getElementById('prof-student-lang').value = student.language;
      const current = document.createElement('input'); current.type = 'password'; current.className = 'form-control'; current.placeholder = 'Senha atual (para alterar a senha)'; current.id = 'student-current-password';
      const passwords = profile.querySelectorAll('input[type="password"]'); if (passwords[0]) passwords[0].parentElement.before(current);
      profile.addEventListener('submit', async event => {
        event.preventDefault(); event.stopImmediatePropagation();
        try {
          if (passwords[0]?.value && passwords[0].value !== passwords[1].value) throw new Error('As senhas não conferem.');
          const result = await request('/whitelabel/api/profile', { name: document.getElementById('prof-student-name').value, phone: document.getElementById('prof-student-phone').value, language: document.getElementById('prof-student-lang').value, newPassword: passwords[0]?.value || '', currentPassword: current.value });
          this.session.userName = result.user.userName;
          if (result.passwordChanged) {
            discardSession('aluno'); this.showToast('Senha alterada. Entre novamente.', 'success');
          } else { await Backend.refresh(); this.showToast('Perfil salvo.', 'success'); this.renderPortalLayout(); }
        } catch (e) { this.showToast(e.message, 'warning'); }
      }, true);
    }
    if (['admin', 'escola'].includes(this.session.role)) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) { const button = document.createElement('button'); button.className = 'btn btn-primary'; button.textContent = 'Criar acesso'; button.style.margin = '12px'; button.onclick = () => this.showAccountModal(); sidebar.appendChild(button); }
      if (sidebar) { const button = document.createElement('button'); button.className = 'btn btn-outline'; button.textContent = 'Gerenciar usuários'; button.style.margin = '0 12px 12px'; button.onclick = () => this.showUserAccounts(); sidebar.appendChild(button); }
    }
  };
  PratikaApp.prototype.showAccountModal = function() {
    const root = this.getModalRoot();
    root.innerHTML = `<div class="modal-overlay"><div class="school-modal-card auth-card account-modal-card" style="max-width:480px;padding:24px;background:#fff;color:#031735"><h2>Criar acesso</h2><p>Crie o acesso de um aluno da escola parceira. Para cadastro existente, use o mesmo e-mail.</p><form id="account-form"><div class="form-group"><label>Nome</label><input name="name" class="form-control" required></div><div class="form-group"><label>E-mail</label><input name="email" type="email" class="form-control" required></div><div class="form-group"><label>Perfil</label><select name="role" class="form-control"><option value="aluno">Aluno</option>${this.session.role === 'admin' ? '<option value="professor">Professor</option>' : ''}${this.session.role === 'admin' ? '<option value="escola">Gestor da escola</option>' : ''}</select></div>${this.session.role === 'admin' ? `<div class="form-group"><label>Escola</label><select name="schoolId" class="form-control">${cache.schools.map(s => `<option value="${escape(s.id)}">${escape(s.name)}</option>`).join('')}</select></div>` : ''}<div class="form-group"><label>Senha inicial</label><input name="password" type="password" minlength="10" class="form-control" required></div><p id="account-error" role="status"></p><button class="btn btn-primary">Criar acesso</button><button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancelar</button></form></div></div>`;
    connectLabels(root);
    const dialog = root.querySelector('.account-modal-card'); dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); dialog.setAttribute('aria-label', 'Criar acesso');
    root.querySelector('input')?.focus();
    document.getElementById('account-form').onsubmit = async event => {
      event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); if (button.disabled) return; button.disabled = true;
      try { await request('/whitelabel/api/accounts', Object.fromEntries(new FormData(form))); await Backend.refresh(); this.closeModal(); this.showToast('Acesso criado. Compartilhe a senha inicial com o titular.', 'success'); this.renderInternalView(); }
      catch (e) { if (form.isConnected) form.querySelector('#account-error').textContent = e.message; }
      finally { button.disabled = false; }
    };
  };
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && document.getElementById('action-modal-root')?.children.length) window.app?.closeModal(); });
  const originalCourseModal = PratikaApp.prototype.showTeacherCourseModal;
  PratikaApp.prototype.showTeacherCourseModal = function() {
    originalCourseModal.call(this);
    const form = document.getElementById('teacher-course-form');
    if (this.session.role !== 'professor') {
      const group = document.createElement('div'); group.className = 'form-group';
      if (this.session.role === 'admin') group.innerHTML = `<label for="new-course-school">Escola</label><select id="new-course-school" class="form-control">${cache.schools.map(s => `<option value="${escape(s.id)}">${escape(s.name)}</option>`).join('')}</select>`;
      const label = document.createElement('label'); label.htmlFor = 'new-course-teacher'; label.textContent = 'Professor responsável';
      const select = document.createElement('select'); select.id = 'new-course-teacher'; select.className = 'form-control'; group.append(label, select); form.prepend(group);
      const updateTeachers = () => {
        const schoolId = document.getElementById('new-course-school')?.value || this.session.schoolId;
        const teachers = cache.teachers.filter(t => t.schoolId === schoolId);
        select.innerHTML = teachers.length ? teachers.map(t => `<option value="${escape(t.id)}">${escape(t.name)}</option>`).join('') : '<option value="">A definir — nenhum professor cadastrado</option>';
      };
      document.getElementById('new-course-school')?.addEventListener('change', updateTeachers); updateTeachers();
    }
    connectLabels(form);
  };
  PratikaApp.prototype.handleCreateCourse = function() {
    const field = id => document.getElementById(id)?.value.trim() || '';
    const schoolId = field('new-course-school') || this.session.schoolId;
    const teacherId = this.session.role === 'professor' ? this.session.userId : field('new-course-teacher') || null;
    const teacher = cache.teachers.find(t => t.id === teacherId);
    try {
      PratikaDB.addCourse({ title: field('new-course-title'), name: field('new-course-title'), level: field('new-course-level'), category: field('new-course-cat'), days: field('new-course-days'), hours: field('new-course-hours'), room: field('new-course-room'), description: field('new-course-desc'), schoolId, teacherId, instructor: teacher?.name || 'A definir' });
      this.closeModal(); this.renderInternalView(); this.showToast('Curso cadastrado com sucesso!', 'success');
    } catch { /* A ponte de persistência já apresenta o erro retornado pelo servidor. */ }
  };
  async function upload(file, schoolId) {
    if (!file || file.size > 10 * 1024 * 1024) throw new Error('Selecione um arquivo de até 10 MB.');
    const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file); });
    return request('/whitelabel/api/files', { name: file.name, base64, schoolId });
  }
  window.Backend.upload = upload;
  let uploadedMaterial = null;
  for (const name of ['addMaterialToModule', 'addMaterial', 'addActivityToModule']) {
    const original = PratikaDB[name];
    PratikaDB[name] = (...args) => {
      const data = name === 'addMaterial' ? args[0] : args[2];
      if (uploadedMaterial && data) {
        if (name === 'addActivityToModule') data.teacherAttachmentPdf = { name: uploadedMaterial.name, size: `${(uploadedMaterial.size / 1048576).toFixed(1)} MB`, url: uploadedMaterial.url };
        else { data.url = uploadedMaterial.url; data.downloadUrl = uploadedMaterial.url; data.fileId = uploadedMaterial.id; }
      }
      return original(...args);
    };
  }
  for (const [method, selector] of [['handleCreateMaterial', '#teacher-mat-file-input'], ['handleCreateActivity', '#teacher-task-pdf-file-input']]) {
    const original = PratikaApp.prototype[method];
    PratikaApp.prototype[method] = async function() {
      const form = document.querySelector('#action-modal-root form'); const button = form?.querySelector('button[type="submit"]');
      if (form?.dataset.saving) return;
      if (form) form.dataset.saving = 'true'; if (button) button.disabled = true;
      try {
        const input = document.querySelector(selector) || (method === 'handleCreateMaterial' ? document.querySelector('#action-modal-root input[type="file"]') : null);
        if (input?.files[0]) uploadedMaterial = await upload(input.files[0]);
        if (form && !form.isConnected) return;
        original.call(this);
      } catch (error) { this.showToast(error.message, 'warning'); } finally { uploadedMaterial = null; if (form) delete form.dataset.saving; if (button) button.disabled = false; }
    };
  }
  PratikaApp.prototype.handleStudentActivitySubmit = async function(courseId, moduleId, itemId) {
    const form = document.getElementById('student-submit-activity-form'); const button = form?.querySelector('button[type="submit"]');
    if (button?.disabled) return; if (button) button.disabled = true;
    try {
      const file = document.getElementById('submission-pdf-file')?.files[0];
      if (!file) throw new Error('Selecione o PDF com a sua resolução.');
      if (!file.name.toLowerCase().endsWith('.pdf')) throw new Error('A resolução deve ser um PDF.');
      const saved = await upload(file);
      PratikaDB.submitStudentActivity(courseId, moduleId, itemId, { fileName: saved.name, fileSize: `${(saved.size / 1048576).toFixed(1)} MB`, studentNotes: document.getElementById('submission-student-notes')?.value || '' });
      await request('/whitelabel/api/attachments', { fileId: saved.id, courseId, moduleId, itemId });
      await Backend.refresh(); this.showToast('PDF enviado para correção.', 'success'); this.renderInternalView();
    } catch (e) { this.showToast(e.message, 'warning'); } finally { if (button) button.disabled = false; }
  };
  PratikaApp.prototype.downloadFile = function(url) {
    if (!url || url === '#') { this.showToast('Este material de demonstração ainda não possui arquivo. Cadastre um material com upload.', 'info'); return; }
    const parsed = new URL(url, location.origin); if (!['http:', 'https:'].includes(parsed.protocol)) return;
    const link = document.createElement('a'); link.href = parsed.href; link.download = ''; link.rel = 'noopener'; link.click();
  };
  const originalSubmissions = PratikaApp.prototype.showActivitySubmissionsModal;
  PratikaApp.prototype.showActivitySubmissionsModal = function(courseId, moduleId, itemId) {
    originalSubmissions.call(this, courseId, moduleId, itemId);
    const item = cache.courses.find(c => c.id === courseId)?.modules.find(m => m.id === moduleId)?.items.find(i => i.id === itemId);
    const downloads = [...this.getModalRoot().querySelectorAll('button')].filter(b => b.textContent.includes('Baixar PDF do Aluno'));
    const grades = [...this.getModalRoot().querySelectorAll('button')].filter(b => /Atribuir Nota|Editar Nota/.test(b.textContent));
    (item?.submissions || []).forEach((submission, index) => {
      if (downloads[index]) { downloads[index].removeAttribute('onclick'); downloads[index].onclick = () => this.downloadFile(submission.url); }
      if (grades[index]) { grades[index].removeAttribute('onclick'); grades[index].onclick = () => {
        const root = this.getModalRoot(); root.innerHTML = `<div class="modal-overlay"><div class="school-modal-card auth-card" style="max-width:480px;padding:24px;background:white"><h3>Avaliar ${escape(submission.studentName)}</h3><form id="grade-form"><label>Nota (0 a ${escape(item.maxGrade || 10)})</label><input name="grade" class="form-control" type="number" min="0" max="${escape(item.maxGrade || 10)}" step="0.1" value="${escape(submission.grade ?? '')}" required><label>Feedback</label><textarea name="feedback" class="form-control">${escape(submission.feedback || '')}</textarea><p id="grade-error" role="status"></p><button class="btn btn-primary">Salvar avaliação</button><button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancelar</button></form></div></div>`;
        document.getElementById('grade-form').onsubmit = async event => { event.preventDefault(); try { await request('/whitelabel/api/grades', { ...Object.fromEntries(new FormData(event.currentTarget)), courseId, moduleId, itemId, studentId: submission.studentId }); await Backend.refresh(); this.showActivitySubmissionsModal(courseId, moduleId, itemId); } catch (e) { document.getElementById('grade-error').textContent = e.message; } };
      }; }
    });
  };
  const originalChat = PratikaApp.prototype.renderChatInterface;
  PratikaApp.prototype.renderChatInterface = function(...args) {
    originalChat.apply(this, args); this.refreshMessages();
  };
  PratikaApp.prototype.refreshMessages = async function() {
    const contact = this.activeChatContact?.id; const container = document.getElementById('chat-messages-container'); if (!container) return;
    try {
      const messages = await request('/whitelabel/api/messages'); if (!container.isConnected || contact !== this.activeChatContact?.id) return;
      container.replaceChildren();
      for (const message of messages.filter(m => m.recipientProfileId === contact || m.senderProfileId === contact)) {
        const bubble = document.createElement('div'); bubble.className = `chat-bubble ${message.senderProfileId === this.session.userId ? 'sent' : 'received'}`;
        bubble.textContent = message.text; const time = document.createElement('div'); time.className = 'chat-bubble-time'; time.textContent = new Date(message.createdAt).toLocaleString('pt-BR'); bubble.appendChild(time); container.appendChild(bubble);
      }
    } catch (e) { this.showToast(e.message, 'warning'); }
  };
  PratikaApp.prototype.sendChatMessage = async function(event) {
    event.preventDefault(); const input = document.getElementById('chat-input-field'); if (!input?.value.trim()) return;
    try { await request('/whitelabel/api/messages', { recipientId: this.activeChatContact?.id, text: input.value }); input.value = ''; await this.refreshMessages(); } catch (e) { this.showToast(e.message, 'warning'); }
  };
  const originalOpenChat = PratikaApp.prototype.openChatWithUser;
  PratikaApp.prototype.openChatWithUser = function(...args) { originalOpenChat.apply(this, args); if (this.session.role === 'professor') location.hash = '#/professor/mensagens'; else if (document.getElementById('chat-messages-container')) this.renderInternalView(); };
  setInterval(() => { if (document.getElementById('chat-messages-container')) window.app?.refreshMessages(); }, 5000);
  for (const method of ['showSimulateCheckoutModal', 'showStudentPaymentModal', 'showChangePaymentMethodModal']) PratikaApp.prototype[method] = function() { this.showToast('Pagamento online requer configurar o gateway. A escola pode registrar recebimentos manualmente no financeiro.', 'info'); };
  const originalAdminSettings = PratikaApp.prototype.renderAdminSettings;
  PratikaApp.prototype.renderAdminSettings = function(tabId = 'general', container) {
    originalAdminSettings.call(this, tabId, container);
    const form = container.querySelector('form'); if (!form) return;
    form.removeAttribute('onsubmit');
    const fields = [...form.querySelectorAll('input, select, textarea')];
    fields.filter(f => f.type === 'password').forEach(f => { f.value = ''; f.placeholder = 'Informe a credencial do serviço'; });
    fields.filter(f => f.readOnly && /^sk_/.test(f.value)).forEach(f => { f.value = 'Não configurado'; });
    const note = document.createElement('p'); note.style.cssText = 'font-size:13px;color:#64748b;margin:12px 0'; note.textContent = 'As configurações ficam salvas no servidor. Ativar LiveKit, gateway, DNS ou segundo fator exige configurar o serviço correspondente. O envio de e-mail usa as variáveis do arquivo .env.'; form.prepend(note);
    request('/whitelabel/api/admin/settings').then(settings => { if (!form.isConnected) return; (settings[tabId] || []).forEach((value, index) => { if (fields[index]) { fields[index].value = value.value; fields[index].checked = value.checked; } }); }).catch(e => this.showToast(e.message, 'warning'));
    form.onsubmit = async event => { event.preventDefault(); try { await request('/whitelabel/api/admin/settings', { tab: tabId, values: fields.map(f => ({ value: f.value, checked: f.checked })) }); this.showToast('Configurações salvas no servidor.', 'success'); } catch (e) { this.showToast(e.message, 'warning'); } };
  };
  PratikaApp.prototype.sendTestEmail = async function() { try { const result = await request('/whitelabel/api/email/test', {}); this.showToast(result.message, 'success'); } catch (e) { this.showToast(e.message, 'warning'); } };
  function simpleModal(app, title, content) {
    const root = app.getModalRoot();
    root.innerHTML = `<div class="modal-overlay"><section class="school-modal-card auth-card" role="dialog" aria-modal="true" aria-label="${escape(title)}" style="max-width:540px;padding:24px;background:white;color:#031735"><h2>${escape(title)}</h2>${content}<button type="button" class="btn btn-outline" onclick="app.closeModal()">Fechar</button></section></div>`;
    connectLabels(root); root.querySelector('input, button')?.focus(); return root;
  }
  PratikaApp.prototype.showUserAccounts = async function() {
    const root = simpleModal(this, 'Gerenciar usuários', '<p role="status">Carregando usuários…</p>');
    const loading = root.querySelector('[role="status"]');
    try {
      const accounts = await request('/whitelabel/api/accounts'); if (!loading.isConnected) return;
      simpleModal(this, 'Gerenciar usuários', `<p>Gerencie as contas que podem entrar na plataforma.</p><button type="button" class="btn btn-primary" id="users-create">Criar usuário</button><div class="form-group"><label>Buscar nome ou e-mail</label><input id="users-search" class="form-control" type="search" autocomplete="off"></div><div id="users-list" style="max-height:55vh;overflow:auto"></div>`);
      const list = root.querySelector('#users-list');
      const render = query => {
        const filtered = accounts.filter(a => `${a.userName} ${a.userEmail}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
        list.innerHTML = filtered.length ? filtered.map(a => `<article style="padding:12px 0;border-bottom:1px solid #ddd"><strong>${escape(a.userName)}</strong><p>${escape(a.userEmail)}</p><p>${escape({ aluno: 'Aluno', professor: 'Professor', escola: 'Gestor' }[a.role])} · ${a.canLogin ? 'Acesso ativo' : 'Acesso bloqueado'}${this.session.role === 'admin' ? ' · ' + escape(cache.schools.find(s => s.id === a.schoolId)?.name || '') : ''}</p><button type="button" class="btn btn-outline" data-user-id="${escape(a.id)}">Editar acesso</button></article>`).join('') : '<p>Nenhum usuário encontrado.</p>';
        list.querySelectorAll('[data-user-id]').forEach(button => { button.onclick = () => this.showEditUserAccount(accounts.find(a => a.id === button.dataset.userId)); });
      };
      root.querySelector('#users-create').onclick = () => this.showAccountModal();
      root.querySelector('#users-search').oninput = event => render(event.target.value); render('');
    } catch (e) { if (loading.isConnected) loading.textContent = e.message; }
  };
  PratikaApp.prototype.showEditUserAccount = function(account) {
    if (!account) return;
    const root = simpleModal(this, 'Editar usuário', `<form id="edit-user-form"><div class="form-group"><label>Nome</label><input name="name" class="form-control" value="${escape(account.userName)}" required maxlength="120"></div><div class="form-group"><label>E-mail</label><input name="email" class="form-control" type="email" value="${escape(account.userEmail)}" required></div><div class="form-group"><label>Acesso</label><select name="active" class="form-control"><option value="true" ${account.active ? 'selected' : ''}>Ativo</option><option value="false" ${!account.active ? 'selected' : ''}>Bloqueado</option></select></div><p>O cadastro acadêmico e a escola também precisam estar ativos para permitir a entrada.</p><p role="status" id="user-result"></p><button type="submit" class="btn btn-primary">Salvar usuário</button><button type="button" class="btn btn-outline" id="user-recovery">Enviar recuperação de senha</button><button type="button" class="btn btn-danger" id="user-delete">Excluir acesso</button></form>`);
    const form = root.querySelector('form'); const result = root.querySelector('#user-result');
    let busy = false;
    const run = async action => {
      if (busy) return; busy = true; const buttons = [...form.querySelectorAll('button')]; buttons.forEach(b => { b.disabled = true; }); result.textContent = '';
      try { await action(); } catch (e) { if (result.isConnected) result.textContent = e.message; }
      finally { busy = false; buttons.forEach(b => { b.disabled = false; }); }
    };
    form.onsubmit = event => { event.preventDefault(); run(async () => { const fields = Object.fromEntries(new FormData(form)); await request('/whitelabel/api/accounts/update', { id: account.id, name: fields.name, email: fields.email, active: fields.active === 'true' }); await Backend.refresh(); await this.showUserAccounts(); this.showToast('Usuário atualizado.', 'success'); }); };
    root.querySelector('#user-recovery').onclick = () => run(async () => { const response = await request('/whitelabel/api/auth/forgot-password', { email: account.userEmail }); result.textContent = response.message; });
    root.querySelector('#user-delete').onclick = () => {
      if (!window.confirm(`Excluir o acesso de ${account.userName}? O cadastro acadêmico será preservado. A pessoa deixará de conseguir entrar até que um novo acesso seja criado.`)) return;
      run(async () => { await request('/whitelabel/api/accounts/delete', { id: account.id }); await Backend.refresh(); await this.showUserAccounts(); this.showToast('Acesso excluído.', 'success'); });
    };
  };
  PratikaApp.prototype.showEditPlanModal = function(planId) {
    const plan = cache.plans.find(p => p.id === planId); if (!plan) return;
    const root = simpleModal(this, 'Editar plano', `<form id="edit-plan-form"><div class="form-group"><label>Nome</label><input name="name" class="form-control" required maxlength="120" value="${escape(plan.name)}"></div><div class="form-group"><label>Preço mensal</label><input name="price" type="number" min="0" step="0.01" class="form-control" required value="${escape(plan.price)}"></div><div class="form-group"><label>Recursos (um por linha)</label><textarea name="features" class="form-control" required>${escape(plan.features.join('\n'))}</textarea></div><p role="status"></p><button class="btn btn-primary" type="submit">Salvar plano</button></form>`);
    root.querySelector('form').onsubmit = event => {
      event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form));
      try { PratikaDB.updatePlan(planId, { name: data.name.trim(), price: Number(data.price), features: data.features.split('\n').map(f => f.trim()).filter(Boolean) }); this.closeModal(); this.renderInternalView(); this.showToast('Plano atualizado.', 'success'); }
      catch (e) { form.querySelector('[role="status"]').textContent = e.message; }
    };
  };
  PratikaApp.prototype.showProfilePhotoModal = function() {
    const root = simpleModal(this, 'Alterar foto', `<form><div class="form-group"><label>Endereço da imagem (HTTPS)</label><input name="photo" type="url" class="form-control" value="${escape(this.session.userPic)}" placeholder="https://..." required></div><p role="status"></p><button class="btn btn-primary" type="submit">Salvar foto</button></form>`);
    root.querySelector('form').onsubmit = async event => {
      event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); if (button.disabled) return; button.disabled = true;
      try { const photo = form.elements.photo.value.trim(); if (new URL(photo).protocol !== 'https:') throw new Error('Use um endereço HTTPS.'); const result = await request('/whitelabel/api/profile', { photo }); this.session.userPic = result.user.userPic; await Backend.refresh(); this.closeModal(); this.renderPortalLayout(); this.showToast('Foto salva.', 'success'); }
      catch (e) { form.querySelector('[role="status"]').textContent = e.message; } finally { button.disabled = false; }
    };
  };
  PratikaApp.prototype.showSchoolOverview = function(schoolId) {
    if (this.session.role !== 'admin') return;
    const school = cache.schools.find(s => s.id === schoolId); if (!school) return;
    simpleModal(this, school.name, `<p>Status: ${escape(school.status || 'Não informado')}</p><p>Alunos: ${cache.students.filter(s => s.schoolId === schoolId).length}</p><p>Professores: ${cache.teachers.filter(t => t.schoolId === schoolId).length}</p><p>Cursos: ${cache.courses.filter(c => c.schoolId === schoolId).length}</p><p>Para usar o portal, entre com a conta do gestor dessa escola.</p>`);
  };
  PratikaApp.prototype.showNotifications = function() {
    const pending = cache.financial.filter(f => f.status !== 'Pago');
    simpleModal(this, 'Resumo de avisos', `<p>${pending.length} cobrança(s) pendente(s).</p><p>${cache.events.length} evento(s) no calendário.</p><p>${cache.tasks.length} tarefa(s) disponível(is).</p><p>Consulte os detalhes nas seções do portal.</p>`);
  };
  PratikaApp.prototype.copyText = async function(text, message) {
    try { await navigator.clipboard.writeText(text); this.showToast(message, 'success'); }
    catch { this.showToast('Não foi possível copiar. Verifique a permissão da área de transferência.', 'warning'); }
  };
  PratikaApp.prototype.copyPaymentLink = function(billId) {
    const bill = cache.financial.find(f => f.id === billId); if (!bill) return;
    if (bill.status === 'Pago') { this.showReceiptModal(billId); return; }
    const text = `Cobrança: ${bill.description || bill.desc || 'Mensalidade'}\nAluno: ${bill.studentName}\nValor: R$ ${Number(bill.value ?? bill.amount ?? 0).toFixed(2)}\nVencimento: ${bill.dueDate || 'Consulte a escola'}\nReferência: ${bill.id}\nEntre em contato com a escola para combinar o pagamento.`;
    return this.copyText(text, 'Dados da cobrança copiados.');
  };
  PratikaApp.prototype.sendWhatsAppBilling = function(billId) { return this.copyPaymentLink(billId); };
  PratikaApp.prototype.showReceiptModal = function(billId) {
    const bill = cache.financial.find(f => f.id === billId);
    if (!bill || bill.status !== 'Pago') { this.showToast('Recibo disponível apenas para uma cobrança paga.', 'warning'); return; }
    const school = cache.schools.find(s => s.id === bill.schoolId);
    simpleModal(this, 'Recibo de recebimento', `<p><strong>${escape(school?.name || 'Escola')}</strong></p><p>Aluno: ${escape(bill.studentName)}</p><p>Descrição: ${escape(bill.description || bill.desc || 'Mensalidade')}</p><p>Valor: R$ ${Number(bill.value ?? bill.amount ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p><p>Recebimento: ${bill.paidAt ? escape(new Date(bill.paidAt).toLocaleString('pt-BR')) : 'Data não registrada no cadastro anterior'}</p><p>Referência: ${escape(bill.id)}</p><p>Recebimento registrado manualmente pela escola.</p><button type="button" class="btn btn-primary" onclick="window.print()">Imprimir / PDF</button><button type="button" class="btn btn-secondary" onclick="app.sendReceiptEmail('${escape(bill.id)}')">Enviar por e-mail</button>`);
  };
  PratikaApp.prototype.showRecordedLessonModal = function(lessonId) {
    const lesson = cache.lessons.find(l => l.id === lessonId);
    if (!lesson) { this.showToast('Aula não encontrada.', 'warning'); return; }
    const videoUrl = lesson.videoUrl || lesson.recordingUrl;
    if (!videoUrl) { this.showToast('A escola ainda não cadastrou a gravação desta aula.', 'info'); return; }
    let parsed; try { parsed = new URL(videoUrl, location.origin); } catch { this.showToast('Endereço de gravação inválido.', 'warning'); return; }
    if (!['https:', 'http:'].includes(parsed.protocol)) { this.showToast('Endereço de gravação inválido.', 'warning'); return; }
    simpleModal(this, lesson.title, `<video controls playsinline preload="metadata" src="${escape(parsed.href)}" style="width:100%"></video>`);
  };
  PratikaApp.prototype.sendReceiptEmail = async function(financialId) { try { const result = await request('/whitelabel/api/email/receipt', { financialId }); this.showToast(result.message, 'success'); } catch (e) { this.showToast(e.message, 'warning'); } };
  PratikaApp.prototype.handleSaveTeacherProfile = async function(teacherId) {
    const password = document.getElementById('prof-edit-new-pass')?.value;
    if (password && password !== document.getElementById('prof-edit-confirm-pass')?.value) { this.showToast('As senhas não conferem.', 'warning'); return; }
    const fields = Object.fromEntries(['name', 'email', 'phone', 'photo', 'specialty', 'bio'].map(key => [key, document.getElementById('prof-edit-' + key)?.value || '']));
    try {
      const result = await request('/whitelabel/api/profile', { ...fields, currentPassword: document.getElementById('prof-edit-cur-pass')?.value, newPassword: password });
      if (result.passwordChanged) { discardSession('professor'); this.showToast('Perfil e senha salvos. Entre novamente.', 'success'); }
      else { this.session.userName = result.user.userName; this.session.userPic = result.user.userPic; await Backend.refresh(); this.renderPortalLayout(); this.showToast('Perfil salvo.', 'success'); }
    } catch (e) { this.showToast(e.message, 'warning'); }
  };
  window.addEventListener('unhandledrejection', event => { window.app?.showToast(event.reason?.message || 'Falha na operação.', 'warning'); });
  async function boot() {
    let user;
    try { user = (await request('/whitelabel/api/auth/me')).user; cache = await request('/whitelabel/api/bootstrap'); }
    catch { try { cache.schools = await request('/whitelabel/api/public/schools'); } catch { document.getElementById('app-root').textContent = 'Servidor indisponível. Inicie com npm start e abra http://localhost:3000.'; return; } }
    // A instância só é inicializada após recuperar a sessão e os dados do servidor.
    const init = PratikaApp.prototype.init; PratikaApp.prototype.init = function() {};
    const app = new PratikaApp(); window.app = app; PratikaApp.prototype.init = init;
    if (user) app.session = { role: user.role, schoolId: user.schoolId, userId: user.userId, userName: user.userName, userEmail: user.userEmail, userPic: user.userPic };
    init.call(app);
    if (user && (!location.hash || location.hash.startsWith('#/auth/') && !location.hash.startsWith('#/auth/reset/'))) await app.acceptSession(user);
  }
  boot();
})();
