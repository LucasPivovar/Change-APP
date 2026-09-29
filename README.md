# Change Skills

Frontend Vue 3 + Vite e backend NestJS para o Camaleão IA.

## Executar localmente

Requisito: Node.js 24.15 ou superior (o backend usa `node:sqlite`).

Na raiz do repositório:

```powershell
npm ci
npm --prefix backend ci
Copy-Item backend/.env.example backend/.env
```

Preencha `GROQ_API_KEY` em `backend/.env` e deixe `AI_PROVIDER=groq` para usar a opção gratuita com limites maiores. A chave fica somente no servidor; nunca use uma variável `VITE_` para ela. O modelo padrão da Groq é `openai/gpt-oss-20b` e pode ser alterado em `GROQ_MODEL`. Gemini continua disponível como alternativa usando `AI_PROVIDER=gemini`, `GEMINI_API_KEY` e `GEMINI_MODEL`. Não é necessário fornecer chave para compilar ou rodar os testes.

Abra dois terminais na raiz:

```powershell
npm run backend:dev
```

```powershell
npm run dev
```

A API usa `http://127.0.0.1:3001/api`. Abra o endereço informado pelo Vite (normalmente `http://localhost:5173`). O proxy `/api` conecta o frontend ao backend. Se mudar a porta da API, ajuste também `vite.config.js`.

O cadastro e login usam a API do backend. Depois de entrar, abra **Chats → Nova conversa** ou selecione **idioma → curso → Camaleão**. As conversas reais com IA ficam na seção **Conversas com o Camaleão IA**. **Histórico** permite retomar uma conversa. A lista também permite excluir um chat com confirmação.

## O que foi implementado

- Backend NestJS com TypeScript, validação de entrada, limites de requisições e cabeçalhos de segurança.
- Integração com Groq ou Google Gemini, com timeout de 45 segundos, provedor e modelo configuráveis.
- Criação, listagem paginada, consulta, envio de mensagens e exclusão de chats.
- Persistência SQLite em `backend/data/chat.sqlite`, incluindo sessões, chats, mensagens e itens completos das respostas usados como contexto.
- Cadastro e login com senha armazenada como hash. O navegador guarda o token da sessão no `localStorage`; o banco guarda somente seu hash. Todas as rotas de chat verificam o proprietário.
- Perfil real do usuário, com nome, foto, idioma padrão do Camaleão, ofensiva, amigos zerados enquanto não há serviço social, e tempo praticado calculado a partir das mensagens reais.
- Contexto pedagógico por conversa, incluindo primeiro nome do aluno, idioma de explicação, idioma praticado, curso e perfil do aluno, como crianças, adolescentes, adultos, negócios, pesquisadores e 50+.
- Menu do chat com histórico, dicas aleatórias do Camaleão, idioma padrão do Camaleão, transcrição de voz pelo navegador e leitura das respostas por text-to-speech quando habilitada.
- Contexto isolado por chat, com idioma de prática e instruções de tutor definidas pelo servidor.
- Reenvio idempotente por `requestId`: repetir a mesma chave e conteúdo retorna a resposta já salva, sem gerar novamente.
- Gravação atômica do par pergunta/resposta: falhas do provedor de IA não deixam uma rodada incompleta no histórico. O frontend mantém o texto para nova tentativa.
- Proteção contra envios simultâneos no mesmo chat e contra exclusão durante uma resposta.

## Contexto e precisão

A cada envio, o backend lê as rodadas anteriores do banco e envia a sequência completa ao provedor configurado. Além do texto visível, preserva a resposta do modelo em um formato interno usado para reconstruir o contexto. O histórico da aplicação fica no SQLite.

`MAX_CONTEXT_BYTES` limita de forma conservadora o tamanho UTF-8 do contexto e das instruções (padrão: 60.000 bytes). Não é um contador exato de tokens. Ao alcançar esse limite, ou se o modelo rejeitar a janela de contexto, a API retorna **422** pedindo uma nova conversa. Nenhuma mensagem antiga é removida. Não há resumo automático nem base RAG nesta versão.

Histórico e instruções reduzem perda de contexto, mas não garantem respostas factualmente corretas. O assistente é orientado a pedir informações, reconhecer incerteza e não inventar ações externas, preços ou dados dos cursos. Ele não navega na internet, não faz reservas e não consulta outros alunos. A missão e o cronômetro simulados do chat IA foram removidos porque ainda não existe avaliação real de objetivos.

## API

Todas as rotas têm prefixo `/api`. Crie uma conta com `POST /api/auth/register` ou entre com `POST /api/auth/login`; guarde o `{ "token": "..." }` retornado e envie `Authorization: Bearer <token>` nas rotas de chat. O token é uma credencial e não deve ser compartilhado. `POST /api/sessions` ainda existe para compatibilidade local, mas o fluxo principal usa usuário autenticado.

