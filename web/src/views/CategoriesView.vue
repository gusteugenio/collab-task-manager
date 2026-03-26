<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import ResourceList from '@/components/ui/ResourceList.vue'
import { useCategoryStore } from '@/stores/category'
import { Tags, Plus, Edit2, Trash2, AlertCircle, Loader2 } from 'lucide-vue-next'

const categoryStore = useCategoryStore()

const isSubmitting = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')
const isModalOpen = ref(false)
const isConfirmOpen = ref(false)

const isEditing = ref(false)
const formData = ref({ id: '', name: '' })
const categoryToDelete = ref({ id: '', name: '' })

const openCreateModal = () => {
  isEditing.value = false
  formData.value = { id: '', name: '' }
  errorMessage.value = ''
  isModalOpen.value = true
}

const openEditModal = (cat: any) => {
  isEditing.value = true
  formData.value = { id: cat.id, name: cat.name }
  errorMessage.value = ''
  isModalOpen.value = true
}

const openDeleteConfirm = (cat: any) => {
  categoryToDelete.value = { id: cat.id, name: cat.name }
  isConfirmOpen.value = true
}

const handleSave = async () => {
  if (!formData.value.name.trim()) {
    errorMessage.value = 'O nome é obrigatório'
    return
  }
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    if (isEditing.value) {
      await categoryStore.updateCategory(formData.value.id, formData.value.name)
    } else {
      await categoryStore.createCategory(formData.value.name)
    }
    isModalOpen.value = false
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Erro ao processar requisição.'
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    await categoryStore.deleteCategory(categoryToDelete.value.id)
    isConfirmOpen.value = false
  } catch (error) {
    alert('Erro ao excluir categoria.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => categoryStore.fetchCategories())
</script>

<template>
  <AppLayout>
    <div class="p-6 md:p-8 flex-1 w-full max-w-6xl mx-auto space-y-8 relative">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Tags class="w-8 h-8 text-primary" />
            Categorias
          </h1>
          <p class="text-muted-foreground mt-1">Gerencie as categorias para organizar suas tarefas.</p>
        </div>
        
        <button 
          @click="openCreateModal" 
          class="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus class="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      <ResourceList 
        :items="categoryStore.categories"
        :is-loading="categoryStore.isLoading"
        empty-title="Nenhuma categoria encontrada"
        empty-message="Comece criando uma categoria para organizar seu fluxo de trabalho."
      >
        <template #empty-action>
          <button @click="openCreateModal" class="mt-4 text-primary font-medium hover:underline">
            Criar primeira categoria
          </button>
        </template>

        <li 
          v-for="category in categoryStore.categories" 
          :key="category.id" 
          class="flex items-center justify-between p-4 sm:px-6 hover:bg-muted/50 transition-colors group"
        >
          <div class="flex items-center gap-3">
            <div :class="['w-2.5 h-2.5 rounded-full shrink-0', category.color]"></div>
            <span class="font-medium text-foreground">{{ category.name }}</span>
          </div>
          
          <div class="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button 
              @click="openEditModal(category)" 
              class="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              <Edit2 class="w-4 h-4" />
            </button>
            <button 
              @click="openDeleteConfirm(category)" 
              class="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </li>
      </ResourceList>

      <BaseModal 
        :is-open="isModalOpen" 
        :title="isEditing ? 'Editar Categoria' : 'Nova Categoria'"
        @close="isModalOpen = false"
      >
        <form @submit.prevent="handleSave" class="space-y-6">
          <div class="space-y-2">
            <label for="cat-name" class="text-sm font-medium text-foreground">Nome da Categoria</label>
            <input 
              id="cat-name"
              v-model="formData.name" 
              type="text" 
              placeholder="Ex: Urgente, Pessoal, Sprint..." 
              class="w-full bg-transparent border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
              :disabled="isSubmitting"
              autofocus
            />
          </div>

          <div v-if="errorMessage" class="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg text-sm">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <p>{{ errorMessage }}</p>
          </div>

          <button 
            type="submit" 
            class="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-lg font-medium transition-colors"
            :disabled="isSubmitting"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            {{ isEditing ? 'Atualizar' : 'Salvar' }}
          </button>
        </form>
      </BaseModal>

      <ConfirmModal 
        :is-open="isConfirmOpen"
        title="Excluir Categoria"
        :message="`Deseja mesmo excluir a categoria '${categoryToDelete.name}'? Isso pode afetar tarefas vinculadas.`"
        :is-loading="isDeleting"
        @close="isConfirmOpen = false"
        @confirm="confirmDelete"
      />

    </div>
  </AppLayout>
</template>
