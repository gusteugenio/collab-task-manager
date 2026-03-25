import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
})

// Roda antes de qualquer chamada pro backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@collab-tasks:token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// roda quando o backend retorna algo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // token inválido/expirado ou sem permissão
    if (error.response?.status === 401) {
      localStorage.removeItem('@collab-tasks:token')
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)
