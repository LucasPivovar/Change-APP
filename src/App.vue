<script setup>
import { ref, watch } from 'vue'
import LanguageSelector from './components/LanguageSelector.vue'
import HeroSection from './components/HeroSection.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import ForgotPasswordForm from './components/ForgotPasswordForm.vue'
import ResetPasswordForm from './components/ResetPasswordForm.vue'
import HomeView from './components/HomeView.vue'
import CourseModeView from './components/CourseModeView.vue'
import LanguageCoursesView from './components/LanguageCoursesView.vue'
import ChatView from './components/ChatView.vue'
import GroupChatView from './components/GroupChatView.vue'
import MascotChatView from './components/MascotChatView.vue'
import SidebarMenu from './components/SidebarMenu.vue'
import ConversationsView from './components/ConversationsView.vue'
import ProfileView from './components/ProfileView.vue'
import TermsView from './components/TermsView.vue'
import FriendsView from './components/FriendsView.vue'
import FriendChatView from './components/FriendChatView.vue'
import PracticeScenarioView from './components/PracticeScenarioView.vue'
import StudentMatchView from './components/StudentMatchView.vue'
import { authApi, currentUser, logout } from './services/chatApi'

const currentForm = ref(currentUser() ? 'home' : 'login')
const selectedLanguage = ref(null)
const selectedCourse = ref(null)
const isSidebarOpen = ref(false)
const activeAiChatId = ref(null)
const activeFriendConversationId = ref(null)
const activeGroupId = ref(null)
const urlParams = new URLSearchParams(window.location.search)
const inviteGroupCode = ref(urlParams.get('group'))
const verifyEmailToken = ref(urlParams.get('verify')?.replace(/\s/g, ''))
const resetPasswordToken = ref(urlParams.get('reset')?.replace(/\s/g, ''))
const selectedScenario = ref(null)
const authMessage = ref('')
let verifiedTimer = null
const clearAuthUrl = () => { window.history.replaceState({}, '', window.location.pathname) }
const openAiChat = (id) => {
  if (!id) {
    activeAiChatId.value = null
    selectedLanguage.value = null
    selectedCourse.value = null
    currentForm.value = 'home'
    return
  }
  activeAiChatId.value = id
  currentForm.value = 'mascot-chat'
}
const openFriendChat = (id) => {
  activeFriendConversationId.value = id
  currentForm.value = 'friend-chat'
}
const openGroupChat = (id) => {
  activeGroupId.value = id
  inviteGroupCode.value = null
  currentForm.value = 'group-chat'
}
const startFreeMascotChat = () => {
  activeAiChatId.value = null
  selectedScenario.value = null
  selectedLanguage.value = selectedLanguage.value || 'en'
  selectedCourse.value = selectedCourse.value || 'general'
  currentForm.value = 'mascot-chat'
}
const startPracticeFlow = () => {
  activeAiChatId.value = null
  selectedScenario.value = null
  if (selectedLanguage.value && selectedCourse.value) currentForm.value = 'practice-scenarios'
  else currentForm.value = selectedLanguage.value ? 'language-courses' : 'home'
}
const startGroupChatFlow = () => {
  activeGroupId.value = null
  inviteGroupCode.value = null
  currentForm.value = 'group-chat'
}
if (resetPasswordToken.value) currentForm.value = 'reset-password'
else if (verifyEmailToken.value) currentForm.value = 'verifying-email'
else if (inviteGroupCode.value && currentUser()) currentForm.value = 'group-chat'
if (verifyEmailToken.value) {
  authApi('/auth/verify-email', { token: verifyEmailToken.value })
    .then(() => {
      clearAuthUrl()
      currentForm.value = 'email-verified-success'
      clearTimeout(verifiedTimer)
      verifiedTimer = setTimeout(() => { currentForm.value = 'home' }, 3000)
    })
    .catch((e) => { authMessage.value = e.message; clearAuthUrl(); currentForm.value = 'login' })
}

const handleLanguageSelect = (lang) => {
  selectedLanguage.value = lang
  currentForm.value = 'language-courses'
}

const handleCourseSelect = (course) => {
  selectedCourse.value = course
  currentForm.value = 'course-mode'
}

