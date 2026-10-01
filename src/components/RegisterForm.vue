<template>
  <div class="login-container">
    <form v-if="!sent" @submit.prevent="handleNext" class="login-form">
      <transition name="fields-slide" mode="out-in">
      <div v-if="step === 1" key="account-start" class="fields-panel">
        <h3>Crie sua conta</h3>
        <p class="description">Primeiro, coloque seu nome completo e e-mail.</p>
        <div class="input-group">
          <UserIcon class="input-icon" size="20" />
          <input type="text" :placeholder="t('full_name')" v-model="name" required />
        </div>
        <div class="input-group">
          <MailIcon class="input-icon" size="20" />
          <input type="email" placeholder="Email" v-model="email" required />
        </div>
      </div>

      <div v-else key="account-finish" class="fields-panel">
        <h3>Escolha seu usuário</h3>
        <p class="description">Use apenas letras e números. O nome fica em maiúsculo automaticamente.</p>
        <div class="input-group">
          <AtSignIcon class="input-icon" size="20" />
          <input type="text" placeholder="NOMEUSUARIO" :value="username" @input="onUsernameInput" required minlength="3" maxlength="24" />
        </div>
        <p v-if="usernameMessage" :class="['field-hint', usernameAvailable ? 'ok' : 'bad']">{{ usernameMessage }}</p>

        <div class="input-group">
          <LockIcon class="input-icon" size="20" />
          <input :type="showPassword ? 'text' : 'password'" :placeholder="t('password')" v-model="password" required />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            <EyeIcon v-if="!showPassword" size="20" />
            <EyeOffIcon v-else size="20" />
          </button>
        </div>
        <ul class="password-rules">
          <li :class="{ ok: password.length >= 8 }">Pelo menos 8 caracteres</li>
          <li :class="{ ok: /[A-Z]/.test(password) }">Pelo menos uma letra maiúscula</li>
        </ul>
      </div>
      </transition>

      <button type="submit" class="btn-primary" :disabled="loading || (step === 2 && (!canSubmitStep2 || usernameAvailable === false))">
        {{ step === 1 ? 'Continuar' : (loading ? 'Criando...' : t('create_account')) }}
      </button>
      <button v-if="step === 2" type="button" class="btn-secondary" @click="step = 1">Voltar</button>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>

      <div class="register-link">
        {{ t('already_have_account') }} <a href="#" @click.prevent="$emit('goToLogin')">{{ t('login_btn') }}</a>
      </div>
    </form>

    <div v-else class="verify-message">
      <h3>Confirme seu e-mail</h3>
      <p>Enviamos um link para <strong>{{ sentEmail }}</strong>. Clique nele para ativar sua conta e entrar na plataforma.</p>
      <button class="btn-primary" @click="$emit('goToLogin')">Voltar para o login</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { User as UserIcon, Lock as LockIcon, Eye as EyeIcon, EyeOff as EyeOffIcon, Mail as MailIcon, AtSign as AtSignIcon } from '@lucide/vue'
import { t } from '../data/translations.js'
import { authApi } from '../services/chatApi'

const emit = defineEmits(['goToLogin', 'registerSuccess'])

const step = ref(1)
const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const sent = ref(false)
const sentEmail = ref('')
const loading = ref(false)
const usernameMessage = ref('')
const usernameAvailable = ref(null)
let usernameTimer

const cleanUsername = (value) => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 24)
const canSubmitStep2 = computed(() => username.value.length >= 3 && password.value.length >= 8 && /[A-Z]/.test(password.value))

function onUsernameInput(event) {
  username.value = cleanUsername(event.target.value)
  event.target.value = username.value
}

watch(username, (value) => {
  clearTimeout(usernameTimer)
  usernameAvailable.value = null
  if (!value) { usernameMessage.value = ''; return }
  if (value.length < 3) { usernameMessage.value = 'Use pelo menos 3 caracteres.'; usernameAvailable.value = false; return }
  usernameMessage.value = 'Verificando...'
  usernameTimer = setTimeout(async () => {
    try {
      const result = await authApi('/auth/check-username', { username: value })
      usernameAvailable.value = !!result.available
      usernameMessage.value = result.message || (result.available ? 'Nome de usuário disponível.' : 'Esse nome de usuário já existe.')
    } catch (e) {
      usernameAvailable.value = false
      usernameMessage.value = e.message
    }
  }, 350)
})

