<template>
  <div class="match-container" :class="{ waiting: isWaiting }">
    <template v-if="isWaiting">
      <div class="blue-expand"></div>
      <button class="waiting-back" @click="goBack"><ChevronLeftIcon size="24" /></button>
      <div class="waiting-top">
        <div class="white-logo">Change Skills</div>
        <span class="waiting-time">{{ queueTime }}</span>
      </div>
      <main class="waiting-content">
        <div class="loader-card" aria-label="Procurando aluno">
          <div class="search-orbit">
            <span></span><span></span><span></span>
          </div>
          <div class="loader-center"></div>
        </div>
        <div class="waiting-copy">
          <h1>Encontrando alguém para praticar com você</h1>
          <p>Quando outro aluno da mesma modalidade entrar, a conversa começa automaticamente.</p>
        </div>
      </main>
      <footer class="waiting-footer">
        <span>{{ queueLabel }}</span>
      </footer>
    </template>

    <template v-else>
      <header class="match-header">
        <button class="back-btn" @click="goBack"><ChevronLeftIcon size="24" /></button>
        <div class="partner-title">
          <h2>{{ partnerTitle }}</h2>
          <p v-if="partnerUsername">@{{ partnerUsername }}</p>
        </div>
        <div v-if="matched" class="timer">{{ countdown }}</div>
      </header>

      <main ref="scrollRef" class="match-content">
        <section v-if="status === 'ended'" class="search-card">
          <h3>Conversa encerrada</h3>
          <p>Você pode voltar para praticar de novo ou enviar um pedido de amizade para continuar falando depois.</p>
          <button v-if="partner && !friendRequestSent" class="friend-btn" @click="sendFriendRequest">Adicionar amigo</button>
          <span v-if="friendRequestSent" class="sent-label">Pedido de amizade enviado</span>
        </section>

        <div v-for="message in messages" :key="message.id" class="message-row" :class="{ mine: message.senderId === me?.id, tip: message.role === 'tip' }">
          <div v-if="message.role === 'tip'" class="tip-bubble">
            <strong>Dica do Camaleão</strong>
            <span>{{ message.content }}</span>
          </div>
          <div v-else class="bubble">
            <strong v-if="message.senderId !== me?.id">{{ partner?.name || 'Aluno' }}</strong>
            <span>{{ message.content }}</span>
            <small>{{ time(message.createdAt) }}</small>
          </div>
        </div>
      </main>

      <footer class="match-input-area">
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
    </template>
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
const error = ref('')
const endsAt = ref(null)
const nowTick = ref(Date.now())
const startedAt = ref(Date.now())
const friendRequestSent = ref(false)
const scrollRef = ref(null)
let ws
let timer

