/* Conteúdo acadêmico: cursos e módulos são a fonte das aulas, materiais e entregas. */
(() => {
  const esc = Backend.escape;
  const db = () => PratikaDB.getDB();
  const isStaff = app => ['admin', 'escola', 'professor'].includes(app.session.role);
  const published = item => item.published !== false && item.status !== 'draft';
  const path = (app, view, ...ids) => `#/${app.session.role}/${view}${ids.length ? '/' + ids.map(encodeURIComponent).join('/') : ''}`;
  const link = (app, label, view, ...ids) => `<a class="btn btn-outline" href="${esc(path(app, view, ...ids))}">${esc(label)}</a>`;
  const button = (label, action, data = {}, style = 'btn-outline') => `<button type="button" class="btn ${style}" data-action="${action}" ${Object.entries(data).map(([key, value]) => `data-${key}="${esc(value)}"`).join(' ')}>${esc(label)}</button>`;
  const field = (name, label, value = '', type = 'text', extra = '') => `<div class="form-group"><label for="academic-${name}">${esc(label)}</label><input id="academic-${name}" name="${name}" type="${type}" class="form-control" value="${esc(value)}" ${extra}></div>`;
  const area = (name, label, value = '', extra = '') => `<div class="form-group"><label for="academic-${name}">${esc(label)}</label><textarea id="academic-${name}" name="${name}" class="form-control" ${extra}>${esc(value)}</textarea></div>`;
  const check = (name, label, checked) => `<label><input name="${name}" type="checkbox" ${checked ? 'checked' : ''}> ${esc(label)}</label>`;
  const dateValue = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? value : /^\d{2}\/\d{2}\/\d{4}$/.test(value || '') ? value.split('/').reverse().join('-') : '';
  const dateLabel = value => !value ? 'Sem prazo' : /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value;
  const items = course => (course.modules || []).flatMap(mod => (mod.items || []).map(item => ({ course, mod, item })));
  const allItems = () => db().courses.flatMap(items);
  const progress = (course, userId) => { const lessons = items(course).filter(r => r.item.type === 'lesson' && published(r.item)); const done = lessons.filter(r => r.item.completedBy?.includes(userId)).length; return { total: lessons.length, done, percent: lessons.length ? Math.round(100 * done / lessons.length) : 0 }; };
  const subStatus = sub => !sub ? 'Não entregue' : sub.gradedAt || sub.grade != null ? 'Corrigida' : 'Aguardando correção';
  const download = material => material.url && material.url !== '#' ? `<a class="btn btn-outline" href="${esc(material.url)}" target="_blank" rel="noopener noreferrer">Baixar ${esc(material.title || material.name || 'arquivo')}</a>` : '<span class="muted">Arquivo ainda não cadastrado</span>';
  async function save(action, values) { const result = await Backend.request('/whitelabel/api/learning/' + action, values); await Backend.refresh(); return result; }
  function modal(app, title, html, onSave, submitLabel = 'Salvar') {
    const root = app.getModalRoot();
    root.innerHTML = `<div class="modal-overlay"><section class="academic-modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="academic-modal-header"><h2>${esc(title)}</h2><button type="button" class="btn btn-outline" data-close aria-label="Fechar">×</button></div><form>${html}<p role="status"></p><div class="academic-actions"><button type="submit" class="btn btn-primary">${esc(submitLabel)}</button><button type="button" class="btn btn-outline" data-close>Cancelar</button></div></form></section></div>`;
    root.querySelectorAll('[data-close]').forEach(b => { b.onclick = () => app.closeModal(); });
    const form = root.querySelector('form'); form.querySelector('input,textarea,select')?.focus();
    form.onsubmit = async event => {
      event.preventDefault(); const submit = form.querySelector('[type=submit]'); if (submit.disabled) return; submit.disabled = true;
      const status = form.querySelector('[role=status]'); status.textContent = 'Salvando…';
      try { await onSave(form); if (form.isConnected) { app.closeModal(); app.renderInternalView(); app.showToast('Salvo com sucesso.', 'success'); } }
      catch (e) { if (status.isConnected) status.textContent = e.message; } finally { submit.disabled = false; }
    };
    return form;
  }
  function editCourse(app, course) {
    const data = db();
    const schools = app.session.role === 'admin' ? data.schools : data.schools.filter(s => s.id === app.session.schoolId);
    const form = modal(app, course ? 'Editar curso' : 'Criar curso', `${field('title', 'Nome do curso', course?.title || course?.name || '', 'text', 'required maxlength="160"')}${area('description', 'Descrição', course?.description || '')}<div class="form-group"><label for="academic-schoolId">Escola</label><select name="schoolId" id="academic-schoolId" class="form-control" ${course ? 'disabled' : ''}>${schools.map(s => `<option value="${esc(s.id)}" ${s.id === course?.schoolId ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></div>${app.session.role !== 'professor' ? '<div class="form-group"><label for="academic-teacherId">Professor responsável</label><select name="teacherId" id="academic-teacherId" class="form-control"></select></div>' : ''}${check('allStudents', 'Disponível para todos os alunos da escola', !Array.isArray(course?.studentIds))}<div class="form-group"><label for="academic-students">Alunos matriculados (Ctrl/Cmd para selecionar vários)</label><select name="students" id="academic-students" multiple class="form-control"></select></div>${check('published', 'Publicar curso para os alunos', course ? published(course) : true)}`, async form => {
      const f = form.elements;
      await save('course', { courseId: course?.id, schoolId: f.schoolId.value, teacherId: f.teacherId?.value || null, title: f.title.value, description: f.description.value, studentIds: f.allStudents.checked ? null : [...f.students.selectedOptions].map(o => o.value), published: f.published.checked });
    });
    const fill = () => {
      const schoolId = form.elements.schoolId.value;
      if (form.elements.teacherId) form.elements.teacherId.innerHTML = '<option value="">A definir</option>' + data.teachers.filter(t => t.schoolId === schoolId).map(t => `<option value="${esc(t.id)}" ${t.id === course?.teacherId ? 'selected' : ''}>${esc(t.name)}</option>`).join('');
      form.elements.students.innerHTML = data.students.filter(s => s.schoolId === schoolId).map(s => `<option value="${esc(s.id)}" ${course?.studentIds?.includes(s.id) ? 'selected' : ''}>${esc(s.name)} — ${esc(s.email || '')}</option>`).join('');
      form.elements.students.disabled = form.elements.allStudents.checked;
    };
    form.elements.schoolId.onchange = fill; form.elements.allStudents.onchange = () => { form.elements.students.disabled = form.elements.allStudents.checked; }; fill();
  }
  function editModule(app, course, mod) {
    modal(app, mod ? 'Editar módulo' : 'Criar módulo', field('title', 'Título', mod?.title || '', 'text', 'required maxlength="160"') + area('description', 'Descrição', mod?.description || ''), form => save('module', { courseId: course.id, moduleId: mod?.id, title: form.elements.title.value, description: form.elements.description.value }));
  }
  function editItem(app, course, mod, type, item) {
    const lesson = type === 'lesson';
    const form = modal(app, `${item ? 'Editar' : 'Criar'} ${lesson ? 'aula gravada' : 'atividade'}`, `${field('title', 'Título', item?.title || '', 'text', 'required maxlength="160"')}${lesson ? field('videoUrl', 'Endereço do vídeo (MP4, YouTube ou Vimeo)', item?.videoUrl || '', 'url') + field('duration', 'Duração (ex.: 15 min)', item?.duration || '') + area('description', 'Descrição da aula', item?.description || '') : area('statement', 'Enunciado', item?.statement || '', 'required') + area('evaluationCriteria', 'Critérios de avaliação', item?.evaluationCriteria || '') + check('hasGrade', 'Atividade com nota', item?.hasGrade !== false) + field('maxGrade', 'Nota máxima', item?.maxGrade ?? 10, 'number', 'min="0.1" max="1000" step="0.1"') + field('startDate', 'Disponível a partir de', dateValue(item?.startDate), 'date') + field('dueDate', 'Prazo de entrega', dateValue(item?.dueDate), 'date') + check('allowLate', 'Permitir entrega após o prazo', item?.allowLate === true)}${check('published', 'Publicar para os alunos', item ? published(item) : true)}<p>Materiais de apoio podem ser anexados após salvar.</p>`, form => {
      const values = Object.fromEntries(new FormData(form));
      return save('item', { ...values, courseId: course.id, moduleId: mod.id, itemId: item?.id, type, hasGrade: form.elements.hasGrade?.checked, allowLate: !!form.elements.allowLate?.checked, published: form.elements.published.checked });
    });
    if (!lesson) {
      const toggleGrade = () => { form.elements.maxGrade.disabled = !form.elements.hasGrade.checked; if (form.elements.hasGrade.checked && Number(form.elements.maxGrade.value) <= 0) form.elements.maxGrade.value = '10'; };
      form.elements.hasGrade.onchange = toggleGrade; toggleGrade();
    }
  }
  function editMaterial(app, course, mod, item, material) {
    modal(app, material ? 'Editar material' : 'Adicionar material', `${field('title', 'Título do material', material?.title || '', 'text', 'required maxlength="160"')}${field('url', 'Link do material (opcional quando enviar arquivo)', material?.fileId ? '' : material?.url === '#' ? '' : material?.url || '', 'url')}${field('file', 'Arquivo de até 10 MB', '', 'file')}<p>Você pode enviar um arquivo ou informar um link. Um novo arquivo substitui o anterior.</p>`, async form => {
      const file = form.elements.file.files[0]; const upload = file ? await Backend.upload(file, course.schoolId) : null; if (!form.isConnected) return;
      const url = form.elements.url.value.trim();
      await save('material', { courseId: course.id, moduleId: mod.id, itemId: item?.id, materialId: material?.id, title: form.elements.title.value, url, fileId: upload?.id || (!url ? material?.fileId : null) });
    });
  }
  function materials(app, course, mod, item) {
    const records = (item || mod).materials || [];
    return records.length ? `<div class="academic-row"><strong>Materiais de apoio</strong>${records.map(m => `<div class="academic-actions">${download(m)}${isStaff(app) ? button('Editar material', 'material', { course: course.id, module: mod.id, item: item?.id || '', material: m.id }) + button('Remover material', 'delete-material', { course: course.id, module: mod.id, item: item?.id || '', material: m.id }) : ''}</div>`).join('')}</div>` : '';
  }
  function courseList(app, container) {
    const courses = db().courses; const staff = isStaff(app);
    container.innerHTML = `<div class="academic"><div class="academic-toolbar"><div><h2>${staff ? 'Cursos e conteúdos' : 'Meus cursos'}</h2><p class="muted">Aulas gravadas, atividades e materiais em um só lugar.</p></div>${staff ? button('Criar curso', 'course', {}, 'btn-primary') : ''}</div><div class="form-group"><label for="academic-search">Buscar curso</label><input id="academic-search" class="form-control" type="search" placeholder="Nome do curso"></div><div class="academic-grid" id="academic-courses"></div></div>`;
    const render = query => {
      const filtered = courses.filter(c => (c.title || c.name).toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
      container.querySelector('#academic-courses').innerHTML = filtered.length ? filtered.map(c => { const p = progress(c, app.session.userId); return `<article class="academic-card"><span class="academic-badge">${published(c) ? 'Publicado' : 'Rascunho'}</span><h3>${esc(c.title || c.name)}</h3><p class="muted academic-text">${esc(c.description || '')}</p><p>${c.modules?.length || 0} módulos · ${p.total} aulas</p>${!staff ? `<label>${p.done}/${p.total} aulas concluídas (${p.percent}%)<progress max="100" value="${p.percent}"></progress></label>` : `<p class="muted">${esc(c.instructor || 'Professor a definir')}</p>`}<div class="academic-actions">${link(app, 'Abrir curso', 'curso', c.id)}${staff ? button('Editar', 'course', { course: c.id }) + button('Excluir', 'delete-course', { course: c.id }) : ''}</div></article>`; }).join('') : '<p>Nenhum curso disponível.</p>';
    };
    container.querySelector('#academic-search').oninput = e => render(e.target.value); render(''); bind(app, container);
  }
  function courseView(app, container, course) {
    const staff = isStaff(app); const p = progress(course, app.session.userId);
    container.innerHTML = `<div class="academic">${link(app, 'Voltar aos cursos', 'cursos')}<section class="academic-card"><div class="academic-toolbar"><h2>${esc(course.title || course.name)}</h2>${staff ? button('Editar curso', 'course', { course: course.id }) : ''}</div><p class="academic-text">${esc(course.description || '')}</p>${staff ? `<p class="muted">${published(course) ? 'Publicado' : 'Rascunho'} · ${Array.isArray(course.studentIds) ? course.studentIds.length + ' alunos selecionados' : 'Todos os alunos da escola'}</p>` : `<label>${p.done}/${p.total} aulas concluídas<progress max="100" value="${p.percent}"></progress></label>`}</section>${staff ? button('Adicionar módulo', 'module', { course: course.id }, 'btn-primary') : ''}${(course.modules || []).map(mod => `<section class="academic-card"><div class="academic-toolbar"><h3>${esc(mod.title)}</h3>${staff ? `<div class="academic-actions">${button('Editar módulo', 'module', { course: course.id, module: mod.id })}${button('Excluir módulo', 'delete-module', { course: course.id, module: mod.id })}</div>` : ''}</div><p class="academic-text muted">${esc(mod.description || '')}</p>${staff ? `<div class="academic-actions">${button('Adicionar aula', 'lesson', { course: course.id, module: mod.id }, 'btn-primary')}${button('Adicionar atividade', 'activity', { course: course.id, module: mod.id })}${button('Adicionar material', 'material', { course: course.id, module: mod.id })}</div>` : ''}${(mod.items || []).map((item, index) => `<article class="academic-row"><div class="academic-toolbar"><strong>${item.type === 'lesson' ? 'Aula' : 'Atividade'}: ${esc(item.title)}</strong><span class="academic-badge">${!published(item) ? 'Rascunho' : item.type === 'lesson' ? item.completedBy?.includes(app.session.userId) ? 'Concluída' : 'Aula gravada' : staff ? (item.submissions?.length || 0) + ' entregas' : subStatus(item.submissions?.find(s => s.studentId === app.session.userId))}</span></div><div class="academic-actions">${link(app, item.type === 'lesson' ? 'Assistir' : 'Abrir atividade', item.type === 'lesson' ? 'assistir' : 'atividade', course.id, mod.id, item.id)}${staff ? button('Editar', item.type, { course: course.id, module: mod.id, item: item.id }) + button('Excluir', 'delete-item', { course: course.id, module: mod.id, item: item.id }) + (index ? button('↑ Subir', 'up', { course: course.id, module: mod.id, item: item.id }) : '') + (index < mod.items.length - 1 ? button('↓ Descer', 'down', { course: course.id, module: mod.id, item: item.id }) : '') : ''}</div></article>`).join('') || '<p class="muted">Nenhum conteúdo neste módulo.</p>'}${materials(app, course, mod)}</section>`).join('') || '<p>Nenhum módulo cadastrado.</p>'}</div>`;
    bind(app, container);
  }
  function videoMarkup(raw) {
    if (!raw) return '<p>Vídeo ainda não cadastrado.</p>';
    let url; try { url = new URL(raw); } catch { return '<p>Endereço de vídeo inválido.</p>'; }
    if (!['http:', 'https:'].includes(url.protocol)) return '<p>Endereço de vídeo inválido.</p>';
    const host = url.hostname.replace(/^www\./, ''); let embed;
    if (['youtube.com', 'm.youtube.com', 'youtu.be'].includes(host)) {
      const id = host === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)?.[1];
      if (/^[\w-]{11}$/.test(id || '')) embed = `https://www.youtube-nocookie.com/embed/${id}`;
    } else if (host === 'vimeo.com' && /^\/\d+$/.test(url.pathname)) embed = 'https://player.vimeo.com/video' + url.pathname;
    return `${embed ? `<iframe class="academic-video" src="${esc(embed)}" title="Videoaula" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>` : `<video class="academic-video" controls playsinline preload="metadata" src="${esc(url.href)}"></video>`}<p class="muted">Se o vídeo não carregar, confira o endereço ou as permissões do provedor. <a target="_blank" rel="noopener noreferrer" href="${esc(url.href)}">Abrir vídeo em outra aba</a></p>`;
  }
  function lessonView(app, container, course, mod, item) {
    const staff = isStaff(app); const sequence = items(course); const index = sequence.findIndex(r => r.item.id === item.id); const next = sequence[index + 1];
    container.innerHTML = `<div class="academic">${link(app, 'Voltar ao curso', 'curso', course.id)}<section class="academic-card"><div class="academic-toolbar"><h2>${esc(item.title)}</h2>${staff ? button('Editar aula', 'lesson', { course: course.id, module: mod.id, item: item.id }) : ''}</div><p class="muted">${esc(mod.title)} · ${esc(item.duration || 'Duração não informada')}</p>${videoMarkup(item.videoUrl)}<p class="academic-text">${esc(item.description || '')}</p><div class="academic-actions">${staff ? button('Adicionar material', 'material', { course: course.id, module: mod.id, item: item.id }) : button(item.completedBy?.includes(app.session.userId) ? 'Desmarcar conclusão' : 'Marcar como concluída', 'completion', { course: course.id, module: mod.id, item: item.id }, 'btn-primary')}${next ? link(app, 'Próximo conteúdo', next.item.type === 'lesson' ? 'assistir' : 'atividade', course.id, next.mod.id, next.item.id) : link(app, 'Voltar aos módulos', 'curso', course.id)}</div>${materials(app, course, mod, item)}</section></div>`;
    bind(app, container);
  }
  function activityView(app, container, course, mod, item) {
    const staff = isStaff(app); const sub = item.submissions?.find(s => s.studentId === app.session.userId);
    container.innerHTML = `<div class="academic">${link(app, 'Voltar ao curso', 'curso', course.id)}<section class="academic-card"><div class="academic-toolbar"><h2>${esc(item.title)}</h2>${staff ? button('Editar atividade', 'activity', { course: course.id, module: mod.id, item: item.id }) : ''}</div><p class="muted">Abertura: ${item.startDate ? esc(dateLabel(item.startDate)) : 'Imediata'} · Prazo: ${esc(dateLabel(item.dueDate))}${item.allowLate ? ' · Aceita entregas atrasadas' : ''}</p><p class="academic-text">${esc(item.statement || '')}</p>${item.evaluationCriteria ? `<h3>Critérios</h3><p class="academic-text">${esc(item.evaluationCriteria)}</p>` : ''}<p>${item.hasGrade === false ? 'Atividade sem nota' : 'Nota máxima: ' + esc(item.maxGrade ?? 10)}</p>${item.teacherAttachmentPdf ? download(item.teacherAttachmentPdf) : ''}${materials(app, course, mod, item)}${staff ? button('Adicionar material', 'material', { course: course.id, module: mod.id, item: item.id }) : ''}</section>${staff ? `<section class="academic-card"><h3>Entregas dos alunos</h3>${(item.submissions || []).map(s => `<article class="academic-row"><strong>${esc(s.studentName || db().students.find(p => p.id === s.studentId)?.name || 'Aluno')}</strong><p>${subStatus(s)}${s.grade != null ? ' · Nota: ' + esc(s.grade) + '/' + esc(item.maxGrade) : ''}</p><p class="academic-text">${esc(s.studentNotes || '')}</p>${s.url ? download({ title: s.fileName, url: s.url }) : ''}<p class="academic-text">${esc(s.feedback || '')}</p><div class="academic-actions">${button('Corrigir / dar feedback', 'grade', { course: course.id, module: mod.id, item: item.id, student: s.studentId }, 'btn-primary')}${s.gradedAt || s.grade != null ? button('Reabrir entrega', 'reopen', { course: course.id, module: mod.id, item: item.id, student: s.studentId }) : ''}</div></article>`).join('') || '<p>Nenhuma entrega recebida.</p>'}</section>` : `<section class="academic-card"><h3>Minha entrega</h3><p>${subStatus(sub)}</p>${sub ? `<p class="academic-text">${esc(sub.studentNotes || '')}</p>${sub.url ? download({ title: sub.fileName, url: sub.url }) : ''}${sub.gradedAt || sub.grade != null ? `<div class="academic-feedback"><strong>${sub.grade != null ? 'Nota: ' + esc(sub.grade) + '/' + esc(item.maxGrade) : 'Atividade corrigida'}</strong><p class="academic-text">${esc(sub.feedback || 'Sem comentário adicional.')}</p></div>` : ''}` : '<p>Envie sua resposta em texto ou anexe um arquivo de até 10 MB.</p>'}${!sub?.gradedAt && sub?.grade == null ? button(sub ? 'Substituir entrega' : 'Enviar resposta', 'submit', { course: course.id, module: mod.id, item: item.id }, 'btn-primary') : '<p class="muted">Para enviar novamente, peça ao professor para reabrir a entrega.</p>'}</section>`}</div>`;
    bind(app, container);
  }
  function listing(app, container, view) {
    const lesson = view === 'aulas'; const material = view === 'materiais'; const records = allItems().filter(r => r.item.type === (lesson ? 'lesson' : 'activity'));
    const materialRecords = db().courses.flatMap(course => (course.modules || []).flatMap(mod => [{ course, mod, records: mod.materials || [] }, ...(mod.items || []).map(item => ({ course, mod, item, records: [...(item.materials || []), ...(item.teacherAttachmentPdf ? [{ ...item.teacherAttachmentPdf, title: item.teacherAttachmentPdf.name }] : [])] }))]));
    container.innerHTML = `<div class="academic"><div class="academic-toolbar"><h2>${material ? 'Materiais de estudo' : lesson ? 'Aulas gravadas' : 'Atividades'}</h2>${link(app, isStaff(app) ? 'Gerenciar pelos cursos' : 'Ver meus cursos', 'cursos')}</div>${material ? materialRecords.filter(r => r.records.length).map(r => `<article class="academic-card"><h3>${esc(r.course.title || r.course.name)} · ${esc(r.item?.title || r.mod.title)}</h3><div class="academic-actions">${r.records.map(download).join('')}</div></article>`).join('') || '<p>Nenhum material disponível.</p>' : records.map(r => `<article class="academic-card"><div class="academic-toolbar"><h3>${esc(r.item.title)}</h3><span class="academic-badge">${!published(r.item) ? 'Rascunho' : lesson ? r.item.completedBy?.includes(app.session.userId) ? 'Concluída' : 'Aula gravada' : isStaff(app) ? (r.item.submissions?.length || 0) + ' entregas' : subStatus(r.item.submissions?.find(s => s.studentId === app.session.userId))}</span></div><p class="muted">${esc(r.course.title || r.course.name)} · ${esc(r.mod.title)}${!lesson ? ' · ' + esc(dateLabel(r.item.dueDate)) : ''}</p>${link(app, lesson ? 'Assistir aula' : 'Abrir atividade', lesson ? 'assistir' : 'atividade', r.course.id, r.mod.id, r.item.id)}</article>`).join('') || '<p>Nenhum conteúdo disponível. Adicione conteúdos nos módulos de um curso.</p>'}</div>`;
  }
  function bind(app, container) {
    container.onclick = async event => {
      const b = event.target.closest('[data-action]'); if (!b || !container.contains(b) || b.disabled) return;
      const a = b.dataset.action; const course = db().courses.find(c => c.id === b.dataset.course); const mod = course?.modules?.find(m => m.id === b.dataset.module); const item = mod?.items?.find(i => i.id === b.dataset.item);
      const payload = { courseId: course?.id, moduleId: mod?.id, itemId: item?.id, studentId: b.dataset.student, materialId: b.dataset.material };
      if (a === 'course') { editCourse(app, course); return; }
      if (a === 'module') { editModule(app, course, mod); return; }
      if (a === 'lesson' || a === 'activity') { editItem(app, course, mod, a, item); return; }
      if (a === 'material') { editMaterial(app, course, mod, item, (item || mod)?.materials?.find(m => m.id === b.dataset.material)); return; }
      if (a === 'submit') {
        const previous = item.submissions?.find(s => s.studentId === app.session.userId);
        modal(app, 'Enviar atividade', area('notes', 'Sua resposta', previous?.studentNotes || '', 'maxlength="30000"') + field('file', 'Arquivo de até 10 MB (opcional)', '', 'file') + '<p>Ao substituir, o arquivo anterior será removido da entrega. Selecione-o novamente caso queira mantê-lo.</p>', async form => {
          const file = form.elements.file.files[0]; const upload = file ? await Backend.upload(file, course.schoolId) : null; if (!form.isConnected) return;
          await save('submit', { ...payload, notes: form.elements.notes.value, fileId: upload?.id });
        }, 'Enviar resposta'); return;
      }
      if (a === 'grade') {
        const sub = item.submissions.find(s => s.studentId === b.dataset.student);
        modal(app, 'Corrigir atividade', (item.hasGrade !== false ? field('grade', `Nota (0 a ${item.maxGrade})`, sub.grade ?? '', 'number', `required min="0" max="${Number(item.maxGrade)}" step="0.1"`) : '<p>Atividade sem nota: registre o feedback.</p>') + area('feedback', 'Feedback para o aluno', sub.feedback || ''), form => save('grade', { ...payload, grade: form.elements.grade?.value, feedback: form.elements.feedback.value })); return;
      }
      if (a.startsWith('delete-') && !window.confirm('Excluir este conteúdo? Os materiais, entregas e progresso associados a ele deixarão de aparecer.')) return;
      if (a === 'reopen' && !window.confirm('Reabrir esta entrega? A nota e o feedback atuais serão removidos para permitir um novo envio.')) return;
      b.disabled = true;
      try { await save(a === 'up' || a === 'down' ? 'move-item' : a, { ...payload, direction: a, completed: !item?.completedBy?.includes(app.session.userId) }); if (a === 'delete-course') location.hash = path(app, 'cursos'); else app.renderInternalView(); }
      catch (e) { app.showToast(e.message, 'warning'); } finally { b.disabled = false; }
    };
  }
  const original = PratikaApp.prototype.renderInternalView;
  PratikaApp.prototype.renderInternalView = function() {
    if (this.session.role === 'professor' && this.currentView === 'alunos') {
      const data = db(); const students = data.students.filter(s => data.courses.some(c => !Array.isArray(c.studentIds) || c.studentIds.includes(s.id)));
      const container = document.getElementById('portal-main-view'); container.onclick = null;
      container.innerHTML = `<div class="academic"><h2>Alunos dos seus cursos</h2>${students.map(student => {
        const courses = data.courses.filter(c => !Array.isArray(c.studentIds) || c.studentIds.includes(student.id));
        const records = courses.flatMap(items); const lessons = records.filter(r => r.item.type === 'lesson' && published(r.item)); const done = lessons.filter(r => r.item.completedBy?.includes(student.id)).length;
        const submissions = records.flatMap(r => (r.item.submissions || []).filter(s => s.studentId === student.id));
        return `<article class="academic-card"><h3>${esc(student.name)}</h3><p>${esc(student.email || '')}</p><p class="muted">${courses.map(c => esc(c.title || c.name)).join(' · ')}</p><p>${done}/${lessons.length} aulas concluídas · ${submissions.length} entregas · ${submissions.filter(s => s.gradedAt || s.grade != null).length} corrigidas</p><progress max="100" value="${lessons.length ? Math.round(done / lessons.length * 100) : 0}"></progress></article>`;
      }).join('') || '<p>Nenhum aluno matriculado nos seus cursos.</p>'}</div>`; return;
    }
    if (this.session.role === 'aluno' && this.currentView === 'home' || this.session.role === 'professor' && this.currentView === 'dashboard') {
      const courses = db().courses; const records = allItems(); const lessons = records.filter(r => r.item.type === 'lesson'); const activities = records.filter(r => r.item.type === 'activity'); const staff = isStaff(this);
      const pending = staff ? activities.reduce((sum, r) => sum + (r.item.submissions || []).filter(s => !s.gradedAt && s.grade == null).length, 0) : activities.filter(r => !r.item.submissions?.some(s => s.studentId === this.session.userId)).length;
      const container = document.getElementById('portal-main-view'); container.onclick = null;
      container.innerHTML = `<div class="academic"><h2>${staff ? 'Acompanhamento das turmas' : 'Continue seus estudos'}</h2><div class="academic-grid"><article class="academic-card"><h3>${courses.length} cursos</h3>${link(this, 'Abrir cursos', 'cursos')}</article><article class="academic-card"><h3>${lessons.length} aulas gravadas</h3>${link(this, 'Ver aulas', 'aulas')}</article><article class="academic-card"><h3>${pending} ${staff ? 'entregas para corrigir' : 'atividades sem entrega'}</h3>${link(this, 'Ver atividades', staff ? 'atividades' : 'tarefas')}</article></div><section class="academic-card"><h3>${staff ? 'Cursos sob sua responsabilidade' : 'Seu progresso'}</h3>${courses.map(c => { const p = progress(c, this.session.userId); return `<div class="academic-row"><strong>${esc(c.title || c.name)}</strong>${staff ? `<p>${items(c).filter(r => r.item.type === 'activity').length} atividades</p>` : `<label>${p.done}/${p.total} aulas concluídas (${p.percent}%)<progress max="100" value="${p.percent}"></progress></label>`}${link(this, 'Abrir curso', 'curso', c.id)}</div>`; }).join('') || '<p>Nenhum curso disponível.</p>'}</section></div>`;
      return;
    }
    const views = ['cursos', 'curso', 'assistir', 'atividade', 'aulas', 'atividades', 'tarefas', 'materiais'];
    if (!views.includes(this.currentView)) { original.call(this); return; }
    const container = document.getElementById('portal-main-view'); container.onclick = null;
    if (this.currentView === 'cursos') { courseList(this, container); return; }
    if (['aulas', 'atividades', 'tarefas', 'materiais'].includes(this.currentView)) { listing(this, container, this.currentView); return; }
    const [courseId, moduleId, itemId] = this.routeParams || [];
    const course = db().courses.find(c => c.id === courseId); const mod = course?.modules?.find(m => m.id === moduleId); const item = mod?.items?.find(i => i.id === itemId);
    if (!course || this.currentView !== 'curso' && (!item || item.type !== (this.currentView === 'assistir' ? 'lesson' : 'activity'))) { container.innerHTML = `<div class="academic"><p>Conteúdo não encontrado ou indisponível.</p>${link(this, 'Voltar aos cursos', 'cursos')}</div>`; return; }
    if (this.currentView === 'curso') courseView(this, container, course);
    else if (this.currentView === 'assistir') lessonView(this, container, course, mod, item);
    else activityView(this, container, course, mod, item);
  };
  // Botões de atalhos existentes também usam os novos formulários.
  PratikaApp.prototype.showTeacherCourseModal = function() { editCourse(this); };
  PratikaApp.prototype.showCreateCourseModal = function() { editCourse(this); };
  for (const [method, type] of [['showTeacherLessonModal', 'lesson'], ['showCreateLessonModal', 'lesson'], ['showTeacherTaskModal', 'activity'], ['showCreateActivityModal', 'activity']]) {
    PratikaApp.prototype[method] = function(courseId, moduleId) { const course = db().courses.find(c => c.id === courseId); const mod = course?.modules?.find(m => m.id === moduleId); if (course && mod) editItem(this, course, mod, type); else { location.hash = path(this, 'cursos'); this.showToast('Abra um curso e selecione o módulo para adicionar o conteúdo.', 'info'); } };
  }
})();
