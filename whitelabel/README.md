# Change Skills — backend JSON

Backend em Node.js 22+ sem dependências npm externas, integrado às telas existentes.

## Executar

```powershell
npm start
```

Abra **http://localhost:3000**. Não abra `index.html` diretamente.

Na primeira execução, o servidor cria `data/database.json` e o administrador
`admin@changeskills.com.br`. A senha inicial aleatória aparece no terminal somente
nessa primeira inicialização. Para definir suas próprias credenciais antes da
primeira execução, copie `.env.example` para `.env` e preencha `ADMIN_EMAIL` e
`ADMIN_PASSWORD` (mínimo 10 caracteres).

As credenciais do `.env` não substituem contas já gravadas no JSON. Para uma conta
existente, use a recuperação de senha.

## Uso

1. Entre como administrador usando as credenciais iniciais.
2. Em **Criar acesso**, selecione escola e perfil para criar um gestor, professor
   ou aluno. Ao usar o e-mail de um cadastro existente da mesma escola, a conta
   será vinculada a esse cadastro.
3. Também é possível usar **Cadastrar minha escola** no login. O registro público
   cria uma nova escola e seu gestor, sem conceder privilégios de administrador.
4. Crie cursos, módulos, aulas, atividades e materiais. Para baixar um material,
   selecione um arquivo real no cadastro; os arquivos fictícios da demonstração
   continuam sem conteúdo para download.
5. Alunos enviam PDFs; o professor baixa a entrega, atribui nota e escreve feedback.
6. Contatos com conta ativa podem trocar mensagens, consultadas a cada 5 segundos.

## Cadastro e gerenciamento de usuários

O cadastro público cria uma escola e seu gestor. Alunos e professores recebem
acesso pelo gestor da própria escola ou pelo administrador, usando **Criar acesso**.
O botão **Gerenciar usuários** permite buscar, editar nome/e-mail, bloquear,
desbloquear e excluir contas. A escola só gerencia seus alunos e professores;
o administrador também gerencia os acessos dos gestores.

Excluir o acesso revoga a entrada e preserva o cadastro acadêmico. Criar novamente
um acesso com o mesmo e-mail e perfil vincula a conta ao cadastro preservado.
O bloqueio do cadastro acadêmico ou da escola continua impedindo o login mesmo
quando a conta individual está marcada como ativa.

Senhas de 10 a 128 caracteres são armazenadas com **scrypt**, salt aleatório de
16 bytes por senha e comparação em tempo constante. O servidor nunca retorna
hashes de senha nas respostas. Sessões e tokens de recuperação são armazenados
somente como hashes. Trocar senha, alterar e-mail, bloquear ou excluir uma conta
revoga suas sessões e links de recuperação anteriores. O login limita tentativas
por endereço de origem e conta.

## Cursos, aulas gravadas e atividades

Em **Cursos**, crie um curso, selecione o professor e escolha todos os alunos da
escola ou uma lista de matriculados. Cursos e conteúdos podem ficar em rascunho.
O aluno só recebe no backend os cursos publicados aos quais tem acesso.

Dentro do curso:

1. Crie e edite módulos; exclua módulos que não serão utilizados.
2. Cadastre aulas com link de vídeo MP4, YouTube ou Vimeo, duração e descrição.
   As permissões de reprodução do provedor do vídeo precisam permitir o acesso.
3. Anexe materiais ao módulo, à aula ou à atividade usando links ou arquivos de
   até 10 MB. Materiais podem ser editados e removidos.
4. Crie atividades com enunciado, critérios, data de abertura, prazo e opção de
   aceitar atraso. A atividade pode ter nota ou somente feedback.
5. O aluno envia texto, arquivo ou ambos e pode substituir a entrega antes da
   correção. O professor corrige, atribui nota (incluindo zero) e escreve feedback.
   Para nova entrega depois da correção, o professor reabre a atividade do aluno.
6. O aluno marca aulas como concluídas. Os painéis e listas mostram o progresso
   calculado a partir dessas conclusões e as entregas reais.

