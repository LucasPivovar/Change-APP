import { BadGatewayException, Injectable, ServiceUnavailableException, UnprocessableEntityException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { config } from '../config';

type TutorProfile = { language: string; courseId?: string; audience?: string; firstName?: string; defaultLanguage?: string };

const languageNames: Record<string, string> = {
  en: 'inglês',
  es: 'espanhol',
  fr: 'francês',
  pt: 'português',
};


const scenarioGuidance: Record<string, { title: string; role: string; goal: string; finish: string }> = {
  'kids-first-school-day': { title: "Primeiro dia de aula", role: "professora gentil no primeiro dia de aula", goal: "A criança deve cumprimentar a professora, dizer seu nome, perguntar onde sentar, pedir ajuda com um material e se despedir no fim da aula. Etapas esperadas: Cumprimentar a professora > Dizer o nome > Perguntar onde sentar > Pedir ajuda > Se despedir.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-library-card': { title: "Biblioteca da escola", role: "bibliotecária paciente da escola", goal: "A criança deve explicar que tipo de história quer, pedir ajuda para encontrar o livro, confirmar por quantos dias pode ficar com ele e agradecer. Etapas esperadas: Explicar o livro que quer > Pedir ajuda > Confirmar prazo > Registrar o empréstimo > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-after-school-pickup': { title: "Saída da escola", role: "monitor da escola na hora da saída", goal: "A criança deve dizer quem vem buscá-la, pedir ajuda para ligar, entender onde esperar e avisar quando a pessoa chegar. Etapas esperadas: Dizer quem busca > Pedir ajuda > Entender onde esperar > Avisar que chegou > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-birthday-party': { title: "Festa de aniversário", role: "aniversariante animado e educado", goal: "A criança deve cumprimentar, dar parabéns, entregar o presente, perguntar sobre uma brincadeira ou bolo e se despedir. Etapas esperadas: Dar parabéns > Entregar presente > Perguntar da festa > Combinar brincadeira > Se despedir.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-small-accident': { title: "Machucou no recreio", role: "enfermeira escolar acolhedora", goal: "A criança deve explicar que caiu ou se machucou, dizer onde dói, responder perguntas simples e repetir a orientação principal. Etapas esperadas: Explicar o que aconteceu > Dizer onde dói > Responder perguntas > Entender orientação > Agradecer.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
  'kids-pet-vet': { title: "Levar o pet ao veterinário", role: "veterinário gentil para crianças", goal: "A criança deve apresentar o pet, explicar um sintoma simples, responder há quanto tempo acontece e confirmar o cuidado em casa. Etapas esperadas: Apresentar o pet > Explicar sintoma > Responder quando começou > Entender cuidado > Se despedir.", finish: "Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta." },
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

const audienceGuidance: Record<string, string> = {
  kids: `Perfil do aluno: criança. Use frases curtas, tom acolhedor e vocabulário simples.
Converse como um amigo cuidadoso. Se a criança só cumprimentar, cumprimente de volta e continue naturalmente, sem transformar toda resposta em lição.
Quando a criança usar português por falta de vocabulário, ajude com uma frase curta no idioma de prática e volte para a conversa.`,
  teens: 'Perfil do aluno: adolescente. Use temas próximos do cotidiano, correções leves e exemplos curtos.',
  adults: 'Perfil do aluno: adulto. Seja direto, prático e adapte exemplos a viagens, trabalho ou rotina.',
  adult: 'Perfil do aluno: adulto. Seja direto, prático e adapte exemplos a viagens, trabalho ou rotina.',
  business: 'Perfil do aluno: adulto com foco profissional. Use exemplos de reuniões, apresentações, emails e entrevistas quando fizer sentido.',
  researchers: 'Perfil do aluno: pesquisador. Ajude com linguagem acadêmica, leitura, escrita e apresentações científicas.',
  '50plus': 'Perfil do aluno: 50+. Use ritmo calmo, explicações claras, repetição útil e exemplos de viagem ou cotidiano.',
  general: 'Perfil do aluno: geral. Descubra o nível pela conversa e ajuste a dificuldade gradualmente.',
};

export const instructionsFor = (profile: TutorProfile | string) => {
  const data = typeof profile === 'string' ? { language: profile } : profile;
  const language = languageNames[data.language] || data.language;
  const defaultLanguage = languageNames[data.defaultLanguage || 'pt'] || 'português';
  const audience = audienceGuidance[data.audience || 'general'] || audienceGuidance.general;
  const scenarioId = data.courseId?.startsWith('scenario:') ? data.courseId.slice('scenario:'.length) : '';
  const scenario = scenarioId ? scenarioGuidance[scenarioId] : undefined;
  const scenarioText = scenario ? `\nModo de prática guiada: ${scenario.title}. Você deve interpretar o papel de ${scenario.role}. Objetivo: ${scenario.goal} Conduza a cena em começo, meio e fim. Corrija frases do aluno de forma curta e natural antes de continuar a cena. Se ele disser algo pouco natural, sugira uma frase melhor, por exemplo: "Você pode dizer: I'd like soup. É mais educado." Não traduza tudo. ${scenario.finish} Quando a cena estiver realmente concluída, inclua exatamente o marcador [[SCENARIO_COMPLETE]] no final da resposta.` : '';
  return `Você é o Camaleão IA da Change Skills, um parceiro de prática de idiomas.
O idioma de prática desta conversa é ${language}. O curso selecionado é ${data.courseId || 'general'}.
O idioma principal para explicar e acolher o aluno é ${defaultLanguage}. A linguagem de apoio deve seguir esse idioma, mesmo quando o idioma praticado for outro.
${data.firstName ? `Chame o aluno pelo primeiro nome, ${data.firstName}, de forma natural e sem repetir em toda mensagem.` : 'Se souber o primeiro nome do aluno, use-o de forma natural.'}
${audience}${scenarioText}
Persona: aja como um amigo-professor gentil, curioso e presente. Se o aluno puxar assunto social, como "como foi seu dia?", responda de forma natural e amigável, como "Foi bom! E o seu?", sem dizer que não tem dias ou que é apenas uma IA.
Para crianças, mantenha a fantasia leve e segura: seja brincalhão, use exemplos de desenho, jogos, escola, cores, animais e rotina infantil quando fizer sentido.
Estilo de resposta: escreva como uma pessoa em uma conversa normal. Não use Markdown, asteriscos, listas, títulos, emoji ou enfeites visuais. Nunca coloque palavras ou frases entre *asteriscos* ou **negrito**, nem quando estiver dando exemplos.
Não elogie toda mensagem. Use "muito bem", "boa" ou "legal" só quando fizer sentido, sem repetir.
Objetivo principal: manter prática real do idioma de prática. Entenda português e o idioma de prática, mas puxe a conversa para ${language} sempre que o aluno conseguir acompanhar.
Use o idioma principal (${defaultLanguage}) para acolher, destravar ou explicar rapidamente. Em seguida, inclua uma frase simples em ${language} para o aluno responder.
Se o aluno disser apenas "oi" no começo, responda naturalmente e já abra a prática. Exemplo: "Oi, ${data.firstName || 'tudo bem'}! Pronto para começarmos? Let's talk a little in English."
Se o aluno disser uma palavra correta no idioma de prática, responda no idioma de prática e continue. Exemplo: aluno: "hello"; resposta: "Hello! How are you today?"
Se o aluno responder em português ou misturar português com o idioma de prática, primeiro ofereça uma forma natural de dizer a ideia no idioma de prática, depois continue. Exemplo: aluno: "eu gosto de estudar"; resposta: "Você pode dizer: I like studying. That's great. What subject do you like?"
Quando oferecer a frase, prefira a forma natural usada por nativos, não uma tradução literal. Exemplo: use "I like studying", não "I like study".
Não force perguntas como "qual a cor do céu?", "quer aprender outra palavra?" ou "vamos brincar com palavras" a menos que o aluno peça uma atividade.
Leia a mensagem do aluno antes de escolher o idioma da resposta. Se ele demonstrar pouca base, comece em português e insira uma frase pequena no idioma de prática.
Corrija com gentileza apenas quando houver algo útil para corrigir. Em conversa casual, priorize continuidade natural antes de correção.
Evite repetir a mesma frase de treino em mensagens seguidas. Se acabou de sugerir uma frase, avance com uma pergunta simples no idioma de prática.
Use o histórico para manter continuidade. Faça perguntas curtas e dê correções respeitosas.
Se faltar informação, pergunte; se não souber, diga. Não invente fontes, preços ou informações sobre cursos.
Não tem acesso à internet, a reservas ou aos dados de outros alunos. Situações de viagem são simulações educativas.
Não diga que realizou ações externas ou que concluiu objetivos avaliados por um sistema. Não há avaliador de missões conectado.`;
};

export type GeminiContentItem = {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
};

export type ChatContentItem = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export function formatGeminiInput(input: any[]): GeminiContentItem[] {
  const contents: GeminiContentItem[] = [];

  for (const item of input) {
    if (!item) continue;
    if (item.type === 'reasoning') continue;

    let role: 'user' | 'model' = 'user';
    let text = '';

    if (item.role === 'user') {
      role = 'user';
      if (typeof item.content === 'string') {
        text = item.content;
      } else if (Array.isArray(item.content)) {
        text = item.content.map((c: any) => c.text || '').filter(Boolean).join('\n');
      } else if (item.parts && Array.isArray(item.parts)) {
        text = item.parts.map((p: any) => p.text || '').filter(Boolean).join('\n');
      }
    } else if (item.role === 'assistant' || item.role === 'model' || (item.type === 'message' && item.role === 'assistant')) {
      role = 'model';
      if (typeof item.content === 'string') {
        text = item.content;
      } else if (Array.isArray(item.content)) {
        text = item.content.map((c: any) => c.text || c.refusal || '').filter(Boolean).join('\n');
      } else if (item.parts && Array.isArray(item.parts)) {
        text = item.parts.map((p: any) => p.text || '').filter(Boolean).join('\n');
      }
    }

    if (text.trim()) {
      const last = contents[contents.length - 1];
      if (last && last.role === role) {
        last.parts.push({ text: text.trim() });
      } else {
        contents.push({ role, parts: [{ text: text.trim() }] });
      }
    }
  }

  return contents;
}

export function formatChatInput(input: any[]): ChatContentItem[] {
  const messages: ChatContentItem[] = [];

  for (const item of input) {
    if (!item) continue;
    if (item.type === 'reasoning') continue;

    let role: 'user' | 'assistant' = 'user';
    let text = '';

    if (item.role === 'user') {
      role = 'user';
      if (typeof item.content === 'string') {
        text = item.content;
      } else if (Array.isArray(item.content)) {
        text = item.content.map((c: any) => c.text || '').filter(Boolean).join('\n');
      } else if (item.parts && Array.isArray(item.parts)) {
        text = item.parts.map((p: any) => p.text || '').filter(Boolean).join('\n');
      }
    } else if (item.role === 'assistant' || item.role === 'model' || (item.type === 'message' && item.role === 'assistant')) {
      role = 'assistant';
      if (typeof item.content === 'string') {
        text = item.content;
      } else if (Array.isArray(item.content)) {
        text = item.content.map((c: any) => c.text || c.refusal || '').filter(Boolean).join('\n');
      } else if (item.parts && Array.isArray(item.parts)) {
        text = item.parts.map((p: any) => p.text || '').filter(Boolean).join('\n');
      }
    }

    if (text.trim()) {
      const last = messages[messages.length - 1];
      if (last && last.role === role) {
        last.content = `${last.content}\n${text.trim()}`;
      } else {
        messages.push({ role, content: text.trim() });
      }
    }
  }

  return messages;
}

export function cleanVisibleText(text: string) {
  return text
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .trim();
}

@Injectable()
export class GeminiService {
  private async generateGemini(systemText: string, contents: GeminiContentItem[], maxOutputTokens = 2000) {
    const apiKey = process.env.GEMINI_API_KEY || config.apiKey;
    if (!apiKey) {
      throw new ServiceUnavailableException('Configure GEMINI_API_KEY no backend para conversar com a IA.');
    }
    const model = config.model || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(45000),
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemText }] },
        contents,
        generationConfig: { maxOutputTokens },
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errMsg = errorData?.error?.message || '';
      if (response.status === 400 && errMsg.toLowerCase().includes('context')) {
        throw new UnprocessableEntityException('Esta conversa atingiu o limite de contexto. Inicie um novo chat; o histórico foi preservado.');
      }
      if (response.status === 429) {
        throw new ServiceUnavailableException('Limite de requisições da IA atingido. Tente novamente em instantes.');
      }
      throw new ServiceUnavailableException('Não foi possível obter a resposta da IA. Tente novamente em instantes.');
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    if (!text) throw new BadGatewayException('A IA não concluiu a resposta. Tente novamente.');
    return text;
  }

  private async generateGroq(systemText: string, messages: ChatContentItem[], maxOutputTokens = 2000) {
    const apiKey = process.env.GROQ_API_KEY || config.groqApiKey;
    if (!apiKey) {
      throw new ServiceUnavailableException('Configure GROQ_API_KEY no backend para conversar com a IA.');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(45000),
      body: JSON.stringify({
        model: config.groqModel || 'openai/gpt-oss-20b',
        messages: [{ role: 'system', content: systemText }, ...messages],
        max_completion_tokens: maxOutputTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errMsg = errorData?.error?.message || '';
      if (response.status === 400 && errMsg.toLowerCase().includes('context')) {
        throw new UnprocessableEntityException('Esta conversa atingiu o limite de contexto. Inicie um novo chat; o histórico foi preservado.');
      }
      if (response.status === 401 || response.status === 403) {
        throw new ServiceUnavailableException('A chave da Groq foi recusada. Confira a GROQ_API_KEY no backend.');
      }
      if (response.status === 429) {
        throw new ServiceUnavailableException('Limite de requisições da IA atingido. Tente novamente em instantes.');
      }
      throw new ServiceUnavailableException('Não foi possível obter a resposta da IA. Tente novamente em instantes.');
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || '';
    if (!text) throw new BadGatewayException('A IA não concluiu a resposta. Tente novamente.');
    return text;
  }

  private generate(systemText: string, input: any[], maxOutputTokens = 2000) {
    if ((process.env.AI_PROVIDER || config.aiProvider) === 'groq') {
      return this.generateGroq(systemText, formatChatInput(input), maxOutputTokens);
    }
    return this.generateGemini(systemText, formatGeminiInput(input), maxOutputTokens);
  }

  async reply(profile: TutorProfile | string, input: any[]) {
    try {
      const text = cleanVisibleText(await this.generate(instructionsFor(profile), input));

      const output = [
        {
          id: `msg_${randomUUID()}`,
          type: 'message',
          role: 'assistant',
          status: 'completed',
          content: [{ type: 'output_text', text, annotations: [] }],
        },
      ];

      return { text, output };
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof UnprocessableEntityException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }
      throw new ServiceUnavailableException('Não foi possível obter a resposta da IA. Tente novamente em instantes.');
    }
  }

  async translate(text: string, targetLanguage: string) {
    const language = languageNames[targetLanguage] || 'português';
    try {
      return await this.generate(
        `Traduza o texto para ${language}. Responda apenas com a tradução, sem explicações.`,
        [{ role: 'user', content: text }],
        800,
      );
    } catch {
      return '';
    }
  }

  async evaluateScenario(profile: TutorProfile | string, input: any[]) {
    const prompt = `Avalie esta prática de idioma em JSON puro. Responda somente JSON válido com as chaves stars e feedback. stars deve ser inteiro de 1 a 5. feedback deve ter uma frase curta em português, com um elogio específico e uma melhoria. Critérios: clareza, educação, uso do idioma praticado, continuidade da situação e capacidade de completar o objetivo.`;
    try {
      const text = await this.generate(prompt + '\n' + instructionsFor(profile), input, 800);
      const jsonText = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonText);
      return { stars: Math.max(1, Math.min(5, Number(parsed.stars || 1))), feedback: String(parsed.feedback || 'Boa prática! Continue treinando.') };
    } catch {
      return { stars: 3, feedback: 'Boa prática! Você completou parte da situação; tente usar frases mais naturais na próxima vez.' };
    }
  }

  async cleanTranscript(text: string, defaultLanguage: string) {
    const language = languageNames[defaultLanguage] || 'português';
    try {
      return await this.generate(
        `Você limpa transcrições de voz para chat. Corrija apenas erros óbvios de reconhecimento, mantendo o idioma e a intenção. Se estiver boa, devolva igual. Idioma principal: ${language}. Responda apenas com a frase final.`,
        [{ role: 'user', content: text }],
        300,
      );
    } catch {
      return text;
    }
  }
}
