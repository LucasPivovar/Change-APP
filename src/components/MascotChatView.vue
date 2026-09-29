<template>
  <div class="chat-container">
    <header class="chat-header">
      <button class="back-btn" aria-label="Voltar" @click="$emit('goBack')"><ChevronLeftIcon :size="24" /></button>
      <div class="user-info"><div class="mascot-avatar-wrapper"><img src="../assets/2.png" alt="" class="avatar" /></div><span class="user-name">Camaleão IA</span></div>
      <div class="chat-menu-wrapper">
        <button class="menu-dot-btn" aria-label="Opções do chat" @click="isMenuOpen = !isMenuOpen"><MoreVerticalIcon :size="22" /></button>
        <div v-if="isMenuOpen" class="chat-menu">
          <button type="button" @click="openHistory"><HistoryIcon :size="16" /> Histórico</button>
          <button type="button" @click="showTips"><LightbulbIcon :size="16" /> Dicas do Camaleão</button>
          <button type="button" @click="isSettingsOpen = !isSettingsOpen"><SettingsIcon :size="16" /> Configurações</button>
          <div v-if="isSettingsOpen" class="chat-settings">
            <label>
              <LanguagesIcon :size="16" /> Idioma do Camaleão
              <select v-model="defaultLanguage" @change="saveDefaultLanguage">
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </label>
            <label class="audio-toggle"><input type="checkbox" v-model="translationEnabled" @change="saveTranslationPreference" /> Tradução nas respostas</label>
            <label class="audio-toggle"><input type="checkbox" v-model="speechEnabled" @change="saveSpeechPreference" /> Áudio nas respostas</label>
          </div>
        </div>
      </div>
    </header>
    <div class="chat-content" ref="messagesListRef" aria-live="polite">
      <p v-if="loading" role="status">Carregando conversa…</p>
      <p v-else-if="ready && !messages.length && !sending" class="empty-chat">Olá! Sou o Camaleão IA. Sobre o que vamos conversar para praticar seu idioma?</p>
      <div class="messages-list">
        <div v-if="tips.length" class="tips-card">
          <strong>Dicas do Camaleão</strong>
          <button type="button" class="tips-close" @click="tips = []">×</button>
          <button v-for="tip in tips" :key="tip" type="button" @click="useTip(tip)">{{ tip }}</button>
        </div>
        <div v-for="msg in messages" :key="msg.id" :class="['message-row', msg.role === 'user' ? 'mine' : 'theirs']">
          <div v-if="msg.role === 'assistant'" class="bot-avatar-wrapper"><img src="../assets/2.png" alt="Camaleão" class="msg-avatar" /></div>
          <div class="message-bubble" :class="msg.role === 'user' ? 'bubble-mine' : 'bubble-bot'">
            <p>{{ msg.content }}</p>
            <div v-if="msg.translation" class="translation-box">{{ msg.translation }}</div>
            <span class="message-time">{{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
          </div>
        </div>
        <!-- Camaleão digitando no canto inferior esquerdo -->
        <div v-if="sending" class="message-row theirs typing-row" role="status">
          <div class="bot-avatar-wrapper"><img src="../assets/2.png" alt="Camaleão" class="msg-avatar" /></div>
          <div class="message-bubble bubble-bot typing-bubble">
            <span class="typing-text">Camaleão está digitando</span>
            <span class="typing-dots" aria-hidden="true">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="error" class="chat-error" role="alert">{{ error }} <button v-if="!ready" @click="initialize">Tentar novamente</button></div>
    <form class="chat-input-area" @submit.prevent="sendMessage">
      <div class="input-wrapper">
        <button type="button" class="voice-btn" :class="{ listening }" :aria-label="listening ? 'Parar gravação' : 'Falar mensagem'" :disabled="!ready || sending" @click="toggleVoice"><MicIcon :size="18" /></button>
        <input type="text" aria-label="Mensagem para o Camaleão" placeholder="Digite sua mensagem…" v-model="newMessage" :disabled="!ready || sending" maxlength="4000" />
        <button class="send-btn" aria-label="Enviar mensagem" :disabled="!ready || sending || !newMessage.trim()"><SendIcon :size="18" /></button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ChevronLeftIcon, HistoryIcon, LanguagesIcon, LightbulbIcon, MicIcon, MoreVerticalIcon, SendIcon, SettingsIcon } from '@lucide/vue'
import { chatApi, currentUser, profileApi } from '../services/chatApi'
const props = defineProps({
  chatId: { type: String, default: null },
  language: { type: String, default: 'en' },
  courseId: { type: String, default: 'general' }
})
const emit = defineEmits(['goBack', 'history', 'created'])
const messages = ref([])
const newMessage = ref('')
const loading = ref(false)
const sending = ref(false)
const ready = ref(false)
const error = ref('')
const messagesListRef = ref(null)
const isMenuOpen = ref(false)
const isSettingsOpen = ref(false)
const tips = ref([])
const defaultLanguage = ref(currentUser()?.defaultLanguage || 'pt')
const speechEnabled = ref(localStorage.getItem('change-skills-speech-enabled') === 'true')
const translationEnabled = ref(localStorage.getItem('change-skills-translation-enabled') === 'true')
const listening = ref(false)
let activeId = props.chatId
let pending = null
let recognition = null
let transcriptBuffer = ''
const tipMemoryKey = `change-skills-used-tips-${props.courseId}-${props.language}`
const tipsByAudience = {
  kids: [
    'What is your favorite animal?',
    'What color do you like?',
    'Tell me about your favorite game.',
    'What do you eat for breakfast?',
    'Where do you like to play?',
    'Can you name three things in your room?',
    'What is your favorite cartoon?',
    'Do you like dogs or cats?',
    'What makes you happy?',
    'Can you say hello in English?'
  ],
  teens: [
    'What music do you like right now?',
    'Tell me about a movie you enjoyed.',
    'What do you usually do after school?',
    'What place would you like to visit?',
    'Describe your favorite app.',
    'What is something you learned this week?',
    'What food do you love?',
    'Ask the Camaleão for help with slang.',
    'Talk about your weekend plans.',
    'Describe your best friend.'
  ],
  business: [
    'Talk about your work routine.',
    'Practice introducing yourself in a meeting.',
    'Ask how to write a professional email.',
    'Describe a project you are working on.',
    'Practice a job interview answer.',
    'Ask for phrases for presentations.',
    'Talk about a challenge at work.',
    'Practice scheduling a meeting.',
    'Ask how to negotiate politely.',
    'Describe your ideal workplace.'
  ],
  adults: [
    'Tell me about your daily routine.',
    'Talk about your last trip.',
    'Ask for help ordering food.',
    'Describe your neighborhood.',
    'Talk about your favorite book.',
    'Ask how to introduce yourself.',
    'Practice buying something in a store.',
    'Talk about your weekend.',
    'Ask for useful travel phrases.',
    'Describe your family.'
  ],
  general: [
    'How was your day?',
    'What do you like to do for fun?',
    'Tell me about your favorite place.',
    'Ask for three useful phrases.',
    'Practice a simple introduction.',
    'Talk about food you like.',
    'Ask the Camaleão to correct one sentence.',
    'Describe what you see around you.',
    'Talk about your plans for tomorrow.',
    'Ask a question about culture.'
  ]
}
const audienceForCourse = (courseId) => {
  if (['kids', 'frances-enfants'].includes(courseId)) return 'kids'
  if (['teens', 'espanhol-jovens', 'frances-ados', 'portugues-jovens'].includes(courseId)) return 'teens'
  if (courseId === 'business') return 'business'
  if (courseId === 'researchers') return 'researchers'
  if (courseId === 'ingles50') return '50plus'
  if (['fast-track', 'excellence', 'espanhol-adultos', 'frances-adultes', 'portugues-adultos'].includes(courseId)) return 'adults'
  return 'general'
}
const currentAudience = () => audienceForCourse(props.courseId || 'general')
const pickTips = () => {
  const pool = [...(tipsByAudience[currentAudience()] || tipsByAudience.general)]
  const used = JSON.parse(localStorage.getItem(tipMemoryKey) || '[]')
  let available = pool.filter(tip => !used.includes(tip))
  if (available.length < 3) {
    available = pool
    localStorage.setItem(tipMemoryKey, '[]')
  }
  const selected = []
  while (selected.length < 3 && available.length) {
    const index = Math.floor(Math.random() * available.length)
    selected.push(available.splice(index, 1)[0])
  }
  localStorage.setItem(tipMemoryKey, JSON.stringify([...used, ...selected].slice(-pool.length)))
  return selected
}
const showTips = () => {
  tips.value = pickTips()
  isMenuOpen.value = false
  scrollToBottom()
}
const useTip = (tip) => {
  newMessage.value = tip
  tips.value = []
}
const openHistory = () => {
  isMenuOpen.value = false
  emit('history')
}
const saveDefaultLanguage = async () => {
  await profileApi({ method: 'PATCH', body: { defaultLanguage: defaultLanguage.value } }).catch(() => {})
}
const saveSpeechPreference = () => {
  localStorage.setItem('change-skills-speech-enabled', speechEnabled.value ? 'true' : 'false')
  if (!speechEnabled.value && window.speechSynthesis) window.speechSynthesis.cancel()
}
const saveTranslationPreference = () => {
  localStorage.setItem('change-skills-translation-enabled', translationEnabled.value ? 'true' : 'false')
}
const speak = (text) => {
  if (!speechEnabled.value || !window.speechSynthesis || !text) return
  localStorage.setItem('change-skills-speech-enabled', 'true')
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = defaultLanguage.value === 'en' ? 'en-US' : defaultLanguage.value === 'es' ? 'es-ES' : defaultLanguage.value === 'fr' ? 'fr-FR' : 'pt-BR'
  window.speechSynthesis.speak(utterance)
}
const toggleVoice = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    error.value = 'Seu navegador não oferece transcrição de voz nesta versão.'
    return
  }
  if (recognition && listening.value) {
    recognition.stop()
    return
  }
  recognition = new SpeechRecognition()
  recognition.lang = defaultLanguage.value === 'en' ? 'en-US' : defaultLanguage.value === 'es' ? 'es-ES' : defaultLanguage.value === 'fr' ? 'fr-FR' : 'pt-BR'
  recognition.interimResults = true
  recognition.continuous = true
  transcriptBuffer = ''
  recognition.onstart = () => { listening.value = true; error.value = '' }
  recognition.onend = async () => {
    listening.value = false
    const raw = transcriptBuffer.trim()
    if (!raw) return
    try {
      const cleaned = await chatApi('/chats/speech/clean', { method: 'POST', body: { text: raw, defaultLanguage: defaultLanguage.value } })
      newMessage.value = cleaned.text || raw
    } catch {
      newMessage.value = raw
    }
    await nextTick()
    if (newMessage.value.trim()) await sendMessage()
  }
  recognition.onerror = () => { listening.value = false; error.value = 'Não consegui ouvir sua fala. Tente novamente.' }
  recognition.onresult = (event) => {
    const parts = []
    for (let index = 0; index < event.results.length; index++) {
      parts.push(event.results[index][0].transcript)
    }
    transcriptBuffer = parts.join(' ')
    newMessage.value = transcriptBuffer
  }
  recognition.start()
}
async function scrollToBottom() {
  await nextTick()
  if (messagesListRef.value) messagesListRef.value.scrollTop = messagesListRef.value.scrollHeight
}
async function initialize() {
  if (loading.value) return
  loading.value = true
  ready.value = false
  error.value = ''
  try {
    if (!activeId) {
      const courseId = props.courseId || 'general'
      const chat = await chatApi('/chats', { method: 'POST', body: {
        language: props.language || 'en',
        courseId,
        audience: audienceForCourse(courseId),
      } })
      activeId = chat.id
      emit('created', activeId)
    }
    const history = []
    let offset = 0
    let total
    do {
      const page = await chatApi(`/chats/${activeId}/messages?limit=100&offset=${offset}`)
      history.push(...page.items)
      total = page.total
      offset += 100
    } while (offset < total)
    messages.value = history
    ready.value = true
    await scrollToBottom()
  } catch (e) { error.value = e.message }
  finally { loading.value = false }
}
async function sendMessage() {
  const content = newMessage.value.trim()
  if (!content || sending.value || !ready.value) return

  // Retain the same key on retry after a network failure.
  if (!pending || pending.content !== content) pending = { content, requestId: crypto.randomUUID() }
  
  // Optimistic update: exibe a mensagem do usuário imediatamente e limpa o input
  const tempId = 'temp-' + Date.now()
  messages.value.push({
    id: tempId,
    role: 'user',
    content,
    createdAt: new Date().toISOString()
  })
  newMessage.value = ''
  sending.value = true
  error.value = ''
  await scrollToBottom()

  try {
    const result = await chatApi(`/chats/${activeId}/messages`, { method: 'POST', body: { ...pending, translate: translationEnabled.value } })
    // Remove mensagem temporária e insere as mensagens oficiais
    messages.value = messages.value.filter(m => m.id !== tempId)
    const known = new Set(messages.value.map(message => message.id))
    messages.value.push(...result.messages.filter(message => !known.has(message.id)))
    const assistant = result.messages.filter(message => message.role === 'assistant').at(-1)
    if (assistant) speak(assistant.content)
    pending = null
    await scrollToBottom()
  } catch (e) {
    // Em caso de erro, restaura o texto para o usuário não perder
    messages.value = messages.value.filter(m => m.id !== tempId)
    newMessage.value = content
    error.value = e.message
    await scrollToBottom()
  } finally {
    sending.value = false
    await scrollToBottom()
  }
}
onMounted(initialize)
</script>
<style scoped>
.chat-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f4f8ff;
  z-index: 60;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.back-btn {
  background: none;
  border: none;
  color: #1c5bf0;
  cursor: pointer;
  padding: 8px;
  margin-left: -8px;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 12px;
}

