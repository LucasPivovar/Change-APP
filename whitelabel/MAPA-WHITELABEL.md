# Mapa funcional — Change Skills White Label

Análise estática dos arquivos disponíveis em 09/10/2026. Não inclui teste de cada botão no navegador nem serviços externos ausentes deste projeto.

## Arquitetura e estado atual

Aplicação de página única em HTML, CSS e JavaScript. index.html carrega database.js e app.js; PratikaApp controla telas, rotas por hash, sessão e interações. PratikaDB mantém uma base demonstrativa em localStorage, na chave changeskills_db, com migração de pratika_db. A sessão fica em memória.

Legenda: **Local** = lógica executada no navegador; **Parcial** = mistura de lógica local e demonstração; **Simulado** = interface ou confirmação visual sem integração real identificada. Nenhuma dessas classificações equivale a validação em produção.

## Administrador master

| Área | Funções identificadas | Estado |
|---|---|---|
| Dashboard | Indicadores globais e visão das escolas e receitas | Parcial: dados locais/demonstrativos |
| Escolas | Listagem; cadastro; responsável comercial; slug/subdomínio; marca; plano; taxa de setup; resumo de implantação | Local |
| Ativação | Link de setup; copiar link; abrir WhatsApp com mensagem; checkout demonstrativo; ativar licença após simulação | Parcial: pagamento e e-mail simulados |
| Cursos globais | Catálogo e acesso ao gerenciador de cursos/módulos | Local; revisar permissões antes de produção |
| Alunos globais | Busca/filtro por escola; transferência entre escolas; bloqueio/desbloqueio de cadastro | Local |
| Financeiro | Painel de receitas/cobranças e extrato por escola | Parcial |
| Planos SaaS | Listar, criar e excluir planos; preços e recursos descritivos | Local; limites contratados não comprovados como restrições efetivas |
| Configurações | Identidade SaaS; infraestrutura LiveKit; SMTP; split/gateway; segurança | Predominantemente simulado; vários formulários apenas exibem confirmação |

## Escola

| Área | Funções identificadas | Estado |
|---|---|---|
| Dashboard | Resumo de alunos, professores, turmas, agenda e financeiro | Parcial |
| Cursos e módulos | Lista de cursos; gerenciador compartilhado; organização de conteúdo | Local |
| Alunos | Cadastrar, consultar perfil, editar, excluir, buscar; transferir turma/curso; declaração de matrícula | Local; declaração gerada na interface |
| Professores | Cadastrar, consultar perfil, editar e excluir | Local |
| Turmas | Cadastrar, listar, filtrar, buscar; abrir gestão; copiar link de sala | Local; sala simulada |
| Calendário | Mês, semana e lista; navegar meses; filtros; criar/ver/excluir evento; acompanhar confirmação | Local; referência de hoje fixa em maio/2026 |
| Aulas | Listagem/agendamento; acesso à sala demonstrativa e gravações | Parcial |
| Financeiro | Criar cobrança; baixar manualmente; consultar recibo/extrato; copiar links e texto para WhatsApp | Local para registros; cobrança externa simulada |
| Comunicação | Contatos, busca e envio de mensagens no contexto da interface | Local; sem transporte em tempo real identificado |
| Identidade e marca | Nome, slogan, logo, cores, fonte e favicon; prévia e aplicação de tema | Local |
| Domínio e SSL | Campos e fluxo visual de configuração | Simulado: não provisiona DNS/SSL |
| E-mail e notificações | Dados SMTP, remetente e preferências | Parcial: configuração local, sem envio SMTP identificado |
| Segurança | Preferências de 2FA, duração de sessão e permissões | Configuração/interface; controles reais não comprovados |
| Pagamentos | Gateway, token, Pix e lembretes | Configuração local; sem integração financeira identificada |

## Professor