const validateStep1 = () => {
  if (name.value.trim().length < 2) return 'Digite seu nome completo.'
  if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) return 'Digite um e-mail válido.'
  return ''
}

const validateStep2 = () => {
  if (!/^[A-Z0-9]{3,24}$/.test(username.value)) return 'O usuário deve ter 3 a 24 caracteres, sem espaços e sem caracteres especiais.'
  if (usernameAvailable.value === false) return usernameMessage.value || 'Esse nome de usuário já existe.'
  if (password.value.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.'
  if (!/[A-Z]/.test(password.value)) return 'A senha precisa ter pelo menos uma letra maiúscula.'
  return ''
}

const handleNext = async () => {
  error.value = ''
  if (step.value === 1) {
    const message = validateStep1()
    if (message) { error.value = message; return }
    step.value = 2
    return
  }
  const message = validateStep2()
  if (message) { error.value = message; return }
  loading.value = true
  try {
    const result = await authApi('/auth/register', { name: name.value.trim(), username: username.value, email: email.value.trim(), password: password.value })
    if (result?.pendingVerification) {
      sent.value = true
      sentEmail.value = result.email || email.value
      return
    }
    emit('registerSuccess', result)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container { background:white; border-radius:32px 32px 0 0; padding:30px 24px 50px; width:100%; box-shadow:0 -4px 20px rgba(0,0,0,.05); position:relative; z-index:3; }
.login-form { display:flex; flex-direction:column; gap:14px; }
.fields-panel { display:flex; flex-direction:column; gap:14px; }
.fields-slide-enter-active, .fields-slide-leave-active { transition:opacity .22s ease, transform .22s ease; }
.fields-slide-enter-from { opacity:0; transform:translateX(18px); }
.fields-slide-leave-to { opacity:0; transform:translateX(-18px); }
h3 { margin:0; color:#1a235c; font-size:22px; text-align:center; }
.description { margin:0; color:var(--text-light); font-size:14px; text-align:center; line-height:1.5; }
.input-group { position:relative; display:flex; align-items:center; }
.input-icon { position:absolute; left:16px; color:#999; }
.input-group input { width:100%; padding:16px 16px 16px 48px; border:1px solid var(--border-color); border-radius:16px; font-size:16px; outline:none; transition:border-color .2s; background:#fdfdfd; text-transform:none; }
.input-group input:focus { border-color:var(--primary-blue); background:white; }
.toggle-password { position:absolute; right:16px; background:none; border:none; color:#999; display:flex; align-items:center; justify-content:center; }
.btn-primary { background:var(--primary-blue); color:white; border:none; border-radius:16px; padding:16px; font-size:16px; font-weight:700; margin-top:8px; }
.btn-primary:disabled { opacity:.55; }
.btn-secondary { background:#f4f8ff; color:#1a235c; border:1px solid #dbeafe; border-radius:16px; padding:14px; font-size:15px; font-weight:700; }
.register-link { text-align:center; margin-top:12px; font-size:14px; color:var(--text-light); }
.register-link a { color:var(--primary-blue); text-decoration:none; font-weight:700; }
.field-hint { margin:-6px 0 0; font-size:13px; font-weight:700; color:#64748b; }
.field-hint.ok { color:#15803d; }
.field-hint.bad { color:#be123c; }
.password-rules { margin:-4px 0 0; padding:0; list-style:none; display:flex; flex-direction:column; gap:6px; color:#be123c; font-size:13px; font-weight:700; }
.password-rules li::before { content:'• '; }
.password-rules li.ok { color:#15803d; }
.verify-message { display:flex; flex-direction:column; gap:14px; text-align:center; color:#475569; }
.verify-message h3 { margin:0; color:#1a235c; font-size:22px; }
.verify-message p { margin:0; line-height:1.5; }
.form-error { margin:0; color:#be123c; background:#fff1f2; border:1px solid #ffe4e6; border-radius:12px; padding:10px 12px; font-size:13px; font-weight:700; }
</style>
