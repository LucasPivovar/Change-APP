// Change Skills - Single Page Application Core Controller

// Global UI Helper: Inline SVG Icons for premium aesthetics
const Icons = {
  dashboard: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  alunos: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  professores: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  turmas: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  calendario: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  aulas: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
  materiais: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  financeiro: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  comunicacao: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  configuracoes: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  home: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  tarefas: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
  perfil: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  search: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  bell: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
  logOut: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
  escola: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  planos: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  assinaturas: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  integracoes: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  check: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  mic: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
  videoCamera: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
  screenShare: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><path d="M17 8l-5-5-5 5"></path><line x1="12" y1="3" x2="12" y2="12"></line></svg>`,
  hand: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5"></path><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6"></path><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6.5"></path><path d="M6 14V11a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6c0 4.42 3.58 8 8 8h3a8 8 0 0 0 8-8v-3.5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2V14"></path></svg>`,
  close: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  download: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  messageSquare: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
};

class PratikaApp {
  constructor() {
    this.session = {
      role: null, // 'escola', 'aluno', 'admin'
      schoolId: null, // school context when school or student is logged in
      userId: null, // maria-silva, etc.
      userName: "",
      userEmail: "",
      userPic: ""
    };
    
    this.activeSchoolTheme = null; // Dynamically set to school context configuration
    this.currentPortal = "auth";
    this.currentView = "login-escola";
    
    // Calendar State
    this.calendarState = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      viewMode: "mes", // 'mes' | 'semana' | 'lista'
      filter: "todos" // 'todos' | 'live' | 'activity' | 'exam' | 'holiday'
    };

    this.activeChatContact = null; // Contact active in chat
    
    // LiveKit States
    this.liveKit = {
      micMuted: false,
      videoMuted: false,
      sharingScreen: false,
      handRaised: false,
      recording: false,
      activeTab: 'chat',
      messages: [
        { sender: "Prof. Lucas Martins", text: "Good evening everyone! Let's get started." },
        { sender: "Maria Silva", text: "Hello! I am ready!" },
        { sender: "Ana Clara", text: "Hi teacher!" }
      ]
    };

    this.init();
  }

  init() {
    // Escuta mudanças na hash
    window.addEventListener("hashchange", () => this.handleRouting());
    
    // Fecha dropdowns ao clicar fora ou ao rolar a página
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".action-dropdown")) {
        document.querySelectorAll(".action-dropdown-menu.show").forEach(m => m.classList.remove("show"));
      }
    });
    window.addEventListener("scroll", () => {
      document.querySelectorAll(".action-dropdown-menu.show").forEach(m => m.classList.remove("show"));
    }, true);

    // Configura rotas iniciais se não houver hash
    if (!window.location.hash) {
      window.location.hash = "#/auth/escola";
    } else {
      this.handleRouting();
    }
  }

  // Define e injeta CSS Customizado para o White Label de acordo com a Escola
  applyWhiteLabelTheme(schoolId) {
    if (!schoolId) {
      // Remove variables style block to fallback to default Change Skills Blue
      const oldStyle = document.getElementById("whitelabel-styles");
      if (oldStyle) oldStyle.remove();
      this.updateFavicon(null);
      return;
    }

    const school = PratikaDB.getSchool(schoolId);
    if (!school) return;

    let styleEl = document.getElementById("whitelabel-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "whitelabel-styles";
      document.head.appendChild(styleEl);
    }

    const fontFamily = school.fontFamily || "Plus Jakarta Sans";
    const fontCSS = `'${fontFamily}', sans-serif`;

    styleEl.innerHTML = `
      :root {
        --primary-color: ${school.primaryColor};
        --secondary-color: ${school.secondaryColor};
        --primary-hover: ${school.primaryColor}E0;
        --secondary-hover: ${school.secondaryColor}E0;
        --font-main: ${fontCSS};
        --font-title: ${fontCSS};
        --font-display: ${fontCSS};
      }
      body, button, input, select, textarea, table {
        font-family: ${fontCSS} !important;
      }
    `;

    if (school.favicon) {
      this.updateFavicon(school.favicon);
    }
  }

  updateFavicon(iconUrlOrEmoji) {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "shortcut icon";
      document.head.appendChild(link);
    }
    link.href = "data:,";
  }

  navigate(route) {
    window.location.hash = "#/" + route.replace(/^#\/?/, "");
  }

  handleRouting() {
    const hash = window.location.hash;
    
    // Se for LiveKit Room (formato #/livekit/aula-1)
    if (hash.startsWith("#/livekit/")) {
      const lessonId = hash.replace("#/livekit/", "");
      this.renderLiveKitRoom(lessonId);
      return;
    }

    const parts = hash.replace("#/", "").split("/");
    const portal = parts[0]; // auth, escola, aluno, admin
    const view = parts[1] || "dashboard"; // login-escola, dashboard, etc.
    this.routeParams = parts.slice(2);

    // Se o portal mudou ou não está logado
    if (portal === "auth") {
      this.session.role = null;
      this.session.schoolId = null;
      this.applyWhiteLabelTheme(null);
      this.renderAuthPortal(view);
      return;
    }

    // Controle simples de acesso (se tentar acessar áreas protegidas sem login, força login da respectiva área)
    if (!this.session.role) {
      if (portal === "escola") { window.location.hash = "#/auth/escola"; return; }
      if (portal === "aluno") { window.location.hash = "#/auth/aluno"; return; }
      if (portal === "professor") { window.location.hash = "#/auth/professor"; return; }
      if (portal === "admin") { window.location.hash = "#/auth/admin"; return; }
    }

    // Aplica o White Label correspondente à escola logada
    if (this.session.schoolId) {
      this.applyWhiteLabelTheme(this.session.schoolId);
    } else {
      this.applyWhiteLabelTheme(null);
    }

    this.currentPortal = portal;
    this.currentView = view;

    this.renderPortalLayout();
  }

  // --- LOGIN E SESSÃO ---
  login(role, email, schoolId = null) {
    if (role === "escola") {
      this.session.role = "escola";
      this.session.schoolId = schoolId || "escola-1";
      this.session.userName = "Escola Change Skills";
      this.session.userEmail = email;
      this.session.userPic = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150";
      window.location.hash = "#/escola/dashboard";
    } else if (role === "aluno") {
      // Procura o aluno correspondente no banco
      const allStudents = PratikaDB.getStudents();
      const student = allStudents.find(s => s.email.toLowerCase() === (email || "").toLowerCase()) || allStudents[0];
      
      this.session.role = "aluno";
      this.session.schoolId = student ? student.schoolId : "escola-1";
      this.session.userId = student ? student.id : "aluno-1";
      this.session.userName = student ? student.name : "Aluno";
      this.session.userEmail = student ? student.email : email;
      this.session.userPic = student ? student.profilePic : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150";
      window.location.hash = "#/aluno/home";
    } else if (role === "professor") {
      const teachers = PratikaDB.getTeachers();
      const teacher = teachers.find(t => t.email && t.email.toLowerCase() === (email || "").toLowerCase()) || teachers[0];
      this.session.role = "professor";
      this.session.schoolId = teacher ? teacher.schoolId : "escola-1";
      this.session.userId = teacher ? teacher.id : "prof-1";
      this.session.userName = teacher ? teacher.name : "Lucas Martins";
      this.session.userEmail = teacher ? teacher.email : "lucas.martins@escola.com";
      this.session.userPic = teacher ? (teacher.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150") : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150";
      window.location.hash = "#/professor/cursos";
    } else if (role === "admin") {
      this.session.role = "admin";
      this.session.schoolId = null;
      this.session.userName = "Administrador Master";
      this.session.userEmail = email;
      this.session.userPic = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150";
      window.location.hash = "#/admin/dashboard";
    }
  }

  logout() {
    this.session = { role: null, schoolId: null, userId: null, userName: "", userEmail: "", userPic: "" };
    this.applyWhiteLabelTheme(null);
    window.location.hash = "#/auth/escola";
  }

  // --- RENDERIZADORES DE PORTAIS ---

  // PORTAL DE AUTENTICACAO (Login / Cadastro)
  renderAuthPortal(view) {
    const root = document.getElementById("app-root");
    
    if (view === "escola") {
      root.innerHTML = `
        <div class="auth-container" style="position: relative; min-height: 100vh; overflow: visible;">

          <!-- SIDEBAR EXECUTIVA B2B -->
          <div class="auth-sidebar" style="background: linear-gradient(135deg, #031735 0%, #061D42 50%, #0A2855 100%); overflow: hidden; z-index: 1;">
            <div class="auth-bg-orbits">
              <div class="circle-cut-outer" style="border-top-color: rgba(36, 107, 253, 0.6); border-bottom-color: rgba(35, 199, 243, 0.4);"></div>
              <div class="circle-cut-inner" style="border-top-color: rgba(35, 199, 243, 0.7);"></div>
              <div class="circle-cut-center"></div>
            </div>

            <!-- LOGO NO TOPO DA SIDEBAR AZUL -->
            <div style="position: absolute; top: 2.5rem; left: 2.5rem;">
              <img src="assets/images/logo.png" alt="Change Skills" style="height: 44px; object-fit: contain; filter: brightness(0) invert(1);">
            </div>

            <div class="auth-hero-content" style="text-align: left; padding-top: 3rem;">
              <div class="auth-role-badge" style="background: rgba(36, 107, 253, 0.25); border-color: rgba(35, 199, 243, 0.4); color: #23C7F3; margin-bottom: 1.5rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Console Corporativo da Diretoria
              </div>
              <h1 style="font-size: 2rem; line-height: 1.25; margin-bottom: 0.75rem;">Cursos e alunos da sua escola parceira.</h1>
              <p style="color: #94A3B8; font-size: 0.9rem; margin-bottom: 1.5rem;">Aprenda idiomas. Transforme o mundo. Cadastre seus alunos e acompanhe os cursos disponibilizados pela Change Skills.</p>
              <div class="auth-features-list" style="text-align: left;">
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Painel de MRR, repasses e fluxo de caixa</div>
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Catálogo de cursos disponibilizado pelo administrador</div>
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Personalizacao White Label da sua marca</div>
              </div>
            </div>
          </div>

          <!-- FORMULARIO EXECUTIVO ESCOLA -->
          <div class="auth-form-wrapper" style="background-color: #F8FAFC; z-index: 2; position: relative; overflow: visible;">
            <div class="auth-form-ambient" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; pointer-events: none; z-index: 0; border-radius: inherit;"></div>

            <!-- CAMALEAO: corpo na borda, dedos por cima do lado azul -->
            <img
              src="assets/images/camaleao-espiando.png"
              alt="Camaleao"
              class="login-chameleon"
              style="
                position: absolute;
                left: -140px;
                top: -20px;
                height: 480px;
                width: auto;
                z-index: 999;
                pointer-events: none;
                filter: drop-shadow(-12px 4px 24px rgba(3,23,53,0.55));
              "
            >

            <div class="auth-card auth-panel-flat" style="box-shadow: none; border: 0; position: relative;">


              <h2 style="font-size: 1.45rem; color: #061938; text-align: left; margin-bottom: 0.35rem;">Login da Escola</h2>
              <p class="subtitle" style="color: #64748B; margin-bottom: 1.5rem; text-align: left;">Acesse o painel administrativo da sua unidade</p>

              <form id="auth-escola-form">
                <div class="form-group">
                  <label for="email" style="font-weight: 600; color: #334155;">E-mail Corporativo</label>
                  <input type="email" id="email" class="form-control" placeholder="••••••••••••" value="escola@changeskills.com.br" required style="border-color: #CBD5E1;">
                </div>
                <div class="form-group">
                  <label for="password" style="font-weight: 600; color: #334155;">Senha de Acesso</label>
                  <input type="password" id="password" class="form-control" placeholder="••••••••••••" value="123456" required style="border-color: #CBD5E1;">
                </div>

                <div class="checkbox-group">
                  <label class="checkbox-label" style="color: #475569; font-size: 0.85rem; cursor: pointer;">
                    <input type="checkbox" checked> Lembrar de mim
                  </label>
                  <a href="#/auth/recover" class="form-link" style="font-size: 0.85rem; font-weight: 600; color: #246BFD;">Esqueci a senha</a>
                </div>

                <button type="submit" class="btn btn-primary btn-full" style="margin-top: 0.75rem; height: 48px; font-weight: 700; font-size: 0.95rem; background: #246BFD; border-color: #246BFD;">
                  Entrar no Painel da Escola
                </button>
              </form>

            </div>
          </div>
        </div>
      `;

      
      document.getElementById("auth-escola-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        this.login("escola", email, "escola-1");
      });
    }

        else if (view === "professor") {
      root.innerHTML = `
        <div class="auth-container" style="position: relative; min-height: 100vh; overflow: visible;">
          <div class="auth-sidebar" style="background: linear-gradient(135deg, #031735 0%, #061D42 50%, #0A2855 100%); overflow: hidden; z-index: 1;">
            <div class="auth-bg-orbits">
              <div class="circle-cut-outer" style="border-top-color: rgba(36, 107, 253, 0.6);"></div>
              <div class="circle-cut-inner" style="border-top-color: rgba(35, 199, 243, 0.7);"></div>
              <div class="circle-cut-center"></div>
            </div>
            <div style="position: absolute; top: 2.5rem; left: 2.5rem;">
              <img src="assets/images/logo.png" alt="Change Skills" style="height: 44px; filter: brightness(0) invert(1);">
            </div>
            <div class="auth-hero-content" style="text-align: left; padding-top: 3rem;">
              <div class="auth-role-badge" style="background: rgba(36, 107, 253, 0.25); border-color: rgba(35, 199, 243, 0.4); color: #23C7F3; margin-bottom: 1.5rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                ÁREA DOCENTE
              </div>
              <h1 style="font-size: 2rem; line-height: 1.25; margin-bottom: 0.75rem;">Portal do Professor</h1>
              <p style="color: #94A3B8; font-size: 0.9rem; margin-bottom: 1.5rem;">Gerencie suas aulas, turmas e atividades.</p>
              
              <div class="auth-features-list" style="text-align: left;">
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Painel de controle de turmas e diário</div>
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Aulas ao vivo e salas interativas</div>
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Avaliação contínua de alunos</div>
              </div>
            </div>
          </div>
          <div class="auth-form-wrapper" style="background-color: #F8FAFC; z-index: 2; position: relative; overflow: visible;">
            <div class="auth-form-ambient" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; pointer-events: none; z-index: 0; border-radius: inherit;"></div>
            <img src="assets/images/camaleao-espiando.png" alt="Camaleao" class="login-chameleon" style="position: absolute; left: -140px; top: -20px; height: 480px; width: auto; z-index: 999; pointer-events: none; filter: drop-shadow(-12px 4px 24px rgba(3,23,53,0.55));">
            <div class="auth-card auth-panel-flat" style="box-shadow: none; border: 0; position: relative;">
              <h2 style="font-size: 1.45rem; color: #061938; margin-bottom: 0.35rem;">Login do Professor</h2>
              <p class="subtitle" style="color: #64748B; margin-bottom: 1.5rem;">Acesse sua área de docência</p>
              <form id="auth-professor-form">
                <div class="form-group">
                  <label for="email" style="font-weight: 600; color: #334155;">E-mail do Professor</label>
                  <input type="email" id="email" class="form-control" placeholder="••••••••••••" value="professor@changeskills.com.br" required>
                </div>
                <div class="form-group">
                  <label for="password" style="font-weight: 600; color: #334155;">Senha de Acesso</label>
                  <input type="password" id="password" class="form-control" value="123456" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full" style="padding: 0.85rem; font-size: 1.05rem; font-weight: 700; margin-top: 1rem;">Entrar no Portal</button>
              </form>
            </div>
          </div>
        </div>
      `;
      document.getElementById("auth-professor-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        this.login("professor", email, "escola-1"); // mock
      });
    }

else if (view === "aluno") {
      const school = PratikaDB.getSchool("escola-1");
      this.applyWhiteLabelTheme("escola-1");
      
      root.innerHTML = `
        <div class="auth-container" style="position: relative; min-height: 100vh; overflow: visible;">
          <!-- SIDEBAR ACADEMICA VIBRANTE WHITE-LABEL -->
          <div class="auth-sidebar" style="background: linear-gradient(135deg, ${school.primaryColor} 0%, ${school.secondaryColor} 100%); flex: 1; overflow: hidden; z-index: 1;">
            <div class="auth-bg-orbits">
              <div class="circle-cut-outer"></div>
              <div class="circle-cut-inner"></div>
              <div class="circle-cut-center"></div>
            </div>
            
            <!-- LOGO NO TOPO DA SIDEBAR (WHITE LABEL) -->
            <div style="position: absolute; top: 2.5rem; left: 2.5rem; filter: brightness(0) invert(1);">
              ${school.logo}
            </div>

            <div class="auth-hero-content" style="text-align: left; padding-top: 3rem;">
              <div class="auth-role-badge" style="background: rgba(255, 255, 255, 0.18); border-color: rgba(255, 255, 255, 0.3); color: white; margin-bottom: 1.5rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Portal de Estudos do Aluno
              </div>
              <h1 style="font-size: 2rem; line-height: 1.25; margin-bottom: 0.75rem;">Aprenda idiomas. Transforme o mundo.</h1>
              <p style="color: rgba(255,255,255,0.85); font-size: 0.9rem; margin-bottom: 1.5rem;">Salas ao vivo interativas, livros digitais, exercícios dinâmicos e acompanhamento com o Camaleão.</p>
              
              <div class="auth-features-list" style="text-align: left;">
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Cursos e conteúdos para estudar no seu ritmo</div>
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Exercícios práticos e feedbacks</div>
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Certificados oficiais reconhecidos</div>
              </div>
            </div>
          </div>

          <!-- FORMULARIO DO ALUNO -->
          <div class="auth-form-wrapper" style="background-color: #F8FAFC; z-index: 2; position: relative; overflow: visible; flex: 1;">
            <div class="auth-form-ambient" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; pointer-events: none; z-index: 0; border-radius: inherit;"></div>

            <!-- CAMALEAO ESPIANDO -->
            <img
              src="assets/images/camaleao-espiando.png"
              alt="Camaleao"
              class="login-chameleon"
              style="
                position: absolute;
                left: -140px;
                top: -20px;
                height: 480px;
                width: auto;
                z-index: 999;
                pointer-events: none;
                filter: drop-shadow(-12px 4px 24px rgba(0,0,0,0.35));
              "
            >

            <div class="auth-card auth-panel-flat" style="box-shadow: none; border: 0; position: relative;">

              <h2 style="font-size: 1.45rem; color: #061938; text-align: left; margin-bottom: 0.35rem;">Olá, Aluno! 👋</h2>
              <p class="subtitle" style="color: #64748B; margin-bottom: 1.5rem; text-align: left;">Acesse sua conta e continue sua jornada</p>
              
              <!-- Seletor de Simulacao White Label -->
              <div style="margin-bottom: 1.25rem; padding: 0.65rem 0.85rem; background-color: #F8FAFC; border-radius: 6px; border: 1px dashed #CBD5E1;">
                <label style="font-size: 0.7rem; font-weight: 700; color: #64748B; display: block; margin-bottom: 0.3rem;">ESCOLA PARCEIRA (SIMULAÇÃO WL)</label>
                <select id="wl-school-switcher" class="form-control" style="padding: 0.4rem 0.6rem; font-size: 0.85rem; height: auto;">
                  ${PratikaDB.getSchools().map(s => `<option value="${s.id}" ${s.id === school.id ? "selected" : ""}>${s.name}</option>`).join("")}
                </select>
              </div>

              <form id="auth-aluno-form">
                <div class="form-group">
                  <label for="student-email" style="font-weight: 600; color: #334155;">E-mail de Matrícula</label>
                  <input type="email" id="student-email" class="form-control" placeholder="seu.email@escola.com.br" value="maria.silva@email.com" required style="border-color: #CBD5E1;">
                </div>
                <div class="form-group">
                  <label for="student-password" style="font-weight: 600; color: #334155;">Senha</label>
                  <input type="password" id="student-password" class="form-control" placeholder="••••••••••••" value="123456" required style="border-color: #CBD5E1;">
                </div>
                
                <div class="checkbox-group">
                  <label class="checkbox-label" style="color: #475569; font-size: 0.85rem; cursor: pointer;">
                    <input type="checkbox" checked> Lembrar de mim
                  </label>
                  <a href="#/auth/recover" class="form-link" style="font-size: 0.85rem; font-weight: 600; color: ${school.primaryColor};">Esqueci a senha</a>
                </div>
                
                <button type="submit" class="btn btn-primary btn-full" style="margin-top: 0.75rem; height: 48px; font-weight: 700; font-size: 0.95rem; background: ${school.primaryColor}; border-color: ${school.primaryColor};">
                  Acessar Sala de Aula Virtual
                </button>
              </form>

              <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #E2E8F0; text-align: left; font-size: 0.825rem; color: #64748B;">
                Primeiro acesso? <a href="#" class="form-link" style="color: ${school.primaryColor}; font-weight: 600;" onclick="app.showToast('Entre em contato com a secretaria.', 'info')">Ativar minha matrícula</a>
              </div>
            </div>
          </div>
        </div>
      `;

      // Atualiza visualização conforme troca de escola simulada no dropdown
      document.getElementById("wl-school-switcher").addEventListener("change", (e) => {
        const selId = e.target.value;
        const newSchool = PratikaDB.getSchool(selId);
        this.applyWhiteLabelTheme(selId);
        
        // Altera sidebar, logo do card e textos de forma inline e instantânea
        const sidebar = document.querySelector(".auth-sidebar");
        sidebar.style.background = `linear-gradient(135deg, ${newSchool.primaryColor} 0%, ${newSchool.secondaryColor} 100%)`;
        const brandSpan = sidebar.querySelector(".auth-brand span");
        if (brandSpan) brandSpan.innerText = newSchool.name;
        
        // Troca os logos
        const brandLogoContainer = sidebar.querySelector(".auth-brand");
        if (brandLogoContainer) {
          const oldSvgOrImg = brandLogoContainer.querySelector("svg, img");
          if (oldSvgOrImg) oldSvgOrImg.outerHTML = newSchool.logo;
        }
        
        const cardLogoContainer = document.querySelector(".auth-card-logo");
        if (cardLogoContainer) {
          cardLogoContainer.style.color = newSchool.primaryColor;
          const oldCardLogo = cardLogoContainer.querySelector("svg, img");
          if (oldCardLogo) oldCardLogo.outerHTML = newSchool.logo;
        }

        // Atualiza formulário do aluno de acordo com a escola para fins de simulação
        const studentsOfSchool = PratikaDB.getStudents(selId);
        if (studentsOfSchool.length > 0) {
          document.getElementById("student-email").value = studentsOfSchool[0].email;
        } else {
          document.getElementById("student-email").value = "novo.aluno@escola.com";
        }
      });

      document.getElementById("auth-aluno-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("student-email").value;
        this.login("aluno", email);
      });
    }

    else if (view === "admin") {
      root.innerHTML = `
        <div class="auth-container" style="position: relative; min-height: 100vh; overflow: visible;">

          <!-- SIDEBAR ADMIN -->
          <div class="auth-sidebar" style="background: linear-gradient(135deg, #031735 0%, #061D42 50%, #0A2855 100%); overflow: hidden; z-index: 1;">
            <div class="auth-bg-orbits">
              <div class="circle-cut-outer" style="border-top-color: rgba(36, 107, 253, 0.6); border-bottom-color: rgba(35, 199, 243, 0.4);"></div>
              <div class="circle-cut-inner" style="border-top-color: rgba(35, 199, 243, 0.7);"></div>
              <div class="circle-cut-center"></div>
            </div>

            <!-- LOGO NO TOPO DA SIDEBAR AZUL -->
            <div style="position: absolute; top: 2.5rem; left: 2.5rem;">
              <img src="assets/images/logo.png" alt="Change Skills" style="height: 44px; object-fit: contain; filter: brightness(0) invert(1);">
            </div>

            <div class="auth-hero-content" style="text-align: left; padding-top: 3rem;">
              <div class="auth-role-badge" style="background: rgba(36, 107, 253, 0.25); border-color: rgba(35, 199, 243, 0.4); color: #23C7F3; margin-bottom: 1.5rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Controle Master e Sistema
              </div>
              <h1 style="font-size: 2rem; line-height: 1.25; margin-bottom: 0.75rem;">Centro de controle global da plataforma.</h1>
              <p style="color: #94A3B8; font-size: 0.9rem; margin-bottom: 1.5rem;">Gerenciamento de escolas parceiras (White Label), financeiro mestre e relatórios consolidados.</p>
              
              <div class="auth-features-list" style="text-align: left;">
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Visão macro de todas as franquias</div>
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Configurações do sistema e integrações</div>
                <div class="auth-feature-item" style="color: #E2E8F0;">${Icons.check} Faturamento e royalties consolidados</div>
              </div>
            </div>
          </div>

          <!-- FORMULARIO ADMIN -->
          <div class="auth-form-wrapper" style="background-color: #F8FAFC; z-index: 2; position: relative; overflow: visible;">
            <div class="auth-form-ambient" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; pointer-events: none; z-index: 0; border-radius: inherit;"></div>

            <!-- CAMALEAO: corpo na borda, dedos por cima do lado azul -->
            <img
              src="assets/images/camaleao-espiando.png"
              alt="Camaleao"
              class="login-chameleon"
              style="
                position: absolute;
                left: -140px;
                top: -20px;
                height: 480px;
                width: auto;
                z-index: 999;
                pointer-events: none;
                filter: drop-shadow(-12px 4px 24px rgba(3,23,53,0.55));
              "
            >

            <div class="auth-card auth-panel-flat" style="box-shadow: none; border: 0; position: relative;">

              <h2 style="font-size: 1.45rem; color: #061938; text-align: left; margin-bottom: 0.35rem;">Painel Admin Master</h2>
              <p class="subtitle" style="color: #64748B; margin-bottom: 1.5rem; text-align: left;">Controle e Gestão Global Change Skills Idiomas</p>
              
              <form id="auth-admin-form">
                <div class="form-group">
                  <label for="admin-email" style="font-weight: 600; color: #334155;">E-mail do Administrador</label>
                  <input type="email" id="admin-email" class="form-control" placeholder="admin@changeskills.com.br" value="admin@changeskills.com.br" required style="border-color: #CBD5E1;">
                </div>
                <div class="form-group">
                  <label for="admin-password" style="font-weight: 600; color: #334155;">Senha</label>
                  <input type="password" id="admin-password" class="form-control" placeholder="••••••••••••" value="123456" required style="border-color: #CBD5E1;">
                </div>
                
                <div class="checkbox-group">
                  <label class="checkbox-label" style="color: #475569; font-size: 0.85rem; cursor: pointer;">
                    <input type="checkbox" checked> Lembrar de mim
                  </label>
                  <a href="#/auth/recover" class="form-link" style="font-size: 0.85rem; font-weight: 600; color: #246BFD;">Esqueci a senha</a>
                </div>
                
                <button type="submit" class="btn btn-primary btn-full" style="margin-top: 0.75rem; height: 48px; font-weight: 700; font-size: 0.95rem; background: #246BFD; border-color: #246BFD;">
                  Acessar Console Admin
                </button>
              </form>

            </div>
          </div>
        </div>
      `;
      
      document.getElementById("auth-admin-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("admin-email").value;
        this.login("admin", email);
      });
    }
  }

  // ESTRUTURA GERAL DOS PAINÉIS (Layout Shell: Sidebar + Header + Container de Conteúdo)
  renderPortalLayout() {
    const root = document.getElementById("app-root");
    
    // Identifica escola ativa para White Label no logo da sidebar
    let brandLogo = `<img src="assets/images/logo.png" alt="Change Skills" class="brand-logo-img">`;
    let brandName = "CHANGE SKILLS";
    let isWhiteLabel = false;

    if (this.session.role === "escola" || this.session.role === "aluno") {
      const school = PratikaDB.getSchool(this.session.schoolId);
      if (school) {
        brandLogo = school.logo;
        brandName = school.name;
        isWhiteLabel = true;
      }
    }

    // Configuração dos itens da Sidebar com base no Portal
    let sidebarItemsHTML = "";
    if (this.session.role === "escola") {
      const items = [
        { route: "dashboard", label: "Dashboard", icon: Icons.dashboard },
        { route: "cursos", label: "Cursos disponíveis", icon: Icons.materiais },
        { route: "alunos", label: "Alunos", icon: Icons.alunos },
        { route: "atividades", label: "Atividades", icon: Icons.tarefas },
        { route: "materiais", label: "Materiais", icon: Icons.materiais },
        { route: "financeiro", label: "Financeiro", icon: Icons.financeiro },
        { route: "comunicacao", label: "Comunicação", icon: Icons.comunicacao },
        { route: "configuracoes", label: "Configurações", icon: Icons.configuracoes }
      ];
      sidebarItemsHTML = items.map(item => {
        const isActive = this.currentView === item.route || (item.route === "cursos" && ["curso", "assistir"].includes(this.currentView));
        return `
          <a href="#/escola/${item.route}" class="sidebar-item ${isActive ? "active" : ""}">
            ${item.icon}
            <span>${item.label}</span>
          </a>
        `;
      }).join("");
    } else if (this.session.role === "aluno") {
      const items = [
        { route: "home", label: "Início", icon: Icons.home },
        { route: "cursos", label: "Meus cursos", icon: Icons.materiais },
        { route: "tarefas", label: "Tarefas", icon: Icons.tarefas },
        { route: "materiais", label: "Materiais", icon: Icons.materiais },
        { route: "mensagens", label: "Mensagens", icon: Icons.comunicacao },
        { route: "financeiro", label: "Financeiro", icon: Icons.financeiro },
        { route: "perfil", label: "Meu Perfil", icon: Icons.perfil }
      ];
      sidebarItemsHTML = items.map(item => {
        const isActive = this.currentView === item.route || (item.route === "cursos" && ["curso", "assistir", "atividade"].includes(this.currentView));
        return `
          <a href="#/aluno/${item.route}" class="sidebar-item ${isActive ? "active" : ""}">
            ${item.icon}
            <span>${item.label}</span>
          </a>
        `;
      }).join("");
    } else if (this.session.role === "professor") {
      const items = [
        { route: "dashboard", label: "Hoje", icon: Icons.dashboard },
        { route: "alunos", label: "Meus Alunos", icon: Icons.alunos },
        { route: "cursos", label: "Meus Cursos", icon: Icons.turmas },
        { route: "aulas", label: "Aulas", icon: Icons.aulas },
        { route: "atividades", label: "Atividades", icon: Icons.tarefas },
        { route: "materiais", label: "Materiais", icon: Icons.materiais },
        { route: "mensagens", label: "Mensagens", icon: Icons.comunicacao },
        { route: "perfil", label: "Meu Perfil", icon: Icons.perfil }
      ];
      sidebarItemsHTML = items.map(item => {
        const isActive = this.currentView === item.route || (item.route === "cursos" && ["curso", "assistir", "atividade"].includes(this.currentView));
        return `
          <a href="#/professor/${item.route}" class="sidebar-item ${isActive ? "active" : ""}">
            ${item.icon}
            <span>${item.label}</span>
          </a>
        `;
      }).join("");
    } else if (this.session.role === "admin") {
      brandName = "ADMIN MASTER";
      const items = [
        { route: "dashboard", label: "Dashboard", icon: Icons.dashboard },
        { route: "escolas", label: "Escolas", icon: Icons.escola },
        { route: "cursos", label: "Cursos Globais", icon: Icons.materiais },
        { route: "alunos", label: "Alunos Global", icon: Icons.alunos },
        { route: "financeiro", label: "Financeiro", icon: Icons.financeiro },
        { route: "planos", label: "Planos", icon: Icons.planos },
        { route: "configuracoes", label: "Configurações", icon: Icons.configuracoes }
      ];
      sidebarItemsHTML = items.map(item => `
        <a href="#/admin/${item.route}" class="sidebar-item ${this.currentView === item.route ? "active" : ""}">
          ${item.icon}
          <span>${item.label}</span>
        </a>
      `).join("");
    }

    // Estrutura Base Layout
    root.innerHTML = `
      <div class="portal-container">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo-container">
              <div class="sidebar-logo" style="filter: brightness(0) saturate(100%) invert(29%) sepia(91%) saturate(1500%) hue-rotate(210deg) brightness(95%);">
                ${brandLogo}
              </div>
            </div>
          </div>
          
          <nav class="sidebar-nav">
            ${sidebarItemsHTML}
          </nav>
          
          <!-- Dica do Camaleão no rodapé da navegação -->
          <div class="sidebar-chameleon-footer">
            <img src="assets/images/camaleao-uniforme.png" alt="Camaleão">
            <div class="sidebar-chameleon-footer-text">
              <strong>Dica do Camaleão</strong>
              Pratique conversação diária para acelerar a fluência!
            </div>
          </div>

          <div class="sidebar-footer">
            <div class="sidebar-user">
              <img src="${this.session.userPic}" alt="Foto Perfil">
              <div class="sidebar-user-info">
                <div class="sidebar-user-name">${this.session.userName}</div>
                <div class="sidebar-user-role">${this.session.role === "escola" ? "Coordenador" : this.session.role === "aluno" ? "Aluno" : (this.session.role === "professor" ? "Professor" : "Super Admin")}</div>
              </div>
            </div>
            <div class="logout-btn" id="sidebar-logout-action">
              ${Icons.logOut}
              <span>Sair da conta</span>
            </div>
          </div>
        </aside>

        <!-- Header + Conteúdo Principal -->
        <div class="portal-main-wrapper">
          <header class="header">
            <div class="header-title-container">
              <h2>${this.getViewTitle()}</h2>
              <p>${this.getViewSubtitle()}</p>
            </div>
            
            <div class="header-actions">
              <!-- Botão Simulação rápida de portais -->
              <div style="display: flex; gap: 0.5rem; background: #E5E7EB; padding: 0.25rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-right: 1.5rem;">
                <a href="#/auth/escola" style="color: #374151; padding: 0.2rem 0.6rem; border-radius: 15px; text-decoration: none; background: ${this.session.role === 'escola' ? '#FFF' : 'transparent'}; box-shadow: ${this.session.role === 'escola' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">Escola</a>
                <a href="#/auth/professor" style="color: #374151; padding: 0.2rem 0.6rem; border-radius: 15px; text-decoration: none; background: ${this.session.role === 'professor' ? '#FFF' : 'transparent'}; box-shadow: ${this.session.role === 'professor' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">Professor</a>
                <a href="#/auth/aluno" style="color: #374151; padding: 0.2rem 0.6rem; border-radius: 15px; text-decoration: none; background: ${this.session.role === 'aluno' ? '#FFF' : 'transparent'}; box-shadow: ${this.session.role === 'aluno' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">Aluno</a>
                <a href="#/auth/admin" style="color: #374151; padding: 0.2rem 0.6rem; border-radius: 15px; text-decoration: none; background: ${this.session.role === 'admin' ? '#FFF' : 'transparent'}; box-shadow: ${this.session.role === 'admin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};">Admin</a>
              </div>

              <button class="header-action-btn" aria-label="Notificações" onclick="app.showNotifications()">${Icons.bell}</button>
              <div class="header-user-profile">
                <img src="${this.session.userPic}" alt="Foto">
                <span>${this.session.userName.split(" ")[0]}</span>
              </div>
            </div>
          </header>
          
          <main class="main-content" id="portal-main-view">
            <!-- Injeção da Sub-View Específica -->
          </main>
        </div>
      </div>
      
      <!-- Div do Modal de Ação Geral (Cadastro rápido, etc) -->
      <div id="action-modal-root"></div>
    `;

    document.getElementById("sidebar-logout-action").addEventListener("click", () => this.logout());

    // Renderiza a página interna correspondente
    this.renderInternalView();
  }

  // Retorna título de página no header
  getViewTitle() {
    const titles = {
      escola: {
        dashboard: "Painel de Controle",
        cursos: "Gestão de Cursos & Módulos",
        curso: "Organizador de Módulos & Conteúdo",
        assistir: "Assistir Videoaula (Prévia do Professor)",
        alunos: "Gestão de Alunos",
        professores: "Corpo Docente",
        turmas: "Turmas Ativas",
        calendario: "Calendário Acadêmico",
        aulas: "Cronograma de Aulas",
        financeiro: "Fluxo Financeiro",
        comunicacao: "Central de Mensagens",
        configuracoes: "Ajustes da Escola"
      },
      aluno: {
        home: "Olá, " + this.session.userName.split(" ")[0] + '! <span class="wave-hand">👋</span>',
        cursos: "Meus Cursos de Idiomas",
        curso: "Módulos & Aulas do Curso",
        assistir: "Ambiente de Aprendizagem",
        atividade: "Atividade Avaliativa & Exercício",
        turmas: "Minhas Turmas & Níveis",
        aulas: "Minhas Aulas",
        calendario: "Meu Calendário",
        materiais: "Materiais Didáticos",
        tarefas: "Tarefas Acadêmicas",
        mensagens: "Suporte & Chat",
        financeiro: "Minhas Mensalidades",
        perfil: "Meu Perfil de Aluno"
      },
      professor: {
        dashboard: "Painel do Docente",
        cursos: "Meus Cursos",
        curso: "Organizador de Módulos & Conteúdo",
        assistir: "Assistir Videoaula",
        atividade: "Visualização da Atividade",
        alunos: "Meus Alunos",
        aulas: "Minhas Aulas",
        atividades: "Atividades & Exercícios",
        materiais: "Materiais de Apoio",
        mensagens: "Comunicação & Mensagens",
        perfil: "Meu Perfil Docente"
      },
      admin: {
        dashboard: "Console Executivo",
        escolas: "Escolas Parceiras",
        alunos: "Base Global de Alunos",
        financeiro: "Métricas de MRR & Faturamento",
        planos: "Modelos de Planos",
        configuracoes: "Configurações Globais do SaaS"
      }
    };
    return titles[this.session.role]?.[this.currentView] || "Visão Geral";
  }

  getViewSubtitle() {
    const subs = {
      escola: {
        dashboard: "Acompanhe os principais indicadores de desempenho da sua escola.",
        cursos: "Crie cursos, estruture módulos e gerencie videoaulas e exercícios.",
        curso: "Organize a sequência de aulas e atividades, anexe materiais e configure avaliações.",
        assistir: "Visualize a reprodução da videoaula com materiais e navegação inferior.",
        alunos: "Cadastre, monitore e gerencie o histórico de todos os alunos.",
        professores: "Controle a disponibilidade e turmas dos professores.",
        turmas: "Monitore horários, salas e progresso das turmas.",
        calendario: "Gerencie aulas programadas, feriados e eventos especiais.",
        aulas: "Veja o andamento das aulas ao vivo, agendadas e gravadas.",
        materiais: "Organize materiais de apoio em módulos sequenciais.",
        financeiro: "Acompanhe faturamento, inadimplência e conciliação bancária.",
        comunicacao: "Envie comunicados gerais e converse diretamente com alunos.",
        configuracoes: "Configure sua marca, logo, cores de identidade e domínio."
      },
      aluno: {
        home: "Que bom ver você novamente! Vamos continuar estudando?",
        cursos: "Acesse seus cursos, explore os módulos e avance nas aulas gravadas e atividades.",
        curso: "Acesse as videoaulas, materiais didáticos consolidados e resolva os exercícios do módulo.",
        assistir: "Assista sua videoaula interativa, acerte o ritmo e baixe os materiais de apoio.",
        atividade: "Leia o enunciado com atenção, confira os critérios de nota e envie seu arquivo PDF.",
        turmas: "Acesse suas turmas por nível de proficiência (A1, A2, B1, B2, C1), horários e salas interativas.",
        aulas: "Acesse suas salas de aula ao vivo e veja as próximas aulas agendadas.",
        calendario: "Confira seus horários de aula, avaliações e atividades.",
        materiais: "Acesse PDFs, gravações, áudios e arquivos recomendados.",
        tarefas: "Entregue seus exercícios e confira o feedback do professor.",
        mensagens: "Converse com seus professores ou com a coordenação pedagógica.",
        financeiro: "Consulte seu histórico de mensalidades e efetue pagamentos.",
        perfil: "Gerencie seus dados pessoais, senha e preferências de idioma."
      },
      professor: {
        dashboard: "Acompanhe alunos, entre na sala ao vivo e mantenha cursos sempre atualizados.",
        cursos: "Crie cursos simples com módulos, aulas, atividades e materiais de apoio.",
        curso: "Organize a sequência de aulas e atividades com setas, anexe materiais e configure avaliações.",
        assistir: "Player de videoaula com timer e materiais anexos.",
        atividade: "Instruções, critérios de avaliação e entregas dos alunos.",
        alunos: "Monitore o progresso e o engajamento dos seus alunos.",
        aulas: "Acompanhe suas aulas ao vivo e videoaulas gravadas.",
        atividades: "Publique tarefas, critérios e recolha PDFs de resolução.",
        materiais: "Acesse e compartilhe arquivos didáticos em PDF, áudio e vídeo.",
        mensagens: "Tire dúvidas e interaja diretamente com seus alunos.",
        perfil: "Suas informações profissionais e disponibilidade."
      },
      admin: {
        dashboard: "Faturamento global, novas adesões e saúde do ecossistema SaaS.",
        escolas: "Gerencie as contas ativas das escolas licenciadas no SaaS.",
        alunos: "Consulte a distribuição de alunos em todas as escolas.",
        financeiro: "Fluxo de receita recorrente mensal e histórico de recebíveis.",
        planos: "Configure preços e recursos das licenças Starter, Pro, Business e Enterprise.",
        configuracoes: "Gerencie a infraestrutura LiveKit, provedores SMTP, split financeiro e segurança global."
      }
    };
    return subs[this.session.role]?.[this.currentView] || "Painel Principal Change Skills Idiomas";
  }

  // --- RENDERIZADOR INTERNO DE SUB-VIEWS ---
  renderInternalView() {
    const main = document.getElementById("portal-main-view");
    const view = this.currentView;
    const role = this.session.role;
    const schoolId = this.session.schoolId;

    if (role === "escola") {
      this.renderSchoolViews(view, schoolId, main);
    } else if (role === "aluno") {
      this.renderStudentViews(view, schoolId, main);
    } else if (role === "professor") {
      this.renderTeacherViews(view, schoolId, main);
    } else if (role === "admin") {
      this.renderAdminViews(view, main);
    }
  }

  // ROTEAMENTO ESCOLA
  renderSchoolViews(view, schoolId, container) {
    if (view === "cursos") {
      this.renderSchoolCoursesList(schoolId, container);
      return;
    }
    if (view === "curso") {
      const courseId = this.routeParams?.[0] || (PratikaDB.getCourses(schoolId)[0]?.id || "curso-1");
      this.renderTeacherCourseManager(courseId, container);
      return;
    }
    if (view === "assistir") {
      const courseId = this.routeParams?.[0] || "curso-1";
      const moduleId = this.routeParams?.[1] || "mod-1";
      const itemId = this.routeParams?.[2] || "item-1-1";
      this.renderLessonWatchScreen(courseId, moduleId, itemId, container);
      return;
    }
    if (view === "dashboard") {
      const activeStudents = PratikaDB.getStudents(schoolId).length;
      const totalTeachers = PratikaDB.getTeachers(schoolId).length;
      const activeClasses = PratikaDB.getClasses(schoolId).length;
      const school = PratikaDB.getSchool(schoolId);
      
      container.innerHTML = `
        <div class="dashboard-welcome-banner">
          <div class="dashboard-welcome-content">
            <div class="dashboard-welcome-tag">
              <span>🦎 White Label Master</span> • Change Skills Idiomas
            </div>
            <h2>Bem-vindo ao Painel de Gestão da Escola!</h2>
            <p>Aprenda idiomas. Transforme o mundo. Monitore alunos ativos, turmas, faturamento e personalize a plataforma com a identidade da sua escola.</p>
            <div class="dashboard-welcome-actions">
              <a href="#/escola/alunos" class="btn btn-primary" style="font-weight: 700; background: #246BFD; border-color: #246BFD;">
                ${Icons.alunos} Gerenciar Alunos
              </a>
              <a href="#/escola/configuracoes" class="btn btn-outline" style="border-color: rgba(255,255,255,0.4); color: white;">
                ${Icons.configuracoes} Identidade & White Label
              </a>
            </div>
          </div>
          <div class="dashboard-welcome-mascot-wrap">
            <img src="assets/images/camaleao-uniforme.png" alt="Camaleão Change Skills" class="dashboard-welcome-mascot-img">
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Alunos Ativos</span>
              <div class="kpi-card-icon">${Icons.alunos}</div>
            </div>
            <div class="kpi-card-value">${activeStudents}</div>
            <div class="kpi-card-trend up">↑ 12% este mês</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Professores Cadastrados</span>
              <div class="kpi-card-icon">${Icons.professores}</div>
            </div>
            <div class="kpi-card-value">${totalTeachers}</div>
            <div class="kpi-card-trend">Estável</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Turmas em Andamento</span>
              <div class="kpi-card-icon">${Icons.turmas}</div>
            </div>
            <div class="kpi-card-value">${activeClasses}</div>
            <div class="kpi-card-trend up">↑ 1 nova turma</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Receita do Mês</span>
              <div class="kpi-card-icon">${Icons.financeiro}</div>
            </div>
            <div class="kpi-card-value">R$ ${school.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend up">↑ 18% vs mês anterior</div>
          </div>
        </div>

        <div class="dash-row full" style="margin-bottom: 1.5rem;">
          <div class="panel-card">
            <div class="panel-card-header">
              <div class="panel-card-title">Próximas Aulas de Hoje</div>
              <a href="#/escola/aulas" class="btn btn-outline btn-sm">Ver todas</a>
            </div>
            <div class="table-container">
              <table class="premium-table">
                <thead>
                  <tr>
                    <th>Aula / Curso</th>
                    <th>Professor</th>
                    <th>Horário</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  ${PratikaDB.getLessons(schoolId).map(l => `
                    <tr>
                      <td style="font-weight: 600;">${l.title}</td>
                      <td>${l.teacherName}</td>
                      <td>${l.time}</td>
                      <td>
                        <span class="badge ${l.status === 'Ao Vivo' ? 'danger' : 'pending'}">${l.status}</span>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-dash-l-${l.id}', this)" title="Ações da aula">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-dash-l-${l.id}">
                            ${l.status === 'Ao Vivo' ? `
                              <a href="#/livekit/${l.id}" class="dropdown-item" style="color: #4F46E5; font-weight: 700;">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                <span>Entrar na Sala LiveKit</span>
                              </a>
                            ` : `
                              <button class="dropdown-item" onclick="app.showToast('Esta aula iniciará no horário previsto.', 'info')">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span>Ver Horários</span>
                              </button>
                            `}
                            <button class="dropdown-item" onclick="app.showLessonMaterialModal('mat-1')">
                              ${Icons.download}
                              <span>Material da Aula</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="dash-row full">
          <div class="panel-card">
            <div class="panel-card-header">
              <div class="panel-card-title">Avisos e Lembretes da Escola</div>
              <button class="btn btn-secondary btn-sm" id="btn-novo-aviso">${Icons.plus} Novo</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
              <div style="padding: 1rem 1.25rem; border-radius: var(--border-radius-md); border-left: 4px solid var(--error-color); background-color: rgba(239, 68, 68, 0.03); border-top: 1px solid rgba(239, 68, 68, 0.1); border-right: 1px solid rgba(239, 68, 68, 0.1); border-bottom: 1px solid rgba(239, 68, 68, 0.1); display: flex; flex-direction: column; gap: 0.35rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 0.9rem;">
                  <span>Mensalidades em atraso</span>
                  <span class="badge danger">Crítico</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">Existem 3 mensalidades vencidas. Lembretes automáticos por e-mail e WhatsApp foram disparados.</p>
              </div>
              <div style="padding: 1rem 1.25rem; border-radius: var(--border-radius-md); border-left: 4px solid var(--primary-color); background-color: rgba(108, 92, 231, 0.03); border-top: 1px solid rgba(108, 92, 231, 0.1); border-right: 1px solid rgba(108, 92, 231, 0.1); border-bottom: 1px solid rgba(108, 92, 231, 0.1); display: flex; flex-direction: column; gap: 0.35rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 0.9rem;">
                  <span>Reunião pedagógica</span>
                  <span class="badge active">Hoje 18:00</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">Reunião com todo o corpo docente para alinhamento pedagógico do módulo 4 e novas turmas.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    else if (view === "alunos") {
      const students = PratikaDB.getStudents(schoolId);
      container.innerHTML = `
        <div class="actions-row">
          <div class="search-input-wrapper">
            ${Icons.search}
            <input type="text" placeholder="Buscar alunos por nome ou e-mail..." class="form-control" onkeyup="app.filterTableRows(this.value, 'alunos-table')">
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-outline" id="btn-transferir-aluno" onclick="app.showTransferStudentModal()">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              Transferir Aluno
            </button>
            <button class="btn btn-primary" id="btn-novo-aluno">${Icons.plus} Cadastrar Aluno</button>
          </div>
        </div>

        <div class="panel-card">
          <div class="table-container">
            <table class="premium-table" id="alunos-table">
              <thead>
                <tr>
                  <th>Nome do Aluno</th>
                  <th>Curso Ativo</th>
                  <th>Professor</th>
                  <th>Status</th>
                  <th>Último Acesso</th>
                  <th style="text-align: right;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => {
                  const teacher = PratikaDB.getTeachers(schoolId).find(t => t.id === s.teacherId)?.name || "Não atribuído";
                  return `
                    <tr>
                      <td class="avatar-cell">
                        <img src="${s.profilePic}" alt="Foto">
                        <div>
                          <div class="avatar-cell-name">${s.name}</div>
                          <div class="avatar-cell-email">${s.email}</div>
                        </div>
                      </td>
                      <td style="font-weight: 600;">${s.course}</td>
                      <td>${teacher}</td>
                      <td><span class="badge ${s.status === 'Ativo' ? 'active' : 'inactive'}">${s.status}</span></td>
                      <td>${s.lastAccess}</td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-aluno-${s.id}', this)" title="Ações do aluno">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-aluno-${s.id}">
                            <button class="dropdown-item" onclick="app.showStudentProfileModal('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                              <span>Visualizar Dossiê</span>
                            </button>
                            <button class="dropdown-item" onclick="app.showTransferStudentModal('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                              <span>Transferir Turma</span>
                            </button>
                            <button class="dropdown-item" onclick="app.showEnrollmentDeclarationModal('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                              <span>Declaração de Matrícula</span>
                            </button>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-item" onclick="app.openChatWithUser('aluno', '${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                              <span>Conversar no Chat</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
      
      document.getElementById("btn-novo-aluno").addEventListener("click", () => this.showAddStudentModal());
    }

    else if (view === "professores") {
      const teachers = PratikaDB.getTeachers(schoolId);
      container.innerHTML = `
        <div class="actions-row">
          <div class="search-input-wrapper">
            ${Icons.search}
            <input type="text" placeholder="Buscar professores por nome ou especialidade..." class="form-control" onkeyup="app.filterTableRows(this.value, 'teachers-table')">
          </div>
          <button class="btn btn-primary" id="btn-novo-professor">${Icons.plus} Novo Professor</button>
        </div>

        <div class="panel-card">
          <div class="table-container">
            <table class="premium-table" id="teachers-table">
              <thead>
                <tr>
                  <th>Nome do Docente</th>
                  <th>Especialidade</th>
                  <th>Disponibilidade</th>
                  <th>Turmas Atribuídas</th>
                  <th>Status</th>
                  <th style="text-align: right;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${teachers.map(t => {
                  const managedCount = PratikaDB.getClasses(schoolId).filter(c => c.teacher === t.name).length || 1;
                  return `
                    <tr>
                      <td class="avatar-cell">
                        <img src="${t.photo}" alt="${t.name}">
                        <div>
                          <div class="avatar-cell-name">${t.name}</div>
                          <div class="avatar-cell-email">${t.email}</div>
                        </div>
                      </td>
                      <td style="font-weight: 600;">${t.specialty}</td>
                      <td>${t.availability}</td>
                      <td><strong>${managedCount} turma${managedCount > 1 ? 's' : ''}</strong></td>
                      <td>
                        <span class="badge ${t.status === 'Online' ? 'active' : t.status === 'Em Aula' ? 'danger' : 'inactive'}">${t.status}</span>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-prof-${t.id}', this)" title="Ações do professor">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-prof-${t.id}">
                            <button class="dropdown-item" onclick="app.openChatWithUser('professor', '${t.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                              <span>Iniciar Chat</span>
                            </button>
                            <button class="dropdown-item" onclick="app.showTeacherProfileModal('${t.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                              <span>Ver Perfil Docente</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
      document.getElementById("btn-novo-professor").addEventListener("click", () => this.showAddTeacherModal());
    }

    else if (view === "turmas") {
      const classes = PratikaDB.getClasses(schoolId);
      const teachers = PratikaDB.getTeachers(schoolId);
      const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 12), 0);
      const activeFilter = this.turmasFilter || "todas";

      let filteredClasses = classes;
      if (activeFilter === "basico") {
        filteredClasses = classes.filter(c => (c.level || c.name || "").includes("A1") || (c.level || c.name || "").includes("A2") || (c.name || "").includes("Básico"));
      } else if (activeFilter === "intermediario") {
        filteredClasses = classes.filter(c => (c.level || c.name || "").includes("B1") || (c.level || c.name || "").includes("B2") || (c.name || "").includes("Intermediário"));
      } else if (activeFilter === "avancado") {
        filteredClasses = classes.filter(c => (c.level || c.name || "").includes("C1") || (c.level || c.name || "").includes("C2") || (c.name || "").includes("Avançado") || (c.name || "").includes("Business"));
      }

      container.innerHTML = `
        <!-- KPI Banner de Turmas -->
        <div class="kpi-grid grid-2x2" style="margin-bottom: 1.5rem;">
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Turmas Ativas</span><div class="kpi-card-icon">${Icons.turmas}</div></div>
            <div class="kpi-card-value" style="color: var(--primary-color);">${classes.length}</div>
            <div class="kpi-card-trend up">Grade 100% ativa</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Alunos Alocados</span><div class="kpi-card-icon">${Icons.alunos}</div></div>
            <div class="kpi-card-value" style="color: var(--success-color);">${totalStudents}</div>
            <div class="kpi-card-trend up">Matrículas ativas</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Salas LiveKit</span><div class="kpi-card-icon">${Icons.aulas}</div></div>
            <div class="kpi-card-value" style="color: #0EA5E9;">3 simultâneas</div>
            <div class="kpi-card-trend">Transmissão HD</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Ocupação Média</span><div class="kpi-card-icon">${Icons.dashboard}</div></div>
            <div class="kpi-card-value" style="color: #6C5CE7;">78%</div>
            <div class="kpi-card-trend up">Alta eficiência</div>
          </div>
        </div>

        <!-- Filtros e Barra de Ações -->
        <div class="actions-row" style="flex-wrap: wrap; gap: 0.75rem; justify-content: space-between; margin-bottom: 1.5rem;">
          <div class="tabs" style="border-bottom: none; margin-bottom: 0; gap: 0.5rem;">
            <button class="tab-btn ${activeFilter === 'todas' ? 'active' : ''}" onclick="app.setTurmasFilter('todas')">Todas as Turmas (${classes.length})</button>
            <button class="tab-btn ${activeFilter === 'basico' ? 'active' : ''}" onclick="app.setTurmasFilter('basico')">Básico (A1/A2)</button>
            <button class="tab-btn ${activeFilter === 'intermediario' ? 'active' : ''}" onclick="app.setTurmasFilter('intermediario')">Intermediário (B1/B2)</button>
            <button class="tab-btn ${activeFilter === 'avancado' ? 'active' : ''}" onclick="app.setTurmasFilter('avancado')">Avançado & Business</button>
          </div>
          
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-shrink: 0;">
            <div class="search-input-wrapper" style="max-width: 260px;">
              ${Icons.search}
              <input type="text" placeholder="Buscar turmas por nível ou sala..." class="form-control" onkeyup="app.filterClassCards(this.value)">
            </div>
            <button class="btn btn-primary" id="btn-nova-turma" style="white-space: nowrap; flex-shrink: 0;" onclick="app.showAddClassModal()">
              ${Icons.plus} Nova Turma
            </button>
          </div>
        </div>

        <!-- Grid de Cards de Turmas (3 Colunas) -->
        <div class="cards-grid turmas-grid" id="turmas-cards-grid">
          ${filteredClasses.map(c => {
            const teacher = teachers.find(t => t.id === c.teacherId) || teachers.find(t => t.name === c.teacher) || teachers[0] || { name: "Prof. Lucas Martins", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" };
            const level = c.level || (c.name.includes("Básico") ? "A1" : c.name.includes("Intermediário") ? "B1" : c.name.includes("Avançada") ? "C1" : "B2");
            const courseColor = level.startsWith("A") ? "#22C55E" : level.startsWith("B") ? "#0EA5E9" : "#6C5CE7";
            const studentCount = c.studentCount || 12;
            const maxCapacity = 20;
            const occupancyPct = Math.round((studentCount / maxCapacity) * 100);

            return `
              <div class="card-item class-card-item" style="border-top: 4px solid ${courseColor}; transition: all 0.2s ease;">
                <div class="card-item-header" style="align-items: flex-start;">
                  <div>
                    <div class="card-item-title" style="font-size: 1.05rem; font-weight: 800; color: #0F172A;">${c.name}</div>
                    <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.15rem; display: block;">${c.room || 'Sala Virtual 01'}</span>
                  </div>
                  <span class="badge" style="background: ${courseColor}18; color: ${courseColor}; font-weight: 800; font-size: 0.75rem;">
                    ${level} • Ativa
                  </span>
                </div>

                <div class="card-item-details" style="gap: 0.75rem; margin: 1rem 0;">
                  <div class="card-item-detail-row" style="align-items: center;">
                    <div style="width: 26px; height: 26px; border-radius: 50%; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700;">
                      ${teacher.name.charAt(0)}
                    </div>
                    <span>Docente: <strong style="color: #0F172A;">${teacher.name}</strong></span>
                  </div>

                  <div class="card-item-detail-row">
                    ${Icons.calendario}
                    <span><strong>${c.days || "Seg e Qua"}</strong> • ${c.hours || "19:00 - 20:00"}</span>
                  </div>

                  <div style="margin-top: 0.35rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.3rem;">
                      <span style="color: var(--text-secondary);">${studentCount} de ${maxCapacity} alunos</span>
                      <span style="color: ${courseColor};">${occupancyPct}% ocupada</span>
                    </div>
                    <div class="progress-track" style="height: 6px;">
                      <div class="progress-fill" style="width: ${occupancyPct}%; background-color: ${courseColor};"></div>
                    </div>
                  </div>
                </div>

                <div class="card-item-footer" style="display: flex; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
                  <a href="#/livekit/${c.id}" class="btn btn-primary btn-sm" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.3rem;">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    Sala LiveKit
                  </a>
                  <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="app.showClassManagementModal('${c.id}')">
                    Gerenciar
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    else if (view === "calendario") {
      this.renderFullCalendar(schoolId, false, container);
    }

    else if (view === "aulas") {
      const lessons = PratikaDB.getLessons(schoolId);
      container.innerHTML = `
        <div class="actions-row">
          <div class="search-input-wrapper">
            ${Icons.search}
            <input type="text" placeholder="••••••••••••" class="form-control">
          </div>
          <button class="btn btn-primary" id="btn-agendar-aula">${Icons.plus} Agendar Aula</button>
        </div>

        <div class="panel-card">
          <div class="table-container">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>Título da Aula</th>
                  <th>Professor</th>
                  <th>Data e Horário</th>
                  <th>Status</th>
                  <th style="text-align: right;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${lessons.map(l => `
                  <tr>
                    <td style="font-weight: 600; font-size: 0.95rem;">${l.title}</td>
                    <td>${l.teacherName}</td>
                    <td>${l.time}</td>
                    <td>
                      <span class="badge ${l.status === 'Ao Vivo' ? 'danger' : 'pending'}">${l.status}</span>
                    </td>
                    <td style="text-align: right; white-space: nowrap;">
                      <div class="action-dropdown" style="display: inline-block;">
                        <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-aula-${l.id}', this)" title="Ações da aula">
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                        </button>
                        <div class="action-dropdown-menu" id="menu-aula-${l.id}">
                          ${l.status === 'Ao Vivo' ? `
                            <a href="#/livekit/${l.id}" class="dropdown-item" style="color: #4F46E5; font-weight: 700;">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                              <span>Entrar na Sala LiveKit</span>
                            </a>
                          ` : `
                            <button class="dropdown-item" onclick="app.showToast('Esta aula iniciará no horário previsto.', 'info')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                              <span>Ver Detalhes da Grade</span>
                            </button>
                          `}
                          <button class="dropdown-item" onclick="app.showLessonMaterialModal('mat-1')">
                            ${Icons.download}
                            <span>Material da Aula</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
      document.getElementById("btn-agendar-aula").addEventListener("click", () => this.showAddEventModal());
    }

    else if (view === "financeiro") {
      const records = PratikaDB.getFinancial(schoolId);
      const openVal = records.filter(r => r.status === "Em aberto").reduce((acc, c) => acc + c.value, 0);
      const paidVal = records.filter(r => r.status === "Pago").reduce((acc, c) => acc + c.value, 0);
      const overdueVal = records.filter(r => r.status === "Atrasado").reduce((acc, c) => acc + c.value, 0);

      container.innerHTML = `
        <div class="kpi-grid">
          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Mensalidades Recebidas</span>
              <div class="kpi-card-icon" style="color: #10B981; background: #ECFDF5; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
            <div class="kpi-card-value" style="color: #0F172A; font-size: 1.75rem; font-weight: 800; font-family: var(--font-title);">R$ ${paidVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend up" style="color: #10B981; background: #ECFDF5; padding: 0.2rem 0.6rem; border-radius: 6px; display: inline-flex; width: fit-content; margin-top: 0.35rem; font-weight: 700;">
              ✓ Cobranças liquidadas
            </div>
          </div>

          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">A Receber (Em aberto)</span>
              <div class="kpi-card-icon" style="color: #4F46E5; background: #EEF2FF; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
            </div>
            <div class="kpi-card-value" style="color: #0F172A; font-size: 1.75rem; font-weight: 800; font-family: var(--font-title);">R$ ${openVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend" style="color: #4F46E5; background: #EEF2FF; padding: 0.2rem 0.6rem; border-radius: 6px; display: inline-flex; width: fit-content; margin-top: 0.35rem; font-weight: 700;">
              Vencimentos próximos
            </div>
          </div>

          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Em Atraso (Inadimplência)</span>
              <div class="kpi-card-icon" style="color: #EF4444; background: #FEF2F2; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
            </div>
            <div class="kpi-card-value" style="color: #0F172A; font-size: 1.75rem; font-weight: 800; font-family: var(--font-title);">R$ ${overdueVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend down" style="color: #EF4444; background: #FEF2F2; padding: 0.2rem 0.6rem; border-radius: 6px; display: inline-flex; width: fit-content; margin-top: 0.35rem; font-weight: 700;">
              Ações de cobrança ativas
            </div>
          </div>
        </div>

        <!-- GRÁFICO DE ORIGEM DA RECEITA -->
        <div class="panel-card" style="margin-bottom: 1.5rem;">
          <div class="panel-card-header">
            <div>
              <div class="panel-card-title">Origem da Receita da Escola (Detalhamento)</div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">Veja de onde vem o faturamento total da sua escola por categoria:</p>
            </div>
            <span class="badge active" style="font-size: 0.775rem;">Faturamento Total: R$ 24.680,00</span>
          </div>

          <div style="display: flex; align-items: center; gap: 2.5rem; flex-wrap: wrap; padding: 0.75rem 0;">
            <!-- Donut Chart Segmented (Soft Palette) -->
            <div class="donut-chart-container" style="background: conic-gradient(#4F46E5 0% 65%, #0284C7 65% 81%, #10B981 81% 93%, #D97706 93% 100%);">
              <div class="donut-chart-inner">
                <span style="font-size: 0.7rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Total</span>
                <span style="font-family: var(--font-title); font-size: 1.2rem; font-weight: 800; color: #0F172A;">R$ 24.6k</span>
                <span style="font-size: 0.65rem; color: #10B981; font-weight: 700;">100% Ativo</span>
              </div>
            </div>

            <!-- Legend Grid with breakdown bars -->
            <div class="revenue-legend-grid" style="flex: 1; min-width: 280px;">
              <div class="revenue-legend-item">
                <div class="revenue-legend-color" style="background-color: #4F46E5;"></div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem;">
                    <span style="color: #1E293B;">Mensalidades dos Cursos</span>
                    <span style="color: #4F46E5; font-weight: 800;">65%</span>
                  </div>
                  <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.15rem;">R$ 16.042,00 (Alunos matriculados)</div>
                  <div class="progress-track" style="height: 6px; margin-top: 0.4rem; background: #F1F5F9;"><div class="progress-fill" style="width: 65%; background-color: #4F46E5;"></div></div>
                </div>
              </div>

              <div class="revenue-legend-item">
                <div class="revenue-legend-color" style="background-color: #0284C7;"></div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem;">
                    <span style="color: #1E293B;">Material Didático & Livros</span>
                    <span style="color: #0284C7; font-weight: 800;">16%</span>
                  </div>
                  <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.15rem;">R$ 3.948,80 (Apostilas e e-books)</div>
                  <div class="progress-track" style="height: 6px; margin-top: 0.4rem; background: #F1F5F9;"><div class="progress-fill" style="width: 16%; background-color: #0284C7;"></div></div>
                </div>
              </div>

              <div class="revenue-legend-item">
                <div class="revenue-legend-color" style="background-color: #10B981;"></div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem;">
                    <span style="color: #1E293B;">Taxas de Matrícula & Nivelamento</span>
                    <span style="color: #10B981; font-weight: 800;">12%</span>
                  </div>
                  <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.15rem;">R$ 2.961,60 (Novos ingressantes)</div>
                  <div class="progress-track" style="height: 6px; margin-top: 0.4rem; background: #F1F5F9;"><div class="progress-fill" style="width: 12%; background-color: #10B981;"></div></div>
                </div>
              </div>

              <div class="revenue-legend-item">
                <div class="revenue-legend-color" style="background-color: #D97706;"></div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem;">
                    <span style="color: #1E293B;">Certificados & Exames TOEFL/IELTS</span>
                    <span style="color: #D97706; font-weight: 800;">7%</span>
                  </div>
                  <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.15rem;">R$ 1.727,60 (Testes e diplomas)</div>
                  <div class="progress-track" style="height: 6px; margin-top: 0.4rem; background: #F1F5F9;"><div class="progress-fill" style="width: 7%; background-color: #D97706;"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-card-header" style="flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div class="panel-card-title">Histórico de Cobranças dos Alunos</div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">Gerencie mensalidades, recibos oficiais e links de pagamento com cobrança instantânea.</p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button class="btn btn-primary btn-sm" onclick="app.showCreateChargeModal()">
                ${Icons.plus} Nova Cobrança
              </button>
            </div>
          </div>
          
          <div class="table-container">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>ALUNO</th>
                  <th>PLANO ACADÊMICO</th>
                  <th>VENCIMENTO</th>
                  <th>VALOR</th>
                  <th>STATUS</th>
                  <th style="text-align: right;">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(r => {
                  const isPaid = r.status === 'Pago';
                  const isOverdue = r.status === 'Atrasado';
                  return `
                    <tr>
                      <td style="font-weight: 700; color: var(--text-primary);">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                          <div style="width: 28px; height: 28px; border-radius: 50%; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">
                            ${r.studentName ? r.studentName.charAt(0) : 'A'}
                          </div>
                          <span>${r.studentName}</span>
                        </div>
                      </td>
                      <td>${r.plan || 'Inglês Pro'}</td>
                      <td>${r.dueDate}</td>
                      <td style="font-weight: 700; color: #0F172A;">
                        R$ ${r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span class="badge ${isPaid ? 'active' : isOverdue ? 'danger' : 'pending'}">${r.status}</span>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-fin-${r.id}', this)" title="Ações da cobrança">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-fin-${r.id}">
                            ${isPaid ? `
                              <button class="dropdown-item" onclick="app.showReceiptModal('${r.id}')">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                <span>Visualizar Recibo</span>
                              </button>
                              <button class="dropdown-item" onclick="app.copyPaymentLink('${r.id}', '${r.studentName}', ${r.value}, '${r.status}')">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                <span>Copiar Link do Recibo</span>
                              </button>
                            ` : `
                              <button class="dropdown-item" onclick="app.copyPaymentLink('${r.id}', '${r.studentName}', ${r.value}, '${r.status}')">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                <span>Copiar Link & PIX</span>
                              </button>
                              <button class="dropdown-item" onclick="app.sendWhatsAppBilling('${r.id}', '${r.studentName}', ${r.value}, '${r.dueDate}')">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                <span>Cobrança WhatsApp</span>
                              </button>
                              <div class="dropdown-divider"></div>
                              <button class="dropdown-item" onclick="app.markAsPaidBySchool('${r.id}')">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Dar Baixa (Manual)</span>
                              </button>
                            `}
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    else if (view === "comunicacao") {
      this.renderChatInterface(schoolId, false, container);
    }

    else if (view === "configuracoes") {
      this.renderSchoolSettings(schoolId, this.settingsActiveTab || 'branding', container);
    }
  }

  switchSettingsTab(tabId) {
    this.settingsActiveTab = tabId;
    const container = document.getElementById("portal-main-view");
    if (container) {
      this.renderSchoolSettings(this.session.schoolId, tabId, container);
    }
  }

  // --- CONFIGURAÇÕES DA ESCOLA (EXECUTIVE SETTINGS) ---
  renderSchoolSettings(schoolId, activeTab = 'branding', container) {
    this.settingsActiveTab = activeTab;
    const school = PratikaDB.getSchool(schoolId) || {};
    const schoolName = school.name || "Minha Escola de Idiomas";
    const schoolDomain = school.domain || "portal.changeskills.com.br";
    const primaryColor = school.primaryColor || "#246BFD";
    const secondaryColor = school.secondaryColor || "#031735";
    const slogan = school.slogan || "Aprenda idiomas. Transforme o mundo.";
    const customDomain = school.customDomain || "portal.minhaescola.com.br";
    const smtpSender = school.smtpSender || `Secretaria ${schoolName}`;
    const smtpEmail = school.smtpEmail || `contato@${schoolDomain}`;
    const smtpHost = school.smtpHost || "smtp.sendgrid.net";
    const smtpPort = school.smtpPort || "587";
    const pixKey = school.pixKey || "12.345.678/0001-90";
    const paymentGateway = school.paymentGateway || "Veenca";
    const veencaToken = school.veencaToken || "veenca_sec_live_9812480129481b0a9";
    const autoReminders = school.autoReminders !== false;
    const twoFactor = school.twoFactor || false;
    const sessionTimeout = school.sessionTimeout || "4h";

    const tabs = [
      { id: "branding", label: "Identidade & Marca", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>` },
      { id: "domain", label: "Domínio & SSL", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>` },
      { id: "smtp", label: "E-mails & Notificações", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>` },
      { id: "security", label: "Segurança & Permissões", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>` },
      { id: "gateway", label: "Pagamentos & Cobrança", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>` }
    ];

    let contentHTML = "";

    // 1. ABA IDENTIDADE VISUAL
    if (activeTab === "branding") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Personalização White Label</div>
              <div class="settings-section-desc">Configure a logo, o nome e a paleta de cores institucional que serão exibidos aos seus alunos e professores.</div>
            </div>
            <span class="badge active" style="font-size: 0.75rem;">White Label Ativo</span>
          </div>

          <!-- Preview da Marca -->
          <div class="preview-brand-card" id="brand-preview-card" style="border-left: 5px solid ${primaryColor};">
            <div class="preview-brand-header">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div>
                  <div style="font-size: 1.1rem; font-weight: 800;" id="preview-name-text">${schoolName}</div>
                  <div style="font-size: 0.775rem; color: #94A3B8;" id="preview-domain-text">${schoolDomain}</div>
                </div>
              </div>
              <span class="preview-brand-badge" style="background-color: ${primaryColor};">Portal do Aluno</span>
            </div>
            <p style="font-size: 0.85rem; color: #E2E8F0; line-height: 1.45;" id="preview-slogan-text">"${slogan}"</p>
          </div>

          <form id="branding-settings-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Nome da Instituição de Ensino</label>
                <input type="text" id="setting-brand-name" class="form-control" value="${schoolName}" required>
              </div>
              <div class="form-group">
                <label>Subdomínio LMS</label>
                <input type="text" id="setting-brand-domain" class="form-control" value="${schoolDomain}" required>
              </div>
            </div>

            <div class="form-group">
              <label>Slogan ou Mensagem de Boas-Vindas</label>
              <input type="text" id="setting-brand-slogan" class="form-control" value="${slogan}">
            </div>

            <div class="form-group" style="margin-bottom: 1.75rem;">
              <label>Cor Principal da Plataforma</label>
              <p style="font-size: 0.775rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Selecione um tema pré-definido ou insira a cor hexadecimal da sua marca:</p>
              
              <div class="theme-picker-container">
                <div class="color-option ${primaryColor === '#246BFD' ? 'selected' : ''}" style="background-color: #246BFD;" data-primary="#246BFD" data-secondary="#031735" title="Azul Change Skills"></div>
                <div class="color-option ${primaryColor === '#23C7F3' ? 'selected' : ''}" style="background-color: #23C7F3;" data-primary="#23C7F3" data-secondary="#031735" title="Ciano Vibrante"></div>
                <div class="color-option ${primaryColor === '#EF4444' ? 'selected' : ''}" style="background-color: #EF4444;" data-primary="#EF4444" data-secondary="#F87171" title="Vermelho Fisk"></div>
                <div class="color-option ${primaryColor === '#22C55E' ? 'selected' : ''}" style="background-color: #22C55E;" data-primary="#22C55E" data-secondary="#4ADE80" title="Verde Wizard"></div>
                <div class="color-option ${primaryColor === '#0EA5E9' ? 'selected' : ''}" style="background-color: #0EA5E9;" data-primary="#0EA5E9" data-secondary="#38BDF8" title="Azul Oceano"></div>
                <div class="color-option ${primaryColor === '#FF7A1A' ? 'selected' : ''}" style="background-color: #FF7A1A;" data-primary="#FF7A1A" data-secondary="#031735" title="Laranja Camaleão"></div>
                <div class="color-option ${primaryColor === '#6C5CE7' ? 'selected' : ''}" style="background-color: #6C5CE7;" data-primary="#6C5CE7" data-secondary="#8B7CF6" title="Roxo Moderno"></div>
                
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-left: 0.5rem;">
                  <input type="color" id="custom-color-picker" value="${primaryColor}" style="width: 36px; height: 36px; border: none; border-radius: 50%; cursor: pointer; background: transparent;">
                  <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Personalizada</span>
                </div>
              </div>
              <input type="hidden" id="selected-primary-color" value="${primaryColor}">
              <input type="hidden" id="selected-secondary-color" value="${secondaryColor}">
            </div>

            <!-- Tipografia da Plataforma (Fonte) -->
            <div class="form-group" style="margin-bottom: 1.75rem; background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div>
                  <label style="font-weight: 800; font-size: 0.95rem; color: #0F172A; margin-bottom: 0.2rem;">Tipografia Institucional (Fonte da Plataforma)</label>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Selecione a família tipográfica do Google Fonts que será aplicada em todos os títulos, botões e textos do portal.</p>
                </div>
                <span class="badge active" id="badge-current-font">${school.fontFamily || "Plus Jakarta Sans"}</span>
              </div>

              <div style="display: grid; grid-template-columns: 1.2fr 1.8fr; gap: 1.25rem; align-items: center;">
                <div>
                  <select id="setting-brand-font" class="form-control" style="font-weight: 700; height: 46px;">
                    <option value="Plus Jakarta Sans" ${(!school.fontFamily || school.fontFamily === 'Plus Jakarta Sans') ? 'selected' : ''}>Plus Jakarta Sans (Padrão Tech & Elegante)</option>
                    <option value="Inter" ${school.fontFamily === 'Inter' ? 'selected' : ''}>Inter (SaaS Minimalista & Alta Legibilidade)</option>
                    <option value="Poppins" ${school.fontFamily === 'Poppins' ? 'selected' : ''}>Poppins (Design Geométrico & Amigável)</option>
                    <option value="Montserrat" ${school.fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat (Corporativo & Marcante)</option>
                    <option value="Roboto" ${school.fontFamily === 'Roboto' ? 'selected' : ''}>Roboto (Clássico, Neutro & Funcional)</option>
                    <option value="Outfit" ${school.fontFamily === 'Outfit' ? 'selected' : ''}>Outfit (Visual Inovador, Arredondado & Clean)</option>
                    <option value="DM Sans" ${school.fontFamily === 'DM Sans' ? 'selected' : ''}>DM Sans (Elegante, Executivo & Compacto)</option>
                    <option value="Sora" ${school.fontFamily === 'Sora' ? 'selected' : ''}>Sora (Moderno com Formas Distintas)</option>
                  </select>
                </div>

                <div id="font-live-preview" style="background: white; border: 1px dashed var(--border-color); border-radius: 8px; padding: 0.85rem 1.15rem; font-family: '${school.fontFamily || 'Plus Jakarta Sans'}', sans-serif;">
                  <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">Aa Bb Cc 123 — Prátika Idiomas</div>
                  <div style="font-size: 0.775rem; color: #64748B; margin-top: 0.2rem;">O rápido aprendizado de novos idiomas com excelência pedagógica.</div>
                </div>
              </div>
            </div>

            <!-- Favicon do Navegador (Ícone da Aba) -->
            <div class="form-group" style="margin-bottom: 2rem; background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem;">
              <div style="margin-bottom: 0.75rem;">
                <label style="font-weight: 800; font-size: 0.95rem; color: #0F172A; margin-bottom: 0.2rem;">Favicon da Plataforma (Ícone da Aba)</label>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Personalize o ícone que aparece na aba do navegador ao lado do título da página.</p>
              </div>

              <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.25rem; align-items: center;">
                <!-- Presets Rápidos -->
                <div>
                  <label style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 0.4rem; display: block;">Ícones Rápidos</label>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${['🎓', '📚', '🌐', '💡', '🚀', '⭐', '🦉', '⚡'].map(emoji => `
                      <button type="button" class="btn-favicon-preset" data-emoji="${emoji}" style="width: 40px; height: 40px; border-radius: 8px; border: 2px solid ${school.favicon === emoji ? primaryColor : '#CBD5E1'}; background: white; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s ease;">
                        ${emoji}
                      </button>
                    `).join("")}
                  </div>
                  <div style="margin-top: 0.75rem;">
                    <label class="btn btn-outline btn-sm" style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      Fazer Upload de Ícone Personalizado (.ico, .png, .svg)
                      <input type="file" id="favicon-file-input" accept="image/*" style="display: none;">
                    </label>
                  </div>
                </div>

                <!-- Preview da Aba do Navegador -->
                <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-sm);">
                  <div style="background: #E2E8F0; padding: 0.4rem 0.75rem; display: flex; align-items: center; gap: 0.35rem;">
                    <span style="width: 9px; height: 9px; border-radius: 50%; background: #EF4444;"></span>
                    <span style="width: 9px; height: 9px; border-radius: 50%; background: #F59E0B;"></span>
                    <span style="width: 9px; height: 9px; border-radius: 50%; background: #10B981;"></span>
                    <span style="font-size: 0.65rem; color: #64748B; margin-left: 0.35rem;">Aba do Navegador</span>
                  </div>
                  <div style="padding: 0.5rem 0.75rem; display: flex; align-items: center; gap: 0.5rem; background: #F8FAFC; border-bottom: 2px solid ${primaryColor};">
                    <span id="preview-tab-favicon" style="font-size: 1.1rem; display: flex; align-items: center; justify-content: center;">
                      ${school.favicon && (school.favicon.startsWith('data:') || school.favicon.startsWith('http')) ? `<img src="${school.favicon}" style="width:18px;height:18px;object-fit:contain;">` : (school.favicon || '🎓')}
                    </span>
                    <span style="font-size: 0.75rem; font-weight: 700; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="preview-tab-title">${schoolName} — LMS</span>
                  </div>
                </div>
              </div>
              <input type="hidden" id="selected-favicon-val" value="${school.favicon || '🎓'}">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="submit" class="btn btn-primary">Salvar Identidade Visual</button>
            </div>
          </form>
        </div>
      `;
    }

    // 2. ABA DOMÍNIO E SSL
    else if (activeTab === "domain") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Domínio Próprio & Certificado SSL</div>
              <div class="settings-section-desc">Conecte seu próprio domínio (ex: portal.suaescola.com.br) para que seus alunos acessem diretamente o seu endereço oficial.</div>
            </div>
          </div>

          <div class="settings-status-box">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(34, 197, 94, 0.1); color: var(--success-color); display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <div style="font-weight: 700; font-size: 0.9rem;">Certificado SSL / HTTPS Ativo</div>
                <div style="font-size: 0.775rem; color: var(--text-secondary);">Criptografia de ponta a ponta 256-bit provida por Let's Encrypt</div>
              </div>
            </div>
            <span class="badge active">Seguro & Conectado</span>
          </div>

          <form id="domain-settings-form">
            <div class="form-group">
              <label>Domínio Personalizado (CNAME)</label>
              <input type="text" id="setting-custom-domain" class="form-control" value="${customDomain}" placeholder="••••••••••••">
            </div>

            <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 1.25rem; margin-bottom: 1.5rem;">
              <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 0.5rem;">Instruções de Apontamento DNS:</div>
              <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">
                Acesse o painel do seu provedor de domínio (ex: Registro.br, GoDaddy, Cloudflare) e crie a seguinte entrada DNS:
              </div>
              <div style="background: white; border: 1px dashed var(--border-color); padding: 0.75rem 1rem; border-radius: 4px; font-family: monospace; font-size: 0.85rem; margin-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                <span><strong>Tipo:</strong> CNAME &nbsp;|&nbsp; <strong>Nome:</strong> portal &nbsp;|&nbsp; <strong>Destino:</strong> cname.changeskills.com.br</span>
                <span class="badge active" style="font-size: 0.65rem;">DNS Verificado</span>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="button" class="btn btn-outline" onclick="app.showToast('Configure o DNS no provedor de hospedagem para ativar este domínio.', 'success')">Verificar DNS Agora</button>
              <button type="submit" class="btn btn-primary">Salvar Domínio</button>
            </div>
          </form>
        </div>
      `;
    }

    // 3. ABA SMTP & NOTIFICAÇÕES
    else if (activeTab === "smtp") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Servidor de E-mail (SMTP) & Notificações</div>
              <div class="settings-section-desc">Defina o remetente oficial para envio de lembretes de aulas, avisos e cobranças automáticas aos alunos.</div>
            </div>
          </div>

          <form id="smtp-settings-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Nome do Remetente</label>
                <input type="text" id="setting-smtp-sender" class="form-control" value="${smtpSender}" required>
              </div>
              <div class="form-group">
                <label>E-mail de Envio</label>
                <input type="email" id="setting-smtp-email" class="form-control" value="${smtpEmail}" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Servidor SMTP (Host)</label>
                <input type="text" id="setting-smtp-host" class="form-control" value="${smtpHost}" required>
              </div>
              <div class="form-group">
                <label>Porta SMTP</label>
                <input type="text" id="setting-smtp-port" class="form-control" value="${smtpPort}" required>
              </div>
            </div>

            <div style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">Automações de Notificação</h4>
              
              <div class="setting-toggle-row">
                <div class="setting-toggle-info">
                  <div class="setting-toggle-title">Lembretes de Aulas ao Vivo por WhatsApp e E-mail</div>
                  <div class="setting-toggle-desc">Disparar link da sala virtual 15 minutos antes do início de cada aula.</div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="setting-auto-reminders" ${autoReminders ? 'checked' : ''}>
                  <span class="slider"></span>
                </label>
              </div>

              <div class="setting-toggle-row">
                <div class="setting-toggle-info">
                  <div class="setting-toggle-title">E-mails de Boas-Vindas e Acesso aos Novos Alunos</div>
                  <div class="setting-toggle-desc">Enviar dados de login e link da plataforma automaticamente ao cadastrar aluno.</div>
                </div>
                <label class="switch">
                  <input type="checkbox" checked>
                  <span class="slider"></span>
                </label>
              </div>

              <div class="setting-toggle-row">
                <div class="setting-toggle-info">
                  <div class="setting-toggle-title">Lembretes Automáticos de Vencimento de Mensalidades</div>
                  <div class="setting-toggle-desc">Notificar alunos 3 dias antes do vencimento da fatura mensal.</div>
                </div>
                <label class="switch">
                  <input type="checkbox" checked>
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="button" class="btn btn-outline" onclick="app.sendTestEmail()">Disparar E-mail Teste</button>
              <button type="submit" class="btn btn-primary">Salvar Ajustes de E-mail</button>
            </div>
          </form>
        </div>
      `;
    }

    // 4. ABA SEGURANÇA
    else if (activeTab === "security") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Segurança & Controle de Acesso</div>
              <div class="settings-section-desc">Gerencie os parâmetros de autenticação, tempo de sessão e segurança da coordenação.</div>
            </div>
          </div>

          <form id="security-settings-form">
            <div class="setting-toggle-row">
              <div class="setting-toggle-info">
                <div class="setting-toggle-title">Autenticação em Duas Etapas (2FA) para Coordenação</div>
                <div class="setting-toggle-desc">Exige token via aplicativo autenticador ou SMS para acessar o painel de Gestão.</div>
              </div>
              <label class="switch">
                <input type="checkbox" id="setting-2fa" ${twoFactor ? 'checked' : ''}>
                <span class="slider"></span>
              </label>
            </div>

            <div class="form-group" style="margin-top: 1.25rem;">
              <label>Tempo de Inatividade para Expiração da Sessão</label>
              <select id="setting-session-timeout" class="form-control" style="max-width: 320px;">
                <option value="30m" ${sessionTimeout === '30m' ? 'selected' : ''}>30 Minutos</option>
                <option value="1h" ${sessionTimeout === '1h' ? 'selected' : ''}>1 Hora</option>
                <option value="4h" ${sessionTimeout === '4h' ? 'selected' : ''}>4 Horas (Recomendado)</option>
                <option value="24h" ${sessionTimeout === '24h' ? 'selected' : ''}>24 Horas</option>
              </select>
            </div>

            <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">Logs de Auditoria Recentes</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.825rem; padding: 0.6rem 0.85rem; background: #F8FAFC; border-radius: 4px; border: 1px solid var(--border-color);">
                  <span><strong>Login do Coordenador</strong> (IP: 189.32.110.45)</span>
                  <span style="color: var(--text-secondary);">Hoje às 12:45</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.825rem; padding: 0.6rem 0.85rem; background: #F8FAFC; border-radius: 4px; border: 1px solid var(--border-color);">
                  <span><strong>Alteração na Turma de Business English</strong></span>
                  <span style="color: var(--text-secondary);">Ontem às 18:20</span>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 2rem;">
              <button type="submit" class="btn btn-primary">Salvar Parâmetros de Segurança</button>
            </div>
          </form>
        </div>
      `;
    }

    // 5. ABA PAGAMENTOS E GATEWAY
    else if (activeTab === "gateway") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Pagamentos & Régua de Cobrança</div>
              <div class="settings-section-desc">Defina as formas de recebimento de mensalidades, chave PIX da escola e automação financeira.</div>
            </div>
          </div>

          <form id="gateway-settings-form">
            <div class="form-group">
              <label>Chave PIX da Escola</label>
              <input type="text" id="setting-pix-key" class="form-control" value="${pixKey}" placeholder="••••••••••••" required>
            </div>

            <div class="form-group">
              <label>Gateway Financeiro</label>
              <select id="setting-payment-gateway" class="form-control" style="max-width: 380px;">
                <option value="Veenca" ${(!paymentGateway || paymentGateway === 'Veenca') ? 'selected' : ''}>Veença Pagamentos (Pix Instantâneo, Boleto & Cartão)</option>
                <option value="Asaas" ${paymentGateway === 'Asaas' ? 'selected' : ''}>Asaas (PIX, Boleto e Cartão)</option>
                <option value="Mercado Pago" ${paymentGateway === 'Mercado Pago' ? 'selected' : ''}>Mercado Pago Empresas</option>
                <option value="Stripe" ${paymentGateway === 'Stripe' ? 'selected' : ''}>Stripe Billing</option>
                <option value="Manual" ${paymentGateway === 'Manual' ? 'selected' : ''}>Cobrança Manual / Depósito</option>
              </select>
            </div>

            <!-- Token Veença -->
            <div class="form-group" style="margin-top: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label style="font-weight: 700; font-size: 0.875rem;">Token Veença (API Key)</label>
                <span class="badge active" style="font-size: 0.7rem;">🟢 Conexão Veença Ativa</span>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="password" id="setting-veenca-token" class="form-control" value="${veencaToken}" placeholder="••••••••••••" style="font-family: monospace;" required>
                <button type="button" class="btn btn-outline" onclick="app.togglePasswordVisibility('setting-veenca-token')" title="Mostrar/Ocultar Token" style="padding: 0 0.85rem;">
                  👁️
                </button>
                <button type="button" class="btn btn-secondary" onclick="app.showToast('Salve a credencial e configure a integração do gateway no servidor.', 'success')" style="white-space: nowrap;">
                  Testar Token
                </button>
              </div>
              <span style="font-size: 0.75rem; color: #64748B; margin-top: 0.35rem; display: block;">Utilizado para gerar cobranças Pix instantâneas com conciliação automática via webhook Veença.</span>
            </div>

            <div style="background: rgba(108, 92, 231, 0.04); border: 1px solid rgba(108, 92, 231, 0.15); border-radius: var(--border-radius-sm); padding: 1.25rem; margin-top: 1.5rem; margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.9rem; color: var(--primary-color);">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>Conciliação Automática de Pagamentos</span>
              </div>
              <p style="font-size: 0.825rem; color: var(--text-secondary); margin-top: 0.35rem; line-height: 1.45;">
                Ao receber um PIX ou pagamento via Gateway, o status da fatura do aluno é atualizado instantaneamente para <strong style="color: var(--success-color);">Pago</strong> sem necessidade de baixa manual.
              </p>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="submit" class="btn btn-primary">Salvar Configurações de Pagamento</button>
            </div>
          </form>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="settings-grid">
        <div class="settings-nav">
          ${tabs.map(t => `
            <div class="settings-nav-item ${activeTab === t.id ? 'active' : ''}" onclick="app.switchSettingsTab('${t.id}')">
              ${t.icon}
              <span>${t.label}</span>
            </div>
          `).join("")}
        </div>

        <div>
          ${contentHTML}
        </div>
      </div>
    `;

    // Listeners da Aba de Identidade
    if (activeTab === "branding") {
      const options = document.querySelectorAll(".color-option");
      const customPicker = document.getElementById("custom-color-picker");

      options.forEach(opt => {
        opt.addEventListener("click", () => {
          options.forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");
          const primary = opt.getAttribute("data-primary");
          const secondary = opt.getAttribute("data-secondary");
          document.getElementById("selected-primary-color").value = primary;
          document.getElementById("selected-secondary-color").value = secondary;
          if (customPicker) customPicker.value = primary;

          // Atualiza preview em tempo real
          const prevCard = document.getElementById("brand-preview-card");
          const prevBadge = prevCard ? prevCard.querySelector(".preview-brand-badge") : null;
          if (prevCard) prevCard.style.borderLeftColor = primary;
          if (prevBadge) prevBadge.style.backgroundColor = primary;
        });
      });

      if (customPicker) {
        customPicker.addEventListener("input", (e) => {
          options.forEach(o => o.classList.remove("selected"));
          const val = e.target.value;
          document.getElementById("selected-primary-color").value = val;
          document.getElementById("selected-secondary-color").value = val;
          const prevCard = document.getElementById("brand-preview-card");
          const prevBadge = prevCard ? prevCard.querySelector(".preview-brand-badge") : null;
          if (prevCard) prevCard.style.borderLeftColor = val;
          if (prevBadge) prevBadge.style.backgroundColor = val;
        });
      }

      // Input changes preview
      const nameInput = document.getElementById("setting-brand-name");
      const domainInput = document.getElementById("setting-brand-domain");
      const sloganInput = document.getElementById("setting-brand-slogan");

      if (nameInput) {
        nameInput.addEventListener("input", (e) => {
          const txt = document.getElementById("preview-name-text");
          if (txt) txt.textContent = e.target.value || "Nome da Escola";
        });
      }
      if (domainInput) {
        domainInput.addEventListener("input", (e) => {
          const txt = document.getElementById("preview-domain-text");
          if (txt) txt.textContent = e.target.value || "escola.changeskills.com.br";
        });
      }
      if (sloganInput) {
        sloganInput.addEventListener("input", (e) => {
          const txt = document.getElementById("preview-slogan-text");
          if (txt) txt.textContent = `"${e.target.value}"`;
        });
      }

      // Listeners de Fontes
      const fontSelect = document.getElementById("setting-brand-font");
      if (fontSelect) {
        fontSelect.addEventListener("change", (e) => {
          const selectedFont = e.target.value;
          const badge = document.getElementById("badge-current-font");
          const previewBox = document.getElementById("font-live-preview");
          if (badge) badge.textContent = selectedFont;
          if (previewBox) previewBox.style.fontFamily = `'${selectedFont}', sans-serif`;
          
          // Aplica temporariamente para o usuário ver o efeito
          let styleEl = document.getElementById("whitelabel-styles");
          if (styleEl) {
            document.body.style.fontFamily = `'${selectedFont}', sans-serif`;
          }
        });
      }

      // Listeners de Favicon Presets
      const faviconPresets = document.querySelectorAll(".btn-favicon-preset");
      faviconPresets.forEach(btn => {
        btn.addEventListener("click", () => {
          faviconPresets.forEach(b => b.style.borderColor = "#CBD5E1");
          btn.style.borderColor = document.getElementById("selected-primary-color").value;
          const emoji = btn.getAttribute("data-emoji");
          document.getElementById("selected-favicon-val").value = emoji;
          const tabFavicon = document.getElementById("preview-tab-favicon");
          if (tabFavicon) tabFavicon.innerHTML = emoji;
          app.updateFavicon(emoji);
        });
      });

      // Listener de Upload de Favicon
      const faviconFileInput = document.getElementById("favicon-file-input");
      if (faviconFileInput) {
        faviconFileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              const base64 = re.target.result;
              document.getElementById("selected-favicon-val").value = base64;
              faviconPresets.forEach(b => b.style.borderColor = "#CBD5E1");
              const tabFavicon = document.getElementById("preview-tab-favicon");
              if (tabFavicon) tabFavicon.innerHTML = `<img src="${base64}" style="width:18px;height:18px;object-fit:contain;">`;
              app.updateFavicon(base64);
              app.showToast("Favicon personalizado carregado!", "info");
            };
            reader.readAsDataURL(file);
          }
        });
      }

      document.getElementById("branding-settings-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const newName = document.getElementById("setting-brand-name").value;
        const newDomain = document.getElementById("setting-brand-domain").value;
        const newSlogan = document.getElementById("setting-brand-slogan").value;
        const newPrimary = document.getElementById("selected-primary-color").value;
        const newSecondary = document.getElementById("selected-secondary-color").value;
        const newFont = document.getElementById("setting-brand-font") ? document.getElementById("setting-brand-font").value : "Plus Jakarta Sans";
        const newFavicon = document.getElementById("selected-favicon-val") ? document.getElementById("selected-favicon-val").value : "🎓";

        PratikaDB.updateSchool(schoolId, {
          name: newName,
          domain: newDomain,
          slogan: newSlogan,
          primaryColor: newPrimary,
          secondaryColor: newSecondary,
          fontFamily: newFont,
          favicon: newFavicon
        });

        this.applyWhiteLabelTheme(schoolId);
        this.showToast("Identidade visual, tipografia e favicon salvos com sucesso!", "success");
        this.renderPortalLayout();
      });
    }

    // Listener da Aba de Domínio
    if (activeTab === "domain") {
      document.getElementById("domain-settings-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const customDomainVal = document.getElementById("setting-custom-domain").value;
        PratikaDB.updateSchool(schoolId, { customDomain: customDomainVal });
        this.showToast("Domínio salvo. Configure o DNS e o HTTPS na hospedagem.", "success");
      });
    }

    // Listener da Aba de SMTP
    if (activeTab === "smtp") {
      document.getElementById("smtp-settings-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const smtpSenderVal = document.getElementById("setting-smtp-sender").value;
        const smtpEmailVal = document.getElementById("setting-smtp-email").value;
        const smtpHostVal = document.getElementById("setting-smtp-host").value;
        const smtpPortVal = document.getElementById("setting-smtp-port").value;
        const autoRemindersVal = document.getElementById("setting-auto-reminders").checked;

        PratikaDB.updateSchool(schoolId, {
          smtpSender: smtpSenderVal,
          smtpEmail: smtpEmailVal,
          smtpHost: smtpHostVal,
          smtpPort: smtpPortVal,
          autoReminders: autoRemindersVal
        });
        this.showToast("Parâmetros de e-mail e notificações salvos com sucesso!", "success");
      });
    }

    // Listener da Aba de Segurança
    if (activeTab === "security") {
      document.getElementById("security-settings-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const twoFactorVal = document.getElementById("setting-2fa").checked;
        const sessionTimeoutVal = document.getElementById("setting-session-timeout").value;

        PratikaDB.updateSchool(schoolId, {
          twoFactor: twoFactorVal,
          sessionTimeout: sessionTimeoutVal
        });
        this.showToast("Parâmetros de segurança e sessão atualizados!", "success");
      });
    }

    // Listener da Aba de Gateway
    if (activeTab === "gateway") {
      document.getElementById("gateway-settings-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const pixKeyVal = document.getElementById("setting-pix-key").value;
        const paymentGatewayVal = document.getElementById("setting-payment-gateway").value;
        const veencaTokenVal = document.getElementById("setting-veenca-token") ? document.getElementById("setting-veenca-token").value : "";

        PratikaDB.updateSchool(schoolId, {
          pixKey: pixKeyVal,
          paymentGateway: paymentGatewayVal,
          veencaToken: veencaTokenVal
        });
        this.showToast("Configurações financeiras e Token Veença salvos com sucesso!", "success");
      });
    }
  }

  // ROTEAMENTO PROFESSOR
  renderTeacherViews(view, schoolId, container) {
    const teacher = PratikaDB.getTeacher(this.session.userId) || PratikaDB.getTeachers(schoolId)[0] || {
      id: "prof-1",
      name: "Lucas Martins",
      email: "lucas.martins@escola.com",
      specialty: "Inglês Geral e Negócios",
      availability: "Seg a Sex",
      status: "Ativo",
      nextClass: "Hoje - 19:00",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    };

    if (view === "cursos") {
      this.renderTeacherCoursesScreen(schoolId, container);
      return;
    }
    if (view === "curso") {
      const courseId = this.routeParams?.[0] || (PratikaDB.getCourses(schoolId)[0]?.id || "curso-1");
      this.renderTeacherCourseManager(courseId, container);
      return;
    }
    if (view === "assistir") {
      const courseId = this.routeParams?.[0] || "curso-1";
      const moduleId = this.routeParams?.[1] || "mod-1";
      const itemId = this.routeParams?.[2] || "item-1-1";
      this.renderLessonWatchScreen(courseId, moduleId, itemId, container);
      return;
    }
    if (view === "atividade") {
      const courseId = this.routeParams?.[0] || "curso-1";
      const moduleId = this.routeParams?.[1] || "mod-1";
      const itemId = this.routeParams?.[2] || "item-1-2";
      this.renderStudentActivityScreen(courseId, moduleId, itemId, container);
      return;
    }
    if (view === "dashboard") {
      const classes = PratikaDB.getClasses(schoolId).filter(c => c.teacherId === teacher.id || (teacher.classes || []).includes(c.name));
      const lessons = PratikaDB.getLessons(schoolId);
      const nextLesson = lessons.find(l => l.status === "Ao Vivo") || lessons[0];
      const tasks = PratikaDB.getTasks(schoolId);
      container.innerHTML = `
        <div class="dashboard-welcome-banner">
          <div class="dashboard-welcome-content">
            <div class="dashboard-welcome-tag">Portal do Professor</div>
            <h2>Olá, Prof. ${teacher.name.split(" ")[0]}!</h2>
            <p>Acompanhe alunos, entre na sala ao vivo e mantenha cursos, módulos, videoaulas e tarefas sempre atualizados.</p>
            <div style="display: flex; gap: 0.75rem; margin-top: 1rem; flex-wrap: wrap;">
              ${nextLesson ? `<a href="#/livekit/${nextLesson.id}" class="btn btn-primary">${Icons.aulas} Entrar na Aula ao Vivo</a>` : ""}
              <a href="#/professor/cursos" class="btn btn-outline" style="border-color: rgba(255,255,255,0.4); color:#FFF;">${Icons.turmas} Meus Cursos</a>
            </div>
          </div>
        </div>
        <div class="kpi-grid grid-4x1">
          <div class="kpi-card"><span class="kpi-card-title">Cursos Ativos</span><div class="kpi-card-value">${classes.length}</div><span class="kpi-card-meta">Turmas sob mentoria</span></div>
          <div class="kpi-card"><span class="kpi-card-title">Aulas Agendadas</span><div class="kpi-card-value">${lessons.length}</div><span class="kpi-card-meta">Grade curricular</span></div>
          <div class="kpi-card"><span class="kpi-card-title">Atividades</span><div class="kpi-card-value">${tasks.length}</div><span class="kpi-card-meta">Exercícios publicados</span></div>
          <div class="kpi-card"><span class="kpi-card-title">Status Docente</span><div class="kpi-card-value" style="font-size:1.15rem; color:var(--success-color);"><span class="badge active">Disponível</span></div><span class="kpi-card-meta">Pronto para aulas</span></div>
        </div>
      `;
      return;
    }
    if (view === "alunos") {
      const students = PratikaDB.getStudents(schoolId);
      container.innerHTML = `
        <div class="actions-row">
          <div class="search-input-wrapper">${Icons.search}<input type="text" placeholder="Buscar alunos..." class="form-control" onkeyup="app.filterTableRows(this.value, 'teacher-students-table')"></div>
        </div>
        <div class="panel-card"><div class="table-container"><table class="premium-table" id="teacher-students-table">
          <thead><tr><th>Aluno</th><th>Turma/Curso</th><th>Progresso</th><th>Status</th><th style="text-align:right;">Ações</th></tr></thead>
          <tbody>${students.map(s => `<tr>
            <td style="display:flex; align-items:center; gap:0.75rem;"><img src="${s.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;"><div><div style="font-weight:700;">${s.name}</div><span style="font-size:0.8rem; color:var(--text-secondary);">${s.email}</span></div></td>
            <td>${s.course || 'Inglês Básico A1'}</td>
            <td><div style="display:flex; align-items:center; gap:0.5rem;"><div style="flex:1; height:6px; background:#E2E8F0; border-radius:6px; overflow:hidden;"><div style="width:${s.progress ?? 0}%; height:100%; background:var(--primary-color);"></div></div><span style="font-size:0.75rem; font-weight:700;">${s.progress ?? 0}%</span></div></td>
            <td><span class="badge active">${s.status || 'Ativo'}</span></td>
            <td style="text-align:right;"><button class="btn btn-outline btn-sm" onclick="app.openChatWithUser('aluno', '${s.id}')">${Icons.comunicacao} Mensagem</button></td>
          </tr>`).join("")}</tbody>
        </table></div></div>
      `;
      return;
    }
    if (view === "aulas") {
      const lessons = PratikaDB.getLessons(schoolId);
      container.innerHTML = `
        <div class="actions-row">
          <div class="search-input-wrapper">${Icons.search}<input type="text" placeholder="Buscar aulas..." class="form-control" onkeyup="app.filterTableRows(this.value, 'teacher-lessons-table')"></div>
          <button class="btn btn-primary" onclick="event.stopPropagation(); app.showTeacherLessonModal()">${Icons.plus} Nova Aula</button>
        </div>
        <div class="panel-card"><div class="table-container"><table class="premium-table" id="teacher-lessons-table">
          <thead><tr><th>Aula</th><th>Data e horário</th><th>Status</th><th style="text-align:right;">Ações</th></tr></thead>
          <tbody>${lessons.map(l => `<tr><td style="font-weight:700;">${l.title}</td><td>${l.time}</td><td><span class="badge ${l.status === 'Ao Vivo' ? 'danger' : 'pending'}">${l.status}</span></td><td style="text-align:right;"><a href="#/livekit/${l.id}" class="btn btn-primary btn-sm">${Icons.aulas} Entrar</a></td></tr>`).join("")}</tbody>
        </table></div></div>
      `;
      return;
    }
    if (view === "atividades") {
      const courses = PratikaDB.getCourses(schoolId);
      const allActivities = [];
      courses.forEach(c => {
        (c.modules || []).forEach(m => {
          (m.items || []).forEach(i => {
            if (i.type === "activity") {
              allActivities.push({ ...i, courseName: c.name || c.title, courseId: c.id, moduleId: m.id });
            }
          });
        });
      });
      container.innerHTML = `
        <div class="actions-row" style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="font-family:var(--font-title); font-size:1.35rem; font-weight:800; margin:0;">Atividades Publicadas</h3>
          <button class="btn btn-primary" onclick="event.stopPropagation(); app.showTeacherTaskModal()">${Icons.plus} Nova Atividade</button>
        </div>
        <div class="panel-card">
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${allActivities.map(t => `
              <div style="padding:1.15rem; border:1px solid var(--border-color); border-radius:var(--border-radius-md); display:flex; justify-content:space-between; align-items:center; gap:1rem;">
                <div>
                  <div style="font-size:0.75rem; font-weight:700; color:var(--primary-color); text-transform:uppercase;">${t.courseName}</div>
                  <h4 style="font-family:var(--font-title); font-size:1.05rem; margin:0.2rem 0;">${t.title}</h4>
                  <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">${(t.statement || '').substring(0, 120)}...</p>
                  <span style="font-size:0.75rem; color:var(--text-secondary);">Prazo: <strong>${t.dueDate}</strong> • ${t.hasGrade ? `Nota Máx: ${t.maxGrade}` : 'Sem nota'}</span>
                </div>
                <div style="display:flex; gap:0.5rem; align-items:center;">
                  <span class="badge ${t.status === 'published' ? 'active' : 'pending'}">${t.status === 'published' ? 'Publicada' : 'Rascunho'}</span>
                  <a href="#/professor/atividade/${t.courseId}/${t.moduleId}/${t.id}" class="btn btn-outline btn-sm">Visualizar</a>
                </div>
              </div>
            `).join("") || `<p style="color:var(--text-secondary);">Nenhuma atividade cadastrada. Clique em "Nova Atividade".</p>`}
          </div>
        </div>
      `;
      return;
    }
    if (view === "materiais") {
      const courses = PratikaDB.getCourses(schoolId);
      const allMats = [];
      courses.forEach(c => {
        allMats.push(...PratikaDB.getCourseMaterials(c.id).map(m => ({ ...m, courseName: c.name || c.title, courseId: c.id })));
      });
      container.innerHTML = `
        <div class="actions-row">
          <div class="search-input-wrapper">${Icons.search}<input type="text" placeholder="Buscar materiais..." class="form-control" onkeyup="app.filterTableRows(this.value, 'teacher-materials-grid')"></div>
          <button class="btn btn-primary" onclick="event.stopPropagation(); app.showTeacherMaterialModal()">${Icons.plus} Novo Material</button>
        </div>
        <div class="cards-grid" id="teacher-materials-grid">
          ${allMats.map(m => `
            <div class="card-item">
              <div class="card-item-header">
                <div>
                  <div class="card-item-title">${m.title}</div>
                  <span style="font-size:0.8rem; color:var(--text-secondary);">${m.courseName} • ${m.itemTitle || ''}</span>
                </div>
                <span class="badge active">${m.type}</span>
              </div>
              <div class="card-item-details">
                <div class="card-item-detail-row"><span>Tamanho</span><strong>${m.size || '1.5 MB'}</strong></div>
              </div>
              <div class="card-item-footer">
                <button class="btn btn-outline btn-sm btn-full" onclick="app.downloadFile('${m.downloadUrl || m.url || '#'}')">Baixar Arquivo</button>
              </div>
            </div>
          `).join("") || `<p style="color:var(--text-secondary);">Nenhum material cadastrado.</p>`}
        </div>
      `;
      return;
    }
    if (view === "mensagens") {
      this.renderChatInterface(schoolId, false, container);
      return;
    }
    if (view === "perfil") {
      container.innerHTML = `
        <div style="max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Header do Perfil -->
          <div class="panel-card" style="display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; background: linear-gradient(135deg, #031735 0%, #0F275A 100%); color: #FFF;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="position: relative;">
                <img id="profile-preview-avatar" src="${teacher.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}" alt="${teacher.name}" style="width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 3px solid #246BFD; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                <div style="position: absolute; bottom: 0; right: 0; width: 22px; height: 22px; border-radius: 50%; background: #22C55E; border: 2px solid #FFF;"></div>
              </div>
              <div>
                <span class="badge active" style="font-size: 0.72rem; margin-bottom: 0.35rem; background: rgba(36, 107, 253, 0.25); color: #93C5FD; border: 1px solid rgba(147, 197, 253, 0.4);">DOCENTE / INSTRUTOR</span>
                <h2 style="font-family: var(--font-title); font-size: 1.4rem; font-weight: 800; color: #FFFFFF; margin: 0;">${teacher.name}</h2>
                <p style="font-size: 0.85rem; color: #94A3B8; margin: 0.15rem 0 0 0;">${teacher.email} • ID: ${teacher.id}</p>
              </div>
            </div>
            <div>
              <span class="badge" style="background: rgba(255,255,255,0.1); color: #FFF; font-weight: 600;">Status: ${teacher.status || 'Ativo'}</span>
            </div>
          </div>

          <!-- Formulário de Edição do Perfil -->
          <form id="teacher-profile-form" onsubmit="event.preventDefault(); app.handleSaveTeacherProfile('${teacher.id}');">
            <div class="panel-card" style="margin-bottom: 1.5rem;">
              <div class="panel-card-header">
                <div>
                  <div class="panel-card-title">Informações Pessoais & Contato</div>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0.2rem 0 0 0;">Atualize seu nome de exibição, e-mail institucional e dados de contato.</p>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">Nome Completo *</label>
                  <input type="text" id="prof-edit-name" class="form-control" value="${teacher.name}" required placeholder="Seu nome completo">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">E-mail *</label>
                  <input type="email" id="prof-edit-email" class="form-control" value="${teacher.email}" required placeholder="seu.email@escola.com">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">WhatsApp / Telefone</label>
                  <input type="text" id="prof-edit-phone" class="form-control" value="${teacher.phone || '(11) 98765-4321'}" placeholder="(11) 98765-4321">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">Especialidade Pedagógica</label>
                  <input type="text" id="prof-edit-specialty" class="form-control" value="${teacher.specialty || 'Inglês Geral e Conversação'}" placeholder="Ex: Inglês Instrumental e IELTS">
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">URL da Foto de Perfil</label>
                <input type="text" id="prof-edit-photo" class="form-control" value="${teacher.photo || ''}" placeholder="https://..." oninput="document.getElementById('profile-preview-avatar').src = this.value || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'">
              </div>

              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">Biografia & Apresentação</label>
                <textarea id="prof-edit-bio" class="form-control" rows="3" placeholder="Escreva uma breve apresentação para seus alunos e para a coordenação...">${teacher.bio || 'Professor com mais de 7 anos de experiência no ensino comunicativo de idiomas para adultos e jovens profissionais.'}</textarea>
              </div>
            </div>

            <!-- Segurança e Alteração de Senha -->
            <div class="panel-card" style="margin-bottom: 1.5rem;">
              <div class="panel-card-header">
                <div>
                  <div class="panel-card-title">Segurança & Alteração de Senha</div>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0.2rem 0 0 0;">Preencha os campos abaixo caso deseje alterar sua senha de acesso.</p>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">Senha Atual</label>
                  <input type="password" id="prof-edit-cur-pass" class="form-control" placeholder="••••••••">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">Nova Senha</label>
                  <input type="password" id="prof-edit-new-pass" class="form-control" placeholder="Mínimo 6 dígitos">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.3rem;">Confirmar Nova Senha</label>
                  <input type="password" id="prof-edit-confirm-pass" class="form-control" placeholder="Repita a nova senha">
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="button" class="btn btn-outline" onclick="window.location.hash='#/' + (app.session.role === 'admin' ? 'admin' : 'professor') + '/cursos'">Cancelar</button>
              <button type="submit" class="btn btn-primary" style="font-weight: 700; min-width: 180px;">Salvar Alterações</button>
            </div>
          </form>
        </div>
      `;
      return;
    }
  }

  // ROTEAMENTO ALUNO
  renderStudentViews(view, schoolId, container) {
    if (view === "cursos") {
      this.renderStudentCoursesList(schoolId, container);
      return;
    }
    if (view === "curso") {
      const courseId = this.routeParams?.[0] || (PratikaDB.getCourses(schoolId)[0]?.id || "curso-1");
      this.renderStudentCourseModules(courseId, container);
      return;
    }
    if (view === "assistir") {
      const courseId = this.routeParams?.[0] || "curso-1";
      const moduleId = this.routeParams?.[1] || "mod-1";
      const itemId = this.routeParams?.[2] || "item-1-1";
      this.renderLessonWatchScreen(courseId, moduleId, itemId, container);
      return;
    }
    if (view === "atividade") {
      const courseId = this.routeParams?.[0] || "curso-1";
      const moduleId = this.routeParams?.[1] || "mod-1";
      const itemId = this.routeParams?.[2] || "item-1-2";
      this.renderStudentActivityScreen(courseId, moduleId, itemId, container);
      return;
    }
    if (view === "home") {
      const student = PratikaDB.getStudents(schoolId).find(s => s.id === this.session.userId);
      const nextLesson = PratikaDB.getLessons(schoolId).find(l => l.status === "Ao Vivo") || PratikaDB.getLessons(schoolId)[0];
      const pendingTasks = PratikaDB.getTasks(schoolId).filter(t => t.status === "Pendente");
      
      container.innerHTML = `
        <div class="dashboard-welcome-banner">
          <div class="dashboard-welcome-content">
            <div class="dashboard-welcome-tag">
              <span>🦎 Mascote Oficial</span> • Change Skills Idiomas
            </div>
            <h2>Olá, ${this.session.userName.split(" ")[0]}! Que bom ver você aqui.</h2>
            <p>Aprenda idiomas. Transforme o mundo. Sua próxima aula está pronta para você acelerar sua fluência internacional!</p>
            <div class="dashboard-welcome-actions">
              <a href="#/livekit/${nextLesson.id}" class="btn btn-primary" style="font-weight: 700; background: #246BFD; border-color: #246BFD;">
                ${Icons.aulas} Entrar na Sala Ao Vivo
              </a>
              <a href="#/aluno/turmas" class="btn btn-outline" style="border-color: rgba(255,255,255,0.4); color: white;">
                ${Icons.turmas} Minhas Turmas
              </a>
            </div>
          </div>
          <div class="dashboard-welcome-mascot-wrap">
            <img src="assets/images/camaleao-mobile.png" alt="Camaleão Change Skills" class="dashboard-welcome-mascot-img">
          </div>
        </div>

        <div class="chameleon-tip-card">
          <div class="chameleon-tip-icon">
            <img src="assets/images/camaleao-uniforme.png" alt="Dica">
          </div>
          <div class="chameleon-tip-content">
            <h5>Dica do Camaleão 🦎</h5>
            <p>Pratique 15 minutos de conversação hoje para fixar novos vocabulários e ganhar confiança!</p>
          </div>
        </div>
        
        <div class="dash-row" style="margin-top: 1.5rem;">
          <div class="panel-card" style="justify-content: space-between;">
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.5rem;">Próxima aula programada</div>
              <div style="font-family: var(--font-title); font-size: 1.4rem; font-weight: 800; margin-bottom: 0.25rem;">${nextLesson.title}</div>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">${nextLesson.time} • ${nextLesson.teacherName}</p>
            </div>
            <div>
              <a href="#/livekit/${nextLesson.id}" class="btn btn-primary btn-full">${Icons.aulas} Entrar na sala de aula</a>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
            <div class="panel-card" style="align-items: center; justify-content: center; gap: 0.5rem; text-align: center;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">Sequência de Estudos</span>
              
              <div class="streak-fire-wrapper">
                <svg class="streak-fire-minimal" viewBox="0 0 24 24" width="34" height="34" fill="none">
                  <defs>
                    <linearGradient id="miniFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stop-color="#FF3B30" />
                      <stop offset="55%" stop-color="#FF9500" />
                      <stop offset="100%" stop-color="#FFCC00" />
                    </linearGradient>
                    <linearGradient id="miniCoreGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stop-color="#FF9500" />
                      <stop offset="100%" stop-color="#FFD60A" />
                    </linearGradient>
                  </defs>
                  <!-- Outer sleek flame -->
                  <path class="mini-flame-outer" d="M12 2C12.5 7 17.5 9 17.5 14C17.5 17.5 15 20.5 12 20.5C9 20.5 6.5 17.5 6.5 14C6.5 10 10.5 7.5 10.5 4.5C10.5 3.5 11 2.5 12 2Z" fill="url(#miniFlameGrad)"/>
                  <!-- Inner subtle flame -->
                  <path class="mini-flame-inner" d="M12 10C12.5 12.5 14.5 13.5 14.5 16C14.5 17.8 13.3 19.2 12 19.2C10.7 19.2 9.5 17.8 9.5 16C9.5 14 11.2 12.8 11.2 11.5C11.2 11 11.5 10.5 12 10Z" fill="url(#miniCoreGrad)"/>
                </svg>
              </div>

              <div style="font-family: var(--font-title); font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">5 dias seguidos</div>
              <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">Excelente dedicação! Continue assim.</span>
            </div>
          </div>
        </div>

        <div class="dash-row">
          <div class="panel-card">
            <div class="panel-card-header"><div class="panel-card-title">Tarefas Pendentes</div></div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${pendingTasks.map(t => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); background-color: var(--surface-color);">
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem;">${t.title}</div>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">Entrega até ${t.dueDate}</p>
                  </div>
                  <span class="badge pending">${t.status}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="panel-card">
            <div class="panel-card-header"><div class="panel-card-title">Avisos da Coordenação</div></div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="border-left: 3px solid var(--primary-color); padding-left: 1rem;">
                <h4 style="font-size: 0.9rem; font-weight: 700;">Rematrículas abertas para o segundo semestre</h4>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">Garanta seu horário preferencial e receba 10% de desconto na primeira parcela.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    else if (view === "turmas") {
      let classes = PratikaDB.getClasses(schoolId);
      const me = PratikaDB.getStudent(this.session.userId);
      if (me && me.classId) {
        classes = classes.filter(c => c.id === me.classId || c.name === me.course);
      }
      if (classes.length === 0) {
        classes = [PratikaDB.getClasses(schoolId)[0]];
      }

      const teachers = PratikaDB.getTeachers(schoolId);
      const activeFilter = "todas"; // Forced to 'todas' since we only have 1 class
      let filteredClasses = classes;

      container.innerHTML = `
        <!-- Header Actions -->
        <div class="actions-row" style="flex-wrap: wrap; gap: 0.75rem; justify-content: flex-end; margin-bottom: 1.5rem;">
          <div class="search-input-wrapper">
            ${Icons.search}
            <input type="text" placeholder="Buscar turma..." class="form-control" onkeyup="app.filterTableRows(this.value, 'student-turmas-grid')">
          </div>
        </div>

        <!-- Grid de Cards de Turmas por Nível (3 Colunas) -->
        <div class="cards-grid turmas-grid" id="student-turmas-grid">
          ${filteredClasses.map(c => {
            const teacher = teachers.find(t => t.id === c.teacherId) || teachers.find(t => t.name === c.teacher) || teachers[0] || { name: "Prof. Lucas Martins", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" };
            const level = c.level || (c.name.includes("A1") ? "A1" : c.name.includes("A2") ? "A2" : c.name.includes("B1") ? "B1" : c.name.includes("B2") ? "B2" : c.name.includes("C1") ? "C1" : "A1");
            const levelColor = level.startsWith("A") ? "#10B981" : level.startsWith("B") ? "#0EA5E9" : "#6C5CE7";
            const levelLabel = level === "A1" ? "Nível A1 • Básico Iniciante" : level === "A2" ? "Nível A2 • Básico Pré-Intermediário" : level === "B1" ? "Nível B1 • Intermediário Fluency" : level === "B2" ? "Nível B2 • Intermediário Superior" : "Nível C1 • Avançado & Business";

            return `
              <div class="card-item class-card-item" style="border-top: 4px solid ${levelColor}; transition: all 0.2s ease;">
                <div class="card-item-header" style="align-items: flex-start;">
                  <div>
                    <div class="card-item-title" style="font-size: 1.1rem; font-weight: 800; color: #0F172A;">${c.name}</div>
                    <span style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.15rem; display: block;">${c.room || 'Sala Virtual 01'} • <strong>${c.days || "Seg e Qua"}</strong> (${c.hours || "19:00 - 20:00"})</span>
                  </div>
                  <span class="badge" style="background: ${levelColor}18; color: ${levelColor}; font-weight: 800; font-size: 0.75rem; border: 1px solid ${levelColor}30;">
                    ${levelLabel}
                  </span>
                </div>

                <div class="card-item-details" style="gap: 0.85rem; margin: 1rem 0;">
                  <div class="card-item-detail-row" style="align-items: center;">
                    <img src="${teacher.photo}" alt="${teacher.name}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid ${levelColor}40;">
                    <div>
                      <div style="font-size: 0.875rem; font-weight: 700; color: #0F172A;">${teacher.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-secondary);">${teacher.specialty || 'Docente Responsável'}</div>
                    </div>
                  </div>

                  <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 0.72rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Próxima Aula</div>
                      <div style="font-size: 0.875rem; font-weight: 700; color: #0F172A; margin-top: 0.1rem;">Hoje às ${c.hours ? c.hours.split(" - ")[0] : "19:00"}</div>
                    </div>
                    <span class="badge active" style="font-size: 0.72rem;">Sala Liberada</span>
                  </div>
                </div>

                <div class="card-item-footer" style="display: flex; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color);">
                  <a href="#/livekit/${c.id}" class="btn btn-primary btn-sm" style="flex: 1.4; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; font-weight: 700; background: ${levelColor}; border-color: ${levelColor};">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    Entrar na Sala Ao Vivo
                  </a>
                  <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="app.navigate('aluno/materiais')">
                    ${Icons.materiais} Materiais
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    else if (view === "aulas") {
      const lessons = PratikaDB.getLessons(schoolId);
      const materials = PratikaDB.getMaterials(schoolId);
      const activeFilter = this.studentLessonsFilter || "todas";

      let filteredLessons = lessons;
      if (activeFilter === "aovivo") {
        filteredLessons = lessons.filter(l => l.status === "Ao Vivo" || l.status === "Agendada");
      } else if (activeFilter === "gravadas") {
        filteredLessons = lessons.filter(l => l.status !== "Ao Vivo");
      }

      container.innerHTML = `
        <div class="actions-row" style="flex-wrap: wrap; gap: 0.75rem; justify-content: space-between;">
          <div class="tabs" style="border-bottom: none; margin-bottom: 0; gap: 0.5rem;">
            <a href="#/aluno/turmas" class="tab-btn" style="text-decoration: none;">Minhas Turmas (A1, B1, C1...)</a>
            <button class="tab-btn ${activeFilter === 'todas' ? 'active' : ''}" onclick="app.setStudentLessonsFilter('todas')">Todas as Aulas (${lessons.length})</button>
            <button class="tab-btn ${activeFilter === 'aovivo' ? 'active' : ''}" onclick="app.setStudentLessonsFilter('aovivo')">Ao Vivo & Agendadas</button>
            <button class="tab-btn ${activeFilter === 'gravadas' ? 'active' : ''}" onclick="app.setStudentLessonsFilter('gravadas')">Aulas Gravadas (${materials.filter(m => m.type === 'Vídeo').length})</button>
          </div>
          
          <div class="search-input-wrapper">
            ${Icons.search}
            <input type="text" placeholder="Buscar aulas agendadas..." class="form-control" onkeyup="app.filterTableRows(this.value, 'student-lessons-table')">
          </div>
        </div>

        <div class="panel-card">
          <div class="table-container">
            <table class="premium-table" id="student-lessons-table">
              <thead>
                <tr>
                  <th>Aula / Módulo</th>
                  <th>Professor</th>
                  <th>Data e Horário</th>
                  <th>Status</th>
                  <th style="text-align: right;">Acesso & Recursos</th>
                </tr>
              </thead>
              <tbody>
                ${filteredLessons.map(l => {
                  const isLive = l.status === 'Ao Vivo';
                  return `
                    <tr>
                      <td>
                        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${l.title}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.15rem;">Sala: ${l.room || 'Sala Virtual 01'} • Módulo Interativo</div>
                      </td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <div style="width: 28px; height: 28px; border-radius: 50%; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem;">
                            ${l.teacherName.charAt(0)}
                          </div>
                          <span>${l.teacherName}</span>
                        </div>
                      </td>
                      <td>${l.time}</td>
                      <td>
                        <span class="badge ${isLive ? 'danger' : 'pending'}">${l.status}</span>
                      </td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-stud-aula-${l.id}', this)" title="Ações da aula">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-stud-aula-${l.id}">
                            ${isLive ? `
                              <a href="#/livekit/${l.id}" class="dropdown-item" style="color: #4F46E5; font-weight: 700;">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                <span>Entrar na Sala Ao Vivo</span>
                              </a>
                            ` : `
                              <a href="#/aluno/assistir/curso-1/mod-1/item-1-1" class="dropdown-item" style="color: var(--primary-color); font-weight: 700;">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                <span>Assistir Videoaula (Player Completo)</span>
                              </a>
                            `}
                            <button class="dropdown-item" onclick="app.showLessonMaterialModal('mat-1')">
                              ${Icons.download}
                              <span>Baixar Material Didático</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    else if (view === "calendario") {
      this.renderFullCalendar(schoolId, true, container);
    }

    else if (view === "tarefas") {
      const tasks = PratikaDB.getTasks(schoolId);
      const activeFilter = this.studentTasksFilter || "todas";
      
      const pendingCount = tasks.filter(t => t.status === "Pendente").length;
      const completedCount = tasks.filter(t => t.status === "Concluído").length;

      let filteredTasks = tasks;
      if (activeFilter === "pendentes") {
        filteredTasks = tasks.filter(t => t.status === "Pendente");
      } else if (activeFilter === "concluidas") {
        filteredTasks = tasks.filter(t => t.status === "Concluído");
      }

      container.innerHTML = `
        <!-- KPI Banner de Tarefas -->
        <div class="kpi-grid grid-2x2" style="margin-bottom: 1.5rem;">
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Total de Atividades</span></div>
            <div class="kpi-card-value" style="color: var(--primary-color);">${tasks.length}</div>
            <div class="kpi-card-trend">Semestre letivo</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Atividades Pendentes</span></div>
            <div class="kpi-card-value" style="color: var(--warning-color);">${pendingCount}</div>
            <div class="kpi-card-trend down">Aguardando entrega</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Atividades Entregues</span></div>
            <div class="kpi-card-value" style="color: var(--success-color);">${completedCount}</div>
            <div class="kpi-card-trend up">Corrigidas pelo tutor</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Média de Notas</span></div>
            <div class="kpi-card-value" style="color: #6C5CE7;">10.0 ⭐</div>
            <div class="kpi-card-trend up">Excelente desempenho</div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-card-header" style="flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div class="panel-card-title">Minha Grade de Atividades</div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">Entregue seus exercícios e confira o feedback do professor.</p>
            </div>
            <div class="tabs" style="border-bottom: none; margin-bottom: 0; gap: 0.5rem;">
              <button class="tab-btn ${activeFilter === 'todas' ? 'active' : ''}" onclick="app.setStudentTasksFilter('todas')">Todas (${tasks.length})</button>
              <button class="tab-btn ${activeFilter === 'pendentes' ? 'active' : ''}" onclick="app.setStudentTasksFilter('pendentes')">Pendentes (${pendingCount})</button>
              <button class="tab-btn ${activeFilter === 'concluidas' ? 'active' : ''}" onclick="app.setStudentTasksFilter('concluidas')">Concluídas (${completedCount})</button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${filteredTasks.map(t => {
              const isPending = t.status === "Pendente";
              return `
                <div style="padding: 1.25rem 1.5rem; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); display: flex; justify-content: space-between; align-items: center; background-color: var(--surface-color); transition: all 0.2s ease;">
                  <div style="flex: 1; padding-right: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem;">
                      <h4 style="font-family: var(--font-title); font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0;">${t.title}</h4>
                      <span class="badge ${isPending ? 'pending' : 'active'}">${t.status}</span>
                      ${!isPending ? `<span class="badge" style="background: rgba(34, 197, 94, 0.12); color: #16A34A; font-weight: 700;">Nota: ${t.grade || '10.0'} ⭐</span>` : ''}
                    </div>
                    <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem; line-height: 1.4;">${t.desc}</p>
                    <div style="display: flex; gap: 1.25rem; font-size: 0.775rem; color: var(--text-secondary);">
                      <span><strong>Data Limite:</strong> ${t.dueDate}</span>
                      ${isPending ? `<span style="color: #D97706; font-weight: 600;">● Prazo aberto</span>` : `<span style="color: var(--success-color); font-weight: 600;">✓ Entregue e avaliado</span>`}
                    </div>
                  </div>

                  <div style="display: flex; gap: 0.5rem; align-items: center;">
                    ${isPending ? `
                      <button class="btn btn-primary btn-sm" onclick="app.showSubmitTaskModal('${t.id}')">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="margin-right: 0.35rem;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Entregar Atividade
                      </button>
                    ` : `
                      <button class="btn btn-outline btn-sm" onclick="app.showTaskFeedbackModal('${t.id}')">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                        Ver Feedback do Professor
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    else if (view === "materiais") {
      const materials = PratikaDB.getMaterials(schoolId);
      container.innerHTML = `
        <div class="actions-row">
          <div class="search-input-wrapper">
            ${Icons.search}
            <input type="text" placeholder="••••••••••••" class="form-control">
          </div>
        </div>

        <div class="panel-card" style="margin-bottom: 1.5rem;">
          <div class="panel-card-header">
            <div>
              <div class="panel-card-title">Biblioteca de Materiais Didáticos</div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">Acesse PDFs, apostilas digitais, gravações e exercícios de fixação.</p>
            </div>
            <span class="badge active">${materials.length} Materiais Disponíveis</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${materials.map(m => `
              <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.25rem; background: var(--surface-color); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="badge" style="background: rgba(108, 92, 231, 0.1); color: #4F46E5; font-size: 0.7rem; font-weight: 700;">${m.type}</span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${m.duration || m.pages}</span>
                  </div>
                  <h4 style="font-family: var(--font-title); font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${m.title}</h4>
                  <p style="font-size: 0.8rem; color: var(--text-secondary);">${m.module}</p>
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                  <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="app.showLessonMaterialModal('${m.id}')">Visualizar</button>
                  <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="app.downloadFile('${m.downloadUrl || m.url || '#'}')">
                    ${Icons.download} Baixar
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    else if (view === "mensagens") {
      this.renderChatInterface(schoolId, true, container);
    }

    else if (view === "financeiro") {
      const studentName = this.session.userName;
      const records = PratikaDB.getFinancial(schoolId);
      const student = PratikaDB.getStudents(schoolId).find(s => s.id === this.session.userId) || { course: "Inglês Intermediário B1" };
      const currentBill = records.find(r => r.status === "Em aberto") || records[0] || {
        id: "fin-1",
        dueDate: "25/05/2026",
        value: 197.00,
        status: "Em aberto",
        plan: "Inglês Pro"
      };

      container.innerHTML = `
        <!-- Barra de Ações Rápidas -->
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <button class="btn btn-outline" style="font-weight: 700;" onclick="app.showChangePaymentMethodModal()">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            Gerenciar Cartão da Assinatura
          </button>
          <button class="btn btn-primary" style="background: linear-gradient(135deg, #6C5CE7 0%, #4F46E5 100%); font-weight: 700; box-shadow: 0 4px 14px rgba(108, 92, 231, 0.25);" onclick="app.showPlanRenewalModal()">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Renovar / Fazer Upgrade
          </button>
        </div>

        <!-- Card de Assinatura Recorrente Ativa -->
        <div class="panel-card" style="margin-bottom: 1.5rem; border-top: 4px solid var(--primary-color);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              </div>
              <div>
                <h3 style="font-family: var(--font-title); font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0;">Assinatura Recorrente Ativa</h3>
                <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.1rem;">Contrato de Prestação de Serviços Educacionais • ID: SUB-2026.8912</div>
              </div>
            </div>
            <span class="badge active" style="font-size: 0.8rem; padding: 0.35rem 0.75rem; display: inline-flex; align-items: center;">
              <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#10B981; margin-right:0.4rem;"></span>
              Renovação Automática Habilitada
            </span>
          </div>

          <!-- Grade de Informações do Plano Recorrente -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div style="background: #F8FAFC; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Plano Contratado</div>
              <div style="font-size: 1rem; font-weight: 800; color: #0F172A; margin-top: 0.2rem;">${student.course || 'Inglês Intermediário B1'}</div>
              <div style="font-size: 0.75rem; color: var(--primary-color); font-weight: 600;">Semestral (Aulas Ao Vivo)</div>
            </div>

            <div style="background: #F8FAFC; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Valor Recorrente</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-color); margin-top: 0.15rem;">R$ ${currentBill.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span style="font-size: 0.75rem; color: #64748B; font-weight: 600;">/ mês</span></div>
              <div style="font-size: 0.75rem; color: var(--success-color); font-weight: 600;">Desconto Pontualidade Incluso</div>
            </div>

            <div style="background: #F8FAFC; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Forma de Cobrança</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #0F172A; margin-top: 0.2rem; display: flex; align-items: center; gap: 0.4rem;">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#4F46E5" stroke-width="2" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                <span>Mastercard •••• 4242</span>
              </div>
              <div style="font-size: 0.75rem; color: #64748B;">Débito automático no vencimento</div>
            </div>

            <div style="background: #F8FAFC; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Próxima Cobrança / Vencimento</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-top: 0.2rem;">${currentBill.dueDate}</div>
              <div style="font-size: 0.75rem; color: #64748B;">Parcela 3 de 6 (Ciclo 2026.1)</div>
            </div>
          </div>

          <!-- Banner de Ação Rápida de Pagamento -->
          <div style="background: ${currentBill.status === 'Pago' ? '#F0FDF4' : 'rgba(108, 92, 231, 0.05)'}; border: 1px solid ${currentBill.status === 'Pago' ? '#BBF7D0' : 'rgba(108, 92, 231, 0.2)'}; border-radius: 8px; padding: 1.15rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: ${currentBill.status === 'Pago' ? '#DCFCE7' : '#EEF2FF'}; color: ${currentBill.status === 'Pago' ? '#16A34A' : '#4F46E5'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${currentBill.status === 'Pago' ? `
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ` : `
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                `}
              </div>
              <div>
                <div style="font-weight: 800; font-size: 0.95rem; color: ${currentBill.status === 'Pago' ? '#15803D' : '#1E1B4B'};">
                  ${currentBill.status === 'Pago' ? 'Sua mensalidade atual está 100% quitada!' : `Fatura de Maio/2026 no valor de R$ ${currentBill.value.toFixed(2)} pronta para pagamento`}
                </div>
                <div style="font-size: 0.8rem; color: ${currentBill.status === 'Pago' ? '#166534' : '#4B5563'}; margin-top: 0.1rem;">
                  ${currentBill.status === 'Pago' ? `Próxima cobrança programada automaticamente para o próximo mês.` : `Você pode antecipar o pagamento via Pix Instantâneo ou Cartão a qualquer momento.`}
                </div>
              </div>
            </div>
            <div>
              ${currentBill.status === 'Pago' ? `
                <button class="btn btn-outline" style="border-color: #86EFAC; color: #16A34A; background: #FFF; font-weight: 700;" onclick="app.showReceiptModal('${currentBill.id}')">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  Ver Recibo Oficial
                </button>
              ` : `
                <button class="btn btn-primary" style="height: 44px; font-weight: 700; padding: 0 1.75rem; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);" onclick="app.showStudentPaymentModal('${currentBill.id}')">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  Pagar Mensalidade Agora
                </button>
              `}
            </div>
          </div>
        </div>

        <!-- Banner de Renovação & Upgrade -->
        <div style="background: linear-gradient(135deg, rgba(108, 92, 231, 0.08) 0%, rgba(79, 70, 229, 0.03) 100%); border: 1px dashed #C7D2FE; border-radius: var(--border-radius-md); padding: 1.5rem 1.75rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1rem; color: #1E1B4B;">Renovação de Matrícula Antecipada com até 20% OFF</div>
              <p style="font-size: 0.825rem; color: #4B5563; margin-top: 0.15rem;">Garanta sua vaga para o próximo período e desbloqueie aulas exclusivas de conversação.</p>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" style="background: #FFF; font-weight: 700; border-color: #A5B4FC; color: #4F46E5;" onclick="app.showPlanRenewalModal()">
            Ver Opções de Renovação
          </button>
        </div>

        <!-- Histórico de Faturas -->
        <div class="panel-card">
          <div class="panel-card-header"><div class="panel-card-title">Histórico de Faturas</div></div>
          <div class="table-container">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>DESCRIÇÃO DO CICLO</th>
                  <th>DATA VENCIMENTO</th>
                  <th>VALOR</th>
                  <th>STATUS</th>
                  <th style="text-align: right;">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(r => {
                  const isPaid = r.status === 'Pago';
                  return `
                    <tr>
                      <td style="font-weight: 600; color: var(--text-primary);">${r.description || `Mensalidade - ${r.dueDate.split("/")[1]}/2026`}</td>
                      <td>${r.dueDate}</td>
                      <td style="font-weight: 700;">R$ ${r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td><span class="badge ${isPaid ? 'active' : r.status === 'Atrasado' ? 'danger' : 'pending'}">${r.status}</span></td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-stud-fat-${r.id}', this)" title="Ações da fatura">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-stud-fat-${r.id}">
                            <button class="dropdown-item" onclick="app.showReceiptModal('${r.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                              <span>Ver Recibo Oficial</span>
                            </button>
                            ${!isPaid ? `
                              <button class="dropdown-item" style="color: #4F46E5; font-weight: 700;" onclick="app.showStudentPaymentModal('${r.id}')">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                <span>Pagar Mensalidade</span>
                              </button>
                            ` : ''}
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    else if (view === "perfil") {
      const student = PratikaDB.getStudents(schoolId).find(s => s.id === this.session.userId) || {
        name: this.session.userName,
        email: this.session.userEmail,
        course: "Inglês Intermediário B1",
        progress: 72,
        status: "Ativo",
        lastAccess: "Hoje às 11:20"
      };

      const teachers = PratikaDB.getTeachers(schoolId);
      const myTeacher = teachers[0]?.name || "Prof. Lucas Martins";

      container.innerHTML = `
        <div style="width: 100%; max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Banner Superior com Informações Rápidas -->
          <div style="background: linear-gradient(135deg, rgba(108, 92, 231, 0.12) 0%, rgba(139, 124, 246, 0.05) 100%); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <div style="position: relative;">
                <img src="${this.session.userPic}" alt="Perfil" style="width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 3px solid white; box-shadow: var(--shadow-md);">
                <span style="position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px; background: var(--success-color); border: 2px solid white; border-radius: 50%;"></span>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <h3 style="font-family: var(--font-title); font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">${this.session.userName}</h3>
                  <span class="badge active" style="font-size: 0.75rem;">Matrícula Ativa</span>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.2rem;">Aluno no portal <strong>${PratikaDB.getSchool(schoolId)?.name || 'Pratika Idiomas'}</strong></p>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.35rem;">Último acesso: <strong>Hoje às 12:30</strong> • Frequência: <strong style="color: var(--success-color);">98%</strong></div>
              </div>
            </div>

            <div>
              <button class="btn btn-outline btn-sm" onclick="app.showProfilePhotoModal()">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                Alterar Foto
              </button>
            </div>
          </div>

          <!-- Grade de 2 Colunas com Mais Largura -->
          <div style="display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; align-items: flex-start;">
            
            <!-- Coluna Esquerda: Dados Acadêmicos & Progresso -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="panel-card" style="padding: 1.5rem;">
                <div class="panel-card-header" style="margin-bottom: 1.25rem;">
                  <div class="panel-card-title">Resumo Acadêmico</div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div style="background: #F8FAFC; padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                    <div style="font-size: 0.725rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Curso Matriculado</div>
                    <div style="font-size: 0.95rem; font-weight: 800; color: var(--primary-color); margin-top: 0.25rem;">${student.course || "Inglês Intermediário B1"}</div>
                  </div>

                  <div style="background: #F8FAFC; padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
                    <div style="font-size: 0.725rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Professor Tutor</div>
                    <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 0.25rem;">${myTeacher}</div>
                  </div>
                </div>
              </div>

              <div class="panel-card" style="padding: 1.5rem; background: #FAFBFC;">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">Suporte & Coordenação</div>
                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45;">Precisa alterar seu plano ou trocar de turma? Converse com a equipe pedagógica pelo chat interno.</p>
                <button class="btn btn-secondary btn-sm btn-full" style="margin-top: 1rem;" onclick="window.location.hash = '#/aluno/mensagens'">Abrir Chat Pedagógico</button>
              </div>
            </div>

            <!-- Coluna Direita: Formulário Completo de Dados Pessoais e Segurança -->
            <div class="panel-card" style="padding: 2rem;">
              <div class="panel-card-header" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
                <div class="panel-card-title">Informações Pessoais & Contato</div>
              </div>

              <form id="student-profile-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label>Nome Completo</label>
                    <input type="text" id="prof-student-name" class="form-control" value="${this.session.userName}" required>
                  </div>
                  <div class="form-group">
                    <label>E-mail Acadêmico (Login)</label>
                    <input type="email" class="form-control" value="${this.session.userEmail}" disabled style="background-color: #F3F4F6; cursor: not-allowed;">
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input type="text" id="prof-student-phone" class="form-control" value="(11) 98765-4321">
                  </div>
                  <div class="form-group">
                    <label>Idioma Preferencial do Portal</label>
                    <select class="form-control" id="prof-student-lang">
                      <option selected>Português (Brasil)</option>
                      <option>English (US)</option>
                      <option>Español</option>
                    </select>
                  </div>
                </div>

                <div class="form-group" style="margin-top: 1rem;">
                  <label>Objetivo de Aprendizado</label>
                  <input type="text" class="form-control" value="Fluência para negócios internacionais e certificações TOEFL/IELTS">
                </div>

                <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color);">
                  <h4 style="font-family: var(--font-title); font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem;">Alterar Senha de Acesso</h4>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                      <label>Nova Senha</label>
                      <input type="password" placeholder="••••••••••••" class="form-control">
                    </div>
                    <div class="form-group">
                      <label>Confirmar Nova Senha</label>
                      <input type="password" placeholder="••••••••••••" class="form-control">
                    </div>
                  </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
                  <button type="submit" class="btn btn-primary">Salvar Alterações do Perfil</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;

      document.getElementById("student-profile-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const newName = document.getElementById("prof-student-name").value;
        this.session.userName = newName;
        this.showToast("Dados do perfil atualizados com sucesso!", "success");
        this.renderPortalLayout();
      });
    }
  }

  // ROTEAMENTO ADMIN MASTER
  renderAdminViews(view, container) {
    if (view === "dashboard") {
      const schools = PratikaDB.getSchools();
      const allStudents = PratikaDB.getStudents();
      const totalStudents = allStudents.length || 850;
      const totalTeachers = PratikaDB.getTeachers().length || 12;
      const totalMRR = schools.reduce((acc, c) => acc + (c.mrr || 24000), 0) || 167680;
      const platformRevenue = totalMRR * 0.10;

      container.innerHTML = `
        <!-- BANNER DE COMANDO SIMPLIFICADO -->
        <div style="background: linear-gradient(135deg, rgba(108, 92, 231, 0.08) 0%, rgba(34, 197, 94, 0.03) 100%); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background-color: var(--success-color); box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);"></span>
              <span style="font-size: 0.775rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Console Central Super Admin</span>
            </div>
            <h2 style="font-family: var(--font-title); font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 0.2rem;">
              Visão Geral do Ecossistema SaaS White Label
            </h2>
          </div>

          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="app.showAddSchoolModal()">
              ${Icons.plus} Cadastrar Escola
            </button>
            <button class="btn btn-outline btn-sm" onclick="app.showAdminGlobalTransferModal()">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.3rem;"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              Transferir Aluno
            </button>
            <button class="btn btn-secondary btn-sm" onclick="app.downloadFile('/whitelabel/api/export?collection=schools')">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.3rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Exportar
            </button>
          </div>
        </div>

        <!-- GRADE COM 6 KPIS EM 3 COLUNAS E 2 LINHAS ESPAÇOSAS -->
        <div class="kpi-grid" style=" gap: 1.25rem; margin-bottom: 1.5rem;">
          
          <!-- Linha 1 -->
          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Escolas Licenciadas</span>
              <div class="kpi-card-icon">${Icons.escola}</div>
            </div>
            <div class="kpi-card-value">${schools.length}</div>
            <div class="kpi-card-trend up">↑ 100% unidades ativas</div>
          </div>

          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Alunos no Ecossistema</span>
              <div class="kpi-card-icon">${Icons.alunos}</div>
            </div>
            <div class="kpi-card-value" style="color: var(--primary-color);">${totalStudents}</div>
            <div class="kpi-card-trend up">↑ 48 novos este mês</div>
          </div>

          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Professores SaaS</span>
              <div class="kpi-card-icon">${Icons.professores}</div>
            </div>
            <div class="kpi-card-value">${totalTeachers}</div>
            <div class="kpi-card-trend">Corpo Docente Conectado</div>
          </div>

          <!-- Linha 2 -->
          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Faturamento das Escolas (MRR)</span>
              <div class="kpi-card-icon">${Icons.financeiro}</div>
            </div>
            <div class="kpi-card-value" style="color: var(--text-primary);">R$ ${totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend up">↑ Volume transacionado</div>
          </div>

          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Receita da Plataforma (10%)</span>
              <div class="kpi-card-icon"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
            </div>
            <div class="kpi-card-value" style="color: var(--success-color);">R$ ${platformRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend up">Take-rate retido</div>
          </div>

          <div class="kpi-card" style="padding: 1.5rem;">
            <div class="kpi-card-header">
              <span class="kpi-card-title">Servidores LiveKit</span>
              <div class="kpi-card-icon"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
            </div>
            <div class="kpi-card-value" style="color: #6C5CE7;">Não configurado</div>
            <div class="kpi-card-trend" style="color: var(--success-color);">Configure o serviço</div>
          </div>

        </div>

        <!-- GRADE COM 2 COLUNAS EQUILIBRADAS -->
        <div class="dash-row" style="align-items: stretch;">
          
          <!-- Tabela de Escolas Licenciadas -->
          <div class="panel-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="panel-card-header" style="margin-bottom: 1rem;">
                <div>
                  <div class="panel-card-title">Desempenho das Escolas Licenciadas</div>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">Visão consolidada das unidades parceiras</p>
                </div>
                <a href="#/admin/escolas" class="btn btn-outline btn-sm">Ver todas</a>
              </div>

              <div class="table-container">
                <table class="premium-table">
                  <thead>
                    <tr>
                      <th>Escola Licenciada</th>
                      <th>Alunos</th>
                      <th>Faturamento Bruto</th>
                      <th>Taxa Plataforma</th>
                      <th style="text-align: right;">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${schools.map(s => {
                      const mrr = s.mrr || 24000;
                      const fee = mrr * 0.10;
                      const isSetupPending = s.status === 'Setup Pendente' || s.setupStatus === 'Pendente';
                      return `
                        <tr>
                          <td class="avatar-cell">
                            <div style="color: ${s.primaryColor}; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; background-color: #F3F4F6; border-radius: var(--border-radius-sm);">
                              ${s.logo}
                            </div>
                            <div>
                              <div class="avatar-cell-name">
                                ${s.name}
                                ${isSetupPending ? `<span class="badge pending" style="font-size: 0.65rem; padding: 0.12rem 0.45rem; margin-left: 0.35rem;">Setup Pendente</span>` : ''}
                              </div>
                              <div class="avatar-cell-email"><code>${s.domain}</code></div>
                            </div>
                          </td>
                          <td><strong>${s.studentCount}</strong></td>
                          <td style="font-weight: 700;">R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td style="color: var(--success-color); font-weight: 700;">R$ ${fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td style="text-align: right; white-space: nowrap;">
                            <div class="action-dropdown" style="display: inline-block;">
                              <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-adm-dash-${s.id}', this)" title="Ações da escola">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                              </button>
                              <div class="action-dropdown-menu" id="menu-adm-dash-${s.id}">
                                <button class="dropdown-item" onclick="app.login('escola', 'escola@email.com', '${s.id}')">
                                  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                  <span>Acessar Painel</span>
                                </button>
                                ${isSetupPending ? `
                                  <button class="dropdown-item" onclick="app.showSetupPaymentLinkModal('${s.id}')">
                                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    <span>Link de Setup</span>
                                  </button>
                                ` : ''}
                                <button class="dropdown-item" onclick="app.editSchoolColors('${s.id}')">
                                  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                                  <span>Configurar Cores</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Gráfico de Crescimento de MRR Consolidado -->
          <div class="panel-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="panel-card-header" style="margin-bottom: 1rem;">
                <div>
                  <div class="panel-card-title">Crescimento de Faturamento (2026)</div>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">Evolução de MRR consolidado</p>
                </div>
                <span class="badge active">+28% YoY</span>
              </div>

              <div class="chart-simulated" style="height: 175px;">
                <div class="chart-bar-container">
                  <div class="chart-bar-fill" style="height: 45%;" data-value="R$ 95k"></div>
                  <div class="chart-bar-label">Jan</div>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar-fill" style="height: 55%;" data-value="R$ 115k"></div>
                  <div class="chart-bar-label">Fev</div>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar-fill" style="height: 68%;" data-value="R$ 138k"></div>
                  <div class="chart-bar-label">Mar</div>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar-fill" style="height: 82%;" data-value="R$ 152k"></div>
                  <div class="chart-bar-label">Abr</div>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar-fill" style="height: 96%;" data-value="R$ 167.6k"></div>
                  <div class="chart-bar-label">Mai</div>
                </div>
              </div>
            </div>

            <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 0.85rem 1rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.725rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Previsão Q3/2026</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 0.1rem;">R$ 210.000,00 MRR</div>
              </div>
              <span class="badge active">Meta: +25%</span>
            </div>
          </div>

        </div>
      `;
    }

    else if (view === "cursos") {
      this.renderTeacherCoursesScreen(null, container);
    }
    else if (view === "curso") {
      const courseId = this.routeParams?.[0] || (PratikaDB.getCourses(null)[0]?.id || "curso-1");
      this.renderTeacherCourseManager(courseId, container);
    }
    else if (view === "assistir") {
      const courseId = this.routeParams?.[0] || "curso-1";
      const moduleId = this.routeParams?.[1] || "mod-1";
      const itemId = this.routeParams?.[2] || "item-1-1";
      this.renderLessonWatchScreen(courseId, moduleId, itemId, container);
    }
    
    else if (view === "escolas") {
      const schools = PratikaDB.getSchools();
      const totalMRR = schools.reduce((acc, c) => acc + (c.mrr || 24000), 0);

      container.innerHTML = `
        <div class="kpi-grid" style=" margin-bottom: 1.5rem;">
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Total de Unidades Parceiras</span></div>
            <div class="kpi-card-value" style="color: var(--primary-color);">${schools.length}</div>
            <div class="kpi-card-trend up">Todas as regiões</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Escolas em Operação</span></div>
            <div class="kpi-card-value" style="color: var(--success-color);">${schools.filter(s => s.status === 'Ativo').length}</div>
            <div class="kpi-card-trend up">White label ativo</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">MRR Consolidado B2B</span></div>
            <div class="kpi-card-value" style="color: #6C5CE7;">R$ ${totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend up">Faturamento recorrente</div>
          </div>
        </div>

        <div class="actions-row" style="flex-wrap: wrap; gap: 0.75rem; justify-content: space-between; margin-bottom: 1.5rem;">
          <div class="search-input-wrapper" style="flex: 1; max-width: 380px;">
            ${Icons.search}
            <input type="text" placeholder="Buscar escolas parceiras..." class="form-control" onkeyup="app.filterTableRows(this.value, 'admin-schools-table')">
          </div>
          <button class="btn btn-primary" onclick="app.showAddSchoolModal()">
            ${Icons.plus} Cadastrar Escola
          </button>
        </div>

        <div class="panel-card">
          <div class="panel-card-header">
            <div class="panel-card-title">Escolas Parceiras Licenciadas</div>
            <span class="badge active">${schools.length} unidades registradas</span>
          </div>
          <div class="table-container">
            <table class="premium-table" id="admin-schools-table">
              <thead>
                <tr>
                  <th>LOGO & NOME</th>
                  <th>DOMÍNIO CUSTOMIZADO</th>
                  <th>ALUNOS</th>
                  <th>PROFESSORES</th>
                  <th>STATUS</th>
                  <th style="text-align: right;">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                ${schools.map(s => {
                  const isSetupPending = s.status === 'Setup Pendente' || s.setupStatus === 'Pendente';
                  return `
                    <tr>
                      <td class="avatar-cell">
                        <div style="color: ${s.primaryColor}; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; background-color: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                          ${s.logo || Icons.escola}
                        </div>
                        <div>
                          <div class="avatar-cell-name" style="font-weight: 700; color: var(--text-primary);">${s.name}</div>
                          <div style="font-size: 0.75rem; color: var(--text-secondary);">${s.plan || 'Pro White Label'}</div>
                        </div>
                      </td>
                      <td><code style="font-size: 0.8rem; color: #4F46E5;">${s.domain}</code></td>
                      <td><strong>${s.studentCount || 0}</strong></td>
                      <td><strong>${s.teacherCount || 0}</strong></td>
                      <td><span class="badge ${s.status === 'Ativo' ? 'active' : isSetupPending ? 'pending' : 'inactive'}">${s.status}</span></td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-adm-esc-${s.id}', this)" title="Ações da escola">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-adm-esc-${s.id}">
                            <button class="dropdown-item" onclick="app.showSchoolOverview('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                              <span>Resumo da Unidade</span>
                            </button>
                            <button class="dropdown-item" onclick="app.editSchoolColors('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                              <span>Editar Cores & Marca</span>
                            </button>
                            ${isSetupPending ? `
                              <button class="dropdown-item" onclick="app.renderSchoolSetupSuccessModal('${s.id}')">
                                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                <span>Link de Setup</span>
                              </button>
                            ` : ''}
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    else if (view === "alunos") {
      const allStudents = PratikaDB.getStudents();
      const schools = PratikaDB.getSchools();
      const activeCount = allStudents.filter(s => s.status === "Ativo").length;

      container.innerHTML = `
        <div class="kpi-grid grid-2x2" style="margin-bottom: 1.5rem;">
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Base Global de Alunos</span></div>
            <div class="kpi-card-value" style="color: var(--primary-color);">${allStudents.length}</div>
            <div class="kpi-card-trend up">Todas as escolas</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Matrículas Ativas</span></div>
            <div class="kpi-card-value" style="color: var(--success-color);">${activeCount}</div>
            <div class="kpi-card-trend up">98% de retenção</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Escolas Vinculadas</span></div>
            <div class="kpi-card-value">${schools.length}</div>
            <div class="kpi-card-trend">Unidades ativas</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Transferências / Mês</span></div>
            <div class="kpi-card-value" style="color: #6C5CE7;">18</div>
            <div class="kpi-card-trend up">Histórico consolidado</div>
          </div>
        </div>

        <div class="actions-row" style="flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; gap: 0.75rem; flex: 1; min-width: 300px;">
            <div class="search-input-wrapper" style="flex: 1;">
              ${Icons.search}
              <input type="text" placeholder="Buscar por nome, RA ou escola..." class="form-control" onkeyup="app.filterTableRows(this.value, 'global-alunos-table')">
            </div>
            <select class="form-control" style="width: auto; min-width: 180px;" onchange="app.filterGlobalStudentsBySchool(this.value)">
              <option value="">Todas as Escolas</option>
              ${schools.map(sc => `<option value="${sc.id}">${sc.name}</option>`).join("")}
            </select>
          </div>
          
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-outline" onclick="app.showAdminGlobalTransferModal()">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              Transferir Aluno
            </button>
            <button class="btn btn-primary" onclick="app.downloadFile('/whitelabel/api/export?collection=students')">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Exportar Relatório
            </button>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-card-header"><div class="panel-card-title">Gestão Master de Alunos do Ecossistema</div></div>
          <div class="table-container">
            <table class="premium-table" id="global-alunos-table">
              <thead>
                <tr>
                  <th>Nome do Aluno</th>
                  <th>Escola Vinculada</th>
                  <th>Curso & Nível</th>
                  <th>Último Acesso</th>
                  <th>Status</th>
                  <th style="text-align: right;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${allStudents.map(s => {
                  const sc = PratikaDB.getSchool(s.schoolId);
                  const schoolName = sc?.name || "Escola Desconhecida";
                  const schoolColor = sc?.primaryColor || "#6C5CE7";
                  return `
                    <tr data-school-id="${s.schoolId}">
                      <td class="avatar-cell">
                        <img src="${s.profilePic}" alt="Foto">
                        <div>
                          <div class="avatar-cell-name">${s.name}</div>
                          <div class="avatar-cell-email">${s.email}</div>
                        </div>
                      </td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${schoolColor};"></span>
                          <strong style="color: var(--text-primary); font-size: 0.875rem;">${schoolName}</strong>
                        </div>
                      </td>
                      <td>${s.course}</td>
                      <td>${s.lastAccess}</td>
                      <td><span class="badge ${s.status === 'Ativo' ? 'active' : 'inactive'}">${s.status}</span></td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-adm-aluno-${s.id}', this)" title="Ações do aluno">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-adm-aluno-${s.id}">
                            <button class="dropdown-item" onclick="app.showStudentProfileModal('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                              <span>Visualizar Dossiê</span>
                            </button>
                            <button class="dropdown-item" onclick="app.showAdminGlobalTransferModal('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                              <span>Transferir Escola / Turma</span>
                            </button>
                            <button class="dropdown-item" onclick="app.showEnrollmentDeclarationModal('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                              <span>Declaração de Matrícula</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    else if (view === "financeiro") {
      const schools = PratikaDB.getSchools();
      const totalMRR = schools.reduce((acc, c) => acc + c.mrr, 0) || 167680;
      const platformFee = totalMRR * 0.10;
      const netSchoolsTransfer = totalMRR * 0.90;

      container.innerHTML = `
        <div class="kpi-grid" style="">
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Faturamento Total das Escolas (MRR)</span></div>
            <div class="kpi-card-value" style="color: var(--primary-color);">R$ ${totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend up">↑ Volume consolidado</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Repasse Líquido às Escolas (90%)</span></div>
            <div class="kpi-card-value" style="color: var(--success-color);">R$ ${netSchoolsTransfer.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend up">Disponível para repasse PIX</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header"><span class="kpi-card-title">Taxa da Plataforma Change Skills (10%)</span></div>
            <div class="kpi-card-value" style="color: #6C5CE7;">R$ ${platformFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="kpi-card-trend up">Receita SaaS retida</div>
          </div>
        </div>

        <!-- GRÁFICO DE FATURAMENTO POR ESCOLA COM CORES DAS MARCAS -->
        <div class="panel-card" style="margin-bottom: 1.5rem;">
          <div class="panel-card-header">
            <div>
              <div class="panel-card-title">Distribuição de Receita por Escola Parceira</div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">Participação de faturamento de cada unidade licenciada no ecossistema:</p>
            </div>
            <span class="badge active">${schools.length} Escolas Licenciadas</span>
          </div>

          <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; padding: 0.5rem 0;">
            <div class="donut-chart-container" style="background: conic-gradient(#10B981 0% 48%, #EF4444 48% 80%, #6C5CE7 80% 100%);">
              <div class="donut-chart-inner">
                <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Total</span>
                <span style="font-family: var(--font-title); font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">R$ 167.6k</span>
                <span style="font-size: 0.65rem; color: var(--success-color); font-weight: 700;">Consolidado</span>
              </div>
            </div>

            <div class="revenue-legend-grid" style="flex: 1; min-width: 250px;">
              <div class="revenue-legend-item">
                <div class="revenue-legend-color" style="background-color: #10B981;"></div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem;">
                    <span>Wizard Express SP</span>
                    <span style="color: #10B981;">48%</span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">R$ 80.486,40/mês • 480 Alunos</div>
                  <div class="progress-track" style="height: 6px; margin-top: 0.4rem;"><div class="progress-fill" style="width: 48%; background-color: #10B981;"></div></div>
                </div>
              </div>

              <div class="revenue-legend-item">
                <div class="revenue-legend-color" style="background-color: #EF4444;"></div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem;">
                    <span>Fisk Central RJ</span>
                    <span style="color: #EF4444;">32%</span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">R$ 53.657,60/mês • 250 Alunos</div>
                  <div class="progress-track" style="height: 6px; margin-top: 0.4rem;"><div class="progress-fill" style="width: 32%; background-color: #EF4444;"></div></div>
                </div>
              </div>

              <div class="revenue-legend-item">
                <div class="revenue-legend-color" style="background-color: #6C5CE7;"></div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem;">
                    <span>Change Skills Curitiba</span>
                    <span style="color: #6C5CE7;">20%</span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">R$ 33.536,00/mês • 120 Alunos</div>
                  <div class="progress-track" style="height: 6px; margin-top: 0.4rem;"><div class="progress-fill" style="width: 20%; background-color: #6C5CE7;"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TABELA DETALHADA DE FINANCEIRO DAS ESCOLAS -->
        <div class="panel-card">
          <div class="panel-card-header">
            <div class="panel-card-title">Extrato Financeiro Consolidado por Escola</div>
          </div>
          <div class="table-container">
            <table class="premium-table">
              <thead>
                <tr>
                  <th>Escola</th>
                  <th>Faturamento Bruto</th>
                  <th>Alunos</th>
                  <th>Taxa Change Skills (10%)</th>
                  <th>Repasse Líquido (90%)</th>
                  <th>Status de Repasse</th>
                  <th style="text-align: right;">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${schools.map(s => {
                  const mrr = s.mrr || 24500;
                  const fee = mrr * 0.10;
                  const net = mrr * 0.90;
                  return `
                    <tr>
                      <td class="avatar-cell">
                        <div style="color: ${s.primaryColor}; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background-color: #F3F4F6; border-radius: var(--border-radius-sm);">
                          ${s.logo || Icons.escola}
                        </div>
                        <div>
                          <div class="avatar-cell-name">${s.name}</div>
                          <div class="avatar-cell-email"><code>${s.domain}</code></div>
                        </div>
                      </td>
                      <td style="font-weight: 800; color: var(--text-primary);">R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td><strong>${s.studentCount || 0} alunos</strong></td>
                      <td style="color: #6C5CE7; font-weight: 700;">R$ ${fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td style="color: var(--success-color); font-weight: 800;">R$ ${net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td><span class="badge active">Liquidado</span></td>
                      <td style="text-align: right; white-space: nowrap;">
                        <div class="action-dropdown" style="display: inline-block;">
                          <button class="action-dots-btn" onclick="event.stopPropagation(); app.toggleActionDropdown('menu-adm-fin-${s.id}', this)" title="Ações financeiras">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                          </button>
                          <div class="action-dropdown-menu" id="menu-adm-fin-${s.id}">
                            <button class="dropdown-item" onclick="app.showSchoolFinancialStatementModal('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                              <span>Ver Extrato Detalhado</span>
                            </button>
                            <button class="dropdown-item" onclick="app.showSchoolOverview('${s.id}')">
                              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                              <span>Resumo da Escola</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    else if (view === "planos") {
      const plans = PratikaDB.getPlans();
      container.innerHTML = `
        <div class="actions-row">
          <div style="font-family: var(--font-title); font-weight: 700; font-size: 1.1rem;">Modelos de Assinatura</div>
          <button class="btn btn-primary" id="btn-novo-plano">${Icons.plus} Adicionar Plano</button>
        </div>

        <div class="cards-grid">
          ${plans.map(p => `
            <div class="card-item" style="justify-content: space-between;">
              <div>
                <div class="card-item-header" style="margin-bottom: 0.5rem;">
                  <div class="card-item-title">${p.name}</div>
                </div>
                <div style="font-family: var(--font-title); font-size: 1.5rem; font-weight: 800; color: var(--primary-color); margin-bottom: 1rem;">R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<span style="font-size: 0.8rem; font-weight: 500; color: var(--text-secondary);">/mês</span></div>
                <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem;">
                  ${p.features.map(f => `<li>${f}</li>`).join("")}
                </ul>
              </div>
              <div class="card-item-footer" style="gap: 0.5rem; display: flex;">
                <button class="btn btn-outline btn-sm" onclick="app.showEditPlanModal('${p.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="app.deleteSaaSPlan('${p.id}')">${Icons.trash}</button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
      document.getElementById("btn-novo-plano").addEventListener("click", () => this.showAddPlanModal());
    }

    else if (view === "configuracoes") {
      this.renderAdminSettings(this.adminSettingsActiveTab || 'general', container);
    }
  }

  switchAdminSettingsTab(tabId) {
    this.adminSettingsActiveTab = tabId;
    const container = document.getElementById("portal-main-view");
    if (container) {
      this.renderAdminSettings(tabId, container);
    }
  }

  renderAdminSettings(activeTab = 'general', container) {
    this.adminSettingsActiveTab = activeTab;
    const tabs = [
      { id: "general", label: "Identidade & Marca SaaS", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>` },
      { id: "streaming", label: "Infraestrutura & LiveKit", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>` },
      { id: "smtp", label: "E-mails & Notificações", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>` },
      { id: "split", label: "Split Financeiro & Gateway", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>` },
      { id: "security", label: "Segurança & Permissões", icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>` }
    ];

    let contentHTML = "";

    if (activeTab === "general") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Personalização White Label Master</div>
              <div class="settings-section-desc">Configure a logo, o nome e a paleta de cores institucional do ecossistema SaaS Change Skills.</div>
            </div>
            <span class="badge active" style="font-size: 0.75rem;">White Label SaaS Ativo</span>
          </div>

          <!-- Preview da Marca SaaS -->
          <div class="preview-brand-card" id="admin-brand-preview-card" style="border-left: 5px solid #6C5CE7; margin-bottom: 1.5rem;">
            <div class="preview-brand-header">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center;" id="admin-preview-logo-box">
                  <svg viewBox="0 0 24 24" width="26" height="26" stroke="#6C5CE7" stroke-width="2" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>
                <div>
                  <div style="font-size: 1.1rem; font-weight: 800;" id="admin-preview-name-text">Change Skills - LMS White Label</div>
                  <div style="font-size: 0.775rem; color: #94A3B8;" id="admin-preview-domain-text">changeskills.com.br</div>
                </div>
              </div>
              <span class="preview-brand-badge" style="background-color: #6C5CE7;">Console Central Super Admin</span>
            </div>
            <p style="font-size: 0.85rem; color: #E2E8F0; line-height: 1.45;" id="admin-preview-slogan-text">"A infraestrutura definitiva para escolas de idiomas White Label com salas interativas LiveKit."</p>
          </div>

          <form onsubmit="event.preventDefault(); app.showToast('Identidade visual e configurações do SaaS salvas com sucesso!', 'success')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Nome da Plataforma Principal</label>
                <input type="text" class="form-control" value="Change Skills - LMS White Label" required>
              </div>
              <div class="form-group">
                <label>Domínio Raiz do SaaS</label>
                <input type="text" class="form-control" value="changeskills.com.br" required>
              </div>
            </div>

            <div class="form-group">
              <label>Slogan / Mensagem Institucional</label>
              <input type="text" class="form-control" value="A infraestrutura definitiva para escolas de idiomas White Label com salas interativas LiveKit.">
            </div>

            <div class="form-group" style="margin-bottom: 1.75rem;">
              <label>Cor Principal da Plataforma Master</label>
              <p style="font-size: 0.775rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Selecione um tema pré-definido ou insira a cor hexadecimal da sua marca:</p>
              
              <div class="theme-picker-container">
                <div class="color-option selected" style="background-color: #6C5CE7;" data-primary="#6C5CE7" title="Roxo Moderno"></div>
                <div class="color-option" style="background-color: #EF4444;" data-primary="#EF4444" title="Vermelho Vibrante"></div>
                <div class="color-option" style="background-color: #22C55E;" data-primary="#22C55E" title="Verde Sucesso"></div>
                <div class="color-option" style="background-color: #0EA5E9;" data-primary="#0EA5E9" title="Azul Oceano"></div>
                <div class="color-option" style="background-color: #F59E0B;" data-primary="#F59E0B" title="Dourado / Âmbar"></div>
                <div class="color-option" style="background-color: #EC4899;" data-primary="#EC4899" title="Rosa Magenta"></div>
                <div class="color-option" style="background-color: #0D9488;" data-primary="#0D9488" title="Verde Petróleo"></div>
                
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-left: 0.5rem;">
                  <input type="color" value="#6C5CE7" style="width: 36px; height: 36px; border: none; border-radius: 50%; cursor: pointer; background: transparent;">
                  <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Personalizada</span>
                </div>
              </div>
            </div>

            <!-- Tipografia da Plataforma (Fonte) -->
            <div class="form-group" style="margin-bottom: 1.75rem; background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div>
                  <label style="font-weight: 800; font-size: 0.95rem; color: #0F172A; margin-bottom: 0.2rem;">Tipografia Institucional (Fonte Padrão)</label>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Família tipográfica do Google Fonts aplicada em todos os portais e consoles.</p>
                </div>
                <span class="badge active">Plus Jakarta Sans</span>
              </div>

              <div style="display: grid; grid-template-columns: 1.2fr 1.8fr; gap: 1.25rem; align-items: center;">
                <div>
                  <select class="form-control" style="font-weight: 700; height: 46px;">
                    <option value="Plus Jakarta Sans" selected>Plus Jakarta Sans (Padrão Tech & Elegante)</option>
                    <option value="Inter">Inter (SaaS Minimalista & Alta Legibilidade)</option>
                    <option value="Poppins">Poppins (Design Geométrico & Amigável)</option>
                    <option value="Montserrat">Montserrat (Corporativo & Marcante)</option>
                    <option value="Roboto">Roboto (Clássico, Neutro & Funcional)</option>
                    <option value="Outfit">Outfit (Visual Inovador & Clean)</option>
                    <option value="DM Sans">DM Sans (Elegante & Executivo)</option>
                    <option value="Sora">Sora (Moderno com Formas Distintas)</option>
                  </select>
                </div>

                <div style="background: white; border: 1px dashed var(--border-color); border-radius: 8px; padding: 0.85rem 1.15rem; font-family: 'Plus Jakarta Sans', sans-serif;">
                  <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">Aa Bb Cc 123 — Change Skills SaaS</div>
                  <div style="font-size: 0.775rem; color: #64748B; margin-top: 0.2rem;">Infraestrutura global de ensino e salas virtuais.</div>
                </div>
              </div>
            </div>

            <!-- Favicon do Navegador -->
            <div class="form-group" style="margin-bottom: 2rem; background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem;">
              <div style="margin-bottom: 0.75rem;">
                <label style="font-weight: 800; font-size: 0.95rem; color: #0F172A; margin-bottom: 0.2rem;">Favicon Padrão da Plataforma</label>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Ícone exibido na aba do navegador do Super Admin e portais.</p>
              </div>

              <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.25rem; align-items: center;">
                <div>
                  <label style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 0.4rem; display: block;">Ícones Rápidos</label>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${['🎓', '📚', '🌐', '💡', '🚀', '⭐', '🦉', '⚡'].map(emoji => `
                      <button type="button" style="width: 40px; height: 40px; border-radius: 8px; border: 2px solid ${emoji === '🎓' ? '#6C5CE7' : '#CBD5E1'}; background: white; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        ${emoji}
                      </button>
                    `).join("")}
                  </div>
                </div>

                <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-sm);">
                  <div style="background: #E2E8F0; padding: 0.4rem 0.75rem; display: flex; align-items: center; gap: 0.35rem;">
                    <span style="width: 9px; height: 9px; border-radius: 50%; background: #EF4444;"></span>
                    <span style="width: 9px; height: 9px; border-radius: 50%; background: #F59E0B;"></span>
                    <span style="width: 9px; height: 9px; border-radius: 50%; background: #10B981;"></span>
                    <span style="font-size: 0.65rem; color: #64748B; margin-left: 0.35rem;">Aba do Navegador</span>
                  </div>
                  <div style="padding: 0.5rem 0.75rem; display: flex; align-items: center; gap: 0.5rem; background: #F8FAFC; border-bottom: 2px solid #6C5CE7;">
                    <span style="font-size: 1.1rem;">🎓</span>
                    <span style="font-size: 0.75rem; font-weight: 700; color: #0F172A;">Change Skills - LMS White Label</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="submit" class="btn btn-primary">Salvar Identidade Visual Master</button>
            </div>
          </form>
        </div>
      `;
    } else if (activeTab === "streaming") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Servidores LiveKit Cloud & Vídeo em Alta Definição</div>
              <div class="settings-section-desc">Gerencie clusters de transmissão ao vivo WebRTC, credenciais e gravação automática em nuvem.</div>
            </div>
            <span class="badge active">LiveKit Pro Não configurado Uptime</span>
          </div>

          <form onsubmit="event.preventDefault(); app.showToast('Credenciais de streaming atualizadas e validadas!', 'success')">
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label style="font-weight: 700; font-size: 0.85rem;">LiveKit Server WebSocket URL</label>
              <input type="text" class="form-control" value="wss://live.changeskills.com.br" required style="font-family: monospace;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem;">API Key LiveKit</label>
                <input type="text" class="form-control" value="AK_LIVEKIT_981248012948" style="font-family: monospace;" required>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem;">API Secret LiveKit</label>
                <input type="password" class="form-control" value="sec_livekit_super_secret_key_prod" style="font-family: monospace;" required>
              </div>
            </div>

            <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; font-size: 0.85rem; color: #0F172A;">Cluster de Vídeo Principal</div>
                <div style="font-size: 0.775rem; color: #64748B; margin-top: 0.15rem;">São Paulo (sa-east-1) • Latência média: 18ms • Gravação S3 Ativa</div>
              </div>
              <span class="badge active">Latência 18ms</span>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="button" class="btn btn-outline" onclick="app.showToast('Configure um servidor LiveKit para habilitar a videoconferência.', 'info')">Testar Conexão</button>
              <button type="submit" class="btn btn-primary" style="height: 44px; font-weight: 700; padding: 0 1.75rem;">Salvar Configuração LiveKit</button>
            </div>
          </form>
        </div>
      `;
    } else if (activeTab === "smtp") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Gateway de E-mails Transacionais Master</div>
              <div class="settings-section-desc">Servidor central para disparo de e-mails de boas-vindas, faturas de setup e relatórios executivos.</div>
            </div>
            <span class="badge active">SendGrid Conectado</span>
          </div>

          <form onsubmit="event.preventDefault(); app.showToast('Configurações de SMTP Master salvas com sucesso!', 'success')">
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem;">Nome do Remetente Padrão</label>
                <input type="text" class="form-control" value="Sistema Change Skills White Label" required>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem;">E-mail do Remetente</label>
                <input type="email" class="form-control" value="notificacoes@changeskills.com.br" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem;">Servidor SMTP (Host)</label>
                <input type="text" class="form-control" value="smtp.sendgrid.net" required>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem;">Porta</label>
                <input type="text" class="form-control" value="587 (TLS)" required>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="button" class="btn btn-outline" onclick="app.sendTestEmail()">Enviar E-mail de Teste</button>
              <button type="submit" class="btn btn-primary" style="height: 44px; font-weight: 700; padding: 0 1.75rem;">Salvar SMTP Master</button>
            </div>
          </form>
        </div>
      `;
    } else if (activeTab === "split") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Split de Pagamentos & Conciliação Automática</div>
              <div class="settings-section-desc">Regras de divisão de receita entre a plataforma Change Skills SaaS (10%) e as escolas parceiras (90%).</div>
            </div>
            <span class="badge active">Split Veença / Asaas Ativo</span>
          </div>

          <form onsubmit="event.preventDefault(); app.showToast('Regras de split e webhooks atualizadas com sucesso!', 'success')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem;">Taxa Padrão Retida pelo SaaS (%)</label>
                <input type="number" class="form-control" value="10" min="1" max="50" required>
                <span style="font-size: 0.72rem; color: #64748B;">Receita retida de cada cobrança</span>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.85rem;">Repasse Líquido às Escolas (%)</label>
                <input type="number" class="form-control" value="90" readonly style="background: #F1F5F9;">
                <span style="font-size: 0.72rem; color: #64748B;">Liquidado via Pix D+1</span>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; font-size: 0.85rem;">Webhook de Notificação em Tempo Real</label>
              <input type="text" class="form-control" value="https://api.changeskills.com.br/v1/webhooks/veenca-split" style="font-family: monospace;" readonly>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="submit" class="btn btn-primary" style="height: 44px; font-weight: 700; padding: 0 1.75rem;">Salvar Regras de Split</button>
            </div>
          </form>
        </div>
      `;
    } else if (activeTab === "security") {
      contentHTML = `
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <div class="settings-section-title">Segurança, Chaves de API & Permissões Master</div>
              <div class="settings-section-desc">Controle de acesso restrito de super administradores e integridade do banco de dados.</div>
            </div>
            <span class="badge active">Segurança SSL 256-bit</span>
          </div>

          <form onsubmit="event.preventDefault(); app.showToast('Parâmetros de segurança e 2FA atualizados com sucesso!', 'success')">
            <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; color: #0F172A;">Autenticação em Dois Fatores (2FA) Obrigatória</div>
                  <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.2rem;">Exige código TOTP (Google Authenticator) para todos os logins com perfil Admin Master.</div>
                </div>
                <label class="switch" style="position: relative; display: inline-block; width: 44px; height: 24px;">
                  <input type="checkbox" checked style="opacity: 0; width: 0; height: 0;">
                  <span style="position: absolute; cursor: pointer; top:0; left:0; right:0; bottom:0; background-color: #10B981; border-radius: 24px;"></span>
                </label>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; font-size: 0.85rem;">Chave Secreta Master de API</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="password" id="admin-sec-key" value="sk_master_live_981a2938491823901bce781" class="form-control" style="font-family: monospace;" readonly>
                <button type="button" class="btn btn-outline" onclick="app.togglePasswordVisibility('admin-sec-key')" title="Mostrar/Ocultar">👁️</button>
                <button type="button" class="btn btn-secondary" onclick="navigator.clipboard.writeText('sk_master_live_981a2938491823901bce781'); app.showToast('Esta chave de demonstração não autentica chamadas da API. Use a sessão da sua conta.', 'info')">Copiar</button>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button type="submit" class="btn btn-primary" style="height: 44px; font-weight: 700; padding: 0 1.75rem;">Salvar Permissões de Segurança</button>
            </div>
          </form>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="settings-grid">
        <div class="settings-nav">
          ${tabs.map(t => `
            <div class="settings-nav-item ${activeTab === t.id ? 'active' : ''}" onclick="app.switchAdminSettingsTab('${t.id}')">
              ${t.icon}
              <span>${t.label}</span>
            </div>
          `).join("")}
        </div>

        <div class="settings-body">
          ${contentHTML}
        </div>
      </div>
    `;
  }

  // --- LIVEKIT CHAMADA AO VIVO (LAYOUT IMERSIVO) ---
  renderLiveKitRoom(lessonId) {
    const root = document.getElementById("app-root");
    
    // Obter dados da aula e escola correspondentes
    const db = PratikaDB.getDB();
    const lesson = db.lessons.find(l => l.id === lessonId) || db.lessons[0];
    const school = PratikaDB.getSchool(this.session.schoolId || "escola-1");

    // Limpa corpo para renderizar tela cheia escura
    root.innerHTML = `
      <div class="livekit-room ${this.liveKit.chatClosed ? 'chat-closed' : ''}">
        <!-- Vídeo Principal -->
        <div class="livekit-main-area">
          <div class="livekit-header">
            <div class="livekit-title">
              <span class="livekit-badge-live">AO VIVO</span>
              <h3>${lesson.title} - Aula ao vivo</h3>
            </div>
            <div class="livekit-time">Duração da chamada: 00:24:18</div>
          </div>
          
          <div class="livekit-video-grid">
            <div class="livekit-video-wrapper">
              ${this.liveKit.sharingScreen ? `
                <div class="livekit-main-video livekit-screen-share">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="var(--primary-color)" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  <h3>Você está compartilhando sua tela</h3>
                  <button class="btn btn-danger btn-sm" onclick="app.toggleLiveKitScreenShare()">Parar compartilhamento</button>
                </div>
              ` : `
                <!-- Teacher Webcam Mock -->
                <video class="livekit-main-video" autoplay loop muted playsinline>
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4" type="video/mp4">
                  <!-- Fallback image se a rede falhar -->
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Professora">
                </video>
              `}
              
              <div class="livekit-participant-overlay">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--success-color)"><circle cx="12" cy="12" r="10"></circle></svg>
                <span>Prof. Lucas Martins (Apresentador)</span>
              </div>
            </div>
          </div>
          
          <!-- Thumbnails dos participantes abaixo -->
          <div class="livekit-thumbnail-strip">
            <div class="livekit-thumbnail speaking">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Maria">
              <span>Maria Silva (Você)</span>
            </div>
            <div class="livekit-thumbnail">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" alt="Ana">
              <span>Ana Clara</span>
            </div>
            <div class="livekit-thumbnail">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="João">
              <span>João Pereira</span>
            </div>
          </div>
          
          <!-- Controles Inferiores -->
          <div class="livekit-controls">
            <div class="livekit-control-group">
              <div class="livekit-btn-label">
                <button class="livekit-btn ${this.liveKit.micMuted ? 'muted' : 'active'}" onclick="app.toggleLiveKitMic()">
                  ${this.liveKit.micMuted ? `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>` : Icons.mic}
                </button>
                <span>${this.liveKit.micMuted ? 'Ativar Som' : 'Mudo'}</span>
              </div>
              <div class="livekit-btn-label">
                <button class="livekit-btn ${this.liveKit.videoMuted ? 'muted' : 'active'}" onclick="app.toggleLiveKitVideo()">
                  ${this.liveKit.videoMuted ? `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7M23 7l-7 5 7 5V7z"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` : Icons.videoCamera}
                </button>
                <span>${this.liveKit.videoMuted ? 'Iniciar Vídeo' : 'Parar Vídeo'}</span>
              </div>
            </div>
            
            <div class="livekit-control-group">
              <div class="livekit-btn-label">
                <button class="livekit-btn ${this.liveKit.sharingScreen ? 'active' : ''}" onclick="app.toggleLiveKitScreenShare()">
                  ${Icons.screenShare}
                </button>
                <span>Compartilhar</span>
              </div>
              <div class="livekit-btn-label">
                <button class="livekit-btn" onclick="app.toggleLiveKitChatPanel()">
                  ${Icons.comunicacao}
                </button>
                <span>Chat</span>
              </div>
              <div class="livekit-btn-label">
                <button class="livekit-btn ${this.liveKit.handRaised ? 'active' : ''}" onclick="app.toggleLiveKitHand()">
                  ${Icons.hand}
                </button>
                <span>Erguer Mão</span>
              </div>
              <div class="livekit-btn-label">
                <button class="livekit-btn ${this.liveKit.recording ? 'active' : ''}" onclick="app.toggleLiveKitRecording()" style="color: ${this.liveKit.recording ? '#EF4444' : 'white'}">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10"></circle></svg>
                </button>
                <span>${this.liveKit.recording ? 'Gravando' : 'Gravar'}</span>
              </div>
            </div>
            
            <div class="livekit-control-group">
              <button class="livekit-btn-end" onclick="app.exitLiveKitRoom()">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="2.5" fill="none"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                Sair da Aula
              </button>
            </div>
          </div>
        </div>

        <!-- Painel Lateral (Chat/Alunos/Materiais) -->
        ${!this.liveKit.chatClosed ? `
          <aside class="livekit-panel">
            <div class="livekit-panel-tabs">
              <button class="livekit-panel-tab ${this.liveKit.activeTab === 'chat' ? 'active' : ''}" onclick="app.setLiveKitTab('chat')">Chat</button>
              <button class="livekit-panel-tab ${this.liveKit.activeTab === 'alunos' ? 'active' : ''}" onclick="app.setLiveKitTab('alunos')">Alunos (3)</button>
              <button class="livekit-panel-tab ${this.liveKit.activeTab === 'materiais' ? 'active' : ''}" onclick="app.setLiveKitTab('materiais')">Materiais</button>
            </div>
            
            <div class="livekit-panel-content">
              ${this.renderLiveKitPanelContent()}
            </div>
          </aside>
        ` : ''}
      </div>
    `;
  }

  renderLiveKitPanelContent() {
    const tab = this.liveKit.activeTab;
    
    if (tab === 'chat') {
      return `
        <div class="livekit-chat-messages">
          ${this.liveKit.messages.map(m => `
            <div class="livekit-chat-msg">
              <div class="livekit-chat-sender">${m.sender}</div>
              <div style="color: #E2E8F0;">${m.text}</div>
            </div>
          `).join("")}
        </div>
        <form id="livekit-chat-send-form" class="livekit-chat-input-wrapper">
          <input type="text" id="livekit-msg-input" placeholder="Digite uma mensagem na sala..." required autocomplete="off">
          <button type="submit" class="btn btn-primary btn-sm" style="padding: 0.5rem 0.75rem;">${Icons.plus}</button>
        </form>
      `;
    } 
    
    else if (tab === 'alunos') {
      return `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="livekit-panel-participant">
            <div class="livekit-panel-participant-info">
              <img src="${this.session.userPic}" alt="Perfil">
              <div>
                <div style="font-weight: 600;">${this.session.userName}</div>
                <div style="font-size: 0.7rem; color: var(--secondary-color);">Aluno (Você)</div>
              </div>
            </div>
            <div class="livekit-panel-participant-controls">
              ${this.liveKit.handRaised ? `<span style="color: var(--warning-color); margin-right: 0.5rem;">✋</span>` : ""}
              ${Icons.mic}
            </div>
          </div>
          <div class="livekit-panel-participant">
            <div class="livekit-panel-participant-info">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" alt="Ana">
              <div>
                <div style="font-weight: 600;">Ana Clara</div>
                <div style="font-size: 0.7rem; color: #94A3B8;">Aluno</div>
              </div>
            </div>
            <div class="livekit-panel-participant-controls">
              ${Icons.mic}
            </div>
          </div>
          <div class="livekit-panel-participant">
            <div class="livekit-panel-participant-info">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="João">
              <div>
                <div style="font-weight: 600;">João Pereira</div>
                <div style="font-size: 0.7rem; color: #94A3B8;">Aluno</div>
              </div>
            </div>
            <div class="livekit-panel-participant-controls">
              ${Icons.mic}
            </div>
          </div>
        </div>
      `;
    } 
    
    else if (tab === 'materiais') {
      const mats = PratikaDB.getMaterials(this.session.schoolId || "escola-1");
      return `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <h4 style="font-size: 0.85rem; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Material de Apoio da Aula</h4>
          ${mats.slice(0, 3).map(m => `
            <div class="livekit-panel-material-item">
              <div class="livekit-panel-material-info">
                ${Icons.materiais}
                <span>${m.title}</span>
              </div>
              <a href="#" class="btn btn-outline btn-sm" style="border-color: rgba(255,255,255,0.1); color: white; padding: 0.25rem 0.5rem;">${Icons.download}</a>
            </div>
          `).join("")}
        </div>
      `;
    }
  }

  // --- LIVEKIT CONTROL ACTIONS ---
  toggleLiveKitMic() {
    this.liveKit.micMuted = !this.liveKit.micMuted;
    this.renderLiveKitRoom("aula-1");
  }
  toggleLiveKitVideo() {
    this.liveKit.videoMuted = !this.liveKit.videoMuted;
    this.renderLiveKitRoom("aula-1");
  }
  toggleLiveKitScreenShare() {
    this.liveKit.sharingScreen = !this.liveKit.sharingScreen;
    this.renderLiveKitRoom("aula-1");
  }
  toggleLiveKitHand() {
    this.liveKit.handRaised = !this.liveKit.handRaised;
    this.renderLiveKitRoom("aula-1");
  }
  toggleLiveKitRecording() {
    this.liveKit.recording = !this.liveKit.recording;
    this.renderLiveKitRoom("aula-1");
  }
  toggleLiveKitChatPanel() {
    this.liveKit.chatClosed = !this.liveKit.chatClosed;
    this.renderLiveKitRoom("aula-1");
  }
  setLiveKitTab(tab) {
    this.liveKit.activeTab = tab;
    this.renderLiveKitRoom("aula-1");
    // Após redesenhar a sala, adiciona o event listener do form se estiver na tab de chat
    this.bindLiveKitChatInput();
  }
  bindLiveKitChatInput() {
    const form = document.getElementById("livekit-chat-send-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = document.getElementById("livekit-msg-input").value;
        this.liveKit.messages.push({ sender: this.session.userName, text });
        this.setLiveKitTab('chat');
      });
    }
  }
  exitLiveKitRoom() {
    this.applyWhiteLabelTheme(this.session.schoolId);
    if (this.session.role === "escola") {
      window.location.hash = "#/escola/aulas";
    } else {
      window.location.hash = "#/aluno/aulas";
    }
  }

  // --- ACTIONS & MODALS ---
  
  payRecord(id) {
    PratikaDB.payFinancial(id);
    this.renderInternalView();
  }

  deleteSaaSPlan(id) {
    PratikaDB.deletePlan(id);
    this.renderInternalView();
  }

  editSchoolColors(id) {
    // Redireciona simulando a escola para alterar as cores em tempo real nas configurações
    this.session.schoolId = id;
    this.session.role = "escola";
    const sch = PratikaDB.getSchool(id);
    this.session.userName = sch.name;
    window.location.hash = "#/escola/configuracoes";
  }

  // MODAL: CADASTRAR ALUNO
  showAddStudentModal() {
    const modalRoot = document.getElementById("action-modal-root");
    const teachers = PratikaDB.getTeachers(this.session.schoolId);
    const classes = PratikaDB.getClasses(this.session.schoolId);

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 480px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Novo Aluno</h3>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>
          
          <form id="add-student-form">
            <div class="form-group">
              <label>Nome Completo</label>
              <input type="text" id="m-student-name" class="form-control" required placeholder="Nome completo do aluno">
            </div>
            <div class="form-group">
              <label>E-mail de Login</label>
              <input type="email" id="m-student-email" class="form-control" required placeholder="aluno@email.com">
            </div>
            <div class="form-group">
              <label>Curso / Nível</label>
              <input type="text" id="m-student-course" class="form-control" required placeholder="Ex: Inglês Básico A1">
            </div>
            <div class="form-group">
              <label>Turma</label>
              <select id="m-student-class" class="form-control">
                ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Professor Atribuído</label>
              <select id="m-student-teacher" class="form-control">
                ${teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join("")}
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Cadastrar e Gerar Acesso</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
    
    document.getElementById("add-student-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("m-student-name").value;
      const email = document.getElementById("m-student-email").value;
      const course = document.getElementById("m-student-course").value;
      const classId = document.getElementById("m-student-class").value;
      const teacherId = document.getElementById("m-student-teacher").value;

      PratikaDB.addStudent({
        name,
        email,
        course,
        classId,
        teacherId,
        schoolId: this.session.schoolId
      });

      // Cria mensalidade mockada inicial para o aluno
      PratikaDB.addFinancial({
        studentName: name,
        plan: course,
        dueDate: "25/05/2026",
        value: 197.00,
        schoolId: this.session.schoolId
      });

      modalRoot.innerHTML = "";
      this.renderInternalView();
    });
  }

  // MODAL: CADASTRAR PROFESSOR
  showAddTeacherModal() {
    const modalRoot = document.getElementById("action-modal-root");
    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 480px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Cadastrar Professor</h3>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>
          
          <form id="add-teacher-form">
            <div class="form-group">
              <label>Nome do Docente</label>
              <input type="text" id="m-teacher-name" class="form-control" required placeholder="Nome completo do professor">
            </div>
            <div class="form-group">
              <label>E-mail</label>
              <input type="email" id="m-teacher-email" class="form-control" required placeholder="professor@escola.com.br">
            </div>
            <div class="form-group">
              <label>Especialidade</label>
              <input type="text" id="m-teacher-spec" class="form-control" required placeholder="Ex: Conversação Avançada & IELTS">
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Disponibilidade Semanal</label>
              <input type="text" id="m-teacher-avail" class="form-control" required placeholder="Ex: Seg a Sex (Manhã/Noite)">
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Cadastrar Professor</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("add-teacher-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("m-teacher-name").value;
      const email = document.getElementById("m-teacher-email").value;
      const specialty = document.getElementById("m-teacher-spec").value;
      const availability = document.getElementById("m-teacher-avail").value;

      PratikaDB.addTeacher({
        name,
        email,
        specialty,
        classes: ["Novas Turmas"],
        availability,
        schoolId: this.session.schoolId
      });

      modalRoot.innerHTML = "";
      this.renderInternalView();
    });
  }

  setTurmasFilter(filter) {
    this.turmasFilter = filter;
    this.renderInternalView();
  }

  filterClassCards(query) {
    const q = (query || "").toLowerCase();
    const cards = document.querySelectorAll(".class-card-item");
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(q)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  // MODAL: CRIAR TURMA
  showAddClassModal() {
    const modalRoot = document.getElementById("action-modal-root");
    const teachers = PratikaDB.getTeachers(this.session.schoolId || "escola-1");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem; overflow-y: auto;">
        <div class="school-modal-card" style="max-width: 520px; background: #FFF; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 2px solid #F1F5F9; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem;">CADASTRO DE TURMA</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A;">Nova Turma Ativa</h3>
            </div>
            <button id="add-class-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>
          
          <form id="add-class-form">
            <div class="form-group">
              <label style="font-weight: 700; font-size: 0.85rem;">Nome da Turma / Curso</label>
              <input type="text" id="m-class-name" class="form-control" required placeholder="Ex: Inglês Intermediário B1">
            </div>
            <div class="form-group">
              <label style="font-weight: 700; font-size: 0.85rem;">Nível do Quadro Europeu (CEFR)</label>
              <select id="m-class-level" class="form-control" style="font-weight: 600;">
                <option value="A1">A1 - Iniciante</option>
                <option value="A2">A2 - Básico Elementar</option>
                <option value="B1" selected>B1 - Intermediário</option>
                <option value="B2">B2 - Intermediário Superior</option>
                <option value="C1">C1 - Avançado Operacional</option>
                <option value="C2">C2 - Domínio Pleno</option>
                <option value="Business">Business English Pro</option>
              </select>
            </div>
            <div class="form-group">
              <label style="font-weight: 700; font-size: 0.85rem;">Docente Tutor Responsável</label>
              <select id="m-class-teacher" class="form-control" style="font-weight: 600;">
                ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.specialty || 'Docente'})</option>`).join("")}
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem;">Dias da Semana</label>
                <input type="text" id="m-class-days" class="form-control" required placeholder="••••••••••••" value="Ter e Qui">
              </div>
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem;">Horário das Aulas</label>
                <input type="text" id="m-class-hours" class="form-control" required placeholder="••••••••••••" value="19:00 - 20:00">
              </div>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; font-size: 0.85rem;">Identificação da Sala Virtual LiveKit</label>
              <input type="text" id="m-class-room" class="form-control" required placeholder="••••••••••••" value="Sala LiveKit 0${Math.floor(1 + Math.random() * 5)}">
            </div>
            
            <button type="submit" class="btn btn-primary btn-full" style="height: 48px; font-weight: 800; font-size: 0.95rem;">
              ✓ Salvar e Ativar Turma
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("add-class-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("add-class-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("m-class-name").value;
      const level = document.getElementById("m-class-level").value;
      const teacherId = document.getElementById("m-class-teacher").value;
      const days = document.getElementById("m-class-days").value;
      const hours = document.getElementById("m-class-hours").value;
      const room = document.getElementById("m-class-room").value;

      PratikaDB.addClass({
        name,
        level,
        teacherId,
        days,
        hours,
        room,
        studentCount: 12,
        schoolId: this.session.schoolId || "escola-1"
      });

      modalRoot.innerHTML = "";
      this.showToast(`Turma "${name}" cadastrada e ativada com sucesso!`, "success");
      this.renderInternalView();
    });
  }

  // MODAL: GERENCIAMENTO DE TURMA
  showClassManagementModal(classId) {
    const modalRoot = document.getElementById("action-modal-root");
    const c = PratikaDB.getClass(classId) || PratikaDB.getClasses()[0] || {
      id: "turma-1",
      name: "Inglês Básico A1",
      level: "A1",
      days: "Seg e Qua",
      hours: "19:00 - 20:00",
      room: "Sala Virtual 01",
      studentCount: 15
    };

    const teachers = PratikaDB.getTeachers(this.session.schoolId || "escola-1");
    const teacher = teachers.find(t => t.id === c.teacherId) || teachers[0] || { name: "Prof. Lucas Martins" };
    const students = PratikaDB.getStudents(this.session.schoolId || "escola-1");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem; overflow-y: auto;">
        <div class="school-modal-card" style="max-width: 620px; background: #FFF; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F1F5F9; padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <div>
              <span class="badge active" style="margin-bottom: 0.3rem;">PAINEL DA TURMA</span>
              <h3 style="font-family: var(--font-title); font-size: 1.35rem; font-weight: 800; color: #0F172A; margin: 0;">${c.name}</h3>
              <p style="font-size: 0.85rem; color: #64748B; margin-top: 0.2rem;">${c.days} • ${c.hours} • ${c.room || 'Sala Virtual 01'}</p>
            </div>
            <button id="class-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <!-- Quick Stats -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem; text-align: center;">
              <span style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Docente</span>
              <div style="font-weight: 800; font-size: 0.9rem; color: #0F172A; margin-top: 0.2rem;">${teacher.name}</div>
            </div>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem; text-align: center;">
              <span style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Nível Acadêmico</span>
              <div style="font-weight: 800; font-size: 0.9rem; color: #4F46E5; margin-top: 0.2rem;">${c.level || 'A1'}</div>
            </div>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem; text-align: center;">
              <span style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Matriculados</span>
              <div style="font-weight: 800; font-size: 0.9rem; color: #16A34A; margin-top: 0.2rem;">${c.studentCount || 12} Alunos</div>
            </div>
          </div>

          <!-- Alunos Matriculados -->
          <div style="border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin-bottom: 1.25rem;">
            <div style="background: #F1F5F9; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; display: flex; justify-content: space-between; align-items: center;">
              <span>Alunos Alocados nesta Turma</span>
              <span style="font-size: 0.7rem; color: #4F46E5; cursor: pointer;" onclick="app.closeModal(); app.showAddStudentModal()">+ Alocar Aluno</span>
            </div>
            <div style="max-height: 180px; overflow-y: auto; padding: 0.5rem;">
              ${students.slice(0, 4).map(s => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; border-bottom: 1px solid #F1F5F9;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <img src="${s.profilePic}" alt="${s.name}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
                    <div>
                      <div style="font-weight: 700; font-size: 0.825rem; color: #0F172A;">${s.name}</div>
                      <div style="font-size: 0.72rem; color: #64748B;">${s.email}</div>
                    </div>
                  </div>
                  <span class="badge active" style="font-size: 0.68rem;">Matrícula Ativa</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Ações da Turma -->
          <div style="display: flex; gap: 0.75rem;">
            <a href="#/livekit/${c.id}" class="btn btn-primary" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;" onclick="document.getElementById('action-modal-root').innerHTML=''">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              Abrir Sala LiveKit
            </a>
            <button class="btn btn-outline" style="flex: 1;" onclick="navigator.clipboard.writeText('https://changeskills.com.br/#/livekit/${c.id}'); app.showToast('Link da sala LiveKit copiado!', 'success')">
              🔗 Copiar Link da Sala
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("class-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  // SLUG GENERATOR HELPER
  generateSchoolSlug(text) {
    if (!text) return "";
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // MODAL: CADASTRAR / LICENCIAR ESCOLA (ADMIN GLOBAL)
  showAddSchoolModal() {
    const modalRoot = document.getElementById("action-modal-root");
    
    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <span class="badge" style="background: rgba(99, 102, 241, 0.1); color: #4F46E5; font-size: 0.7rem; font-weight: 700;">WHITE LABEL SAAS B2B</span>
              </div>
              <h3 style="font-family:var(--font-title); font-size:1.35rem; font-weight:800; color: #0F172A;">Cadastrar Nova Escola</h3>
              <p style="font-size: 0.85rem; color: #64748B; margin-top: 0.2rem;">Cadastre a escola parceira, personalize o plano e gere o link de pagamento do setup para o lead.</p>
            </div>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 0.25rem;">${Icons.close}</button>
          </div>
          
          <form id="add-school-form">
            <!-- 1. Nome da Escola -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; color: #334155;">Nome da Escola <span style="color: #EF4444;">*</span></label>
              <input type="text" id="m-school-name" class="form-control" required placeholder="Nome da Escola Parceira" autocomplete="off">
            </div>

            <!-- 2. Subdomínio gerado baseado no nome da escola -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; color: #334155; display: flex; justify-content: space-between; align-items: center;">
                <span>Subdomínio da Escola (White Label) <span style="color: #EF4444;">*</span></span>
                <span style="font-size: 0.75rem; font-weight: 600; color: #4F46E5;">Gerado automaticamente</span>
              </label>
              <input type="text" id="m-school-domain" class="form-control" required placeholder="subdominio.changeskills.com.br">
              <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.35rem; font-size: 0.78rem; color: #64748B;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="#22C55E" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>Subdomínio gerado: <span class="subdomain-live-tag" id="m-preview-domain">escola.changeskills.com.br</span></span>
              </div>
            </div>

            <!-- 3. Dados do Lead / Responsável (para envio de e-mail de boas-vindas) -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 0.85rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: #334155;">E-mail do Responsável / Lead <span style="color: #EF4444;">*</span></label>
                <input type="email" id="m-school-email" class="form-control" required placeholder="contato@escola.com.br">
                <span style="font-size: 0.72rem; color: #64748B;">Receberá boas-vindas e cobrança</span>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: #334155;">Nome do Contato</label>
                <input type="text" id="m-school-lead-name" class="form-control" placeholder="Nome do Gestor Responsável">
                <span style="font-size: 0.72rem; color: #64748B;">Diretor / Mantenedor</span>
              </div>
            </div>

            <!-- 4. Plano Contratado B2B -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; color: #334155;">Plano Contratado B2B</label>
              <select id="m-school-plan" class="form-control">
                <option value="Pro" selected>Pro — Até 200 alunos (R$ 199,00/mês)</option>
                <option value="Starter">Starter — Até 50 alunos (R$ 99,00/mês)</option>
                <option value="Business">Business — Alunos ilimitados (R$ 399,00/mês)</option>
                <option value="Enterprise">Enterprise — Dedicado + SLA VIP (R$ 799,00/mês)</option>
                <option value="Personalizado">Personalizado — Módulos sob medida</option>
              </select>
            </div>

            <!-- 5. Select para Personalizar o Plano dependendo da situação -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; color: #334155; display: flex; justify-content: space-between; align-items: center;">
                <span>Personalização do Plano / Situação do Lead</span>
                <span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #059669; font-size: 0.7rem; font-weight: 700;">Personalizável</span>
              </label>
              <select id="m-school-customization" class="form-control">
                <option value="padrao" selected>Padrão do Plano (Sem personalização adicional)</option>
                <option value="custom_scale">Personalizado: Alta Escala (Alunos Expandidos + LiveKit Ilimitado)</option>
                <option value="custom_multi">Personalizado: Rede / Franquia Multi-Unidades (White Label Multidomínio)</option>
                <option value="custom_corporate">Personalizado: Corporativo & Parceria Especial (SLA 99.99% + APIs)</option>
                <option value="custom_manual">Personalizado: Configuração Manual de Módulos e Valores</option>
              </select>

              <!-- Painel de Customização de Recursos (Aparece quando selecionado personalizado) -->
              <div id="plan-custom-details" class="plan-custom-card" style="display: none;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #1E293B; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.35rem;">
                  <svg viewBox="0 0 24 24" width="15" height="15" stroke="#4F46E5" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  Recursos do Plano Personalizado:
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; font-size: 0.8rem; margin-bottom: 0.6rem;">
                  <div>
                    <label style="font-size: 0.72rem; color: #64748B; font-weight: 600; display: block; margin-bottom: 0.2rem;">Limite de Alunos</label>
                    <select id="m-custom-students" class="form-control" style="padding: 0.4rem 0.6rem; font-size: 0.8rem;">
                      <option value="50">Até 50 alunos</option>
                      <option value="200" selected>Até 200 alunos</option>
                      <option value="500">Até 500 alunos</option>
                      <option value="1500">Até 1.500 alunos</option>
                      <option value="unlimited">Alunos Ilimitados</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-size: 0.72rem; color: #64748B; font-weight: 600; display: block; margin-bottom: 0.2rem;">Salas LiveKit Simultâneas</label>
                    <select id="m-custom-livekit" class="form-control" style="padding: 0.4rem 0.6rem; font-size: 0.8rem;">
                      <option value="2">2 Salas Virtuais</option>
                      <option value="5" selected>5 Salas Virtuais</option>
                      <option value="15">15 Salas Virtuais</option>
                      <option value="unlimited">Salas Ilimitadas</option>
                    </select>
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.78rem; color: #475569;">
                  <label class="checkbox-label" style="font-size: 0.78rem; margin-bottom: 0;">
                    <input type="checkbox" id="m-chk-domain" checked> Domínio Próprio White Label (.com.br) & SSL
                  </label>
                  <label class="checkbox-label" style="font-size: 0.78rem; margin-bottom: 0;">
                    <input type="checkbox" id="m-chk-recording" checked> Gravação Automática de Aulas em Nuvem
                  </label>
                  <label class="checkbox-label" style="font-size: 0.78rem; margin-bottom: 0;">
                    <input type="checkbox" id="m-chk-api" checked> APIs Completas & Webhooks de Cobrança
                  </label>
                </div>
              </div>
            </div>

            <!-- 6. Valores: MRR Estimado e Taxa de Setup -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 1.5rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: #334155;">Faturamento Mensal Inicial</label>
                <input type="number" id="m-school-mrr" class="form-control" required placeholder="••••••••••••" value="4500.00" step="0.01">
                <span style="font-size: 0.72rem; color: #64748B;">MRR estimado da unidade</span>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: #334155;">Taxa de Setup / Implantação (R$)</label>
                <input type="number" id="m-school-setup" class="form-control" required placeholder="••••••••••••" value="1500.00" step="0.01">
                <span style="font-size: 0.72rem; color: #64748B;">Cobrança inicial de ativação</span>
              </div>
            </div>
            
            <!-- 7. Botão Cadastrar (substituindo "Ativar Licença B2B") -->
            <button type="submit" class="btn btn-primary btn-full" id="btn-submit-school" style="height: 48px; font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #4F46E5; border-color: #4F46E5;">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              Cadastrar Escola
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    // Sincronização em tempo real do Subdomínio baseado no Nome da Escola
    const nameInput = document.getElementById("m-school-name");
    const domainInput = document.getElementById("m-school-domain");
    const previewDomain = document.getElementById("m-preview-domain");
    let manualDomainEdit = false;

    nameInput.addEventListener("input", (e) => {
      if (!manualDomainEdit) {
        const slug = this.generateSchoolSlug(e.target.value);
        const domainVal = slug ? `${slug}.changeskills.com.br` : "";
        domainInput.value = domainVal;
        if (previewDomain) previewDomain.textContent = domainVal || "escola.changeskills.com.br";
      }
    });

    domainInput.addEventListener("input", (e) => {
      manualDomainEdit = true;
      if (previewDomain) previewDomain.textContent = domainInput.value || "escola.changeskills.com.br";
    });

    // Controle dinâmico do select de personalização
    const customSelect = document.getElementById("m-school-customization");
    const planSelect = document.getElementById("m-school-plan");
    const customBox = document.getElementById("plan-custom-details");
    const mrrInput = document.getElementById("m-school-mrr");
    const setupInput = document.getElementById("m-school-setup");

    const updateCustomVisibility = () => {
      const isCustom = customSelect.value !== "padrao" || planSelect.value === "Personalizado";
      customBox.style.display = isCustom ? "block" : "none";

      if (customSelect.value === "custom_scale") {
        mrrInput.value = "7800.00";
        setupInput.value = "2000.00";
      } else if (customSelect.value === "custom_multi") {
        mrrInput.value = "12500.00";
        setupInput.value = "3500.00";
      } else if (customSelect.value === "custom_corporate") {
        mrrInput.value = "18900.00";
        setupInput.value = "5000.00";
      } else if (customSelect.value === "padrao") {
        if (planSelect.value === "Starter") { mrrInput.value = "1800.00"; setupInput.value = "800.00"; }
        else if (planSelect.value === "Pro") { mrrInput.value = "4500.00"; setupInput.value = "1500.00"; }
        else if (planSelect.value === "Business") { mrrInput.value = "9800.00"; setupInput.value = "2500.00"; }
        else if (planSelect.value === "Enterprise") { mrrInput.value = "19500.00"; setupInput.value = "4500.00"; }
      }
    };

    customSelect.addEventListener("change", updateCustomVisibility);
    planSelect.addEventListener("change", updateCustomVisibility);

    // Submissão do Cadastro e Transição para a Tela de Pagamento do Setup
    document.getElementById("add-school-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("m-school-name").value.trim();
      const domain = document.getElementById("m-school-domain").value.trim();
      const leadEmail = document.getElementById("m-school-email").value.trim();
      const leadName = document.getElementById("m-school-lead-name").value.trim() || name;
      const plan = document.getElementById("m-school-plan").value;
      const customType = document.getElementById("m-school-customization").value;
      const mrr = parseFloat(document.getElementById("m-school-mrr").value) || 4500.00;
      const setupFee = parseFloat(document.getElementById("m-school-setup").value) || 1500.00;

      const slug = this.generateSchoolSlug(name) || "escola";
      const token = "sec_" + Math.random().toString(36).substring(2, 10);
      const setupPaymentLink = `https://pay.changeskills.com.br/checkout/setup-${slug}?token=${token}&amount=${setupFee.toFixed(2)}`;

      const customLabel = customType === "padrao" ? "Padrão" :
        customType === "custom_scale" ? "Alta Escala" :
        customType === "custom_multi" ? "Rede / Franquia" :
        customType === "custom_corporate" ? "Corporativo" : "Personalizado";

      const newSchool = PratikaDB.addSchool({
        name,
        domain,
        plan: `${plan} (${customLabel})`,
        mrr,
        setupFee,
        leadEmail,
        leadName,
        customization: customType,
        setupPaymentUrl: setupPaymentLink,
        status: "Setup Pendente",
        setupStatus: "Pendente",
        primaryColor: "#6C5CE7",
        secondaryColor: "#8B7CF6"
      });

      this.showToast(`Escola "${name}" cadastrada! Crie o acesso do gestor pelo botão Criar acesso.`, "success");

      // Exibe a tela de confirmação com o link de pagamento do setup para o lead
      this.renderSchoolSetupSuccessModal(newSchool.id);
    });
  }

  // TELA DE SUCESSO: E-MAIL ENVIADO + LINK DE PAGAMENTO DO SETUP NO MODAL
  renderSchoolSetupSuccessModal(schoolId) {
    const modalRoot = document.getElementById("action-modal-root");
    const school = PratikaDB.getSchool(schoolId);
    if (!school) return;

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card">
          
          <!-- Header de Sucesso -->
          <div style="text-align: center; margin-bottom: 1.25rem;">
            <div style="width: 54px; height: 54px; background-color: #DCFCE7; color: #16A34A; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style="font-family: var(--font-title); font-size: 1.35rem; font-weight: 800; color: #0F172A; margin-bottom: 0.25rem;">Escola Cadastrada com Sucesso!</h3>
            <p style="font-size: 0.875rem; color: #64748B;">A unidade <strong>${school.name}</strong> foi registrada no ecossistema White Label.</p>
          </div>

          <!-- Alerta de E-mail de Boas-Vindas Enviado -->
          <div class="setup-email-sent-badge" style="margin-bottom: 1.25rem;">
            <div style="color: #4F46E5; flex-shrink: 0; margin-top: 2px;">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #1E1B4B; margin-bottom: 0.15rem;">E-mail de Boas-Vindas e Cobrança Enviados</div>
              <div style="font-size: 0.8rem; color: #374151; line-height: 1.4;">
                Enviamos as orientações de boas-vindas e a cobrança da taxa de setup de <strong>R$ ${Number(school.setupFee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> para o e-mail: <strong style="color: #4F46E5;">${school.leadEmail}</strong>.
              </div>
              <div style="margin-top: 0.4rem;">
                <span class="badge pending" style="font-size: 0.72rem; font-weight: 700;">Status: Pagamento do Setup Pendente</span>
              </div>
            </div>
          </div>

          <!-- Caixa Destacada com o Link de Pagamento do Setup -->
          <div class="setup-payment-box">
            <label style="font-size: 0.85rem; font-weight: 700; color: #1E293B; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.5rem;">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#4F46E5" stroke-width="2.5" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              Link para o Lead Realizar o Pagamento do Setup:
            </label>
            
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
              <input type="text" id="m-setup-link-input" readonly value="${school.setupPaymentUrl}" class="form-control" style="font-family: monospace; font-size: 0.8rem; background: #FFFFFF; font-weight: 600; color: #4338CA; border-color: #CBD5E1;">
              <button type="button" id="btn-copy-setup-link" class="btn btn-primary" style="white-space: nowrap; padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.35rem; background: #4F46E5;">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span id="copy-btn-text">Copiar Link</span>
              </button>
            </div>

            <!-- Botões Auxiliares: Simular Pagamento e WhatsApp -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" id="btn-open-simulate-checkout" class="btn btn-outline btn-sm" style="flex: 1; font-weight: 700; color: #16A34A; border-color: #86EFAC; background: #F0FDF4; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Simular Pagamento do Lead
              </button>
              <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`Olá ${school.leadName}! Seu acesso ao Change Skills White Label está pronto. Segue o link para pagamento da taxa de setup de ativação: ${school.setupPaymentUrl}`)}" target="_blank" class="btn btn-outline btn-sm" style="font-weight: 700; color: #059669; border-color: #A7F3D0; background: #ECFDF5; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Enviar no WhatsApp
              </a>
            </div>
          </div>

          <!-- Resumo dos Dados Cadastrados -->
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.05em;">Resumo da Escola Cadastrada</div>
            <table class="setup-summary-table">
              <tr>
                <td style="color: #64748B; width: 40%;">Escola Parceira:</td>
                <td style="font-weight: 700; color: #0F172A;">${school.name}</td>
              </tr>
              <tr>
                <td style="color: #64748B;">Subdomínio:</td>
                <td><code style="color: #4F46E5; font-weight: 600;">${school.domain}</code></td>
              </tr>
              <tr>
                <td style="color: #64748B;">Plano Contratado:</td>
                <td style="font-weight: 600;">${school.plan}</td>
              </tr>
              <tr>
                <td style="color: #64748B;">Taxa de Setup:</td>
                <td style="font-weight: 800; color: #D97706;">R$ ${Number(school.setupFee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Pendente)</td>
              </tr>
              <tr>
                <td style="color: #64748B;">Faturamento Mensal:</td>
                <td style="font-weight: 700;">R$ ${school.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </table>
          </div>

          <!-- Botão Concluir -->
          <button type="button" id="btn-finish-school-modal" class="btn btn-primary btn-full" style="height: 46px; font-weight: 700; font-size: 0.95rem; background: #0F172A; border-color: #0F172A;">
            Concluir e Ver Escolas
          </button>
        </div>
      </div>
    `;

    // Ação: Copiar Link de Setup com Feedback Visual
    document.getElementById("btn-copy-setup-link").addEventListener("click", () => {
      const input = document.getElementById("m-setup-link-input");
      input.select();
      input.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(input.value).then(() => {
        const copyText = document.getElementById("copy-btn-text");
        copyText.textContent = "✓ Copiado!";
        this.showToast("Link de pagamento do setup copiado para a área de transferência!", "success");
        setTimeout(() => { if (copyText) copyText.textContent = "Copiar Link"; }, 2500);
      });
    });

    // Ação: Simular Pagamento do Lead
    document.getElementById("btn-open-simulate-checkout").addEventListener("click", () => {
      this.showSimulateCheckoutModal(schoolId);
    });

    // Ação: Concluir e Atualizar Listagem
    document.getElementById("btn-finish-school-modal").addEventListener("click", () => {
      modalRoot.innerHTML = "";
      this.renderInternalView();
    });
  }

  // MODAL PARA REABRIR O LINK DE SETUP A QUALQUER MOMENTO
  showSetupPaymentLinkModal(schoolId) {
    this.renderSchoolSetupSuccessModal(schoolId);
  }

  // SIMULADOR DE CHECKOUT DE PAGAMENTO DO SETUP DO LEAD
  showSimulateCheckoutModal(schoolId) {
    const modalRoot = document.getElementById("action-modal-root");
    const school = PratikaDB.getSchool(schoolId);
    if (!school) return;

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2001; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 490px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #4F46E5;">CHECKOUT DO LEAD • WHITE LABEL</div>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A;">Pagamento da Taxa de Setup</h3>
            </div>
            <button id="checkout-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem; border: 1px solid #E2E8F0; text-align: center;">
            <span style="font-size: 0.8rem; color: #64748B;">Valor Total do Setup de Implantação:</span>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0F172A; font-family: var(--font-title); margin-top: 0.2rem;">
              R$ ${Number(school.setupFee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div style="font-size: 0.8rem; color: #475569; margin-top: 0.25rem;">
              Escola: <strong>${school.name}</strong> (${school.domain})
            </div>
          </div>

          <!-- Abas de Pagamento (Pix, Cartão, Boleto) -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <button class="btn btn-outline btn-sm" style="flex: 1; background: #EEF2FF; border-color: #C7D2FE; color: #4F46E5; font-weight: 700;">Pix Instantâneo</button>
            <button class="btn btn-outline btn-sm" style="flex: 1; color: #64748B;">Cartão de Crédito</button>
            <button class="btn btn-outline btn-sm" style="flex: 1; color: #64748B;">Boleto Bancário</button>
          </div>

          <!-- Simulação do QR Code Pix -->
          <div style="text-align: center; padding: 1rem; border: 1px dashed #CBD5E1; border-radius: 8px; margin-bottom: 1.25rem; background: #FFF;">
            <svg viewBox="0 0 24 24" width="96" height="96" fill="none" stroke="#1E293B" stroke-width="1.5" style="margin: 0 auto;"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="3" height="3"></rect><rect x="18" y="14" width="3" height="3"></rect><rect x="14" y="18" width="7" height="3"></rect><line x1="7" y1="7" x2="7" y2="7"></line><line x1="17" y1="7" x2="17" y2="7"></line><line x1="7" y1="17" x2="7" y2="17"></line></svg>
            <div style="font-size: 0.8rem; font-weight: 600; color: #475569; margin-top: 0.5rem;">Escaneie o QR Code no app do seu banco</div>
            <div style="font-size: 0.72rem; color: #94A3B8;">Código Pix gerado pela Asaas/Stripe Gateway</div>
          </div>

          <button type="button" id="btn-confirm-checkout-payment" class="btn btn-primary btn-full" style="height: 48px; font-weight: 700; background: #16A34A; border-color: #16A34A; font-size: 0.95rem;">
            ✓ Confirmar Pagamento do Setup (Simulação)
          </button>
        </div>
      </div>
    `;

    document.getElementById("checkout-modal-close").addEventListener("click", () => {
      this.renderSchoolSetupSuccessModal(schoolId);
    });

    document.getElementById("btn-confirm-checkout-payment").addEventListener("click", () => {
      PratikaDB.paySchoolSetup(schoolId);
      modalRoot.innerHTML = "";
      this.showToast(`Pagamento do setup da escola "${school.name}" aprovado! Licença B2B ativada.`, "success");
      this.renderInternalView();
    });
  }

  // MODAL: CRIAR PLANO (ADMIN GLOBAL)
  showAddPlanModal() {
    const modalRoot = document.getElementById("action-modal-root");
    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 480px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Criar Novo Plano</h3>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>
          
          <form id="add-plan-form">
            <div class="form-group">
              <label>Nome do Plano</label>
              <input type="text" id="m-plan-name" class="form-control" required placeholder="Ex: Enterprise VIP">
            </div>
            <div class="form-group">
              <label>Preço Mensal (R$)</label>
              <input type="number" id="m-plan-price" class="form-control" required placeholder="Ex: 299.00">
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Recursos (Separados por vírgula)</label>
              <input type="text" id="m-plan-features" class="form-control" required placeholder="Recursos inclusos (separados por vírgula)">
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Criar Plano</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("add-plan-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("m-plan-name").value;
      const price = parseFloat(document.getElementById("m-plan-price").value);
      const featuresStr = document.getElementById("m-plan-features").value;
      const features = featuresStr.split(",").map(f => f.trim());

      PratikaDB.addPlan({ name, price, features });

      modalRoot.innerHTML = "";
      this.renderInternalView();
    });
  }

  // MODALS ESCOLA PARCEIRA
  showAddLessonModal() {
    const modalRoot = document.getElementById("action-modal-root");
    const teachers = PratikaDB.getTeachers(this.session.schoolId);

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 480px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Agendar Aula ao Vivo</h3>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>
          
          <form id="add-lesson-form">
            <div class="form-group">
              <label>Título da Aula</label>
              <input type="text" id="m-lesson-title" class="form-control" required placeholder="Título da Aula">
            </div>
            <div class="form-group">
              <label>Professor Palestrante</label>
              <select id="m-lesson-teacher" class="form-control">
                ${teachers.map(t => `<option value="${t.name}">${t.name}</option>`).join("")}
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Data e Horário</label>
              <input type="text" id="m-lesson-time" class="form-control" required placeholder="••••••••••••">
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Agendar Aula</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("add-lesson-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("m-lesson-title").value;
      const teacherName = document.getElementById("m-lesson-teacher").value;
      const time = document.getElementById("m-lesson-time").value;

      PratikaDB.addLesson({
        title,
        teacherName,
        time,
        schoolId: this.session.schoolId
      });

      modalRoot.innerHTML = "";
      this.renderInternalView();
    });
  }

  showAddMaterialModal() {
    const modalRoot = document.getElementById("action-modal-root");
    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 480px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Adicionar Material</h3>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>
          
          <form id="add-material-form">
            <div class="form-group">
              <label>Título do Material</label>
              <input type="text" id="m-mat-title" class="form-control" required placeholder="Título do Material Didático">
            </div>
            <div class="form-group">
              <label>Módulo</label>
              <input type="text" id="m-mat-module" class="form-control" required placeholder="Módulo ou Nível">
            </div>
            <div class="form-group">
              <label>Tipo de Arquivo</label>
              <select id="m-mat-type" class="form-control">
                <option>PDF</option>
                <option>Vídeo</option>
                <option>Áudio</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Tamanho / Páginas / Duração</label>
              <input type="text" id="m-mat-dur" class="form-control" required placeholder="••••••••••••">
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Cadastrar Material</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("add-material-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("m-mat-title").value;
      const module = document.getElementById("m-mat-module").value;
      const type = document.getElementById("m-mat-type").value;
      const dur = document.getElementById("m-mat-dur").value;

      const newMat = {
        title,
        module,
        type,
        schoolId: this.session.schoolId,
        downloadUrl: "#"
      };

      if (type === "PDF") newMat.pages = dur;
      else newMat.duration = dur;

      PratikaDB.addMaterial(newMat);

      modalRoot.innerHTML = "";
      this.renderInternalView();
    });
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-message ${type}`;
    const icon = type === "success" ? "✅" : "ℹ️";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- 3-DOTS ACTION DROPDOWN ---
  toggleActionDropdown(menuId, triggerEl) {
    const menu = document.getElementById(menuId);
    if (!menu) return;
    const isShowing = menu.classList.contains("show");
    document.querySelectorAll(".action-dropdown-menu.show").forEach(m => {
      m.classList.remove("show");
      m.style.position = "";
      m.style.top = "";
      m.style.left = "";
      m.style.right = "";
    });

    if (!isShowing) {
      menu.classList.add("show");
      
      const btn = triggerEl || menu.previousElementSibling || menu.parentElement;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const menuHeight = menu.offsetHeight || 220;
        const menuWidth = menu.offsetWidth || 210;
        const spaceBelow = window.innerHeight - rect.bottom;
        
        menu.style.position = "fixed";
        menu.style.zIndex = "99999";
        menu.style.right = "auto";
        menu.style.bottom = "auto";
        
        let leftPos = rect.right - menuWidth;
        if (leftPos < 10) leftPos = 10;
        menu.style.left = `${leftPos}px`;
        
        if (spaceBelow < menuHeight && rect.top > menuHeight) {
          menu.style.top = `${rect.top - menuHeight - 4}px`;
        } else {
          menu.style.top = `${rect.bottom + 4}px`;
        }
      }
    }
  }

  // --- SEARCH FILTER FOR TABLES ---
  filterTableRows(query, tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.querySelectorAll("tbody tr");
    const q = query.toLowerCase().trim();
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? "" : "none";
    });
  }

  // --- DIRECT INTERNAL CHAT ---
  openChatWithUser(role, userId) {
    const schoolId = this.session.schoolId || "escola-1";
    let targetUser = null;
    
    if (role === "aluno") {
      targetUser = PratikaDB.getStudent(userId);
    } else if (role === "professor") {
      targetUser = PratikaDB.getTeacher(userId);
    }

    if (targetUser) {
      this.activeChatContact = {
        role,
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        avatar: targetUser.profilePic || targetUser.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
        subtitle: targetUser.course || targetUser.specialty || (role === "aluno" ? "Aluno" : "Professor"),
        status: targetUser.status || "Online"
      };
    }

    if (this.session.role === "aluno") {
      window.location.hash = "#/aluno/mensagens";
    } else {
      window.location.hash = "#/escola/comunicacao";
    }
  }

  renderChatInterface(schoolId, isStudent = false, container) {
    const teachers = PratikaDB.getTeachers(schoolId);
    const students = PratikaDB.getStudents(schoolId);

    // Default contact if none active
    if (!this.activeChatContact) {
      if (isStudent) {
        const myTeacher = teachers[0] || { id: "prof-1", name: "Prof. Lucas Martins", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150", specialty: "Inglês & Fluência" };
        this.activeChatContact = {
          role: "professor",
          id: myTeacher.id,
          name: myTeacher.name,
          avatar: myTeacher.photo,
          subtitle: myTeacher.specialty,
          status: "Online"
        };
      } else {
        const firstStudent = students[0] || { id: "aluno-1", name: "Maria Silva", profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", course: "Inglês Intermediário B1" };
        this.activeChatContact = {
          role: "aluno",
          id: firstStudent.id,
          name: firstStudent.name,
          avatar: firstStudent.profilePic,
          subtitle: firstStudent.course,
          status: "Online"
        };
      }
    }

    const activeUser = this.activeChatContact;

    container.innerHTML = `
      <div class="chat-container">
        <div class="chat-sidebar">
          <div class="chat-sidebar-header" style="display: flex; justify-content: space-between; align-items: center;">
            <span>${isStudent ? "Minhas Conversas" : "Comunicação Pedagógica"}</span>
            <span class="badge active" style="font-size: 0.7rem;">Chat Direto</span>
          </div>

          <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color);">
            <input type="text" placeholder="Buscar conversa..." class="form-control" style="font-size: 0.825rem; padding: 0.4rem 0.75rem;" onkeyup="app.filterChatContacts(this.value)">
          </div>

          <div class="chat-user-list" id="chat-contacts-list">
            ${!isStudent ? `
              <div style="padding: 0.5rem 1rem 0.25rem; font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Professores</div>
              ${teachers.map(t => `
                <div class="chat-user-item ${activeUser && activeUser.id === t.id ? 'active' : ''}" onclick="app.openChatWithUser('professor', '${t.id}')">
                  <div class="chat-user-avatar ${t.status === 'Online' ? 'online' : ''}">
                    <img src="${t.photo}" alt="${t.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; display: block;">
                  </div>
                  <div class="chat-user-details">
                    <div class="chat-user-name">${t.name}</div>
                    <div class="chat-user-preview">${t.specialty}</div>
                  </div>
                </div>
              `).join("")}

              <div style="padding: 0.75rem 1rem 0.25rem; font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Alunos Matriculados</div>
              ${students.map(s => `
                <div class="chat-user-item ${activeUser && activeUser.id === s.id ? 'active' : ''}" onclick="app.openChatWithUser('aluno', '${s.id}')">
                  <div class="chat-user-avatar ${s.status === 'Ativo' ? 'online' : ''}">
                    <img src="${s.profilePic}" alt="${s.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; display: block;">
                  </div>
                  <div class="chat-user-details">
                    <div class="chat-user-name">${s.name}</div>
                    <div class="chat-user-preview">${s.course}</div>
                  </div>
                </div>
              `).join("")}
            ` : `
              <div style="padding: 0.5rem 1rem 0.25rem; font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Seus Professores & Apoio</div>
              ${teachers.map(t => `
                <div class="chat-user-item ${activeUser && activeUser.id === t.id ? 'active' : ''}" onclick="app.openChatWithUser('professor', '${t.id}')">
                  <div class="chat-user-avatar ${t.status === 'Online' ? 'online' : ''}">
                    <img src="${t.photo}" alt="${t.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; display: block;">
                  </div>
                  <div class="chat-user-details">
                    <div class="chat-user-name">${t.name}</div>
                    <div class="chat-user-preview">Professor • ${t.specialty}</div>
                  </div>
                </div>
              `).join("")}
              <div class="chat-user-item" onclick="app.showToast('Canal da Coordenação Pedagógica ativo', 'info')">
                <div class="chat-user-avatar">
                  <svg viewBox="0 0 24 24" width="30" height="30" stroke="#FFF" stroke-width="2" fill="none" style="background-color: var(--secondary-color); border-radius: 50%; padding: 5px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <div class="chat-user-details">
                  <div class="chat-user-name">Coordenação Pedagógica</div>
                  <div class="chat-user-preview">Secretaria e Suporte ao Aluno</div>
                </div>
              </div>
            `}
          </div>
        </div>
        
        <div class="chat-content">
          <div class="chat-content-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${activeUser.avatar}" alt="${activeUser.name}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;">
              <div>
                <div class="chat-active-name" style="font-size: 1rem; font-weight: 700;">${activeUser.name}</div>
                <div style="font-size: 0.775rem; color: var(--text-secondary);">${activeUser.subtitle} • <span style="color: var(--success-color); font-weight: 600;">${activeUser.status}</span></div>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              ${!isStudent ? (activeUser.role === 'professor' ? `<button class="btn btn-secondary btn-sm" onclick="app.showTeacherProfileModal('${activeUser.id}')">Ver Perfil</button>` : `<button class="btn btn-secondary btn-sm" onclick="app.showStudentProfileModal('${activeUser.id}')">Ver Perfil</button>`) : ''}
            </div>
          </div>
          
          <div class="chat-messages" id="chat-messages-container">
            <div class="chat-bubble received">
              Olá! Como posso te ajudar hoje com suas aulas e materiais?
              <div class="chat-bubble-time">18:30</div>
            </div>
            <div class="chat-bubble sent">
              Olá, ${activeUser.name}! Gostaria de tirar uma dúvida sobre o cronograma das próximas aulas ao vivo.
              <div class="chat-bubble-time">18:32</div>
            </div>
            <div class="chat-bubble received">
              Com certeza! O calendário está com todas as datas e links disponíveis. Você já confirmou a sua presença na aula de hoje?
              <div class="chat-bubble-time">18:34</div>
            </div>
          </div>
          
          <form id="chat-send-form" class="chat-input-area" onsubmit="app.sendChatMessage(event)">
            <input type="text" id="chat-input-field" class="form-control" placeholder="Digite uma mensagem..." required autocomplete="off">
            <button type="submit" class="btn btn-primary" style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; min-width: 44px;" title="Enviar mensagem">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    `;
  }

  filterChatContacts(query) {
    const list = document.getElementById("chat-contacts-list");
    if (!list) return;
    const items = list.querySelectorAll(".chat-user-item");
    const q = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? "flex" : "none";
    });
  }

  sendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById("chat-input-field");
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = "";

    const container = document.getElementById("chat-messages-container");
    if (!container) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Append sent message
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble sent";
    bubble.innerHTML = `${text}<div class="chat-bubble-time">${timeStr}</div>`;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;

    // Simulated auto-reply after 1.2s
    setTimeout(() => {
      const reply = document.createElement("div");
      reply.className = "chat-bubble received";
      reply.innerHTML = `Perfeito! Recebi sua mensagem: "${text}". Já estou registrando aqui no sistema Change Skills LMS! 🚀<div class="chat-bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
      container.appendChild(reply);
      container.scrollTop = container.scrollHeight;
    }, 1200);
  }

  // --- STUDENT MODALS & CRUD ---
  showStudentProfileModal(studentId) {
    const s = PratikaDB.getStudent(studentId);
    if (!s) return;
    const school = PratikaDB.getSchool(s.schoolId) || {};
    const teacher = PratikaDB.getTeachers(s.schoolId).find(t => t.id === s.teacherId)?.name || "Prof. Lucas Martins";
    const studentClass = PratikaDB.getClasses(s.schoolId).find(c => c.id === s.classId)?.name || s.course || "Inglês Básico A1";
    const ra = s.ra || `RA-${new Date().getFullYear()}.${String(studentId).replace(/\D/g, '') || '0418'}`;
    const phone = s.phone || "(41) 99872-3341";
    const enrollDate = s.enrollDate || "15/01/2026";
    const modalRoot = document.getElementById("action-modal-root");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; animation: fadeIn 0.2s ease; padding: 1rem;">
        <div class="auth-card" style="width:100%; max-width: 540px; box-shadow: var(--shadow-lg); padding: 2rem; border-radius: 16px; background: white;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge ${s.status === 'Ativo' ? 'active' : 'inactive'}">${s.status}</span>
              <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700;">Registro Acadêmico: ${ra}</span>
            </div>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <!-- Perfil Principal -->
          <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color);">
            <img src="${s.profilePic}" alt="${s.name}" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-color);">
            <div>
              <h3 style="font-family: var(--font-title); font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin: 0;">${s.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.15rem 0 0.35rem 0;">${s.email} • ${phone}</p>
              <span class="badge" style="background: rgba(108, 92, 231, 0.1); color: var(--primary-color); font-weight: 700; font-size: 0.75rem;">
                ${s.course}
              </span>
            </div>
          </div>

          <!-- Informações Administrativas e Acadêmicas Relevantes para a Escola -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="background: #F8FAFC; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Professor Responsável</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: #0F172A; margin-top: 0.15rem;">${teacher}</div>
            </div>

            <div style="background: #F8FAFC; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Turma Vinculada</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: #0F172A; margin-top: 0.15rem;">${studentClass}</div>
            </div>

            <div style="background: #F8FAFC; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Data de Matrícula</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: #0F172A; margin-top: 0.15rem;">${enrollDate}</div>
            </div>

            <div style="background: #F8FAFC; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Situação Financeira</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: var(--success-color); margin-top: 0.15rem;">Mensalidades em Dia ✓</div>
            </div>

            <div style="background: #F8FAFC; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Frequência Acadêmica</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: #0F172A; margin-top: 0.15rem;">94% de Presença</div>
            </div>

            <div style="background: #F8FAFC; padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Último Acesso ao LMS</div>
              <div style="font-size: 0.9rem; font-weight: 700; color: #0F172A; margin-top: 0.15rem;">${s.lastAccess}</div>
            </div>
          </div>

          <!-- Botões Executivos da Escola -->
          <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
            <button class="btn btn-primary btn-full" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; height: 44px; font-weight: 700;" onclick="app.closeModal(); app.showEnrollmentDeclarationModal('${s.id}')">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Declaração de Matrícula
            </button>
            <button class="btn btn-outline btn-full" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; height: 44px; font-weight: 700;" onclick="app.closeModal(); app.showTransferStudentModal('${s.id}')">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              Transferir Turma
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  showEditStudentModal(studentId) {
    const s = PratikaDB.getStudent(studentId);
    if (!s) return;
    const teachers = PratikaDB.getTeachers(s.schoolId);
    const modalRoot = document.getElementById("action-modal-root");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 480px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Editar Dados do Aluno</h3>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>
          
          <form id="edit-student-form">
            <div class="form-group">
              <label>Nome Completo</label>
              <input type="text" id="edit-student-name" class="form-control" required value="${s.name}">
            </div>
            <div class="form-group">
              <label>E-mail</label>
              <input type="email" id="edit-student-email" class="form-control" required value="${s.email}">
            </div>
            <div class="form-group">
              <label>Curso Ativo</label>
              <input type="text" id="edit-student-course" class="form-control" required value="${s.course}">
            </div>
            <div class="form-group">
              <label>Professor Atribuído</label>
              <select id="edit-student-teacher" class="form-control">
                ${teachers.map(t => `<option value="${t.id}" ${t.id === s.teacherId ? 'selected' : ''}>${t.name}</option>`).join("")}
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Status da Matrícula</label>
              <select id="edit-student-status" class="form-control">
                <option value="Ativo" ${s.status === 'Ativo' ? 'selected' : ''}>Ativo</option>
                <option value="Inativo" ${s.status === 'Inativo' ? 'selected' : ''}>Inativo</option>
                <option value="Trancado" ${s.status === 'Trancado' ? 'selected' : ''}>Trancado</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Salvar Alterações</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("edit-student-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("edit-student-name").value;
      const email = document.getElementById("edit-student-email").value;
      const course = document.getElementById("edit-student-course").value;
      const teacherId = document.getElementById("edit-student-teacher").value;
      const status = document.getElementById("edit-student-status").value;

      PratikaDB.updateStudent(studentId, { name, email, course, teacherId, status });
      modalRoot.innerHTML = "";
      this.showToast(`Dados de ${name} atualizados com sucesso!`, "success");
      this.renderInternalView();
    });
  }

  deleteStudentConfirm(studentId) {
    const s = PratikaDB.getStudent(studentId);
    if (!s) return;
    const modalRoot = document.getElementById("action-modal-root");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 420px; box-shadow: var(--shadow-lg); text-align: center;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); color: var(--error-color); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </div>
          <h3 style="font-family: var(--font-title); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">Remover Aluno?</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Tem certeza que deseja desmatricular <strong>${s.name}</strong>? Esta ação removerá o acesso aos conteúdos e turmas.</p>
          
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-outline btn-full" id="modal-cancel">Cancelar</button>
            <button class="btn btn-danger btn-full" id="modal-confirm-delete">Sim, Remover</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("modal-cancel").addEventListener("click", () => modalRoot.innerHTML = "");
    document.getElementById("modal-confirm-delete").addEventListener("click", () => {
      PratikaDB.deleteStudent(studentId);
      modalRoot.innerHTML = "";
      this.showToast(`Aluno ${s.name} removido com sucesso!`, "success");
      this.renderInternalView();
    });
  }

  showTransferStudentModal(studentId = null) {
    const schoolId = this.session.schoolId || "escola-1";
    const students = PratikaDB.getStudents(schoolId);
    const teachers = PratikaDB.getTeachers(schoolId);
    const classes = PratikaDB.getClasses(schoolId);
    const selectedStudent = studentId ? PratikaDB.getStudent(studentId) : students[0];
    const modalRoot = document.getElementById("action-modal-root");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000; animation: fadeIn 0.2s ease;">
        <div class="auth-card" style="width:100%; max-width: 520px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="width: 32px; height: 32px; border-radius: 6px; background: rgba(108, 92, 231, 0.1); color: var(--primary-color); display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              </div>
              <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Transferir Aluno</h3>
            </div>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>

          <form id="transfer-student-form">
            <div class="form-group">
              <label>Aluno Selecionado</label>
              <select id="transfer-student-id" class="form-control" ${studentId ? 'disabled' : ''}>
                ${students.map(st => `<option value="${st.id}" ${selectedStudent && selectedStudent.id === st.id ? 'selected' : ''}>${st.name} (${st.course})</option>`).join("")}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Novo Professor Responsável</label>
                <select id="transfer-target-teacher" class="form-control">
                  ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.specialty})</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label>Nova Turma / Nível</label>
                <select id="transfer-target-class" class="form-control">
                  <option>Inglês Intermediário B1</option>
                  <option>Inglês Avançado C1</option>
                  <option>Inglês Básico A1</option>
                  <option>Espanhol Conversação</option>
                  <option>Francês Intensivo</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Data de Efetivação da Transferência</label>
              <input type="date" id="transfer-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Motivo da Transferência (Histórico Pedagógico)</label>
              <textarea id="transfer-reason" class="form-control" rows="2" placeholder="Descreva o motivo da transferência do aluno..."></textarea>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button type="button" class="btn btn-outline btn-full" id="modal-cancel-btn">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-full">Confirmar Transferência</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
    document.getElementById("modal-cancel-btn").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("transfer-student-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const targetStudentId = studentId || document.getElementById("transfer-student-id").value;
      const targetTeacherId = document.getElementById("transfer-target-teacher").value;
      const targetCourse = document.getElementById("transfer-target-class").value;
      const st = PratikaDB.getStudent(targetStudentId);

      if (st) {
        PratikaDB.updateStudent(targetStudentId, {
          teacherId: targetTeacherId,
          course: targetCourse
        });
        this.showToast(`Transferência de ${st.name} para a turma ${targetCourse} concluída com sucesso!`, "success");
      }

      modalRoot.innerHTML = "";
      this.renderInternalView();
    });
  }

  showEnrollmentDeclarationModal(studentId) {
    const s = PratikaDB.getStudent(studentId);
    if (!s) return;
    const school = PratikaDB.getSchool(s.schoolId) || { name: "Pratika Idiomas", domain: "changeskills.com.br" };
    const modalRoot = document.getElementById("action-modal-root");
    const todayFormatted = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000; animation: fadeIn 0.2s ease;">
        <div class="auth-card" style="width:100%; max-width: 600px; box-shadow: var(--shadow-lg); padding: 2.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="color: ${school.primaryColor || '#6C5CE7'}; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background-color: #F3F4F6; border-radius: var(--border-radius-sm);">
                ${school.logo || Icons.escola}
              </div>
              <div>
                <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:800; color: var(--text-primary);">${school.name}</h3>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Declaração Oficial de Matrícula</span>
              </div>
            </div>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>

          <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 1.5rem; margin-bottom: 1.5rem; line-height: 1.6; font-size: 0.9rem; color: var(--text-primary);">
            <div style="text-align: center; font-weight: 800; font-family: var(--font-title); font-size: 1.05rem; margin-bottom: 1rem; text-transform: uppercase;">DECLARAÇÃO DE VÍNCULO ACADÊMICO</div>
            
            <p>Declaramos para os devidos fins de direito que o(a) aluno(a) <strong>${s.name}</strong>, portador(a) do e-mail <strong>${s.email}</strong>, encontra-se regularmente matriculado(a) nesta instituição de ensino no curso de <strong>${s.course}</strong> sob o status <strong>${s.status}</strong>.</p>
            
            <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary); display: flex; justify-content: space-between;">
              <span>Código de Autenticidade: <strong>PRAT-${s.id}-${Math.floor(1000 + Math.random() * 9000)}</strong></span>
              <span>Emitido em: <strong>${todayFormatted}</strong></span>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button class="btn btn-outline" id="modal-close-btn">Fechar</button>
            <button class="btn btn-primary" onclick="window.print();">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
    document.getElementById("modal-close-btn").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  filterGlobalStudentsBySchool(schoolId) {
    const table = document.getElementById("global-alunos-table");
    if (!table) return;
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
      if (!schoolId) {
        row.style.display = "";
      } else {
        const rowSchool = row.getAttribute("data-school-id");
        row.style.display = rowSchool === schoolId ? "" : "none";
      }
    });
  }

  showAdminGlobalTransferModal(studentId = null) {
    const allStudents = PratikaDB.getStudents();
    const schools = PratikaDB.getSchools();
    const selectedStudent = studentId ? PratikaDB.getStudent(studentId) : allStudents[0];
    const currentSchool = selectedStudent ? PratikaDB.getSchool(selectedStudent.schoolId) : schools[0];
    const modalRoot = document.getElementById("action-modal-root");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000; animation: fadeIn 0.2s ease;">
        <div class="auth-card" style="width:100%; max-width: 560px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="width: 34px; height: 34px; border-radius: 6px; background: rgba(108, 92, 231, 0.1); color: var(--primary-color); display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              </div>
              <div>
                <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Transferência Global de Aluno (Admin Master)</h3>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Migração de vínculo entre escolas ou turmas</span>
              </div>
            </div>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>

          <form id="admin-global-transfer-form">
            <div class="form-group">
              <label>Aluno a Ser Transferido</label>
              <select id="adm-transf-student-id" class="form-control" ${studentId ? 'disabled' : ''}>
                ${allStudents.map(st => {
                  const sc = PratikaDB.getSchool(st.schoolId)?.name || 'Escola';
                  return `<option value="${st.id}" ${selectedStudent && selectedStudent.id === st.id ? 'selected' : ''}>${st.name} — [${sc}]</option>`;
                }).join("")}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Escola de Destino</label>
                <select id="adm-transf-target-school" class="form-control">
                  ${schools.map(sc => `<option value="${sc.id}">${sc.name}</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label>Novo Curso / Turma</label>
                <select id="adm-transf-target-course" class="form-control">
                  <option>Inglês Intermediário B1</option>
                  <option>Inglês Avançado C1</option>
                  <option>Inglês Básico A1</option>
                  <option>Espanhol Conversação</option>
                  <option>Francês Intensivo</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Data de Efetivação</label>
              <input type="date" id="adm-transf-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Justificativa Administrativa Master</label>
              <textarea id="adm-transf-reason" class="form-control" rows="2" placeholder="Descreva o motivo da transferência global..."></textarea>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button type="button" class="btn btn-outline btn-full" id="adm-cancel-btn">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-full">Efetivar Transferência Global</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
    document.getElementById("adm-cancel-btn").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("admin-global-transfer-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const targetStudentId = studentId || document.getElementById("adm-transf-student-id").value;
      const targetSchoolId = document.getElementById("adm-transf-target-school").value;
      const targetCourse = document.getElementById("adm-transf-target-course").value;
      const targetSchool = PratikaDB.getSchool(targetSchoolId);
      const st = PratikaDB.getStudent(targetStudentId);

      if (st && targetSchool) {
        PratikaDB.transferStudentSchool(targetStudentId, targetSchoolId, targetCourse);
        this.showToast(`Transferência Global: Aluno ${st.name} transferido para ${targetSchool.name}!`, "success");
      }

      modalRoot.innerHTML = "";
      this.renderInternalView();
    });
  }

  toggleStudentLock(studentId) {
    const s = PratikaDB.getStudent(studentId);
    if (!s) return;
    const newStatus = s.status === "Ativo" ? "Inativo" : "Ativo";
    PratikaDB.updateStudent(studentId, { status: newStatus });
    this.showToast(`Status do aluno ${s.name} alterado para "${newStatus}"!`, newStatus === 'Ativo' ? 'success' : 'info');
    this.renderInternalView();
  }

  // --- TEACHER MODALS & CRUD ---
  showTeacherProfileModal(teacherId) {
    const t = PratikaDB.getTeacher(teacherId);
    if (!t) return;
    const modalRoot = document.getElementById("action-modal-root");
    const isStudent = (this.session.role === "aluno");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; animation: fadeIn 0.2s ease; padding: 1rem;">
        <div class="auth-card" style="width:100%; max-width: 520px; box-shadow: var(--shadow-lg); padding: 2rem; border-radius: 16px; background: white;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge ${t.status === 'Online' ? 'active' : 'inactive'}">${t.status}</span>
              <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700;">Docente ID: ${t.id}</span>
            </div>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color);">
            <img src="${t.photo}" alt="${t.name}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-color);">
            <div>
              <h3 style="font-family: var(--font-title); font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0;">${t.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.15rem;">${t.email}</p>
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--primary-color); margin-top: 0.35rem;">${t.specialty}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: #F9FAFB; padding: 0.85rem 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
              <div style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Disponibilidade</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 0.25rem;">${t.availability || "Seg a Sex"}</div>
            </div>
            <div style="background: #F9FAFB; padding: 0.85rem 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
              <div style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Próxima Aula</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 0.25rem;">${t.nextClass || "Hoje às 19:00"}</div>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; margin-bottom: 0.45rem;">Turmas Sob Gestão</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${(t.classes || ["Turma Básico A1"]).map(c => `<span class="badge active">${c}</span>`).join("")}
            </div>
          </div>

          <div>
            ${isStudent ? `
              <button class="btn btn-outline btn-full" style="height: 44px; font-weight: 700;" onclick="document.getElementById('action-modal-root').innerHTML=''">Fechar Dossiê</button>
            ` : `
              <div style="display: flex; gap: 0.75rem;">
                <button class="btn btn-secondary btn-full" style="height: 44px; font-weight: 700;" onclick="document.getElementById('action-modal-root').innerHTML=''; app.showEditTeacherModal('${t.id}')">Editar Docente</button>
                <button class="btn btn-primary btn-full" style="height: 44px; font-weight: 700;" onclick="document.getElementById('action-modal-root').innerHTML=''; app.openChatWithUser('professor', '${t.id}')">Iniciar Chat</button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  showEditTeacherModal(teacherId) {
    const t = PratikaDB.getTeacher(teacherId);
    if (!t) return;
    const modalRoot = document.getElementById("action-modal-root");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 480px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Editar Professor</h3>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>
          
          <form id="edit-teacher-form">
            <div class="form-group">
              <label>Nome do Docente</label>
              <input type="text" id="edit-teacher-name" class="form-control" required value="${t.name}">
            </div>
            <div class="form-group">
              <label>E-mail</label>
              <input type="email" id="edit-teacher-email" class="form-control" required value="${t.email}">
            </div>
            <div class="form-group">
              <label>Especialidade</label>
              <input type="text" id="edit-teacher-spec" class="form-control" required value="${t.specialty}">
            </div>
            <div class="form-group">
              <label>Disponibilidade Semanal</label>
              <input type="text" id="edit-teacher-avail" class="form-control" required value="${t.availability || 'Seg a Sex - Noite'}">
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Status</label>
              <select id="edit-teacher-status" class="form-control">
                <option value="Online" ${t.status === 'Online' ? 'selected' : ''}>Online</option>
                <option value="Offline" ${t.status === 'Offline' ? 'selected' : ''}>Offline</option>
                <option value="Em Aula" ${t.status === 'Em Aula' ? 'selected' : ''}>Em Aula</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Salvar Alterações</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("edit-teacher-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("edit-teacher-name").value;
      const email = document.getElementById("edit-teacher-email").value;
      const specialty = document.getElementById("edit-teacher-spec").value;
      const availability = document.getElementById("edit-teacher-avail").value;
      const status = document.getElementById("edit-teacher-status").value;

      PratikaDB.updateTeacher(teacherId, { name, email, specialty, availability, status });
      modalRoot.innerHTML = "";
      this.showToast(`Professor ${name} atualizado com sucesso!`, "success");
      this.renderInternalView();
    });
  }

  deleteTeacherConfirm(teacherId) {
    const t = PratikaDB.getTeacher(teacherId);
    if (!t) return;
    const modalRoot = document.getElementById("action-modal-root");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 420px; box-shadow: var(--shadow-lg); text-align: center;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); color: var(--error-color); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </div>
          <h3 style="font-family: var(--font-title); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">Remover Professor?</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Tem certeza que deseja desvincular <strong>${t.name}</strong> da escola? Suas turmas precisarão ser reatribuídas.</p>
          
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-outline btn-full" id="modal-cancel">Cancelar</button>
            <button class="btn btn-danger btn-full" id="modal-confirm-delete">Sim, Remover</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("modal-cancel").addEventListener("click", () => modalRoot.innerHTML = "");
    document.getElementById("modal-confirm-delete").addEventListener("click", () => {
      PratikaDB.deleteTeacher(teacherId);
      modalRoot.innerHTML = "";
      this.showToast(`Professor ${t.name} removido com sucesso!`, "success");
      this.renderInternalView();
    });
  }

  // --- FULL INTERACTIVE CALENDAR ENGINE ---
  renderFullCalendar(schoolId, isStudent = false, container) {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const year = this.calendarState.year;
    const month = this.calendarState.month; // 0-indexed (4 = Maio)
    const monthTitle = `${monthNames[month]} ${year}`;

    const allEvents = PratikaDB.getEvents(schoolId);
    const filter = this.calendarState.filter;
    const viewMode = this.calendarState.viewMode;

    const filteredEvents = allEvents.filter(e => {
      if (filter === "todos") return true;
      return e.type === filter;
    });

    container.innerHTML = `
      <div class="calendar-topbar">
        <div class="calendar-nav-group">
          <div class="calendar-month-title">${monthTitle}</div>
          <button class="btn btn-outline btn-sm" onclick="app.setCalendarToday()">${Icons.calendario} Hoje</button>
          <button class="btn btn-outline btn-sm" onclick="app.changeCalendarMonth(-1)">&lt;</button>
          <button class="btn btn-outline btn-sm" onclick="app.changeCalendarMonth(1)">&gt;</button>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="calendar-view-toggle">
            <button class="calendar-view-btn ${viewMode === 'mes' ? 'active' : ''}" onclick="app.setCalendarViewMode('mes')">Mês</button>
            <button class="calendar-view-btn ${viewMode === 'semana' ? 'active' : ''}" onclick="app.setCalendarViewMode('semana')">Semana</button>
            <button class="calendar-view-btn ${viewMode === 'lista' ? 'active' : ''}" onclick="app.setCalendarViewMode('lista')">Lista de Aulas</button>
          </div>

          ${!isStudent ? `
            <button class="btn btn-primary btn-sm" onclick="app.showAddEventModal()">
              ${Icons.plus} Agendar Evento / Aula
            </button>
          ` : ''}
        </div>
      </div>

      <div class="calendar-filters-row">
        <span style="font-size: 0.775rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Filtrar por:</span>
        <button class="calendar-filter-pill ${filter === 'todos' ? 'active' : ''}" onclick="app.setCalendarFilter('todos')">Todas as Aulas (${allEvents.length})</button>
        <button class="calendar-filter-pill ${filter === 'live' ? 'active' : ''}" onclick="app.setCalendarFilter('live')">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--primary-color);"></span> Aulas ao Vivo
        </button>
        <button class="calendar-filter-pill ${filter === 'activity' ? 'active' : ''}" onclick="app.setCalendarFilter('activity')">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--success-color);"></span> Atividades & Conversação
        </button>
        <button class="calendar-filter-pill ${filter === 'exam' ? 'active' : ''}" onclick="app.setCalendarFilter('exam')">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--warning-color);"></span> Avaliações / Provas
        </button>
        <button class="calendar-filter-pill ${filter === 'holiday' ? 'active' : ''}" onclick="app.setCalendarFilter('holiday')">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--error-color);"></span> Feriados / Reuniões
        </button>
      </div>

      <div class="panel-card" style="padding: 1.25rem;">
        ${viewMode === 'mes' ? this.renderCalendarMonthGrid(year, month, filteredEvents, isStudent) : viewMode === 'semana' ? this.renderCalendarWeekGrid(year, month, filteredEvents, isStudent) : this.renderCalendarListView(filteredEvents, isStudent)}
      </div>
    `;
  }

  renderCalendarMonthGrid(year, month, events, isStudent) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Dom, 1 = Seg ...
    // Adjusted index for Monday start (0 = Seg ... 6 = Dom)
    const startOffset = (firstDayIndex + 6) % 7;
    const prevMonthDays = new Date(year, month, 0).getDate();

    const headers = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    let html = `
      <div class="calendar-grid-full">
        ${headers.map(h => `<div class="calendar-header-cell">${h}</div>`).join("")}
    `;

    // Previous month overflow days
    for (let i = startOffset - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      html += `
        <div class="calendar-grid-cell other-month">
          <div class="calendar-cell-header">
            <span class="calendar-cell-day-num" style="color: var(--text-secondary); opacity: 0.5;">${dayNum}</span>
          </div>
        </div>
      `;
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const today = new Date(); const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      const dayEvents = events.filter(e => e.date === dateStr);

      html += `
        <div class="calendar-grid-cell ${isToday ? 'today' : ''}" onclick="${!isStudent ? `app.showAddEventModal('${dateStr}')` : ''}">
          <div class="calendar-cell-header">
            <span class="calendar-cell-day-num">${day}</span>
            ${dayEvents.length > 0 ? `<span style="font-size: 0.65rem; font-weight: 700; color: var(--primary-color);">${dayEvents.length} aula${dayEvents.length > 1 ? 's' : ''}</span>` : ''}
          </div>
          <div class="calendar-events-container" onclick="event.stopPropagation();">
            ${dayEvents.map(evt => {
              const confirmedBadge = (isStudent && evt.attendanceConfirmed) ? `<span class="event-confirmed-badge" title="Presença Confirmada">✅</span>` : ``;
              return `
                <div class="calendar-event-item ${evt.type}" onclick="app.showEventDetailsModal('${evt.id}')" title="${isStudent ? 'Clique para ver detalhes e confirmar presença' : 'Clique para gerenciar ou entrar na sala'}">
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${evt.time ? evt.time.split(' - ')[0] + ' ' : ''}${evt.title}</span>
                  ${confirmedBadge}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    // Next month overflow to complete 35 or 42 grid cells
    const totalCells = startOffset + daysInMonth;
    const remainingCells = (totalCells > 35 ? 42 : 35) - totalCells;
    for (let j = 1; j <= remainingCells; j++) {
      html += `
        <div class="calendar-grid-cell other-month">
          <div class="calendar-cell-header">
            <span class="calendar-cell-day-num" style="color: var(--text-secondary); opacity: 0.5;">${j}</span>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  renderCalendarWeekGrid(year, month, events, isStudent) {
    // Renders the current focus week (May 18 to May 24, 2026)
    const weekDays = [
      { day: 18, name: "Segunda", date: "2026-05-18" },
      { day: 19, name: "Terça", date: "2026-05-19" },
      { day: 20, name: "Quarta", date: "2026-05-20" },
      { day: 21, name: "Quinta", date: "2026-05-21" },
      { day: 22, name: "Sexta (Hoje)", date: "2026-05-22", isToday: true },
      { day: 23, name: "Sábado", date: "2026-05-23" },
      { day: 24, name: "Domingo", date: "2026-05-24" }
    ];

    return `
      <div class="calendar-grid-full" style="">
        ${weekDays.map(w => `
          <div class="calendar-header-cell ${w.isToday ? 'today' : ''}">
            <div>${w.name}</div>
            <div style="font-size: 1.1rem; font-weight: 800; margin-top: 0.2rem; color: ${w.isToday ? 'var(--primary-color)' : 'var(--text-primary)'};">${w.day}</div>
          </div>
        `).join("")}

        ${weekDays.map(w => {
          const dayEvents = events.filter(e => e.date === w.date);
          return `
            <div class="calendar-grid-cell ${w.isToday ? 'today' : ''}" style="min-height: 220px;" onclick="${!isStudent ? `app.showAddEventModal('${w.date}')` : ''}">
              <div class="calendar-events-container" onclick="event.stopPropagation();">
                ${dayEvents.map(evt => `
                  <div class="calendar-event-item ${evt.type}" style="padding: 0.5rem; margin-bottom: 0.35rem;" onclick="app.showEventDetailsModal('${evt.id}')">
                    <div>
                      <div style="font-weight: 700; font-size: 0.8rem;">${evt.title}</div>
                      <div style="font-size: 0.7rem; opacity: 0.85;">${evt.time} • ${evt.teacher}</div>
                      ${(isStudent && evt.attendanceConfirmed) ? `<div style="font-size: 0.65rem; font-weight: 700; color: var(--success-color); margin-top: 0.25rem;">✅ Presença Confirmada</div>` : ''}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderCalendarListView(events, isStudent) {
    if (events.length === 0) {
      return `<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">Nenhum evento ou aula agendada com o filtro selecionado.</div>`;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${events.map(evt => {
          const typeLabel = evt.type === 'live' ? 'Aula ao Vivo' : evt.type === 'activity' ? 'Atividade' : evt.type === 'exam' ? 'Avaliação' : 'Evento Geral';
          return `
            <div class="calendar-list-card">
              <div style="display: flex; align-items: center; gap: 1.25rem;">
                <div style="width: 48px; height: 48px; border-radius: var(--border-radius-sm); background: rgba(108, 92, 231, 0.1); color: var(--primary-color); display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800;">
                  <span style="font-size: 1.1rem; line-height: 1;">${evt.date.split('-')[2]}</span>
                  <span style="font-size: 0.65rem; text-transform: uppercase;">MAI</span>
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <h4 style="font-family: var(--font-title); font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${evt.title}</h4>
                    <span class="badge ${evt.type === 'live' ? 'danger' : evt.type === 'activity' ? 'active' : 'pending'}">${typeLabel}</span>
                  </div>
                  <div style="font-size: 0.825rem; color: var(--text-secondary); margin-top: 0.25rem;">
                    <strong>${evt.time}</strong> • Professor: ${evt.teacher} • Sala: ${evt.room || 'LiveKit Pro'}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.75rem;">
                ${isStudent ? `
                  <button class="btn-presence ${evt.attendanceConfirmed ? 'confirmed' : 'unconfirmed'}" onclick="app.toggleEventAttendance('${evt.id}')">
                    ${evt.attendanceConfirmed ? '✅ Presença Confirmada' : '✋ Confirmar Presença'}
                  </button>
                ` : evt.type === 'live' ? `
                  <a href="#/livekit/aula-1" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    Entrar na Sala
                  </a>
                ` : `
                  <span class="badge" style="background: #F1F5F9; color: #475569; font-weight: 600;">Evento Institucional</span>
                `}
                <button class="btn btn-outline btn-sm" onclick="app.showEventDetailsModal('${evt.id}')">Detalhes</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  changeCalendarMonth(delta) {
    this.calendarState.month += delta;
    if (this.calendarState.month > 11) {
      this.calendarState.month = 0;
      this.calendarState.year += 1;
    } else if (this.calendarState.month < 0) {
      this.calendarState.month = 11;
      this.calendarState.year -= 1;
    }
    this.renderInternalView();
  }

  setCalendarToday() {
    this.calendarState.year = new Date().getFullYear();
    this.calendarState.month = new Date().getMonth();
    this.renderInternalView();
  }

  setCalendarViewMode(mode) {
    this.calendarState.viewMode = mode;
    this.renderInternalView();
  }

  setCalendarFilter(filter) {
    this.calendarState.filter = filter;
    this.renderInternalView();
  }

  // --- EVENT DETAILS MODAL & ATTENDANCE CONFIRMATION ---
  showEventDetailsModal(eventId) {
    const evt = PratikaDB.getEvent(eventId);
    if (!evt) return;
    const modalRoot = document.getElementById("action-modal-root");
    const isStudent = (this.session.role === "aluno");

    const typeBadge = evt.type === 'live' ? `<span class="badge danger">🔴 Aula ao Vivo</span>` : evt.type === 'activity' ? `<span class="badge active">🟢 Atividade Pedagógica</span>` : evt.type === 'exam' ? `<span class="badge pending">🟡 Avaliação / Prova</span>` : `<span class="badge inactive">🔵 Evento Institucional</span>`;

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; animation: fadeIn 0.2s ease; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 520px; background: #FFF; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 2px solid #F1F5F9; padding-bottom: 0.85rem;">
            ${typeBadge}
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <h3 style="font-family: var(--font-title); font-size: 1.35rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">${evt.title}</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 1.5rem;">${evt.description || "Transmissão acadêmica via LiveKit Pro com exercícios práticos e interação em tempo real."}</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: #F8FAFC; padding: 0.85rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
              <div style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Data & Horário</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">${evt.date} às ${evt.time}</div>
            </div>
            <div style="background: #F8FAFC; padding: 0.85rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
              <div style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase;">Docente Responsável</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem;">${evt.teacher}</div>
            </div>
          </div>

          ${isStudent ? `
            <!-- Bloco de Confirmação Exclusivo do Aluno -->
            <div style="margin-bottom: 1.5rem; background: #F8FAFC; padding: 1rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Sua Presença nesta Aula</div>
                <div style="font-size: 0.775rem; color: var(--text-secondary); margin-top: 0.15rem;" id="modal-presence-status-text">
                  ${evt.attendanceConfirmed ? "✅ Presença confirmada no sistema acadêmico" : "Aguardando confirmação de presença"}
                </div>
              </div>
              <button class="btn-presence ${evt.attendanceConfirmed ? 'confirmed' : 'unconfirmed'}" id="btn-modal-toggle-presence" onclick="app.toggleEventAttendance('${evt.id}', true)">
                ${evt.attendanceConfirmed ? '✅ Presença Confirmada' : '✋ Confirmar Presença'}
              </button>
            </div>
          ` : `
            <!-- Painel de Gestão da Coordenação -->
            <div style="margin-bottom: 1.5rem; background: #EEF2FF; border: 1px solid #C7D2FE; padding: 0.85rem 1rem; border-radius: var(--border-radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #1E1B4B;">Painel do Coordenador</div>
                <div style="font-size: 0.75rem; color: #4338CA; margin-top: 0.1rem;">Supervisão pedagógica e Gestão de eventos institucionais</div>
              </div>
              <span class="badge active" style="font-size: 0.7rem;">Coordenação</span>
            </div>
          `}

          <div style="display: flex; gap: 0.75rem;">
            ${evt.type === 'live' ? `
              <a href="#/livekit/aula-1" class="btn btn-primary btn-full" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;" onclick="document.getElementById('action-modal-root').innerHTML=''">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                Entrar na Sala Ao Vivo (LiveKit)
              </a>
            ` : `<button class="btn btn-primary btn-full" onclick="document.getElementById('action-modal-root').innerHTML=''">Concluir</button>`}
            
            ${!isStudent ? `
              <button class="btn btn-outline" style="color: #DC2626; border-color: #FECACA;" onclick="app.deleteEventConfirm('${evt.id}')">
                Excluir
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  deleteEventConfirm(eventId) {
    if (confirm("Deseja realmente remover este evento da grade institucional?")) {
      PratikaDB.deleteEvent(eventId);
      document.getElementById("action-modal-root").innerHTML = "";
      this.showToast("Evento removido do calendário com sucesso!", "info");
      this.renderInternalView();
    }
  }

  toggleEventAttendance(eventId, isInsideModal = false) {
    if (this.session.role !== "aluno") {
      this.showToast("Apenas alunos matriculados podem confirmar presença nesta aula.", "info");
      return;
    }
    const updated = PratikaDB.toggleAttendance(eventId);
    if (!updated) return;

    if (updated.attendanceConfirmed) {
      this.showToast(`Presença confirmada com sucesso em "${updated.title}"!`, "success");
    } else {
      this.showToast(`Presença cancelada em "${updated.title}".`, "info");
    }

    if (isInsideModal) {
      const btn = document.getElementById("btn-modal-toggle-presence");
      const statusText = document.getElementById("modal-presence-status-text");
      if (btn) {
        btn.className = `btn-presence ${updated.attendanceConfirmed ? 'confirmed' : 'unconfirmed'}`;
        btn.innerHTML = updated.attendanceConfirmed ? '✅ Presença Confirmada' : '✋ Confirmar Presença';
      }
      if (statusText) {
        statusText.innerHTML = updated.attendanceConfirmed ? "✅ Presença confirmada no sistema acadêmico" : "Aguardando confirmação de presença";
      }
    }

    // Refresh view in background
    if (this.currentView === "calendario" || this.currentView === "dashboard") {
      this.renderInternalView();
    }
  }

  togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === "password" ? "text" : "password";
    }
  }

  showAddEventModal(prefillDate = "") {
    const modalRoot = document.getElementById("action-modal-root");
    const teachers = PratikaDB.getTeachers(this.session.schoolId);

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:2000;">
        <div class="auth-card" style="width:100%; max-width: 500px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3 style="font-family:var(--font-title); font-size:1.15rem; font-weight:700;">Agendar Evento / Aula</h3>
            <button id="modal-close" style="background:transparent; border:none; cursor:pointer;">${Icons.close}</button>
          </div>
          
          <form id="add-event-form">
            <div class="form-group">
              <label>Título da Aula ou Evento</label>
              <input type="text" id="m-evt-title" class="form-control" required placeholder="Título da Aula / Evento">
            </div>
            <div class="form-group">
              <label>Tipo de Evento</label>
              <select id="m-evt-type" class="form-control">
                <option value="live">Aula ao Vivo (LiveKit)</option>
                <option value="activity">Atividade Pedagógica</option>
                <option value="exam">Avaliação / Prova</option>
                <option value="meeting">Reunião Docente</option>
                <option value="holiday">Feriado / Recesso</option>
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Data</label>
                <input type="date" id="m-evt-date" class="form-control" required value="${prefillDate || '2026-05-22'}">
              </div>
              <div class="form-group">
                <label>Horário</label>
                <input type="text" id="m-evt-time" class="form-control" required placeholder="••••••••••••" value="19:00 - 20:00">
              </div>
            </div>
            <div class="form-group">
              <label>Professor Palestrante</label>
              <select id="m-evt-teacher" class="form-control">
                ${teachers.map(t => `<option value="${t.name}">${t.name}</option>`).join("")}
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Descrição do Conteúdo</label>
              <input type="text" id="m-evt-desc" class="form-control" placeholder="Pauta ou descrição do encontro...">
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Salvar e Publicar no Calendário</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("add-event-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("m-evt-title").value;
      const type = document.getElementById("m-evt-type").value;
      const date = document.getElementById("m-evt-date").value;
      const time = document.getElementById("m-evt-time").value;
      const teacher = document.getElementById("m-evt-teacher").value;
      const description = document.getElementById("m-evt-desc").value;

      PratikaDB.addEvent({
        title,
        type,
        date,
        time,
        teacher,
        description,
        room: "Sala Virtual Pro",
        schoolId: this.session.schoolId
      });

      modalRoot.innerHTML = "";
      this.showToast(`Aula "${title}" agendada no calendário!`, "success");
      this.renderInternalView();
    });
  }

  // --- MÉTODOS E MODAIS DO PORTAL DO ALUNO ---
  setStudentTasksFilter(filter) {
    this.studentTasksFilter = filter;
    this.renderInternalView();
  }

  setStudentLessonsFilter(filter) {
    this.studentLessonsFilter = filter;
    this.renderInternalView();
  }

  setStudentTurmasFilter(filter) {
    this.studentTurmasFilter = filter;
    this.renderInternalView();
  }

  // MODAL: ENTREGA DE ATIVIDADE DO ALUNO
  showSubmitTaskModal(taskId) {
    const modalRoot = document.getElementById("action-modal-root");
    const task = PratikaDB.getTask(taskId) || { title: "Atividade Acadêmica", desc: "Instruções do exercício", dueDate: "25/05/2026" };

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 580px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge pending" style="margin-bottom: 0.25rem;">ENTREGA DE ATIVIDADE</span>
              <h3 style="font-family:var(--font-title); font-size:1.3rem; font-weight:800; color: #0F172A;">${task.title}</h3>
              <p style="font-size: 0.85rem; color: #64748B;">Data Limite: <strong>${task.dueDate}</strong></p>
            </div>
            <button id="task-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <div style="background: #F8FAFC; padding: 1rem; border-radius: 8px; border: 1px solid #E2E8F0; margin-bottom: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.35rem;">Enunciado & Instruções:</div>
            <p style="font-size: 0.9rem; color: #1E293B; line-height: 1.5;">${task.desc}</p>
          </div>

          <form id="submit-task-form">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; color: #334155;">Sua Resposta Escrita</label>
              <textarea id="task-answer-text" class="form-control" rows="4" placeholder="Escreva sua resposta para o professor aqui..." required style="resize: vertical; font-size: 0.9rem; line-height: 1.5;"></textarea>
            </div>

            <!-- Gravação de Áudio de Conversação -->
            <div style="background: #FAF5FF; border: 1px dashed #D8B4FE; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 700; color: #7E22CE; font-size: 0.85rem; margin-bottom: 0.35rem;">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                Gravação de Áudio de Speaking (Opcional)
              </div>
              <div id="audio-record-status" style="font-size: 0.78rem; color: #6B7280; margin-bottom: 0.6rem;">Grave sua pronúncia diretamente pelo microfone</div>
              <button type="button" id="btn-record-audio" class="btn btn-outline btn-sm" style="border-color: #C084FC; color: #7E22CE; background: #FFF; font-weight: 700;">
                🎙️ Iniciar Gravação de Áudio
              </button>
            </div>

            <!-- Anexo de Arquivo -->
            <div style="border: 1px dashed #CBD5E1; border-radius: 8px; padding: 1rem; text-align: center; background: #FFF; margin-bottom: 1.25rem;">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="#94A3B8" stroke-width="2" fill="none" style="margin: 0 auto 0.25rem auto;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <div style="font-size: 0.8rem; font-weight: 600; color: #475569;">Arraste ou clique para anexar PDF/Word</div>
              <div style="font-size: 0.72rem; color: #94A3B8;">Formatos suportados: .pdf, .docx, .mp3 (até 25MB)</div>
            </div>

            <button type="submit" class="btn btn-primary btn-full" style="height: 48px; font-weight: 700; font-size: 0.95rem; background: #4F46E5; border-color: #4F46E5;">
              ✓ Enviar Resposta ao Professor
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("task-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    let recording = false;
    const btnRecord = document.getElementById("btn-record-audio");
    const recordStatus = document.getElementById("audio-record-status");
    btnRecord.addEventListener("click", () => {
      recording = !recording;
      if (recording) {
        btnRecord.innerHTML = "⏹️ Parar Gravação (00:14)";
        btnRecord.style.background = "#FEE2E2";
        btnRecord.style.borderColor = "#EF4444";
        btnRecord.style.color = "#DC2626";
        recordStatus.innerHTML = "🔴 Gravando áudio com cancelamento de ruído...";
      } else {
        btnRecord.innerHTML = "✓ Áudio Gravado (00:28) - Ouvir";
        btnRecord.style.background = "#DCFCE7";
        btnRecord.style.borderColor = "#22C55E";
        btnRecord.style.color = "#16A34A";
        recordStatus.innerHTML = "Áudio anexado com sucesso à entrega!";
      }
    });

    document.getElementById("submit-task-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const answer = document.getElementById("task-answer-text").value;
      PratikaDB.submitStudentTask(taskId, { answer });
      modalRoot.innerHTML = "";
      this.showToast(`Atividade "${task.title}" entregue com sucesso ao professor!`, "success");
      this.renderInternalView();
    });
  }

  // MODAL: FEEDBACK DO PROFESSOR
  showTaskFeedbackModal(taskId) {
    const modalRoot = document.getElementById("action-modal-root");
    const task = PratikaDB.getTask(taskId) || {
      title: "Grammar Practice - Unit 3",
      desc: "Present Simple vs Present Continuous exercises.",
      grade: "10.0",
      submissionDate: "18/05/2026",
      feedback: "Excelente domínio na distinção dos tempos verbais! Exercícios completados sem erros."
    };

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 520px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="margin-bottom: 0.25rem;">ATIVIDADE AVALIADA</span>
              <h3 style="font-family:var(--font-title); font-size:1.3rem; font-weight:800; color: #0F172A;">${task.title}</h3>
              <p style="font-size: 0.85rem; color: #64748B;">Entregue em: <strong>${task.submissionDate || '18/05/2026'}</strong></p>
            </div>
            <button id="feedback-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <!-- Nota do Professor -->
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 1.25rem; text-align: center; margin-bottom: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #166534; text-transform: uppercase;">Nota Atribuída pelo Professor</div>
            <div style="font-size: 2.25rem; font-weight: 800; color: #15803D; font-family: var(--font-title); margin: 0.25rem 0;">
              ${task.grade || '10.0'} <span style="font-size: 1.2rem;">/ 10</span>
            </div>
            <div style="font-size: 0.8rem; color: #166534; font-weight: 600;">⭐⭐⭐⭐⭐ Avaliação Máxima</div>
          </div>

          <!-- Feedback Escrito -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1.15rem; margin-bottom: 1.5rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 0.35rem;">Comentários do Professor:</div>
            <p style="font-size: 0.875rem; color: #1E293B; line-height: 1.5; font-style: italic;">
              "${task.feedback || 'Parabéns pelo empenho! Excelente precisão nas respostas e pronúncia fluida.'}"
            </p>
            <div style="margin-top: 0.75rem; font-size: 0.78rem; color: #64748B; font-weight: 600;">
              — Prof. Lucas Martins • Coordenação Pedagógica
            </div>
          </div>

          <button type="button" id="btn-close-feedback" class="btn btn-primary btn-full" style="height: 44px; font-weight: 700;">
            Fechar Feedback
          </button>
        </div>
      </div>
    `;

    document.getElementById("feedback-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
    document.getElementById("btn-close-feedback").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  // MODAL: PAGAMENTO DA MENSALIDADE DO ALUNO
  showStudentPaymentModal(financialId) {
    const modalRoot = document.getElementById("action-modal-root");
    const bill = PratikaDB.getFinancial().find(f => f.id === financialId) || {
      id: "fin-1",
      value: 197.00,
      dueDate: "25/05/2026",
      plan: "Inglês Pro"
    };

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 500px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #4F46E5;">PORTAL DO ALUNO • PAGAMENTO SEGURO</div>
              <h3 style="font-family:var(--font-title); font-size:1.3rem; font-weight:800; color: #0F172A;">Mensalidade Acadêmica</h3>
            </div>
            <button id="pay-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <div style="background: #F8FAFC; border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem; border: 1px solid #E2E8F0; text-align: center;">
            <span style="font-size: 0.8rem; color: #64748B;">Valor da Mensalidade (Vencimento: ${bill.dueDate}):</span>
            <div style="font-size: 1.85rem; font-weight: 800; color: #4F46E5; font-family: var(--font-title); margin-top: 0.2rem;">
              R$ ${bill.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <!-- Abas de Pagamento -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;" id="pay-tabs-container">
            <button type="button" class="btn btn-outline btn-sm" id="tab-pix" style="flex: 1; background: #EEF2FF; border-color: #C7D2FE; color: #4F46E5; font-weight: 700;">Pix Instantâneo</button>
            <button type="button" class="btn btn-outline btn-sm" id="tab-card" style="flex: 1; color: #64748B;">Cartão de Crédito</button>
            <button type="button" class="btn btn-outline btn-sm" id="tab-boleto" style="flex: 1; color: #64748B;">Boleto Bancário</button>
          </div>

          <!-- Conteúdo Pix -->
          <div id="pay-content-pix">
            <div style="text-align: center; padding: 1.25rem; border: 1px dashed #CBD5E1; border-radius: 8px; margin-bottom: 1rem; background: #FFF;">
              <svg viewBox="0 0 24 24" width="100" height="100" fill="none" stroke="#1E293B" stroke-width="1.5" style="margin: 0 auto;"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="3" height="3"></rect><rect x="18" y="14" width="3" height="3"></rect><rect x="14" y="18" width="7" height="3"></rect><line x1="7" y1="7" x2="7" y2="7"></line><line x1="17" y1="7" x2="17" y2="7"></line><line x1="7" y1="17" x2="7" y2="17"></line></svg>
              <div style="font-size: 0.85rem; font-weight: 700; color: #1E293B; margin-top: 0.5rem;">Escaneie o QR Code com o aplicativo do seu banco</div>
              <div style="font-size: 0.75rem; color: #64748B; margin-top: 0.2rem;">Liberação instantânea da sala de aula</div>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
              <input type="text" readonly value="00020126580014br.gov.bcb.pix0136changeskills-pay-98129038102" class="form-control" style="font-family: monospace; font-size: 0.75rem; background: #FFF;">
              <button type="button" class="btn btn-secondary" onclick="navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136changeskills-pay-98129038102'); app.showToast('Código Pix copiado!', 'success')" style="white-space: nowrap; font-size: 0.8rem; font-weight: 700;">Copiar Pix</button>
            </div>
          </div>

          <button type="button" id="btn-confirm-student-pay" class="btn btn-primary btn-full" style="height: 48px; font-weight: 700; background: #16A34A; border-color: #16A34A; font-size: 0.95rem;">
            ✓ Confirmar Pagamento da Mensalidade (Simulação)
          </button>
        </div>
      </div>
    `;

    document.getElementById("pay-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("btn-confirm-student-pay").addEventListener("click", () => {
      PratikaDB.payFinancial(bill.id);
      modalRoot.innerHTML = "";
      this.showToast(`Mensalidade paga com sucesso! Recibo disponível para download.`, "success");
      this.renderInternalView();
    });
  }

  // MODAL: ALTERAR FORMA DE PAGAMENTO DA ASSINATURA
  showChangePaymentMethodModal() {
    const modalRoot = document.getElementById("action-modal-root");
    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 480px; background: #FFF; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow-lg);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #4F46E5;">COBRANÇA RECORRENTE AUTOMÁTICA</div>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">Gerenciar Cartão de Crédito</h3>
            </div>
            <button id="modal-close-change-pay" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <form id="change-card-form" onsubmit="event.preventDefault(); document.getElementById('action-modal-root').innerHTML=''; app.showToast('Cartão de crédito da assinatura atualizado com sucesso!', 'success');">
            <div class="form-group">
              <label>Número do Cartão de Crédito</label>
              <input type="text" class="form-control" value="•••• •••• •••• 4242" placeholder="••••••••••••" required>
            </div>

            <div class="form-group">
              <label>Nome Impresso no Cartão</label>
              <input type="text" class="form-control" value="${this.session.userName || 'Maria Silva'}" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Validade</label>
                <input type="text" class="form-control" value="12/28" placeholder="••••••••••••" required>
              </div>
              <div class="form-group">
                <label>CVV / CVC</label>
                <input type="password" class="form-control" value="892" placeholder="••••••••••••" maxlength="4" required>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
              <button type="button" class="btn btn-outline" onclick="document.getElementById('action-modal-root').innerHTML=''">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar Novo Cartão</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById("modal-close-change-pay").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  // MODAL: RECIBO OFICIAL DE PAGAMENTO & QUITAÇÃO
  showReceiptModal(financialId) {
    const modalRoot = document.getElementById("action-modal-root");
    const bill = PratikaDB.getFinancial().find(f => f.id === financialId) || PratikaDB.getFinancial()[0] || {
      id: "fin-1",
      dueDate: "25/05/2026",
      value: 197.00,
      status: "Pago",
      studentName: this.session.userName
    };

    const school = PratikaDB.getSchool(this.session.schoolId || "escola-1") || {
      name: "Change Skills - Curitiba",
      domain: "curitiba.changeskills.com.br",
      logo: Icons.escola
    };

    const receiptNum = "REC-2026-" + String(bill.id).replace(/\D/g, '').padStart(3, '0') + Math.floor(1000 + Math.random() * 9000);
    const authCode = "AUTH-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
    const payDate = bill.dueDate + " às 14:28";
    const studentName = bill.studentName || this.session.userName || "Maria Silva";
    const studentEmail = this.session.role === 'aluno' ? (this.session.userEmail || "maria.silva@aluno.changeskills.com.br") : (studentName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.') + "@aluno.changeskills.com.br");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem; overflow-y: auto;">
        <div class="school-modal-card" style="max-width: 600px; background: #FFF; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Top Bar -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F1F5F9; padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div>
                <h3 style="font-family: var(--font-title); font-size: 1.2rem; font-weight: 800; color: #0F172A; margin: 0;">${school.name}</h3>
                <span style="font-size: 0.775rem; color: #64748B;">CNPJ: 14.892.301/0001-44 • ${school.domain}</span>
              </div>
            </div>
            <button id="receipt-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <!-- Document Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
            <div>
              <div style="font-size: 0.7rem; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em;">COMPROVANTE OFICIAL DE QUITAÇÃO</div>
              <div style="font-family: monospace; font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-top: 0.15rem;">#${receiptNum}</div>
            </div>
            <span class="badge active" style="font-size: 0.8rem; font-weight: 800; padding: 0.4rem 0.8rem;">
              ✓ LIQUIDADO & QUITADO
            </span>
          </div>

          <!-- Student & Payment Information Grid -->
          <div style="border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin-bottom: 1.25rem;">
            <div style="background: #F1F5F9; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase;">
              Dados do Aluno e Matrícula
            </div>
            <div style="padding: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
              <div>
                <span style="color: #64748B; font-size: 0.75rem; display: block;">Nome do Aluno:</span>
                <strong style="color: #0F172A;">${studentName}</strong>
              </div>
              <div>
                <span style="color: #64748B; font-size: 0.75rem; display: block;">E-mail Cadastrado:</span>
                <strong style="color: #0F172A;">${studentEmail}</strong>
              </div>
              <div>
                <span style="color: #64748B; font-size: 0.75rem; display: block;">Curso / Nível:</span>
                <strong style="color: #4F46E5;">Inglês Intermediário B1</strong>
              </div>
              <div>
                <span style="color: #64748B; font-size: 0.75rem; display: block;">Matrícula Acadêmica:</span>
                <strong style="color: #0F172A;">#CHANGESKILLS-2026-0812</strong>
              </div>
            </div>

            <div style="background: #F1F5F9; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; border-top: 1px solid #E2E8F0;">
              Detalhamento Financeiro
            </div>
            <div style="padding: 1rem; font-size: 0.85rem;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 0.4rem 0; color: #64748B;">Descrição dos Serviços:</td>
                  <td style="padding: 0.4rem 0; text-align: right; font-weight: 600; color: #0F172A;">${bill.description || `Mensalidade Curso de Idiomas (${bill.dueDate})`}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 0.4rem 0; color: #64748B;">Forma de Pagamento:</td>
                  <td style="padding: 0.4rem 0; text-align: right; font-weight: 600; color: #16A34A;">Pix Instantâneo (Autenticado BACEN)</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 0.4rem 0; color: #64748B;">Data & Hora da Operação:</td>
                  <td style="padding: 0.4rem 0; text-align: right; color: #0F172A;">${payDate}</td>
                </tr>
                <tr>
                  <td style="padding: 0.75rem 0 0.25rem; font-weight: 800; font-size: 0.95rem; color: #0F172A;">Valor Total Quitado:</td>
                  <td style="padding: 0.75rem 0 0.25rem; text-align: right; font-family: var(--font-title); font-weight: 800; font-size: 1.35rem; color: var(--success-color);">
                    R$ ${bill.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Digital Seal & Electronic Auth -->
          <div style="background: #FAFAFA; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <div style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Autenticação Eletrônica do Sistema:</div>
              <code style="font-size: 0.72rem; color: #334155; word-break: break-all;">${authCode}</code>
            </div>
            <div style="text-align: right; white-space: nowrap; font-size: 0.72rem; color: #16A34A; font-weight: 700;">
              🔒 Assinado Digitalmente
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;" onclick="window.print();">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Imprimir / PDF
            </button>
            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="app.sendReceiptEmail('${financialId}')">
              📩 Enviar por E-mail
            </button>
            <button type="button" id="btn-close-receipt" class="btn btn-primary" style="flex: 1;">
              Concluir
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("receipt-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
    document.getElementById("btn-close-receipt").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  copyPaymentLink(billId, studentName, value, status) {
    if (status === "Pago") {
      const link = `https://changeskills.com.br/#/recibo/${billId}`;
      navigator.clipboard.writeText(link);
      this.showToast(`🔗 Link do Recibo de ${studentName} copiado com sucesso!`, "success");
    } else {
      const link = `https://changeskills.com.br/#/pagamento/${billId}`;
      const pixCode = `00020126580014br.gov.bcb.pix0136changeskills-pay-${billId}-98129038102`;
      const fullText = `Olá ${studentName}, segue o link para pagamento da sua mensalidade Change Skills (R$ ${value.toFixed(2)}):\n${link}\n\nCódigo Pix Copia e Cola:\n${pixCode}`;
      navigator.clipboard.writeText(fullText);
      this.showToast(`🔗 Link de cobrança e código Pix de ${studentName} copiados!`, "success");
    }
  }

  sendWhatsAppBilling(billId, studentName, value, dueDate) {
    const link = `https://changeskills.com.br/#/pagamento/${billId}`;
    const pixCode = `00020126580014br.gov.bcb.pix0136changeskills-pay-${billId}-98129038102`;
    const message = `Olá, ${studentName}! Tudo bem? 🎓\n\nLembramos que a sua mensalidade do curso na *Change Skills* vence em *${dueDate}* no valor de *R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*.\n\nPara efetuar o pagamento via Pix ou Cartão, utilize o link:\n${link}\n\nCódigo Pix Copia e Cola:\n${pixCode}\n\nQualquer dúvida, estamos à disposição!`;
    
    navigator.clipboard.writeText(message);
    this.showToast(`💬 Mensagem de cobrança para ${studentName} copiada para o WhatsApp!`, "success");
  }

  markAsPaidBySchool(billId) {
    const updated = PratikaDB.payFinancial(billId);
    if (updated) {
      this.showToast(`Cobrança de ${updated.studentName} baixada com sucesso! Recibo gerado.`, "success");
      this.renderInternalView();
      setTimeout(() => {
        this.showReceiptModal(billId);
      }, 400);
    }
  }

  showSchoolFinancialStatementModal(schoolId) {
    const modalRoot = document.getElementById("action-modal-root");
    const school = PratikaDB.getSchool(schoolId) || PratikaDB.getSchools()[0];
    const mrr = school.mrr || 24680;
    const fee = mrr * 0.10;
    const net = mrr * 0.90;
    const authCode = "PIX-REPASSE-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-2026";

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem; overflow-y: auto;">
        <div class="school-modal-card" style="max-width: 650px; background: #FFF; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F1F5F9; padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 44px; height: 44px; border-radius: 10px; background: #F8FAFC; border: 1px solid var(--border-color); color: ${school.primaryColor || '#6C5CE7'}; display: flex; align-items: center; justify-content: center;">
                ${school.logo || Icons.escola}
              </div>
              <div>
                <h3 style="font-family: var(--font-title); font-size: 1.2rem; font-weight: 800; color: #0F172A; margin: 0;">Extrato de Repasse Financeiro</h3>
                <span style="font-size: 0.775rem; color: #64748B;">${school.name} • ${school.domain}</span>
              </div>
            </div>
            <button id="statement-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <!-- Status & Período -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 0.85rem 1.25rem; margin-bottom: 1.25rem;">
            <div>
              <div style="font-size: 0.7rem; font-weight: 800; color: #166534; text-transform: uppercase;">Competência Atual: Maio/2026</div>
              <div style="font-size: 0.85rem; color: #15803D; font-weight: 700; margin-top: 0.15rem;">Repasse Pix Liquidado com Sucesso</div>
            </div>
            <span class="badge active" style="font-size: 0.8rem; font-weight: 800; padding: 0.35rem 0.75rem;">✓ LIQUIDADO</span>
          </div>

          <!-- Grid de Valores -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="background: #F8FAFC; padding: 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div style="font-size: 0.7rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Faturamento Bruto</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">R$ ${mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style="background: #EEF2FF; padding: 0.85rem; border-radius: 8px; border: 1px solid #C7D2FE;">
              <div style="font-size: 0.7rem; color: #4338CA; font-weight: 700; text-transform: uppercase;">Taxa SaaS Change Skills (10%)</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #4F46E5; margin-top: 0.25rem;">- R$ ${fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style="background: #F0FDF4; padding: 0.85rem; border-radius: 8px; border: 1px solid #86EFAC;">
              <div style="font-size: 0.7rem; color: #166534; font-weight: 700; text-transform: uppercase;">Repasse Líquido (90%)</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #16A34A; margin-top: 0.25rem;">R$ ${net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <!-- Conciliação Bancária -->
          <div style="background: #FAFAFA; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1.25rem; font-size: 0.8rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
              <span style="color: #64748B;">Chave Pix de Destino da Escola:</span>
              <strong style="color: #0F172A; font-family: monospace;">financeiro@${school.domain}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
              <span style="color: #64748B;">Código de Autenticação Bancária:</span>
              <code style="color: #4F46E5; font-size: 0.75rem;">${authCode}</code>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B;">Data da Transferência Eletrônica:</span>
              <strong style="color: #0F172A;">20/05/2026 às 10:45</strong>
            </div>
          </div>

          <!-- Botões -->
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-outline btn-full" onclick="window.print()">
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 0.35rem;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Imprimir Extrato
            </button>
            <button class="btn btn-primary btn-full" onclick="document.getElementById('action-modal-root').innerHTML=''">
              Fechar
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("statement-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  showCreateChargeModal() {
    const modalRoot = document.getElementById("action-modal-root");
    const students = PratikaDB.getStudents(this.session.schoolId || "escola-1");

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 500px; background: #FFF; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 2px solid #F1F5F9; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem;">FINANCEIRO</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A;">Gerar Nova Cobrança</h3>
            </div>
            <button id="charge-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <form id="create-charge-form">
            <div class="form-group">
              <label style="font-weight: 700; font-size: 0.85rem;">Aluno Destinatário</label>
              <select id="m-charge-student" class="form-control" style="font-weight: 600;">
                ${students.map(s => `<option value="${s.name}">${s.name} (${s.course || 'Inglês'})</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label style="font-weight: 700; font-size: 0.85rem;">Descrição da Cobrança</label>
              <input type="text" id="m-charge-desc" class="form-control" required placeholder="••••••••••••" value="Mensalidade - Junho/2026">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem;">Valor (R$)</label>
                <input type="number" id="m-charge-value" class="form-control" required step="0.01" value="197.00">
              </div>
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem;">Vencimento</label>
                <input type="text" id="m-charge-duedate" class="form-control" required placeholder="••••••••••••" value="10/06/2026">
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full" style="height: 48px; font-weight: 800; font-size: 0.95rem; margin-top: 0.5rem;">
              ✓ Emitir Cobrança e Gerar Link
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("charge-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("create-charge-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const studentName = document.getElementById("m-charge-student").value;
      const desc = document.getElementById("m-charge-desc").value;
      const value = parseFloat(document.getElementById("m-charge-value").value) || 197.00;
      const dueDate = document.getElementById("m-charge-duedate").value;

      const newRecord = PratikaDB.addFinancial({
        schoolId: this.session.schoolId || "escola-1",
        studentName,
        plan: "Inglês Pro",
        description: desc,
        value,
        dueDate,
        status: "Em aberto"
      });

      modalRoot.innerHTML = "";
      this.showToast(`Cobrança para ${studentName} gerada com sucesso! Dados prontos para consulta.`, "success");
      this.renderInternalView();
      
      this.copyPaymentLink(newRecord.id, studentName, value, "Em aberto");
    });
  }

  // MODAL: RENOVAÇÃO DE MATRÍCULA E UPGRADE DE PLANO
  showPlanRenewalModal() {
    const modalRoot = document.getElementById("action-modal-root");
    const student = PratikaDB.getStudents(this.session.schoolId || "escola-1").find(s => s.id === this.session.userId) || {
      name: this.session.userName || "Maria Silva",
      course: "Inglês Intermediário B1"
    };

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem; overflow-y: auto;">
        <div class="school-modal-card" style="max-width: 650px; background: #FFF; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Modal Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F1F5F9; padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <div>
              <span class="badge" style="background: #EEF2FF; color: #4F46E5; font-weight: 800; margin-bottom: 0.35rem;">RENOVAÇÃO DE MATRÍCULA & BENEFÍCIOS</span>
              <h3 style="font-family: var(--font-title); font-size: 1.35rem; font-weight: 800; color: #0F172A; margin: 0;">Planos e Renovação Acadêmica</h3>
              <p style="font-size: 0.85rem; color: #64748B; margin-top: 0.2rem;">Escolha o melhor plano para continuar evoluindo na sua fluência.</p>
            </div>
            <button id="renewal-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <!-- Current Plan Badge -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem 1.15rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.72rem; color: #64748B; font-weight: 700; text-transform: uppercase;">Seu Plano Atual:</span>
              <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">${student.course || "Inglês Intermediário B1"} (Mensal R$ 197,00)</div>
            </div>
            <span class="badge active" style="font-size: 0.75rem;">Ativo até o fim do ciclo</span>
          </div>

          <!-- Form de Renovação -->
          <form id="renewal-plan-form">
            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem;">
              
              <!-- Opção 1: Semestral 10% OFF -->
              <label style="border: 2px solid #E2E8F0; border-radius: 10px; padding: 1.1rem 1.25rem; display: flex; align-items: flex-start; gap: 1rem; cursor: pointer; transition: all 0.2s ease; background: #FFF;">
                <input type="radio" name="renew_plan" value="semestral" checked style="margin-top: 0.35rem; accent-color: #4F46E5; transform: scale(1.2);">
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-weight: 800; font-size: 1rem; color: #0F172A;">Plano Semestral (6 Meses)</span>
                    <span class="badge" style="background: #DCFCE7; color: #15803D; font-weight: 800;">10% OFF</span>
                  </div>
                  <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 0.5rem; line-height: 1.4;">
                    2 aulas ao vivo por semana via LiveKit + gravação na nuvem + materiais didáticos inclusos.
                  </p>
                  <div style="display: flex; align-items: baseline; gap: 0.4rem;">
                    <span style="font-size: 0.8rem; color: #94A3B8; text-decoration: line-through;">R$ 197,00/mês</span>
                    <span style="font-family: var(--font-title); font-size: 1.2rem; font-weight: 800; color: #4F46E5;">R$ 177,30/mês</span>
                    <span style="font-size: 0.75rem; color: #64748B;">(Total R$ 1.063,80 em até 6x)</span>
                  </div>
                </div>
              </label>

              <!-- Opção 2: Anual VIP 20% OFF (Destaque) -->
              <label style="border: 2px solid #818CF8; border-radius: 10px; padding: 1.1rem 1.25rem; display: flex; align-items: flex-start; gap: 1rem; cursor: pointer; transition: all 0.2s ease; background: #FAF5FF;">
                <input type="radio" name="renew_plan" value="anual" style="margin-top: 0.35rem; accent-color: #4F46E5; transform: scale(1.2);">
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-weight: 800; font-size: 1rem; color: #1E1B4B;">Plano Anual VIP (12 Meses)</span>
                      <span class="badge" style="background: #4F46E5; color: #FFF; font-weight: 800; font-size: 0.68rem;">⭐ MAIS ESCOLHIDO</span>
                    </div>
                    <span class="badge" style="background: #DCFCE7; color: #15803D; font-weight: 800;">20% OFF</span>
                  </div>
                  <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 0.5rem; line-height: 1.4;">
                    Turma regular + 1 Masterclass mensal de Conversação + Certificado Internacional gratuito.
                  </p>
                  <div style="display: flex; align-items: baseline; gap: 0.4rem;">
                    <span style="font-size: 0.8rem; color: #94A3B8; text-decoration: line-through;">R$ 197,00/mês</span>
                    <span style="font-family: var(--font-title); font-size: 1.2rem; font-weight: 800; color: #16A34A;">R$ 157,60/mês</span>
                    <span style="font-size: 0.75rem; color: #64748B;">(Total R$ 1.891,20 em até 12x)</span>
                  </div>
                </div>
              </label>

              <!-- Opção 3: VIP 1-on-1 com Aulas Particulares -->
              <label style="border: 2px solid #E2E8F0; border-radius: 10px; padding: 1.1rem 1.25rem; display: flex; align-items: flex-start; gap: 1rem; cursor: pointer; transition: all 0.2s ease; background: #FFF;">
                <input type="radio" name="renew_plan" value="particular" style="margin-top: 0.35rem; accent-color: #4F46E5; transform: scale(1.2);">
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-weight: 800; font-size: 1rem; color: #0F172A;">Upgrade Inglês VIP Pro + Aulas 1-on-1</span>
                    <span class="badge" style="background: #FEF3C7; color: #D97706; font-weight: 800;">PREMIUM</span>
                  </div>
                  <p style="font-size: 0.8rem; color: #64748B; margin-bottom: 0.5rem; line-height: 1.4;">
                    Turma regular + 4 aulas particulares individuais por mês com professor nativo.
                  </p>
                  <div style="display: flex; align-items: baseline; gap: 0.4rem;">
                    <span style="font-family: var(--font-title); font-size: 1.2rem; font-weight: 800; color: #4F46E5;">R$ 297,00/mês</span>
                  </div>
                </div>
              </label>
            </div>

            <!-- Forma de Pagamento -->
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; color: #334155; font-size: 0.85rem;">Forma de Pagamento da Renovação</label>
              <select id="renewal-payment-method" class="form-control" style="font-weight: 600;">
                <option value="pix">Pix Instantâneo (com 5% de desconto extra)</option>
                <option value="cartao" selected>Cartão de Crédito (em até 12x sem juros)</option>
                <option value="boleto">Boleto Bancário Parcelado</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary btn-full" style="height: 50px; font-weight: 800; font-size: 1rem; background: #4F46E5; border-color: #4F46E5; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);">
              ✓ Confirmar Renovação de Matrícula
            </button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("renewal-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");

    document.getElementById("renewal-plan-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedPlanType = document.querySelector('input[name="renew_plan"]:checked')?.value || "semestral";
      
      let planName = "Inglês Intermediário B1 (Plano Semestral)";
      let planVal = 177.30;
      let months = 6;

      if (selectedPlanType === "anual") {
        planName = "Inglês Intermediário B1 (Plano Anual VIP)";
        planVal = 157.60;
        months = 12;
      } else if (selectedPlanType === "particular") {
        planName = "Inglês VIP Pro + Aulas 1-on-1";
        planVal = 297.00;
        months = 6;
      }

      const newRec = PratikaDB.renewStudentPlan(student.name, planName, planVal, months, this.session.schoolId || "escola-1");

      modalRoot.innerHTML = "";
      this.showToast(`🎉 Parabéns! Matrícula renovada com sucesso no ${planName}!`, "success");
      this.renderInternalView();
      
      // Abre o recibo oficial imediatamente para conferência
      setTimeout(() => {
        this.showReceiptModal(newRec.id);
      }, 500);
    });
  }

  // MODAL: AULA GRAVADA
  showRecordedLessonModal(lessonId) {
    const modalRoot = document.getElementById("action-modal-root");
    const lesson = PratikaDB.getLessons().find(l => l.id === lessonId) || PratikaDB.getLessons()[0];

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 680px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem;">REPRODUÇÃO DE AULA GRAVADA</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A;">${lesson.title}</h3>
              <p style="font-size: 0.8rem; color: #64748B;">${lesson.teacherName} • Duração: 48 min</p>
            </div>
            <button id="rec-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <!-- Video Player Simulation -->
          <div style="position: relative; border-radius: 8px; overflow: hidden; background: #000; margin-bottom: 1rem; box-shadow: var(--shadow-md);">
            <video autoplay loop muted playsinline style="width: 100%; height: 290px; object-fit: cover; display: block;">
              <source src="https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4" type="video/mp4">
            </video>
            
            <!-- Video Control Bar -->
            <div style="background: rgba(15, 23, 42, 0.9); padding: 0.6rem 1rem; display: flex; justify-content: space-between; align-items: center; color: #FFF; font-size: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <button style="background: transparent; border: none; color: #FFF; cursor: pointer;">▶️</button>
                <span>08:24 / 48:15</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="badge" style="background: rgba(255,255,255,0.2); color: #FFF; cursor: pointer;">Velocidade 1.25x</span>
                <span style="cursor: pointer;">🔊</span>
                <span style="cursor: pointer;">⛶</span>
              </div>
            </div>
          </div>

          <!-- Anotações da Aula -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.25rem;">Pontos Principais & Vocabulário:</div>
            <ul style="padding-left: 1.25rem; font-size: 0.8rem; color: #475569; line-height: 1.5; margin: 0;">
              <li>Uso do Present Perfect em reuniões executivas e relatórios.</li>
              <li>Connected speech e redução de pronomes em conversações rápidas.</li>
            </ul>
          </div>

          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="app.showLessonMaterialModal('mat-1')">${Icons.download} Baixar Material da Aula</button>
            <button class="btn btn-primary btn-sm" id="btn-finish-rec">Concluir Visualização</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("rec-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
    document.getElementById("btn-finish-rec").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  // MODAL: MATERIAL DIDÁTICO DIGITAL
  showLessonMaterialModal(materialId) {
    const modalRoot = document.getElementById("action-modal-root");
    const mat = PratikaDB.getMaterials().find(m => m.id === materialId) || PratikaDB.getMaterials()[0];

    modalRoot.innerHTML = `
      <div style="position: fixed; top:0; left:0; width:100vw; height:100vh; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; justify-content:center; align-items:center; z-index:2000; padding: 1rem;">
        <div class="school-modal-card" style="max-width: 540px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem;">MATERIAL DIDÁTICO DIGITAL</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A;">${mat.title}</h3>
              <span style="font-size: 0.8rem; color: #64748B;">${mat.module} • Formato ${mat.type} (${mat.pages || mat.duration})</span>
            </div>
            <button id="mat-modal-close" style="background:transparent; border:none; cursor:pointer; color: #64748B;">${Icons.close}</button>
          </div>

          <div style="text-align: center; padding: 2rem 1rem; border: 1px dashed #CBD5E1; border-radius: 8px; background: #F8FAFC; margin-bottom: 1.25rem;">
            <div style="color: #4F46E5; margin-bottom: 0.5rem;">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700; color: #1E293B;">Apostila e Exercícios de Fixação</h4>
            <p style="font-size: 0.8rem; color: #64748B; margin-top: 0.25rem;">Documento interativo sincronizado com sua turma.</p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-outline" style="flex: 1;" onclick="app.downloadFile('${mat.downloadUrl || mat.url || '#'}')">
              Visualizar Online
            </button>
            <button class="btn btn-primary" style="flex: 1;" onclick="app.downloadFile('${mat.downloadUrl || mat.url || '#'}')">
              ${Icons.download} Baixar Arquivo
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("mat-modal-close").addEventListener("click", () => modalRoot.innerHTML = "");
  }

  // ==========================================================================
  // AMBIENTE DE APRENDIZAGEM: CURSOS, VIDEOAULAS, GESTÃO & ATIVIDADES
  // ==========================================================================

  // LISTA DE CURSOS (ESCOLA E PROFESSOR) - VISUAL FIEL À CAPTURA DE TELA DO USUÁRIO
  renderSchoolCoursesList(schoolId, container) {
    this.renderTeacherCoursesScreen(schoolId, container);
  }

  renderTeacherCoursesScreen(schoolId, container) {
    const courses = PratikaDB.getCourses(schoolId);
    container.innerHTML = `
      <div class="actions-row">
        <div class="search-input-wrapper">
          ${Icons.search}
          <input type="text" placeholder="Buscar cursos..." class="form-control" onkeyup="app.filterTableRows(this.value, 'teacher-courses-grid')">
        </div>
        ${["admin", "escola", "professor"].includes(this.session.role) ? `<button class="btn btn-primary" onclick="app.showTeacherCourseModal()">\n          ${Icons.plus} Novo Curso\n        </button>` : ""}
      </div>
      <div class="cards-grid turmas-grid" id="teacher-courses-grid">
        ${courses.map(c => this.renderTeacherCourseCard(c)).join("") || `
          <div class="panel-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem;">
            <div class="panel-card-title">Nenhum curso vinculado</div>
            <p style="color:var(--text-secondary); margin-top:0.35rem;">Crie seu primeiro curso para publicar módulos, aulas, atividades e materiais.</p>
            ${["admin", "escola", "professor"].includes(this.session.role) ? `<button class="btn btn-primary" style="margin-top: 1rem;" onclick="app.showTeacherCourseModal()">${Icons.plus} Criar Primeiro Curso</button>` : ""}
          </div>
        `}
      </div>
    `;
  }

  renderTeacherCourseCard(c) {
    const courseId = c.id;
    const modules = c.modules || [];
    const moduleCount = modules.length;
    const materials = PratikaDB.getCourseMaterials(courseId);
    let activityCount = 0;
    modules.forEach(m => {
      (m.items || []).forEach(i => {
        if (i.type === "activity") activityCount++;
      });
    });

    const rolePrefix = this.session.role === "admin" ? "admin" : (this.session.role === "escola" ? "escola" : (this.session.role === "aluno" ? "aluno" : "professor"));

    return `
      <div class="card-item class-card-item" style="border-top: 4px solid var(--primary-color); cursor: pointer; transition: transform var(--transition-fast), box-shadow var(--transition-fast);" onclick="window.location.hash = '#/${rolePrefix}/curso/${c.id}'">
        <div class="card-item-header" style="align-items: flex-start;">
          <div>
            <div class="card-item-title" style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">${c.name || c.title}</div>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${c.days || 'Seg e Qua'} • ${c.hours || '19:00 - 20:00'} • ${c.room || 'Sala Virtual 01'}</span>
          </div>
          <span class="badge active" style="font-weight: 700;">${c.level || 'Geral'}</span>
        </div>
        <div class="card-item-details" style="margin-top: 1rem;">
          <div class="card-item-detail-row"><span>Módulos</span><strong>${moduleCount}</strong></div>
          <div class="card-item-detail-row"><span>Materiais</span><strong>${materials.length}</strong></div>
          <div class="card-item-detail-row"><span>Atividades</span><strong>${activityCount}</strong></div>
          <div class="progress-track" style="margin-top: 0.75rem;"><div class="progress-fill" style="width: 72%;"></div></div>
        </div>
        ${["admin", "escola", "professor"].includes(this.session.role) ? `<div class="card-item-footer" style="display: flex; gap: 0.5rem; margin-top: 1.25rem;">
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherLessonModal('${c.id}')">${Icons.plus} Aula</button>
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); app.showTeacherMaterialModal('${c.id}')">Material</button>
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); app.showTeacherTaskModal('${c.id}')">Atividade</button>
        </div>` : ""}
      </div>
    `;
  }

  // ESCOLA & PROFESSOR: GESTOR DO CURSO COM ABAS E MÓDULOS DROPDOWN
  renderTeacherCourseManager(courseId, container) {
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];
    if (!course) {
      container.innerHTML = `<div class="panel-card"><p>Curso não encontrado.</p></div>`;
      return;
    }

    const rolePrefix = this.session.role === "admin" ? "admin" : (this.session.role === "escola" ? "escola" : (this.session.role === "aluno" ? "aluno" : "professor"));
    const activeTab = this.activeCourseTab || "modulos";
    const modules = course.modules || [];

    let allLessons = [];
    let allActivities = [];
    modules.forEach(m => {
      (m.items || []).forEach(i => {
        if (i.type === "lesson") allLessons.push({ ...i, moduleId: m.id, moduleTitle: m.title });
        if (i.type === "activity") allActivities.push({ ...i, moduleId: m.id, moduleTitle: m.title });
      });
    });

    const allMaterials = PratikaDB.getCourseMaterials(course.id);

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <div class="watch-breadcrumbs" style="margin-bottom: 1rem;">
          <a href="#/${rolePrefix}/cursos">Meus Cursos</a>
          <span>/</span>
          <strong>${course.name || course.title}</strong>
        </div>

        <!-- Banner do Curso com Dados e Ações Rápidas -->
        <div class="panel-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%); border-top: 4px solid var(--primary-color);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span class="badge active" style="font-weight: 700;">${course.level || 'Geral'}</span>
                <span class="badge inactive" style="font-weight: 600;">${course.category || 'Inglês Geral'}</span>
              </div>
              <h1 style="font-family: var(--font-title); font-size: 1.65rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem 0;">${course.name || course.title}</h1>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                Instrutor: <strong>${course.instructor || 'Prof. Lucas Martins'}</strong> • Horário: <strong>${course.days || 'Seg e Qua'} (${course.hours || '19:00 - 20:00'})</strong> • Sala: <strong>${course.room || 'Sala Virtual 01'}</strong>
              </p>
              ${course.description ? `<p style="font-size: 0.84rem; color: #64748B; margin: 0.5rem 0 0 0;">${course.description}</p>` : ''}
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
              ${["admin", "escola", "professor"].includes(this.session.role) ? `<button class="btn btn-outline btn-sm" onclick="app.showCreateModuleModal('${course.id}')" style="display: flex; align-items: center; gap: 0.4rem;">
                ${Icons.plus} Novo Módulo
              </button>` : ""}
            </div>
          </div>
        </div>

        <!-- ABAS SUPERIORES COM ÍCONES (MÓDULOS, AULAS, ATIVIDADES, MATERIAIS) -->
        <div class="course-nav-tabs">
          <button class="course-nav-tab ${activeTab === 'modulos' ? 'active' : ''}" onclick="app.setCourseTab('${course.id}', 'modulos')">
            ${Icons.turmas} <span>Módulos (${modules.length})</span>
          </button>
          <button class="course-nav-tab ${activeTab === 'aulas' ? 'active' : ''}" onclick="app.setCourseTab('${course.id}', 'aulas')">
            ${Icons.aulas} <span>Aulas (${allLessons.length})</span>
          </button>
          <button class="course-nav-tab ${activeTab === 'atividades' ? 'active' : ''}" onclick="app.setCourseTab('${course.id}', 'atividades')">
            ${Icons.tarefas} <span>Atividades (${allActivities.length})</span>
          </button>
          <button class="course-nav-tab ${activeTab === 'materiais' ? 'active' : ''}" onclick="app.setCourseTab('${course.id}', 'materiais')">
            ${Icons.materiais} <span>Materiais (${allMaterials.length})</span>
          </button>
        </div>
      </div>

      <!-- CONTEÚDO DA ABA SELECIONADA -->
      ${activeTab === 'modulos' ? `
        <!-- ABA: MÓDULOS (LISTA DROPDOWN/ACCORDION COM AULAS E ATIVIDADES) -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div style="font-weight: 700; font-size: 0.95rem; color: #1E293B;">
            Estrutura dos Módulos (clique para abrir/fechar o dropdown)
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="app.expandAllModules(true)" style="font-size: 0.78rem;">Expandir Todos</button>
            <button class="btn btn-outline btn-sm" onclick="app.expandAllModules(false)" style="font-size: 0.78rem;">Recolher Todos</button>
          </div>
        </div>

        ${modules.length === 0 ? `
          <div class="panel-card" style="text-align: center; padding: 3rem 1.5rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📚</div>
            <h3 style="font-family: var(--font-title); font-size: 1.25rem; font-weight: 800; color: #0F172A; margin: 0 0 0.35rem 0;">Nenhum módulo cadastrado</h3>
            <p style="color: var(--text-secondary); max-width: 460px; margin: 0 auto 1.25rem auto; font-size: 0.88rem;">Crie o primeiro módulo do curso para começar a adicionar videoaulas, materiais didáticos e atividades avaliativas.</p>
            ${["admin", "escola", "professor"].includes(this.session.role) ? `<button class="btn btn-primary" onclick="app.showCreateModuleModal('${course.id}')">${Icons.plus} Criar Primeiro Módulo</button>` : ""}
          </div>
        ` : modules.map((mod, modIdx) => {
          const modMaterials = PratikaDB.getModuleMaterials(course.id, mod.id);
          const items = mod.items || [];
          const lessonsCount = items.filter(i => i.type === "lesson").length;
          const activitiesCount = items.filter(i => i.type === "activity").length;

          return `
            <div class="module-dropdown-card" id="module-card-${mod.id}">
              <!-- Header do Módulo (Clicável para expandir/recolher) -->
              <div class="module-dropdown-header" onclick="app.toggleModuleDropdown('${mod.id}')">
                <div style="display: flex; align-items: center; gap: 0.85rem; min-width: 0;">
                  <button class="module-collapse-btn" id="module-chevron-${mod.id}" title="Abrir/Fechar módulo">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                  <div style="min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem; flex-wrap: wrap;">
                      <span class="badge active" style="font-size: 0.72rem; font-weight: 700;">Módulo ${modIdx + 1}</span>
                      <h3 style="font-family: var(--font-title); font-size: 1.12rem; font-weight: 800; color: var(--text-primary); margin: 0;">${mod.title}</h3>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; color: var(--text-secondary); flex-wrap: wrap;">
                      <span>${mod.description || 'Módulo de estudo e prática.'}</span>
                      <span>•</span>
                      <span style="display: flex; align-items: center; gap: 0.25rem; color: var(--primary-color); font-weight: 700;">${Icons.aulas} ${lessonsCount} aula${lessonsCount !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span style="display: flex; align-items: center; gap: 0.25rem; color: #7C3AED; font-weight: 700;">${Icons.tarefas} ${activitiesCount} atividade${activitiesCount !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span style="display: flex; align-items: center; gap: 0.25rem; color: #0284C7; font-weight: 700;">${Icons.materiais} ${modMaterials.length} material${modMaterials.length !== 1 ? 'is' : ''}</span>
                    </div>
                  </div>
                </div>

                <!-- Botões de Ação Direta no Módulo (Só Admin) -->
                ${["admin", "escola", "professor"].includes(this.session.role) ? `
                <div onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; flex-shrink: 0;">
                  <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherLessonModal('${course.id}', '${mod.id}')" title="Adicionar aula a este módulo">
                    ${Icons.plus} Aula
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); app.showTeacherTaskModal('${course.id}', '${mod.id}')" style="color: #7C3AED; border-color: rgba(124, 58, 237, 0.4);" title="Adicionar atividade a este módulo">
                    ${Icons.tarefas} Atividade
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); app.showTeacherMaterialModal('${course.id}', '${mod.id}')" title="Anexar material a este módulo">
                    ${Icons.materiais} Material
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="app.deleteModuleConfirm('${course.id}', '${mod.id}')" style="color: #EF4444; border-color: rgba(239, 68, 68, 0.3); padding: 0.35rem 0.55rem;" title="Excluir Módulo">
                    ${Icons.close}
                  </button>
                </div>` : ""}
              </div>

              <!-- Body do Dropdown: Lista de Aulas e Atividades -->
              <div class="module-dropdown-body" id="module-body-${mod.id}" style="display: block;">
                ${items.length === 0 ? `
                  <div style="text-align: center; padding: 2rem; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px;">
                    <p style="color: #64748B; font-size: 0.88rem; margin: 0 0 0.85rem 0;">Nenhuma aula ou atividade cadastrada neste módulo ainda.</p>
                    ${["admin", "escola", "professor"].includes(this.session.role) ? `<div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                      <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherLessonModal('${course.id}', '${mod.id}')">${Icons.plus} Adicionar Aula</button>
                      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); app.showTeacherTaskModal('${course.id}', '${mod.id}')" style="color: #7C3AED; border-color: rgba(124, 58, 237, 0.4);">${Icons.tarefas} Nova Atividade</button>
                    </div>` : ""}
                  </div>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                    ${items.map((item, itemIdx) => {
                      const isLesson = (item.type === "lesson");
                      const matCount = isLesson ? (item.materials || []).length : 0;
                      const submissions = (!isLesson) ? (item.submissions || []) : [];

                      return `
                        <div class="module-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.15rem; background: #FFF; border: 1px solid #E2E8F0; border-radius: 8px; gap: 1rem;">
                          <div style="display: flex; align-items: center; gap: 0.85rem; min-width: 0; flex: 1;">
                            <!-- Setas de Reordenação Sequencial livre -->
                            ${["admin", "escola", "professor"].includes(this.session.role) ? `<div class="module-item-order-actions" style="display: flex; flex-direction: column; gap: 2px;">
                              <button class="btn-order-arrow" ${itemIdx === 0 ? 'disabled' : ''} onclick="app.reorderItem('${course.id}', '${mod.id}', '${item.id}', 'up')" title="Mover para cima"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                              <button class="btn-order-arrow" ${itemIdx === items.length - 1 ? 'disabled' : ''} onclick="app.reorderItem('${course.id}', '${mod.id}', '${item.id}', 'down')" title="Mover para baixo"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                            </div>` : ""}

                            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${isLesson ? '#EEF4FF' : '#F5F3FF'}; color: ${isLesson ? 'var(--primary-color)' : '#7C3AED'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                              ${isLesson ? Icons.aulas : Icons.tarefas}
                            </div>

                            <div style="min-width: 0;">
                              <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
                                <span class="badge-item-type ${isLesson ? 'lesson' : 'activity'}">
                                  ${isLesson ? 'Videoaula' : 'Atividade'}
                                </span>
                                <span style="font-weight: 700; font-size: 0.95rem; color: #0F172A;">${item.title}</span>
                              </div>
                              <div style="font-size: 0.78rem; color: #64748B; margin-top: 0.15rem;">
                                ${isLesson ? `Duração: <strong>${item.duration || '20 min'}</strong> • ${matCount} material(is) anexo(s)` : `Prazo: <strong>${item.dueDate || 'Sem prazo'}</strong> • ${item.hasGrade ? 'Com Nota (' + (item.maxGrade || 10) + ' pts)' : 'Formativa'} ${item.teacherPdf ? '• 📄 PDF anexado' : ''}`}
                              </div>
                            </div>
                          </div>

                          <div style="display: flex; align-items: center; gap: 0.45rem; flex-shrink: 0;">
                            ${isLesson ? `
                              <button class="btn btn-outline btn-sm" onclick="app.showLessonMaterialsModal('${course.id}', '${mod.id}', '${item.id}')" title="Ver materiais da aula">
                                ${Icons.materiais} Materiais (${matCount})
                              </button>
                              <a href="#/professor/assistir/${course.id}/${mod.id}/${item.id}" class="btn btn-primary btn-sm" style="display: flex; align-items: center; gap: 0.35rem;">
                                ${Icons.videoCamera} Assistir Aula
                              </a>
                            ` : `
                              <button class="btn btn-outline btn-sm" onclick="app.showActivitySubmissionsModal('${course.id}', '${mod.id}', '${item.id}')" style="display: flex; align-items: center; gap: 0.35rem;">
                                ${Icons.check} Entregas (${submissions.length})
                              </button>
                              <a href="#/professor/atividade/${course.id}/${mod.id}/${item.id}" class="btn btn-primary btn-sm" style="background: #7C3AED; border-color: #7C3AED; display: flex; align-items: center; gap: 0.35rem;">
                                ${Icons.tarefas} Ver Atividade
                              </a>
                            `}
                            ${["admin", "escola", "professor"].includes(this.session.role) ? `<button class="btn btn-outline btn-sm" onclick="app.deleteModuleItemConfirm('${course.id}', '${mod.id}', '${item.id}')" style="color: #EF4444; border-color: rgba(239,68,68,0.3); padding: 0.35rem 0.55rem;" title="Excluir item">
                              ${Icons.trash}
                            </button>` : ""}
                          </div>
                        </div>
                      `;
                    }).join("")}
                  </div>
                `}

                <!-- Barra inferior do módulo para adicionar mais itens direto no dropdown -->
                <div style="display: flex; gap: 0.6rem; padding-top: 1rem; border-top: 1px dashed #E2E8F0; margin-top: 1rem; justify-content: flex-end; flex-wrap: wrap;">
                  <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); app.showTeacherLessonModal('${course.id}', '${mod.id}')">
                    ${Icons.plus} Adicionar Aula neste Módulo
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); app.showTeacherTaskModal('${course.id}', '${mod.id}')" style="color: #7C3AED; border-color: rgba(124, 58, 237, 0.4);">
                    ${Icons.tarefas} Nova Atividade neste Módulo
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); app.showTeacherMaterialModal('${course.id}', '${mod.id}')">
                    ${Icons.materiais} Anexar Material neste Módulo
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      ` : activeTab === 'aulas' ? `
        <!-- ABA: AULAS DO CURSO -->
        <div class="panel-card">
          <div class="panel-card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div class="panel-card-title">Todas as Videoaulas do Curso (${allLessons.length})</div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0 0;">Acesse, teste e gerencie as videoaulas em todos os módulos.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherLessonModal('${course.id}')">${Icons.plus} Nova Videoaula</button>
          </div>

          ${allLessons.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem; color: #64748B;">
              <p>Nenhuma videoaula cadastrada neste curso ainda.</p>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherLessonModal('${course.id}')">${Icons.plus} Adicionar Primeira Aula</button>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${allLessons.map(l => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border: 1px solid #E2E8F0; border-radius: 8px; background: #FFF;">
                  <div style="display: flex; align-items: center; gap: 0.85rem;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: #EEF4FF; color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🎬</div>
                    <div>
                      <div style="font-size: 0.74rem; font-weight: 700; color: var(--primary-color); text-transform: uppercase;">${l.moduleTitle}</div>
                      <h4 style="font-family: var(--font-title); font-size: 1.05rem; font-weight: 700; margin: 0.15rem 0; color: #0F172A;">${l.title}</h4>
                      <p style="font-size: 0.78rem; color: #64748B; margin: 0;">Duração: <strong>${l.duration || '20 min'}</strong> • ${(l.materials || []).length} material(is) anexo(s)</p>
                    </div>
                  </div>
                  <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <button class="btn btn-outline btn-sm" onclick="app.showLessonMaterialsModal('${course.id}', '${l.moduleId}', '${l.id}')">
                      ${Icons.materiais} Materiais (${(l.materials || []).length})
                    </button>
                    <a href="#/professor/assistir/${course.id}/${l.moduleId}/${l.id}" class="btn btn-primary btn-sm">
                      ▶ Assistir Aula
                    </a>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      ` : activeTab === 'atividades' ? `
        <!-- ABA: ATIVIDADES DO CURSO -->
        <div class="panel-card">
          <div class="panel-card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div class="panel-card-title">Atividades e Exercícios do Curso (${allActivities.length})</div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0 0;">Acompanhe prazos, notas avaliativas e entregas dos alunos.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherTaskModal('${course.id}')" style="background: #7C3AED; border-color: #7C3AED;">${Icons.tarefas} Nova Atividade</button>
          </div>

          ${allActivities.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem; color: #64748B;">
              <p>Nenhuma atividade cadastrada neste curso ainda.</p>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherTaskModal('${course.id}')">${Icons.plus} Criar Primeira Atividade</button>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${allActivities.map(a => {
                const submissions = a.submissions || [];
                return `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border: 1px solid #E2E8F0; border-radius: 8px; background: #FFF;">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                      <div style="width: 40px; height: 40px; border-radius: 8px; background: #F5F3FF; color: #7C3AED; display: flex; align-items: center; justify-content: center;">${Icons.tarefas}</div>
                      <div>
                        <div style="font-size: 0.74rem; font-weight: 700; color: #7C3AED; text-transform: uppercase;">${a.moduleTitle}</div>
                        <h4 style="font-family: var(--font-title); font-size: 1.05rem; font-weight: 700; margin: 0.15rem 0; color: #0F172A;">${a.title}</h4>
                        <p style="font-size: 0.78rem; color: #64748B; margin: 0;">Prazo: <strong>${a.dueDate || 'Sem prazo'}</strong> • ${a.hasGrade ? `Nota Máxima: ${a.maxGrade} pts` : 'Formativa'} ${a.teacherPdf ? `• 📄 PDF Anexado: ${a.teacherPdf.name}` : ''}</p>
                      </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                      <button class="btn btn-outline btn-sm" onclick="app.showActivitySubmissionsModal('${course.id}', '${a.moduleId}', '${a.id}')">
                        📥 Entregas dos Alunos (${submissions.length})
                      </button>
                      <a href="#/professor/atividade/${course.id}/${a.moduleId}/${a.id}" class="btn btn-primary btn-sm" style="background: #7C3AED; border-color: #7C3AED;">
                        📝 Ver Enunciado
                      </a>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `}
        </div>
      ` : `
        <!-- ABA: MATERIAIS CONSOLIDADOS DO CURSO -->
        <div class="panel-card">
          <div class="panel-card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div class="panel-card-title">Central de Materiais Didáticos (${allMaterials.length})</div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0 0;">Todos os PDFs, áudios, vídeos complementares e slides deste curso.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherMaterialModal('${course.id}')">${Icons.plus} Anexar Material</button>
          </div>

          ${allMaterials.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem; color: #64748B;">
              <p>Nenhum material didático anexado a este curso ainda.</p>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); app.showTeacherMaterialModal('${course.id}')">${Icons.plus} Subir Primeiro Material</button>
            </div>
          ` : `
            <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem;">
              ${allMaterials.map(m => `
                <div class="card-item" style="padding: 1.1rem; border: 1px solid #E2E8F0; border-radius: 10px; background: #FFF;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.6rem; display: flex; align-items: center;">${m.type === "PDF" ? Icons.materiais : (m.type === "Vídeo" ? Icons.aulas : (m.type === "Áudio" ? Icons.podcast : Icons.materiais))}</span>
                    <span class="badge active" style="font-size: 0.68rem;">${m.type}</span>
                  </div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: #0F172A; margin-bottom: 0.25rem;">${m.title}</div>
                  <p style="font-size: 0.78rem; color: #64748B; margin: 0 0 0.85rem 0;">${m.itemTitle ? m.itemTitle + ' • ' : ''}${m.size || '1.8 MB'}</p>
                  <button class="btn btn-outline btn-sm btn-full" onclick="app.downloadFile('${m.url || m.downloadUrl || '#'}')">
                    ${Icons.download} Baixar Arquivo
                  </button>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `}
    `;
  }

  renderStudentCoursesList(schoolId, container) {
    const courses = PratikaDB.getCourses(schoolId);
    container.innerHTML = `
      <div class="actions-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h3 style="font-family: var(--font-title); font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin: 0;">Meus Cursos de Idiomas</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.2rem 0 0 0;">Acesse os módulos, assista videoaulas interativas e entregue suas atividades.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
        ${courses.map(c => {
          const totalModules = (c.modules || []).length;
          let totalLessons = 0;
          let completedLessons = 0;
          let totalActivities = 0;
          let completedActivities = 0;

          (c.modules || []).forEach(m => {
            (m.items || []).forEach(i => {
              if (i.type === "lesson") {
                totalLessons++;
                if ((i.completedBy || []).includes(this.session.userId)) completedLessons++;
              }
              if (i.type === "activity") {
                totalActivities++;
                if ((i.submissions || []).some(s => s.studentId === this.session.userId)) completedActivities++;
              }
            });
          });

          const totalItems = totalLessons + totalActivities;
          const progressPercent = totalItems > 0 ? Math.round(((completedLessons + completedActivities) / totalItems) * 100) : 0;

          return `
            <div class="panel-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
              <div style="position: relative; height: 160px; background: #031735; overflow: hidden;">
                <img src="${c.thumbnail}" alt="${c.title}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;">
                <span class="badge active" style="position: absolute; top: 1rem; left: 1rem; background: rgba(3, 23, 53, 0.85); backdrop-filter: blur(4px); color: #FFF; border: 1px solid rgba(255,255,255,0.2);">
                  ${c.level}
                </span>
              </div>
              <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;">
                <h4 style="font-family: var(--font-title); font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">${c.title}</h4>
                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem; flex: 1;">${c.description}</p>
                
                <div style="margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 0.4rem;">
                    <span>Progresso do Aluno</span>
                    <span style="color: var(--primary-color);">${progressPercent}% Concluído</span>
                  </div>
                  <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${progressPercent}%; height: 100%; background: var(--primary-color); border-radius: 10px;"></div>
                  </div>
                </div>

                <a href="#/aluno/curso/${c.id}" class="btn btn-primary" style="justify-content: center; text-decoration: none; font-weight: 700;">
                  Acessar Módulos & Aulas →
                </a>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // ALUNO: MÓDULOS E CONTEÚDO DO CURSO
  renderStudentCourseModules(courseId, container) {
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];
    if (!course) {
      container.innerHTML = `<div class="panel-card"><p>Curso não encontrado.</p></div>`;
      return;
    }

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <div class="watch-breadcrumbs">
          <a href="#/aluno/cursos">Meus Cursos</a>
          <span>/</span>
          <strong>${course.title}</strong>
        </div>

        <div style="background: linear-gradient(135deg, #031735 0%, #0A2855 100%); color: #FFF; padding: 2rem; border-radius: var(--border-radius-lg); position: relative; overflow: hidden; margin-bottom: 2rem; box-shadow: var(--shadow-md);">
          <div style="position: relative; z-index: 2; max-width: 650px;">
            <span class="badge active" style="background: rgba(35, 199, 243, 0.2); color: #23C7F3; border-color: rgba(35, 199, 243, 0.4); margin-bottom: 0.5rem;">
              ${course.level} • ${course.category}
            </span>
            <h2 style="font-family: var(--font-title); font-size: 1.6rem; font-weight: 800; margin: 0.25rem 0 0.5rem 0; color: #FFF;">${course.title}</h2>
            <p style="font-size: 0.88rem; color: #CBD5E1; line-height: 1.5; margin: 0;">${course.description}</p>
          </div>
          <img src="assets/images/camaleao-uniforme.png" alt="Camaleão" style="position: absolute; right: 2rem; top: 50%; transform: translateY(-50%); width: 130px; height: 130px; object-fit: contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));">
        </div>
      </div>

      <!-- Módulos do Curso -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${(course.modules || []).map((mod, modIdx) => {
          const materials = PratikaDB.getModuleMaterials(course.id, mod.id);
          const items = mod.items || [];

          return `
            <div class="panel-card" style="padding: 0; overflow: hidden;">
              <div style="padding: 1.25rem 1.5rem; background: #F8FAFC; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span class="badge active" style="font-size: 0.7rem;">Módulo ${modIdx + 1}</span>
                    <h3 style="font-family: var(--font-title); font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">${mod.title}</h3>
                  </div>
                  <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0;">${mod.description}</p>
                </div>

                <!-- Botão Materiais do Módulo -->
                <button class="btn btn-outline btn-sm" onclick="app.showModuleMaterialsModal('${course.id}', '${mod.id}')" style="display: flex; align-items: center; gap: 0.4rem; font-weight: 700; color: var(--primary-color); border-color: var(--primary-color);">
                  ${Icons.materiais} Materiais do Módulo (${materials.length})
                </button>
              </div>

              <!-- Itens Sequenciais do Módulo (Aulas e Atividades) -->
              <div style="padding: 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 0.6rem;">
                ${items.map(item => {
                  const isLesson = item.type === "lesson";
                  const isCompleted = isLesson 
                    ? (item.completedBy || []).includes(this.session.userId)
                    : (item.submissions || []).some(s => s.studentId === this.session.userId);

                  return `
                    <div class="module-item-row" style="cursor: pointer;" onclick="window.location.hash='#/aluno/${isLesson ? 'assistir' : 'atividade'}/${course.id}/${mod.id}/${item.id}'">
                      <div class="module-item-left">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: ${isLesson ? '#EEF4FF' : '#F5F3FF'}; color: ${isLesson ? 'var(--primary-color)' : '#7C3AED'}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
                          ${isLesson ? '▶' : '📝'}
                        </div>

                        <div style="min-width: 0;">
                          <div style="display: flex; align-items: center; gap: 0.45rem;">
                            <span class="badge-item-type ${isLesson ? 'lesson' : 'activity'}">
                              ${isLesson ? 'Videoaula' : 'Atividade'}
                            </span>
                            <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary);">${item.title}</span>
                          </div>
                          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 0.15rem;">
                            ${isLesson ? `Duração: ${item.duration} • ${(item.materials || []).length} materiais de apoio` : `Prazo de entrega: ${item.dueDate || 'Sem prazo'} • ${item.hasGrade ? 'Com Nota (' + (item.maxGrade || 10) + ' pts)' : 'Formativa'}`}
                          </div>
                        </div>
                      </div>

                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        ${isCompleted ? `
                          <span class="badge active" style="display: flex; align-items: center; gap: 0.3rem;">
                            ${Icons.check} Concluída
                          </span>
                        ` : `
                          <span class="badge pending">${isLesson ? 'Assistir' : 'Pendente'}</span>
                        `}
                        <span style="color: var(--primary-color); font-weight: 800; font-size: 1rem;">→</span>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // TELA DE ASSISTIR AULA (PLAYER ~80% WIDTH, ~480PX HEIGHT, COM BOTTOM NAV)
  renderLessonWatchScreen(courseId, moduleId, itemId, container) {
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];
    if (!course) {
      container.innerHTML = `<div class="panel-card"><p>Curso não encontrado.</p></div>`;
      return;
    }

    const mod = (course.modules || []).find(m => m.id === moduleId) || (course.modules || [])[0];
    if (!mod) {
      container.innerHTML = `<div class="panel-card"><p>Módulo não encontrado.</p></div>`;
      return;
    }

    const items = mod.items || [];
    const currentItem = items.find(i => i.id === itemId) || items[0];
    if (!currentItem) {
      container.innerHTML = `<div class="panel-card"><p>Aula não encontrada.</p></div>`;
      return;
    }

    const currentIndex = items.findIndex(i => i.id === currentItem.id);
    const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
    const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

    const materials = currentItem.materials || [];
    const isCompleted = (currentItem.completedBy || []).includes(this.session.userId);
    const rolePrefix = this.session.role === "escola" ? "escola" : (this.session.role === "professor" ? "professor" : "aluno");

    container.innerHTML = `
      <div class="watch-screen-wrapper">
        <div class="watch-screen-header">
          <div class="watch-breadcrumbs">
            <a href="#/${rolePrefix}/cursos">Cursos</a>
            <span>/</span>
            <a href="#/${rolePrefix}/curso/${course.id}">${course.title}</a>
            <span>/</span>
            <span>${mod.title}</span>
            <span>/</span>
            <strong>${currentItem.title}</strong>
          </div>
        </div>

        <!-- Player de Videoaula: ~80% width da tela, ~480px height -->
        <div class="lesson-watch-container">
          <div class="lesson-video-player-wrap">
            <video id="active-lesson-video" controls playsinline preload="metadata" poster="${course.thumbnail}">
              <source src="${currentItem.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4'}" type="video/mp4">
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        </div>

        <!-- Metadados da Aula -->
        <div class="lesson-meta-card">
          <div class="lesson-meta-header">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                <span class="badge-item-type lesson">🎥 Videoaula</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">Duração: ${currentItem.duration || '20 min'}</span>
              </div>
              <h1 class="lesson-meta-title">${currentItem.title}</h1>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">
                Curso: <strong>${course.title}</strong> • Instrutor: <strong>${course.instructor}</strong>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}" id="btn-toggle-completion" onclick="app.toggleLessonDone('${course.id}', '${mod.id}', '${currentItem.id}')">
                ${isCompleted ? '✓ Aula Concluída' : 'Marcar como Concluída'}
              </button>
            </div>
          </div>

          <p class="lesson-meta-desc">${currentItem.description || 'Assista a videoaula acima com atenção e pratique os exercícios recomendados no material de apoio.'}</p>
        </div>

        <!-- Rodapé / Bottom Nav Fixo no Desktop e Mobile -->
        <div class="lesson-bottom-nav">
          <div class="lesson-bottom-nav-left">
            ${prevItem ? `
              <a href="#/${rolePrefix}/${prevItem.type === 'activity' ? 'atividade' : 'assistir'}/${course.id}/${mod.id}/${prevItem.id}" class="btn-nav-step btn-nav-prev">
                ← <span>${prevItem.type === 'activity' ? 'Atividade Anterior' : 'Aula Anterior'}</span>
              </a>
            ` : `
              <button class="btn-nav-step btn-nav-prev" disabled>
                ← <span>Aula Anterior</span>
              </button>
            `}
          </div>

          <div class="lesson-bottom-nav-center">
            <button class="btn-nav-material" onclick="app.showLessonMaterialsModal('${course.id}', '${mod.id}', '${currentItem.id}')">
              ${Icons.materiais}
              <span>Materiais da Aula</span>
              <span class="badge-count">${materials.length}</span>
            </button>
          </div>

          <div class="lesson-bottom-nav-right">
            ${nextItem ? `
              <a href="#/${rolePrefix}/${nextItem.type === 'activity' ? 'atividade' : 'assistir'}/${course.id}/${mod.id}/${nextItem.id}" class="btn-nav-step btn-nav-next">
                <span>${nextItem.type === 'activity' ? 'Próxima Atividade' : 'Próxima Aula'}</span> →
              </a>
            ` : `
              <button class="btn-nav-step btn-nav-next" onclick="app.showToast('Parabéns! Você concluiu todos os itens deste módulo.', 'success')">
                <span>Concluir Módulo</span> ✓
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  // TELA DE RESOLUÇÃO DE ATIVIDADE PELO ALUNO (COM ENUNCIADO, CRITÉRIOS, PRAZO E UPLOAD PDF)
  renderStudentActivityScreen(courseId, moduleId, itemId, container) {
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];
    if (!course) {
      container.innerHTML = `<div class="panel-card"><p>Curso não encontrado.</p></div>`;
      return;
    }

    const mod = (course.modules || []).find(m => m.id === moduleId) || (course.modules || [])[0];
    if (!mod) {
      container.innerHTML = `<div class="panel-card"><p>Módulo não encontrado.</p></div>`;
      return;
    }

    const item = (mod.items || []).find(i => i.id === itemId);
    if (!item) {
      container.innerHTML = `<div class="panel-card"><p>Atividade não encontrada.</p></div>`;
      return;
    }

    const items = mod.items || [];
    const currentIndex = items.findIndex(i => i.id === item.id);
    const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
    const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

    const mySubmission = (item.submissions || []).find(s => s.studentId === this.session.userId);
    const rolePrefix = this.session.role === "escola" ? "escola" : (this.session.role === "professor" ? "professor" : "aluno");

    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto; padding-bottom: 3rem;">
        <div class="watch-breadcrumbs" style="margin-bottom: 1.25rem;">
          <a href="#/${rolePrefix}/cursos">Cursos</a>
          <span>/</span>
          <a href="#/${rolePrefix}/curso/${course.id}">${course.title}</a>
          <span>/</span>
          <span>${mod.title}</span>
          <span>/</span>
          <strong>${item.title}</strong>
        </div>

        <div class="activity-detail-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                <span class="badge-item-type activity">📝 Atividade Prática / Exercício</span>
                <span class="badge ${mySubmission ? (mySubmission.grade != null ? 'active' : 'pending') : 'warning'}">
                  ${mySubmission ? (mySubmission.grade != null ? 'Avaliada: Nota ' + mySubmission.grade + '/' + (item.maxGrade || 10) : 'Entregue (Aguardando Correção)') : 'Pendente de Entrega'}
                </span>
              </div>
              <h1 style="font-family: var(--font-title); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.25rem 0;">${item.title}</h1>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">Módulo: <strong>${mod.title}</strong> • Instrutor: <strong>${course.instructor}</strong></div>
            </div>

            <!-- Box de Prazo -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 0.75rem 1rem; border-radius: var(--border-radius-md); text-align: right;">
              <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #64748B;">Prazo de Entrega</div>
              <div style="font-size: 0.92rem; font-weight: 800; color: #0F172A;">${item.dueDate || 'Sem prazo limite'}</div>
            </div>
          </div>

          <!-- Enunciado Completo -->
          <div style="margin-top: 1.5rem;">
            <h3 style="font-size: 0.95rem; font-weight: 800; color: #1E293B; text-transform: uppercase; letter-spacing: 0.04em;">Enunciado do Exercício</h3>
            <div class="activity-statement-box">
              ${(item.statement || 'Resolva as questões propostas e envie o arquivo em PDF.').replace(/\n/g, '<br>')}
            </div>
          </div>

          <!-- PDF de Apoio do Professor (Caso Exista) -->
          ${item.teacherAttachmentPdf ? `
            <div style="margin: 1.25rem 0; background: #EEF4FF; border: 1px dashed #246BFD; border-radius: var(--border-radius-md); padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="material-file-icon pdf">PDF</div>
                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; color: #0F172A;">PDF de Apoio do Professor</div>
                  <div style="font-size: 0.78rem; color: #475569;">${item.teacherAttachmentPdf.name} (${item.teacherAttachmentPdf.size || '1.1 MB'})</div>
                </div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="app.downloadFile('${item.teacherAttachmentPdf.url || '#'}')">
                ${Icons.download} Baixar PDF de Apoio
              </button>
            </div>
          ` : ''}

          <!-- Critérios de Avaliação (Se tiver Nota) -->
          ${item.hasGrade ? `
            <div class="activity-criteria-box">
              <div class="activity-criteria-title">
                <span>⭐ Critérios de Avaliação & Nota Máxima (${item.maxGrade || 10.0} pts)</span>
              </div>
              <div style="font-size: 0.86rem; color: #78350F; line-height: 1.6; white-space: pre-line;">
                ${item.evaluationCriteria || '• Clareza e aplicação dos conceitos estudados na aula (5.0 pts)\n• Coerência, correção gramatical e ortografia (5.0 pts)'}
              </div>
            </div>
          ` : `
            <div style="background: #F1F5F9; border-radius: var(--border-radius-md); padding: 0.85rem 1rem; font-size: 0.85rem; color: #475569; margin: 1.25rem 0;">
              ℹ️ Esta é uma atividade formativa de fixação de conteúdo (sem nota numérica atribuída).
            </div>
          `}

          <!-- Área de Envio da Atividade pelo Aluno -->
          <div style="margin-top: 2rem; border-top: 2px solid #F1F5F9; padding-top: 1.5rem;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">Envio da Sua Resposta</h3>
            
            ${mySubmission ? `
              <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: var(--border-radius-md); padding: 1.5rem; margin-bottom: 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; color: #065F46; font-weight: 800; font-size: 1rem; margin-bottom: 0.5rem;">
                  ${Icons.check} Atividade Entregue com Sucesso!
                </div>
                <div style="font-size: 0.85rem; color: #047857; margin-bottom: 1rem;">
                  Enviada em: <strong>${mySubmission.submissionDate}</strong> • Arquivo: <strong>${mySubmission.fileName}</strong> (${mySubmission.fileSize})
                </div>

                ${mySubmission.studentNotes ? `
                  <div style="background: #FFF; padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid #A7F3D0; font-size: 0.84rem; color: #1F2937; margin-bottom: 1rem;">
                    <strong>Suas observações:</strong> ${mySubmission.studentNotes}
                  </div>
                ` : ''}

                ${mySubmission.grade != null ? `
                  <div style="background: #FFF; padding: 1rem; border-radius: 8px; border: 1px solid #6EE7B7;">
                    <div style="font-size: 0.85rem; font-weight: 800; color: #065F46; margin-bottom: 0.25rem;">Feedback & Nota do Professor:</div>
                    <div style="font-size: 1.25rem; font-weight: 900; color: #059669; margin-bottom: 0.35rem;">Nota: ${mySubmission.grade} / ${item.maxGrade || 10.0}</div>
                    <p style="font-size: 0.84rem; color: #374151; margin: 0;">${mySubmission.feedback}</p>
                  </div>
                ` : `
                  <div style="font-size: 0.82rem; color: #065F46;">
                    ⏳ O professor irá corrigir sua atividade e disponibilizar a nota e feedback aqui em breve.
                  </div>
                `}

                <button class="btn btn-outline btn-sm" style="margin-top: 1rem; background: #FFF;" onclick="document.getElementById('resubmit-form-wrap').style.display = 'block'; this.style.display = 'none';">
                  Substituir ou Reenviar Arquivo PDF
                </button>
              </div>

              <div id="resubmit-form-wrap" style="display: none;">
                <form id="student-submit-activity-form" onsubmit="event.preventDefault(); app.handleStudentActivitySubmit('${course.id}', '${mod.id}', '${item.id}');">
                  <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Selecione o arquivo PDF de entrega *</label>
                    <input type="file" id="submission-pdf-file" accept=".pdf" class="form-control" required style="padding: 0.5rem;">
                  </div>
                  <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Comentários ou anotações (opcional)</label>
                    <textarea id="submission-student-notes" class="form-control" rows="3" placeholder="Insira aqui observações sobre a resolução da sua tarefa..."></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary" style="font-weight: 700;">
                    📤 Enviar Nova Versão em PDF
                  </button>
                </form>
              </div>
            ` : `
              <form id="student-submit-activity-form" onsubmit="event.preventDefault(); app.handleStudentActivitySubmit('${course.id}', '${mod.id}', '${item.id}');">
                <div class="activity-upload-dropzone" onclick="document.getElementById('submission-pdf-file').click();">
                  <div style="color: var(--primary-color); margin-bottom: 0.5rem;">
                    <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" stroke-width="1.8" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: #1E293B;" id="dropzone-text">Clique para selecionar seu arquivo PDF de resolução</div>
                  <p style="font-size: 0.8rem; color: #64748B; margin-top: 0.25rem;">Formatos aceitos: PDF (máx. 10 MB)</p>
                  <input type="file" id="submission-pdf-file" accept=".pdf" style="display: none;" onchange="document.getElementById('dropzone-text').innerText = 'Arquivo selecionado: ' + this.files[0].name;" required>
                </div>

                <div class="form-group" style="margin-top: 1.25rem; margin-bottom: 1.25rem;">
                  <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Observações / Comentários para o Professor (opcional)</label>
                  <textarea id="submission-student-notes" class="form-control" rows="3" placeholder="Escreva aqui caso queira destacar algum ponto da sua entrega..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="font-weight: 700; padding: 0.75rem 1.75rem;">
                  📤 Confirmar e Enviar Atividade em PDF
                </button>
              </form>
            `}
          </div>

          <!-- Navegação inferior entre itens -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2.5rem; border-top: 1px solid #E2E8F0; padding-top: 1.25rem;">
            ${prevItem ? `
              <a href="#/${rolePrefix}/${prevItem.type === 'activity' ? 'atividade' : 'assistir'}/${course.id}/${mod.id}/${prevItem.id}" class="btn btn-outline btn-sm">
                ← ${prevItem.type === 'activity' ? 'Atividade Anterior' : 'Aula Anterior'}
              </a>
            ` : `<a href="#/${rolePrefix}/curso/${course.id}" class="btn btn-outline btn-sm">← Voltar ao Módulo</a>`}

            ${nextItem ? `
              <a href="#/${rolePrefix}/${nextItem.type === 'activity' ? 'atividade' : 'assistir'}/${course.id}/${mod.id}/${nextItem.id}" class="btn btn-primary btn-sm">
                ${nextItem.type === 'activity' ? 'Próxima Atividade' : 'Próxima Aula'} →
              </a>
            ` : `<a href="#/${rolePrefix}/curso/${course.id}" class="btn btn-primary btn-sm">Concluir Módulo ✓</a>`}
          </div>
        </div>
      </div>
    `;
  }

  // ALUNO: PROCESSA O ENVIO DE ATIVIDADE
  handleStudentActivitySubmit(courseId, moduleId, itemId) {
    const fileInput = document.getElementById("submission-pdf-file");
    const notesInput = document.getElementById("submission-student-notes");
    const fileName = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0].name : "Minha_Resolucao_Exercicio.pdf";
    const fileSize = fileInput && fileInput.files && fileInput.files[0] ? (fileInput.files[0].size / (1024 * 1024)).toFixed(1) + " MB" : "1.1 MB";
    const studentNotes = notesInput ? notesInput.value.trim() : "";

    PratikaDB.submitStudentActivity(courseId, moduleId, itemId, {
      studentId: this.session.userId || "aluno-1",
      studentName: this.session.userName || "Aluno",
      fileName: fileName,
      fileSize: fileSize,
      studentNotes: studentNotes
    });

    this.showToast("Atividade enviada com sucesso! O professor receberá o PDF para correção.", "success");
    this.renderInternalView();
  }

  // REORDENAÇÃO DE ITENS NO MÓDULO PELO PROFESSOR (SOBE / DESCE)
  reorderItem(courseId, moduleId, itemId, direction) {
    const success = PratikaDB.moveModuleItem(courseId, moduleId, itemId, direction);
    if (success) {
      this.showToast(`Ordem alterada com sucesso (${direction === 'up' ? 'Subiu' : 'Desceu'}).`, "info");
      this.renderInternalView();
    }
  }

  // MARCA AULA COMO CONCLUÍDA PELO ALUNO
  toggleLessonDone(courseId, moduleId, itemId) {
    const isCompleted = PratikaDB.toggleLessonCompletion(courseId, moduleId, itemId, this.session.userId || "aluno-1");
    this.showToast(isCompleted ? "Aula marcada como concluída! Parabéns." : "Aula desmarcada.", isCompleted ? "success" : "info");
    this.renderInternalView();
  }

  // ============================================================================
// MODAL ROOT & HELPER METHODS (TOP-CENTERED, FIXED, BACKGROUND BLUR OVERLAY)
// ============================================================================

  getModalRoot() {
    let root = document.getElementById("action-modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "action-modal-root";
      document.body.appendChild(root);
    } else if (root.parentElement !== document.body) {
      document.body.appendChild(root);
    }
    return root;
  }

  closeModal() {
    const root = document.getElementById("action-modal-root");
    if (root) {
      root.innerHTML = "";
    }
    document.body.style.overflow = "";
  }

  // Handler: Seleção de arquivo no modal de Material
  onMaterialFileSelected(input) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const chosenDiv = document.getElementById("teacher-mat-file-chosen");
    if (chosenDiv) {
      chosenDiv.style.display = "block";
      chosenDiv.innerHTML = `✅ Arquivo anexado: <strong>${file.name}</strong> (${sizeMB})`;
    }

    const titleInp = document.getElementById("teacher-mat-title");
    if (titleInp && !titleInp.value.trim()) {
      titleInp.value = file.name.replace(/\.[^/.]+$/, "");
    }

    const sizeInp = document.getElementById("teacher-mat-size");
    if (sizeInp) sizeInp.value = sizeMB;

    const fileInp = document.getElementById("teacher-mat-filename");
    if (fileInp) fileInp.value = file.name;

    const typeSelect = document.getElementById("teacher-mat-type");
    if (typeSelect) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext === "pdf") typeSelect.value = "PDF";
      else if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext)) typeSelect.value = "Vídeo";
      else if (["mp3", "wav", "ogg", "aac", "m4a"].includes(ext)) typeSelect.value = "Áudio";
      else if (["ppt", "pptx", "key"].includes(ext)) typeSelect.value = "Slides";
      else typeSelect.value = "Arquivo";
    }
  }

  // Handler: Seleção de PDF no modal de Atividade
  onTaskPdfSelected(input) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const chosenDiv = document.getElementById("teacher-task-pdf-chosen");
    if (chosenDiv) {
      chosenDiv.style.display = "block";
      chosenDiv.innerHTML = `✅ PDF do professor anexado: <strong>${file.name}</strong> (${sizeMB})`;
    }
    const nameInp = document.getElementById("activity-input-teacher-pdf-name");
    if (nameInp) nameInp.value = file.name;
  }

  // Helper: atualiza dinamicamente o select de módulos quando o professor altera o curso
  onModalCourseChange(courseId, targetModuleSelectId, selectedModuleId = null) {
    const modSelect = document.getElementById(targetModuleSelectId);
    if (!modSelect) return;
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];
    const modules = course ? (course.modules || []) : [];

    let optionsHtml = "";
    if (modules.length === 0) {
      optionsHtml = `<option value="new">+ Criar Primeiro Módulo...</option>`;
    } else {
      optionsHtml = modules.map((m, idx) => `
        <option value="${m.id}" ${((selectedModuleId && m.id === selectedModuleId) || (!selectedModuleId && idx === 0)) ? "selected" : ""}>
          ${m.title || 'Módulo ' + (idx + 1)}
        </option>
      `).join("") + `<option value="new">+ Criar Novo Módulo...</option>`;
    }
    modSelect.innerHTML = optionsHtml;

    const newModGroupId = targetModuleSelectId.replace("-module", "-new-mod-group");
    this.checkNewModuleField(modSelect.value, newModGroupId);
  }

  // Helper: exibe/esconde campo de texto de novo módulo
  checkNewModuleField(selectedValue, targetGroupId) {
    const group = document.getElementById(targetGroupId);
    if (group) {
      group.style.display = (selectedValue === "new") ? "block" : "none";
      if (selectedValue === "new") {
        const inp = group.querySelector("input");
        if (inp) inp.focus();
      }
    }
  }

  // ============================================================================
  // CONTROLES DE MÓDULOS & ABAS DO CURSO (DROPDOWN / ACCORDION)
  // ============================================================================

  setCourseTab(arg1, arg2) {
    this.activeCourseTab = arg2 || arg1 || "modulos";
    this.renderInternalView();
  }

  toggleModuleDropdown(modId) {
    const body = document.getElementById(`module-body-${modId}`);
    const chevron = document.getElementById(`module-chevron-${modId}`);
    if (!body) return;
    const isHidden = (body.style.display === "none");
    body.style.display = isHidden ? "block" : "none";
    if (chevron) {
      chevron.style.transform = isHidden ? "rotate(0deg)" : "rotate(-90deg)";
    }
  }

  expandAllModules(expand = true) {
    document.querySelectorAll(".module-dropdown-body").forEach(el => {
      el.style.display = expand ? "block" : "none";
    });
    document.querySelectorAll(".module-collapse-btn").forEach(btn => {
      btn.style.transform = expand ? "rotate(0deg)" : "rotate(-90deg)";
    });
  }

  deleteModuleConfirm(courseId, moduleId) {
    if (confirm("Tem certeza que deseja excluir este módulo e todos os seus itens?")) {
      PratikaDB.deleteModule(courseId, moduleId);
      this.showToast("Módulo removido com sucesso.", "info");
      this.renderInternalView();
    }
  }

  // SALVAR PERFIL DO PROFESSOR
  handleSaveTeacherProfile(teacherId) {
    const name = document.getElementById("prof-edit-name").value.trim();
    const email = document.getElementById("prof-edit-email").value.trim();
    const phone = document.getElementById("prof-edit-phone").value.trim();
    const photo = document.getElementById("prof-edit-photo").value.trim();
    const specialty = document.getElementById("prof-edit-specialty").value.trim();
    const bio = document.getElementById("prof-edit-bio").value.trim();
    const curPass = document.getElementById("prof-edit-cur-pass")?.value || "";
    const newPass = document.getElementById("prof-edit-new-pass")?.value || "";
    const confPass = document.getElementById("prof-edit-confirm-pass")?.value || "";

    if (newPass) {
      if (newPass.length < 6) {
        this.showToast("A nova senha deve ter pelo menos 6 caracteres.", "warning");
        return;
      }
      if (newPass !== confPass) {
        this.showToast("A confirmação de senha não confere.", "warning");
        return;
      }
    }

    PratikaDB.updateTeacher(teacherId, {
      name,
      email,
      phone,
      photo: photo || undefined,
      specialty,
      bio
    });

    this.session.userName = name;
    this.session.userEmail = email;
    if (photo) this.session.userPic = photo;

    // Atualiza nome e foto no topo do layout imediatamente
    const headerProfile = document.querySelector(".header-user-profile");
    if (headerProfile) {
      if (photo) {
        const img = headerProfile.querySelector("img");
        if (img) img.src = photo;
      }
      const span = headerProfile.querySelector("span");
      if (span) span.innerText = name.split(" ")[0];
    }

    this.showToast("Perfil atualizado com sucesso!", "success");
    this.renderInternalView();
  }

  // ============================================================================
  // MODAL: CRIAR NOVA AULA / VIDEOAULA (PROFESSOR & ESCOLA)
  // ============================================================================
  showTeacherLessonModal(courseId = null, moduleId = null) {
    const modalRoot = this.getModalRoot();
    document.body.style.overflow = "hidden";
    const courses = PratikaDB.getCourses(this.session?.schoolId);
    if (!courses || courses.length === 0) {
      this.showToast("Crie primeiro um curso antes de adicionar aulas.", "warning");
      this.showTeacherCourseModal();
      return;
    }

    const activeCourse = courseId ? (PratikaDB.getCourse(courseId) || courses[0]) : courses[0];
    const modules = activeCourse.modules || [];
    const activeModule = moduleId ? (modules.find(m => m.id === moduleId) || modules[0]) : modules[0];

    modalRoot.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
        <div class="school-modal-card auth-card" style="max-width: 620px; width: 100%; background: #FFF; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem;">NOVA AULA / VIDEOAULA</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">Adicionar Aula ao Curso</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0.15rem 0 0 0;">Defina o curso e módulo de destino para publicar esta aula.</p>
            </div>
            <button onclick="app.closeModal()" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 4px; font-size: 1.2rem;">${Icons.close}</button>
          </div>

          <form id="teacher-lesson-form" onsubmit="event.preventDefault(); app.handleCreateLesson();">
            <!-- SELEÇÃO DE CURSO E MÓDULO -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; background: #F8FAFC; padding: 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.82rem; color: #1E293B; display: block; margin-bottom: 0.25rem;">Curso de Idioma *</label>
                <select id="teacher-lesson-course" class="form-control" onchange="app.onModalCourseChange(this.value, 'teacher-lesson-module')" style="font-weight: 600; font-size: 0.85rem;" required>
                  ${courses.map(c => `<option value="${c.id}" ${c.id === activeCourse.id ? "selected" : ""}>${c.name || c.title} (${c.level || 'Geral'})</option>`).join("")}
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.82rem; color: #1E293B; display: block; margin-bottom: 0.25rem;">Módulo do Curso *</label>
                <select id="teacher-lesson-module" class="form-control" onchange="app.checkNewModuleField(this.value, 'teacher-lesson-new-mod-group')" style="font-weight: 600; font-size: 0.85rem;" required>
                  ${modules.length > 0 ? modules.map((m, idx) => `<option value="${m.id}" ${(activeModule && m.id === activeModule.id) ? "selected" : ""}>${m.title || 'Módulo ' + (idx + 1)}</option>`).join("") : ""}
                  <option value="new">+ Criar Novo Módulo...</option>
                </select>
              </div>
            </div>

            <div id="teacher-lesson-new-mod-group" class="form-group" style="display: none; margin-bottom: 1rem; background: #EFF6FF; padding: 0.75rem; border-radius: 8px; border: 1px dashed #93C5FD;">
              <label style="font-weight: 700; font-size: 0.82rem; color: #1E40AF; display: block; margin-bottom: 0.25rem;">Nome do Novo Módulo *</label>
              <input type="text" id="teacher-lesson-new-mod-title" class="form-control" placeholder="Ex: Módulo ${modules.length + 1} — Conversação em Viagens">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Título da Aula *</label>
              <input type="text" id="teacher-lesson-title" class="form-control" placeholder="Ex: Aula 5: Expressões Idiomáticas no Trabalho" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Duração Estimada</label>
                <input type="text" id="teacher-lesson-duration" class="form-control" placeholder="Ex: 22 min" value="20 min">
              </div>
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">URL do Vídeo (MP4/Stream)</label>
                <input type="text" id="teacher-lesson-url" class="form-control" placeholder="https://..." value="https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4">
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Descrição e Conteúdo</label>
              <textarea id="teacher-lesson-desc" class="form-control" rows="3" placeholder="Resuma os pontos gramaticais, vocabulário e exercícios desta aula..."></textarea>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Material de Apoio da Aula (PDF Opcional)</label>
              <input type="text" id="teacher-lesson-material-name" class="form-control" placeholder="Ex: Apostila_Modulo_Aula5.pdf">
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" style="font-weight: 700;">Salvar e Publicar Aula</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  handleCreateLesson() {
    const courseId = document.getElementById("teacher-lesson-course").value;
    let moduleId = document.getElementById("teacher-lesson-module").value;

    if (moduleId === "new") {
      const newTitle = document.getElementById("teacher-lesson-new-mod-title").value.trim() || "Novo Módulo";
      const newMod = PratikaDB.addModule(courseId, { title: newTitle, description: "" });
      moduleId = newMod.id;
    }

    const title = document.getElementById("teacher-lesson-title").value.trim();
    const duration = document.getElementById("teacher-lesson-duration").value.trim() || "20 min";
    const videoUrl = document.getElementById("teacher-lesson-url").value.trim() || "https://assets.mixkit.co/videos/preview/mixkit-online-learning-with-a-laptop-42191-large.mp4";
    const description = document.getElementById("teacher-lesson-desc").value.trim();
    const matName = document.getElementById("teacher-lesson-material-name").value.trim();

    const materials = [];
    if (matName) {
      materials.push({
        id: "mat-" + Date.now(),
        title: matName,
        type: "PDF",
        size: "1.5 MB",
        url: "#"
      });
    }

    PratikaDB.addLessonToModule(courseId, moduleId, {
      title,
      duration,
      videoUrl,
      description,
      materials
    });

    const course = PratikaDB.getCourse(courseId);
    PratikaDB.addLesson({
      title: `${title} (${course?.name || course?.title || 'Curso'})`,
      teacherName: `Prof. ${this.session.userName || 'Lucas Martins'}`,
      time: "Hoje - 19:00",
      status: "Agendada",
      schoolId: this.session.schoolId || "escola-1"
    });

    this.closeModal();
    this.showToast("Videoaula adicionada com sucesso ao curso!", "success");
    this.renderInternalView();
  }

  showCreateLessonModal(courseId, moduleId) {
    this.showTeacherLessonModal(courseId, moduleId);
  }

  showAddLessonModal(courseId) {
    this.showTeacherLessonModal(courseId);
  }

  // ============================================================================
  // MODAL: PUBLICAR MATERIAL DIDÁTICO COM ESPAÇO PARA UPLOAD DE ARQUIVO
  // ============================================================================
  showTeacherMaterialModal(courseId = null, moduleId = null) {
    const modalRoot = this.getModalRoot();
    document.body.style.overflow = "hidden";
    const courses = PratikaDB.getCourses(this.session?.schoolId);
    if (!courses || courses.length === 0) {
      this.showToast("Crie primeiro um curso antes de cadastrar materiais.", "warning");
      this.showTeacherCourseModal();
      return;
    }

    const activeCourse = courseId ? (PratikaDB.getCourse(courseId) || courses[0]) : courses[0];
    const modules = activeCourse.modules || [];
    const activeModule = moduleId ? (modules.find(m => m.id === moduleId) || modules[0]) : modules[0];
    const existingMats = PratikaDB.getCourseMaterials(activeCourse.id);

    modalRoot.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
        <div class="school-modal-card auth-card" style="max-width: 620px; width: 100%; background: #FFF; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem; background: rgba(59, 130, 246, 0.15); color: #2563EB;">NOVO MATERIAL DIDÁTICO</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">Anexar Material de Apoio</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0.15rem 0 0 0;">Suba apostilas, PDFs, áudios ou vídeos complementares para o módulo.</p>
            </div>
            <button onclick="app.closeModal()" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 4px; font-size: 1.2rem;">${Icons.close}</button>
          </div>

          <form id="teacher-material-form" onsubmit="event.preventDefault(); app.handleCreateMaterial();">
            <!-- SELEÇÃO DE CURSO E MÓDULO -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; background: #F8FAFC; padding: 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.82rem; color: #1E293B; display: block; margin-bottom: 0.25rem;">Curso de Idioma *</label>
                <select id="teacher-mat-course" class="form-control" onchange="app.onModalCourseChange(this.value, 'teacher-mat-module')" style="font-weight: 600; font-size: 0.85rem;" required>
                  ${courses.map(c => `<option value="${c.id}" ${c.id === activeCourse.id ? "selected" : ""}>${c.name || c.title} (${c.level || 'Geral'})</option>`).join("")}
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.82rem; color: #1E293B; display: block; margin-bottom: 0.25rem;">Módulo do Curso *</label>
                <select id="teacher-mat-module" class="form-control" onchange="app.checkNewModuleField(this.value, 'teacher-mat-new-mod-group')" style="font-weight: 600; font-size: 0.85rem;" required>
                  ${modules.length > 0 ? modules.map((m, idx) => `<option value="${m.id}" ${(activeModule && m.id === activeModule.id) ? "selected" : ""}>${m.title || 'Módulo ' + (idx + 1)}</option>`).join("") : ""}
                  <option value="new">+ Criar Novo Módulo...</option>
                </select>
              </div>
            </div>

            <div id="teacher-mat-new-mod-group" class="form-group" style="display: none; margin-bottom: 1rem; background: #EFF6FF; padding: 0.75rem; border-radius: 8px; border: 1px dashed #93C5FD;">
              <label style="font-weight: 700; font-size: 0.82rem; color: #1E40AF; display: block; margin-bottom: 0.25rem;">Nome do Novo Módulo *</label>
              <input type="text" id="teacher-mat-new-mod-title" class="form-control" placeholder="Ex: Módulo ${modules.length + 1} — Gramática e Vocabulário">
            </div>

            <!-- ÁREA / ESPAÇO PARA SUBIR O ARQUIVO (DRAG & DROP / CLIQUE) -->
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Subir Arquivo do Material *</label>
              <div class="file-upload-dropzone" onclick="document.getElementById('teacher-mat-file-input').click();">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="var(--primary-color)" stroke-width="2" fill="none" style="margin-bottom: 0.4rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">Clique aqui para selecionar o arquivo</div>
                <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.2rem;">Suporta PDF, Vídeos (MP4), Áudios (MP3), Slides (PPTX), Documentos</div>
                <div id="teacher-mat-file-chosen" style="margin-top: 0.6rem; font-weight: 700; font-size: 0.84rem; color: #16A34A; display: none;"></div>
              </div>
              <input type="file" id="teacher-mat-file-input" style="display: none;" onchange="app.onMaterialFileSelected(this)">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Título do Material *</label>
              <input type="text" id="teacher-mat-title" class="form-control" placeholder="Ex: Apostila Guia: Phrasal Verbs & Expressões do Dia a Dia" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Tipo de Material</label>
                <select id="teacher-mat-type" class="form-control">
                  <option value="PDF">PDF (Apostila / Resumo)</option>
                  <option value="Vídeo">Vídeo Complementar</option>
                  <option value="Áudio">Áudio / Listening</option>
                  <option value="Slides">Slides de Apresentação</option>
                  <option value="Arquivo">Outro Arquivo</option>
                </select>
              </div>

              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Tamanho Estimado</label>
                <input type="text" id="teacher-mat-size" class="form-control" value="2.4 MB">
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Nome do Arquivo / Link</label>
              <input type="text" id="teacher-mat-filename" class="form-control" placeholder="Ex: Guia_Estudos_Modulo1.pdf" value="Apostila_Pratika_Digital.pdf">
            </div>

            ${existingMats.length > 0 ? `
              <div style="margin-bottom: 1.25rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="font-weight: 700; font-size: 0.78rem; color: #64748B; text-transform: uppercase; margin-bottom: 0.5rem;">Materiais já publicados neste curso (${existingMats.length})</div>
                <div style="max-height: 100px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.35rem;">
                  ${existingMats.slice(0, 4).map(m => `
                    <div style="font-size: 0.8rem; color: #334155; display: flex; align-items: center; justify-content: space-between;">
                      <span>📄 ${m.title}</span>
                      <span class="badge" style="font-size: 0.65rem;">${m.type}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" style="font-weight: 700;">Publicar Material</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  handleCreateMaterial() {
    const courseId = document.getElementById("teacher-mat-course").value;
    let moduleId = document.getElementById("teacher-mat-module").value;

    if (moduleId === "new") {
      const newTitle = document.getElementById("teacher-mat-new-mod-title").value.trim() || "Novo Módulo";
      const newMod = PratikaDB.addModule(courseId, { title: newTitle, description: "" });
      moduleId = newMod.id;
    }

    const title = document.getElementById("teacher-mat-title").value.trim();
    const type = document.getElementById("teacher-mat-type").value;
    const size = document.getElementById("teacher-mat-size").value.trim() || "2.0 MB";
    const filename = document.getElementById("teacher-mat-filename").value.trim() || "Material_Didatico.pdf";

    PratikaDB.addMaterialToModule(courseId, moduleId, {
      title,
      type,
      size,
      filename,
      url: "#"
    });

    const course = PratikaDB.getCourse(courseId);
    const mod = (course?.modules || []).find(m => m.id === moduleId);

    PratikaDB.addMaterial({
      module: mod?.title || "Módulo Geral",
      title: `${title} (${course?.name || course?.title || 'Curso'})`,
      type,
      duration: (type === "Vídeo" || type === "Áudio") ? "20 min" : undefined,
      pages: (type === "PDF") ? "12 páginas" : undefined,
      schoolId: this.session.schoolId || "escola-1",
      downloadUrl: "#"
    });

    this.closeModal();
    this.showToast("Material didático anexado ao curso com sucesso!", "success");
    this.renderInternalView();
  }

  // ============================================================================
  // MODAL: CRIAR ATIVIDADE COM UPLOAD DE PDF DO PROFESSOR
  // ============================================================================
  showTeacherTaskModal(courseId = null, moduleId = null) {
    const modalRoot = this.getModalRoot();
    document.body.style.overflow = "hidden";
    const courses = PratikaDB.getCourses(this.session?.schoolId);
    if (!courses || courses.length === 0) {
      this.showToast("Crie primeiro um curso antes de publicar atividades.", "warning");
      this.showTeacherCourseModal();
      return;
    }

    const activeCourse = courseId ? (PratikaDB.getCourse(courseId) || courses[0]) : courses[0];
    const modules = activeCourse.modules || [];
    const activeModule = moduleId ? (modules.find(m => m.id === moduleId) || modules[0]) : modules[0];

    const todayStr = new Date().toISOString().split("T")[0];
    const dueDateDefault = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    modalRoot.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
        <div class="school-modal-card auth-card" style="max-width: 660px; width: 100%; background: #FFF; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem; background: rgba(139, 92, 246, 0.15); color: #7C3AED; border-color: rgba(139, 92, 246, 0.3);">NOVA ATIVIDADE / EXERCÍCIO</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">Publicar Atividade no Curso</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0.15rem 0 0 0;">Defina o curso, instruções, critérios de nota e anexe PDF de apoio do professor.</p>
            </div>
            <button onclick="app.closeModal()" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 4px; font-size: 1.2rem;">${Icons.close}</button>
          </div>

          <form id="teacher-task-form" onsubmit="event.preventDefault(); app.handleCreateActivity();">
            <!-- SELEÇÃO DE CURSO E MÓDULO -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; background: #F8FAFC; padding: 0.85rem; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.82rem; color: #1E293B; display: block; margin-bottom: 0.25rem;">Curso de Idioma *</label>
                <select id="teacher-task-course" class="form-control" onchange="app.onModalCourseChange(this.value, 'teacher-task-module')" style="font-weight: 600; font-size: 0.85rem;" required>
                  ${courses.map(c => `<option value="${c.id}" ${c.id === activeCourse.id ? "selected" : ""}>${c.name || c.title} (${c.level || 'Geral'})</option>`).join("")}
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; font-size: 0.82rem; color: #1E293B; display: block; margin-bottom: 0.25rem;">Módulo do Curso *</label>
                <select id="teacher-task-module" class="form-control" onchange="app.checkNewModuleField(this.value, 'teacher-task-new-mod-group')" style="font-weight: 600; font-size: 0.85rem;" required>
                  ${modules.length > 0 ? modules.map((m, idx) => `<option value="${m.id}" ${(activeModule && m.id === activeModule.id) ? "selected" : ""}>${m.title || 'Módulo ' + (idx + 1)}</option>`).join("") : ""}
                  <option value="new">+ Criar Novo Módulo...</option>
                </select>
              </div>
            </div>

            <div id="teacher-task-new-mod-group" class="form-group" style="display: none; margin-bottom: 1rem; background: #EFF6FF; padding: 0.75rem; border-radius: 8px; border: 1px dashed #93C5FD;">
              <label style="font-weight: 700; font-size: 0.82rem; color: #1E40AF; display: block; margin-bottom: 0.25rem;">Nome do Novo Módulo *</label>
              <input type="text" id="teacher-task-new-mod-title" class="form-control" placeholder="Ex: Módulo ${modules.length + 1} — Exercícios e Avaliações">
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Título da Atividade *</label>
              <input type="text" id="activity-input-title" class="form-control" placeholder="Ex: Exercício Avaliativo: Redação e Rotina Diária" required>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Enunciado da Atividade *</label>
              <textarea id="activity-input-statement" class="form-control" rows="3" placeholder="Descreva as instruções completas para os alunos: o que eles devem responder e enviar..." required></textarea>
            </div>

            <!-- ESPAÇO PARA SUBIR PDF DO PROFESSOR -->
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Subir PDF de Apoio do Professor (Opcional)</label>
              <div class="file-upload-dropzone" onclick="document.getElementById('teacher-task-pdf-file-input').click();">
                <span style="font-size: 1.6rem; color: #EF4444;">📄</span>
                <div style="font-weight: 800; font-size: 0.92rem; color: #0F172A; margin-top: 0.25rem;">Clique aqui para selecionar o PDF (.pdf)</div>
                <div style="font-size: 0.78rem; color: #64748B;">Anexe uma folha de exercícios, gabarito ou lista de tópicos em PDF</div>
                <div id="teacher-task-pdf-chosen" style="margin-top: 0.5rem; font-weight: 700; font-size: 0.84rem; color: #16A34A; display: none;"></div>
              </div>
              <input type="file" id="teacher-task-pdf-file-input" accept=".pdf" style="display: none;" onchange="app.onTaskPdfSelected(this)">
              <input type="hidden" id="activity-input-teacher-pdf-name" value="">
            </div>

            <!-- Toggle com ou sem nota -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <div>
                  <div style="font-weight: 800; font-size: 0.9rem; color: #0F172A;">Atividade com Nota Avaliativa?</div>
                  <div style="font-size: 0.78rem; color: #64748B;">Habilite para definir pontuação máxima e critérios de avaliação pedagógica.</div>
                </div>
                <input type="checkbox" id="activity-toggle-grade" checked style="width: 20px; height: 20px; cursor: pointer;" onchange="document.getElementById('grade-criteria-fields').style.display = this.checked ? 'block' : 'none';">
              </div>

              <div id="grade-criteria-fields">
                <div class="form-group" style="margin-bottom: 0.75rem;">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.25rem;">Nota Máxima</label>
                  <input type="number" id="activity-input-maxgrade" class="form-control" value="10.0" step="0.5" min="1" max="100" style="max-width: 150px;">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.25rem;">Critérios de Avaliação (visíveis para o aluno)</label>
                  <textarea id="activity-input-criteria" class="form-control" rows="2" placeholder="1. Correção gramatical (5.0 pts)&#10;2. Clareza e ortografia (5.0 pts)">1. Correção gramatical e aplicação dos conteúdos estudados (5.0 pts)&#10;2. Clareza, ortografia e pontuação correta (5.0 pts)</textarea>
                </div>
              </div>
            </div>

            <!-- Datas de Início e Limite -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.25rem;">Data de Início</label>
                <input type="date" id="activity-input-startdate" class="form-control" value="${todayStr}" required>
              </div>
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.25rem;">Data Limite (Prazo Final) *</label>
                <input type="date" id="activity-input-duedate" class="form-control" value="${dueDateDefault}" required>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; font-size: 0.82rem; color: #334155; display: block; margin-bottom: 0.25rem;">Status de Publicação</label>
              <select id="activity-input-status" class="form-control">
                <option value="published">Publicada Imediatamente (Visível aos Alunos)</option>
                <option value="draft">Rascunho (Não visível aos alunos)</option>
              </select>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" style="font-weight: 700;">Salvar e Publicar Atividade</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  handleCreateActivity() {
    const courseId = document.getElementById("teacher-task-course").value;
    let moduleId = document.getElementById("teacher-task-module").value;

    if (moduleId === "new") {
      const newTitle = document.getElementById("teacher-task-new-mod-title").value.trim() || "Novo Módulo";
      const newMod = PratikaDB.addModule(courseId, { title: newTitle, description: "" });
      moduleId = newMod.id;
    }

    const title = document.getElementById("activity-input-title").value.trim();
    const statement = document.getElementById("activity-input-statement").value.trim();
    const hasGrade = document.getElementById("activity-toggle-grade").checked;
    const maxGrade = hasGrade ? parseFloat(document.getElementById("activity-input-maxgrade").value || 10) : 0;
    const evaluationCriteria = hasGrade ? document.getElementById("activity-input-criteria").value.trim() : "";
    const startDate = document.getElementById("activity-input-startdate").value;
    const dueDate = document.getElementById("activity-input-duedate").value;
    const status = document.getElementById("activity-input-status").value;

    const fileInput = document.getElementById("teacher-task-pdf-file-input");
    const manualPdfName = document.getElementById("activity-input-teacher-pdf-name")?.value.trim();
    let teacherPdf = null;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      teacherPdf = {
        name: fileInput.files[0].name,
        size: (fileInput.files[0].size / (1024 * 1024)).toFixed(1) + " MB",
        url: "#"
      };
    } else if (manualPdfName) {
      teacherPdf = {
        name: manualPdfName,
        size: "1.2 MB",
        url: "#"
      };
    }

    PratikaDB.addActivityToModule(courseId, moduleId, {
      title,
      statement,
      teacherPdf,
      hasGrade,
      maxGrade,
      evaluationCriteria,
      startDate,
      dueDate,
      status
    });

    const course = PratikaDB.getCourse(courseId);
    PratikaDB.addTask({
      title: `${title} (${course?.name || course?.title || 'Curso'})`,
      desc: statement,
      dueDate: dueDate,
      status: "Pendente",
      schoolId: this.session.schoolId || "escola-1"
    });

    this.closeModal();
    this.showToast("Atividade criada com sucesso e adicionada ao curso!", "success");
    this.renderInternalView();
  }

  showCreateActivityModal(courseId, moduleId) {
    this.showTeacherTaskModal(courseId, moduleId);
  }

  // ============================================================================
  // MODAL: CRIAR NOVO CURSO (PROFESSOR & ESCOLA)
  // ============================================================================
  showTeacherCourseModal() {
    const modalRoot = this.getModalRoot();
    document.body.style.overflow = "hidden";

    modalRoot.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
        <div class="school-modal-card auth-card" style="max-width: 560px; width: 100%; background: #FFF; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem;">NOVO CURSO</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">Cadastrar Curso de Idioma</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0.15rem 0 0 0;">Crie o curso para vincular módulos, aulas gravadas e atividades.</p>
            </div>
            <button onclick="app.closeModal()" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 4px; font-size: 1.2rem;">${Icons.close}</button>
          </div>

          <form id="teacher-course-form" onsubmit="event.preventDefault(); app.handleCreateCourse();">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Nome do Curso *</label>
              <input type="text" id="new-course-title" class="form-control" placeholder="Ex: Conversação Avançada C1 & Negócios" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Nível CEFR</label>
                <select id="new-course-level" class="form-control">
                  <option value="A1 Iniciante">A1 Iniciante</option>
                  <option value="A2 Básico">A2 Básico</option>
                  <option value="B1 Intermediário" selected>B1 Intermediário</option>
                  <option value="B2 Avançado">B2 Avançado</option>
                  <option value="C1 Fluente">C1 Fluente</option>
                  <option value="C2 Bilíngue">C2 Bilíngue</option>
                </select>
              </div>
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Categoria</label>
                <input type="text" id="new-course-cat" class="form-control" value="Inglês Geral">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Dias das Aulas</label>
                <input type="text" id="new-course-days" class="form-control" value="Seg e Qua" placeholder="Ex: Terça e Quinta">
              </div>
              <div class="form-group">
                <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Horário</label>
                <input type="text" id="new-course-hours" class="form-control" value="19:00 - 20:00" placeholder="Ex: 19:00 - 20:30">
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Sala Virtual / Presencial</label>
              <input type="text" id="new-course-room" class="form-control" value="Sala Virtual 01" placeholder="Ex: Sala Virtual 01">
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Descrição do Curso</label>
              <textarea id="new-course-desc" class="form-control" rows="3" placeholder="Apresente a metodologia, público-alvo e objetivos do curso..."></textarea>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" style="font-weight: 700;">Cadastrar Curso</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  handleCreateCourse() {
    const title = document.getElementById("new-course-title").value.trim();
    const level = document.getElementById("new-course-level").value;
    const category = document.getElementById("new-course-cat").value;
    const days = document.getElementById("new-course-days").value.trim() || "Seg e Qua";
    const hours = document.getElementById("new-course-hours").value.trim() || "19:00 - 20:00";
    const room = document.getElementById("new-course-room").value.trim() || "Sala Virtual 01";
    const description = document.getElementById("new-course-desc").value.trim();

    PratikaDB.addCourse({
      title,
      name: title,
      level,
      category,
      days,
      hours,
      room,
      description,
      instructor: this.session.userName || "Prof. Lucas Martins",
      schoolId: this.session.schoolId || "escola-1"
    });

    this.closeModal();
    this.showToast("Curso cadastrado com sucesso!", "success");
    this.renderInternalView();
  }

  showCreateCourseModal() {
    this.showTeacherCourseModal();
  }

  // ============================================================================
  // MODAL: MATERIAIS DA AULA INDIVIDUAL
  // ============================================================================
  showLessonMaterialsModal(courseId, moduleId, itemId) {
    const modalRoot = this.getModalRoot();
    document.body.style.overflow = "hidden";
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];
    const mod = (course.modules || []).find(m => m.id === moduleId) || (course.modules || [])[0];
    const item = (mod.items || []).find(i => i.id === itemId);
    const materials = item ? (item.materials || []) : [];

    modalRoot.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
        <div class="school-modal-card auth-card" style="max-width: 580px; width: 100%; background: #FFF; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem;">MATERIAIS DA AULA</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">${item ? item.title : 'Aula'}</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0.15rem 0 0 0;">${course.name || course.title} • ${mod.title}</p>
            </div>
            <button onclick="app.closeModal()" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 4px; font-size: 1.2rem;">${Icons.close}</button>
          </div>

          <div style="max-height: 50vh; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;">
            ${materials.length === 0 ? `
              <div style="text-align: center; padding: 2rem; color: #64748B; font-size: 0.9rem;">
                Nenhum material anexo para esta aula específica.
              </div>
            ` : materials.map(m => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 0.85rem 1rem; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 1.25rem; color: #EF4444;">📄</span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #0F172A;">${m.title}</div>
                    <div style="font-size: 0.75rem; color: #64748B;">${m.type || 'PDF'} • ${m.size || '1.5 MB'}</div>
                  </div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="app.downloadFile('${m.url || m.downloadUrl || '#'}')">
                  ${Icons.download} Baixar
                </button>
              </div>
            `).join("")}
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 1.25rem;">
            <button class="btn btn-secondary" onclick="app.closeModal()">Fechar</button>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // MODAL: MATERIAIS DO MÓDULO (TODOS OS MATERIAIS CONSOLIDADOS)
  // ============================================================================
  showModuleMaterialsModal(courseId, moduleId = null) {
    const modalRoot = this.getModalRoot();
    document.body.style.overflow = "hidden";
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];
    const materials = moduleId ? PratikaDB.getModuleMaterials(course.id, moduleId) : PratikaDB.getCourseMaterials(course.id);
    const mod = moduleId ? (course.modules || []).find(m => m.id === moduleId) : null;

    modalRoot.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
        <div class="school-modal-card auth-card" style="max-width: 650px; width: 100%; background: #FFF; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem; background: rgba(59, 130, 246, 0.15); color: #2563EB;">CENTRAL DE MATERIAIS</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">${mod ? 'Materiais do ' + mod.title : 'Materiais do Curso: ' + (course.name || course.title)}</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0.15rem 0 0 0;">Todos os materiais didáticos, apostilas, slides e anexos organizados.</p>
            </div>
            <button onclick="app.closeModal()" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 4px; font-size: 1.2rem;">${Icons.close}</button>
          </div>

          <div style="max-height: 55vh; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;">
            ${materials.length === 0 ? `
              <div style="text-align: center; padding: 2.5rem 1rem; color: #64748B;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📂</div>
                <div style="font-weight: 700;">Nenhum material cadastrado ainda</div>
                <p style="font-size: 0.82rem; margin-top: 0.25rem;">Clique em "+ Material" para publicar apostilas e arquivos neste módulo.</p>
              </div>
            ` : materials.map(m => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 0.85rem 1rem; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 1.25rem; color: ${m.type === 'PDF' ? '#EF4444' : '#2563EB'};">
                    ${m.type === 'PDF' ? '📄' : (m.type === 'Vídeo' ? '🎬' : '📁')}
                  </span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #0F172A;">${m.title}</div>
                    <div style="font-size: 0.75rem; color: #64748B;">${m.itemTitle ? m.itemTitle + ' • ' : ''}${m.type || 'Arquivo'} • ${m.size || '1.5 MB'}</div>
                  </div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="app.downloadFile('${m.url || m.downloadUrl || '#'}')">
                  ${Icons.download} Baixar
                </button>
              </div>
            `).join("")}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; border-top: 1px solid #E2E8F0; padding-top: 1rem;">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); app.showTeacherMaterialModal('${course.id}', '${moduleId || ''}')">
              ${Icons.plus} Adicionar Novo Material
            </button>
            <button class="btn btn-primary btn-sm" onclick="app.closeModal()">Concluir</button>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // MODAL: CRIAR NOVO MÓDULO (PROFESSOR & ESCOLA)
  // ============================================================================
  showCreateModuleModal(courseId) {
    const modalRoot = this.getModalRoot();
    document.body.style.overflow = "hidden";
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];

    modalRoot.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
        <div class="school-modal-card auth-card" style="max-width: 520px; width: 100%; background: #FFF; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem;">ESTRUTURA DO CURSO</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">Adicionar Novo Módulo</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0.15rem 0 0 0;">Curso: ${course.name || course.title}</p>
            </div>
            <button onclick="app.closeModal()" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 4px; font-size: 1.2rem;">${Icons.close}</button>
          </div>

          <form onsubmit="event.preventDefault(); const t = document.getElementById('mod-title-inp').value.trim(); const d = document.getElementById('mod-desc-inp').value.trim(); PratikaDB.addModule('${course.id}', { title: t, description: d }); app.closeModal(); app.showToast('Módulo adicionado com sucesso!', 'success'); app.renderInternalView();">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Nome do Módulo *</label>
              <input type="text" id="mod-title-inp" class="form-control" placeholder="Ex: Módulo 3 — Conversação em Viagens e Aeroportos" required>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-weight: 700; font-size: 0.85rem; color: #334155; display: block; margin-bottom: 0.35rem;">Descrição do Módulo</label>
              <textarea id="mod-desc-inp" class="form-control" rows="3" placeholder="Descreva os objetivos e temas deste módulo..."></textarea>
            </div>
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
              <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancelar</button>
              <button type="submit" class="btn btn-primary" style="font-weight: 700;">Criar Módulo</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // MODAL: VISUALIZAR ENTREGAS DA ATIVIDADE (PROFESSOR)
  // ============================================================================
  showActivitySubmissionsModal(courseId, moduleId, itemId) {
    const modalRoot = this.getModalRoot();
    document.body.style.overflow = "hidden";
    const course = PratikaDB.getCourse(courseId) || PratikaDB.getCourses()[0];
    const mod = (course.modules || []).find(m => m.id === moduleId) || (course.modules || [])[0];
    const item = (mod.items || []).find(i => i.id === itemId);
    const submissions = item ? (item.submissions || []) : [];

    modalRoot.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
        <div class="school-modal-card auth-card" style="max-width: 680px; width: 100%; background: #FFF; padding: 2rem; border-radius: 16px; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div>
              <span class="badge active" style="font-size: 0.7rem; margin-bottom: 0.2rem; background: rgba(139, 92, 246, 0.15); color: #7C3AED;">ENTREGAS DE ALUNOS</span>
              <h3 style="font-family:var(--font-title); font-size:1.25rem; font-weight:800; color: #0F172A; margin: 0;">${item ? item.title : 'Atividade'}</h3>
              <p style="font-size: 0.8rem; color: #64748B; margin: 0.15rem 0 0 0;">${submissions.length} aluno(s) já enviaram a resolução desta atividade.</p>
            </div>
            <button onclick="app.closeModal()" style="background:transparent; border:none; cursor:pointer; color: #64748B; padding: 4px; font-size: 1.2rem;">${Icons.close}</button>
          </div>

          <div style="max-height: 55vh; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;">
            ${submissions.length === 0 ? `
              <div style="text-align: center; padding: 2rem; color: #64748B; font-size: 0.88rem;">
                Nenhum aluno submeteu esta atividade ainda.
              </div>
            ` : submissions.map(sub => `
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1rem 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <div>
                    <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">${sub.studentName}</div>
                    <div style="font-size: 0.78rem; color: #64748B;">Data de envio: ${sub.submissionDate}</div>
                  </div>
                  <span class="badge ${sub.grade != null ? 'active' : 'pending'}">
                    ${sub.grade != null ? 'Nota: ' + sub.grade + '/' + (item.maxGrade || 10) : 'Aguardando Avaliação'}
                  </span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; background: #FFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.6rem 0.85rem; margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #334155; font-weight: 600;">
                    <span style="color: #EF4444;">📄</span> ${sub.fileName} (${sub.fileSize || '1.1 MB'})
                  </div>
                  <button class="btn btn-outline btn-sm" onclick="app.showToast('Download do PDF do aluno iniciado: ${sub.fileName}', 'success')">
                    ${Icons.download} Baixar PDF do Aluno
                  </button>
                </div>

                ${sub.studentNotes ? `
                  <div style="font-size: 0.82rem; color: #475569; margin-bottom: 0.5rem; background: #F1F5F9; padding: 0.5rem 0.75rem; border-radius: 4px;">
                    <strong>Comentário do Aluno:</strong> "${sub.studentNotes}"
                  </div>
                ` : ''}

                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                  <button class="btn btn-primary btn-sm" onclick="app.showToast('Atividade avaliada com sucesso!', 'success')">
                    ${sub.grade != null ? 'Editar Nota / Feedback' : 'Atribuir Nota & Feedback'}
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 1.25rem;">
            <button class="btn btn-secondary" onclick="app.closeModal()">Fechar</button>
          </div>
        </div>
      </div>
    `;
  }

  // EXCLUSÃO DE ITEM DO MÓDULO
  deleteModuleItemConfirm(courseId, moduleId, itemId) {
    if (confirm("Tem certeza que deseja remover este item do módulo?")) {
      PratikaDB.deleteModuleItem(courseId, moduleId, itemId);
      this.showToast("Item removido do módulo com sucesso.", "info");
      this.renderInternalView();
    }
  }
}

// Cria instância global da aplicação
// Inicialização e restauração da sessão em backend-client.js.