As seções **Aulas**, **Atividades/Tarefas** e **Materiais** usam os conteúdos dos
mesmos cursos; não criam cópias independentes. As operações acadêmicas estão em
`POST /api/learning/:action` e são verificadas no servidor, inclusive matrícula,
publicação, professor responsável, prazos e acesso aos arquivos. As ações são
`course`, `module`, `item`, `material`, `delete-course`, `delete-module`,
`delete-item`, `delete-material`, `move-item`, `completion`, `submit`, `grade` e
`reopen`. Exclusões removem o conteúdo do curso; arquivos físicos são preservados
no armazenamento, mas deixam de estar disponíveis aos alunos sem vínculo válido.

O fluxo usa vídeo gravado. Pagamentos e videoconferência ao vivo não fazem parte
desse módulo.

Os registros de exemplo do projeto foram preservados. Eles **não** recebem senhas
universais como `123456`: crie explicitamente o acesso dos titulares. Uma nova
escola inicia sem alunos, professores ou cursos de outra escola.

## Recuperação de senha e e-mail

No modo de desenvolvimento, mensagens são entregues como arquivos JSON em
`data/mail/`. Use **Esqueci a senha**, abra o arquivo de mensagem mais recente e
copie o link de recuperação para o navegador. O token expira em 30 minutos, só
pode ser usado uma vez e invalida as sessões antigas após a troca.

Para enviar e-mails reais, configure `RESEND_API_KEY`, `MAIL_FROM` (remetente
verificado no provedor) e `BASE_URL` no `.env`. Reinicie o servidor. Com
`NODE_ENV=production`, a ausência de um serviço de e-mail configurado é tratada
como erro; links de recuperação nunca são retornados pela API pública.

## Recursos conectados

- Login por perfil, registro de escola, sessão restaurada e logout.
- Senhas com scrypt e salt individual; sessão em cookie HttpOnly/SameSite.
- Recuperação e alteração de senha com revogação de sessões.
- Permissões verificadas no servidor e dados separados por escola.
- CRUD existente de escolas, alunos, professores, turmas, eventos, cursos,
  módulos, aulas, materiais, tarefas, cobranças e planos.
- Conclusão individual de aulas e confirmação individual de presença.
- Upload/download de arquivos até 10 MB com verificação de acesso.
- Entregas, correções, notas, feedback e mensagens persistidos.
- Perfil do aluno persistido e alteração de senha do professor conectada.
- Personalização da escola e formulários de configuração master persistidos.
- Exportação CSV real de escolas, alunos, professores e financeiro.
- E-mail de teste e comprovante financeiro, pelo provedor configurado ou caixa local.
- Financeiro como registro de cobranças e baixas manuais autorizadas pela escola.

## Integrações que dependem de serviços externos

**Não há transação bancária ou videoconferência real nesta entrega.** As ações que
simulavam pagamento/cartão/checkout e entrada na sala foram substituídas por
mensagens de configuração necessária. Para habilitar essas funções ainda é
necessário desenvolver/conectar os adaptadores do gateway escolhido e do LiveKit,
com credenciais e endereço de serviço válidos.

Salvar configurações de gateway, SMTP, split, domínio ou streaming não ativa esses
serviços. O envio de e-mail implementado usa o provedor definido no `.env`, e não
as configurações SMTP legadas. Domínio e HTTPS são configurados na hospedagem.
O segundo fator ainda não está implementado: tentar ativar a preferência da escola
é recusado explicitamente. A duração de sessão configurada pela escola é aplicada
a novos logins.

Os dashboards ainda contêm indicadores/gráficos de exemplo do frontend original.
Eles não comprovam disponibilidade de servidores ou movimentações bancárias.

## Banco e operação

- `data/database.json`: dados, contas, hashes, sessões, recuperação, mensagens,
  arquivos e auditoria recente.
- `data/database.json.bak`: cópia da versão anterior à última gravação.
- `data/uploads/`: conteúdo dos arquivos; o JSON guarda os metadados.
- `data/mail/`: mensagens de desenvolvimento.
- `data/server.lock`: impede dois processos de escrever no mesmo banco.

Gravações passam por uma fila no processo, são sincronizadas em disco e substituem
o JSON por um arquivo temporário. Este servidor foi projetado para **um único
processo**, sem cluster ou múltiplas réplicas. Faça backup de toda a pasta `data`,
incluindo uploads, com o serviço parado. Não edite o JSON enquanto o servidor está
em execução. Se o arquivo principal estiver corrompido, o servidor falha sem
substituí-lo silenciosamente; restaure uma cópia válida manualmente.

