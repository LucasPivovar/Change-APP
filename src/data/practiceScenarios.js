export const practiceScenarios = [
  {
    id: 'restaurant-lunch',
    audiences: ['adults', 'teens', 'business', 'general', '50plus'],
    icon: '🍽️',
    title: 'Restaurante: pedir almoço',
    description: 'Cumprimente o garçom, peça o menu, escolha um prato, peça algo para beber e feche a conta.',
    role: 'garçom de restaurante',
    goal: 'O aluno deve chegar ao restaurante, pedir o menu, escolher almoço e bebida, resolver uma dúvida educadamente e pedir a conta.',
    steps: ['Cumprimentar', 'Pedir o menu', 'Fazer o pedido', 'Pedir a conta'],
  },
  {
    id: 'hotel-checkin',
    audiences: ['adults', 'teens', 'business', 'general', '50plus'],
    icon: '🏨',
    title: 'Hotel: fazer check-in',
    description: 'Converse na recepção, confirme reserva, pergunte sobre café da manhã e peça informações.',
    role: 'recepcionista de hotel',
    goal: 'O aluno deve se apresentar, confirmar reserva, perguntar sobre horários e entender instruções básicas do hotel.',
    steps: ['Se apresentar', 'Confirmar reserva', 'Perguntar horários', 'Agradecer'],
  },
  {
    id: 'store-return',
    audiences: ['adults', 'teens', 'business', 'general'],
    icon: '🛍️',
    title: 'Loja: trocar um produto',
    description: 'Explique o problema com educação, peça ajuda e combine uma troca ou reembolso.',
    role: 'atendente de loja',
    goal: 'O aluno deve explicar o problema, mostrar o recibo, pedir uma solução e confirmar o próximo passo.',
    steps: ['Explicar problema', 'Pedir ajuda', 'Negociar solução', 'Confirmar'],
  },
  {
    id: 'school-bathroom',
    audiences: ['kids'],
    icon: '🏫',
    title: 'Escola: pedir para ir ao banheiro',
    description: 'Pratique uma frase educada com o professor e responda perguntas simples.',
    role: 'professor gentil em sala de aula',
    goal: 'A criança deve cumprimentar, pedir permissão para ir ao banheiro, entender a resposta e agradecer.',
    steps: ['Cumprimentar', 'Pedir permissão', 'Entender resposta', 'Agradecer'],
  },
  {
    id: 'school-friend',
    audiences: ['kids', 'teens'],
    icon: '👋',
    title: 'Escola: apresentar um amigo',
    description: 'Diga o nome do seu amigo, algo que ele gosta e faça uma pergunta simples.',
    role: 'colega de escola simpático',
    goal: 'O aluno deve apresentar um amigo, dizer uma característica simples e fazer uma pergunta curta.',
    steps: ['Dizer oi', 'Apresentar amigo', 'Fazer pergunta', 'Responder'],
  },
  {
    id: 'toy-store',
    audiences: ['kids'],
    icon: '🧸',
    title: 'Loja de brinquedos',
    description: 'Pergunte o preço, escolha uma cor e agradeça ao atendente.',
    role: 'atendente de loja de brinquedos',
    goal: 'A criança deve perguntar sobre um brinquedo, escolher cor ou tamanho, perguntar preço e agradecer.',
    steps: ['Perguntar brinquedo', 'Escolher cor', 'Perguntar preço', 'Agradecer'],
  },
]

export const audienceForCourse = (courseId) => {
  if (['kids', 'frances-enfants'].includes(courseId)) return 'kids'
  if (['teens', 'espanhol-jovens', 'frances-ados', 'portugues-jovens'].includes(courseId)) return 'teens'
  if (courseId === 'business') return 'business'
  if (courseId === 'researchers') return 'researchers'
  if (courseId === 'ingles50') return '50plus'
  if (['fast-track', 'excellence', 'espanhol-adultos', 'frances-adultes', 'portugues-adultos'].includes(courseId)) return 'adults'
  return 'general'
}

export const scenariosForCourse = (courseId) => {
  const audience = audienceForCourse(courseId || 'general')
  return practiceScenarios.filter(item => item.audiences.includes(audience) || item.audiences.includes('general'))
}

export const scenarioById = (id) => practiceScenarios.find(item => item.id === id)

export const scenarioScoreKey = (language, courseId, scenarioId) => `change-skills-scenario-score-${language || 'en'}-${courseId || 'general'}-${scenarioId}`
