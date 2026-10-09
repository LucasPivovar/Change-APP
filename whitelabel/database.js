// Change Skills Idiomas - Mock Database and State Manager
// This file initializes and maintains the state of the white-label LMS in localStorage.

const DEFAULT_DATABASE = {
  schools: [
    {
      id: "escola-1",
      name: "Change Skills Idiomas - Matriz",
      domain: "portal.changeskills.com.br",
      logo: `<img src="assets/images/logo.png" alt="Change Skills" class="school-logo-img" style="height: 34px; max-width: 150px; object-fit: contain;">`,
      primaryColor: "#246BFD",
      secondaryColor: "#031735",
      fontFamily: "Outfit",
      favicon: "",
      paymentGateway: "Veenca",
      veencaToken: "veenca_sec_live_9812480129481b0a9",
      plan: "Enterprise",
      studentCount: 5,
      teacherCount: 4,
      status: "Ativo",
      mrr: 24680.00
    },
    {
      id: "escola-2",
      name: "Fisk Central",
      domain: "fisk.changeskills.com.br",
      logo: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="school-logo-svg"><path d="M22 10v6M2 10v6M12 2v20M2 10h20M2 16h20"></path></svg>`,
      primaryColor: "#EF4444",
      secondaryColor: "#F87171",
      fontFamily: "Poppins",
      favicon: "",
      paymentGateway: "Veenca",
      veencaToken: "veenca_sec_live_44901293847192834",
      plan: "Business",
      studentCount: 450,
      teacherCount: 32,
      status: "Ativo",
      mrr: 45000.00
    },
    {
      id: "escola-3",
      name: "Wizard Express",
      domain: "wizard.changeskills.com.br",
      logo: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="school-logo-svg"><path d="M12 3v19M5 12h14M12 3a9 9 0 0 0 9 9M12 3a9 9 0 0 1-9 9M12 22a9 9 0 0 0 9-9M12 22a9 9 0 0 1-9-9"></path></svg>`,
      primaryColor: "#22C55E",
      secondaryColor: "#4ADE80",
      fontFamily: "Montserrat",
      favicon: "",
      paymentGateway: "Veenca",
      veencaToken: "veenca_sec_live_77219830192834019",
      plan: "Enterprise",
      studentCount: 890,
      teacherCount: 54,
      status: "Ativo",
      mrr: 98000.00
    }
  ],
  students: [
    {
      id: "aluno-1",
      name: "Maria Silva",
      email: "maria.silva@email.com",
      schoolId: "escola-1",
      course: "Inglês Básico A1",
      classId: "turma-1",
      teacherId: "prof-1",
      status: "Ativo",
      progress: 72,
      lastAccess: "Há 10 min",
      profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "aluno-2",
      name: "João Pereira",
      email: "joao.pereira@email.com",
      schoolId: "escola-1",
      course: "Inglês Intermediário B1",
      classId: "turma-2",
      teacherId: "prof-2",
      status: "Ativo",
      progress: 58,
      lastAccess: "Há 1 hora",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "aluno-3",
      name: "Ana Clara",
      email: "ana.clara@email.com",
      schoolId: "escola-1",
      course: "Conversação C1",
      classId: "turma-3",
      teacherId: "prof-3",
      status: "Ativo",
      progress: 90,
      lastAccess: "Há 2 dias",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "aluno-4",
      name: "Pedro Santos",
      email: "pedro.santos@email.com",
      schoolId: "escola-1",
      course: "Business English",
      classId: "turma-4",
      teacherId: "prof-1",
      status: "Ativo",
      progress: 34,
      lastAccess: "Há 3 dias",
      profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "aluno-5",
      name: "Lucas Oliveira",
      email: "lucas.oliveira@email.com",
      schoolId: "escola-1",
      course: "Inglês para Viagens",
      classId: "turma-5",
      teacherId: "prof-4",
      status: "Inativo",
      progress: 45,
      lastAccess: "Há 1 mês",
      profilePic: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150"
    }
  ],
  teachers: [
    {
      id: "prof-1",
      name: "Lucas Martins",
      email: "lucas.martins@escola.com.br",
      schoolId: "escola-1",
      specialty: "Inglês Geral & Business",
      classes: ["Inglês Básico A1", "Business English"],
      nextClass: "Hoje às 19:00",
      status: "Online",
      availability: "Seg, Qua, Sex - Noite",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "prof-2",
      name: "Ana Paula",
      email: "ana.paula@escola.com.br",
      schoolId: "escola-1",
      specialty: "Preparatórios IELTS/TOEFL",
      classes: ["Inglês Intermediário B1"],
      nextClass: "Amanhã às 18:00",
      status: "Online",
      availability: "Ter, Qui - Tarde/Noite",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "prof-3",
      name: "João Pedro",
      email: "joao.pedro@escola.com.br",
      schoolId: "escola-1",
      specialty: "Conversação & Fluência",
      classes: ["Conversação C1", "Inglês para Viagens"],
      nextClass: "Quarta às 20:00",
      status: "Offline",
      availability: "Seg, Qua - Manhã/Noite",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    },
    {
      id: "prof-4",
      name: "Carla Souza",
      email: "carla.souza@escola.com.br",
      schoolId: "escola-1",
      specialty: "Inglês Infantil & Adolescentes",
      classes: ["Inglês para Viagens"],
      nextClass: "Quinta às 19:00",
      status: "Offline",
      availability: "Ter, Qui - Manhã/Tarde",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150"
    }
  ],
  classes: [
    {
      id: "turma-1",
      name: "Inglês Básico A1",
      teacherId: "prof-1",
      studentCount: 15,
      days: "Seg e Qua",
      hours: "19:00 - 20:00",
      room: "Sala Virtual 01",
      level: "A1",
      status: "Ativa",
      schoolId: "escola-1"
    },
    {
      id: "turma-2",
      name: "Inglês Intermediário B1",
      teacherId: "prof-2",
      studentCount: 12,
      days: "Ter e Qui",
      hours: "20:30 - 21:30",
      room: "Sala Virtual 02",
      level: "B1",
      status: "Ativa",
      schoolId: "escola-1"
    },
    {
      id: "turma-3",
      name: "Conversação Avançada C1",
      teacherId: "prof-3",
      studentCount: 8,
      days: "Seg e Qua",
      hours: "20:00 - 21:00",
      room: "Sala Virtual 03",
      level: "C1",
      status: "Ativa",
      schoolId: "escola-1"
    },
    {
      id: "turma-4",
      name: "Business English",
      teacherId: "prof-1",
      studentCount: 10,
      days: "Sáb",
      hours: "09:00 - 11:00",
      room: "Sala Business",
      level: "B2",
      status: "Ativa",
      schoolId: "escola-1"
    },
    {
      id: "turma-5",
      name: "Inglês para Viagens",
      teacherId: "prof-4",
      studentCount: 14,
      days: "Ter e Qui",
      hours: "19:00 - 20:00",
      room: "Sala Express",
      level: "A2",
      status: "Ativa",
      schoolId: "escola-1"
    }
  ],
  lessons: [
    {
      id: "aula-1",
      title: "Inglês Básico A1",
      teacherName: "Prof. Lucas Martins",
      time: "Hoje - 19:00",
      status: "Ao Vivo",
      schoolId: "escola-1"
    },
    {
      id: "aula-2",
      title: "Inglês Intermediário B1",
      teacherName: "Profa. Ana Paula",
      time: "Quarta, 22 Mai - 19:00",
      status: "Agendada",
      schoolId: "escola-1"
    },
    {
      id: "aula-3",
      title: "Conversação Intermediária B1",
      teacherName: "Profa. Ana Paula",
      time: "Sexta, 24 Mai - 20:30",
      status: "Agendada",
      schoolId: "escola-1"
    },
    {
      id: "aula-4",
      title: "Inglês para Viagens",
      teacherName: "Prof. João Pedro",
      time: "Segunda, 27 Mai - 19:00",
      status: "Agendada",
      schoolId: "escola-1"
    },
    {
      id: "aula-5",
      title: "Business English",
      teacherName: "Prof. Lucas Martins",
      time: "Quarta, 29 Mai - 19:00",
      status: "Agendada",
      schoolId: "escola-1"
    }
  ],
  materials: [
    {
      id: "mat-1",
      module: "Módulo 4 - At Work",
      title: "Aula 1 - Jobs and Professions",
      type: "Vídeo",
      duration: "16 min",
      schoolId: "escola-1",
      downloadUrl: "#"
    },
    {
      id: "mat-2",
      module: "Módulo 4 - At Work",
      title: "Aula 2 - Workplace Vocabulary",
      type: "PDF",
      pages: "12 páginas",
      schoolId: "escola-1",
      downloadUrl: "#"
    },
    {
      id: "mat-3",
      module: "Módulo 4 - At Work",
      title: "Aula 3 - Listening: At the Office",
      type: "Áudio",
      duration: "15 min",
      schoolId: "escola-1",
      downloadUrl: "#"
    },
    {
      id: "mat-4",
      module: "Módulo 4 - At Work",
      title: "Aula 4 - Grammar: Present Perfect",
      type: "Vídeo",
      duration: "22 min",
      schoolId: "escola-1",
      downloadUrl: "#"
    },
    {
      id: "mat-5",
      module: "Módulo 4 - At Work",
      title: "Aula 4 - Exercícios",
      type: "PDF",
      pages: "8 páginas",
      schoolId: "escola-1",
      downloadUrl: "#"
    }
  ],
  tasks: [
    {
      id: "task-1",
      title: "Vocabulary - Unit 4",
      desc: "Complete the exercise about work words.",
      dueDate: "24/05/2026",
      status: "Pendente",
      schoolId: "escola-1"
    },
    {
      id: "task-2",
      title: "Listening Practice",
      desc: "Listen to the audio and answer the questions.",
      dueDate: "26/05/2026",
      status: "Pendente",
      schoolId: "escola-1"
    },
    {
      id: "task-3",
      title: "Writing - Short Text",
      desc: "Write a short text about your routine.",
      dueDate: "27/05/2026",
      status: "Pendente",
      schoolId: "escola-1"
    },
    {
      id: "task-4",
      title: "Grammar Practice - Unit 3",
      desc: "Present Simple vs Present Continuous exercises.",
      dueDate: "18/05/2026",
      status: "Concluído",
      schoolId: "escola-1"
    }
  ],
  financial: [
    {
      id: "fin-1",
      studentName: "Maria Silva",
      plan: "Inglês Pro",
      dueDate: "25/05/2026",
      value: 197.00,
      status: "Em aberto",
      schoolId: "escola-1"
    },
    {
      id: "fin-2",
      studentName: "João Pereira",
      plan: "Inglês Premium",
      dueDate: "10/05/2026",
      value: 197.00,
      status: "Pago",
      schoolId: "escola-1"
    },
    {
      id: "fin-3",
      studentName: "Ana Clara",
      plan: "Conversação Express",
      dueDate: "10/05/2026",
      value: 197.00,
      status: "Pago",
      schoolId: "escola-1"
    },
    {
      id: "fin-4",
      studentName: "Pedro Santos",
      plan: "Business Pro",
      dueDate: "05/05/2026",
      value: 197.00,
      status: "Atrasado",
      schoolId: "escola-1"
    }
  ],
  events: [
    {
      id: "evt-1",
      title: "Inglês Básico A1 — Aula Inaugural",
      schoolId: "escola-1",
      teacherId: "prof-1",
      teacherName: "Lucas Martins",
      date: "2026-05-20",
      time: "19:00 - 20:00",
      type: "live",
      typeName: "Aula ao Vivo",
      room: "Sala Virtual 01",
      level: "A1",
      desc: "Primeira aula do módulo com foco em saudações, fonética e introdução básica.",
      attendanceConfirmed: true
    },
    {
      id: "evt-2",
      title: "Inglês para Viagens — Check-in & Imigração",
      schoolId: "escola-1",
      teacherId: "prof-4",
      teacherName: "Carla Souza",
      date: "2026-05-21",
      time: "19:00 - 20:00",
      type: "activity",
      typeName: "Atividade Prática",
      room: "Sala Express",
      level: "A2",
      desc: "Simulação prática de conversação em aeroporto e imigração internacional.",
      attendanceConfirmed: false
    },
    {
      id: "evt-3",
      title: "Inglês Básico A1 — Grammar Review",
      schoolId: "escola-1",
      teacherId: "prof-1",
      teacherName: "Lucas Martins",
      date: "2026-05-22",
      time: "19:00 - 20:00",
      type: "live",
      typeName: "Aula ao Vivo",
      room: "Sala Virtual 01",
      level: "A1",
      desc: "Revisão dos verbos irregulares e dinâmica de conversação em duplas.",
      attendanceConfirmed: false
    },
    {
      id: "evt-4",
      title: "Inglês Intermediário B1 — Pronunciation Lab",
      schoolId: "escola-1",
      teacherId: "prof-2",
      teacherName: "Ana Paula",
      date: "2026-05-22",
      time: "20:30 - 21:30",
      type: "activity",
      typeName: "Workshop de Pronúncia",
      room: "Sala Virtual 02",
      level: "B1",
      desc: "Treinamento intensivo de entonação e 'connected speech' em inglês.",
      attendanceConfirmed: false
    },
    {
      id: "evt-5",
      title: "Avaliação Mensal — Módulo 4",
      schoolId: "escola-1",
      teacherId: "prof-2",
      teacherName: "Ana Paula",
      date: "2026-05-23",
      time: "18:00 - 19:30",
      type: "exam",
      typeName: "Avaliação Oficial",
      room: "Sala de Exames",
      level: "B1",
      desc: "Avaliação bimestral de reading, listening e speaking.",
      attendanceConfirmed: false
    },
    {
      id: "evt-6",
      title: "Conversação C1 — Global Trends Debate",
      schoolId: "escola-1",
      teacherId: "prof-3",
      teacherName: "João Pedro",
      date: "2026-05-24",
      time: "20:30 - 22:00",
      type: "live",
      typeName: "Mesa Redonda",
      room: "Sala Virtual 03",
      level: "C1",
      desc: "Debate livre sobre tendências de inovação e liderança global.",
      attendanceConfirmed: false
    },
    {
      id: "evt-7",
      title: "Business English — Pitch Presentation",
      schoolId: "escola-1",
      teacherId: "prof-1",
      teacherName: "Lucas Martins",
      date: "2026-05-25",
      time: "09:00 - 11:00",
      type: "live",
      typeName: "Apresentação Executiva",
      room: "Sala Business",
      level: "B2",
      desc: "Simulação de apresentação executiva e negociação para investidores.",
      attendanceConfirmed: false
    },
    {
      id: "evt-8",
      title: "Feriado Municipal — Recesso Acadêmico",
      schoolId: "escola-1",
      teacherId: null,
      teacherName: "Coordenação",
      date: "2026-05-26",
      time: "Dia todo",
      type: "holiday",
      typeName: "Feriado / Recesso",
      room: "—",
      level: "Geral",
      desc: "Secretaria e salas virtuais em recesso.",
      attendanceConfirmed: false
    },
    {
      id: "evt-9",
      title: "Reunião Pedagógica com Mantenedor",
      schoolId: "escola-1",
      teacherId: null,
      teacherName: "Direção",
      date: "2026-05-28",
      time: "18:00 - 19:00",
      type: "meeting",
      typeName: "Alinhamento Diretoria",
      room: "Sala Executiva",
      level: "Docentes",
      desc: "Alinhamento pedagógico e encerramento do primeiro semestre letivo.",
      attendanceConfirmed: false
    }
  ],
  plans: [
    { id: "plan-1", name: "Starter", price: 99.00, features: ["Até 50 alunos", "Aulas gravadas", "Suporte padrão"] },
    { id: "plan-2", name: "Pro", price: 199.00, features: ["Até 200 alunos", "Aulas Ao Vivo LiveKit", "Customização Completa White Label"] },
    { id: "plan-3", name: "Business", price: 399.00, features: ["Alunos ilimitados", "Domínio personalizado", "Suporte prioritário 24/7"] },
    { id: "plan-4", name: "Enterprise", price: 799.00, features: ["Solução On-Premise / Dedicada", "APIs completas & Webhooks", "Gerente de Contas dedicado"] }
  ],
  courses: [
    {
      id: "curso-1",
      schoolId: "escola-1",
      teacherId: "prof-1",
      name: "Inglês Básico A1",
      days: "Seg e Qua",
      hours: "19:00 - 20:00",
      room: "Sala Virtual 01",
      title: "Inglês Básico A1 — Fundamentos & Conversação",
      category: "Inglês Geral",
      level: "A1",
      description: "Aprenda a falar, ouvir e compreender inglês desde as primeiras expressões do dia a dia.",
      thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600",
      instructor: "Prof. Lucas Martins",
      modules: [
        {
          id: "mod-1",
          title: "Módulo 1 — Alfabeto, Saudações & Verbo To Be",
          description: "Primeiros passos no idioma, cumprimentos essenciais, pronúncia e gramática básica.",
          items: [
            {
              id: "item-1-1",
              type: "lesson",
              title: "Aula 1: Alfabeto, Pronúncia e Cumprimentos Formais",
              duration: "18 min",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4",
              description: "Nesta aula prática, aprenda a fonética das letras em inglês, saudações de boas-vindas e expressões cotidianas.",
              materials: [
                { id: "mat-1-1", title: "Guia Fonético do Alfabeto em Inglês", type: "PDF", size: "2.1 MB", url: "#" },
                { id: "mat-1-2", title: "Tabela de Saudações Formais & Informais", type: "PDF", size: "1.4 MB", url: "#" }
              ],
              completedBy: ["aluno-1"]
            },
            {
              id: "item-1-2",
              type: "activity",
              title: "Atividade Prática 1: Diálogo de Apresentação e Cumprimentos",
              statement: "Com base no vocabulário e nas estruturas de saudações estudadas na Aula 1, elabore um diálogo de apresentação pessoal entre duas pessoas se conhecendo. Responda com clareza: nome, profissão e saudação de despedida. Caso prefira, utilize o roteiro anexo pelo professor e envie a sua resolução em PDF.",
              hasGrade: true,
              maxGrade: 10.0,
              evaluationCriteria: "1. Correção gramatical e uso adequado de saudações (4.0 pts)\n2. Estrutura coerente das perguntas e respostas (3.0 pts)\n3. Riqueza de vocabulário e pontuação correta (3.0 pts)",
              startDate: "2026-05-18",
              dueDate: "2026-05-28",
              status: "published",
              teacherAttachmentPdf: { name: "Roteiro_Atividade_Modulo1.pdf", size: "1.1 MB", url: "#" },
              submissions: [
                {
                  studentId: "aluno-1",
                  studentName: "Maria Silva",
                  submissionDate: "2026-05-20 15:40",
                  fileName: "Entrega_MariaSilva_Modulo1.pdf",
                  fileSize: "720 KB",
                  studentNotes: "Professor, envio meu diálogo e as frases de fixação resolvidas.",
                  grade: "9.5",
                  feedback: "Excelente trabalho, Maria! Parabéns pela pronúncia e estruturação gramatical."
                }
              ]
            },
            {
              id: "item-1-3",
              type: "lesson",
              title: "Aula 2: Verbo To Be & Frases Afirmativas",
              duration: "24 min",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4",
              description: "Entenda com clareza as formas am, is, are do Verbo To Be e construa descrições pessoais com naturalidade.",
              materials: [
                { id: "mat-1-3", title: "Resumo Gramatical do Verbo To Be", type: "PDF", size: "1.8 MB", url: "#" }
              ],
              completedBy: []
            },
            {
              id: "item-1-4",
              type: "lesson",
              title: "Aula 3: Números, Dias da Semana & Calendário",
              duration: "20 min",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4",
              description: "Compreensão de números cardinais e ordinais, datas comemorativas e dias da semana.",
              materials: [
                { id: "mat-1-4", title: "Tabela de Números e Datas em Inglês", type: "PDF", size: "950 KB", url: "#" },
                { id: "mat-1-5", title: "Áudio Listening: Ordinal Numbers Pronunciation", type: "Áudio", size: "3.8 MB", url: "#" }
              ],
              completedBy: []
            },
            {
              id: "item-1-5",
              type: "activity",
              title: "Exercício Avaliativo: Fixação Gramatical e Datas",
              statement: "Responda à lista de fixação sobre o verbo To Be e escrita de datas em inglês anexa no PDF pelo professor. Preencha e faça o upload do PDF respondido para avaliação.",
              hasGrade: true,
              maxGrade: 10.0,
              evaluationCriteria: "1. Acerto na conjugação do verbo to be (5.0 pts)\n2. Grafia e uso correto de preposições em datas (in, on, at) (5.0 pts)",
              startDate: "2026-05-22",
              dueDate: "2026-06-02",
              status: "published",
              teacherAttachmentPdf: { name: "Lista_Exercicios_VerboToBe.pdf", size: "980 KB", url: "#" },
              submissions: []
            },
            {
              id: "item-1-6",
              type: "lesson",
              title: "Aula 4: Perguntas Básicas & Wh- Questions",
              duration: "22 min",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4",
              description: "Aprenda a fazer perguntas essenciais usando What, Where, When, Who e Why de maneira fluida.",
              materials: [
                { id: "mat-1-6", title: "Guia Wh-Questions e Exemplos Práticos", type: "PDF", size: "1.5 MB", url: "#" }
              ],
              completedBy: []
            }
          ]
        },
        {
          id: "mod-2",
          title: "Módulo 2 — Rotina Diária & Vocabulário Pessoal",
          description: "Descrevendo seu dia a dia, horários de trabalho, descanso e lazer.",
          items: [
            {
              id: "item-2-1",
              type: "lesson",
              title: "Aula 1: Verbos de Ação e Hábitos Diários",
              duration: "25 min",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4",
              description: "Aprenda os verbos mais frequentes da rotina diária e conectivos de tempo.",
              materials: [
                { id: "mat-2-1", title: "Flashcards Digitais: Daily Routine", type: "PDF", size: "2.8 MB", url: "#" }
              ],
              completedBy: []
            },
            {
              id: "item-2-2",
              type: "activity",
              title: "Atividade: Minha Linha do Tempo Diária",
              statement: "Escreva um texto descritivo detalhando sua rotina de segunda a sexta-feira. Inclua horários, no mínimo 5 verbos de ação e preposições de tempo estudadas. Salve em PDF e anexe para correção.",
              hasGrade: true,
              maxGrade: 10.0,
              evaluationCriteria: "1. Uso apropriado dos verbos de ação no Present Simple (4.0 pts)\n2. Emprego correto de horários e preposições (3.0 pts)\n3. Coerência e clareza da produção textual (3.0 pts)",
              startDate: "2026-05-25",
              dueDate: "2026-06-05",
              status: "published",
              teacherAttachmentPdf: { name: "Guia_Rotina_Diaria.pdf", size: "850 KB", url: "#" },
              submissions: []
            },
            {
              id: "item-2-3",
              type: "lesson",
              title: "Aula 2: Adverbs of Frequency (Always, Sometimes, Never)",
              duration: "21 min",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4",
              description: "Como posicionar advérbios de frequência em frases afirmativas e negativas.",
              materials: [
                { id: "mat-2-2", title: "Resumo Adverbs of Frequency", type: "PDF", size: "1.2 MB", url: "#" }
              ],
              completedBy: []
            }
          ]
        }
      ]
    },
    {
      id: "curso-2",
      schoolId: "escola-1",
      teacherId: "prof-1",
      name: "Business English",
      days: "Sáb",
      hours: "09:00 - 11:00",
      room: "Sala Business",
      title: "Business English — Comunicação Corporativa & Negócios",
      category: "Inglês para Negócios",
      level: "B2",
      description: "Comunicação empresarial de alto impacto para reuniões, apresentações executivas e negociações internacionais.",
      thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
      instructor: "Prof. Lucas Martins",
      modules: [
        {
          id: "mod-b2-1",
          title: "Módulo 1 — E-mails Corporativos & Reuniões Globais",
          description: "Técnicas de redação formal e condução de videoconferências internacionais.",
          items: [
            {
              id: "item-b2-1",
              type: "lesson",
              title: "Aula 1: Estrutura de E-mails e Solicitações Formais",
              duration: "30 min",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4",
              description: "Formatação de e-mails executivos, saudações corporativas e call to actions formais.",
              materials: [
                { id: "mat-b2-1", title: "Modelos de E-mails Corporativos (PDF)", type: "PDF", size: "3.5 MB", url: "#" }
              ],
              completedBy: []
            },
            {
              id: "item-b2-2",
              type: "activity",
              title: "Atividade Executiva: Redação de Proposta Comercial",
              statement: "Redija uma proposta comercial em inglês simulando o envio a um cliente corporativo internacional. Use a estrutura de introdução, apresentação de solução, prazos e encerramento. Faça upload em formato PDF.",
              hasGrade: true,
              maxGrade: 10.0,
              evaluationCriteria: "1. Registro formal e vocabulário corporativo adequado (4.0 pts)\n2. Clareza na exposição da proposta comercial (3.0 pts)\n3. Precisão gramatical e formatação (3.0 pts)",
              startDate: "2026-05-20",
              dueDate: "2026-06-01",
              status: "published",
              teacherAttachmentPdf: { name: "Briefing_Proposta_Comercial.pdf", size: "1.4 MB", url: "#" },
              submissions: []
            }
          ]
        }
      ]
    }
  ],
  adminSettings: {
    smtpEnabled: true,
    liveKitApiEnabled: true,
    logo: `<img src="assets/images/logo.png" alt="Change Skills" class="admin-logo-img" style="height: 34px; max-width: 150px; object-fit: contain;">`
  }
};

