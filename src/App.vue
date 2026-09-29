<script setup>
import { ref, watch } from 'vue'
import LanguageSelector from './components/LanguageSelector.vue'
import HeroSection from './components/HeroSection.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import ForgotPasswordForm from './components/ForgotPasswordForm.vue'
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
import { currentUser, logout } from './services/chatApi'

const currentForm = ref(currentUser() ? 'home' : 'login')
const selectedLanguage = ref(null)
const selectedCourse = ref(null)
const isSidebarOpen = ref(false)
const activeAiChatId = ref(null)
const activeFriendConversationId = ref(null)
const activeGroupId = ref(null)
const inviteGroupCode = ref(new URLSearchParams(window.location.search).get('group'))
const selectedScenario = ref(null)
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
if (inviteGroupCode.value && currentUser()) currentForm.value = 'group-chat'

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
  <SidebarMenu 
    :isOpen="isSidebarOpen" 
    @close="isSidebarOpen = false" 
    @navigate="handleNavigation"
  />

  <div class="auth-layout" v-if="currentForm === 'login' || currentForm === 'register' || currentForm === 'forgot'">
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
