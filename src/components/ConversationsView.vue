<template>
  <div class="view-container">
    <header class="app-header">
      <button class="menu-btn" @click="$emit('openSidebar')"><MenuIcon size="24" /></button>
      <h2 class="header-title">Chats</h2>
    </header>

    <div class="content-scroll" @click="showNewChat = false">
      <AiChatHistory @open="$emit('openAiChat', $event)" />

      <section class="friends-chats">
        <div class="section-heading">
          <h3>Conversas com amigos</h3>
          <button @click="$emit('navigate', 'friends')">+</button>
        </div>
        <p v-if="loadingFriends">Carregando conversas…</p>
        <p v-else-if="!friendConversations.length" class="muted">Adicione amigos para começar uma conversa.</p>
        <button v-for="conv in friendConversations" :key="conv.id" class="friend-chat-row" @click="$emit('openFriendChat', conv.id)">
          <img :src="avatar(conv.friend)" />
          <div><strong>{{ conv.friend.name }}</strong><small>@{{ conv.friend.username }}</small></div>
          <span v-if="conv.streakDays">🔥 {{ conv.streakDays }}d</span>
        </button>
      </section>
    </div>

    <div class="new-chat-fixed" @click.stop>
      <div v-if="showNewChat" class="new-chat-menu">
        <button type="button" @click="choose('freeMascot')"><MessageCircleIcon size="20" /><span><strong>Chat com Camaleão</strong><small>Conversa livre, sem cenário.</small></span></button>
        <button type="button" @click="choose('practice')"><SparklesIcon size="20" /><span><strong>Práticas</strong><small>Situações do dia para treinar.</small></span></button>
        <button type="button" @click="choose('friends')"><UsersIcon size="20" /><span><strong>Conversa com amigos</strong><small>Fale com pessoas adicionadas.</small></span></button>
        <button type="button" @click="choose('group')"><UserPlusIcon size="20" /><span><strong>Criar chat em grupo</strong><small>Defina nome, limite e convite.</small></span></button>
      </div>
      <button type="button" class="new-chat-button" @click="showNewChat = !showNewChat">Novo chat</button>
    </div>

    <nav class="bottom-nav">
      <div class="nav-item" @click="$emit('navigate', 'home')"><HomeIcon size="28" /><span>Início</span></div>
      <div class="nav-item active" @click="$emit('navigate', 'conversations')"><MessageCircleIcon size="28" /><span>Chats</span></div>
      <div class="nav-item" @click="$emit('navigate', 'friends')"><UsersIcon size="28" /><span>Amigos</span></div>
      <div class="nav-item" @click="$emit('navigate', 'profile')"><UserIcon size="28" /><span>Perfil</span></div>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AiChatHistory from './AiChatHistory.vue'
import { Menu as MenuIcon, Home as HomeIcon, MessageCircle as MessageCircleIcon, User as UserIcon, Users as UsersIcon, Sparkles as SparklesIcon, UserPlus as UserPlusIcon } from '@lucide/vue'
import { friendsApi } from '../services/chatApi'
const emit = defineEmits(['openSidebar', 'openChat', 'openAiChat', 'openFriendChat', 'navigate', 'newFreeMascot', 'newPractice', 'newGroup'])
const friendConversations = ref([])
const showNewChat = ref(false)
const loadingFriends = ref(false)
function choose(action) {
  showNewChat.value = false
  if (action === 'freeMascot') emit('newFreeMascot')
  if (action === 'practice') emit('newPractice')
  if (action === 'friends') emit('navigate', 'friends')
  if (action === 'group') emit('newGroup')
}
const avatar = (user) => user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Amigo')}&background=e0f2fe&color=1c5bf0`
async function loadFriendConversations() {
  loadingFriends.value = true
  try { friendConversations.value = (await friendsApi('/conversations')).items || [] }
  catch { friendConversations.value = [] }
  finally { loadingFriends.value = false }
}
onMounted(loadFriendConversations)
</script>

<style scoped>
.view-container { position:absolute; inset:0; background:#f8fbff; z-index:10; display:flex; flex-direction:column; }
.app-header { height:64px; display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:#fff; border-bottom:1px solid #e2e8f0; position:relative; }
.header-title { position:absolute; left:50%; transform:translateX(-50%); margin:0; font-size:18px; color:#1a235c; font-weight:800; }
.menu-btn { background:none; border:0; color:#1a235c; }
.content-scroll { flex:1; overflow-y:auto; padding:0 20px 210px; }
.friends-chats { margin: 18px 0; padding:18px; background:#fff; border-radius:20px; box-shadow:0 8px 24px rgba(15,23,42,.05); }
.section-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; }
h3 { margin:0; color:#1a235c; font-size:16px; }
.section-heading button { width:38px; height:38px; border:1px solid #dbe5f5; border-radius:50%; background:#f4f8ff; color:#1c5bf0; font-size:22px; font-weight:900; padding:0; display:inline-flex; align-items:center; justify-content:center; line-height:1; }
.muted, small { color:#64748b; }
.friend-chat-row { width:100%; display:flex; align-items:center; gap:12px; border:0; border-bottom:1px solid #edf2f7; background:#fff; padding:12px 0; text-align:left; color:#1e293b; }
.friend-chat-row img { width:46px; height:46px; border-radius:50%; object-fit:cover; }
.friend-chat-row div { flex:1; display:grid; gap:2px; }
.friend-chat-row span { color:#e11d48; font-weight:900; }
.new-chat-fixed { position:fixed; left:50%; bottom:86px; transform:translateX(-50%); width:min(432px, calc(100% - 36px)); z-index:55; display:grid; gap:10px; }
.new-chat-button { width:100%; border:0; border-radius:22px; background:#1c5bf0; color:#fff; padding:16px 18px; font-weight:950; font-size:16px; box-shadow:0 18px 38px rgba(28,91,240,.25); }
.new-chat-menu { background:#fff; border:1px solid #dbeafe; border-radius:24px; padding:10px; box-shadow:0 22px 48px rgba(15,23,42,.16); display:grid; gap:6px; }
.new-chat-menu button { border:0; background:#fff; border-radius:18px; padding:12px; display:flex; align-items:center; gap:12px; color:#1a235c; text-align:left; }
.new-chat-menu button:hover { background:#f4f8ff; }
.new-chat-menu svg { color:#1c5bf0; flex-shrink:0; }
.new-chat-menu span { display:grid; gap:2px; }
.new-chat-menu strong { font-size:14px; }
.new-chat-menu small { font-size:12px; color:#64748b; }
.bottom-nav { display:flex; justify-content:space-around; align-items:center; height:72px; background:white; border-top:1px solid #e2e8f0; position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; z-index:50; }
.nav-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; color:#94a3b8; cursor:pointer; height:100%; }
.nav-item.active { color:#1c5bf0; }
.nav-item span { font-size:11px; font-weight:500; }
</style>
