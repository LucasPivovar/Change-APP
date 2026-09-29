<template>
  <div class="home-container">
    <!-- Static App Header -->
    <header class="app-header">
      <button class="menu-btn" @click="$emit('openSidebar')">
        <MenuIcon size="24" stroke-width="2.5" />
      </button>
      <h2 class="header-title">{{ t('nav_home') }}</h2>
    </header>

    <div class="home-content">
      <div class="mascot-header">
        <img src="../assets/camaleao.png" class="peeking-mascot" />
        <h2>{{ t('home_title') }}</h2>
        <p>{{ t('home_subtitle') }}</p>
      </div>
      
      <div class="cards-grid">
        <div class="lang-card" @click="$emit('selectLanguage', 'en')" style="animation-delay: 0.15s">
          <img src="../assets/englishcard.jpeg" alt="Inglês" />
          <div class="flag-circle"><img src="https://flagcdn.com/w40/gb.png" alt="UK Flag" /></div>
          <div class="card-label" style="background-color: #21448b;">Inglês</div>
        </div>
        <div class="lang-card" @click="$emit('selectLanguage', 'es')" style="animation-delay: 0.3s">
          <img src="../assets/espanolcard.jpeg" alt="Espanhol" />
          <div class="flag-circle"><img src="https://flagcdn.com/w40/es.png" alt="Spain Flag" /></div>
          <div class="card-label" style="background-color: #b05716;">Espanhol</div>
        </div>
        <div class="lang-card" @click="$emit('selectLanguage', 'fr')" style="animation-delay: 0.45s">
          <img src="../assets/francescard.jpeg" alt="Francês" />
          <div class="flag-circle"><img src="https://flagcdn.com/w40/fr.png" alt="France Flag" /></div>
          <div class="card-label" style="background-color: #28446b;">Francês</div>
        </div>
        <div class="lang-card" @click="$emit('selectLanguage', 'pt')" style="animation-delay: 0.6s">
          <img src="../assets/portuguesecard.jpeg" alt="Português" />
          <div class="flag-circle"><img src="https://flagcdn.com/w40/br.png" alt="Brazil Flag" /></div>
          <div class="card-label" style="background-color: #0b5e28;">Português</div>
        </div>
      </div>

      <div class="practice-card">
        <img src="../assets/2.png" alt="Camaleão" />
        <div>
          <strong>{{ practiceTitle }}</strong>
          <p>{{ practiceText }}</p>
        </div>
      </div>

    </div>
    <nav class="bottom-nav">
      <div class="nav-item active" @click="$emit('navigate', 'home')">
        <HomeIcon size="28" />
        <span>{{ t('nav_home') }}</span>
      </div>
      <div class="nav-item" @click="$emit('navigate', 'conversations')">
        <MessageCircleIcon size="28" />
        <span>{{ t('nav_chats') }}</span>
      </div>
      <div class="nav-item" @click="$emit('navigate', 'friends')">
        <UsersIcon size="28" />
        <span>Amigos</span>
      </div>
      <div class="nav-item" @click="$emit('navigate', 'profile')">
        <UserIcon size="28" />
        <span>{{ t('nav_profile') }}</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { 
  Home as HomeIcon, 
  MessageCircle as MessageCircleIcon, 
  User as UserIcon,
  Users as UsersIcon,
  Menu as MenuIcon
} from '@lucide/vue'
import { t } from '../data/translations.js'
import { computed, onMounted, ref } from 'vue'
import { profileApi } from '../services/chatApi'

defineEmits(['selectLanguage', 'openSidebar', 'navigate'])
const stats = ref({ streakDays: 0, practicedSeconds: 0 })
const practiceTitle = computed(() => stats.value.streakDays > 0 ? `Você já está há ${stats.value.streakDays} dias praticando` : 'Comece sua prática hoje')
const practiceText = computed(() => stats.value.streakDays > 0 ? 'O Camaleão está acompanhando sua evolução. Continue conversando para manter a ofensiva.' : 'Escolha um idioma e converse com o Camaleão para iniciar sua sequência.')
onMounted(async () => {
  try { stats.value = (await profileApi()).stats || stats.value } catch {}
})
</script>

<style scoped>
.home-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, #f4f8ff 0%, #ffffff 45%);
  z-index: 10; /* Cover the auth background */
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUpFade {
  from { 
    opacity: 0; 
    transform: translateY(35px) scale(0.92) rotate(-1deg); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1) rotate(0); 
  }
}

