<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ResourceList from '@/components/ui/ResourceList.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useTaskStore } from '@/stores/task'
import { useCategoryStore } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/axios'
import axios from 'axios'
import { 
  Plus, Search, Tags, RefreshCw, Clock, 
  Edit2, Trash2, Share2, ChevronDown, Check,
  User as UserIcon, AlertCircle, Play, FileText, Calendar, UserCheck, Loader2
} from 'lucide-vue-next'

const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

// Filtros e estados
const search = ref('')
const status = ref('')
const categoryId = ref('')
const users = ref<any[]>([])

// UI States
const isSubmitting = ref(false)
const errorMessage = ref('')
const isModalOpen = ref(false)
const isConfirmOpen = ref(false)
const isShareModalOpen = ref(false)
const isViewModalOpen = ref(false)
const isEditing = ref(false)

const taskForm = ref({ id: '', title: '', description: '', categoryId: '', status: 'TODO' })
const taskToView = ref<any>(null)
const taskToDelete = ref<any>(null)
const taskToShare = ref<any>(null)
const shareUserId = ref('')

const statusOptions = [
  { value: 'TODO', label: 'Pendente', class: 'bg-muted text-muted-foreground' },
  { value: 'DOING', label: 'Fazendo', class: 'bg-blue-500/10 text-blue-500 border border-blue-500/20' },
  { value: 'DONE', label: 'Concluído', class: 'bg-green-500/10 text-green-500 border border-green-500/20' }
]

const loadData = () => {
  const filters: any = {}
  if (search.value) filters.search = search.value
  if (status.value) filters.status = status.value
  if (categoryId.value) filters.categoryId = categoryId.value
  taskStore.fetchTasks(filters)
}

const fetchUsers = async () => {
  try {
    const { data } = await api.get('/users')
    users.value = data.users
  } catch (e) {
  }
}

// Funções de Modal
const openCreate = () => {
  isEditing.value = false
  errorMessage.value = ''
  taskForm.value = { id: '', title: '', description: '', categoryId: '', status: 'TODO' }
  isModalOpen.value = true
}

const openEdit = (task: any) => {
  isEditing.value = true
  errorMessage.value = ''
  taskForm.value = { 
    id: task.id, 
    title: task.title, 
    description: task.description || '', 
    categoryId: task.categoryId || '', 
    status: task.status 
  }
  isModalOpen.value = true
}

const openView = (task: any) => {
  taskToView.value = task
  isViewModalOpen.value = true
}

const openDeleteConfirm = (task: any) => {
  taskToDelete.value = task
  isConfirmOpen.value = true
}

const handleSave = async () => {
  if (!taskForm.value.title.trim()) {
    errorMessage.value = 'O título da tarefa é obrigatório.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  // Remove strings vazias para não quebrar o Zod
  const payload: any = {
    title: taskForm.value.title,
    description: taskForm.value.description || undefined,
    status: taskForm.value.status,
    categoryId: taskForm.value.categoryId === '' ? undefined : taskForm.value.categoryId
  }

  try {
    if (isEditing.value) {
      await taskStore.updateTask(taskForm.value.id, payload)
    } else {
      await taskStore.createTask(payload)
    }
    isModalOpen.value = false
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.error || 'Erro ao processar tarefa.'
    } else {
      errorMessage.value = 'Ocorreu um erro inesperado.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const updateTaskStatus = async (task: any, newStatus: string) => {
  try {
    await taskStore.updateTask(task.id, { status: newStatus })
  } catch (error) {
    alert('Erro ao atualizar status.')
  }
}

const handleShare = async () => {
  if (!shareUserId.value) return
  try {
    await taskStore.shareTask(taskToShare.value.id, shareUserId.value)
    isShareModalOpen.value = false
    shareUserId.value = ''
  } catch (e) {
    alert('Não foi possível compartilhar a tarefa.')
  }
}

onMounted(() => {
  loadData()
  categoryStore.fetchCategories()
  fetchUsers()
  setInterval(() => taskStore.syncTasks(), 10000)
})

watch([status, categoryId], loadData)

let searchTimeout: any
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(loadData, 500)
})
</script>