.mascot-avatar-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 16px;
  font-weight: 800;
  color: #1a235c;
}

.chat-menu-wrapper {
  position: relative;
}

.menu-dot-btn {
  width: 38px;
  height: 38px;
  border: 1px solid #c7d2fe;
  border-radius: 12px;
  background: white;
  color: #1c5bf0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-menu {
  position: absolute;
  right: 0;
  top: 44px;
  z-index: 80;
  width: 230px;
  background: white;
  border: 1px solid #dbe5f5;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
  display: grid;
  gap: 8px;
}

.chat-menu button,
.chat-menu label {
  border: none;
  background: #f8fafc;
  color: #1e293b;
  border-radius: 12px;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
}

.chat-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-settings {
  display: grid;
  gap: 8px;
  padding: 8px;
  border-radius: 14px;
  background: #eef4ff;
}

.chat-settings label:first-child {
  display: grid;
  gap: 6px;
}

.chat-menu select {
  width: 100%;
  margin-top: 6px;
  border: 1px solid #dbe5f5;
  border-radius: 8px;
  padding: 6px;
}

.audio-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timer-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1px solid #c7d2fe;
  padding: 6px 12px;
  border-radius: 20px;
  color: #1c5bf0;
}

.timer-badge.warning {
  border-color: #fca5a5;
  color: #ef4444;
}

