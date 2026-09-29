<template>
  <div class="view-container">
    <header class="app-header">
      <button class="menu-btn" @click="$emit('openSidebar')"><MenuIcon size="24" /></button>
      <h2 class="header-title">Amigos</h2>
    </header>
    <div class="content-scroll">
      <section class="search-card">
        <h3>Adicionar por nome de usuário</h3>
        <div class="search-row">
          <input v-model="query" placeholder="nome de usuário" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <div v-for="person in results" :key="person.id" class="person-row">
          <img :src="avatar(person)" />
          <div><strong>{{ person.name }}</strong><small>@{{ person.username }} · {{ languageLabel(person.defaultLanguage) }}</small></div>
          <button v-if="person.requestReceived" @click="acceptSearch(person)">Aceitar</button>
          <button v-else :disabled="person.isFriend || person.requestSent" @click="add(person)">{{ person.isFriend ? 'Amigo' : person.requestSent ? 'Enviado' : 'Adicionar' }}</button>
        </div>
      </section>

      <section v-if="incoming.length" class="friends-card">
        <h3>Pedidos recebidos</h3>
        <div v-for="request in incoming" :key="request.requestId" class="person-row">
          <img :src="avatar(request)" />
          <div><strong>{{ request.name }}</strong><small>@{{ request.username }} · {{ languageLabel(request.defaultLanguage) }}</small></div>
          <button @click="accept(request)">Aceitar</button>
        </div>
      </section>

      <section v-if="outgoing.length" class="friends-card">
        <h3>Pedidos enviados</h3>
        <div v-for="request in outgoing" :key="request.requestId" class="person-row muted-row">
          <img :src="avatar(request)" />
          <div><strong>{{ request.name }}</strong><small>@{{ request.username }} · aguardando aceite</small></div>
          <span class="pending">Enviado</span>
        </div>
      </section>

      <section class="friends-card">
        <h3>Seus amigos</h3>
        <p v-if="loading">Carregando amigos…</p>
        <p v-else-if="!friends.length" class="muted">Você ainda não adicionou amigos.</p>
        <button v-for="friend in friends" :key="friend.id" class="friend-row" @click="openChat(friend)">
          <img :src="avatar(friend)" />
          <div class="friend-main"><strong>{{ friend.name }}</strong><small>@{{ friend.username }} · {{ languageLabel(friend.defaultLanguage) }}</small></div>
          <span v-if="friend.streakDays" class="streak">🔥 {{ friend.streakDays }}d</span>
        </button>
      </section>
    </div>
    <nav class="bottom-nav">
      <div class="nav-item" @click="$emit('navigate', 'home')"><HomeIcon size="28" /><span>Início</span></div>
      <div class="nav-item" @click="$emit('navigate', 'conversations')"><MessageCircleIcon size="28" /><span>Chats</span></div>
      <div class="nav-item active"><UsersIcon size="28" /><span>Amigos</span></div>
      <div class="nav-item" @click="$emit('navigate', 'profile')"><UserIcon size="28" /><span>Perfil</span></div>
    </nav>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { Home as HomeIcon, Menu as MenuIcon, MessageCircle as MessageCircleIcon, User as UserIcon, Users as UsersIcon } from '@lucide/vue'
