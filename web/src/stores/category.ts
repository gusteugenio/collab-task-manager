import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/axios'
import { getCategoryColor } from '@/utils/colors'

export interface Category {
  id: string
  name: string
  color?: string
}

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)

  async function fetchCategories() {
    isLoading.value = true
    try {
      const { data } = await api.get('/categories')
      categories.value = data.categories.map((cat: any) => ({
      ...cat,
      color: getCategoryColor(cat.name)
    }))
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(name: string) {
    await api.post('/categories', { name })
    await fetchCategories() 
  }

  async function updateCategory(id: string, name: string) {
    await api.put(`/categories/${id}`, { name })
    await fetchCategories()
  }

  async function deleteCategory(id: string) {
    await api.delete(`/categories/${id}`)
    await fetchCategories()
  }

  return { 
    categories, 
    isLoading, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  }
})
