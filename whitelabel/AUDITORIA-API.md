# Auditoria do whitelabel — 09/10/2026

## Resultado
13 testes automatizados passaram. Banco temporário isolado; nenhum cadastro real foi alterado. As verificações de interface executam os templates, não substituem inspeção visual completa em todos os dispositivos.

## API e fluxos verificados
| Área / rotas | Evidência | Resultado |
|---|---|---|
| auth/login, register, me, logout | Senhas individuais, perfis, criação de escola, cookies, bloqueio e sessão revogada | Passou |
| auth/forgot-password, reset-password, change-password | Token de recuperação, alteração de senha e revogação de sessões | Passou; entrega externa não validada nesta auditoria |
| public/schools, bootstrap | Listagem e isolamento dos dados entre escolas e perfis | Passou |
| accounts, accounts/update, accounts/delete | Criar, editar, bloquear, excluir e impedir privilégios indevidos | Passou |
| rpc | Cadastros, escolas, professores, alunos, financeiro, planos e validações de entrada nos cenários da suíte | Passou nos cenários cobertos; não equivale a testar cada combinação de todos os métodos |
| learning/:action | Curso, módulos, aulas, atividades, matrícula, publicação, conclusão, prazo, entrega, correção, reabertura e exclusão | Passou |
| files, files/:id, attachments | Upload/download, vínculo, validação e acesso limitado por escola/curso | Passou |
| grades, profile | Atualização de perfil, validação de nota, nota zero e proteção de credenciais | Passou |
| messages | Envio e leitura; isolamento por escola | Passou; consultas periódicas, sem WebSocket |
| admin/settings | Persistência, abas válidas e bloqueio de acesso da escola | Passou |
| export | CSV de escolas, alunos, professores e financeiro; coleção indevida bloqueada | Passou |
| email/test, email/receipt | Mensagem e comprovante gerados na caixa local de testes; cobrança inexistente bloqueada | Passou; SMTP real configurado, chegada à caixa do destinatário não testada agora |
| /whitelabel e arquivos estáticos | Prefixo da API, CSS/JS, bloqueio de server.js e rotas sem sessão | Passou |
| Persistência | Reinicialização preserva usuários, cursos, notas e entregas | Passou |

## Correções desta revisão
- Login mantém somente o formulário, conforme solicitado; acesso administrativo e seletor de perfis removidos.
- Mensagens de envio reconhecem SMTP além do Resend.

## O que falta
| Recurso | Estado e trabalho necessário |
|---|---|
| Pagamento online | Sem adaptador de gateway/webhook. O financeiro registra cobranças e baixas manuais; não processa pagamentos reais. |
| Videoconferência ao vivo | LiveKit não integrado. As URLs de vídeos gravados dependem de acesso permitido pelo provedor. |
| Domínio/SSL por escola | Configuração visual não provisiona DNS, certificados ou Nginx. |
| 2FA no whitelabel | Preferência visual não implementa desafio de segundo fator. O 2FA da aplicação principal não é compartilhado. |
| Lembrar de mim no whitelabel | Checkbox não altera a duração de sessão. Sessão segue duração configurada da escola ou padrão de 24 horas. |
| SMTP por escola | Campos de configuração não ativam transporte individual. Envio usa o SMTP do servidor. |
| Chat em tempo real | Polling a cada cinco segundos; falta WebSocket e presença. |
| Banco SQL | Pacote usa JSON. Migração para MySQL e estratégia de backup/restauração precisam de trabalho próprio. |
| Dados demonstrativos | Seed contém exemplos. Avaliar quais remover antes de uso real, preservando cadastros existentes. |
| Qualidade visual | Revisar telas de todos os perfis em mobile/desktop; testes de renderização não medem alinhamento, acessibilidade ou contraste. |

Não há garantia de ausência de bugs: resultados descrevem os cenários executados e as limitações conhecidas.

## Revisão de rotas, botões e modais
- Templates de 35 telas principais dos quatro perfis renderizados sem exceções.
- Abertura dos 41 métodos de modal encontrados no legado, usando as extensões publicadas e registros existentes, testada em DOM simulado. Isso verifica execução, não posição visual nem cada clique real.
- Referências de handlers conferidas e regressão adicionada para variáveis fora do escopo de onclick.
- Corrigidos os atalhos Alocar aluno, Declaração de matrícula e Transferir aluno: agora fecham o modal pela API app.closeModal().
- Corrigida abertura de configuração de pagamento quando setupFee está ausente.
- No navegador de produção: Esqueci a senha, atualização da página de recuperação e Voltar ao login funcionaram; nenhum erro de console nesses passos.
- A suíte de API utiliza banco temporário; não altera usuários reais. Não foi realizado percurso visual autenticado de todos os controles com contas reais.
- Portanto, ainda não é correto declarar que todos os botões e integrações estão funcionando. As pendências da tabela acima continuam abertas.