class PratikaDB {
  static getDB() {
    let dbStr = localStorage.getItem("changeskills_db");
    if (!dbStr) {
      // Migração suave se existir banco anterior
      const oldDb = localStorage.getItem("pratika_db");
      if (oldDb) {
        try {
          const parsedOld = JSON.parse(oldDb);
          if (parsedOld && parsedOld.schools && parsedOld.schools[0]) {
            parsedOld.schools[0].name = "Change Skills Idiomas - Matriz";
            parsedOld.schools[0].domain = "portal.changeskills.com.br";
            parsedOld.schools[0].logo = `<img src="assets/images/logo.png" alt="Change Skills" class="school-logo-img" style="height: 34px; max-width: 150px; object-fit: contain;">`;
            parsedOld.schools[0].primaryColor = "#246BFD";
            parsedOld.schools[0].secondaryColor = "#031735";
            parsedOld.schools[0].fontFamily = "Outfit";
            parsedOld.schools[0].favicon = "";
          }
          if (parsedOld && parsedOld.adminSettings) {
            parsedOld.adminSettings.logo = `<img src="assets/images/logo.png" alt="Change Skills" class="admin-logo-img" style="height: 34px; max-width: 150px; object-fit: contain;">`;
          }
          localStorage.setItem("changeskills_db", JSON.stringify(parsedOld));
          dbStr = JSON.stringify(parsedOld);
        } catch(e) {
          localStorage.setItem("changeskills_db", JSON.stringify(DEFAULT_DATABASE));
          return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
        }
      } else {
        localStorage.setItem("changeskills_db", JSON.stringify(DEFAULT_DATABASE));
        return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
      }
    }
    try {
      const parsed = JSON.parse(dbStr);
      // Auto-heal missing collections
      let modified = false;
      if (!parsed.events || parsed.events.length === 0) {
        parsed.events = [...DEFAULT_DATABASE.events];
        modified = true;
      }
      if (!parsed.teachers || parsed.teachers.length === 0) {
        parsed.teachers = [...DEFAULT_DATABASE.teachers];
        modified = true;
      }
      if (!parsed.students || parsed.students.length === 0) {
        parsed.students = [...DEFAULT_DATABASE.students];
        modified = true;
      }
      if (!parsed.courses || parsed.courses.length === 0) {
        parsed.courses = JSON.parse(JSON.stringify(DEFAULT_DATABASE.courses));
        modified = true;
      } else {
        parsed.courses.forEach(c => {
          const def = DEFAULT_DATABASE.courses.find(dc => dc.id === c.id || dc.name === c.name);
          if (def) {
            if (!c.name) { c.name = def.name; modified = true; }
            if (!c.days) { c.days = def.days; modified = true; }
            if (!c.hours) { c.hours = def.hours; modified = true; }
            if (!c.room) { c.room = def.room; modified = true; }
            if (!c.level) { c.level = def.level; modified = true; }
            if (!c.modules || c.modules.length === 0) { c.modules = JSON.parse(JSON.stringify(def.modules)); modified = true; }
          }
        });
      }
      if (modified) {
        localStorage.setItem("changeskills_db", JSON.stringify(parsed));
      }

      // MIGRATION: Remove all favicons
      let faviconsModified = false;
      if (parsed && parsed.schools) {
        parsed.schools.forEach(s => {
          if (s.favicon) {
            s.favicon = "";
            faviconsModified = true;
          }
        });
      }
      if (faviconsModified) {
        localStorage.setItem("changeskills_db", JSON.stringify(parsed));
      }

      return parsed;
    } catch (e) {
      console.error("Erro ao ler banco do localStorage. Restaurando padrões Change Skills.");
      localStorage.setItem("changeskills_db", JSON.stringify(DEFAULT_DATABASE));
      return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
    }
  }