<template>
  <AppLayout>
    <div class="p-4 md:p-8 flex-1 w-full max-w-6xl mx-auto space-y-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Minhas Tarefas</h1>
          <RefreshCw v-if="taskStore.isSyncing" class="w-5 h-5 animate-spin text-primary" />
        </div>
        <button @click="openCreate" class="w-full sm:w-auto bg-primary text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
          <Plus class="w-5 h-5" /> Nova Tarefa
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div class="md:col-span-2 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input v-model="search" placeholder="Buscar tarefas..." class="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select v-model="status" class="bg-muted/50 border-none rounded-lg px-3 py-2 outline-none cursor-pointer">
          <option value="">Todos os status</option>
          <option value="TODO">Pendente</option>
          <option value="DOING">Fazendo</option>
          <option value="DONE">Concluído</option>
        </select>
        <select v-model="categoryId" class="bg-muted/50 border-none rounded-lg px-3 py-2 outline-none cursor-pointer">
          <option value="">Todas as categorias</option>
          <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <ResourceList :items="taskStore.tasks" :is-loading="taskStore.isLoading" empty-title="Nenhuma tarefa" empty-message="Crie sua primeira tarefa acima.">
        <li v-for="task in taskStore.tasks" :key="task.id" 
          class="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-muted/30 transition-all border-b border-border/50 last:border-0 gap-4"
        >
          <div class="flex items-start sm:items-center gap-4 min-w-0 flex-1 cursor-pointer" @click="openView(task)">
            <div class="relative inline-block text-left shrink-0" @click.stop>
              <select 
                :value="task.status" 
                @change="e => updateTaskStatus(task, (e.target as HTMLSelectElement).value)"
                class="appearance-none pl-3 pr-8 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase cursor-pointer outline-none transition-all"
                :class="statusOptions.find(o => o.value === task.status)?.class"
              >
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <ChevronDown class="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
            </div>

            <div class="flex flex-col min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-semibold text-foreground truncate max-w-[200px] md:max-w-md" :class="{ 'opacity-50 line-through': task.status === 'DONE' }">
                  {{ task.title }}
                </span>
                
                <div class="flex gap-1">
                  <span v-if="task.ownerId === authStore.user?.id" class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
                    Dono
                  </span>
                  <span v-else class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20 whitespace-nowrap">
                    Colaborador
                  </span>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-3 mt-1.5">
                <div v-if="task.category" class="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-foreground border border-border">
                  <div :class="['w-1.5 h-1.5 rounded-full', task.category.color]"></div>
                  {{ task.category.name }}
                </div>

                <div v-if="task.collaborators?.length" class="flex -space-x-1.5">
                  <div v-for="user in task.collaborators" :key="user.id" 
                    class="w-5 h-5 rounded-full bg-primary border border-card flex items-center justify-center text-[9px] text-white font-bold"
                    :title="user.name"
                  >
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button v-if="task.ownerId === authStore.user?.id" @click.stop="taskToShare = task; isShareModalOpen = true" class="p-2 hover:bg-muted rounded-md text-muted-foreground" title="Compartilhar">
              <Share2 class="w-4 h-4" />
            </button>
            <button @click.stop="openEdit(task)" class="p-2 hover:bg-muted rounded-md text-muted-foreground"><Edit2 class="w-4 h-4" /></button>
            <button v-if="task.ownerId === authStore.user?.id" @click.stop="openDeleteConfirm(task)" class="p-2 hover:bg-red-500/10 text-red-500 rounded-md"><Trash2 class="w-4 h-4" /></button>
          </div>
        </li>
      </ResourceList>

      <BaseModal :is-open="isViewModalOpen" title="Detalhes da Tarefa" @close="isViewModalOpen = false">
        <div v-if="taskToView" class="space-y-6">
          <div>
            <h3 class="text-xl font-bold text-foreground">{{ taskToView.title }}</h3>
            <div class="flex items-center gap-2 mt-2">
              <div class="px-3 py-1 rounded-full text-xs font-bold uppercase" :class="statusOptions.find(o => o.value === taskToView.status)?.class">
                {{ statusOptions.find(o => o.value === taskToView.status)?.label }}
              </div>
              <div v-if="taskToView.category" class="flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-bold">
                <div :class="['w-2 h-2 rounded-full', taskToView.category.color]"></div>
                {{ taskToView.category.name }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase">
              <FileText class="w-4 h-4" /> Descrição
            </label>
            <p class="text-sm text-foreground bg-muted/30 p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
              {{ taskToView.description || 'Nenhuma descrição fornecida.' }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase">
                <Calendar class="w-4 h-4" /> Criada em
              </label>
              <p class="text-sm font-medium">{{ new Date(taskToView.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase">
                <UserCheck class="w-4 h-4" /> Seu Papel
              </label>
              <p class="text-sm font-medium">
                {{ taskToView.ownerId === authStore.user?.id ? 'Dono' : 'Colaborador' }}
              </p>
            </div>
          </div>

          <div v-if="taskToView.collaborators?.length" class="space-y-2">
            <label class="text-[11px] font-bold text-muted-foreground uppercase">Colaboradores</label>
            <div class="flex flex-wrap gap-2">
              <div v-for="user in taskToView.collaborators" :key="user.id" class="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <span class="text-xs font-medium">{{ user.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </BaseModal>

      <BaseModal :is-open="isModalOpen" :title="isEditing ? 'Editar Tarefa' : 'Nova Tarefa'" @close="isModalOpen = false">
        <form @submit.prevent="handleSave" class="space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-bold text-muted-foreground uppercase text-[11px]">Título</label>
            <input v-model="taskForm.title" required class="w-full bg-muted/50 border border-border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary" :disabled="isSubmitting" />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-bold text-muted-foreground uppercase text-[11px]">Categoria</label>
            <select v-model="taskForm.categoryId" class="w-full bg-muted/50 border border-border p-2.5 rounded-lg outline-none cursor-pointer" :disabled="isSubmitting">
              <option value="">Sem categoria</option>
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-sm font-bold text-muted-foreground uppercase text-[11px]">Descrição</label>
            <textarea v-model="taskForm.description" rows="4" class="w-full bg-muted/50 border border-border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Detalhes da tarefa..." :disabled="isSubmitting"></textarea>
          </div>

          <div v-if="errorMessage" class="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg text-xs">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <p>{{ errorMessage }}</p>
          </div>

          <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            {{ isEditing ? 'Salvar Alterações' : 'Criar Tarefa' }}
          </button>
        </form>
      </BaseModal>

      <BaseModal :is-open="isShareModalOpen" title="Convidar Colaborador" @close="isShareModalOpen = false">
        <div class="space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-bold text-muted-foreground uppercase text-[11px]">Selecione o Usuário</label>
            <select v-model="shareUserId" class="w-full bg-muted/50 border border-border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-primary cursor-pointer">
              <option value="">Nenhum</option>
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </div>
          <button @click="handleShare" :disabled="!shareUserId" class="w-full bg-primary text-white py-2.5 rounded-lg font-bold disabled:opacity-50">
            Compartilhar Tarefa
          </button>
        </div>
      </BaseModal>

      <ConfirmModal 
        :is-open="isConfirmOpen" 
        title="Excluir Tarefa" 
        :message="`Tem certeza que deseja apagar a tarefa '${taskToDelete?.title}'?` " 
        @close="isConfirmOpen = false" 
        @confirm="taskStore.deleteTask(taskToDelete.id); isConfirmOpen = false" 
      />
    </div>
  </AppLayout>
</template>
