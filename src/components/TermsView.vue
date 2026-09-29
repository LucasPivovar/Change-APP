<template>
  <div class="view-container">
    <!-- Header -->
    <header class="app-header">
      <span class="header-spacer"></span>
      <h2 class="header-title">Privacidade e Termos</h2>
      <button class="menu-btn" @click="$emit('openSidebar')">
        <MenuIcon size="24" stroke-width="2.5" />
      </button>
    </header>

    <div class="content-scroll">
      <div class="terms-card">
        <div class="terms-header-decor">
          <div class="decor-circle">
            <ShieldIcon v-if="activeTab === 'privacy'" size="32" class="decor-icon" />
            <ScrollIcon v-else size="32" class="decor-icon" />
          </div>
          <h3>{{ activeTab === 'privacy' ? 'Política de Privacidade' : 'Termos de Serviço' }}</h3>
          <p class="terms-subtitle">Última atualização: Junho de 2026</p>
        </div>

        <!-- Tab Navigation -->
        <div class="tabs-container">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'terms' }" 
            @click="activeTab = 'terms'"
          >
            Termos de Uso
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'privacy' }" 
            @click="activeTab = 'privacy'"
          >
            Privacidade
          </button>
        </div>

        <!-- Terms of Use Tab Content -->
        <div v-if="activeTab === 'terms'" class="terms-body">
          <section class="terms-section">
            <h4>1. Aceitação dos Termos</h4>
            <p>
              Ao acessar ou utilizar a plataforma **Change**, você concorda integralmente em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer termo ou condição, solicitamos que não utilize a plataforma.
            </p>
          </section>

          <section class="terms-section">
            <h4>2. Descrição do Serviço</h4>
            <p>
              A **Change** (Change Skills) é uma ferramenta interativa desenvolvida para facilitar a prática e o aprendizado de idiomas estrangeiros. A plataforma oferece canais de conversação prática com outros alunos, salas de bate-papo em grupo e interações simuladas com a nossa inteligência artificial inteligente.
            </p>
          </section>

          <section class="terms-section">
            <h4>3. Registro e Segurança da Conta</h4>
            <p>
              Para acessar certas funcionalidades da plataforma, você deve criar uma conta com informações válidas e atualizadas. Você é inteiramente responsável por:
            </p>
            <ul>
              <li>Manter a confidencialidade de sua senha de acesso.</li>
              <li>A segurança do seu e-mail associado à conta.</li>
              <li>Todas as atividades ocorridas sob seu perfil de usuário.</li>
            </ul>
            <p>
              Caso suspeite de qualquer uso não autorizado de sua conta, você deve redefinir sua senha imediatamente por meio das configurações do seu perfil.
            </p>
          </section>

          <section class="terms-section">
            <h4>4. Conduta do Usuário</h4>
            <p>
              A **Change** preza por uma comunidade acolhedora, respeitosa e construtiva. Você concorda em não praticar as seguintes condutas:
            </p>
            <ul>
              <li>Enviar mensagens com teor discriminatório, ofensivo, abusivo ou obsceno.</li>
              <li>Assediar outros alunos ou fingir ser outra pessoa.</li>
              <li>Usar a plataforma para fins publicitários ou comerciais não autorizados.</li>
            </ul>
            <p>
              O descumprimento destas regras de convivência poderá resultar no bloqueio temporário ou exclusão definitiva do seu perfil de usuário.
            </p>
          </section>

          <section class="terms-section">
            <h4>5. Modificações nos Termos e no Serviço</h4>
            <p>
              Reservamo-nos o direito de alterar estes Termos de Uso ou modificar qualquer recurso da plataforma a qualquer momento. Modificações significativas entrarão em vigor após a publicação dos termos atualizados nesta página. Recomendamos a revisão periódica deste documento.
            </p>
          </section>
        </div>

        <!-- Privacy Policy Tab Content -->
        <div v-else class="terms-body">
          <section class="terms-section">
            <h4>1. Coleta de Dados</h4>
            <p>
              Para o pleno funcionamento das jornadas de aprendizado, a plataforma coleta dados básicos de registro, tais como: nome completo, endereço de e-mail e foto de perfil configurada pelo usuário. Adicionalmente, guardamos estatísticas de ofensivas (dias seguidos praticando) e dados de interações com o Camaleão de IA para melhorar as respostas.
            </p>
          </section>

          <section class="terms-section">
            <h4>2. Uso das Informações</h4>
            <p>
              Suas informações são utilizadas exclusivamente para personalizar sua experiência na plataforma, manter o histórico das suas conversações ativas e conectar você com parceiros ideais para conversação de acordo com os idiomas desejados.
            </p>
          </section>

          <section class="terms-section">
            <h4>3. Segurança e Armazenamento</h4>
            <p>
              Implementamos protocolos rígidos de segurança para proteger seus dados contra perda, roubo, acesso não autorizado ou divulgação. As senhas de acesso são criptografadas por hashing seguro antes do armazenamento.
            </p>
          </section>

          <section class="terms-section">
            <h4>4. Compartilhamento de Dados</h4>
            <p>
              A **Change** não comercializa, vende ou aluga seus dados pessoais para terceiros. Seus dados de chat são confidenciais e usados apenas para a prática comunicativa em tempo real com outros alunos ou para o processamento de respostas na simulação de IA.
            </p>
          </section>

          <section class="terms-section">
            <h4>5. Seus Direitos</h4>
            <p>
              Você detém todos os direitos sobre suas informações pessoais, podendo a qualquer momento atualizar seu e-mail, alterar sua senha ou solicitar a exclusão integral do seu perfil nas configurações.
            </p>
          </section>
        </div>

        <button class="accept-terms-btn" @click="$emit('navigate', 'profile')">
          Entendi e Aceito
        </button>
      </div>
    </div>
    <nav class="bottom-nav">
      <div class="nav-item" @click="$emit('navigate', 'home')"><HomeIcon size="28" /><span>Início</span></div>
      <div class="nav-item" @click="$emit('navigate', 'conversations')"><MessageCircleIcon size="28" /><span>Chats</span></div>
      <div class="nav-item" @click="$emit('navigate', 'friends')"><UsersIcon size="28" /><span>Amigos</span></div>
      <div class="nav-item active" @click="$emit('navigate', 'profile')"><UserIcon size="28" /><span>Perfil</span></div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  MessageCircle as MessageCircleIcon,
  Scroll as ScrollIcon,
  Shield as ShieldIcon,
  User as UserIcon,
  Users as UsersIcon
} from '@lucide/vue'