| Área | Funções identificadas | Estado |
|---|---|---|
| Hoje | Resumo de aulas/atividades | Parcial |
| Meus alunos | Lista e consulta de perfis | Local; abrangência do filtro precisa de validação funcional |
| Cursos | Criar curso; dados descritivos; gerenciar módulos e conteúdo | Local |
| Módulos | Criar, expandir/recolher, excluir; reordenar itens | Local |
| Videoaulas | Cadastrar título, descrição e URL; assistir; associar material | Local para cadastro e reprodução de URL |
| Atividades | Criar atividade e instruções; PDF de apoio; consultar entregas | Parcial |
| Correção | Tela de entregas e botão de avaliação | Simulado no botão inspecionado: confirmação sem gravação da avaliação |
| Materiais | Cadastrar tipo, título, nome, tamanho e vínculo com curso/módulo/aula | Parcial: seleção de arquivo registra metadados |
| Mensagens | Contatos e conversa | Local/demonstrativo |
| Perfil | Editar dados, foto por URL e senha; validar confirmação de senha | Local; não constitui autenticação segura |

## Aluno

| Área | Funções identificadas | Estado |
|---|---|---|
| Início | Resumo de progresso, aulas e tarefas | Parcial |
| Cursos e aulas | Catálogo; módulos; player; navegação entre itens; marcar/desmarcar conclusão | Local |
| Minhas turmas | Consultar turmas e professor; filtros | Local |
| Minhas aulas | Filtrar aulas; acessar sala ao vivo e gravação; consultar materiais | Parcial |
| Calendário | Mês/semana/lista; filtros; detalhes; confirmar/cancelar presença | Local |
| Tarefas | Filtrar; abrir atividade; registrar entrega; consultar feedback | Parcial |
| Entrega em curso | Selecionar PDF e observações; salvar aluno, nome/tamanho do arquivo e notas | Metadados locais; não envia o conteúdo do PDF |
| Materiais | Existe também uma tela por rota, além dos materiais dentro de cursos | Parcial: diversos downloads apenas exibem mensagem |
| Mensagens | Contatos e envio na interface | Local/demonstrativo |
| Financeiro | Mensalidades; modal Pix/cartão; recibo; alteração de cartão; renovação de plano/matrícula | Parcial: atualização local e pagamento simulado |
| Perfil | Tela com dados e ações do aluno | Requer teste de cada ação para confirmar persistência |

## Sala ao vivo compartilhada

Rota #/livekit/:lessonId. Interface com vídeo de exemplo, participantes, chat, materiais, microfone, câmera, compartilhamento de tela, mão levantada e gravação. Os controles alteram flags e redesenham a tela; não foi identificado SDK LiveKit, captura de mídia ou conexão WebSocket. O chat da sala usa uma lista em memória. Vários controles redesenham explicitamente aula-1, independentemente da aula original.

## Acesso e permissões

Quatro entradas: #/auth/admin, #/auth/escola, #/auth/professor e #/auth/aluno. O método login recebe papel e e-mail, sem senha como parâmetro. Aluno/professor não encontrado pelo e-mail pode cair no primeiro registro da base. O roteador verifica se há papel na sessão, mas não estabelece uma autorização robusta por papel. Bloquear um registro e configurar 2FA não comprovam bloqueio efetivo de autenticação.

## Dados e relacionamentos

- schools: identidade, domínio, tema, plano e configuração da escola.
- students e teachers: vínculo por schoolId; alunos também referenciam turma/curso.
- classes: turmas e vínculos pedagógicos.
- lessons, materials e tasks: estruturas independentes legadas.
- courses → modules → items: estrutura de cursos com aulas/atividades, materiais, conclusão por aluno e entregas.
- financial: cobranças/mensalidades e situação local.
- events: agenda e confirmação de presença.
- plans: preços e recursos descritivos dos planos SaaS.
- adminSettings: configuração demonstrativa central.

Existem estruturas paralelas para aulas/tarefas/materiais e itens de curso. A equivalência e sincronização entre elas precisam ser verificadas em cada fluxo.

## Integrações e limites encontrados

