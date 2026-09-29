<template>
  <div class="match-container">
    <header class="match-header">
      <button class="back-btn" @click="goBack"><ChevronLeftIcon size="24" /></button>
      <div>
        <h2>Conversar com aluno</h2>
        <p>{{ headerText }}</p>
      </div>
      <div v-if="matched" class="timer">{{ countdown }}</div>
    </header>

    <main ref="scrollRef" class="match-content">
      <section v-if="status === 'searching'" class="search-card">
        <div class="pulse"></div>
        <h3>Procurando alguém da mesma modalidade</h3>
        <p>A conversa começa quando outro aluno também estiver procurando. Ela dura 5 minutos.</p>
      </section>

      <section v-if="status === 'ended'" class="search-card">
        <h3>Conversa encerrada</h3>
        <p>Você pode voltar para praticar de novo ou enviar um pedido de amizade para continuar falando depois.</p>
        <button v-if="partner && !friendRequestSent" class="friend-btn" @click="sendFriendRequest">Adicionar amigo</button>
        <span v-if="friendRequestSent" class="sent-label">Pedido de amizade enviado</span>
      </section>

      <div v-for="message in messages" :key="message.id" class="message-row" :class="{ mine: message.senderId === me?.id }">
        <div class="bubble">
          <strong v-if="message.senderId !== me?.id">{{ partner?.name || 'Aluno' }}</strong>
          <span>{{ message.content }}</span>
          <small>{{ time(message.createdAt) }}</small>
        </div>
      </div>
    </main>

    <footer class="match-input-area">
      <div v-if="tip && matched" class="tip-box">
        <strong>Dica do Camaleão</strong>
        <span>{{ tip }}</span>
      </div>
      <div v-if="error" class="error-box">{{ error }}</div>
      <form class="input-row" @submit.prevent="sendMessage">
        <input v-model="draft" :disabled="!matched || status === 'ended'" placeholder="Digite sua mensagem..." />
        <button :disabled="!draft.trim() || !matched || status === 'ended'" type="submit">
          <SendIcon size="20" />
        </button>
      </form>
      <button v-if="partner && matched && !friendRequestSent" class="friend-link" @click="sendFriendRequest">Adicionar como amigo</button>
      <span v-if="friendRequestSent && matched" class="sent-label small">Pedido de amizade enviado</span>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronLeftIcon, SendIcon } from '@lucide/vue'
import { audienceForCourse } from '../data/practiceScenarios.js'
import { currentUser, getSessionToken, wsUrl } from '../services/chatApi.js'

const props = defineProps({ language: { type: String, default: 'en' }, courseId: { type: String, default: 'general' } })
const emit = defineEmits(['goBack'])

const me = ref(currentUser())
const status = ref('connecting')
const partner = ref(null)
const messages = ref([])
const draft = ref('')
const tip = ref('')
const error = ref('')
const endsAt = ref(null)
const nowTick = ref(Date.now())
const friendRequestSent = ref(false)
const scrollRef = ref(null)
let ws
let timer

const matched = computed(() => status.value === 'matched')
const headerText = computed(() => {
  if (status.value === 'matched') return partner.value ? `Você está falando com ${partner.value.name}` : 'Conversa em andamento'
  if (status.value === 'ended') return 'A sessão de 5 minutos terminou'
  return 'Match em tempo real por WebSocket'
})
const countdown = computed(() => {
  if (!endsAt.value) return '5:00'
  const remaining = Math.max(0, new Date(endsAt.value).getTime() - nowTick.value)
  const total = Math.ceil(remaining / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
})
const scrollBottom = () => nextTick(() => { if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight })
const time = (value) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

function send(payload) {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
}
async function connect() {
  try {
    const token = await getSessionToken()
    ws = new WebSocket(`${wsUrl('/ws')}?token=${encodeURIComponent(token)}`)
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'ready') {
        status.value = 'searching'
        send({ type: 'find', language: props.language, audience: audienceForCourse(props.courseId) })
      }
      if (data.type === 'searching') { status.value = 'searching'; tip.value = data.tip || '' }
      if (data.type === 'matched') {
        status.value = 'matched'
        partner.value = data.partner
        endsAt.value = data.endsAt
        tip.value = data.tip || ''
        friendRequestSent.value = false
      }
      if (data.type === 'message') { messages.value.push(data.message); scrollBottom() }
      if (data.type === 'tip') tip.value = data.tip || ''
      if (data.type === 'friendRequestSent') friendRequestSent.value = true
      if (data.type === 'partnerLeft') error.value = 'A outra pessoa saiu da conversa.'
      if (data.type === 'ended') status.value = 'ended'
      if (data.type === 'error') error.value = data.message || 'Não foi possível continuar.'
    })
    ws.addEventListener('close', () => { if (status.value !== 'ended') status.value = 'ended' })
  } catch (err) {
    error.value = err.message || 'Não foi possível conectar.'
    status.value = 'ended'
  }
}
function sendMessage() {
  const content = draft.value.trim()
  if (!content) return
  draft.value = ''
  send({ type: 'message', content })
}
function sendFriendRequest() { send({ type: 'addFriend' }) }
function goBack() {
  ws?.close()
  emit('goBack')
}

