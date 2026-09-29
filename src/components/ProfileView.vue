<template>
  <div class="view-container">
    <!-- Header -->
    <header class="app-header">
      <button class="menu-btn" @click="$emit('openSidebar')">
        <MenuIcon size="24" stroke-width="2.5" />
      </button>
      <h2 class="header-title">{{ t('nav_profile') }}</h2>
    </header>

    <div class="content-scroll">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <img :src="profileAvatar" class="profile-avatar" />
          <button class="edit-avatar-btn" @click="avatarInputRef?.click()">
            <CameraIcon size="16" />
          </button>
          <input ref="avatarInputRef" type="file" accept="image/*" class="avatar-input" @change="changeAvatar" />
        </div>
        <div class="name-container">
          <h1 class="profile-name" v-if="!isEditingName">{{ profileName }}</h1>
          <input 
            v-else 
            type="text" 
            v-model="newName" 
            @keyup.enter="saveName" 
            @blur="saveName" 
            class="name-input" 
            ref="nameInputRef"
          />
          <button class="edit-name-btn" @click="toggleEditName">
            <PencilIcon v-if="!isEditingName" size="16" />
            <CheckIcon v-else size="16" />
          </button>
        </div>
        <div class="username-row">
          <span v-if="!isEditingUsername" class="profile-username">@{{ user?.username || 'usuario' }}</span>
          <input v-else v-model="newUsername" class="username-input" @keyup.enter="saveUsername" @blur="saveUsername" />
          <button class="edit-username-btn" @click="toggleEditUsername">
            <PencilIcon v-if="!isEditingUsername" size="13" />
            <CheckIcon v-else size="13" />
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card full-width" style="animation-delay: 0.1s">
          <div class="stat-icon-wrapper fire" style="display: flex; align-items: center; justify-content: center;">
            <StreakFlame size="28" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.streakDays }} {{ t('streak_label') }}</span>
            <span class="stat-label">{{ t('streak_sub') }}</span>
          </div>
        </div>
        
        <div class="stat-card clickable" style="animation-delay: 0.2s" @click="openFriendsModal">
          <div class="stat-icon-wrapper friends-icon-bg">
            <UsersIcon size="24" class="stat-icon" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.friends }}</span>
            <span class="stat-label">{{ t('friends_label') }}</span>
          </div>
        </div>
        
        <div class="stat-card" style="animation-delay: 0.3s">
          <div class="stat-icon-wrapper time">
            <ClockIcon size="24" class="stat-icon" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ practicedTimeLabel }}</span>
            <span class="stat-label">{{ t('time_practiced') }}</span>
          </div>
        </div>
      </div>

      <!-- Menu Options & Settings in Column -->
      <div class="settings-section">
        <h3 class="section-title">{{ t('settings_label') }}</h3>
        
        <div class="options-list">
          <div class="option-item" @click="handleSettingAction('reset-password')">
            <div class="option-icon-box"><LockIcon size="20" /></div>
            <span>{{ t('reset_password') }}</span>
            <ChevronRightIcon size="20" class="option-arrow" />
          </div>
          
          <div class="option-item" @click="handleSettingAction('change-email')">
            <div class="option-icon-box"><MailIcon size="20" /></div>
            <span>{{ t('change_email') }}</span>
            <ChevronRightIcon size="20" class="option-arrow" />
          </div>
          
          <div class="option-item-container">
            <div class="option-item lang-item-select" @click="toggleLangDropdown">
              <div class="option-icon-box"><GlobeIcon size="20" /></div>
              <span>{{ t('default_language') }}</span>
              <div class="select-wrapper">
                <span class="selected-lang-label">{{ currentLanguageLabel }}</span>
                <ChevronDownIcon size="20" class="option-arrow" :class="{ 'rotated': isLangDropdownOpen }" />
              </div>
            </div>
            
            <transition name="fade">
              <div v-if="isLangDropdownOpen" class="custom-dropdown-panel">
                <div 
                  v-for="lang in languages" 
                  :key="lang.code" 
                  class="custom-dropdown-item" 
                  :class="{ 'active': user?.defaultLanguage === lang.code }"
                  @click="selectLanguage(lang.code)"
                >
                  <img :src="lang.flag" class="lang-flag" />
                  <span class="lang-name">{{ lang.label }}</span>
                  <CheckIcon v-if="user?.defaultLanguage === lang.code" size="18" class="check-icon" />
                </div>
              </div>
            </transition>
          </div>

          <div class="option-item" @click="handleSettingAction('terms-and-privacy')">
            <div class="option-icon-box"><ShieldIcon size="20" /></div>
            <span>Privacidade e Termos</span>
            <ChevronRightIcon size="20" class="option-arrow" />
          </div>
        </div>
      </div>
    </div>

    <!-- Friends List Modal -->
    <transition name="fade">
      <div class="modal-backdrop" v-if="isFriendsModalOpen" @click.self="isFriendsModalOpen = false">
        <transition name="slide-up" appear>
          <div class="friends-modal-container">
            <div class="modal-header">
              <h3>{{ t('friends_label') }}</h3>
              <button @click="isFriendsModalOpen = false" class="close-btn-round"><XIcon size="20" /></button>
            </div>
            
            <div class="friends-list">
              <div class="friend-item" v-for="friend in friends" :key="friend.id">
                <img :src="friend.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=e0f2fe&color=1c5bf0`" class="friend-avatar" />
                <div class="friend-info-row">
                  <span class="friend-name">{{ friend.name }}</span>
                  <span class="friend-streak" style="display: inline-flex; align-items: center; gap: 4px;"><StreakFlame size="14" /> {{ friend.streakDays || 0 }}d</span>
                  <span class="friend-username">@{{ friend.username }}</span>
                </div>
                <button class="view-profile-btn" @click="showFriendProfile(friend)">
                  Ver Perfil
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Friend Profile Modal -->
    <transition name="fade">
      <div class="modal-backdrop" v-if="isFriendProfileOpen" @click.self="isFriendProfileOpen = false">
        <transition name="slide-up" appear>
          <div class="profile-modal-container">
            <div class="modal-header-bar">
              <button class="close-btn-round" @click="isFriendProfileOpen = false">
                <XIcon size="20" />
              </button>
            </div>
            
            <div class="profile-modal-content">
              <div class="profile-avatar-container">
                <img :src="selectedFriend?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFriend?.name || 'Amigo')}&background=e0f2fe&color=1c5bf0`" class="modal-profile-avatar" />
              </div>
              
              <h2 class="modal-profile-name">{{ selectedFriend?.name }}</h2>
              
              <div class="friend-stats-container">
                <div class="friend-stat-banner streak-banner">
                  <span class="fire-emoji" style="display: inline-flex;"><StreakFlame size="28" /></span>
                  <div class="banner-info">
                    <strong>{{ selectedFriend?.streakDays || 0 }} dias</strong>
                    <span>Vocês estão em sequência!</span>
                  </div>
                </div>
                
                <div class="friend-stat-banner lang-banner">
                  <span class="lang-emoji" style="display: inline-flex;">
                    <CountryFlagMap language="en" size="32" />
                  </span>
                  <div class="banner-info">
                    <strong>@{{ selectedFriend?.username }}</strong>
                    <span>Nome de usuário</span>
                  </div>
                </div>
              </div>
              
              <button class="modal-chat-btn" @click="goToChatFromProfile">
                Conversar agora
              </button>
              
              <button class="modal-unfriend-btn" @click="unfriendAction">
                Desfazer Amizade
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Change Email Modal -->
    <transition name="fade">
      <div class="modal-backdrop" v-if="isChangeEmailOpen" @click.self="closeChangeEmail">
        <transition name="slide-up" appear>
          <div class="profile-modal-container email-modal">
            <div class="modal-header">
              <h3>Alterar E-mail</h3>
              <button @click="closeChangeEmail" class="close-btn-round"><XIcon size="20" /></button>
            </div>

            <div class="profile-modal-content" style="padding-bottom: 24px; width: 100%;">
              <div v-if="changeEmailStep === 1" class="modal-flow-step">
                <p class="modal-instruction-text">
                  Digite seu novo endereço de e-mail abaixo.
                </p>
                <div class="modal-input-group">
                  <MailIcon size="20" class="input-icon" />
                  <input 
                    type="email" 
                    placeholder="Novo e-mail" 
                    v-model="newEmail" 
                    class="modal-text-input"
                    required
                  />
                </div>
                <div class="modal-error-message" v-if="emailError">{{ emailError }}</div>
                <button class="modal-action-btn" @click="submitNewEmail">
                  Salvar Novo E-mail
                </button>
              </div>

              <div v-else-if="changeEmailStep === 2" class="modal-flow-step success-step">
                <div class="success-icon-wrapper">
                  <CheckIcon size="36" class="success-check-icon" />
                </div>
                <h4 class="success-step-title">E-mail Alterado!</h4>
                <p class="success-step-text">
                  Seu endereço de e-mail foi atualizado com sucesso.
                </p>
                <button class="modal-action-btn success-btn" @click="closeChangeEmail">
                  Concluir
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Change Password Modal -->
    <transition name="fade">
      <div class="modal-backdrop" v-if="isChangePasswordOpen" @click.self="closeChangePassword">
        <transition name="slide-up" appear>
          <div class="profile-modal-container password-modal">
            <div class="modal-header">
              <h3>Redefinir Senha</h3>
              <button @click="closeChangePassword" class="close-btn-round"><XIcon size="20" /></button>
            </div>

            <div class="profile-modal-content" style="padding-bottom: 24px; width: 100%;">
              <div v-if="changePasswordStep === 1" class="modal-flow-step">
                <p class="modal-instruction-text">
                  Defina sua nova senha de acesso.
                </p>
                <div class="modal-input-group" style="margin-bottom: 12px;">
                  <LockIcon size="20" class="input-icon" />
                  <input 
                    type="password" 
                    placeholder="Nova senha" 
                    v-model="newPassword" 
                    class="modal-text-input"
                    required
                  />
                </div>
                <div class="modal-input-group">
                  <LockIcon size="20" class="input-icon" />
                  <input 
                    type="password" 
                    placeholder="Confirmar nova senha" 
                    v-model="confirmPassword" 
                    class="modal-text-input"
                    required
                  />
                </div>
                <div class="modal-error-message" v-if="passwordError">{{ passwordError }}</div>
                <button class="modal-action-btn" @click="submitNewPassword">
                  Avançar
                </button>
              </div>

              <div v-else-if="changePasswordStep === 2" class="modal-flow-step">
                <p class="modal-instruction-text">
                  Enviamos um código de verificação para o seu e-mail. Insira-o abaixo para confirmar a alteração.
                </p>
                <div class="modal-input-group code-input-group">
                  <input 
                    type="text" 
                    placeholder="Código" 
                    v-model="verificationCode" 
                    class="modal-text-input code-input"
                    maxlength="6"
                    required
                  />
                </div>
                <div class="modal-error-message" v-if="codeError">{{ codeError }}</div>
                <button class="modal-action-btn" @click="submitVerificationCode">
                  Confirmar Código
                </button>
              </div>

              <div v-else-if="changePasswordStep === 3" class="modal-flow-step success-step">
                <div class="success-icon-wrapper">
                  <CheckIcon size="36" class="success-check-icon" />
                </div>
                <h4 class="success-step-title">Senha Redefinida!</h4>
                <p class="success-step-text">
                  Sua senha de acesso foi atualizada com sucesso.
                </p>
                <button class="modal-action-btn success-btn" @click="closeChangePassword">
                  Concluir
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <div class="nav-item" @click="$emit('navigate', 'home')">
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
      <div class="nav-item active" @click="$emit('navigate', 'profile')">
        <UserIcon size="28" />
        <span>{{ t('nav_profile') }}</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted } from 'vue'