| Recurso anunciado | Implementação observada |
|---|---|
| LiveKit | Sala demonstrativa; sem conexão real identificada |
| Veenca, Pix, cartão e split | Campos, links e alterações locais; sem chamada a gateway identificada |
| SMTP e envio de recibo/boas-vindas | Formulários e mensagens de sucesso; sem serviço de envio identificado |
| WhatsApp | Link externo em fluxo de setup; cobrança também usa texto copiado. Não comprova envio automático |
| Upload de PDF/material | Metadados no fluxo inspecionado; sem armazenamento do conteúdo do arquivo |
| Downloads | Vários botões chamam somente showToast; arquivos padrão também têm URL # |
| Domínio e SSL | Configuração visual; sem provisionamento |
| Imagens, fontes e vídeos | Recursos externos de Google Fonts, Unsplash e Mixkit |
| Banco compartilhado | Ausente nos arquivos fornecidos; armazenamento restrito ao navegador/origem |

## Pontos técnicos para a próxima etapa

1. Implementar backend, autenticação, autorização por perfil e isolamento por escola.
2. Conectar gateway e webhooks para confirmar pagamentos de verdade.
3. Conectar LiveKit com tokens emitidos no servidor.
4. Adicionar armazenamento real de arquivos e downloads.
5. Implementar envio de e-mails e persistência/transporte de mensagens.
6. Persistir correções, notas e feedback, substituindo confirmações visuais.
7. Aplicar limites dos planos e regras de bloqueio/assinatura.
8. Unificar estruturas pedagógicas e corrigir datas fixas.
9. Revisar método duplicado showAddLessonModal: em uma classe JavaScript a definição posterior substitui a anterior.

## Referências principais

- app.js:103: aplicação de tema.
- app.js:159: roteamento.
- app.js:205: login demonstrativo.
- app.js:642: menus por perfil.
- app.js:958: portal da escola.
- app.js:1698: configurações da escola.
- app.js:2348: portal do professor.
- app.js:2618: portal do aluno.
- app.js:3384: portal master.
- app.js:4039: configurações master.
- app.js:4368: sala demonstrativa.
- app.js:7779: gerenciador de cursos e telas pedagógicas.
- database.js:758: acesso e persistência da base local.

O inventário abaixo registra declarações de métodos encontradas por expressão regular. Não é uma análise de execução e não inclui funções anônimas de eventos como métodos separados.

## Inventário de métodos