.timer-text {
  font-weight: 700;
  font-size: 14px;
}

.objective-wrapper {
  padding: 20px 20px 0 20px;
  background: #f4f8ff;
  z-index: 10;
  flex-shrink: 0;
}

.mission-box {
  background: white;
  border-radius: 20px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.08);
  border: 1px solid #dcfce7;
}

.mission-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #16a34a;
  font-size: 14px;
  margin-bottom: 4px;
  cursor: pointer;
  position: relative;
  z-index: 5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.mission-icon {
  fill: #16a34a;
}

.mission-title strong {
  font-weight: 800;
}

.mission-content {
  margin-top: 8px;
}

.mission-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 16px 0;
  max-width: 70%;
}

.mission-icons {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}

.mission-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  flex: 1;
  color: #94a3b8;
}

.mission-item.completed {
  color: #16a34a;
}

.icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.mission-item.completed .icon-circle {
  background: #dcfce7;
}

.mission-item span {
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
}

.mission-mascot {
  position: absolute;
  right: -5px;
  top: -15px;
  width: 80px;
  height: 80px;
  object-fit: contain;
  pointer-events: none;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
}

.tips-card {
  align-self: center;
  position: sticky;
  top: 0;
  z-index: 30;
  width: min(100%, 360px);
  background: #ffffff;
  border: 1px solid #bfdbfe;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(28, 91, 240, 0.12);
  padding: 12px;
  display: grid;
  gap: 8px;
}