import { 
  Menu as MenuIcon, 
  CameraIcon, 
  ClockIcon, 
  ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  UserIcon,
  ShieldIcon,
  Pencil as PencilIcon,
  Check as CheckIcon,
  Users as UsersIcon,
  X as XIcon,
  Home as HomeIcon,
  MessageCircle as MessageCircleIcon,
  Lock as LockIcon,
  Mail as MailIcon,
  Globe as GlobeIcon,
} from '@lucide/vue'
import { t } from '../data/translations.js'
import StreakFlame from './StreakFlame.vue'
import CountryFlagMap from './CountryFlagMap.vue'
import { currentUser, friendsApi, profileApi } from '../services/chatApi'

const emit = defineEmits(['goBack', 'navigate', 'openSidebar'])

const isEditingName = ref(false)
const isEditingUsername = ref(false)
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
  saveProfile({ defaultLanguage: code })
  isLangDropdownOpen.value = false
}
const user = ref(currentUser())
const profileName = ref(user.value?.name || 'Seu nome')
const newName = ref(profileName.value)
const newUsername = ref(user.value?.username || '')
const nameInputRef = ref(null)
const avatarInputRef = ref(null)
const stats = ref({ streakDays: 0, friends: 0, practicedSeconds: 0, messageCount: 0 })
const profileAvatar = computed(() => user.value?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName.value)}&background=e0f2fe&color=1c5bf0`)
const practicedTimeLabel = computed(() => {
  const minutes = Math.floor((stats.value.practicedSeconds || 0) / 60)
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours > 0) return `${hours}h ${rest}m`
  return `${rest}m`
})

const loadProfile = async () => {
  try {
    const data = await profileApi()
    user.value = data.user
    profileName.value = data.user.name
    newName.value = data.user.name
    newUsername.value = data.user.username || ''
    stats.value = data.stats
  } catch {}
}

const saveProfile = async (payload) => {
  const data = await profileApi({ method: 'PATCH', body: payload })
  user.value = data.user
  profileName.value = data.user.name
  newName.value = data.user.name
  newUsername.value = data.user.username || ''
  stats.value = data.stats
}

const toggleEditName = () => {
  if (isEditingName.value) {
    saveName()
  } else {
    isEditingName.value = true
    newName.value = profileName.value
    nextTick(() => {
      if (nameInputRef.value) {
        nameInputRef.value.focus()
      }
    })
  }
}

const saveName = () => {
  if (newName.value.trim() !== '') {
    saveProfile({ name: newName.value.trim() }).catch(() => {
      profileName.value = user.value?.name || profileName.value
    })
  }
  isEditingName.value = false
}

const toggleEditUsername = () => {
  if (isEditingUsername.value) {
    saveUsername()
  } else {
    newUsername.value = user.value?.username || ''
    isEditingUsername.value = true
  }
}

const saveUsername = () => {
  const value = newUsername.value.replace(/^@+/, '').trim().toLowerCase()
  if (value.length >= 3) {
    saveProfile({ username: value }).catch((error) => {
      alert(error.message || 'Não foi possível trocar o nome de usuário.')
      newUsername.value = user.value?.username || ''
    })
  }
  isEditingUsername.value = false
}

const changeAvatar = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => saveProfile({ avatarUrl: reader.result }).catch(() => {})
  reader.readAsDataURL(file)
  event.target.value = ''
}

// Friends List logic
const isFriendsModalOpen = ref(false)
const isFriendProfileOpen = ref(false)
const selectedFriend = ref(null)

const friends = ref([])

const openFriendsModal = async () => {
  isFriendsModalOpen.value = true
  try { friends.value = (await friendsApi()).items || [] } catch {}
}

const showFriendProfile = (friend) => {
  selectedFriend.value = friend
  isFriendProfileOpen.value = true
}

const goToChatFromProfile = () => {
  isFriendProfileOpen.value = false
  isFriendsModalOpen.value = false
  emit('navigate', 'friends')
}

const unfriendAction = () => {
  if (confirm(`Tem certeza que deseja desfazer a amizade com ${selectedFriend.value.name}?`)) {
    friends.value = friends.value.filter(f => f.id !== selectedFriend.value.id)
    isFriendProfileOpen.value = false
  }
}

// Change Email state
const isChangeEmailOpen = ref(false)
const changeEmailStep = ref(1)
const newEmail = ref('')
const emailError = ref('')

const closeChangeEmail = () => {
  isChangeEmailOpen.value = false
  changeEmailStep.value = 1
  newEmail.value = ''
  emailError.value = ''
}

const submitNewEmail = () => {
  emailError.value = ''
  if (!newEmail.value.trim()) {
    emailError.value = 'Por favor, digite um e-mail válido.'
    return
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(newEmail.value)) {
    emailError.value = 'Por favor, insira um formato de e-mail correto.'
    return
  }
  changeEmailStep.value = 2
}

// Change Password state
const isChangePasswordOpen = ref(false)
const changePasswordStep = ref(1)
const newPassword = ref('')
const confirmPassword = ref('')
const verificationCode = ref('')
const passwordError = ref('')
const codeError = ref('')

const closeChangePassword = () => {
  isChangePasswordOpen.value = false
  changePasswordStep.value = 1
  newPassword.value = ''
  confirmPassword.value = ''
  verificationCode.value = ''
  passwordError.value = ''
  codeError.value = ''
}

const submitNewPassword = () => {
  passwordError.value = ''
  if (!newPassword.value) {
    passwordError.value = 'Por favor, insira a nova senha.'
    return
  }
  if (newPassword.value.length < 6) {
    passwordError.value = 'A senha deve conter pelo menos 6 caracteres.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'As senhas não coincidem.'
    return
  }
  changePasswordStep.value = 2
}

const submitVerificationCode = () => {
  codeError.value = ''
  if (!verificationCode.value.trim()) {
    codeError.value = 'Por favor, digite o código de verificação.'
    return
  }
  if (verificationCode.value.trim().length < 4) {
    codeError.value = 'Código inválido. Digite o código correto.'
    return
  }
  changePasswordStep.value = 3
}

const handleSettingAction = (action) => {
  if (action === 'reset-password') {
    isChangePasswordOpen.value = true
  } else if (action === 'change-email') {
    isChangeEmailOpen.value = true
  } else if (action === 'terms-and-privacy') {
    emit('navigate', 'terms')
  }
}

const changeLang = (event) => {
  setLocale(event.target.value)
}

const currentLanguageLabel = computed(() => {
  const code = user.value?.defaultLanguage || 'pt'
  if (code === 'en') return 'English'
  if (code === 'fr') return 'Français'
  if (code === 'es') return 'Español'
  return 'Português Brasil'
})

onMounted(loadProfile)
</script>

<style scoped>
.view-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 50;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

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

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-bottom: 140px; /* Increased bottom padding to prevent bottom nav cut-off */
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  animation: slideUpFade 0.4s ease forwards;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #1c5bf0;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  cursor: pointer;
}

.avatar-input {
  display: none;
}

.name-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.profile-name {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
}

.username-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.profile-username {
  color: #64748b;
  font-weight: 750;
  font-size: 14px;
}

.username-input {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  outline: none;
  width: 160px;
}

.edit-username-btn {
  background: #f1f5f9;
  border: none;
  color: #64748b;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.name-input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  outline: none;
  width: 160px;
}

.edit-name-btn {
  background: #f1f5f9;
  border: none;
  color: #64748b;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-name-btn:hover {
  background: #e2e8f0;
  color: #1a235c;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}


.stat-card {
  background: white;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  opacity: 0;
  animation: slideUpFade 0.4s ease forwards;
}

.stat-card.full-width {
  grid-column: span 2;
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
  border: 1px solid #fecdd3;
  padding: 20px 24px;
}

.stat-card.clickable {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card.clickable:active {
  transform: scale(0.97);
}

.stat-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.fire { 
  background: white; 
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.fire-badge-emoji {
  font-size: 24px;
}

.stat-icon-wrapper.friends-icon-bg { 
  background: #e0f2fe; 
  color: #0ea5e9; 
}

.stat-icon-wrapper.time { 
  background: #fef3c7; 
  color: #f59e0b; 
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.options-list {
  background: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0 0 12px 8px;
  font-size: 16px;
  color: #1a235c;
  font-weight: 800;
  text-align: left;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.option-item:active {
  transform: scale(0.99);
}

.option-icon-box {
  color: #64748b;
  margin-right: 16px;
}

.option-item span {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.option-arrow {
  color: #cbd5e1;
}

/* Settings Options Styles */
.lang-item-select {
  position: relative;
  cursor: pointer !important;
}

.setting-icon {
  color: #1c5bf0;
  flex-shrink: 0;
}

.select-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-lang-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
}

.option-item-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.custom-dropdown-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.custom-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.custom-dropdown-item:hover {
  background: #f1f5f9;
}

.custom-dropdown-item.active {
  background: #e0e7ff;
  color: #1c5bf0;
}

.lang-flag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.lang-name {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

.custom-dropdown-item.active .lang-name {
  color: #1c5bf0;
}

.check-icon {
  color: #1c5bf0;
}

.option-arrow {
  transition: transform 0.2s ease;
}

.option-arrow.rotated {
  transform: rotate(180deg);
}

/* Bottom Navigation */
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

/* Modals & Overlays */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.friends-modal-container, .profile-modal-container {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 32px 32px 0 0;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 80%;
  padding-bottom: 24px;
}

.profile-modal-container {
  background: #f8fafc;
  padding-bottom: 32px;
}

.modal-header, .modal-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}

.modal-header-bar {
  justify-content: flex-end;
  padding: 16px 24px;
}

.modal-header h3 {
  color: #1a235c;
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.close-btn-round {
  background: #f1f5f9;
  border: none;
  color: #64748b;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn-round:hover {
  background: #e2e8f0;
}

.friends-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.friend-item:last-child {
  border-bottom: none;
}

.friend-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.friend-info-row {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
}

.friend-name {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
}

.friend-streak {
  font-size: 12px;
  color: #e11d48;
  font-weight: 600;
}

.view-profile-btn {
  background: #f0f4ff;
  color: #1c5bf0;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.view-profile-btn:hover {
  background: #e0e7ff;
}

/* Friend profile detail modal content */
.profile-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
}

.profile-avatar-container {
  position: relative;
  margin-bottom: 16px;
}

.modal-profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.modal-profile-name {
  font-size: 22px;
  font-weight: 800;
  color: #1a235c;
  margin: 0 0 24px 0;
}

.friend-stats-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-bottom: 32px;
}

.friend-stat-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
}

.fire-emoji, .lang-emoji {
  font-size: 24px;
}

.banner-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.banner-info strong {
  font-size: 16px;
  color: #1e293b;
  font-weight: 800;
}

.banner-info span {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.modal-chat-btn {
  background: #1c5bf0;
  color: white;
  border: none;
  border-radius: 100px;
  padding: 14px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 12px rgba(28, 91, 240, 0.2);
}

.modal-chat-btn:active {
  transform: scale(0.98);
}

.modal-unfriend-btn {
  background: transparent;
  color: #ef4444;
  border: 2px dashed #fca5a5;
  border-radius: 100px;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: center;
  margin-top: 12px;
}

.modal-unfriend-btn:hover {
  background: #fff5f5;
  border-color: #ef4444;
}

.friend-stat-banner.streak-banner {
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
  border: 1px solid #fecdd3;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08);
}

/* Modal transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Custom Modals styling */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1a235c;
}

.modal-flow-step {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.modal-instruction-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.5;
  margin: 0 0 8px 0;
  text-align: center;
}

.modal-input-group {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.modal-input-group .input-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
  z-index: 10;
}

.modal-text-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  outline: none;
  background-color: #f8fafc;
  transition: all 0.2s ease;
}

.modal-text-input:focus {
  border-color: #1c5bf0;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(28, 91, 240, 0.1);
}

.code-input-group {
  justify-content: center;
}

.code-input {
  padding: 16px;
  text-align: center;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: 800;
  max-width: 240px;
  margin: 0 auto;
}

.modal-error-message {
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin-top: -4px;
}

.modal-action-btn {
  width: 100%;
  background: #1c5bf0;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px;
  font-size: 15px;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(28, 91, 240, 0.15);
  transition: all 0.2s ease;
  margin-top: 8px;
}

.modal-action-btn:hover {
  background: #1545bf;
  box-shadow: 0 6px 16px rgba(28, 91, 240, 0.25);
  transform: translateY(-1px);
}

.modal-action-btn:active {
  transform: translateY(0);
}

/* Success Step specific style */
.success-step {
  align-items: center;
  text-align: center;
  padding: 16px 0;
}

.success-icon-wrapper {
  width: 72px;
  height: 72px;
  background-color: #f0fdf4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.12);
}

.success-check-icon {
  color: #22c55e;
}

.success-step-title {
  font-size: 20px;
  font-weight: 800;
  color: #1a235c;
  margin: 0 0 8px 0;
}

.success-step-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin: 0 0 20px 0;
}

.success-btn {
  background-color: #22c55e;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
}

.success-btn:hover {
  background-color: #16a34a;
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.25);
}
</style>