  static saveDB(db) {
    localStorage.setItem("changeskills_db", JSON.stringify(db));
  }

  // --- CRUD Escolas ---
  static getSchools() {
    return this.getDB().schools;
  }

  static getSchool(id) {
    return this.getSchools().find(s => s.id === id);
  }

  static updateSchool(id, updatedData) {
    const db = this.getDB();
    const index = db.schools.findIndex(s => s.id === id);
    if (index !== -1) {
      db.schools[index] = { ...db.schools[index], ...updatedData };
      this.saveDB(db);
      return db.schools[index];
    }
    return null;
  }

  static addSchool(school) {
    const db = this.getDB();
    const newSchool = {
      id: "escola-" + crypto.randomUUID(),
      studentCount: 0,
      teacherCount: 0,
      mrr: 0,
      status: school.status || "Ativo",
      setupStatus: school.setupStatus || (school.status === "Setup Pendente" ? "Pendente" : "Pago"),
      setupFee: school.setupFee || 1500.00,
      leadEmail: school.leadEmail || "",
      leadName: school.leadName || "",
      setupPaymentUrl: school.setupPaymentUrl || "",
      logo: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="school-logo-svg"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12M6 12h12"></path></svg>`,
      ...school
    };
    db.schools.push(newSchool);
    this.saveDB(db);
    return newSchool;
  }

