'use strict';
const { randomUUID } = require('node:crypto');
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const text = (value, label, max = 10000, required = false) => { if (typeof value !== 'string' || value.length > max || required && !value.trim()) fail(400, `${label} inválido.`); return value.trim(); };
const date = value => { if (!value) return ''; if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) fail(400, 'Data inválida.'); return value; };
const published = item => item.published !== false && item.status !== 'draft';
function canSeeCourse(course, user) {
  if (!course) return false;
  if (user.role === 'admin') return true;
  const schools = Array.isArray(course.schoolIds) ? course.schoolIds : [course.schoolId];
  if (!schools.includes(user.schoolId)) return false;
  if (user.role === 'escola') return published(course);
  if (user.role === 'professor') return course.teacherId === user.profileId;
  return user.role === 'aluno' && published(course) && (!Array.isArray(course.studentIds) || course.studentIds.includes(user.profileId));
}
function assertSubmissionWindow(item) {
  if (item.startDate && /^\d{4}-\d{2}-\d{2}$/.test(item.startDate) && Date.now() < Date.parse(item.startDate + 'T00:00:00-03:00')) fail(400, 'Esta atividade ainda não está aberta para entrega.');
  if (!item.allowLate && item.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(item.dueDate) && Date.now() > Date.parse(item.dueDate + 'T23:59:59-03:00')) fail(400, 'O prazo desta atividade terminou.');
}
function safeUrl(value, required = false) {
  if (!value && !required) return '';
  if (typeof value !== 'string' || value.length > 2000) fail(400, 'Endereço inválido.');
  if (/^\/api\/files\/[a-f0-9-]+$/.test(value)) return value;
  let url; try { url = new URL(value); } catch { fail(400, 'Informe um endereço HTTP ou HTTPS válido.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) fail(400, 'Endereço inválido.');
  return url.href;
}
function fileReferences(course, fileId) {
  const url = `/api/files/${fileId}`;
  const refs = [];
  for (const mod of course.modules || []) {
    if ((mod.materials || []).some(m => m.fileId === fileId || m.url === url)) refs.push({});
    for (const item of mod.items || []) {
      if ((item.materials || []).some(m => m.fileId === fileId || m.url === url) || item.teacherAttachmentPdf?.url === url || item.videoUrl === url) refs.push({ item });
      for (const sub of item.submissions || []) if (sub.fileId === fileId || sub.url === url) refs.push({ item, studentId: sub.studentId });
    }
  }
  return refs;
}
function canDownload(data, file, user) {
  if (user.role === 'admin' || file.ownerId === user.id) return true;
  if (file.schoolId === user.schoolId && user.role === 'escola') return true;
  return data.db.courses.some(c => canSeeCourse(c, user) && fileReferences(c, file.id).some(ref =>
    (!ref.item || published(ref.item)) && (!ref.studentId || (user.role === 'aluno' ? ref.studentId === user.profileId : data.db.students.some(s => s.id === ref.studentId && s.schoolId === user.schoolId)))));
}
function mutate(data, user, action, input, validateLegacy) {
  const db = data.db; const editing = user.role === 'admin';
  const learnerAction = ['submit', 'completion'].includes(action);
  if (learnerAction ? user.role !== 'aluno' : !editing) fail(403, 'Sem permissão para esta operação.');
  let course = db.courses.find(c => c.id === input.courseId);
  if (action === 'course' && !input.courseId) {
    course = { id: 'curso-' + randomUUID(), schoolId: null, schoolIds: [], teacherId: null, modules: [] }; db.courses.push(course);
  } else if (!canSeeCourse(course, user)) fail(404, 'Curso não encontrado ou indisponível.');
  const title = value => { const result = text(value, 'Título', 160, true); validateLegacy(result); return result; };
  if (action === 'course') {
    const schoolIds = input.schoolIds ?? (input.schoolId ? [input.schoolId] : []);
    if (!Array.isArray(schoolIds) || schoolIds.some(id => !db.schools.some(s => s.id === id))) fail(400, 'Selecione escolas válidas.');
    if (input.schoolIds !== undefined) {
      const name = title(input.title);
      Object.assign(course, { schoolId: null, schoolIds: [...new Set(schoolIds)], name, title: name, description: text(input.description || '', 'Descrição'), teacherId: null, instructor: 'Change Skills', studentIds: null, published: input.published === true });
      return course;
    }
    course.schoolId = input.schoolId || course.schoolId;
    delete course.schoolIds;
    const teacherId = user.role === 'professor' ? user.profileId : input.teacherId || null;
    const teacher = db.teachers.find(t => t.id === teacherId && t.schoolId === course.schoolId);
    if (teacherId && !teacher) fail(400, 'Professor inválido para esta escola.');
    const studentIds = input.studentIds;
    if (studentIds !== null && (!Array.isArray(studentIds) || studentIds.some(id => !db.students.some(s => s.id === id && s.schoolId === course.schoolId)))) fail(400, 'Selecione alunos desta escola.');
    const name = title(input.title);
    Object.assign(course, { name, title: name, description: text(input.description || '', 'Descrição'), teacherId, instructor: teacher?.name || 'A definir', studentIds: studentIds === null ? null : [...new Set(studentIds)], published: input.published === true });
    return course;
  }
  if (action === 'delete-course') { db.courses = db.courses.filter(c => c.id !== course.id); return { ok: true }; }
  if (action === 'module') {
    let mod = course.modules.find(m => m.id === input.moduleId);
    if (input.moduleId && !mod) fail(404, 'Módulo não encontrado.');
    if (!mod) { mod = { id: 'mod-' + randomUUID(), items: [], materials: [] }; course.modules.push(mod); }
    Object.assign(mod, { title: title(input.title), description: text(input.description || '', 'Descrição') }); return mod;
  }
  const mod = course.modules.find(m => m.id === input.moduleId); if (!mod) fail(404, 'Módulo não encontrado.');
  if (action === 'delete-module') { course.modules = course.modules.filter(m => m.id !== mod.id); return { ok: true }; }
  if (action === 'item') {
    let item = mod.items.find(i => i.id === input.itemId);
    if (input.itemId && !item) fail(404, 'Conteúdo não encontrado.');
    if (!['lesson', 'activity'].includes(input.type) || item && item.type !== input.type) fail(400, 'Tipo de conteúdo inválido.');
    const fields = { title: title(input.title), published: input.published === true, status: input.published === true ? 'published' : 'draft' };
    if (input.type === 'lesson') {
      Object.assign(fields, { description: text(input.description || '', 'Descrição'), duration: text(input.duration || '', 'Duração', 60), videoUrl: safeUrl(input.videoUrl, input.published === true) });
      if (fields.videoUrl.startsWith('/api/files/')) fail(400, 'Use um endereço externo de vídeo para a aula gravada.');
    } else {
      const maxGrade = Number(input.maxGrade);
      if (input.hasGrade !== false && (!Number.isFinite(maxGrade) || maxGrade <= 0 || maxGrade > 1000)) fail(400, 'A nota máxima deve ser maior que zero e até 1000.');
      const startDate = date(input.startDate); const dueDate = date(input.dueDate);
      if (startDate && dueDate && startDate > dueDate) fail(400, 'O prazo deve ser posterior à abertura.');
      Object.assign(fields, { statement: text(input.statement || '', 'Enunciado', 30000, true), evaluationCriteria: text(input.evaluationCriteria || '', 'Critérios'), hasGrade: input.hasGrade !== false, maxGrade: input.hasGrade === false ? 0 : maxGrade, startDate, dueDate, allowLate: input.allowLate === true });
      if (item?.submissions?.some(s => s.grade != null && s.grade > fields.maxGrade)) fail(400, 'A nota máxima não pode ficar abaixo de uma nota já atribuída.');
    }
    if (!item) { item = { id: 'item-' + randomUUID(), type: input.type, completedBy: [], submissions: [], materials: [] }; mod.items.push(item); }
    Object.assign(item, fields); return item;
  }
  if (['material', 'delete-material'].includes(action)) {
    const parent = input.itemId ? mod.items.find(i => i.id === input.itemId) : mod; if (!parent) fail(404, 'Conteúdo não encontrado.');
    parent.materials ||= [];
    const material = parent.materials.find(m => m.id === input.materialId);
    if (input.materialId && !material) fail(404, 'Material não encontrado.');
    if (action === 'delete-material') { if (!material) fail(404, 'Material não encontrado.'); parent.materials = parent.materials.filter(m => m.id !== material.id); return { ok: true }; }
    let url = safeUrl(input.url); let file;
    if (input.fileId) { file = data.files.find(f => f.id === input.fileId && (user.role === 'admin' || f.schoolId === course.schoolId) && (f.ownerId === user.id || material?.fileId === f.id)); if (!file) fail(404, 'Arquivo não encontrado.'); url = file.url; }
    else if (url.startsWith('/api/files/')) fail(400, 'Selecione o arquivo usando o campo de upload.');
    if (!url) fail(400, 'Envie um arquivo ou informe um endereço.');
    const result = material || { id: 'mat-' + randomUUID() };
    Object.assign(result, { title: title(input.title), url, fileId: file?.id || null, size: file ? `${(file.size / 1048576).toFixed(2)} MB` : '', type: 'Material' });
    if (!material) parent.materials.push(result); return result;
  }
  const item = mod.items.find(i => i.id === input.itemId); if (!item || user.role === 'aluno' && !published(item)) fail(404, 'Conteúdo não encontrado.');
  if (action === 'delete-item') { mod.items = mod.items.filter(i => i.id !== item.id); return { ok: true }; }
  if (action === 'move-item') {
    if (!['up', 'down'].includes(input.direction)) fail(400, 'Direção inválida.');
    const index = mod.items.indexOf(item); const next = index + (input.direction === 'up' ? -1 : 1);
    if (next >= 0 && next < mod.items.length) [mod.items[index], mod.items[next]] = [mod.items[next], mod.items[index]];
    return { ok: true };
  }
  if (action === 'completion') {
    if (item.type !== 'lesson' || typeof input.completed !== 'boolean') fail(400, 'Conclusão inválida.');
    item.completedBy = (item.completedBy || []).filter(id => id !== user.profileId); if (input.completed) item.completedBy.push(user.profileId); return { completed: input.completed };
  }
  if (item.type !== 'activity') fail(400, 'Selecione uma atividade.');
  if (action === 'submit') {
    assertSubmissionWindow(item);
    const notes = text(input.notes || '', 'Resposta', 30000); let file;
    if (input.fileId) { file = data.files.find(f => f.id === input.fileId && f.ownerId === user.id && f.schoolId === user.schoolId); if (!file) fail(404, 'Arquivo não encontrado.'); }
    if (!notes && !file) fail(400, 'Escreva a resposta ou envie um arquivo.');
    item.submissions ||= [];
    const previous = item.submissions.find(s => s.studentId === user.profileId);
    if (previous?.gradedAt || previous?.grade != null) fail(409, 'Esta entrega já foi corrigida. Peça ao professor para reabrir.');
    const submission = { studentId: user.profileId, studentName: user.name, studentNotes: notes, fileId: file?.id || null, fileName: file?.name || '', url: file?.url || '', submittedAt: new Date().toISOString(), grade: null, feedback: '' };
    item.submissions = item.submissions.filter(s => s.studentId !== user.profileId); item.submissions.push(submission); return submission;
  }
  const sub = item.submissions?.find(s => s.studentId === input.studentId); if (!sub) fail(404, 'Entrega não encontrada.');
  if (action === 'grade') {
    let grade = null;
    if (item.hasGrade !== false) { grade = Number(input.grade); if (!['number', 'string'].includes(typeof input.grade) || String(input.grade).trim() === '' || !Number.isFinite(grade) || grade < 0 || grade > item.maxGrade) fail(400, 'Nota inválida.'); }
    Object.assign(sub, { grade, feedback: text(input.feedback || '', 'Feedback'), gradedAt: new Date().toISOString(), gradedBy: user.id }); return sub;
  }
  if (action === 'reopen') { delete sub.gradedAt; delete sub.gradedBy; sub.grade = null; sub.feedback = ''; return sub; }
  fail(404, 'Operação não encontrada.');
}
module.exports = { mutate, canSeeCourse, published, assertSubmissionWindow, canDownload };