/* Header styling */
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

.header-logo-container {
  display: flex;
  align-items: center;
}

.header-logo {
  height: 42px;
  object-fit: contain;
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

.home-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  padding-bottom: 100px; /* space for bottom nav */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

@keyframes floatMascot {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(1.5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.mascot-header {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 36px;
}

.peeking-mascot {
  height: 80px;
  object-fit: contain;
  margin-bottom: -4px;
  margin-top: -20px;
}

.mascot-header h2 {
  font-size: 26px;
  background: linear-gradient(135deg, #1a235c 0%, #1c5bf0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  margin-bottom: 10px;
  line-height: 1.35;
  letter-spacing: -0.5px;
}

.mascot-header p {
  color: #5c6b8a;
  font-size: 15.5px;
  font-weight: 500;
  opacity: 0.9;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 48px; /* increased section spacing */
}

.practice-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  color: #1a235c;
  border: 1px solid #dbeafe;
  border-radius: 28px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 14px 30px rgba(28, 91, 240, .08);
  animation: slideUpFade 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.practice-card img {
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: 50%;
  background: #e0f2fe;
  animation: floatMascot 2.4s ease-in-out infinite;
}

.practice-card strong {
  font-size: 17px;
  font-weight: 900;
}

.practice-card p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.4;
  opacity: .92;
  color: #64748b;
}

.lang-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  height: 240px;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
  opacity: 0;
  animation: slideUpFade 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; /* slowed down animation speed */
}

/* Card Hover effect */
.lang-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Card Glare Shine Effect */
.lang-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 125%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-25deg);
  transition: 0.75s;
}

.lang-card:hover::after {
  left: 150%;
}

.lang-card:active {
  transform: scale(0.97);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.lang-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.lang-card:hover img {
  transform: scale(1.08);
}

.flag-circle {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 2;
  overflow: hidden;
  background: white; /* fallback */
  border: 2px solid white;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lang-card:hover .flag-circle {
  transform: scale(1.15) rotate(8deg);
}

.flag-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  color: white;
  font-weight: 800;
  font-size: 16px;
  text-align: center;
  transition: padding-bottom 0.3s ease, font-size 0.3s ease;
}

.lang-card:hover .card-label {
  padding-bottom: 16px;
  font-size: 17px;
}
/* SUPPORT/SCHOOLS SECTION STYLES */
.support-section {
  width: 100%;
  max-width: 400px;
  margin-top: 24px;
  margin-bottom: 48px; /* spacing at bottom */
  padding: 0 12px;
  opacity: 0;
  animation: slideUpFade 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.8s;
}

.support-card {
  background-color: #1c5bf0; /* brand blue */
  border-radius: 32px;
  padding: 40px 24px 0 24px; /* image fills the bottom */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 24px rgba(28, 91, 240, 0.25);
}

.support-title {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff; /* white text */
  line-height: 1.3;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
}

.support-desc {
  font-size: 14.5px;
  font-weight: 500;
  color: #ffffff; /* white text */
  line-height: 1.5;
  margin-bottom: 36px;
  opacity: 0.95;
}

.support-image-container {
  width: calc(100% + 48px);
  margin-left: -24px;
  margin-right: -24px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.support-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  filter: saturate(1.05) contrast(1.02);
}

.support-btn {
  position: absolute;
  bottom: 24px;
  background: #ffffff;
  color: #1c5bf0; /* brand blue text */
  border: none;
  border-radius: 30px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.support-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.support-btn:active {
  transform: scale(0.95);
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center; /* Center items vertically */
  height: 72px; /* Fixed height for vertical centering */
  background: white;
  border-top: 1px solid #e2e8f0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  z-index: 50;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  height: 100%;
}

.nav-item.active {
  color: #1c5bf0;
}

.nav-item span {
  font-size: 11px;
  font-weight: 500;
}

.bottom-banner {
  background: rgba(28, 91, 240, 0.08); /* Light blue with opacity */
  border-radius: 24px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.tiny-mascot {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 50%; /* Just in case it's a square image */
}

.bottom-banner span {
  font-size: 14px;
  color: #1a235c;
  font-weight: 600;
  line-height: 1.4;
}


</style>
