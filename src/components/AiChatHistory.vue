<template>
  <section class="ai-history">
    <div class="heading">
      <h3>Conversas com o Camaleão IA</h3>
      <button class="plus-btn" @click="$emit('open', null)">+</button>
    </div>
    <p v-if="error" role="alert">{{ error }} <button @click="load(true)">Tentar novamente</button></p>
    <p v-if="loading" role="status">Carregando histórico…</p>
    <p v-else-if="!items.length && !error" class="empty">Suas conversas com a IA aparecerão aqui.</p>
    <div v-for="chat in visibleItems" :key="chat.id" class="history-row">
      <button class="chat-link" @click="$emit('open', chat.id)">
        <strong>{{ chat.title }}</strong>
        <small>{{ new Date(chat.updatedAt).toLocaleString('pt-BR') }}</small>
      </button>
      <div class="row-menu-wrap">
        <button class="dots" @click="openMenuId = openMenuId === chat.id ? null : chat.id">⋮</button>
        <div v-if="openMenuId === chat.id" class="row-menu">
          <button @click="rename(chat)">Renomear</button>
          <button class="danger" @click="remove(chat)">Excluir</button>
        </div>
      </div>
    </div>
    <button v-if="items.length > limit" class="more" @click="showAll = !showAll">{{ showAll ? 'Mostrar menos' : 'Ver todos' }}</button>
    <button v-if="showAll && items.length < total" :disabled="loading" class="more" @click="load(false)">Carregar mais</button>
  </section>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue'
import { chatApi } from '../services/chatApi'
defineEmits(['open'])
const items = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref('')
const showAll = ref(false)
const openMenuId = ref(null)
const limit = 3
const visibleItems = computed(() => showAll.value ? items.value : items.value.slice(0, limit))
async function load(reset = true) {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const page = await chatApi(`/chats?limit=30&offset=${reset ? 0 : items.value.length}`)
    items.value = reset ? page.items : [...items.value, ...page.items]
    total.value = page.total
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}
async function remove(chat) {
  openMenuId.value = null
  if (!window.confirm(`Excluir a conversa "${chat.title}" e seu histórico?`)) return
  loading.value = true
  error.value = ''
  try {
    await chatApi(`/chats/${chat.id}`, { method: 'DELETE' })
    loading.value = false
    await load(true)
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}
async function rename(chat) {
  openMenuId.value = null
  const title = window.prompt('Novo nome da conversa', chat.title)
  if (!title?.trim()) return
  loading.value = true
  error.value = ''
  try {
    await chatApi(`/chats/${chat.id}`, { method: 'PATCH', body: { title: title.trim() } })
    await load(true)
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}
onMounted(() => load())
</script>
<style scoped>
.ai-history { margin: 20px 0; padding: 18px; background: white; border-radius: 20px; color: #1a235c; overflow: visible; box-shadow: 0 8px 24px rgba(15, 23, 42, .05); }
.heading, .history-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
h3 { margin: 0; font-size: 16px; }
button { padding: 10px; border: 1px solid #dbe5f5; border-radius: 10px; background: #f4f8ff; color: #1c5bf0; cursor: pointer; font-weight: 750; }
.plus-btn { width: 38px; height: 38px; border-radius: 50%; font-size: 22px; line-height: 1; padding: 0; display: inline-flex; align-items: center; justify-content: center; }
.history-row { border-bottom: 1px solid #e2e8f0; padding: 10px 0; position: relative; }
.history-row:last-child { border-bottom: 0; }
.chat-link { display: grid; gap: 5px; text-align: left; flex: 1; min-width: 0; background: white; border: none; overflow-wrap: anywhere; color: #1a235c; }
small, .empty { color: #64748b; }
button:disabled { opacity: .5; cursor: wait; }
.row-menu-wrap { position: relative; }
.dots { width: 36px; height: 36px; border-radius: 50%; padding: 0; font-size: 20px; }
.row-menu { position: absolute; right: 0; top: 42px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 12px 28px rgba(15,23,42,.14); padding: 6px; z-index: 5; display: grid; gap: 4px; min-width: 130px; }
.row-menu button { background: white; border: 0; text-align: left; }
.row-menu .danger { color: #e11d48; }
.more { width: 100%; margin-top: 10px; }
</style>
