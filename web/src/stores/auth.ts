import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('@collab-tasks:token'))
  const user = ref<any>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: any) {
    const { data } = await api.post('/auth/login', credentials)
    
    token.value = data.token
    localStorage.setItem('@collab-tasks:token', data.token)
    
    if (data.user) {
      user.value = data.user
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('@collab-tasks:token')
  }

  return { token, user, isAuthenticated, login, logout }
})
