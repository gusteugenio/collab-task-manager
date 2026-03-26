import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/axios'
import { getCategoryColor } from '@/utils/colors'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<any[]>([])
  const isLoading = ref(false)
  const isSyncing = ref(false)
  const lastSync = ref<string>(new Date().toISOString())

  function formatTask(task: any) {
    return {
      ...task,
      category: task.category ? { 
        ...task.category, 
        color: getCategoryColor(task.category.name) 
      } : null
    }
  }

  async function fetchTasks(filters = {}) {
    isLoading.value = true
    try {
      const { data } = await api.get('/tasks', { params: filters })
      tasks.value = data.tasks.map(formatTask)
      lastSync.value = new Date().toISOString()
    } finally {
      isLoading.value = false
    }
  }

  async function syncTasks() {
    if (isSyncing.value) return
    isSyncing.value = true
    try {
      const { data } = await api.get('/tasks/sync', { 
        params: { lastSync: lastSync.value } 
      })
      
      if (data.tasks.length > 0) {
        data.tasks.forEach((rawTask: any) => {
          const updatedTask = formatTask(rawTask)
          
          if (updatedTask.deletedAt) {
            tasks.value = tasks.value.filter(t => t.id !== updatedTask.id)
          } else {
            const index = tasks.value.findIndex(t => t.id === updatedTask.id)
            if (index !== -1) {
              tasks.value[index] = updatedTask
            } else {
              tasks.value.unshift(updatedTask)
            }
          }
        })
        lastSync.value = new Date().toISOString()
      }
    } finally {
      isSyncing.value = false
    }
  }

  async function createTask(data: any) {
    const { data: rawTask } = await api.post('/tasks', data)
    tasks.value.unshift(formatTask(rawTask))
  }

  async function updateTask(id: string, data: any) {
    const { data: rawTask } = await api.put(`/tasks/${id}`, data)
    const updatedTask = formatTask(rawTask)
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) tasks.value[index] = updatedTask
  }

  async function deleteTask(id: string) {
    await api.delete(`/tasks/${id}`)
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  async function shareTask(id: string, userId: string) {
    await api.post(`/tasks/${id}/share`, { userId })

    await syncTasks()
  }

  return { 
    tasks, isLoading, isSyncing, fetchTasks, syncTasks, 
    createTask, updateTask, deleteTask, shareTask 
  }
})
