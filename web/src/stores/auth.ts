import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/axios'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthCredentials {
  email: string
  password: string
  name?: string 
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('@collab-tasks:token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('@collab-tasks:user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function register(credentials: AuthCredentials) {
    await api.post('/auth/register', credentials)
  }

  async function login(credentials: AuthCredentials) {
    const { data } = await api.post('/auth/login', credentials)
    
    token.value = data.token
    localStorage.setItem('@collab-tasks:token', data.token)
    
    if (data.user) {
      user.value = data.user
      localStorage.setItem('@collab-tasks:user', JSON.stringify(data.user))
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('@collab-tasks:token')
    localStorage.removeItem('@collab-tasks:user')
  }

  return { token, user, isAuthenticated, login, register, logout }
})