  static paySchoolSetup(id) {
    const db = this.getDB();
    const index = db.schools.findIndex(s => s.id === id);
    if (index !== -1) {
      db.schools[index].setupStatus = "Pago";
      db.schools[index].status = "Ativo";
      this.saveDB(db);
      return db.schools[index];
    }
    return null;
  }

  // --- CRUD Alunos ---
  static getStudents(schoolId = null) {
    const students = this.getDB().students || [];
    if (schoolId) {
      return students.filter(s => s.schoolId === schoolId);
    }
    return students;
  }

  static getStudent(id) {
    return this.getStudents().find(s => s.id === id);
  }

  static addStudent(student) {
    const db = this.getDB();
    const newStudent = {
      id: "aluno-" + crypto.randomUUID(),
      progress: 0,
      lastAccess: "Nunca",
      status: "Ativo",
      profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      ...student
    };
    db.students.push(newStudent);
    
    // Atualiza contagem de alunos na escola
    const schoolIndex = db.schools.findIndex(s => s.id === student.schoolId);
    if (schoolIndex !== -1) {
      db.schools[schoolIndex].studentCount += 1;
    }
    
    this.saveDB(db);
    return newStudent;
  }

  static updateStudent(id, updatedData) {
    const db = this.getDB();
    const index = db.students.findIndex(s => s.id === id);
    if (index !== -1) {
      db.students[index] = { ...db.students[index], ...updatedData };
      this.saveDB(db);
      return db.students[index];
    }
    return null;
  }

