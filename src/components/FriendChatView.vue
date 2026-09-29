<template>
  <div class="chat-container">
    <header class="chat-header">
      <button class="back-btn" @click="$emit('goBack')"><ChevronLeftIcon size="24" /></button>
      <div class="user-info"><img :src="avatar(friend)" class="avatar" /><div><strong>{{ friend?.name || 'Amigo' }}</strong><small v-if="friend">@{{ friend.username }}</small></div></div>
      <div class="chat-streak" :class="{ active: streakDays > 0 }"><span>🔥</span><strong>{{ streakDays }}d</strong></div>
    </header>
    <div class="chat-content" ref="listRef">
      <p v-if="loading">Carregando conversa…</p>
      <p v-else-if="!messages.length" class="empty">Comece a conversa com {{ friend?.name || 'seu amigo' }}.</p>
      <div v-for="msg in messages" :key="msg.id" :class="['message-row', msg.senderId === me?.id ? 'mine' : 'theirs']">
        <div class="bubble"><p>{{ msg.content }}</p><span>{{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span></div>
      </div>
    </div>
    <form class="chat-input-area" @submit.prevent="send">
      <input v-model="text" placeholder="Digite sua mensagem…" maxlength="4000" />
      <button :disabled="!text.trim() || sending"><SendIcon size="18" /></button>
    </form>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { ChevronLeftIcon, SendIcon } from '@lucide/vue'
import { currentUser, friendsApi } from '../services/chatApi'
const props = defineProps({ conversationId: { type: String, required: true } })
defineEmits(['goBack'])
const me = currentUser()
const friend = ref(null)
const messages = ref([])
const text = ref('')
const loading = ref(false)
const sending = ref(false)
const listRef = ref(null)
const streakDays = ref(0)
const avatar = (user) => user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Amigo')}&background=e0f2fe&color=1c5bf0`
async function load() {
  loading.value = true
  const convs = await friendsApi('/conversations')
  const currentConversation = convs.items?.find(item => item.id === props.conversationId)
  friend.value = currentConversation?.friend || null
  streakDays.value = currentConversation?.streakDays || 0
  messages.value = (await friendsApi(`/conversations/${props.conversationId}/messages`)).items || []
  loading.value = false
  await scroll()
}
async function send() {
  if (!text.value.trim() || sending.value) return
  const content = text.value.trim()
  text.value = ''
  sending.value = true
  try {
    const res = await friendsApi(`/conversations/${props.conversationId}/messages`, { method: 'POST', body: { content } })
    messages.value.push(res.message)
    await refreshStreak()
    await scroll()
  } finally { sending.value = false }
}
async function refreshStreak() {
  const convs = await friendsApi('/conversations')
  const currentConversation = convs.items?.find(item => item.id === props.conversationId)
  streakDays.value = currentConversation?.streakDays || 0
}
async function scroll() { await nextTick(); listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: 'smooth' }) }
onMounted(load)
</script>
<style scoped>
.chat-container { position:absolute; inset:0; background:#f3f7ff; z-index:70; display:flex; flex-direction:column; }
.chat-header { height:72px; display:flex; align-items:center; justify-content:space-between; padding:12px 18px; background:#fff; border-bottom:1px solid #e2e8f0; }
.back-btn { border:0; background:#f4f8ff; color:#1c5bf0; border-radius:14px; padding:10px; font-weight:800; }
.user-info { display:flex; align-items:center; gap:10px; color:#1a235c; }
.user-info div { display:grid; }
.user-info small { color:#64748b; }
.avatar { width:42px; height:42px; border-radius:50%; object-fit:cover; }
.chat-content { flex:1; overflow:auto; padding:18px; display:flex; flex-direction:column; gap:12px; }
.empty { color:#64748b; text-align:center; margin-top:40px; }
.message-row { display:flex; }
.message-row.mine { justify-content:flex-end; }
.message-row.theirs { justify-content:flex-start; }
.bubble { max-width:78%; border-radius:20px; padding:12px 14px; background:#fff; color:#1e293b; box-shadow:0 4px 12px rgba(15,23,42,.04); }
.mine .bubble { background:#dfe7ff; color:#1c5bf0; }
.bubble p { margin:0 0 6px; white-space:pre-wrap; }
.bubble span { display:block; text-align:right; font-size:11px; opacity:.7; }
.chat-streak { display:flex; align-items:center; gap:4px; border:1px solid #e2e8f0; background:#f8fafc; color:#94a3b8; border-radius:999px; padding:8px 10px; font-weight:900; font-size:13px; }
.chat-streak span { filter:grayscale(1); opacity:.55; }
.chat-streak.active { background:#fff7ed; border-color:#fed7aa; color:#ea580c; }
.chat-streak.active span { filter:none; opacity:1; }
.chat-input-area { display:flex; gap:10px; padding:14px 18px; background:#fff; border-top:1px solid #e2e8f0; }
.chat-input-area input { flex:1; border:1px solid #dbe5f5; border-radius:18px; padding:14px; outline:none; }
.chat-input-area button { width:48px; border:0; border-radius:50%; background:#7ca2ff; color:#fff; }
.chat-input-area button:disabled { opacity:.5; }
</style>
