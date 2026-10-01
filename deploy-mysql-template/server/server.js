const http = require('http');
const crypto = require('crypto');
const dns = require('dns').promises;
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { WebSocketServer } = require('ws');

loadEnv(path.join(__dirname, '.env'));

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3001);
const MAX_BODY = 1024 * 1024;
const languageNames = { en: 'inglês', es: 'espanhol', fr: 'francês', pt: 'português' };
const scenarioGuidance = {
  'kids-first-school-day': { title: "Primeiro dia de aula", role: "professora gentil no primeiro dia de aula", goal: "A criança deve cumprimentar a professora, dizer seu nome, perguntar onde sentar, pedir ajuda com um material e se despedir no fim da aula. Etapas esperadas: Cumprimentar a professora > Dizer o nome > Perguntar onde sentar > Pedir ajuda > Se despedir.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-library-card': { title: "Biblioteca da escola", role: "bibliotecária paciente da escola", goal: "A criança deve explicar que tipo de história quer, pedir ajuda para encontrar o livro, confirmar por quantos dias pode ficar com ele e agradecer. Etapas esperadas: Explicar o livro que quer > Pedir ajuda > Confirmar prazo > Registrar o empréstimo > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-class-presentation': { title: "Apresentação na sala", role: "professora gentil conduzindo uma apresentação na sala", goal: "A criança deve cumprimentar, dizer o nome, falar idade ou algo que gosta, perguntar o nome de um colega e responder uma pergunta simples. Etapas esperadas: Cumprimentar > Dizer o nome > Falar algo que gosta > Perguntar nome do colega > Responder pergunta simples.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-birthday-party': { title: "Festa de aniversário", role: "aniversariante animado e educado", goal: "A criança deve cumprimentar, dar parabéns, entregar o presente, perguntar sobre uma brincadeira ou bolo e se despedir. Etapas esperadas: Dar parabéns > Entregar presente > Perguntar da festa > Combinar brincadeira > Se despedir.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-school-cafeteria': { title: "Lanche na escola", role: "atendente gentil da cantina da escola", goal: "A criança deve cumprimentar, perguntar opções simples, pedir um lanche e uma bebida, perguntar preço e agradecer. Etapas esperadas: Cumprimentar > Perguntar opções > Pedir lanche > Pedir bebida > Perguntar preço > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-shopping-snack': { title: "Pedido no shopping", role: "atendente paciente de uma lanchonete no shopping", goal: "A criança deve cumprimentar, perguntar uma opção do menu, pedir comida e bebida, confirmar o pedido e agradecer. Etapas esperadas: Cumprimentar > Perguntar o menu > Pedir comida > Pedir bebida > Confirmar pedido > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-toy-store': { title: "Loja de brinquedos", role: "atendente gentil de loja de brinquedos", goal: "A criança deve pedir ajuda para achar um brinquedo, dizer cor ou tamanho, perguntar preço, confirmar escolha e agradecer. Etapas esperadas: Pedir ajuda > Dizer brinquedo > Escolher cor > Perguntar preço > Confirmar escolha > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'teen-first-club-meeting': { title: "Entrar em um clube da escola", role: "aluno responsável pelo clube", goal: "O adolescente deve se apresentar, falar do interesse, perguntar regras/horários, escolher uma tarefa inicial e confirmar a próxima reunião. Etapas esperadas: Se apresentar > Explicar interesse > Perguntar regras > Escolher tarefa > Confirmar próxima reunião.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'teen-group-project-conflict': { title: "Trabalho em grupo com atraso", role: "colega de grupo tentando terminar o projeto", goal: "O adolescente deve explicar o atraso sem brigar, propor divisão de tarefas, pedir ajuda em uma parte e combinar entrega. Etapas esperadas: Explicar problema > Pedir ajuda > Dividir tarefas > Combinar prazo > Confirmar plano.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'teen-movie-plans': { title: "Planejar cinema com amigos", role: "amigo planejando o cinema", goal: "O adolescente deve sugerir filme, negociar horário, combinar encontro, falar sobre lanche e confirmar o plano final. Etapas esperadas: Sugerir filme > Negociar horário > Combinar encontro > Falar de lanche > Confirmar volta.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'teen-part-time-interview': { title: "Primeiro trabalho de meio período", role: "gerente de uma cafeteria entrevistando jovem aprendiz", goal: "O adolescente deve se apresentar, falar da escola e horários, explicar uma qualidade, fazer uma pergunta sobre a vaga e encerrar educadamente. Etapas esperadas: Se apresentar > Falar disponibilidade > Explicar qualidade > Perguntar sobre vaga > Encerrar.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'teen-lost-phone-bus': { title: "Celular perdido no ônibus", role: "funcionário do terminal de ônibus", goal: "O adolescente deve explicar que perdeu o celular, descrever modelo/cor, dizer linha e horário, perguntar achados e perdidos e deixar contato. Etapas esperadas: Explicar perda > Descrever celular > Informar trajeto > Perguntar procedimento > Deixar contato.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'teen-exchange-family': { title: "Chegar em casa de intercâmbio", role: "responsável da família anfitriã", goal: "O adolescente deve cumprimentar, falar de sua rotina, perguntar regras, explicar comida ou alergia e combinar o primeiro dia. Etapas esperadas: Cumprimentar família > Falar rotina > Perguntar regras > Explicar preferência > Combinar amanhã.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'adult-plumber-visit': { title: "Chamar um encanador", role: "encanador profissional visitando a casa", goal: "O adulto deve explicar o problema por telefone, receber o encanador, mostrar onde está o vazamento, perguntar preço/tempo, confirmar o reparo e fechar o pagamento. Etapas esperadas: Explicar por telefone > Receber profissional > Mostrar problema > Perguntar preço e tempo > Confirmar reparo > Pagar e agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'adult-restaurant-lunch': { title: "Almoçar em um restaurante", role: "garçom de restaurante movimentado", goal: "O adulto deve pedir mesa, pedir o menu, escolher prato e bebida, fazer uma pergunta sobre ingrediente, responder ao garçom e pedir a conta. Etapas esperadas: Pedir mesa > Pedir menu > Escolher pedido > Tirar dúvida > Pedir conta > Encerrar.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'adult-hotel-checkin': { title: "Check-in no hotel", role: "recepcionista de hotel", goal: "O adulto deve se apresentar, confirmar reserva, entregar dados, perguntar horários, pedir informação do quarto e encerrar com educação. Etapas esperadas: Confirmar reserva > Informar dados > Perguntar horários > Pedir direção ao quarto > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'adult-store-return': { title: "Trocar produto com defeito", role: "atendente do balcão de trocas", goal: "O adulto deve explicar o defeito, dizer quando comprou, mostrar recibo, pedir troca ou reembolso, entender a política e confirmar a solução. Etapas esperadas: Explicar defeito > Mostrar recibo > Pedir solução > Entender política > Confirmar troca.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'adult-medical-appointment': { title: "Consulta médica em viagem", role: "atendente e médico de clínica", goal: "O adulto deve marcar horário, explicar sintomas, responder perguntas básicas, entender orientação e confirmar farmácia ou retorno. Etapas esperadas: Marcar horário > Explicar sintomas > Responder perguntas > Entender orientação > Confirmar próximos passos.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'adult-airport-problem': { title: "Problema no aeroporto", role: "atendente da companhia aérea", goal: "O adulto deve explicar o voo, perguntar motivo do atraso, confirmar portão, resolver dúvida de bagagem e pedir alternativa ou previsão. Etapas esperadas: Informar voo > Perguntar atraso > Confirmar portão > Resolver bagagem > Pedir alternativa.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'adult-taxi-route': { title: "Táxi em uma cidade nova", role: "motorista de táxi simpático", goal: "O adulto deve dizer endereço, perguntar tempo aproximado, escolher rota, pedir parada se necessário e pagar ao final. Etapas esperadas: Dizer destino > Perguntar tempo > Escolher rota > Pedir parada > Pagar.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'adult-rent-apartment': { title: "Visitar apartamento para alugar", role: "corretor de imóveis", goal: "O adulto deve explicar o que procura, perguntar preço e contas, ver um problema no imóvel, perguntar contrato e combinar resposta. Etapas esperadas: Explicar busca > Perguntar preço > Checar problema > Perguntar contrato > Combinar retorno.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'business-client-delay': { title: "Avisar atraso a um cliente", role: "cliente aguardando uma entrega", goal: "O profissional deve avisar o atraso com clareza, explicar impacto sem exagerar, propor novo prazo, responder objeção e fechar acordo. Etapas esperadas: Avisar atraso > Pedir desculpas > Explicar impacto > Propor prazo > Fechar acordo.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'business-budget-meeting': { title: "Negociar orçamento em reunião", role: "gestor avaliando orçamento", goal: "O profissional deve abrir reunião, resumir proposta, responder pergunta de custo, negociar escopo e confirmar decisão ou próximo passo. Etapas esperadas: Abrir reunião > Apresentar proposta > Responder custo > Negociar escopo > Confirmar decisão.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'business-job-interview': { title: "Entrevista de emprego", role: "recrutador em entrevista", goal: "O aluno deve se apresentar, falar experiência, responder sobre desafio, perguntar sobre vaga/equipe e encerrar profissionalmente. Etapas esperadas: Se apresentar > Falar experiência > Responder desafio > Perguntar sobre vaga > Encerrar.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'business-support-call': { title: "Ligação de suporte para cliente", role: "cliente com problema em um serviço", goal: "O profissional deve cumprimentar, coletar detalhes, confirmar entendimento, propor solução, verificar se funcionou e encerrar. Etapas esperadas: Cumprimentar > Coletar detalhes > Confirmar problema > Propor solução > Encerrar.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'business-team-feedback': { title: "Dar feedback a um colega", role: "colega de equipe recebendo feedback", goal: "O profissional deve explicar o contexto, dar feedback específico, ouvir resposta, combinar uma ação e agradecer. Etapas esperadas: Contextualizar > Dar feedback > Ouvir resposta > Combinar ação > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'research-conference-qa': { title: "Perguntas após apresentação", role: "pesquisador fazendo perguntas em conferência", goal: "O pesquisador deve resumir tema, explicar método, responder crítica sobre resultado, admitir limitação e combinar contato posterior. Etapas esperadas: Resumir estudo > Explicar método > Responder crítica > Falar limitação > Combinar contato.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'research-supervisor-meeting': { title: "Reunião com orientador", role: "orientador acadêmico", goal: "O pesquisador deve relatar progresso, explicar dificuldade, pedir feedback, negociar prazo e confirmar tarefas antes da próxima reunião. Etapas esperadas: Relatar progresso > Explicar dificuldade > Pedir feedback > Negociar prazo > Confirmar tarefas.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'research-collaboration-email': { title: "Propor colaboração de pesquisa", role: "pesquisador de outra universidade", goal: "O pesquisador deve se apresentar, explicar a ideia de colaboração, perguntar interesse, combinar compartilhamento de dados e marcar próxima conversa. Etapas esperadas: Se apresentar > Explicar ideia > Perguntar interesse > Combinar dados > Marcar conversa.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'research-ethics-board': { title: "Explicar projeto ao comitê de ética", role: "membro de comitê de ética", goal: "O pesquisador deve explicar objetivo, participantes, consentimento, riscos e proteção de dados, respondendo perguntas de forma clara. Etapas esperadas: Explicar objetivo > Descrever participantes > Falar consentimento > Responder risco > Confirmar proteção.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." }
};

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
function normalizeUsername(value) { return String(value || '').trim().replace(/^@+/, '').toLowerCase(); }
function validatePasswordRules(password) { const value = String(password || ''); if (value.length < 8) throw httpError(422, 'A senha precisa ter pelo menos 8 caracteres.'); if (!/[A-Z]/.test(value)) throw httpError(422, 'A senha precisa ter pelo menos uma letra maiúscula.'); return value; }
function firstName(name) { return String(name || '').trim().split(/\s+/)[0] || ''; }
function hashPassword(password) { const salt = crypto.randomBytes(16).toString('hex'); const hash = crypto.scryptSync(String(password), salt, 64).toString('hex'); return `${salt}:${hash}`; }
function verifyPassword(password, stored) { const [salt, hash] = String(stored || '').split(':'); if (!salt || !hash) return false; const test = crypto.scryptSync(String(password), salt, 64); return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), test); }
function httpError(status, message) { const err = new Error(message); err.status = status; return err; }
function send(res, status, data) { if (status === 204) { res.writeHead(204); res.end(); return; } res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); }
function parseUrl(req) { return new URL(req.url, `http://${req.headers.host || 'localhost'}`); }
function validateText(value, name, min = 1, max = 4000) { const text = String(value || '').trim(); if (text.length < min || text.length > max) throw httpError(400, `${name} inválido.`); return text; }

function appUrl(route = '') { return (process.env.APP_URL || 'https://changeskills.app').replace(/\/$/, '') + route; }
function addHours(hours) { return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(); }
function emailLooksValid(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim()); }
async function ensureEmailDomain(email) { const domain = String(email).split('@')[1]; try { const mx = await dns.resolveMx(domain); if (!mx || !mx.length) throw new Error('mx'); } catch { try { await dns.resolve4(domain); } catch { throw httpError(422, 'Use um e-mail válido. Não encontramos esse domínio.'); } } }
function smtpConfig() { return { host: process.env.SMTP_HOST || 'smtp.hostinger.com', port: Number(process.env.SMTP_PORT || 465), user: process.env.SMTP_USER || process.env.MAIL_USER, pass: process.env.SMTP_PASS || process.env.MAIL_PASS, from: process.env.SMTP_FROM || process.env.SMTP_USER || process.env.MAIL_USER || 'noreply@changeskills.app' }; }
function plainText(html) { return String(html).replace(/<br\s*\/?>(\s*)/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n{3,}/g, '\n\n').trim(); }
let mailTransport;
async function sendMail({ to, subject, html }) {
 const cfg = smtpConfig();
 if (!cfg.user || !cfg.pass) throw new Error('SMTP não configurado');
 if (!mailTransport) mailTransport = nodemailer.createTransport({host:cfg.host,port:cfg.port,secure:cfg.port===465,auth:{user:cfg.user,pass:cfg.pass},connectionTimeout:15000,greetingTimeout:15000,socketTimeout:30000,tls:{servername:cfg.host}});
 const result=await mailTransport.sendMail({from:{name:'Change Skills',address:cfg.from},to,subject,text:plainText(html),html,disableFileAccess:true,disableUrlAccess:true});
 if (!result.accepted || !result.accepted.length || result.rejected.length) throw new Error('SMTP rejeitou o destinatário');
 console.info('E-mail aceito pelo SMTP:',JSON.stringify({messageId:result.messageId,response:result.response}));
 return true;
}
function emailLayout({ title, preview, cta, url, body, note, art = "welcome" }) { return '<!doctype html><html><body style="margin:0;background:#f4f8ff;font-family:Arial,Helvetica,sans-serif;color:#1a235c;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">' + preview + '</div><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f8ff;padding:28px 12px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;background:#ffffff;border-radius:28px;overflow:hidden;border:1px solid #dbeafe;box-shadow:0 18px 45px rgba(28,91,240,.08);"><tr><td style="background:#1c5bf0;color:#fff;padding:26px 30px;text-align:center;"><img src="' + appUrl('/email-art/logo.png') + '" width="210" alt="Change Skills Idiomas" style="display:block;width:210px;height:auto;margin:0 auto;border:0;"></td></tr><tr><td align="center" style="padding:24px 30px 0;"><img src="' + appUrl('/email-art/' + art + '.png') + '" width="210" alt="Camaleão da Change Skills" style="display:block;width:210px;max-width:100%;height:auto;border:0;"><table role="presentation" width="150" cellpadding="0" cellspacing="0" align="center" style="margin:-4px auto 0;"><tr><td height="10" style="height:10px;line-height:10px;font-size:1px;background:#e2e8f0;border-radius:50%;box-shadow:0 2px 8px rgba(26,35,92,.12);">&nbsp;</td></tr></table></td></tr><tr><td style="padding:18px 30px 30px;"><h1 style="font-size:24px;line-height:1.18;margin:0 0 12px;color:#1a235c;text-align:left;">' + title + '</h1><div style="font-size:15px;line-height:1.65;color:#475569;text-align:left;">' + body + '</div>' + (cta && url ? '<div style="margin:28px 0;text-align:left;"><a href="' + url + '" style="display:inline-block;background:#1c5bf0;color:#fff;text-decoration:none;padding:15px 22px;border-radius:16px;font-weight:800;">' + cta + '</a></div><p style="font-size:12px;line-height:1.5;color:#64748b;word-break:break-all;margin:0 0 18px;text-align:left;">Se o botão não abrir, copie este link:<br>' + url + '</p>' : '') + (note ? '<p style="font-size:13px;color:#64748b;background:#f8fbff;border:1px solid #e2e8f0;border-radius:16px;padding:12px 14px;margin:0;text-align:left;">' + note + '</p>' : '') + '</td></tr><tr><td style="padding:18px 30px 28px;text-align:center;color:#94a3b8;font-size:12px;">Você recebeu este e-mail porque usou a Change Skills.</td></tr></table></td></tr></table></body></html>'; }
const templates = { verify: ({name,url}) => ({ subject:'Confirme seu e-mail na Change Skills', html:emailLayout({ title:'Confirme seu e-mail', preview:'Clique para ativar sua conta na Change Skills.', cta:'Confirmar e entrar', url, body:'<p>Oi, ' + (firstName(name) || 'tudo bem') + '.</p><p>Recebemos seu cadastro. Confirme seu e-mail para ativar sua conta e entrar direto na plataforma.</p>', note:'Este link é válido por 59 minutos. Após esse prazo, solicite outro link. Se você não criou uma conta, ignore este e-mail.' }) }), reset: ({name,url}) => ({ subject:'Redefina sua senha da Change Skills', html:emailLayout({ art:'reset', title:'Redefinir senha', preview:'Use o link para criar uma nova senha.', cta:'Criar nova senha', url, body:'<p>Oi, ' + (firstName(name) || 'tudo bem') + '.</p><p>Recebemos um pedido para redefinir sua senha. Use o botão abaixo para escolher uma nova senha.</p>', note:'Este link é válido por 59 minutos. Após esse prazo, solicite outro link. Se você não pediu isso, pode ignorar este e-mail.' }) }), twoFactor: ({name,code}) => ({ subject:'Seu código de acesso da Change Skills', html:emailLayout({ art:'security', title:'Código de verificação', preview:'Use este código para entrar na Change Skills.', body:'<p>Oi, ' + (firstName(name) || 'tudo bem') + '.</p><p>Use este código para confirmar seu login:</p><p style="font-size:32px;line-height:1;font-weight:900;letter-spacing:8px;color:#1c5bf0;background:#f4f8ff;border:1px solid #dbeafe;border-radius:18px;padding:18px 20px;text-align:center;margin:18px 0;">' + code + '</p><p>Se você não tentou entrar, pode ignorar este e-mail.</p>', note:'Este código é válido por 30 minutos. Após esse prazo, solicite outro código.' }) }), news: ({title='Novidades do Camaleão', body='Tem novidade chegando para deixar sua prática mais natural e divertida.'}={}) => ({ subject:title, html:emailLayout({ title, preview:'Atualizações da Change Skills.', body:'<p>' + body + '</p><p>Entre na plataforma para continuar praticando.</p>', cta:'Abrir Change Skills', url:appUrl('/'), note:'Você recebe novidades importantes sobre sua experiência na Change Skills.' }) }) };
async function issueEmailToken(userId, kind, hours) { const value = token(); await exec('INSERT INTO email_tokens (id,user_id,kind,token,expires_at,used_at,created_at) VALUES (?,?,?,?,?,?,?)',[id(),userId,kind,value,addHours(hours),null,now()]); return value; }
async function markEmailTokenUsed(value) { if (value) await exec('UPDATE email_tokens SET used_at=? WHERE token=? AND used_at IS NULL',[now(),value]).catch(()=>{}); }
function emailSendError(error) { console.error('Falha ao enviar e-mail:', error && error.message ? error.message : error); return httpError(502, 'Não conseguimos enviar o e-mail agora. Tente novamente em alguns minutos.'); }
async function consumeEmailToken(value, kind) { const row = await one('SELECT * FROM email_tokens WHERE token=? AND kind=?',[String(value||'').replace(/\s/g,''),kind]); if(!row || new Date(row.expires_at).getTime() < Date.now()) throw httpError(400, 'Link inválido ou expirado.'); if(row.used_at && kind !== 'verify') throw httpError(400, 'Link inválido ou expirado.'); if(!row.used_at) await exec('UPDATE email_tokens SET used_at=? WHERE id=?',[now(),row.id]); return row; }
async function issueLoginCode(userId) { const pending=await one('SELECT * FROM email_tokens WHERE user_id=? AND kind=? AND used_at IS NULL ORDER BY created_at DESC LIMIT 1',[userId,'login_2fa']); if(pending && new Date(pending.expires_at).getTime()>Date.now()) return pending.token; const code = String(crypto.randomInt(100000,1000000)); await exec('UPDATE email_tokens SET used_at=? WHERE user_id=? AND kind=? AND used_at IS NULL',[now(),userId,'login_2fa']); await exec('INSERT INTO email_tokens (id,user_id,kind,token,expires_at,used_at,created_at) VALUES (?,?,?,?,?,?,?)',[id(),userId,'login_2fa',code,addHours(0.5),null,now()]); return code; }
async function trustedDevice(req,userId) {
 const raw=String(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('cs_trusted='))?.slice(11);
 if(!raw || !/^[a-f0-9]{64}$/.test(raw)) return false;
 const row=await one('SELECT expires_at FROM trusted_devices WHERE token_hash=? AND user_id=?',[crypto.createHash('sha256').update(raw).digest('hex'),userId]);
 return !!row && new Date(row.expires_at).getTime()>Date.now();
}
async function rememberDevice(res,userId) {
 const raw=crypto.randomBytes(32).toString('hex');
 await exec('INSERT INTO trusted_devices (token_hash,user_id,expires_at) VALUES (?,?,?)',[crypto.createHash('sha256').update(raw).digest('hex'),userId,addHours(168)]);
 res.setHeader('Set-Cookie','cs_trusted='+raw+'; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=604800');
}
async function loginSession(user) {
 const value=token();await exec('INSERT INTO sessions (id,token,user_id,created_at) VALUES (?,?,?,?)',[id(),value,user.id,now()]);return {token:value,user:publicUser(user)};
}
async function consumeLoginCode(email, code) { const clean = String(code||'').replace(/\D/g,''); if(!/^\d{6}$/.test(clean)) throw httpError(400,'Código inválido.'); const user = await one('SELECT * FROM users WHERE email=?',[String(email||'').trim().toLowerCase()]); if(!user) throw httpError(400,'Código inválido.'); const row = await one('SELECT * FROM email_tokens WHERE user_id=? AND kind=? AND token=? AND used_at IS NULL ORDER BY created_at DESC LIMIT 1',[user.id,'login_2fa',clean]); if(!row || new Date(row.expires_at).getTime() < Date.now()) throw httpError(400,'Código inválido ou expirado.'); const used=await exec('UPDATE email_tokens SET used_at=? WHERE id=? AND used_at IS NULL',[now(),row.id]); if(used.affectedRows!==1) throw httpError(400,'Código já utilizado.'); return user; }

async function body(req) { let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > MAX_BODY) throw httpError(413, 'Requisição muito grande.'); } if (!raw) return {}; try { return JSON.parse(raw); } catch { throw httpError(400, 'JSON inválido.'); } }
function publicUser(u) { return u && { id: u.id, name: u.name, username: u.username.toLowerCase(), email: u.email, avatarUrl: u.avatar_url || u.avatarUrl || '', defaultLanguage: u.default_language || u.defaultLanguage || 'pt', emailVerified: !!(u.email_verified_at || u.emailVerified), createdAt: u.created_at || u.createdAt }; }
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
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id VARCHAR(36) PRIMARY KEY, name VARCHAR(120) NOT NULL, username VARCHAR(24) NOT NULL UNIQUE, email VARCHAR(180) NOT NULL UNIQUE, password_hash VARCHAR(220) NOT NULL, avatar_url MEDIUMTEXT NULL, default_language VARCHAR(8) NOT NULL DEFAULT 'pt', email_verified_at VARCHAR(40) NULL, created_at VARCHAR(40) NOT NULL) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`ALTER TABLE users ADD COLUMN email_verified_at VARCHAR(40) NULL`).catch(()=>{});
  await pool.query(`CREATE TABLE IF NOT EXISTS trusted_devices (token_hash CHAR(64) PRIMARY KEY, user_id VARCHAR(36) NOT NULL, expires_at VARCHAR(40) NOT NULL, INDEX(user_id))`);
  await pool.query(`CREATE TABLE IF NOT EXISTS sessions (id VARCHAR(36) PRIMARY KEY, token VARCHAR(80) NOT NULL UNIQUE, user_id VARCHAR(36) NULL, created_at VARCHAR(40) NOT NULL, INDEX(token), INDEX(user_id)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS chats (id VARCHAR(36) PRIMARY KEY, owner_id VARCHAR(36) NOT NULL, title VARCHAR(120) NOT NULL, language VARCHAR(8) NOT NULL, course_id VARCHAR(80) NOT NULL, audience VARCHAR(40) NOT NULL, created_at VARCHAR(40) NOT NULL, updated_at VARCHAR(40) NOT NULL, INDEX(owner_id), INDEX(updated_at)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS turns (id VARCHAR(36) PRIMARY KEY, chat_id VARCHAR(36) NOT NULL, request_id VARCHAR(100) NOT NULL, sequence INT NOT NULL, user_text MEDIUMTEXT NOT NULL, assistant_text MEDIUMTEXT NOT NULL, created_at VARCHAR(40) NOT NULL, UNIQUE KEY chat_request (chat_id, request_id), INDEX(chat_id, sequence)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS friendships (id VARCHAR(36) PRIMARY KEY, requester_id VARCHAR(36) NOT NULL, addressee_id VARCHAR(36) NOT NULL, status VARCHAR(20) NOT NULL, created_at VARCHAR(40) NOT NULL, UNIQUE KEY pair_unique (requester_id, addressee_id), INDEX(addressee_id), INDEX(status)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS friend_conversations (id VARCHAR(36) PRIMARY KEY, user_a_id VARCHAR(36) NOT NULL, user_b_id VARCHAR(36) NOT NULL, created_at VARCHAR(40) NOT NULL, updated_at VARCHAR(40) NOT NULL, UNIQUE KEY pair_unique (user_a_id, user_b_id), INDEX(updated_at)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS friend_messages (id VARCHAR(36) PRIMARY KEY, conversation_id VARCHAR(36) NOT NULL, sender_id VARCHAR(36) NOT NULL, content MEDIUMTEXT NOT NULL, sequence INT NOT NULL, created_at VARCHAR(40) NOT NULL, INDEX(conversation_id, sequence)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS groups (id VARCHAR(36) PRIMARY KEY, owner_id VARCHAR(36) NOT NULL, name VARCHAR(120) NOT NULL, invite_code VARCHAR(40) NOT NULL UNIQUE, max_members INT NOT NULL DEFAULT 10, is_public TINYINT NOT NULL DEFAULT 0, created_at VARCHAR(40) NOT NULL, updated_at VARCHAR(40) NOT NULL, INDEX(owner_id), INDEX(updated_at)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS group_members (id VARCHAR(36) PRIMARY KEY, group_id VARCHAR(36) NOT NULL, user_id VARCHAR(36) NOT NULL, role VARCHAR(20) NOT NULL DEFAULT 'member', joined_at VARCHAR(40) NOT NULL, UNIQUE KEY group_user (group_id, user_id), INDEX(user_id)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS email_tokens (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) NOT NULL, kind VARCHAR(30) NOT NULL, token VARCHAR(100) NOT NULL UNIQUE, expires_at VARCHAR(40) NOT NULL, used_at VARCHAR(40) NULL, created_at VARCHAR(40) NOT NULL, INDEX(token), INDEX(user_id), INDEX(kind)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS group_messages (id VARCHAR(36) PRIMARY KEY, group_id VARCHAR(36) NOT NULL, sender_id VARCHAR(36) NOT NULL, content MEDIUMTEXT NOT NULL, sequence INT NOT NULL, created_at VARCHAR(40) NOT NULL, INDEX group_seq (group_id, sequence)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS practice_sessions (id VARCHAR(36) PRIMARY KEY, language VARCHAR(8) NOT NULL, audience VARCHAR(40) NOT NULL, user_a_id VARCHAR(36) NOT NULL, user_b_id VARCHAR(36) NOT NULL, started_at VARCHAR(40) NOT NULL, ends_at VARCHAR(40) NOT NULL, ended_at VARCHAR(40) NULL, INDEX(user_a_id), INDEX(user_b_id), INDEX(started_at)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS practice_messages (id VARCHAR(36) PRIMARY KEY, session_id VARCHAR(36) NOT NULL, sender_id VARCHAR(36) NOT NULL, content MEDIUMTEXT NOT NULL, created_at VARCHAR(40) NOT NULL, INDEX(session_id), INDEX(sender_id)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
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

function changeSkillsMethodContext(courseId = 'general', audience = 'general') {
  const base = 'Base pedagógica Change Skills: priorize fala prática, função comunicativa e vocabulário útil em contexto. Ensine por frases naturais inteiras antes de explicar regras longas. Use correções curtas, modelos prontos e uma pergunta de continuação.';
  const kids = 'Para Kids, siga uma progressão concreta: cumprimentos, cores, números, brinquedos, família, casa, corpo, rosto, animais, comida, roupas, clima e rotina escolar. Use frases muito curtas, repetição, perguntas simples como What is this, How many, Where is, I like, I have got, sem temas adultos.';
  const general = 'Para cursos gerais e adultos, trabalhe situações de vida real: apresentação pessoal, países, profissões, família, objetos, casa, cidade, direções, compras, viagem, restaurante, hotel, transporte, rotina, habilidades, planos, passado e preferências. Use roleplays com objetivo claro e fechamento natural.';
  const business = 'Para Business, siga foco de Business English funcional: apresentações profissionais, dados pessoais, empresa/departamentos, rotina de trabalho, small talk, conference networking, pedidos de folga, reclamações, telefonemas, propostas, reuniões, favores, mudança de reunião, comparação de opções, procedimentos, workflow, projetos, updates e feedback. O foco é comunicação profissional simples e útil.';
  const teens = 'Para Teens, use escola, clubes, projetos, planos com amigos, intercâmbio, tecnologia, hobbies, transporte e primeiros trabalhos. Mantenha tom natural, sem infantilizar.';
  const researchers = 'Para pesquisadores, use apresentação de pesquisa, método, resultados, limitações, perguntas de banca/conferência, colaboração, e-mails acadêmicos e reuniões com orientador.';
  const parts = [base];
  if (audience === 'kids' || courseId.includes('kids') || courseId.includes('enfants')) parts.push(kids);
  else if (audience === 'business' || courseId === 'business') parts.push(business);
  else if (audience === 'teens') parts.push(teens);
  else if (audience === 'researchers') parts.push(researchers);
  else parts.push(general);
  return parts.join(' ');
}

function instructionsFor(profile) {
  const language = languageNames[profile.language] || profile.language || 'inglês';
  const defaultLanguage = languageNames[profile.defaultLanguage || 'pt'] || 'português';
  const scenarioId = profile.courseId?.startsWith('scenario:') ? profile.courseId.slice('scenario:'.length) : '';
  const scenario = scenarioId ? scenarioGuidance[scenarioId] : null;
  const scenarioText = scenario ? `\nModo de prática guiada: ${scenario.title}. Você deve interpretar o papel de ${scenario.role}. Objetivo: ${scenario.goal} Conduza a cena em começo, meio e fim. Corrija frases do aluno de forma curta e natural antes de continuar. Se ele disser algo pouco natural, sugira uma frase melhor, por exemplo: "Você pode dizer: I'd like soup. É mais educado." Não traduza tudo. ${scenario.finish} Quando a cena estiver realmente concluída, inclua exatamente o marcador [[SCENARIO_COMPLETE]] no final da resposta.` : '';
  return `Você é o Camaleão IA da Change Skills, um amigo-professor de idiomas. Idioma de prática: ${language}. Idioma principal para explicar: ${defaultLanguage}. ${profile.firstName ? `Chame o aluno pelo primeiro nome, ${profile.firstName}, de forma natural.` : ''}${scenarioText}
${changeSkillsMethodContext(profile.courseId || 'general', profile.audience || 'general')}
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
  const sessions = await all('SELECT started_at, COALESCE(ended_at, ends_at) ended_at FROM practice_sessions WHERE user_a_id = ? OR user_b_id = ?', [userId, userId]).catch(() => []);
  const days = new Set(turns.map(t => t.created_at.slice(0, 10)));
  for (const session of sessions) days.add(String(session.started_at).slice(0, 10));
  let streak = 0; const cursor = new Date(); while (days.has(cursor.toISOString().slice(0,10))) { streak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  const f = await one('SELECT COUNT(*) total FROM friendships WHERE status = ? AND (requester_id = ? OR addressee_id = ?)', ['accepted', userId, userId]);
  const sessionSeconds = sessions.reduce((total, row) => {
    const start = new Date(row.started_at).getTime();
    const end = new Date(row.ended_at || row.started_at).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return total;
    return total + Math.min(5 * 60, Math.floor((end - start) / 1000));
  }, 0);
  return { streakDays: streak, friends: Number(f.total || 0), practicedSeconds: sessionSeconds + turns.length * 60, messageCount: turns.length };
}

async function groupMember(groupId, userId) { return one('SELECT * FROM group_members WHERE group_id=? AND user_id=?', [groupId, userId]); }
async function groupDto(g) { const c = await one('SELECT COUNT(*) total FROM group_members WHERE group_id=?', [g.id]); return { id:g.id, ownerId:g.owner_id, name:g.name, inviteCode:g.invite_code, maxMembers:Number(g.max_members||10), isPublic:!!Number(g.is_public||0), memberCount:Number(c?.total||0), createdAt:g.created_at, updatedAt:g.updated_at }; }
function inviteCode() { return crypto.randomBytes(6).toString('base64url'); }

async function friendship(a,b){ return one('SELECT * FROM friendships WHERE (requester_id=? AND addressee_id=?) OR (requester_id=? AND addressee_id=?)',[a,b,b,a]); }
function pair(a,b){ return a < b ? [a,b] : [b,a]; }
async function friendStreak(userId, friendId){
  const conv = await one('SELECT * FROM friend_conversations WHERE (user_a_id=? AND user_b_id=?) OR (user_a_id=? AND user_b_id=?)',[userId,friendId,friendId,userId]);
  if(!conv) return { streakDays:0, messageCount:0, lastMessageAt:null };
  const msgs = await all('SELECT sender_id, created_at FROM friend_messages WHERE conversation_id=? ORDER BY sequence ASC',[conv.id]);
  const byDay = new Map();
  for(const m of msgs){
    const d=m.created_at.slice(0,10);
    const info=byDay.get(d)||{senders:new Set(), first:m.created_at, last:m.created_at};
    info.senders.add(m.sender_id);
    if(new Date(m.created_at)<new Date(info.first)) info.first=m.created_at;
    if(new Date(m.created_at)>new Date(info.last)) info.last=m.created_at;
    byDay.set(d,info);
  }
  const valid = new Set([...byDay.entries()].filter(([,info])=>info.senders.has(userId)&&info.senders.has(friendId)&&(new Date(info.last)-new Date(info.first)>=60000)).map(([d])=>d));
  let streak=0; const cursor=new Date(); while(valid.has(cursor.toISOString().slice(0,10))){ streak++; cursor.setUTCDate(cursor.getUTCDate()-1); }
  return { streakDays: streak, messageCount: msgs.length, lastMessageAt: msgs.at(-1)?.created_at || null };
}


const matchQueues = new Map();
const practiceRooms = new Map();
const tipSets = {
  kids: {
    en: ['Ask: What is your favorite game?', 'Ask: What color do you like?', 'Ask: Do you like school?', 'Ask: What snack do you like?'],
    es: ['Pregunta: ¿Cuál es tu juego favorito?', 'Pregunta: ¿Qué color te gusta?', 'Pregunta: ¿Te gusta la escuela?'],
    fr: ['Demande: Quel est ton jeu préféré?', 'Demande: Quelle couleur tu aimes?', 'Demande: Tu aimes l’école?'],
    pt: ['Pergunte: qual é sua brincadeira favorita?', 'Pergunte: que cor você gosta?', 'Pergunte: você gosta da escola?']
  },
  teens: {
    en: ['Ask: What music do you like?', 'Ask: How was your day?', 'Ask: What do you like to do after school?'],
    es: ['Pregunta: ¿Qué música te gusta?', 'Pregunta: ¿Cómo fue tu día?', 'Pregunta: ¿Qué haces después de la escuela?'],
    fr: ['Demande: Quelle musique tu aimes?', 'Demande: Comment s’est passée ta journée?', 'Demande: Qu’est-ce que tu fais après l’école?'],
    pt: ['Pergunte: que música você gosta?', 'Pergunte: como foi seu dia?', 'Pergunte: o que você faz depois da escola?']
  },
  general: {
    en: ['Ask: How was your day?', 'Ask: What food do you like?', 'Ask: Where would you like to travel?'],
    es: ['Pregunta: ¿Cómo fue tu día?', 'Pregunta: ¿Qué comida te gusta?', 'Pregunta: ¿A dónde te gustaría viajar?'],
    fr: ['Demande: Comment s’est passée ta journée?', 'Demande: Quel plat tu aimes?', 'Demande: Où voudrais-tu voyager?'],
    pt: ['Pergunte: como foi seu dia?', 'Pergunte: que comida você gosta?', 'Pergunte: para onde você gostaria de viajar?']
  },
  business: {
    en: ['Ask: What do you do for work?', 'Ask: How was your last meeting?', 'Ask: What project are you working on?'],
    es: ['Pregunta: ¿En qué trabajas?', 'Pregunta: ¿Cómo fue tu última reunión?', 'Pregunta: ¿En qué proyecto estás trabajando?'],
    fr: ['Demande: Quel est ton travail?', 'Demande: Comment s’est passée ta dernière réunion?', 'Demande: Sur quel projet tu travailles?'],
    pt: ['Pergunte: com o que você trabalha?', 'Pergunte: como foi sua última reunião?', 'Pergunte: em que projeto você está trabalhando?']
  }
};

const forbiddenModerationRules = [
  { reason: 'palavrões', pattern: /\b(porra|caralho|puta|puto|merda|foda|fodase|foda-se|buceta|cuzao|cuzão|arrombado|cacete|desgracado|desgraçado|idiota|burro)\b/i },
  { reason: 'conteúdo adulto', pattern: /\b(sexo|sexual|porn|porno|pornografia|nude|nudes|pelado|pelada|tesao|tesão|gozar|boquete|oral|anal|vagina|penis|pênis|buceta|peito|peitos)\b/i },
  { reason: 'apostas', pattern: /\b(aposta|apostas|bet|bets|cassino|casino|roleta|blackjack|jogo do bicho|tigrinho|fortune tiger|bet365|blaze)\b/i },
  { reason: 'drogas', pattern: /\b(cocaina|cocaína|maconha|crack|heroina|heroína|lsd|ecstasy|mdma|droga|drogas|trafico|tráfico)\b/i },
  { reason: 'violência ou ódio', pattern: /\b(matar|morte|estuprar|estupro|racista|nazista|hitler)\b/i }
];
function normalizeModerationText(text){ return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
function moderationProblem(text){
  const normalized = normalizeModerationText(text);
  return forbiddenModerationRules.find(rule => rule.pattern.test(normalized) || rule.pattern.test(String(text || '')));
}

function matchKey(language, audience){ return String(language || 'en') + ':' + String(audience || 'general'); }
function safeSend(ws, data){ if(ws.readyState === 1) ws.send(JSON.stringify(data)); }
function randomTip(language, audience){ const group = tipSets[audience] || tipSets.general; const list = group[language] || group.en || tipSets.general.en; return list[Math.floor(Math.random() * list.length)]; }
function removeFromQueue(socket){
  for (const [key, queue] of matchQueues.entries()) {
    const next = queue.filter(item => item.ws !== socket);
    if (next.length) matchQueues.set(key, next); else matchQueues.delete(key);
  }
}
async function wsUserFromRequest(req){
  const url = parseUrl(req);
  const value = url.searchParams.get('token') || '';
  const session = await one('SELECT * FROM sessions WHERE token = ?', [value]);
  if (!session?.user_id) return null;
  return one('SELECT * FROM users WHERE id = ?', [session.user_id]);
}
function roomFor(socket){ return socket.practiceRoomId ? practiceRooms.get(socket.practiceRoomId) : null; }
function idleNotice(language, audience){
  const notices = {
    en: 'You have been quiet for 40 seconds. Try asking: How are you?',
    es: 'Ustedes ficaram 40 segundos sem falar. Tente perguntar: ¿Cómo estás?',
    fr: 'Vous êtes silencieux depuis 40 secondes. Essaie de demander: Comment ça va?',
    pt: 'Vocês ficaram 40 segundos sem falar. Tente perguntar: Como você está?'
  };
  if (audience === 'kids' && language === 'en') return 'You have been quiet for 40 seconds. Ask: What is your favorite game?';
  return notices[language] || notices.en;
}
function armIdleNotice(room){
  clearTimeout(room.idleTimeout);
  room.idleTimeout = setTimeout(() => {
    if (!room.ended) {
      const tip = idleNotice(room.language, room.audience);
      for (const client of room.clients) safeSend(client, { type:'tip', tip });
      armIdleNotice(room);
    }
  }, 40 * 1000);
}

async function endPracticeRoom(roomId){
  const room = practiceRooms.get(roomId);
  if(!room) return;
  room.ended = true;
  const endedAt = now();
  await exec('UPDATE practice_sessions SET ended_at=? WHERE id=? AND ended_at IS NULL',[endedAt, roomId]).catch(()=>{});
  clearTimeout(room.timeout);
  clearTimeout(room.idleTimeout);
  for(const client of room.clients){ safeSend(client, { type:'ended', endedAt }); client.practiceRoomId = null; }
  practiceRooms.delete(roomId);
}
async function makeMatch(a, b, language, audience){
  const roomId = id();
  const startedAt = now();
  const endsAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  await exec('INSERT INTO practice_sessions (id,language,audience,user_a_id,user_b_id,started_at,ends_at,ended_at) VALUES (?,?,?,?,?,?,?,NULL)', [roomId, language, audience, a.user.id, b.user.id, startedAt, endsAt]);
  const room = { id: roomId, language, audience, clients: [a.ws, b.ws], users: new Map([[a.ws, a.user], [b.ws, b.user]]), endsAt, timeout: setTimeout(() => endPracticeRoom(roomId), 5 * 60 * 1000), idleTimeout: null, ended: false };
  practiceRooms.set(roomId, room);
  a.ws.practiceRoomId = roomId; b.ws.practiceRoomId = roomId;
  safeSend(a.ws, { type:'matched', roomId, endsAt, partner: friendUser(b.user), tip: randomTip(language, audience) });
  safeSend(b.ws, { type:'matched', roomId, endsAt, partner: friendUser(a.user), tip: randomTip(language, audience) });
  armIdleNotice(room);
}
function setupPracticeWebSocket(server){
  const wss = new WebSocketServer({ noServer: true });
  server.on('upgrade', (req, socket, head) => {
    const pathname = parseUrl(req).pathname;
    if (pathname !== '/ws') return socket.destroy();
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
  });
  wss.on('connection', async (ws, req) => {
    const user = await wsUserFromRequest(req).catch(()=>null);
    if(!user){ safeSend(ws,{type:'error',message:'Entre na conta para conversar.'}); ws.close(); return; }
    ws.user = user;
    safeSend(ws,{type:'ready', user: friendUser(user)});
    ws.on('message', async (raw) => {
      try {
        const data = JSON.parse(String(raw));
        if(data.type === 'find'){
          removeFromQueue(ws);
          const language = ['en','es','fr','pt'].includes(data.language) ? data.language : 'en';
          const audience = String(data.audience || 'general');
          const key = matchKey(language, audience);
          const queue = (matchQueues.get(key) || []).filter(item => item.ws.readyState === 1 && item.user.id !== user.id);
          const partner = queue.shift();
          matchQueues.set(key, queue);
          if(partner) await makeMatch({ws,user}, partner, language, audience);
          else { const ownQueue = matchQueues.get(key) || []; ownQueue.push({ws,user,createdAt:Date.now()}); matchQueues.set(key, ownQueue); safeSend(ws,{type:'searching', tip: randomTip(language, audience)}); }
        }
        if(data.type === 'message'){
          const room = roomFor(ws); if(!room || room.ended) return;
          armIdleNotice(room);
          const content = validateText(data.content, 'Mensagem', 1, 1000);
          const problem = moderationProblem(content);
          if(problem){ safeSend(ws,{type:'blocked', message:'Mensagem bloqueada para manter o chat seguro e saudável.'}); return; }
          const createdAt = now();
          const message = { id:id(), senderId:user.id, content, createdAt };
          await exec('INSERT INTO practice_messages (id,session_id,sender_id,content,created_at) VALUES (?,?,?,?,?)',[message.id, room.id, user.id, content, createdAt]);
          for(const client of room.clients) safeSend(client,{type:'message', message});
          if(Math.random() < 0.35) safeSend(ws,{type:'tip', tip: randomTip(room.language, room.audience)});
        }
        if(data.type === 'addFriend'){
          const room = roomFor(ws); if(!room) return;
          const other = [...room.users.values()].find(item => item.id !== user.id); if(!other) return;
          const rel = await friendship(user.id, other.id);
          if(!rel){ await exec('INSERT INTO friendships (id,requester_id,addressee_id,status,created_at) VALUES (?,?,?,?,?)',[id(), user.id, other.id, 'pending', now()]); }
          safeSend(ws,{type:'friendRequestSent'});
        }
      } catch (error) { safeSend(ws,{type:'error', message:error.message || 'Erro na conversa.'}); }
    });
    ws.on('close', () => {
      removeFromQueue(ws);
      const room = roomFor(ws);
      if(room && !room.ended){ for(const client of room.clients) if(client !== ws) safeSend(client,{type:'partnerLeft'}); endPracticeRoom(room.id); }
    });
  });
}

async function api(req, res) {
  const url = parseUrl(req); const route = url.pathname.replace(/^\/api/, '') || '/'; const method = req.method;
  if (method === 'GET' && route === '/health') return send(res, 200, { status: 'ok' });
  if (method === 'POST' && route === '/sessions') { const s = { id:id(), token:token(), created_at:now() }; await exec('INSERT INTO sessions (id, token, user_id, created_at) VALUES (?, ?, NULL, ?)', [s.id,s.token,s.created_at]); return send(res,201,{token:s.token}); }
  if (method === 'POST' && route === '/auth/check-username') { const data=await body(req); const username=normalizeUsername(data.username); if(username.length < 3) return send(res,200,{available:false,username,message:'Use pelo menos 3 caracteres.'}); if(!/^[a-z0-9]{3,24}$/.test(username)) return send(res,200,{available:false,username,message:'Use apenas letras e números.'}); const exists=await one('SELECT id FROM users WHERE username=?',[username]); return send(res,200,{available:!exists,username,message:exists?'Esse nome de usuário já existe.':'Nome de usuário disponível.'}); }
  if (method === 'POST' && route === '/auth/register') { const data=await body(req); const name=validateText(data.name,'Nome',2,120); const username=normalizeUsername(validateText(data.username,'Nome de usuário',3,24)); if(!/^[a-z0-9]{3,24}$/.test(username)) throw httpError(422,'O nome de usuário deve ter 3 a 24 caracteres, só letras e números, sem espaços.'); const email=validateText(data.email,'Email',5,180).toLowerCase(); if(!emailLooksValid(email)) throw httpError(422,'Use um e-mail válido.'); await ensureEmailDomain(email); const password=validatePasswordRules(data.password); if(await one('SELECT id FROM users WHERE email=? OR username=?',[email,username])) throw httpError(409,'Email ou nome de usuário já está em uso.'); const user={id:id(),name,username,email,passwordHash:hashPassword(password),createdAt:now()}; try { await exec('INSERT INTO users (id,name,username,email,password_hash,avatar_url,default_language,email_verified_at,created_at) VALUES (?,?,?,?,?,?,?,?,?)',[user.id,name,username,email,user.passwordHash,'','pt',null,user.createdAt]); const verifyToken=await issueEmailToken(user.id,'verify',59/60); const mail=templates.verify({name,url:appUrl(`/?verify=${verifyToken}`)}); await sendMail({to:email,...mail}); return send(res,201,{pendingVerification:true,email}); } catch (error) { await exec('DELETE FROM email_tokens WHERE user_id=?',[user.id]).catch(()=>{}); await exec('DELETE FROM users WHERE id=? AND email_verified_at IS NULL',[user.id]).catch(()=>{}); throw emailSendError(error); } }
  if (method === 'POST' && route === '/auth/login') { const data=await body(req); const login=validateText(data.email,'Login',1,180).toLowerCase().replace(/^@+/,''); const pass=validateText(data.password,'Senha',1,200); const user=await one('SELECT * FROM users WHERE email=? OR username=?',[login,login]); if(!user || !verifyPassword(pass,user.password_hash)) throw httpError(401,'Credenciais inválidas.'); if(!user.email_verified_at){ const verifyToken=await issueEmailToken(user.id,'verify',59/60); const mail=templates.verify({name:user.name,url:appUrl('/?verify='+verifyToken)}); try { await sendMail({to:user.email,...mail}); } catch(error) { await markEmailTokenUsed(verifyToken); throw emailSendError(error); } throw httpError(403,'Confirme seu e-mail antes de entrar. Enviamos um novo link para você.'); } if(await trustedDevice(req,user.id)) return send(res,200,await loginSession(user)); const code=await issueLoginCode(user.id); const mail=templates.twoFactor({name:user.name,code}); try { await sendMail({to:user.email,...mail}); } catch(error) { await exec('UPDATE email_tokens SET used_at=? WHERE user_id=? AND kind=? AND token=? AND used_at IS NULL',[now(),user.id,'login_2fa',code]).catch(()=>{}); throw emailSendError(error); } return send(res,200,{requiresTwoFactor:true,email:user.email}); }
  if (method === 'POST' && route === '/auth/verify-login') { const data=await body(req); const email=validateText(data.email,'Email',5,180).toLowerCase(); const user=await consumeLoginCode(email,data.code); if(data.rememberMe===true) await rememberDevice(res,user.id); return send(res,200,await loginSession(user)); }
  if (method === 'POST' && route === '/auth/verify-email') { const data=await body(req); const row=await consumeEmailToken(data.token,'verify'); await exec('UPDATE users SET email_verified_at=? WHERE id=?',[now(),row.user_id]); const user=await one('SELECT * FROM users WHERE id=?',[row.user_id]); const sess={id:id(),token:token(),createdAt:now()}; await exec('INSERT INTO sessions (id,token,user_id,created_at) VALUES (?,?,?,?)',[sess.id,sess.token,user.id,sess.createdAt]); return send(res,200,{token:sess.token,user:publicUser(user)}); }
  if (method === 'POST' && route === '/auth/forgot-password') { const data=await body(req); const email=validateText(data.email,'Email',5,180).toLowerCase(); if(emailLooksValid(email)){ const user=await one('SELECT * FROM users WHERE email=?',[email]); if(user){ const resetToken=await issueEmailToken(user.id,'reset',59/60); const mail=templates.reset({name:user.name,url:appUrl(`/?reset=${resetToken}`)}); try { await sendMail({to:user.email,...mail}); } catch(error) { await markEmailTokenUsed(resetToken); throw emailSendError(error); } } } return send(res,200,{sent:true}); }
  if (method === 'POST' && route === '/auth/reset-password') { const data=await body(req); const password=validatePasswordRules(data.password); const row=await consumeEmailToken(data.token,'reset'); await exec('UPDATE users SET password_hash=? WHERE id=?',[hashPassword(password),row.user_id]); await exec('DELETE FROM trusted_devices WHERE user_id=?',[row.user_id]); const user=await one('SELECT * FROM users WHERE id=?',[row.user_id]); const sess={id:id(),token:token(),createdAt:now()}; await exec('INSERT INTO sessions (id,token,user_id,created_at) VALUES (?,?,?,?)',[sess.id,sess.token,user.id,sess.createdAt]); return send(res,200,{token:sess.token,user:publicUser(user)}); }
  const a = await auth(req);
  if (route === '/profile' && method === 'GET') return send(res,200,{user:publicUser(a.user),stats:a.user?await profileStats(a.user.id):{streakDays:0,friends:0,practicedSeconds:0,messageCount:0}});
  if (route === '/profile' && method === 'PATCH') { if(!a.user) throw httpError(401,'Entre na conta.'); const d=await body(req); const fields=[]; const params=[]; if(d.name!==undefined){fields.push('name=?');params.push(validateText(d.name,'Nome',2,120));} if(d.username!==undefined){const u=normalizeUsername(validateText(d.username,'Nome de usuário',3,24)); if(!/^[a-z0-9]{3,24}$/.test(u)) throw httpError(422,'Use de 3 a 24 letras e números, sem espaços ou caracteres especiais.'); const exists=await one('SELECT id FROM users WHERE username=? AND id<>?',[u,a.user.id]); if(exists) throw httpError(409,'Este nome de usuário já está em uso.'); fields.push('username=?');params.push(u);} if(d.avatarUrl!==undefined){fields.push('avatar_url=?');params.push(String(d.avatarUrl||''));} if(d.defaultLanguage!==undefined && ['pt','en','es','fr'].includes(d.defaultLanguage)){fields.push('default_language=?');params.push(d.defaultLanguage);} if(fields.length) await exec(`UPDATE users SET ${fields.join(', ')} WHERE id=?`,[...params,a.user.id]); const user=await one('SELECT * FROM users WHERE id=?',[a.user.id]); return send(res,200,{user:publicUser(user),stats:await profileStats(a.user.id)}); }
  if (route === '/chats/speech/clean' && method === 'POST') { const d=await body(req); const text=validateText(d.text,'Texto',1,4000); const cleaned=await generateAi(`Corrija apenas erros óbvios de transcrição. Responda apenas com a frase final.`,[{role:'user',content:text}],300).catch(()=>text); return send(res,200,{text:cleaned}); }
  if (route === '/chats' && method === 'POST') { const d=await body(req); const c={id:id(),owner:a.owner,title:d.title||'Nova conversa',language:d.language||'en',courseId:d.courseId||'general',audience:d.audience||'general',createdAt:now(),updatedAt:now()}; await exec('INSERT INTO chats (id,owner_id,title,language,course_id,audience,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)',[c.id,c.owner,c.title,c.language,c.courseId,c.audience,c.createdAt,c.updatedAt]); return send(res,201,{id:c.id,title:c.title,language:c.language,courseId:c.courseId,audience:c.audience,createdAt:c.createdAt,updatedAt:c.updatedAt}); }
  if (route === '/chats' && method === 'GET') { const limit=Math.min(Number(url.searchParams.get('limit')||30),100); const offset=Math.max(Number(url.searchParams.get('offset')||0),0); const items=await all('SELECT * FROM chats WHERE owner_id=? ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?',[a.owner,limit,offset]); const total=await one('SELECT COUNT(*) total FROM chats WHERE owner_id=?',[a.owner]); return send(res,200,{items:items.map(chatDto),total:Number(total.total||0),limit,offset}); }
  let m = route.match(/^\/chats\/([^/]+)$/); if(m){ const c=await one('SELECT * FROM chats WHERE id=? AND owner_id=?',[m[1],a.owner]); if(!c) throw httpError(404,'Conversa não encontrada.'); if(method==='GET') return send(res,200,chatDto(c)); if(method==='PATCH'){const d=await body(req); await exec('UPDATE chats SET title=?, updated_at=? WHERE id=?',[validateText(d.title,'Título',1,120),now(),c.id]); return send(res,200,chatDto(await one('SELECT * FROM chats WHERE id=?',[c.id])));} if(method==='DELETE'){ await exec('DELETE FROM turns WHERE chat_id=?',[c.id]); await exec('DELETE FROM chats WHERE id=?',[c.id]); return send(res,204); } }
  m = route.match(/^\/chats\/([^/]+)\/evaluate$/); if(m&&method==='POST'){ const c=await one('SELECT * FROM chats WHERE id=? AND owner_id=?',[m[1],a.owner]); if(!c) throw httpError(404,'Conversa não encontrada.'); const turns=await all('SELECT * FROM turns WHERE chat_id=? ORDER BY sequence ASC',[c.id]); const context=turns.flatMap(t=>[{role:'user',content:t.user_text},{role:'assistant',content:t.assistant_text}]); const profile={language:c.language,courseId:c.course_id,audience:c.audience,firstName:firstName(a.user?.name),defaultLanguage:a.user?.default_language||'pt'}; try{ const raw=await generateAi('Avalie esta prática de idioma em JSON puro. Responda somente JSON válido com as chaves stars e feedback. stars deve ser inteiro de 1 a 5. feedback deve ter uma frase curta em português, com um elogio específico e uma melhoria.\n'+instructionsFor(profile),context,800); const parsed=JSON.parse(raw.replace(/```json|```/g,'').trim()); return send(res,200,{stars:Math.max(1,Math.min(5,Number(parsed.stars||1))),feedback:String(parsed.feedback||'Boa prática! Continue treinando.')}); }catch{ return send(res,200,{stars:3,feedback:'Boa prática! Você completou parte da situação; tente usar frases mais naturais na próxima vez.'}); } }
  m = route.match(/^\/chats\/([^/]+)\/messages$/); if(m){ const c=await one('SELECT * FROM chats WHERE id=? AND owner_id=?',[m[1],a.owner]); if(!c) throw httpError(404,'Conversa não encontrada.'); if(method==='GET'){const limit=Math.min(Number(url.searchParams.get('limit')||100),100); const offset=Math.max(Number(url.searchParams.get('offset')||0),0); const turns=await all('SELECT * FROM turns WHERE chat_id=? ORDER BY sequence ASC LIMIT ? OFFSET ?',[c.id,limit,offset]); const total=await one('SELECT COUNT(*) total FROM turns WHERE chat_id=?',[c.id]); return send(res,200,{items:turns.flatMap(t=>chatMessages(t)),total:Number(total.total||0),limit,offset});} if(method==='POST'){const d=await body(req); const content=validateText(d.content,'Mensagem',1,4000); const requestId=validateText(d.requestId,'requestId',1,100); const saved=await one('SELECT * FROM turns WHERE chat_id=? AND request_id=?',[c.id,requestId]); if(saved) return send(res,200,{messages:chatMessages(saved)}); const turns=await all('SELECT * FROM turns WHERE chat_id=? ORDER BY sequence ASC',[c.id]); const context=turns.flatMap(t=>[{role:'user',content:t.user_text},{role:'assistant',content:t.assistant_text}]); context.push({role:'user',content}); const profile={language:c.language,courseId:c.course_id,audience:c.audience,firstName:firstName(a.user?.name),defaultLanguage:a.user?.default_language||'pt'}; const assistantText=await generateAi(instructionsFor(profile),context,2000); const tr=d.translate?await translate(assistantText,profile.defaultLanguage):''; const t={id:id(),createdAt:now(),sequence:turns.length+1}; await exec('INSERT INTO turns (id,chat_id,request_id,sequence,user_text,assistant_text,created_at) VALUES (?,?,?,?,?,?,?)',[t.id,c.id,requestId,t.sequence,content,assistantText,t.createdAt]); await exec('UPDATE chats SET title=?, updated_at=? WHERE id=?',[turns.length===0&&c.title==='Nova conversa'?content.slice(0,80):c.title,t.createdAt,c.id]); return send(res,200,{messages:chatMessages({id:t.id,user_text:content,assistant_text:assistantText,created_at:t.createdAt},tr)});} }

  if(route==='/groups'&&method==='GET'){ if(!a.user) throw httpError(401,'Entre na conta.'); const rows=await all('SELECT g.* FROM groups g JOIN group_members gm ON gm.group_id=g.id WHERE gm.user_id=? ORDER BY g.updated_at DESC',[a.user.id]); const items=[]; for(const g of rows) items.push(await groupDto(g)); return send(res,200,{items}); }
  if(route==='/groups'&&method==='POST'){ if(!a.user) throw httpError(401,'Entre na conta.'); const d=await body(req); const name=validateText(d.name,'Nome do grupo',2,120); const maxMembers=Math.max(2,Math.min(100,Number(d.maxMembers||10))); let code=inviteCode(); while(await one('SELECT id FROM groups WHERE invite_code=?',[code])) code=inviteCode(); const gid=id(); const n=now(); await exec('INSERT INTO groups (id,owner_id,name,invite_code,max_members,is_public,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)',[gid,a.user.id,name,code,maxMembers,d.isPublic?1:0,n,n]); await exec('INSERT INTO group_members (id,group_id,user_id,role,joined_at) VALUES (?,?,?,?,?)',[id(),gid,a.user.id,'owner',n]); return send(res,201,await groupDto(await one('SELECT * FROM groups WHERE id=?',[gid]))); }
  m=route.match(/^\/groups\/invite\/([^/]+)$/); if(m&&method==='GET'){ if(!a.user) throw httpError(401,'Entre na conta.'); const g=await one('SELECT * FROM groups WHERE invite_code=?',[m[1]]); if(!g) throw httpError(404,'Convite não encontrado.'); const dto=await groupDto(g); return send(res,200,{...dto,isMember:!!(await groupMember(g.id,a.user.id))}); }
  m=route.match(/^\/groups\/invite\/([^/]+)\/join$/); if(m&&method==='POST'){ if(!a.user) throw httpError(401,'Entre na conta.'); const g=await one('SELECT * FROM groups WHERE invite_code=?',[m[1]]); if(!g) throw httpError(404,'Convite não encontrado.'); if(!(await groupMember(g.id,a.user.id))){ const c=await one('SELECT COUNT(*) total FROM group_members WHERE group_id=?',[g.id]); if(Number(c.total||0)>=Number(g.max_members||10)) throw httpError(409,'Este grupo está cheio.'); await exec('INSERT INTO group_members (id,group_id,user_id,role,joined_at) VALUES (?,?,?,?,?)',[id(),g.id,a.user.id,'member',now()]); } return send(res,200,await groupDto(g)); }
  m=route.match(/^\/groups\/([^/]+)$/); if(m&&method==='GET'){ if(!a.user) throw httpError(401,'Entre na conta.'); const g=await one('SELECT * FROM groups WHERE id=?',[m[1]]); if(!g || !(await groupMember(g.id,a.user.id))) throw httpError(404,'Grupo não encontrado.'); const members=(await all('SELECT u.id,u.name,u.username,u.avatar_url,u.default_language,gm.role,gm.joined_at FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? ORDER BY gm.joined_at ASC',[g.id])).map(x=>({...friendUser(x),role:x.role,joinedAt:x.joined_at})); return send(res,200,{...(await groupDto(g)),members}); }
  m=route.match(/^\/groups\/([^/]+)\/members\/([^/]+)$/); if(m&&method==='DELETE'){ if(!a.user) throw httpError(401,'Entre na conta.'); const g=await one('SELECT * FROM groups WHERE id=?',[m[1]]); if(!g || !(await groupMember(g.id,a.user.id))) throw httpError(404,'Grupo não encontrado.'); if(g.owner_id!==a.user.id) throw httpError(403,'Apenas o dono pode remover membros.'); if(m[2]===a.user.id) throw httpError(409,'Você não pode expulsar a si mesmo.'); const member=await groupMember(g.id,m[2]); if(!member) throw httpError(404,'Membro não encontrado.'); await exec('DELETE FROM group_members WHERE group_id=? AND user_id=?',[g.id,m[2]]); await exec('UPDATE groups SET updated_at=? WHERE id=?',[now(),g.id]); return send(res,204); }
  m=route.match(/^\/groups\/([^/]+)\/messages$/); if(m){ if(!a.user) throw httpError(401,'Entre na conta.'); const g=await one('SELECT * FROM groups WHERE id=?',[m[1]]); if(!g || !(await groupMember(g.id,a.user.id))) throw httpError(404,'Grupo não encontrado.'); if(method==='GET'){ const items=(await all('SELECT gm.*,u.name,u.username,u.avatar_url FROM group_messages gm JOIN users u ON u.id=gm.sender_id WHERE gm.group_id=? ORDER BY gm.sequence ASC',[g.id])).map(x=>({id:x.id,senderId:x.sender_id,name:x.name,username:x.username,avatarUrl:x.avatar_url||'',content:x.content,createdAt:x.created_at})); return send(res,200,{items}); } if(method==='POST'){ const d=await body(req); const content=validateText(d.content,'Mensagem',1,4000); const c=await one('SELECT COUNT(*) total FROM group_messages WHERE group_id=?',[g.id]); const n=now(); const mid=id(); await exec('INSERT INTO group_messages (id,group_id,sender_id,content,sequence,created_at) VALUES (?,?,?,?,?,?)',[mid,g.id,a.user.id,content,Number(c.total||0)+1,n]); await exec('UPDATE groups SET updated_at=? WHERE id=?',[n,g.id]); return send(res,200,{message:{id:mid,senderId:a.user.id,name:a.user.name,username:a.user.username,avatarUrl:a.user.avatar_url||'',content,createdAt:n}}); } }

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
setupPracticeWebSocket(server);
init().then(()=>server.listen(PORT,HOST,()=>console.log(`Change server on ${HOST}:${PORT}`))).catch((e)=>{ console.error(e); process.exit(1); });