Por padrão o serviço escuta apenas `127.0.0.1`. Para hospedagem, configure domínio,
HTTPS no proxy, `BASE_URL` e `NODE_ENV=production`. A pasta `data`, o `.env` e os
arquivos de código do servidor não são servidos pelo HTTP.

A ponte com os formulários legados usa requisições síncronas nas gravações e cache
nas leituras, preservando as assinaturas existentes. Uma migração posterior para
fluxos inteiramente assíncronos melhora a experiência em conexões lentas. Dados de
outras sessões são atualizados ao recarregar a página; mensagens têm atualização
periódica.

Os templates legados ainda usam HTML e eventos inline. O servidor aplica validação
conservadora nos campos de cadastro: HTML, aspas simples/duplas e caracteres de
escape não são aceitos. Mensagens de chat usam `textContent` e aceitam texto comum.
Essa limitação deve ser removida migrando os templates para renderização segura por
contexto, em vez de enfraquecer a validação.

## API

Todas as gravações usam `POST` com `Content-Type: application/json`. Endpoints
protegidos exigem o cookie da sessão e não permitem selecionar outro papel pelo
payload. Chamadas do navegador devem partir da origem definida em `BASE_URL`.

| Endpoint | Método | Finalidade |
|---|---|---|
| `/api/public/schools` | GET | Dados públicos mínimos das escolas |
| `/api/auth/register` | POST | Registrar escola e gestor |
| `/api/auth/login` | POST | Autenticar e emitir sessão |
| `/api/auth/me` | GET | Consultar sessão |
| `/api/auth/logout` | POST | Revogar sessões da conta |
| `/api/auth/forgot-password` | POST | Solicitar recuperação |
| `/api/auth/reset-password` | POST | Consumir token e redefinir senha |
| `/api/auth/change-password` | POST | Trocar senha verificando senha atual |
| `/api/bootstrap` | GET | Consultar dados autorizados para o portal |
| `/api/rpc` | POST | Executar método permitido de PratikaDB |
| `/api/accounts` | POST | Criar acesso por gestor/master |
| `/api/accounts` | GET | Listar os acessos que o gestor pode administrar |
| `/api/accounts/update` | POST | Editar nome/e-mail ou bloquear/desbloquear acesso |
| `/api/accounts/delete` | POST | Excluir acesso e preservar o cadastro acadêmico |
| `/api/profile` | POST | Atualizar perfil próprio |
| `/api/files` | POST | Upload em base64 |
| `/api/files/:id` | GET | Download autorizado |
| `/api/attachments` | POST | Vincular arquivo à entrega/material |
| `/api/grades` | POST | Avaliar entrega |
| `/api/messages` | GET/POST | Consultar/enviar mensagens |
| `/api/admin/settings` | GET/POST | Configurações master |
| `/api/email/test` | POST | Testar entrega para a própria conta |
| `/api/email/receipt` | POST | Enviar comprovante de cobrança acessível |
| `/api/export?collection=students` | GET | Exportar coleção autorizada em CSV |

Exemplo de operação (com a sessão do navegador):

```javascript
await fetch('/api/rpc', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ method: 'addStudent', args: [{
    name: 'Maria Silva', email: 'maria@example.com'
  }] })
});
```

## Testes

```powershell
npm test
```

Os testes usam um diretório temporário e não alteram o banco do projeto. Cobrem
autenticação, registro duplicado, isolamento entre escolas, permissões, origem,
recuperação de uso único, revogação de sessões, arquivos, entregas, notas, mensagens,
perfil, validação de conteúdo e persistência após reiniciar o processo.

Também verificam o CRUD de contas, hashes diferentes para senhas iguais,
revogação de recuperação após mudança de credenciais, bloqueio entre escolas,
recriação de acesso e renderização de 35 telas com um DOM mínimo de teste.
Esta última verificação detecta erros de execução; não substitui testes visuais
e de clique em navegador. Os bancos temporários ficam em `data/test-runs` e
são removidos ao finalizar os testes.