.tips-card strong {
  color: #1a235c;
  font-size: 13px;
}

.tips-card button:not(.tips-close) {
  border: none;
  border-radius: 12px;
  background: #f0f4ff;
  color: #1c5bf0;
  padding: 10px;
  text-align: left;
  font-weight: 700;
}

.tips-close {
  position: absolute;
  top: 8px;
  right: 10px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 18px;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  opacity: 0;
}

.message-row.mine {
  justify-content: flex-end;
  animation: slideInRight 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.message-row.theirs {
  justify-content: flex-start;
  animation: slideInLeft 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.bot-avatar-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  overflow: hidden;
}

.msg-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  position: relative;
  word-break: break-word;
  overflow-wrap: break-word;
}

.message-bubble p {
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
}

.translation-box {
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(22, 101, 52, 0.12);
  color: #475569;
  font-size: 12px;
  line-height: 1.35;
  font-weight: 600;
}

.message-time {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  text-align: right;
  opacity: 0.7;
}

.bubble-bot {
  background: #eafbea;
  color: #166534;
  border-radius: 20px 20px 20px 4px;
  border: 1px solid #dcfce7;
}

.bubble-mine {
  background: #e0e7ff;
  color: #1c5bf0;
  border-radius: 20px 20px 4px 20px;
}