const handleModeSelect = (mode) => {
  if (mode === 'solo') {
    currentForm.value = 'friends'
  } else if (mode === 'group') {
    activeGroupId.value = null
    inviteGroupCode.value = null
    currentForm.value = 'group-chat'
  } else if (mode === 'student') {
    currentForm.value = 'student-match'
  } else if (mode === 'mascot') {
    activeAiChatId.value = null
    activeFriendConversationId.value = null
    selectedScenario.value = null
    currentForm.value = 'practice-scenarios'
  }
}

const handleScenarioSelect = (scenario) => {
  selectedScenario.value = scenario
  activeAiChatId.value = null
  activeFriendConversationId.value = null
  currentForm.value = 'mascot-chat'
}

const handleNavigation = (route) => {
  if (route === 'login') {
    logout()
    currentForm.value = 'login'
    selectedLanguage.value = null
    selectedCourse.value = null
    activeAiChatId.value = null
  } else if (route === 'language') {
    // Show a basic alert or placeholder since full language switching requires i18n
    alert('Seletor de idioma em breve!')
  } else {
    currentForm.value = route
  }
}

const lastForm = ref('home')

watch(currentForm, (newVal) => {
  const chatViews = ['chat', 'saved-chat', 'group-chat', 'mascot-chat', 'friend-chat', 'practice-scenarios', 'student-match']
  if (!chatViews.includes(newVal)) {
    lastForm.value = newVal
  }
})

const handleGoBack = () => {
  currentForm.value = lastForm.value
}
</script>

<template>
  <div v-if="currentForm === 'email-verified-success'" class="verified-success-screen">
    <img class="verified-brand" src="/email-art/logo.png" alt="Change Skills Idiomas" />
    <div class="verified-success-card">
      <div class="verified-check">✓</div>
      <h1>Sua conta foi confirmada com sucesso</h1>
    </div>
  </div>

  <SidebarMenu 
    :isOpen="isSidebarOpen" 
    @close="isSidebarOpen = false" 
    @navigate="handleNavigation"
  />

  <div class="auth-layout" v-if="currentForm === 'login' || currentForm === 'register' || currentForm === 'forgot' || currentForm === 'reset-password' || currentForm === 'verifying-email'">
    <LanguageSelector />
    <HeroSection />
    
    <transition name="slide-fade" mode="out-in">
      <LoginForm 
        v-if="currentForm === 'login'" 
        @goToRegister="currentForm = 'register'" 
        @goToForgot="currentForm = 'forgot'" 
        @loginSuccess="currentForm = 'home'"
      />
      <RegisterForm 
        v-else-if="currentForm === 'register'" 
        @goToLogin="currentForm = 'login'" 
        @registerSuccess="currentForm = 'home'"
      />
      <ForgotPasswordForm 
        v-else-if="currentForm === 'forgot'" 
        @goToLogin="currentForm = 'login'" 
      />
      <ResetPasswordForm
        v-else-if="currentForm === 'reset-password'"
        :token="resetPasswordToken || ''"
        @resetSuccess="clearAuthUrl(); currentForm = 'home'"
      />
      <div v-else-if="currentForm === 'verifying-email'" class="auth-status-card">
        <h3>Confirmando seu e-mail...</h3>
        <p>Estamos validando seu link e preparando sua entrada na Change Skills.</p>
      </div>
    </transition>
  </div>
  
  <transition name="slide-fade" mode="out-in">
    <HomeView 
      v-if="currentForm === 'home' || currentForm === 'course-mode'" 
      @selectLanguage="handleLanguageSelect" 
      @openSidebar="isSidebarOpen = true"
      @navigate="handleNavigation"
    />
  </transition>

  <transition name="slide-up">
    <LanguageCoursesView 
      v-if="currentForm === 'language-courses'" 
      :selectedLanguage="selectedLanguage"
      @goBack="currentForm = 'home'"
      @selectCourse="handleCourseSelect"
    />
  </transition>

  <transition name="slide-up">
    <CourseModeView 
      v-if="currentForm === 'course-mode'" 
      @goBack="currentForm = 'language-courses'"
      @selectMode="handleModeSelect"
    />
  </transition>

  <transition name="fade">
    <ChatView 
      v-if="currentForm === 'chat' || currentForm === 'saved-chat'" 
      :isSaved="currentForm === 'saved-chat'"
      @goBack="handleGoBack"
      @newPartner="currentForm = 'course-mode'"
      @continueChat="currentForm = 'home'"
    />
  </transition>

  <transition name="fade">
    <GroupChatView 
      v-if="currentForm === 'group-chat'" 
      :groupId="activeGroupId"
      :inviteCode="inviteGroupCode"
      @openGroup="openGroupChat"
      @goBack="handleGoBack"
    />
  </transition>

  <transition name="fade">
    <StudentMatchView
      v-if="currentForm === 'student-match'"
      :language="selectedLanguage || 'en'"
      :courseId="selectedCourse || 'general'"
      @goBack="currentForm = 'course-mode'"
    />
  </transition>

  <transition name="fade">
    <PracticeScenarioView
      v-if="currentForm === 'practice-scenarios'"
      :language="selectedLanguage || 'en'"
      :courseId="selectedCourse || 'general'"
      @goBack="currentForm = 'course-mode'"
      @selectScenario="handleScenarioSelect"
    />
  </transition>

  <transition name="fade">
    <MascotChatView 
      v-if="currentForm === 'mascot-chat'"
      :chatId="activeAiChatId"
      :language="selectedLanguage || 'en'"
      :courseId="selectedCourse || 'general'"
      :scenario="selectedScenario"
      @created="activeAiChatId = $event"
      @history="currentForm = 'conversations'"
      @goBack="handleGoBack"
    />
  </transition>

  <transition name="fade">
    <ConversationsView 
      v-if="currentForm === 'conversations'"
      @openSidebar="isSidebarOpen = true"
      @openChat="currentForm = 'saved-chat'"
      @openAiChat="openAiChat"
      @openFriendChat="openFriendChat"
      @navigate="handleNavigation"
      @newFreeMascot="startFreeMascotChat"
      @newPractice="startPracticeFlow"
      @newGroup="startGroupChatFlow"
    />
  </transition>

  <transition name="fade">
    <FriendsView
      v-if="currentForm === 'friends'"
      @openSidebar="isSidebarOpen = true"
      @navigate="handleNavigation"
      @openFriendChat="openFriendChat"
    />
  </transition>

  <transition name="fade">
    <FriendChatView
      v-if="currentForm === 'friend-chat'"
      :conversationId="activeFriendConversationId"
      @goBack="currentForm = 'friends'"
    />
  </transition>

  <transition name="fade">
    <ProfileView 
      v-if="currentForm === 'profile'"
      @goBack="currentForm = 'home'"
      @navigate="handleNavigation"
      @openSidebar="isSidebarOpen = true"
    />
  </transition>

  <transition name="fade">
    <TermsView 
      v-if="currentForm === 'terms'"
      @goBack="handleGoBack"
      @openSidebar="isSidebarOpen = true"
      @navigate="handleNavigation"
    />
  </transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-fade-enter-from {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-30px) scale(0.95);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide Up transition for Modality selection */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