| Local | Método |
|---|---|
| app.js:38 | `constructor()` |
| app.js:80 | `init()` |
| app.js:103 | `applyWhiteLabelTheme(schoolId)` |
| app.js:145 | `updateFavicon(iconUrlOrEmoji)` |
| app.js:155 | `navigate(route)` |
| app.js:159 | `handleRouting()` |
| app.js:205 | `login(role, email, schoolId = null)` |
| app.js:245 | `logout()` |
| app.js:254 | `renderAuthPortal(view)` |
| app.js:642 | `renderPortalLayout()` |
| app.js:826 | `getViewTitle()` |
| app.js:882 | `getViewSubtitle()` |
| app.js:940 | `renderInternalView()` |
| app.js:958 | `renderSchoolViews(view, schoolId, container)` |
| app.js:1689 | `switchSettingsTab(tabId)` |
| app.js:1698 | `renderSchoolSettings(schoolId, activeTab = 'branding', container)` |
| app.js:2348 | `renderTeacherViews(view, schoolId, container)` |
| app.js:2618 | `renderStudentViews(view, schoolId, container)` |
| app.js:3384 | `renderAdminViews(view, container)` |
| app.js:4031 | `switchAdminSettingsTab(tabId)` |
| app.js:4039 | `renderAdminSettings(activeTab = 'general', container)` |
| app.js:4368 | `renderLiveKitRoom(lessonId)` |
| app.js:4500 | `renderLiveKitPanelContent()` |
| app.js:4584 | `toggleLiveKitMic()` |
| app.js:4588 | `toggleLiveKitVideo()` |
| app.js:4592 | `toggleLiveKitScreenShare()` |
| app.js:4596 | `toggleLiveKitHand()` |
| app.js:4600 | `toggleLiveKitRecording()` |
| app.js:4604 | `toggleLiveKitChatPanel()` |
| app.js:4608 | `setLiveKitTab(tab)` |
| app.js:4614 | `bindLiveKitChatInput()` |
| app.js:4625 | `exitLiveKitRoom()` |
| app.js:4636 | `payRecord(id)` |
| app.js:4641 | `deleteSaaSPlan(id)` |
| app.js:4646 | `editSchoolColors(id)` |
| app.js:4656 | `showAddStudentModal()` |
| app.js:4735 | `showAddTeacherModal()` |
| app.js:4792 | `setTurmasFilter(filter)` |
| app.js:4797 | `filterClassCards(query)` |
| app.js:4811 | `showAddClassModal()` |
| app.js:4901 | `showClassManagementModal(classId)` |
| app.js:4987 | `generateSchoolSlug(text)` |
| app.js:5002 | `showAddSchoolModal()` |
| app.js:5242 | `renderSchoolSetupSuccessModal(schoolId)` |
| app.js:5365 | `showSetupPaymentLinkModal(schoolId)` |
| app.js:5370 | `showSimulateCheckoutModal(schoolId)` |
| app.js:5430 | `showAddPlanModal()` |
| app.js:5477 | `showAddLessonModal()` |
| app.js:5531 | `showAddMaterialModal()` |
| app.js:5597 | `showToast(message, type = "success")` |
| app.js:5621 | `toggleActionDropdown(menuId, triggerEl)` |
| app.js:5662 | `filterTableRows(query, tableId)` |
| app.js:5674 | `openChatWithUser(role, userId)` |
| app.js:5703 | `renderChatInterface(schoolId, isStudent = false, container)` |
| app.js:5839 | `filterChatContacts(query)` |
| app.js:5850 | `sendChatMessage(e)` |
| app.js:5880 | `showStudentProfileModal(studentId)` |
| app.js:5966 | `showEditStudentModal(studentId)` |
| app.js:6031 | `deleteStudentConfirm(studentId)` |
| app.js:6062 | `showTransferStudentModal(studentId = null)` |
| app.js:6153 | `showEnrollmentDeclarationModal(studentId)` |
| app.js:6202 | `filterGlobalStudentsBySchool(schoolId)` |
| app.js:6216 | `showAdminGlobalTransferModal(studentId = null)` |
| app.js:6310 | `toggleStudentLock(studentId)` |
| app.js:6320 | `showTeacherProfileModal(teacherId)` |
| app.js:6381 | `showEditTeacherModal(teacherId)` |
| app.js:6443 | `deleteTeacherConfirm(teacherId)` |
| app.js:6475 | `renderFullCalendar(schoolId, isStudent = false, container)` |
| app.js:6537 | `renderCalendarMonthGrid(year, month, events, isStudent)` |
| app.js:6607 | `renderCalendarWeekGrid(year, month, events, isStudent)` |
| app.js:6650 | `renderCalendarListView(events, isStudent)` |
| app.js:6699 | `changeCalendarMonth(delta)` |
| app.js:6711 | `setCalendarToday()` |
| app.js:6717 | `setCalendarViewMode(mode)` |
| app.js:6722 | `setCalendarFilter(filter)` |
| app.js:6728 | `showEventDetailsModal(eventId)` |
| app.js:6803 | `deleteEventConfirm(eventId)` |
| app.js:6812 | `toggleEventAttendance(eventId, isInsideModal = false)` |
| app.js:6844 | `togglePasswordVisibility(inputId)` |
| app.js:6851 | `showAddEventModal(prefillDate = "")` |
| app.js:6934 | `setStudentTasksFilter(filter)` |
| app.js:6939 | `setStudentLessonsFilter(filter)` |
| app.js:6944 | `setStudentTurmasFilter(filter)` |
| app.js:6950 | `showSubmitTaskModal(taskId)` |
| app.js:7037 | `showTaskFeedbackModal(taskId)` |
| app.js:7091 | `showStudentPaymentModal(financialId)` |
| app.js:7157 | `showChangePaymentMethodModal()` |
| app.js:7205 | `showReceiptModal(financialId)` |
| app.js:7339 | `copyPaymentLink(billId, studentName, value, status)` |
| app.js:7353 | `sendWhatsAppBilling(billId, studentName, value, dueDate)` |
| app.js:7362 | `markAsPaidBySchool(billId)` |
| app.js:7373 | `showSchoolFinancialStatementModal(schoolId)` |
| app.js:7457 | `showCreateChargeModal()` |
| app.js:7532 | `showPlanRenewalModal()` |
| app.js:7677 | `showRecordedLessonModal(lessonId)` |
| app.js:7735 | `showLessonMaterialModal(materialId)` |
| app.js:7779 | `renderSchoolCoursesList(schoolId, container)` |
| app.js:7783 | `renderTeacherCoursesScreen(schoolId, container)` |
| app.js:7805 | `renderTeacherCourseCard(c)` |
| app.js:7844 | `renderTeacherCourseManager(courseId, container)` |
| app.js:8191 | `renderStudentCoursesList(schoolId, container)` |
| app.js:8259 | `renderStudentCourseModules(courseId, container)` |
| app.js:8359 | `renderLessonWatchScreen(courseId, moduleId, itemId, container)` |
| app.js:8474 | `renderStudentActivityScreen(courseId, moduleId, itemId, container)` |
| app.js:8667 | `handleStudentActivitySubmit(courseId, moduleId, itemId)` |
| app.js:8687 | `reorderItem(courseId, moduleId, itemId, direction)` |
| app.js:8696 | `toggleLessonDone(courseId, moduleId, itemId)` |
| app.js:8706 | `getModalRoot()` |
| app.js:8718 | `closeModal()` |
| app.js:8727 | `onMaterialFileSelected(input)` |
| app.js:8760 | `onTaskPdfSelected(input)` |
| app.js:8774 | `onModalCourseChange(courseId, targetModuleSelectId, selectedModuleId = null)` |
| app.js:8797 | `checkNewModuleField(selectedValue, targetGroupId)` |
| app.js:8812 | `setCourseTab(arg1, arg2)` |
| app.js:8817 | `toggleModuleDropdown(modId)` |
| app.js:8828 | `expandAllModules(expand = true)` |
| app.js:8837 | `deleteModuleConfirm(courseId, moduleId)` |
| app.js:8846 | `handleSaveTeacherProfile(teacherId)` |
| app.js:8899 | `showTeacherLessonModal(courseId = null, moduleId = null)` |
| app.js:8985 | `handleCreateLesson()` |
| app.js:9034 | `showCreateLessonModal(courseId, moduleId)` |
| app.js:9038 | `showAddLessonModal(courseId)` |
| app.js:9045 | `showTeacherMaterialModal(courseId = null, moduleId = null)` |
| app.js:9160 | `handleCreateMaterial()` |
| app.js:9204 | `showTeacherTaskModal(courseId = null, moduleId = null)` |
| app.js:9332 | `handleCreateActivity()` |
| app.js:9394 | `showCreateActivityModal(courseId, moduleId)` |
| app.js:9401 | `showTeacherCourseModal()` |
| app.js:9472 | `handleCreateCourse()` |
| app.js:9499 | `showCreateCourseModal()` |
| app.js:9506 | `showLessonMaterialsModal(courseId, moduleId, itemId)` |
| app.js:9558 | `showModuleMaterialsModal(courseId, moduleId = null)` |
| app.js:9616 | `showCreateModuleModal(courseId)` |
| app.js:9655 | `showActivitySubmissionsModal(courseId, moduleId, itemId)` |
| app.js:9725 | `deleteModuleItemConfirm(courseId, moduleId, itemId)` |
| database.js:759 | `getDB()` |
| database.js:848 | `saveDB(db)` |
| database.js:853 | `getSchools()` |
| database.js:857 | `getSchool(id)` |
| database.js:861 | `updateSchool(id, updatedData)` |
| database.js:872 | `addSchool(school)` |
| database.js:893 | `paySchoolSetup(id)` |
| database.js:906 | `getStudents(schoolId = null)` |
| database.js:914 | `getStudent(id)` |
| database.js:918 | `addStudent(student)` |
| database.js:940 | `updateStudent(id, updatedData)` |
| database.js:951 | `transferStudentSchool(studentId, newSchoolId, newCourse = null, newTeacherId = null)` |
| database.js:977 | `deleteStudent(id)` |
| database.js:996 | `getTeachers(schoolId = null)` |
| database.js:1004 | `getTeacher(id)` |
| database.js:1008 | `addTeacher(teacher)` |
| database.js:1029 | `updateTeacher(id, updatedData)` |
| database.js:1040 | `deleteTeacher(id)` |
| database.js:1059 | `getEvents(schoolId = null)` |
| database.js:1068 | `getEvent(id)` |
| database.js:1072 | `addEvent(event)` |
| database.js:1085 | `updateEvent(id, updatedData)` |
| database.js:1097 | `deleteEvent(id)` |
| database.js:1109 | `toggleAttendance(eventId)` |
| database.js:1122 | `getClasses(schoolId = null)` |
| database.js:1130 | `getClass(id)` |
| database.js:1134 | `addClass(classObj)` |
| database.js:1147 | `updateClass(id, updatedData)` |
| database.js:1158 | `deleteClass(id)` |
| database.js:1170 | `getLessons(schoolId = null)` |
| database.js:1178 | `addLesson(lesson)` |
| database.js:1191 | `getMaterials(schoolId = null)` |
| database.js:1199 | `addMaterial(material)` |
| database.js:1211 | `getTasks(schoolId = null)` |
| database.js:1219 | `getTask(id)` |
| database.js:1223 | `addTask(task)` |
| database.js:1235 | `updateTask(id, updatedData)` |
| database.js:1246 | `submitStudentTask(taskId, submissionData = {})` |
| database.js:1265 | `getFinancial(schoolId = null)` |
| database.js:1273 | `addFinancial(record)` |
| database.js:1285 | `payFinancial(id)` |
| database.js:1296 | `renewStudentPlan(studentName, planName, planValue, periodMonths = 6, schoolId = "escola-1")` |
| database.js:1318 | `getPlans()` |
| database.js:1322 | `addPlan(plan)` |
| database.js:1333 | `deletePlan(id)` |
| database.js:1345 | `getCourses(schoolId = null, teacherId = null)` |
| database.js:1357 | `getCourse(idOrName)` |
| database.js:1364 | `addCourse(courseObj)` |
| database.js:1416 | `updateCourse(id, updatedData)` |
| database.js:1427 | `deleteCourse(id)` |
| database.js:1438 | `addModule(courseId, moduleObj)` |
| database.js:1456 | `updateModule(courseId, moduleId, updatedData)` |
| database.js:1470 | `deleteModule(courseId, moduleId)` |
| database.js:1484 | `addLessonToModule(courseId, moduleId, lessonObj)` |
| database.js:1529 | `addMaterialToModule(courseId, moduleId, materialObj)` |
| database.js:1568 | `addActivityToModule(courseId, moduleId, activityObj)` |
| database.js:1605 | `updateModuleItem(courseId, moduleId, itemId, updatedData)` |
| database.js:1622 | `deleteModuleItem(courseId, moduleId, itemId)` |
| database.js:1639 | `moveModuleItem(courseId, moduleId, itemId, direction)` |
| database.js:1665 | `submitStudentActivity(courseId, moduleId, itemId, submissionData)` |
| database.js:1698 | `toggleLessonCompletion(courseId, moduleId, itemId, studentId)` |
| database.js:1721 | `getModuleMaterials(courseId, moduleId)` |
| database.js:1767 | `getCourseMaterials(courseId)` |