const matched = computed(() => status.value === 'matched')
const isWaiting = computed(() => status.value === 'connecting' || status.value === 'searching')
const partnerTitle = computed(() => partner.value?.name || (status.value === 'ended' ? 'Conversa encerrada' : 'Aluno'))
const partnerUsername = computed(() => partner.value?.username || '')
const countdown = computed(() => {
  if (!endsAt.value) return '5:00'
  const remaining = Math.max(0, new Date(endsAt.value).getTime() - nowTick.value)
  const total = Math.ceil(remaining / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
})
const queueTime = computed(() => {
  const elapsed = Math.max(0, Math.floor((nowTick.value - startedAt.value) / 1000))
  return `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`
})
const queueLabel = computed(() => {
  const audience = audienceForCourse(props.courseId)
  if (audience === 'kids') return 'Fila Kids'
  if (audience === 'teens') return 'Fila Teens'
  if (audience === 'business') return 'Fila Business'
  if (audience === 'researchers') return 'Fila Acadêmico'
  return 'Fila de prática'
})
const scrollBottom = () => nextTick(() => { if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight })
const time = (value) => value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

function send(payload) {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
}
async function connect() {
  try {
    startedAt.value = Date.now()
    const token = await getSessionToken()
    ws = new WebSocket(`${wsUrl('/ws')}?token=${encodeURIComponent(token)}`)
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'ready') {
        status.value = 'searching'
        send({ type: 'find', language: props.language, audience: audienceForCourse(props.courseId) })
      }
      if (data.type === 'searching') status.value = 'searching'
      if (data.type === 'matched') {
        status.value = 'matched'
        error.value = ''
        partner.value = data.partner
        endsAt.value = data.endsAt
        friendRequestSent.value = false
        scrollBottom()
      }
      if (data.type === 'message') { messages.value.push(data.message); scrollBottom() }
      if (data.type === 'tip' && data.tip) { messages.value.push({ id: `tip-${Date.now()}-${Math.random()}`, role: 'tip', content: data.tip, createdAt: new Date().toISOString() }); scrollBottom() }
      if (data.type === 'friendRequestSent') friendRequestSent.value = true
      if (data.type === 'partnerLeft') { error.value = 'A outra pessoa saiu da conversa.'; status.value = 'ended'; ws?.close() }
      if (data.type === 'ended') { status.value = 'ended'; ws?.close() }
      if (data.type === 'blocked') error.value = data.message || 'Mensagem bloqueada pela moderação.'
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
.match-container { position:fixed; inset:0; z-index:56; height:100dvh; max-height:100dvh; background:#f4f8ff; display:flex; flex-direction:column; overflow:hidden; overscroll-behavior:none; }
.match-container.waiting { background:linear-gradient(180deg,#1f63f4 0%,#1753df 100%); color:#fff; justify-content:space-between; }
.blue-expand { position:absolute; width:44px; height:44px; border-radius:50%; background:#1f63f4; left:50%; top:50%; transform:translate(-50%,-50%); animation:expandBlue .5s ease-out forwards; z-index:0; }
.match-container.waiting::before { content:""; position:absolute; inset:-25%; background:radial-gradient(circle at 50% 22%, rgba(255,255,255,.22), transparent 34%), radial-gradient(circle at 12% 86%, rgba(125,162,255,.2), transparent 28%); z-index:0; }
@keyframes expandBlue { from { transform:translate(-50%,-50%) scale(1); } to { transform:translate(-50%,-50%) scale(62); } }
.waiting-top, .waiting-content, .waiting-footer, .waiting-back { position:relative; z-index:1; }
.waiting-back { position:absolute; left:18px; top:18px; border:0; background:rgba(255,255,255,.16); color:#fff; width:42px; height:42px; border-radius:15px; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px); }
.waiting-top { padding-top:28px; display:flex; flex-direction:column; align-items:center; gap:10px; }
.white-logo { color:#fff; font-weight:950; letter-spacing:.01em; font-size:21px; text-shadow:0 8px 24px rgba(0,0,0,.12); }
.waiting-time { color:#eef4ff; font-weight:900; border:1px solid rgba(255,255,255,.28); background:rgba(255,255,255,.1); border-radius:999px; padding:6px 13px; backdrop-filter:blur(10px); }
.waiting-content { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:26px 30px 34px; gap:30px; }
.loader-card { width:156px; height:156px; border-radius:48px; display:flex; align-items:center; justify-content:center; position:relative; background:rgba(255,255,255,.08); box-shadow:inset 0 0 0 1px rgba(255,255,255,.12), 0 24px 70px rgba(0,20,90,.18); backdrop-filter:blur(12px); }
.loader-center { position:absolute; width:12px; height:12px; border-radius:50%; background:rgba(255,255,255,.8); box-shadow:0 0 34px rgba(255,255,255,.45); animation:centerPulse 1.4s ease-in-out infinite; }
.waiting-copy { max-width:360px; display:flex; flex-direction:column; align-items:center; }
.waiting-content h1 { margin:0; font-size:24px; line-height:1.15; max-width:330px; font-weight:950; letter-spacing:-.035em; }
.waiting-content p { margin:14px 0 0; max-width:330px; color:#dbeafe; font-size:14px; font-weight:750; line-height:1.45; }
.waiting-footer { text-align:center; padding:0 20px 28px; color:#dbeafe; font-weight:900; }
.search-orbit { position:relative; width:104px; height:104px; border-radius:50%; border:2px solid rgba(255,255,255,.26); animation:spin 2.4s linear infinite; }
.search-orbit::before { content:""; position:absolute; inset:17px; border-radius:50%; border:1px solid rgba(255,255,255,.12); }
.search-orbit span { position:absolute; border-radius:50%; background:#fff; box-shadow:0 0 24px rgba(255,255,255,.9); }
.search-orbit span:nth-child(1) { width:18px; height:18px; left:50%; top:-9px; transform:translateX(-50%); }
.search-orbit span:nth-child(2) { width:16px; height:16px; right:3px; bottom:16px; opacity:.72; }
.search-orbit span:nth-child(3) { width:12px; height:12px; left:7px; bottom:21px; opacity:.42; }
@keyframes spin { to { transform:rotate(360deg); } }
@keyframes centerPulse { 0%,100% { transform:scale(.76); opacity:.48; } 50% { transform:scale(1); opacity:1; } }
@media (max-width: 380px) {
  .waiting-content { padding-left:24px; padding-right:24px; gap:24px; }
  .loader-card { width:136px; height:136px; border-radius:40px; }
  .search-orbit { width:92px; height:92px; }
  .waiting-content h1 { font-size:21px; max-width:290px; }
  .waiting-content p { font-size:13px; max-width:290px; }
}
.match-header { background:#fff; border-bottom:1px solid #e2e8f0; padding:calc(12px + env(safe-area-inset-top)) 18px 12px; display:flex; align-items:center; gap:12px; flex-shrink:0; }
.back-btn { border:0; background:#eef4ff; color:#1c5bf0; width:40px; height:40px; border-radius:14px; display:flex; align-items:center; justify-content:center; }
.partner-title { flex:1; min-width:0; }
h2 { margin:0; color:#1a235c; font-size:18px; font-weight:950; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
p { margin:3px 0 0; color:#64748b; font-size:12px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.timer { margin-left:auto; color:#1c5bf0; background:#eef4ff; border-radius:999px; padding:8px 12px; font-weight:900; flex-shrink:0; }
.match-content { flex:1; min-height:0; overflow-y:auto; overflow-x:hidden; padding:18px; display:flex; flex-direction:column; gap:12px; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; }
.search-card { background:#fff; border:1px solid #dbeafe; border-radius:24px; padding:22px; box-shadow:0 8px 24px rgba(28,91,240,.06); text-align:center; }
.search-card h3 { margin:10px 0 6px; color:#1a235c; font-size:18px; }
.message-row { display:flex; justify-content:flex-start; }
.message-row.mine { justify-content:flex-end; }
.message-row.tip { justify-content:center; }
.bubble { max-width:78%; background:#fff; border:1px solid #dbeafe; border-radius:18px 18px 18px 6px; padding:10px 12px; color:#1f2937; display:flex; flex-direction:column; gap:4px; box-shadow:0 6px 16px rgba(15,23,42,.04); }
.mine .bubble { background:#dbe7ff; border-color:#c7d2fe; border-radius:18px 18px 6px 18px; color:#1757e8; }
.bubble strong { color:#1a235c; font-size:12px; }
.bubble small { align-self:flex-end; color:#64748b; font-size:10px; }
.tip-bubble { max-width:88%; border:1px solid #bfdbfe; background:#fff; color:#1a235c; border-radius:16px; padding:10px 12px; display:flex; flex-direction:column; gap:4px; font-size:13px; box-shadow:0 8px 22px rgba(28,91,240,.06); }
.tip-bubble strong { color:#1c5bf0; font-size:12px; }
.tip-bubble span { color:#334155; line-height:1.35; }
.match-input-area { background:#fff; border-top:1px solid #e2e8f0; padding:12px 16px calc(16px + env(safe-area-inset-bottom)); flex-shrink:0; }
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