<style scoped>
.auth-status-card { background:white; border-radius:32px 32px 0 0; padding:48px 24px 64px; width:100%; box-shadow:0 -4px 20px rgba(0,0,0,.05); text-align:center; color:#475569; }
.auth-status-card h3 { margin:0 0 10px; color:#1a235c; font-size:22px; }
.auth-status-card p { margin:0; line-height:1.5; }
</style>

<style scoped>
.verified-brand { position:absolute; top:32px; left:50%; transform:translateX(-50%); width:180px; height:auto; }
.verified-success-screen { position:relative; min-height:100vh; width:100%; background:linear-gradient(160deg,#16a34a,#22c55e); display:grid; place-items:center; padding:24px; }
.verified-success-card { width:min(420px,100%); padding:34px 26px; text-align:center; color:#fff; animation:success-pop .32s ease both; }
.verified-check { width:78px; height:78px; margin:0 auto 18px; border-radius:50%; display:grid; place-items:center; border:3px solid #fff; color:#fff; font-size:44px; font-weight:900; }
.verified-success-card h1 { margin:0 0 10px; font-size:25px; line-height:1.15; }
.verified-success-card p { margin:0; color:#64748b; line-height:1.5; }
.auth-status-card { background:white; border-radius:32px 32px 0 0; padding:42px 24px 58px; width:100%; box-shadow:0 -4px 20px rgba(0,0,0,.05); text-align:center; color:#475569; }
.auth-status-card h3 { margin:0 0 10px; color:#1a235c; font-size:22px; }
.auth-status-card p { margin:0; line-height:1.5; }
@keyframes success-pop { from { opacity:0; transform:translateY(16px) scale(.96); } to { opacity:1; transform:none; } }
</style>