  static transferStudentSchool(studentId, newSchoolId, newCourse = null, newTeacherId = null) {
    const db = this.getDB();
    const sIndex = db.students.findIndex(s => s.id === studentId);
    if (sIndex === -1) return null;

    const oldSchoolId = db.students[sIndex].schoolId;
    if (oldSchoolId !== newSchoolId) {
      // Ajusta contagens de alunos nas escolas
      const oldSchoolIdx = db.schools.findIndex(s => s.id === oldSchoolId);
      if (oldSchoolIdx !== -1 && db.schools[oldSchoolIdx].studentCount > 0) {
        db.schools[oldSchoolIdx].studentCount -= 1;
      }
      const newSchoolIdx = db.schools.findIndex(s => s.id === newSchoolId);
      if (newSchoolIdx !== -1) {
        db.schools[newSchoolIdx].studentCount += 1;
      }
    }

    db.students[sIndex].schoolId = newSchoolId;
    if (newCourse) db.students[sIndex].course = newCourse;
    if (newTeacherId) db.students[sIndex].teacherId = newTeacherId;

    this.saveDB(db);
    return db.students[sIndex];
  }

  static deleteStudent(id) {
    const db = this.getDB();
    const index = db.students.findIndex(s => s.id === id);
    if (index !== -1) {
      const student = db.students[index];
      db.students.splice(index, 1);
      
      const schoolIndex = db.schools.findIndex(s => s.id === student.schoolId);
      if (schoolIndex !== -1 && db.schools[schoolIndex].studentCount > 0) {
        db.schools[schoolIndex].studentCount -= 1;
      }
      
      this.saveDB(db);
      return true;
    }
    return false;
  }

  // --- CRUD Professores ---
  static getTeachers(schoolId = null) {
    const teachers = this.getDB().teachers || [];
    if (schoolId) {
      return teachers.filter(t => t.schoolId === schoolId);
    }
    return teachers;
  }

  static getTeacher(id) {
    return this.getTeachers().find(t => t.id === id);
  }

  static addTeacher(teacher) {
    const db = this.getDB();
    const newTeacher = {
      id: "prof-" + crypto.randomUUID(),
      status: "Offline",
      photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150",
      classes: [],
      ...teacher
    };
    db.teachers.push(newTeacher);

    // Atualiza contagem de professores na escola
    const schoolIndex = db.schools.findIndex(s => s.id === teacher.schoolId);
    if (schoolIndex !== -1) {
      db.schools[schoolIndex].teacherCount += 1;
    }

    this.saveDB(db);
    return newTeacher;
  }

  static updateTeacher(id, updatedData) {
    const db = this.getDB();
    const index = db.teachers.findIndex(t => t.id === id);
    if (index !== -1) {
      db.teachers[index] = { ...db.teachers[index], ...updatedData };
      this.saveDB(db);
      return db.teachers[index];
    }
    return null;
  }

  static deleteTeacher(id) {
    const db = this.getDB();
    const index = db.teachers.findIndex(t => t.id === id);
    if (index !== -1) {
      const teacher = db.teachers[index];
      db.teachers.splice(index, 1);
      
      const schoolIndex = db.schools.findIndex(s => s.id === teacher.schoolId);
      if (schoolIndex !== -1 && db.schools[schoolIndex].teacherCount > 0) {
        db.schools[schoolIndex].teacherCount -= 1;
      }
      
      this.saveDB(db);
      return true;
    }
    return false;
  }

