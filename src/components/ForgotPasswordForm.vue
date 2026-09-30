<template>
  <div class="login-container">

    <form v-if="!sent" @submit.prevent="handleRecover" class="login-form">
      <p class="description">{{ t('forgot_desc') }}</p>
      
      <div class="input-group">
        <MailIcon class="input-icon" size="20" />
        <input type="email" placeholder="Email" v-model="email" required />
      </div>

      <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? 'Enviando...' : t('send_link') }}</button>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>

      <div class="register-link">
        {{ t('remembered_password') }} <a href="#" @click.prevent="$emit('goToLogin')">{{ t('login_btn') }}</a>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Mail as MailIcon } from '@lucide/vue'
import { t } from '../data/translations.js'
import { authApi } from '../services/chatApi'

defineEmits(['goToLogin'])

const email = ref('')

const handleRecover = () => {
  console.log('Recovery attempted:', email.value)
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



.success-card { display:flex; flex-direction:column; gap:14px; text-align:center; color:#475569; }
.success-card h3 { margin:0; color:#1a235c; font-size:22px; }
.form-error { margin:0; color:#be123c; background:#fff1f2; border:1px solid #ffe4e6; border-radius:12px; padding:10px 12px; font-size:13px; font-weight:600; }
.description {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.5;
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
</style>
