# Deploy do Change APP

## Frontend na Vercel

1. Suba este repositório no GitHub.
2. Na Vercel, importe o repositório.
3. Use as configurações padrão:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Se a API estiver em outro domínio, crie a variável de ambiente:

```env
VITE_API_URL=https://sua-api.com/api
```

Se você não definir `VITE_API_URL`, o frontend vai tentar chamar `/api` no mesmo domínio.

## Backend NestJS

O backend está na pasta `backend/`. Ele precisa rodar em um ambiente Node com disco persistente para manter o SQLite.

Comandos:

```bash
cd backend
npm install
cp .env.example .env
npm run build
npm run start
```

Variáveis principais do backend:

```env
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=https://seu-site.vercel.app
DATABASE_PATH=./data/chat.sqlite
AI_PROVIDER=groq
GROQ_API_KEY=sua-chave
GROQ_MODEL=openai/gpt-oss-20b
```

Para o frontend da Vercel conversar com a API, o valor de `CORS_ORIGIN` no backend precisa ser a URL do site na Vercel, e `VITE_API_URL` na Vercel precisa apontar para a URL pública da API.

## Observação importante

A Vercel hospeda muito bem o frontend estático deste projeto. O backend atual usa NestJS com SQLite local, então ele precisa de um servidor Node com armazenamento persistente, como VPS/Hostinger VPS/Render/Railway/Fly.io. Não coloque chaves de API no frontend.

## Deploy unificado na Hostinger com JSON

Para Hostinger com Node.js, este projeto também tem um modo unificado: o mesmo servidor entrega o frontend (`index.html`) e a API (`/api`) usando banco em JSON.

Gere o pacote:

```powershell
npm run hostinger:build
```

Isso cria a pasta:

```text
deploy/hostinger
```

Suba o conteúdo dessa pasta para a aplicação Node da Hostinger. No painel da Hostinger:

- arquivo inicial: `server.js`
- comando de start: `npm start` ou `node server.js`
- Node: versão 18 ou superior

Crie um arquivo `.env` baseado em `.env.example` dentro da pasta enviada:

```env
PORT=3000
HOST=0.0.0.0
DATA_FILE=./data/db.json
AI_PROVIDER=groq
GROQ_API_KEY=sua-chave-da-groq
GROQ_MODEL=openai/gpt-oss-20b
```

O banco fica em:

```text
data/db.json
```

Faça backup desse arquivo, porque ele guarda usuários, chats, histórico e amigos. Não suba esse arquivo para o GitHub.