  // --- CRUD Eventos & Calendário ---
  static getEvents(schoolId = null) {
    const db = this.getDB();
    const events = db.events || DEFAULT_DATABASE.events || [];
    if (schoolId) {
      return events.filter(e => e.schoolId === schoolId);
    }
    return events;
  }

  static getEvent(id) {
    return this.getEvents().find(e => e.id === id);
  }

  static addEvent(event) {
    const db = this.getDB();
    if (!db.events) db.events = [...DEFAULT_DATABASE.events];
    const newEvent = {
      id: "evt-" + crypto.randomUUID(),
      attendanceConfirmed: false,
      ...event
    };
    db.events.push(newEvent);
    this.saveDB(db);
    return newEvent;
  }

  static updateEvent(id, updatedData) {
    const db = this.getDB();
    if (!db.events) db.events = [...DEFAULT_DATABASE.events];
    const index = db.events.findIndex(e => e.id === id);
    if (index !== -1) {
      db.events[index] = { ...db.events[index], ...updatedData };
      this.saveDB(db);
      return db.events[index];
    }
    return null;
  }

  static deleteEvent(id) {
    const db = this.getDB();
    if (!db.events) db.events = [...DEFAULT_DATABASE.events];
    const index = db.events.findIndex(e => e.id === id);
    if (index !== -1) {
      db.events.splice(index, 1);
      this.saveDB(db);
      return true;
    }
    return false;
  }

