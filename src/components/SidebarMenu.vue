<template>
  <div>
    <!-- Overlay/Backdrop -->
    <transition name="fade">
      <div 
        class="sidebar-backdrop" 
        v-if="isOpen" 
        @click="$emit('close')"
      ></div>
    </transition>

    <!-- Sidebar Panel -->
    <transition name="slide">
      <div class="sidebar" v-if="isOpen">
        
        <!-- Profile Section -->
        <div class="profile-section">
          <img :src="avatar" alt="Profile" class="profile-avatar" />
          <span class="profile-name">{{ user?.name || 'Perfil' }}</span>
          <span class="profile-username" v-if="user?.username">@{{ user.username }}</span>
        </div>

        <!-- Navigation Links -->
        <nav class="nav-links">
          <div class="nav-item" @click="handleNav('home')">
            <HomeIcon size="22" class="nav-icon" />
            <span>{{ t('nav_home') }}</span>
          </div>
          
          <div class="nav-item" @click="handleNav('conversations')">
            <MessageCircleIcon size="22" class="nav-icon" />
            <span>{{ t('nav_chats') }}</span>
          </div>

          <div class="nav-item" @click="handleNav('friends')">
            <UsersIcon size="22" class="nav-icon" />
            <span>Amigos</span>
          </div>

          <div class="nav-item" @click="handleNav('profile')">
            <UserIcon size="22" class="nav-icon" />
            <span>Perfil</span>
          </div>
          
          <!-- Language Selector -->
          <div class="sidebar-lang-container">
            <div class="lang-select-container" @click="toggleLangDropdown">
              <GlobeIcon size="20" class="lang-select-icon" />
              <span>{{ currentLanguageLabel }}</span>
              <ChevronDownIcon size="18" class="select-down-icon" :class="{ 'rotated': isLangDropdownOpen }" />
            </div>
            
            <transition name="fade">
              <div v-if="isLangDropdownOpen" class="sidebar-dropdown-panel">
                <div 
                  v-for="lang in languages" 
                  :key="lang.code" 
                  class="sidebar-dropdown-item" 
                  :class="{ 'active': currentLocale === lang.code }"
                  @click="selectLanguage(lang.code)"
                >
                  <img :src="lang.flag" class="lang-flag" />
                  <span class="lang-name">{{ lang.label }}</span>
                  <CheckIcon v-if="currentLocale === lang.code" size="16" class="check-icon" />
                </div>
              </div>
            </transition>
          </div>
          
          <div class="nav-item logout" @click="handleNav('login')">
            <LogOutIcon size="22" class="nav-icon" />
            <span>{{ t('logout_label') }}</span>
          </div>
        </nav>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Home as HomeIcon,
  MessageCircle as MessageCircleIcon,
  Users as UsersIcon,
  User as UserIcon,
  Globe as GlobeIcon,
  LogOut as LogOutIcon,
  ChevronDown as ChevronDownIcon,
  Check as CheckIcon
} from '@lucide/vue'
import { t, currentLocale, setLocale } from '../data/translations.js'
import { currentUser } from '../services/chatApi'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'navigate'])
const user = currentUser()
const avatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Perfil')}&background=e0f2fe&color=1c5bf0`

const currentLanguageLabel = computed(() => {
  if (currentLocale.value === 'en') return 'English'
  if (currentLocale.value === 'fr') return 'Français'
  if (currentLocale.value === 'es') return 'Español'
  return 'Português Brasil'
})

const isLangDropdownOpen = ref(false)
const languages = [
  { code: 'pt', label: 'Português Brasil', flag: 'https://flagcdn.com/w20/br.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w20/us.png' },
  { code: 'fr', label: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
  { code: 'es', label: 'Español', flag: 'https://flagcdn.com/w20/es.png' }
]

const toggleLangDropdown = () => {
  isLangDropdownOpen.value = !isLangDropdownOpen.value
}

const selectLanguage = (code) => {
  setLocale(code)
  isLangDropdownOpen.value = false
}

const handleNav = (route) => {
  emit('navigate', route)
  emit('close')
}
</script>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: white;
  z-index: 101;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  padding: 8px 0 24px;
  text-align: center;
  border-bottom: 1px solid #f1f5f9;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e7ff;
}

.profile-name {
  font-size: 18px;
  font-weight: 800;
  color: #1a235c;
}

.profile-username {
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  color: #475569;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover, .nav-item:active {
  background-color: #f4f8ff;
  color: #1c5bf0;
}

.nav-icon {
  color: #1c5bf0;
}

/* Language Selector Styles */
.sidebar-lang-container {
  margin-top: auto;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lang-select-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-select-container:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.lang-select-icon {
  color: #1c5bf0;
  flex-shrink: 0;
}

.lang-select-container span {
  flex: 1;
  font-weight: 700;
  font-size: 14px;
  color: #475569;
}

.select-down-icon {
  color: #cbd5e1;
  transition: transform 0.2s ease;
}

.select-down-icon.rotated {
  transform: rotate(180deg);
}

.sidebar-dropdown-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.sidebar-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-dropdown-item:hover {
  background: #f1f5f9;
}

.sidebar-dropdown-item.active {
  background: #e0e7ff;
  color: #1c5bf0;
}

.lang-flag {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
}

.lang-name {
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.sidebar-dropdown-item.active .lang-name {
  color: #1c5bf0;
}

.check-icon {
  color: #1c5bf0;
}

.nav-item.logout {
  background-color: #fff1f2;
  color: #e11d48;
}

.nav-item.logout .nav-icon {
  color: #e11d48;
}

.nav-item.logout:hover, .nav-item.logout:active {
  background-color: #ffe4e6;
  color: #be123c;
}
</style>
