const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const sessionKey = 'change-skills-chat-session'
const userKey = 'change-skills-user'
let sessionPromise

async function decode(response) {
  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(' ') : data?.message
    throw new Error(message || 'Não foi possível acessar o chat. Tente novamente.')
  }
  if (!data) throw new Error('Resposta inválida do servidor do chat.')
  return data
}

async function session() {
  const saved = localStorage.getItem(sessionKey)
  if (saved) return saved
  if (!sessionPromise) {
    sessionPromise = fetch(`${baseUrl}/sessions`, { method: 'POST' })
      .then(decode)
      .then(({ token }) => {
        localStorage.setItem(sessionKey, token)
        return token
      }).finally(() => { sessionPromise = null })
  }
  return sessionPromise
}

export function currentUser() {
  const raw = localStorage.getItem(userKey)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function saveCurrentUser(user) {
  localStorage.setItem(userKey, JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem(sessionKey)
  localStorage.removeItem(userKey)
}

export async function authApi(path, body) {
  const data = await decode(await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }))
  localStorage.setItem(sessionKey, data.token)
  localStorage.setItem(userKey, JSON.stringify(data.user))
  return data.user
}

export async function chatApi(path, options = {}) {
  const token = await session()
  try {
    return await decode(await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: options.body ? JSON.stringify(options.body) : undefined,
    }))
  } catch (error) {
    if (error instanceof TypeError) throw new Error('Backend indisponível. Verifique se a API está em execução.')
    throw error
  }
}

export async function profileApi(options = {}) {
  const data = await chatApi('/profile', options)
  if (data?.user) saveCurrentUser(data.user)
  return data
}

export const friendsApi = (path = '', options = {}) => chatApi(`/friends${path}`, options)
export const groupsApi = (path = '', options = {}) => chatApi(`/groups${path}`, options)