onMounted(() => {
  connect()
  timer = setInterval(() => { nowTick.value = Date.now() }, 1000)
})
onBeforeUnmount(() => { clearInterval(timer); ws?.close() })
</script>

<style scoped>
.match-container { position:absolute; inset:0; z-index:56; background:#f4f8ff; display:flex; flex-direction:column; }
.match-header { background:#fff; border-bottom:1px solid #e2e8f0; padding:16px 18px; display:flex; align-items:center; gap:12px; }
.back-btn { border:0; background:#eef4ff; color:#1c5bf0; width:40px; height:40px; border-radius:14px; display:flex; align-items:center; justify-content:center; }
h2 { margin:0; color:#1a235c; font-size:19px; font-weight:900; }
p { margin:3px 0 0; color:#64748b; font-size:12px; font-weight:700; }
.timer { margin-left:auto; color:#1c5bf0; background:#eef4ff; border-radius:999px; padding:8px 12px; font-weight:900; }
.match-content { flex:1; overflow:auto; padding:18px; display:flex; flex-direction:column; gap:12px; }
.search-card { background:#fff; border:1px solid #dbeafe; border-radius:24px; padding:22px; box-shadow:0 8px 24px rgba(28,91,240,.06); text-align:center; }
.search-card h3 { margin:10px 0 6px; color:#1a235c; font-size:18px; }
.pulse { width:40px; height:40px; margin:0 auto; border-radius:50%; background:#1c5bf0; animation:pulse 1.2s infinite ease-in-out; }
@keyframes pulse { 0%,100% { transform:scale(.75); opacity:.55 } 50% { transform:scale(1); opacity:1 } }
.message-row { display:flex; justify-content:flex-start; }
.message-row.mine { justify-content:flex-end; }
.bubble { max-width:78%; background:#fff; border:1px solid #dbeafe; border-radius:18px 18px 18px 6px; padding:10px 12px; color:#1f2937; display:flex; flex-direction:column; gap:4px; box-shadow:0 6px 16px rgba(15,23,42,.04); }
.mine .bubble { background:#dbe7ff; border-color:#c7d2fe; border-radius:18px 18px 6px 18px; color:#1757e8; }
.bubble strong { color:#1a235c; font-size:12px; }
.bubble small { align-self:flex-end; color:#64748b; font-size:10px; }
.match-input-area { background:#fff; border-top:1px solid #e2e8f0; padding:12px 16px 16px; }
.tip-box { border:1px solid #bfdbfe; background:#eff6ff; color:#1a235c; border-radius:16px; padding:10px 12px; margin-bottom:10px; display:flex; flex-direction:column; gap:3px; font-size:13px; }
.tip-box strong { color:#1c5bf0; }
.error-box { background:#fff1f2; color:#be123c; border:1px solid #fecdd3; border-radius:14px; padding:9px 12px; margin-bottom:10px; font-size:13px; font-weight:700; }
.input-row { display:flex; align-items:center; gap:10px; }
.input-row input { flex:1; border:1px solid #dbeafe; background:#f8fbff; border-radius:999px; padding:14px 16px; outline:0; font-weight:700; color:#1a235c; }
.input-row button { border:0; background:#7da2ff; color:#fff; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.input-row button:disabled { opacity:.55; }
.friend-btn, .friend-link { border:0; background:#1c5bf0; color:#fff; border-radius:14px; padding:11px 16px; font-weight:900; margin-top:12px; }
.friend-link { width:100%; background:#eef4ff; color:#1c5bf0; }
.sent-label { display:inline-block; margin-top:12px; color:#16a34a; font-weight:900; font-size:13px; }
.sent-label.small { display:block; text-align:center; margin-top:10px; }
</style>
