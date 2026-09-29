<template>
  <div class="chat-container">
    <header class="chat-header">
      <button class="back-btn" @click="$emit('goBack')"><ChevronLeftIcon size="24" /></button>
      <div class="group-info"><div class="group-icon-wrapper"><UsersIcon size="20" /></div><div class="group-text"><span class="group-name">{{ activeGroup?.name || 'Chats em grupo' }}</span><span class="group-status">{{ activeGroup ? `${activeGroup.memberCount || activeGroup.members?.length || 1}/${activeGroup.maxMembers} membros` : 'Crie ou entre por link' }}</span></div></div>
      <button v-if="activeGroup" class="share-btn" @click="copyInvite"><LinkIcon size="18" /></button>
    </header>

    <main v-if="!activeGroup" class="groups-home">
      <section v-if="inviteGroup" class="invite-card">
        <h3>Entrar no grupo?</h3>
        <p>{{ inviteGroup.name }} · {{ inviteGroup.memberCount }}/{{ inviteGroup.maxMembers }} membros</p>
        <button @click="joinInvite">Sim, entrar</button>
      </section>
      <section class="create-card">
        <h3>Criar grupo</h3>
        <input v-model="form.name" placeholder="Nome do grupo" maxlength="60" />
        <div class="form-row"><label>Tamanho</label><input v-model.number="form.maxMembers" type="number" min="2" max="50" /></div>
        <label class="check-row"><input v-model="form.isPublic" type="checkbox" /> Público</label>
        <button :disabled="!form.name.trim()" @click="createGroup">Criar grupo</button>
      </section>
      <section class="list-card">
        <h3>Seus grupos</h3>
        <p v-if="loading">Carregando…</p>
        <p v-else-if="!groups.length" class="muted">Você ainda não participa de grupos.</p>
        <button v-for="group in groups" :key="group.id" class="group-row" @click="openGroup(group.id)"><strong>{{ group.name }}</strong><span>{{ group.memberCount }}/{{ group.maxMembers }} membros</span></button>
      </section>
    </main>

    <template v-else>
      <div class="topic-box"><div><strong>Link de convite</strong><p>{{ inviteUrl }}</p></div><button @click="copyInvite">Copiar</button></div>
      <div class="chat-content" ref="messagesListRef"><div class="messages-list"><div v-for="msg in messages" :key="msg.id" :class="['message-row', msg.senderId === me?.id ? 'mine' : 'theirs']"><div class="message-group"><span v-if="msg.senderId !== me?.id" class="sender-name">{{ msg.name }}</span><div class="message-bubble" :class="msg.senderId === me?.id ? 'bubble-mine' : 'bubble-theirs'"><p>{{ msg.content }}</p><span class="message-time">{{ new Date(msg.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }}</span></div></div></div></div></div>
      <form class="chat-input-area" @submit.prevent="sendMessage"><div class="input-wrapper"><input v-model="newMessage" placeholder="Escreva para o grupo..." maxlength="2000" /><button class="send-btn" :disabled="!newMessage.trim() || sending"><SendIcon size="18" /></button></div></form>
    </template>
    <div v-if="error" class="error-box">{{ error }}</div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { ChevronLeftIcon, LinkIcon, SendIcon, UsersIcon } from '@lucide/vue'
import { currentUser, groupsApi } from '../services/chatApi'
const props = defineProps({ groupId: { type:String, default:null }, inviteCode: { type:String, default:null } })
const emit = defineEmits(['goBack', 'openGroup'])
const me = currentUser()
const groups = ref([]), activeGroup = ref(null), inviteGroup = ref(null), messages = ref([]), newMessage = ref(''), error = ref('')
const loading = ref(false), sending = ref(false), messagesListRef = ref(null)
const form = ref({ name:'', maxMembers:10, isPublic:false })
const inviteUrl = computed(() => activeGroup.value ? `${location.origin}${location.pathname}?group=${activeGroup.value.inviteCode}` : '')
async function loadGroups(){ loading.value=true; try{ groups.value=(await groupsApi()).items||[] }catch(e){ error.value=e.message } finally{ loading.value=false } }
async function loadInvite(){ if(!props.inviteCode) return; try{ inviteGroup.value=await groupsApi(`/invite/${props.inviteCode}`) }catch(e){ error.value=e.message } }
async function createGroup(){ const group=await groupsApi('', {method:'POST', body:form.value}); await loadGroups(); await openGroup(group.id); form.value={name:'',maxMembers:10,isPublic:false} }
async function joinInvite(){ const group=await groupsApi(`/invite/${props.inviteCode}/join`, {method:'POST', body:{}}); inviteGroup.value=null; await loadGroups(); await openGroup(group.id) }
async function openGroup(id){ activeGroup.value=await groupsApi(`/${id}`); emit('openGroup', id); await loadMessages() }
async function loadMessages(){ if(!activeGroup.value) return; messages.value=(await groupsApi(`/${activeGroup.value.id}/messages`)).items||[]; await scroll() }
async function sendMessage(){ if(!newMessage.value.trim()||sending.value) return; const content=newMessage.value.trim(); newMessage.value=''; sending.value=true; try{ const res=await groupsApi(`/${activeGroup.value.id}/messages`, {method:'POST', body:{content}}); messages.value.push({...res.message, name:me?.name}); await scroll() }catch(e){ error.value=e.message; newMessage.value=content } finally{ sending.value=false } }
async function copyInvite(){ await navigator.clipboard?.writeText(inviteUrl.value); error.value='Link copiado.'; setTimeout(()=>{ if(error.value==='Link copiado.') error.value='' },1800) }
async function scroll(){ await nextTick(); messagesListRef.value?.scrollTo({top:messagesListRef.value.scrollHeight, behavior:'smooth'}) }
onMounted(async()=>{ await loadGroups(); await loadInvite(); if(props.groupId) await openGroup(props.groupId) })
</script>

<style scoped>
.chat-container{position:absolute;inset:0;background:#f4f8ff;z-index:60;display:flex;flex-direction:column}.chat-header{display:flex;align-items:center;padding:16px 20px;background:white;border-bottom:1px solid #e2e8f0}.back-btn,.share-btn{border:0;background:#eef4ff;color:#1c5bf0;border-radius:14px;width:40px;height:40px;display:flex;align-items:center;justify-content:center}.group-info{display:flex;align-items:center;flex:1;margin-left:10px}.group-icon-wrapper{width:42px;height:42px;background:#e0e7ff;color:#1c5bf0;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:12px}.group-text{display:grid}.group-name{font-weight:900;color:#1a235c}.group-status,.muted{font-size:12px;color:#64748b;font-weight:700}.groups-home{flex:1;overflow:auto;padding:20px;display:grid;gap:16px;align-content:start}.create-card,.list-card,.invite-card,.topic-box{background:white;border-radius:20px;padding:16px;box-shadow:0 8px 24px rgba(15,23,42,.06);border:1px solid #e2e8f0}h3{margin:0 0 12px;color:#1a235c}.create-card{display:grid;gap:10px}input{border:1px solid #dbe5f5;border-radius:14px;padding:12px;outline:0}.form-row,.check-row{display:flex;align-items:center;justify-content:space-between;color:#475569;font-weight:800}.form-row input{width:86px}.create-card button,.invite-card button,.topic-box button{border:0;background:#1c5bf0;color:white;border-radius:999px;padding:12px;font-weight:900}.group-row{width:100%;display:flex;justify-content:space-between;border:0;border-bottom:1px solid #edf2f7;background:white;padding:13px 0;text-align:left;color:#1e293b}.topic-box{margin:14px 18px 0;display:flex;gap:10px;align-items:center;justify-content:space-between}.topic-box p{margin:4px 0 0;font-size:11px;color:#64748b;word-break:break-all}.chat-content{flex:1;overflow:auto;padding:18px}.messages-list{display:flex;flex-direction:column;gap:14px}.message-row{display:flex}.message-row.mine{justify-content:flex-end}.message-row.theirs{justify-content:flex-start}.message-group{max-width:76%;display:grid;gap:4px}.sender-name{font-size:11px;color:#64748b;font-weight:800}.message-bubble{padding:12px 14px}.message-bubble p{margin:0 0 4px;white-space:pre-wrap}.bubble-theirs{background:#e2e8f0;color:#1e293b;border-radius:18px 18px 18px 4px}.bubble-mine{background:#e0e7ff;color:#1c5bf0;border-radius:18px 18px 4px 18px}.message-time{font-size:10px;opacity:.7;text-align:right;display:block}.chat-input-area{padding:16px 20px;background:white;border-top:1px solid #e2e8f0}.input-wrapper{display:flex;gap:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:24px;padding:4px 4px 4px 14px}.input-wrapper input{flex:1;border:0;background:transparent}.send-btn{border:0;background:#1c5bf0;color:white;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center}.send-btn:disabled{opacity:.5}.error-box{padding:10px 18px;background:#fff7ed;color:#9a3412;font-weight:800;font-size:12px}
</style>
