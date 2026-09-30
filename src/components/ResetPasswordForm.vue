<template>
  <div class="login-container">
    <form v-if="!done" @submit.prevent="handleReset" class="login-form">
      <h3>Crie uma nova senha</h3>
      <p class="description">Digite sua nova senha para voltar para a Change Skills.</p>
      <div class="input-group">
        <LockIcon class="input-icon" size="20" />
        <input :type="showPassword ? 'text' : 'password'" placeholder="Nova senha" v-model="password" required minlength="6" />
        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
          <EyeIcon v-if="!showPassword" size="20" />
          <EyeOffIcon v-else size="20" />
        </button>
      </div>
      <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? 'Salvando...' : 'Salvar nova senha' }}</button>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    </form>
    <div v-else class="success-card">
      <h3>Senha atualizada</h3>
      <p>Você já está conectado na sua conta.</p>
      <button class="btn-primary" @click="$emit('resetSuccess')">Continuar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Lock as LockIcon, Eye as EyeIcon, EyeOff as EyeOffIcon } from '@lucide/vue'
import { authApi } from '../services/chatApi'
const props = defineProps({ token: { type: String, required: true } })
const emit = defineEmits(['resetSuccess'])
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const done = ref(false)
const error = ref('')
async function handleReset() {
  error.value = ''
  loading.value = true
  try {
    await authApi('/auth/reset-password', { token: props.token, password: password.value })
    done.value = true
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}
</script>

<style scoped>
.login-container { background:white; border-radius:32px 32px 0 0; padding:48px 24px 64px; width:100%; box-shadow:0 -4px 20px rgba(0,0,0,.05); position:relative; z-index:3; }
.login-form, .success-card { display:flex; flex-direction:column; gap:16px; }
h3 { margin:0; color:#1a235c; font-size:22px; }
.description { color:var(--text-light); font-size:14px; margin:0; line-height:1.5; }
.input-group { position:relative; display:flex; align-items:center; }
.input-icon { position:absolute; left:16px; color:#999; }
.input-group input { width:100%; padding:16px 48px; border:1px solid var(--border-color); border-radius:16px; font-size:16px; outline:none; background:#fdfdfd; }
.input-group input:focus { border-color:var(--primary-blue); background:white; }
.toggle-password { position:absolute; right:16px; background:none; border:0; color:#999; display:flex; align-items:center; justify-content:center; }
.btn-primary { background:var(--primary-blue); color:white; border:0; border-radius:16px; padding:16px; font-size:16px; font-weight:700; }
.btn-primary:disabled { opacity:.65; }
.form-error { margin:0; color:#be123c; background:#fff1f2; border:1px solid #ffe4e6; border-radius:12px; padding:10px 12px; font-size:13px; font-weight:600; }
.success-card { text-align:center; color:#475569; }
</style>
