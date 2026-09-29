<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
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

      <button type="submit" class="btn-primary">{{ t('login_btn') }}</button>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>

      <div class="register-link">
        {{ t('dont_have_account') }} <a href="#" @click.prevent="$emit('goToRegister')">{{ t('register_now') }}</a>
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

const handleLogin = async () => {
  error.value = ''
  try {
    const user = await authApi('/auth/login', { email: username.value, password: password.value })
    emit('loginSuccess', user)
  } catch (e) {
    error.value = e.message
  }
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