defineEmits(['goBack', 'openSidebar', 'navigate'])

const activeTab = ref('terms')
</script>

<style scoped>
.view-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, #f4f8ff 0%, #ffffff 45%);
  z-index: 60;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Header layout styles */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
  height: 64px;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  color: #1a235c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: transform 0.2s;
}

.back-btn:active {
  transform: scale(0.9);
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 18px;
  color: #1a235c;
  font-weight: 800;
  white-space: nowrap;
}

.menu-btn {
  background: none;
  border: none;
  color: #1a235c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: transform 0.2s;
}

.menu-btn:active {
  transform: scale(0.95);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  padding-bottom: 60px;
}

.terms-card {
  background: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  padding: 28px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 480px;
  margin: 0 auto;
}

.terms-header-decor {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.decor-circle {
  width: 64px;
  height: 64px;
  background-color: #f0f4ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #1c5bf0;
}

.decor-icon {
  animation: pulseIcon 3s ease-in-out infinite;
}

@keyframes pulseIcon {
  0% { transform: scale(1); }
  50% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

.terms-header-decor h3 {
  margin: 0 0 6px 0;
  font-size: 20px;
  font-weight: 850;
  color: #1a235c;
}

.terms-subtitle {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
}

/* Tabs styles */
.tabs-container {
  display: flex;
  background-color: #f1f5f9;
  border-radius: 14px;
  padding: 4px;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background-color: #ffffff;
  color: #1c5bf0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.terms-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.terms-section h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
}

.terms-section p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  font-weight: 500;
}

.terms-section ul {
  margin: 8px 0 8px 20px;
  padding: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.accept-terms-btn {
  background: #1c5bf0;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 15px;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(28, 91, 240, 0.18);
  transition: all 0.2s ease;
  margin-top: 12px;
}

.accept-terms-btn:hover {
  background: #1545bf;
  box-shadow: 0 6px 18px rgba(28, 91, 240, 0.28);
  transform: translateY(-1px);
}

.accept-terms-btn:active {
  transform: translateY(0);
}
</style>

<style scoped>
.header-spacer { width: 32px; height: 32px; }
.content-scroll { padding-bottom: 120px; }
.bottom-nav { display:flex; justify-content:space-around; align-items:center; height:72px; background:white; border-top:1px solid #e2e8f0; position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; z-index:80; }
.nav-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; color:#94a3b8; cursor:pointer; height:100%; }
.nav-item.active { color:#1c5bf0; }
.nav-item span { font-size:11px; font-weight:500; }
</style>