  static toggleAttendance(eventId) {
    const db = this.getDB();
    if (!db.events) db.events = [...DEFAULT_DATABASE.events];
    const index = db.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      db.events[index].attendanceConfirmed = !db.events[index].attendanceConfirmed;
      this.saveDB(db);
      return db.events[index];
    }
    return null;
  }

  // --- CRUD Turmas ---
  static getClasses(schoolId = null) {
    const classes = this.getDB().classes || [];
    if (schoolId) {
      return classes.filter(c => c.schoolId === schoolId);
    }
    return classes;
  }

  static getClass(id) {
    return (this.getDB().classes || []).find(c => c.id === id);
  }

  static addClass(classObj) {
    const db = this.getDB();
    const newClass = {
      id: "turma-" + crypto.randomUUID(),
      studentCount: 12,
      status: "Ativa",
      ...classObj
    };
    db.classes.push(newClass);
    this.saveDB(db);
    return newClass;
  }

  static updateClass(id, updatedData) {
    const db = this.getDB();
    const index = db.classes.findIndex(c => c.id === id);
    if (index !== -1) {
      db.classes[index] = { ...db.classes[index], ...updatedData };
      this.saveDB(db);
      return db.classes[index];
    }
    return null;
  }

  static deleteClass(id) {
    const db = this.getDB();
    const index = db.classes.findIndex(c => c.id === id);
    if (index !== -1) {
      db.classes.splice(index, 1);
      this.saveDB(db);
      return true;
    }
    return false;
  }

  // --- CRUD Aulas ---
  static getLessons(schoolId = null) {
    const lessons = this.getDB().lessons;
    if (schoolId) {
      return lessons.filter(l => l.schoolId === schoolId);
    }
    return lessons;
  }

  static addLesson(lesson) {
    const db = this.getDB();
    const newLesson = {
      id: "aula-" + crypto.randomUUID(),
      status: "Agendada",
      ...lesson
    };
    db.lessons.push(newLesson);
    this.saveDB(db);
    return newLesson;
  }

  // --- CRUD Materiais ---
  static getMaterials(schoolId = null) {
    const materials = this.getDB().materials;
    if (schoolId) {
      return materials.filter(m => m.schoolId === schoolId);
    }
    return materials;
  }

  static addMaterial(material) {
    const db = this.getDB();
    const newMat = {
      id: "mat-" + crypto.randomUUID(),
      ...material
    };
    db.materials.push(newMat);
    this.saveDB(db);
    return newMat;
  }

  // --- CRUD Tarefas ---
  static getTasks(schoolId = null) {
    const tasks = this.getDB().tasks || [];
    if (schoolId) {
      return tasks.filter(t => t.schoolId === schoolId);
    }
    return tasks;
  }

  static getTask(id) {
    return (this.getDB().tasks || []).find(t => t.id === id);
  }

  static addTask(task) {
    const db = this.getDB();
    const newTask = {
      id: "task-" + crypto.randomUUID(),
      status: "Pendente",
      ...task
    };
    db.tasks.push(newTask);
    this.saveDB(db);
    return newTask;
  }

  static updateTask(id, updatedData) {
    const db = this.getDB();
    const index = db.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      db.tasks[index] = { ...db.tasks[index], ...updatedData };
      this.saveDB(db);
      return db.tasks[index];
    }
    return null;
  }

  static submitStudentTask(taskId, submissionData = {}) {
    const db = this.getDB();
    const index = db.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      db.tasks[index] = {
        ...db.tasks[index],
        status: "Concluído",
        submissionDate: "Hoje às " + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        grade: "10.0",
        feedback: "Excelente trabalho! Respostas precisas e ótima aplicação da gramática.",
        ...submissionData
      };
      this.saveDB(db);
      return db.tasks[index];
    }
    return null;
  }

  // --- CRUD Financeiro ---
  static getFinancial(schoolId = null) {
    const financial = this.getDB().financial;
    if (schoolId) {
      return financial.filter(f => f.schoolId === schoolId);
    }
    return financial;
  }

  static addFinancial(record) {
    const db = this.getDB();
    const newFin = {
      id: "fin-" + crypto.randomUUID(),
      status: "Em aberto",
      ...record
    };
    db.financial.push(newFin);
    this.saveDB(db);
    return newFin;
  }

  static payFinancial(id) {
    const db = this.getDB();
    const index = db.financial.findIndex(f => f.id === id);
    if (index !== -1) {
      db.financial[index].status = "Pago";
      db.financial[index].paidAt ||= new Date().toISOString();
      this.saveDB(db);
      return db.financial[index];
    }
    return null;
  }

  static renewStudentPlan(studentName, planName, planValue, periodMonths = 6, schoolId = "escola-1") {
    const db = this.getDB();
    const student = db.students.find(s => s.name === studentName);
    if (student) {
      student.course = planName;
    }
    const newFin = {
      id: "fin-" + crypto.randomUUID(),
      schoolId: schoolId,
      studentName: studentName,
      plan: planName,
      dueDate: new Date().toLocaleDateString('pt-BR'),
      value: planValue,
      status: "Pago",
      description: `Renovação de Matrícula - ${planName} (${periodMonths} meses)`
    };
    db.financial.unshift(newFin);
    this.saveDB(db);
    return newFin;
  }

  // --- Planos ---
  static getPlans() {
    return this.getDB().plans;
  }

  static addPlan(plan) {
    const db = this.getDB();
    const newPlan = {
      id: "plan-" + crypto.randomUUID(),
      ...plan
    };
    db.plans.push(newPlan);
    this.saveDB(db);
    return newPlan;
  }

  static updatePlan(id, changes) {
    const db = this.getDB();
    const plan = db.plans.find(p => p.id === id);
    if (!plan) return null;
    Object.assign(plan, changes, { id });
    this.saveDB(db);
    return plan;
  }

  static deletePlan(id) {
    const db = this.getDB();
    const index = db.plans.findIndex(p => p.id === id);
    if (index !== -1) {
      db.plans.splice(index, 1);
      this.saveDB(db);
      return true;
    }
    return false;
  }

  // --- CRUD Cursos, Módulos, Aulas e Atividades ---
  static getCourses(schoolId = null, teacherId = null) {
    const db = this.getDB();
    let courses = db.courses || [];
    if (schoolId) courses = courses.filter(c => c.schoolId === schoolId);
    if (teacherId) {
      const filtered = courses.filter(c => c.teacherId === teacherId || (c.instructor && c.instructor.toLowerCase().includes(teacherId.toLowerCase())));
      return filtered;
    }
    return courses;
  }

  static getCourse(idOrName) {
    if (!idOrName) return null;
    const db = this.getDB();
    const courses = db.courses || [];
    return courses.find(c => c.id === idOrName || c.name === idOrName || c.title === idOrName);
  }

  static addCourse(courseObj) {
    const db = this.getDB();
    if (!db.courses) db.courses = [];
    const courseId = "curso-" + crypto.randomUUID();
    const newCourse = {
      id: courseId,
      schoolId: courseObj.schoolId || "escola-1",
      teacherId: courseObj.teacherId || "prof-1",
      name: courseObj.name || "Novo Curso de Idiomas",
      title: courseObj.title || courseObj.name || "Novo Curso de Idiomas",
      days: courseObj.days || "Seg e Qua",
      hours: courseObj.hours || "19:00 - 20:00",
      room: courseObj.room || "Sala Virtual 01",
      category: courseObj.category || "Inglês Geral",
      level: courseObj.level || "A1",
      description: courseObj.description || "Curso completo com videoaulas sequenciais, materiais em PDF e atividades práticas.",
      thumbnail: courseObj.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600",
      instructor: courseObj.instructor || "Prof. Lucas Martins",
      modules: [
        {
          id: "mod-" + crypto.randomUUID(),
          title: "Módulo 1 — Fundamentos & Introdução",
          description: "Módulo inicial de estudos e prática.",
          items: []
        }
      ],
      ...courseObj
    };
    db.courses.push(newCourse);

    if (db.classes) {
      const classExists = db.classes.some(c => c.name === newCourse.name);
      if (!classExists) {
        db.classes.push({
          id: "turma-" + crypto.randomUUID(),
          name: newCourse.name,
          teacherId: newCourse.teacherId,
          studentCount: 0,
          days: newCourse.days,
          hours: newCourse.hours,
          room: newCourse.room,
          level: newCourse.level,
          status: "Ativa",
          schoolId: newCourse.schoolId
        });
      }
    }

    this.saveDB(db);
    return newCourse;
  }

  static updateCourse(id, updatedData) {
    const db = this.getDB();
    const index = (db.courses || []).findIndex(c => c.id === id);
    if (index !== -1) {
      db.courses[index] = { ...db.courses[index], ...updatedData };
      this.saveDB(db);
      return db.courses[index];
    }
    return null;
  }

  static deleteCourse(id) {
    const db = this.getDB();
    const index = (db.courses || []).findIndex(c => c.id === id);
    if (index !== -1) {
      db.courses.splice(index, 1);
      this.saveDB(db);
      return true;
    }
    return false;
  }

  static addModule(courseId, moduleObj) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId);
    if (course) {
      if (!course.modules) course.modules = [];
      const newModule = {
        id: "mod-" + crypto.randomUUID(),
        title: moduleObj.title || "Novo Módulo",
        description: moduleObj.description || "",
        items: []
      };
      course.modules.push(newModule);
      this.saveDB(db);
      return newModule;
    }
    return null;
  }

  static updateModule(courseId, moduleId, updatedData) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId);
    if (course && course.modules) {
      const modIndex = course.modules.findIndex(m => m.id === moduleId);
      if (modIndex !== -1) {
        course.modules[modIndex] = { ...course.modules[modIndex], ...updatedData };
        this.saveDB(db);
        return course.modules[modIndex];
      }
    }
    return null;
  }

  static deleteModule(courseId, moduleId) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId);
    if (course && course.modules) {
      const modIndex = course.modules.findIndex(m => m.id === moduleId);
      if (modIndex !== -1) {
        course.modules.splice(modIndex, 1);
        this.saveDB(db);
        return true;
      }
    }
    return false;
  }

  static addLessonToModule(courseId, moduleId, lessonObj) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId || c.name === courseId);
    if (course) {
      if (!course.modules || course.modules.length === 0) {
        course.modules = [{
          id: "mod-" + crypto.randomUUID(),
          title: "Módulo 1 — Fundamentos & Introdução",
          description: "Módulo de estudos e prática.",
          items: []
        }];
      }
      const mod = (moduleId ? course.modules.find(m => m.id === moduleId) : null) || course.modules[0];
      if (mod) {
        if (!mod.items) mod.items = [];
        
        let materials = lessonObj.materials || [];
        if (lessonObj.materialTitle) {
          materials.push({
            id: "mat-" + crypto.randomUUID(),
            title: lessonObj.materialTitle,
            type: lessonObj.materialType || "PDF",
            size: lessonObj.materialSize || "1.8 MB",
            url: lessonObj.materialUrl || "#"
          });
        }

        const newLesson = {
          id: "item-aula-" + crypto.randomUUID(),
          type: "lesson",
          title: lessonObj.title || "Nova Aula",
          duration: lessonObj.duration || "20 min",
          videoUrl: lessonObj.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4",
          description: lessonObj.description || "",
          materials: materials,
          completedBy: []
        };
        mod.items.push(newLesson);
        this.saveDB(db);
        return newLesson;
      }
    }
    return null;
  }

  static addMaterialToModule(courseId, moduleId, materialObj) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId || c.name === courseId);
    if (course) {
      if (!course.modules || course.modules.length === 0) {
        course.modules = [{
          id: "mod-" + crypto.randomUUID(),
          title: "Módulo 1 — Fundamentos & Introdução",
          description: "Módulo de estudos e prática.",
          items: []
        }];
      }
      const mod = (moduleId ? course.modules.find(m => m.id === moduleId) : null) || course.modules[0];
      if (mod) {
        if (!mod.materials) mod.materials = [];
        const newMat = {
          id: "mat-" + crypto.randomUUID(),
          title: materialObj.title || "Material de Apoio",
          type: materialObj.type || "PDF",
          size: materialObj.size || "1.5 MB",
          url: materialObj.url || "#"
        };
        mod.materials.push(newMat);

        // Também associa como material da última aula se houver
        const lessons = (mod.items || []).filter(i => i.type === "lesson");
        if (lessons.length > 0) {
          const lastLesson = lessons[lessons.length - 1];
          if (!lastLesson.materials) lastLesson.materials = [];
          lastLesson.materials.push(newMat);
        }

        this.saveDB(db);
        return newMat;
      }
    }
    return null;
  }

  static addActivityToModule(courseId, moduleId, activityObj) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId || c.name === courseId);
    if (course) {
      if (!course.modules || course.modules.length === 0) {
        course.modules = [{
          id: "mod-" + crypto.randomUUID(),
          title: "Módulo 1 — Fundamentos & Introdução",
          description: "Módulo de estudos e prática.",
          items: []
        }];
      }
      const mod = (moduleId ? course.modules.find(m => m.id === moduleId) : null) || course.modules[0];
      if (mod) {
        if (!mod.items) mod.items = [];
        const newActivity = {
          id: "item-ativ-" + crypto.randomUUID(),
          type: "activity",
          title: activityObj.title || "Nova Atividade",
          statement: activityObj.statement || "Responda as questões propostas e envie seu arquivo em formato PDF.",
          hasGrade: activityObj.hasGrade !== false && activityObj.hasGrade !== "false",
          maxGrade: activityObj.hasGrade === false ? 0 : (activityObj.maxGrade !== undefined ? parseFloat(activityObj.maxGrade) : 10.0),
          evaluationCriteria: activityObj.evaluationCriteria || "1. Coerência e domínio do vocabulário (5.0 pts)\n2. Correção gramatical e pronúncia (5.0 pts)",
          startDate: activityObj.startDate || new Date().toISOString().split('T')[0],
          dueDate: activityObj.dueDate || "",
          status: activityObj.status || "published",
          teacherAttachmentPdf: activityObj.teacherAttachmentPdf || activityObj.teacherPdf || (activityObj.pdfName ? { name: activityObj.pdfName, size: "1.2 MB", url: "#" } : null),
          submissions: []
        };
        mod.items.push(newActivity);
        this.saveDB(db);
        return newActivity;
      }
    }
    return null;
  }

  static updateModuleItem(courseId, moduleId, itemId, updatedData) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId);
    if (course && course.modules) {
      const mod = course.modules.find(m => m.id === moduleId);
      if (mod && mod.items) {
        const itemIdx = mod.items.findIndex(i => i.id === itemId);
        if (itemIdx !== -1) {
          mod.items[itemIdx] = { ...mod.items[itemIdx], ...updatedData };
          this.saveDB(db);
          return mod.items[itemIdx];
        }
      }
    }
    return null;
  }

  static deleteModuleItem(courseId, moduleId, itemId) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId);
    if (course && course.modules) {
      const mod = course.modules.find(m => m.id === moduleId);
      if (mod && mod.items) {
        const itemIdx = mod.items.findIndex(i => i.id === itemId);
        if (itemIdx !== -1) {
          mod.items.splice(itemIdx, 1);
          this.saveDB(db);
          return true;
        }
      }
    }
    return false;
  }

  static moveModuleItem(courseId, moduleId, itemId, direction) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId);
    if (!course || !course.modules) return false;
    const mod = course.modules.find(m => m.id === moduleId);
    if (!mod || !mod.items) return false;

    const idx = mod.items.findIndex(i => i.id === itemId);
    if (idx === -1) return false;

    if (direction === "up" && idx > 0) {
      const temp = mod.items[idx];
      mod.items[idx] = mod.items[idx - 1];
      mod.items[idx - 1] = temp;
      this.saveDB(db);
      return true;
    } else if (direction === "down" && idx < mod.items.length - 1) {
      const temp = mod.items[idx];
      mod.items[idx] = mod.items[idx + 1];
      mod.items[idx + 1] = temp;
      this.saveDB(db);
      return true;
    }
    return false;
  }

  static submitStudentActivity(courseId, moduleId, itemId, submissionData) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId);
    if (!course || !course.modules) return null;
    const mod = course.modules.find(m => m.id === moduleId);
    if (!mod || !mod.items) return null;
    const item = mod.items.find(i => i.id === itemId);
    if (!item || item.type !== "activity") return null;

    if (!item.submissions) item.submissions = [];
    const existingIndex = item.submissions.findIndex(s => s.studentId === submissionData.studentId);

    const submission = {
      studentId: submissionData.studentId || "aluno-1",
      studentName: submissionData.studentName || "Aluno",
      submissionDate: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      fileName: submissionData.fileName || "Atividade_Resolvida.pdf",
      fileSize: submissionData.fileSize || "1.2 MB",
      studentNotes: submissionData.studentNotes || "",
      grade: null,
      feedback: "Submissão recebida com sucesso. Aguardando avaliação do professor."
    };

    if (existingIndex !== -1) {
      item.submissions[existingIndex] = { ...item.submissions[existingIndex], ...submission };
    } else {
      item.submissions.push(submission);
    }

    this.saveDB(db);
    return submission;
  }

  static toggleLessonCompletion(courseId, moduleId, itemId, studentId) {
    const db = this.getDB();
    const course = (db.courses || []).find(c => c.id === courseId);
    if (!course || !course.modules) return false;
    const mod = course.modules.find(m => m.id === moduleId);
    if (!mod || !mod.items) return false;
    const item = mod.items.find(i => i.id === itemId);
    if (!item || item.type !== "lesson") return false;

    if (!item.completedBy) item.completedBy = [];
    const index = item.completedBy.indexOf(studentId);
    let completed = false;
    if (index !== -1) {
      item.completedBy.splice(index, 1);
      completed = false;
    } else {
      item.completedBy.push(studentId);
      completed = true;
    }
    this.saveDB(db);
    return completed;
  }

  static getModuleMaterials(courseId, moduleId) {
    const course = this.getCourse(courseId);
    if (!course || !course.modules) return [];
    const mod = course.modules.find(m => m.id === moduleId);
    if (!mod || !mod.items) return [];

    const materials = [];

    // Materiais diretamente cadastrados no módulo
    if (mod.materials && mod.materials.length > 0) {
      mod.materials.forEach(mat => {
        materials.push({
          ...mat,
          itemTitle: mod.title,
          itemId: mod.id,
          itemType: "module"
        });
      });
    }

    (mod.items || []).forEach(item => {
      if (item.type === "lesson" && item.materials && item.materials.length > 0) {
        item.materials.forEach(mat => {
          materials.push({
            ...mat,
            itemTitle: item.title,
            itemId: item.id,
            itemType: "lesson"
          });
        });
      } else if (item.type === "activity" && item.teacherAttachmentPdf) {
        materials.push({
          id: "mat-ativ-" + item.id,
          title: item.teacherAttachmentPdf.name || "PDF de Apoio - " + item.title,
          type: "PDF",
          size: item.teacherAttachmentPdf.size || "1.0 MB",
          url: item.teacherAttachmentPdf.url || "#",
          itemTitle: item.title,
          itemId: item.id,
          itemType: "activity"
        });
      }
    });
    return materials;
  }

  static getCourseMaterials(courseId) {
    const course = this.getCourse(courseId);
    if (!course || !course.modules) return [];
    let allMaterials = [];
    course.modules.forEach(mod => {
      allMaterials = allMaterials.concat(this.getModuleMaterials(course.id, mod.id));
    });
    return allMaterials;
  }
}

// Para exportação simples na web
window.ChangeSkillsDB = PratikaDB;
window.PratikaDB = PratikaDB;

