export const practiceScenarios = [
  { id:'kids-school-bathroom', audiences:['kids'], languages:['en','es','fr','pt'], icon:'🏫', title:'Escola: pedir para ir ao banheiro', description:'Peça permissão ao professor, entenda a resposta e agradeça.', role:'professor gentil em sala de aula', goal:'A criança deve cumprimentar, pedir permissão para ir ao banheiro, entender a resposta e agradecer.', steps:['Cumprimentar','Pedir permissão','Entender','Agradecer'] },
  { id:'kids-school-friend', audiences:['kids'], languages:['en','es','fr','pt'], icon:'👋', title:'Escola: apresentar um amigo', description:'Apresente um amigo, diga algo que ele gosta e faça uma pergunta simples.', role:'colega de escola simpático', goal:'A criança deve apresentar um amigo, dizer uma característica simples e fazer uma pergunta curta.', steps:['Dizer oi','Apresentar','Perguntar','Responder'] },
  { id:'kids-toy-store', audiences:['kids'], languages:['en','es','fr','pt'], icon:'🧸', title:'Loja de brinquedos', description:'Pergunte sobre um brinquedo, escolha uma cor e agradeça.', role:'atendente de loja de brinquedos', goal:'A criança deve perguntar sobre um brinquedo, escolher cor ou tamanho, perguntar preço e agradecer.', steps:['Perguntar','Escolher cor','Preço','Agradecer'] },
  { id:'kids-playground', audiences:['kids'], languages:['en','es','fr','pt'], icon:'🛝', title:'Parquinho: chamar para brincar', description:'Convide outra criança para brincar e combine uma brincadeira.', role:'criança amigável no parquinho', goal:'A criança deve cumprimentar, convidar para brincar, escolher uma brincadeira e responder educadamente.', steps:['Dizer oi','Convidar','Escolher','Brincar'] },
  { id:'kids-cafeteria', audiences:['kids'], languages:['en','es','fr','pt'], icon:'🥪', title:'Cantina da escola', description:'Peça um lanche, pergunte o preço e diga obrigado.', role:'atendente da cantina escolar', goal:'A criança deve pedir um lanche simples, perguntar preço ou sabor e agradecer.', steps:['Pedir lanche','Escolher','Preço','Obrigado'] },
  { id:'kids-lost-pencil', audiences:['kids'], languages:['en','es','fr','pt'], icon:'✏️', title:'Sala de aula: pedir um lápis', description:'Peça um lápis emprestado e devolva com educação.', role:'colega de sala prestativo', goal:'A criança deve pedir um objeto emprestado, responder à ajuda e agradecer.', steps:['Pedir','Receber','Usar','Devolver'] },
  { id:'kids-doctor', audiences:['kids'], languages:['en','es','fr','pt'], icon:'🩺', title:'Consulta: dizer onde dói', description:'Conte ao médico como você está se sentindo com frases simples.', role:'médico infantil gentil', goal:'A criança deve dizer onde dói, responder perguntas simples e entender uma orientação.', steps:['Cumprimentar','Dizer sintoma','Responder','Agradecer'] },
  { id:'kids-birthday', audiences:['kids'], languages:['en','es','fr','pt'], icon:'🎂', title:'Festa: cumprimentar aniversariante', description:'Dê parabéns, ofereça um presente e converse sobre a festa.', role:'aniversariante animado', goal:'A criança deve dar parabéns, falar de presente ou bolo e fazer uma pergunta simples.', steps:['Parabéns','Presente','Pergunta','Tchau'] },

  { id:'teen-movie-plans', audiences:['teens'], languages:['en','es','fr','pt'], icon:'🎬', title:'Cinema: combinar um filme', description:'Combine filme, horário e lanche com um amigo.', role:'amigo planejando cinema', goal:'O aluno deve sugerir filme, combinar horário, falar de lanche e confirmar o plano.', steps:['Sugerir','Horário','Lanche','Confirmar'] },
  { id:'teen-school-project', audiences:['teens'], languages:['en','es','fr','pt'], icon:'📚', title:'Escola: trabalho em grupo', description:'Divida tarefas, combine prazo e peça ajuda.', role:'colega de grupo', goal:'O aluno deve conversar sobre tarefas de um projeto escolar e combinar próximos passos.', steps:['Tema','Tarefas','Prazo','Confirmar'] },
  { id:'teen-new-student', audiences:['teens'], languages:['en','es','fr','pt'], icon:'🧑‍🎓', title:'Escola: conhecer aluno novo', description:'Se apresente, pergunte interesses e convide para sentar junto.', role:'aluno novo na escola', goal:'O aluno deve se apresentar, perguntar gostos e acolher o colega.', steps:['Oi','Nome','Interesses','Convite'] },
  { id:'teen-cafe', audiences:['teens','adults'], languages:['en','es','fr','pt'], icon:'☕', title:'Café: pedir uma bebida', description:'Peça uma bebida, personalize o pedido e pague.', role:'barista de cafeteria', goal:'O aluno deve pedir uma bebida, escolher tamanho, tirar dúvida e finalizar.', steps:['Pedir','Tamanho','Dúvida','Pagar'] },
  { id:'teen-game-chat', audiences:['teens'], languages:['en','es','fr','pt'], icon:'🎮', title:'Jogo online: combinar partida', description:'Convide alguém para jogar, escolha modo e horário.', role:'amigo gamer', goal:'O aluno deve convidar, negociar horário e combinar uma partida.', steps:['Convidar','Modo','Horário','Confirmar'] },
  { id:'teen-shopping', audiences:['teens','adults'], languages:['en','es','fr','pt'], icon:'👕', title:'Loja: procurar roupa', description:'Peça um tamanho, pergunte cor e decida se vai comprar.', role:'vendedor de loja de roupas', goal:'O aluno deve pedir ajuda com roupa, tamanho, cor, preço e decisão.', steps:['Pedir ajuda','Tamanho','Preço','Comprar'] },

  { id:'adult-restaurant-lunch', audiences:['adults','50plus'], languages:['en','es','fr','pt'], icon:'🍽️', title:'Restaurante: pedir almoço', description:'Peça mesa, menu, prato, bebida e a conta.', role:'garçom de restaurante', goal:'O aluno deve chegar ao restaurante, pedir o menu, escolher almoço e bebida, resolver uma dúvida educadamente e pedir a conta.', steps:['Mesa','Menu','Pedido','Conta'] },
  { id:'adult-hotel-checkin', audiences:['adults','50plus'], languages:['en','es','fr','pt'], icon:'🏨', title:'Hotel: fazer check-in', description:'Confirme reserva, pergunte horários e peça informações.', role:'recepcionista de hotel', goal:'O aluno deve se apresentar, confirmar reserva, perguntar horários e entender instruções básicas.', steps:['Reserva','Documento','Horários','Quarto'] },
  { id:'adult-store-return', audiences:['adults'], languages:['en','es','fr','pt'], icon:'🛍️', title:'Loja: trocar um produto', description:'Explique o problema e peça troca ou reembolso.', role:'atendente de loja', goal:'O aluno deve explicar o problema, mostrar recibo, pedir solução e confirmar próximo passo.', steps:['Problema','Recibo','Solução','Confirmar'] },
  { id:'adult-pharmacy', audiences:['adults','50plus'], languages:['en','es','fr','pt'], icon:'💊', title:'Farmácia: pedir remédio', description:'Explique sintomas simples e peça orientação.', role:'farmacêutico', goal:'O aluno deve descrever sintomas básicos, entender instruções e agradecer.', steps:['Sintoma','Pergunta','Instrução','Agradecer'] },
  { id:'adult-airport', audiences:['adults','50plus'], languages:['en','es','fr','pt'], icon:'✈️', title:'Aeroporto: embarque', description:'Pergunte portão, bagagem e horário de embarque.', role:'atendente do aeroporto', goal:'O aluno deve pedir informação sobre voo, portão, bagagem e embarque.', steps:['Voo','Bagagem','Portão','Embarque'] },
  { id:'adult-taxi', audiences:['adults','50plus'], languages:['en','es','fr','pt'], icon:'🚕', title:'Táxi: explicar destino', description:'Diga o endereço, pergunte preço aproximado e confirme rota.', role:'motorista de táxi', goal:'O aluno deve informar destino, perguntar tempo/preço e encerrar a corrida.', steps:['Destino','Tempo','Preço','Pagar'] },
  { id:'adult-market', audiences:['adults','50plus'], languages:['en','es','fr','pt'], icon:'🛒', title:'Mercado: pedir ajuda', description:'Pergunte onde fica um produto e confirme quantidade.', role:'funcionário de supermercado', goal:'O aluno deve pedir localização de produto, perguntar preço ou quantidade e agradecer.', steps:['Produto','Local','Preço','Obrigado'] },
  { id:'adult-doctor-appointment', audiences:['adults','50plus'], languages:['en','es','fr','pt'], icon:'🏥', title:'Clínica: marcar consulta', description:'Peça horário, explique motivo e confirme dados.', role:'atendente de clínica', goal:'O aluno deve marcar consulta, explicar motivo simples, escolher horário e confirmar.', steps:['Motivo','Horário','Dados','Confirmar'] },

  { id:'business-meeting-intro', audiences:['business'], languages:['en','es','fr','pt'], icon:'💼', title:'Reunião: se apresentar', description:'Apresente seu cargo, objetivo e combine próximos passos.', role:'colega em reunião de trabalho', goal:'O aluno deve se apresentar profissionalmente, explicar objetivo e pedir encaminhamento.', steps:['Nome','Cargo','Objetivo','Próximo passo'] },
  { id:'business-email-followup', audiences:['business'], languages:['en','es','fr','pt'], icon:'📧', title:'Trabalho: follow-up de email', description:'Peça atualização de forma educada e objetiva.', role:'colega que recebeu seu email', goal:'O aluno deve pedir retorno sobre uma tarefa ou proposta com tom profissional.', steps:['Contexto','Pedido','Prazo','Agradecer'] },
  { id:'business-presentation', audiences:['business','researchers'], languages:['en','es','fr','pt'], icon:'📊', title:'Apresentação: abrir reunião', description:'Faça uma abertura curta e explique a pauta.', role:'participante da reunião', goal:'O aluno deve abrir uma apresentação, explicar pauta e responder uma pergunta.', steps:['Saudação','Pauta','Resumo','Pergunta'] },
  { id:'business-interview', audiences:['business','adults'], languages:['en','es','fr','pt'], icon:'🧑‍💼', title:'Entrevista: falar de experiência', description:'Responda sobre experiência, pontos fortes e disponibilidade.', role:'recrutador em entrevista', goal:'O aluno deve falar de experiência, habilidade e fazer uma pergunta sobre a vaga.', steps:['Experiência','Força','Pergunta','Fechamento'] },
  { id:'research-conference', audiences:['researchers'], languages:['en','es','fr','pt'], icon:'🔬', title:'Conferência: apresentar pesquisa', description:'Explique tema, método e responda uma pergunta acadêmica.', role:'pesquisador em conferência', goal:'O aluno deve resumir pesquisa, explicar método e responder pergunta curta.', steps:['Tema','Método','Resultado','Pergunta'] },
  { id:'research-paper-feedback', audiences:['researchers'], languages:['en','es','fr','pt'], icon:'📝', title:'Pesquisa: pedir feedback', description:'Peça opinião sobre artigo, clareza e próximos ajustes.', role:'orientador acadêmico', goal:'O aluno deve pedir feedback, explicar dúvida e combinar revisão.', steps:['Contexto','Dúvida','Feedback','Revisão'] },
]

