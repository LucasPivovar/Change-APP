import 'dotenv/config';

function integer(name: string, fallback: number, min: number, max: number) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} deve ser um inteiro entre ${min} e ${max}.`);
  }
  return value;
}

export const config = {
  port: integer('PORT', 3001, 1, 65535),
  host: process.env.HOST || '127.0.0.1',
  databasePath: process.env.DATABASE_PATH || './data/chat.sqlite',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  aiProvider: (process.env.AI_PROVIDER || 'gemini').toLowerCase(),
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  groqApiKey: process.env.GROQ_API_KEY || '',
  maxContextBytes: integer('MAX_CONTEXT_BYTES', 60000, 1000, 200000),
};
