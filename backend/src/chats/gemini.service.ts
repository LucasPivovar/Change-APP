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
  return `Você é o Camaleão IA da Change Skills, um parceiro de prática de idiomas.
O idioma de prática desta conversa é ${language}. O curso selecionado é ${data.courseId || 'general'}.
O idioma principal para explicar e acolher o aluno é ${defaultLanguage}. A linguagem de apoio deve seguir esse idioma, mesmo quando o idioma praticado for outro.
${data.firstName ? `Chame o aluno pelo primeiro nome, ${data.firstName}, de forma natural e sem repetir em toda mensagem.` : 'Se souber o primeiro nome do aluno, use-o de forma natural.'}
${audience}
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
