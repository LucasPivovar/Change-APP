<template>
  <div class="login-container">
    <form v-if="!sent" @submit.prevent="handleRecover" class="login-form">
      <h3>Esqueceu sua senha?</h3>
      <p class="description">Digite seu e-mail e enviaremos um link para você criar uma nova senha.</p>
      
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

    <div v-else class="success-card">
      <h3>Link enviado</h3>
      <p>Se esse e-mail estiver cadastrado, você vai receber um link para redefinir sua senha.</p>
      <button class="btn-primary" @click="$emit('goToLogin')">Voltar para o login</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Mail as MailIcon } from '@lucide/vue'
import { t } from '../data/translations.js'
import { authApi } from '../services/chatApi'

defineEmits(['goToLogin'])

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref('')

const handleRecover = async () => {
  error.value = ''
  loading.value = true
  try {
    await authApi('/auth/forgot-password', { email: email.value })
    sent.value = true
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container { background:white; border-radius:32px 32px 0 0; padding:34px 24px 56px; width:100%; box-shadow:0 -4px 20px rgba(0,0,0,.05); position:relative; z-index:3; }
.login-form, .success-card { display:flex; flex-direction:column; gap:16px; }
h3 { margin:0; color:#1a235c; font-size:22px; text-align:center; }
.success-card { text-align:center; color:#475569; }
.description { color:var(--text-light); font-size:14px; margin:0; line-height:1.5; text-align:center; }
.input-group { position:relative; display:flex; align-items:center; }
.input-icon { position:absolute; left:16px; color:#999; }
.input-group input { width:100%; padding:16px 16px 16px 48px; border:1px solid var(--border-color); border-radius:16px; font-size:16px; outline:none; transition:border-color .2s; background:#fdfdfd; }
.input-group input:focus { border-color:var(--primary-blue); background:white; }
.btn-primary { background:var(--primary-blue); color:white; border:none; border-radius:16px; padding:16px; font-size:16px; font-weight:700; margin-top:8px; }
.btn-primary:disabled { opacity:.65; }
.register-link { text-align:center; margin-top:12px; font-size:14px; color:var(--text-light); }
.register-link a { color:var(--primary-blue); text-decoration:none; font-weight:700; }
.form-error { margin:0; color:#be123c; background:#fff1f2; border:1px solid #ffe4e6; border-radius:12px; padding:10px 12px; font-size:13px; font-weight:700; }
</style>