.typing-row {
  opacity: 1 !important;
  margin-top: 4px;
}

.typing-bubble {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
}

.typing-text {
  font-size: 13px;
  font-weight: 600;
  color: #166534;
}

.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.typing-dots .dot {
  width: 6px;
  height: 6px;
  background-color: #16a34a;
  border-radius: 50%;
  animation: typingBounce 1.4s infinite ease-in-out both;
}

.typing-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

.typing-dots .dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes typingBounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.chat-input-area {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
}

.input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.send-btn {
  background: #1c5bf0;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
}

.voice-btn {
  background: transparent;
  color: #64748b;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-btn.listening {
  color: #ef4444;
  background: #fee2e2;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.end-modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.end-modal-content {
  background: white;
  width: 90%;
  max-width: 340px;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.end-modal-content h2 {
  color: #16a34a;
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 12px 0;
}

.end-modal-content p {
  color: #64748b;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 500;
  margin: 0 0 24px 0;
}

.end-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.primary-btn, .secondary-btn, .outline-btn {
  width: 100%;
  padding: 14px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.primary-btn:active, .secondary-btn:active, .outline-btn:active {
  transform: scale(0.98);
}

.primary-btn {
  background: #1c5bf0;
  color: white;
  box-shadow: 0 4px 12px rgba(28, 91, 240, 0.2);
}

.secondary-btn {
  background: #f0f4ff;
  color: #1c5bf0;
}

.outline-btn {
  background: transparent;
  color: #64748b;
}
</style>

<style scoped>
.history-btn { border: 1px solid #c7d2fe; background: white; border-radius: 12px; padding: 8px; color: #1c5bf0; cursor: pointer; }
.chat-error { padding: 12px 20px; color: #9f1239; background: #fff1f2; }
.message-bubble p { white-space: pre-wrap; overflow-wrap: anywhere; }
.empty-chat { color: #64748b; padding: 20px; }
</style>
