<template>
  <div class="login-container">
    <form v-if="!twoFactorPending" @submit.prevent="handleLogin" class="login-form">
      <div class="input-group">
        <UserIcon class="input-icon" size="20" />
        <input type="text" :placeholder="t('email_or_user')" v-model="username" required />
      </div>

      <div class="input-group">
        <LockIcon class="input-icon" size="20" />
        <input :type="showPassword ? 'text' : 'password'" :placeholder="t('password')" v-model="password" required />
        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
          <EyeIcon v-if="!showPassword" size="20" />
          <EyeOffIcon v-else size="20" />
        </button>
      </div>

      <div class="forgot-password">
        <a href="#" @click.prevent="$emit('goToForgot')">{{ t('forgot_password') }}</a>
      </div>

      <button type="submit" :disabled="loading" class="btn-primary">{{ t('login_btn') }}</button>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>

      <div class="register-link">
        {{ t('dont_have_account') }} <a href="#" @click.prevent="$emit('goToRegister')">{{ t('register_now') }}</a>
      </div>
    </form>

    <form v-else @submit.prevent="handleVerifyCode" class="login-form">
      <h3>Verifique seu e-mail</h3>
      <p class="description">Enviamos um código para {{ twoFactorEmail }}. Digite o código para entrar.</p>
      <div class="input-group">
        <LockIcon class="input-icon" size="20" />
        <input type="text" inputmode="numeric" autocomplete="one-time-code" placeholder="Código de 6 dígitos" v-model="twoFactorCode" required maxlength="6" />
      </div>
      <button type="submit" :disabled="loading" class="btn-primary">Confirmar e entrar</button>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div class="register-link">
        <a href="#" @click.prevent="resetTwoFactor">Voltar para o login</a>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User as UserIcon, Lock as LockIcon, Eye as EyeIcon, EyeOff as EyeOffIcon } from '@lucide/vue'
import { t } from '../data/translations.js'
import { authApi } from '../services/chatApi'

const emit = defineEmits(['goToRegister', 'goToForgot', 'loginSuccess'])

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const twoFactorPending = ref(false)
const twoFactorEmail = ref('')
const twoFactorCode = ref('')

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const result = await authApi('/auth/login', { email: username.value, password: password.value })
    if (result?.requiresTwoFactor) {
      twoFactorPending.value = true
      twoFactorEmail.value = result.email || username.value
      twoFactorCode.value = ''
      return
    }
    emit('loginSuccess', result)
  } catch (e) {
    error.value = e.message
  } finally { loading.value = false }
}

const handleVerifyCode = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const user = await authApi('/auth/verify-login', { email: twoFactorEmail.value || username.value, code: twoFactorCode.value })
    emit('loginSuccess', user)
  } catch (e) {
    error.value = e.message
  } finally { loading.value = false }
}

const resetTwoFactor = () => {
  twoFactorPending.value = false
  twoFactorCode.value = ''
  error.value = ''
}
</script>

<style scoped>
.login-container {
  background: white;
  border-radius: 32px 32px 0 0;
  padding: 48px 24px 64px;
  width: 100%;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
  position: relative;
  z-index: 3;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h3 { margin: 0; color: #1a235c; font-size: 22px; text-align: center; }
.description { color: var(--text-light); font-size: 14px; margin: 0; line-height: 1.5; text-align: center; }

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #999;
}

.input-group input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  background: #fdfdfd;
}

.input-group input:focus {
  border-color: var(--primary-blue);
  background: white;
}

.toggle-password {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forgot-password {
  text-align: center;
  margin-top: 8px;
}

.forgot-password a {
  color: var(--primary-blue);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  transition: transform 0.1s, background-color 0.2s;
}

.btn-primary:active {
  transform: scale(0.98);
  background-color: #1545bf;
}

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-light);
}

.register-link a {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 600;
}

.form-error {
  margin: 0;
  color: #be123c;
  background: #fff1f2;
  border: 1px solid #ffe4e6;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
}
</style>