export const audienceForCourse = (courseId) => {
  if (['kids', 'frances-enfants'].includes(courseId)) return 'kids'
  if (['teens', 'espanhol-jovens', 'frances-ados', 'portugues-jovens'].includes(courseId)) return 'teens'
  if (courseId === 'business') return 'business'
  if (courseId === 'researchers') return 'researchers'
  if (courseId === 'ingles50') return '50plus'
  if (['fast-track', 'excellence', 'espanhol-adultos', 'frances-adultes', 'portugues-adultos'].includes(courseId)) return 'adults'
  return 'adults'
}

const todayKey = () => new Date().toLocaleDateString('en-CA')
const seededValue = (text) => {
  let hash = 2166136261
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}
const dailyShuffle = (items, seed) => [...items].sort((a, b) => seededValue(`${seed}:${a.id}`) - seededValue(`${seed}:${b.id}`))

export const scenariosForCourse = (courseId, language = 'en', limit = 5) => {
  const audience = audienceForCourse(courseId || 'general')
  const filtered = practiceScenarios.filter(item => item.audiences.includes(audience) && (!item.languages || item.languages.includes(language)))
  const fallback = practiceScenarios.filter(item => item.audiences.includes(audience))
  return dailyShuffle(filtered.length ? filtered : fallback, `${todayKey()}:${language}:${courseId}:${audience}`).slice(0, limit)
}

export const scenarioById = (id) => practiceScenarios.find(item => item.id === id)

export const scenarioScoreKey = (language, courseId, scenarioId) => `change-skills-scenario-score-${language || 'en'}-${courseId || 'general'}-${scenarioId}`