| Método | Rota | Comportamento |
| --- | --- | --- |
| GET | `/health` | Saúde da aplicação |
| POST | `/auth/register` | Cria usuário; corpo `{ "name": "Ana", "email": "ana@example.com", "password": "segredo1" }` |
| POST | `/auth/login` | Cria sessão; corpo `{ "email": "ana@example.com", "password": "segredo1" }` |
| GET | `/profile` | Retorna dados e estatísticas do perfil autenticado |
| PATCH | `/profile` | Atualiza nome, foto e idioma padrão do Camaleão |
| POST | `/sessions` | Cria uma sessão anônima de compatibilidade |
| POST | `/chats` | Cria chat; corpo opcional `{ "language": "en", "courseId": "kids", "audience": "kids", "title": "Viagem" }` |
| GET | `/chats?limit=30&offset=0` | Lista chats da sessão por atualização |
| GET | `/chats/:id` | Metadados do chat |
| GET | `/chats/:id/messages?limit=30&offset=0` | Histórico em ordem cronológica |
| POST | `/chats/:id/messages` | Envia mensagem e retorna `{ "messages": [...] }` |
| DELETE | `/chats/:id` | Exclui chat e mensagens; retorna 204 |

Corpo para enviar uma mensagem:

```json
{
  "content": "Meu nome é Ana. Quero praticar inglês.",
  "requestId": "c6b44c64-9cfe-4a86-9482-43d8eb278a8c"
}
```

Gere um UUID v4 por envio (`crypto.randomUUID()` no navegador). Em uma repetição do mesmo envio, use o mesmo UUID. Nova mensagem precisa de um novo UUID. Reutilizar uma chave com conteúdo diferente retorna 409.

Idiomas aceitos: `en`, `es`, `fr`, `pt`. Mensagens: 1–4.000 caracteres após remover espaços das extremidades. Títulos: até 120 caracteres. Paginação: `limit` entre 1 e 100; `offset` entre 0 e 1.000.000. Na rota de mensagens, **limit, offset e total contam rodadas**, cada uma com uma pergunta e uma resposta; `items` contém as mensagens individuais. Exemplo: `limit=30` retorna até 60 mensagens. Os itens internos de contexto não são expostos na API.

Erros principais: 400 entrada inválida, 401 sessão inválida, 404 chat inexistente ou de outra sessão, 409 conflito/geração em andamento, 422 limite de contexto, 429 excesso de requisições, 502 resposta incompleta do provedor, 503 IA indisponível. O limite é de 60 requisições por minuto por IP e rota; no envio de mensagens, 10 por minuto. Os limites ficam em memória.

## Configuração

Consulte `backend/.env.example`. O servidor escuta apenas em `127.0.0.1` por padrão. `DATABASE_PATH` é relativo ao diretório de execução do backend. Preserve o arquivo SQLite e os arquivos WAL ao operar backups; preferencialmente pare a API antes de copiar o banco.

Para frontend e API em origens separadas, defina `VITE_API_URL` no ambiente de build do frontend e `CORS_ORIGIN` na API. O proxy Vite só funciona no desenvolvimento: em produção, um proxy reverso deve encaminhar `/api` à API, ou o frontend deve ter uma URL de API explícita.

## Testar e compilar

```powershell
npm run backend:test
npm run backend:build
npm run build
```

Os testes usam SQLite temporário/em memória e um provedor de IA simulado, sem chamadas pagas. Cobrem contexto completo, isolamento de chats e sessões, validação, paginação, idempotência, falhas, concorrência, exclusão em cascata, limite de contexto, limite de requisições, persistência após reinício e payloads Gemini/Groq. A chamada real depende de uma chave válida e acesso ao modelo configurado.

Para executar o backend compilado:

```powershell
npm --prefix backend start
```

## Limites deste primeiro escopo

O histórico pertence à conta autenticada. Limpar o armazenamento do navegador remove o token local, mas o usuário pode entrar novamente com email e senha para recuperar os chats. Esta versão ainda não tem recuperação de senha por email, expiração de sessão, papéis de usuário ou sincronização avançada entre dispositivos.

Esta versão foi preparada para desenvolvimento local com **um único processo**. Antes de expor publicamente, implemente autenticação real, cotas de custo por usuário e política de retenção/expiração de sessões e chats. Para múltiplas instâncias, substitua o bloqueio e os limites em memória por mecanismos compartilhados; considere PostgreSQL para essa evolução. O custo do provedor inclui o histórico reenviado. Se o processo cair após a resposta do provedor e antes da gravação, uma nova tentativa poderá gerar outra cobrança, pois ainda não há fila durável.

Chats entre alunos, grupos, perfis, cadastro, recuperação de senha, missões e integração com material dos cursos não fazem parte deste backend inicial.
