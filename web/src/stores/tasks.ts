import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/axios'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<any[]>([])
  const isLoading = ref(false)

  async function fetchTasks() {
    isLoading.value = true
    try {
      const { data } = await api.get('/tasks')
      tasks.value = data.tasks 
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(taskData: any) {
    const { data } = await api.post('/tasks', taskData)
    tasks.value.push(data)
  }

  async function updateTask(id: string, taskData: any) {
    const { data } = await api.put(`/tasks/${id}`, taskData)
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = data
    }
  }

  async function deleteTask(id: string) {
    await api.delete(`/tasks/${id}`)
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return { tasks, isLoading, fetchTasks, createTask, updateTask, deleteTask }
})