import { friendsApi } from '../services/chatApi'
const emit = defineEmits(['openSidebar', 'navigate', 'openFriendChat'])
const query = ref('')
const results = ref([])
const friends = ref([])
const incoming = ref([])
const outgoing = ref([])
const loading = ref(false)
const error = ref('')
const languageLabel = (code) => ({ pt: 'Português', en: 'English', es: 'Español', fr: 'Français' }[code] || 'Idioma padrão')
let searchTimer = null
const avatar = (user) => user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=e0f2fe&color=1c5bf0`
async function loadFriends() {
  loading.value = true
  error.value = ''
  try { friends.value = (await friendsApi()).items || [] }
  catch (e) { error.value = e.message }
  finally { loading.value = false }
}
async function loadRequests() {
  try {
    const data = await friendsApi('/requests')
    incoming.value = data.incoming || []
    outgoing.value = data.outgoing || []
  } catch {}
}
async function search() {
  const q = query.value.replace(/^@+/, '').trim()
  if (!q) {
    results.value = []
    error.value = ''
    return
  }
  error.value = ''
  try { results.value = (await friendsApi(`/search?q=${encodeURIComponent(q)}`)).items || [] }
  catch (e) { error.value = e.message }
}
async function add(person) {
  error.value = ''
  try {
    await friendsApi('', { method: 'POST', body: { username: person.username } })
    await loadAll()
    await search()
  } catch (e) { error.value = e.message }
}
async function accept(request) {
  await friendsApi(`/requests/${request.requestId}/accept`, { method: 'POST', body: {} })
  await loadAll()
  if (query.value.trim()) await search()
}
async function acceptSearch(person) {
  const request = incoming.value.find(item => item.id === person.id)
  if (request) await accept(request)
}
async function openChat(friend) {
  const conversation = await friendsApi(`/${friend.id}/conversation`, { method: 'POST', body: {} })
  emit('openFriendChat', conversation.id)
}
async function loadAll() {
  await Promise.all([loadFriends(), loadRequests()])
}
watch(query, () => {
  if (searchTimer) clearTimeout(searchTimer)
  const q = query.value.replace(/^@+/, '').trim()
  if (!q) {
    results.value = []
    error.value = ''
    return
  }
  searchTimer = setTimeout(search, 250)
})
onMounted(loadAll)
</script>
<style scoped>
.view-container { position:absolute; inset:0; background:#f8fbff; z-index:10; display:flex; flex-direction:column; }
.app-header { height:64px; display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:#fff; border-bottom:1px solid #e2e8f0; position:relative; }
.header-title { position:absolute; left:50%; transform:translateX(-50%); margin:0; font-size:18px; color:#1a235c; font-weight:800; }
.menu-btn { background:none; border:0; color:#1a235c; }
.content-scroll { flex:1; overflow:auto; padding:20px; padding-bottom:120px; display:grid; gap:18px; align-content:start; }
.search-card, .friends-card { background:#fff; border-radius:22px; padding:18px; box-shadow:0 8px 24px rgba(15,23,42,.05); }
h3 { margin:0 0 12px; color:#1a235c; }
.search-row { display:flex; gap:10px; }
input { flex:1; border:1px solid #dbe5f5; border-radius:14px; padding:12px; font-weight:700; outline:none; min-width: 0; }
button { border:0; border-radius:14px; background:#1c5bf0; color:#fff; font-weight:800; padding:10px 14px; }
.person-row, .friend-row { display:flex; align-items:center; gap:12px; width:100%; background:#fff; color:#1e293b; border:1px solid #edf2f7; margin-top:10px; text-align:left; padding:12px; box-sizing:border-box; border-radius:16px; }
.person-row img, .friend-row img { width:46px; height:46px; border-radius:50%; object-fit:cover; }
.person-row div, .friend-main { flex:1; display:grid; gap:2px; min-width:0; }
small, .muted { color:#64748b; }
.person-row button:disabled { background:#e2e8f0; color:#64748b; }
.pending { color:#64748b; font-weight:800; font-size:12px; }
.streak { color:#e11d48; font-weight:900; }
.error { color:#be123c; background:#fff1f2; padding:10px; border-radius:12px; }
.bottom-nav { display:flex; justify-content:space-around; align-items:center; height:72px; background:white; border-top:1px solid #e2e8f0; position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; z-index:50; }
.nav-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; color:#94a3b8; cursor:pointer; height:100%; }
.nav-item.active { color:#1c5bf0; }
.nav-item span { font-size:11px; font-weight:500; }
</style>
