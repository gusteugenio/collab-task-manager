<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/axios'
import AppLayout from '@/components/layout/AppLayout.vue'
import { ListTodo, CheckSquare, Clock, TrendingUp, PieChart, Activity, Loader2 } from 'lucide-vue-next'
import { useTaskStore } from '@/stores/task' 

const router = useRouter()
const taskStore = useTaskStore()

const periodInDays = ref('7')
const report = ref<any>(null)
const isLoading = ref(true)
const showEmptyModal = ref(false)
let pollInterval: any = null

const fetchReport = async (showLoading = true) => {
  if (showLoading) isLoading.value = true
  try {
    const { data } = await api.get(`/reports?periodInDays=${periodInDays.value}`)
    report.value = data
  } catch (error) {
    console.error('Erro ao buscar relatório:', error)
  } finally {
    if (showLoading) isLoading.value = false
  }
}

const goToTasks = () => {
  showEmptyModal.value = false
  router.push('/tasks')
}

onMounted(async () => {
  fetchReport()
  
  await taskStore.fetchTasks()
  if (taskStore.tasks.length === 0) {
    showEmptyModal.value = true
  }

  pollInterval = setInterval(() => {
    fetchReport(false)
  }, 20000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

watch(periodInDays, () => fetchReport(true))
</script>

<template>
  <AppLayout>
    <div v-if="showEmptyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div class="bg-card border border-border rounded-xl shadow-lg w-full max-w-md p-6 space-y-6 animate-in zoom-in-95 duration-200">
        <div class="space-y-2 text-center sm:text-left">
          <h2 class="text-xl font-semibold tracking-tight text-foreground">Bem-vindo(a)!</h2>
          <p class="text-muted-foreground text-sm">
            Notamos que você ainda não possui nenhuma tarefa. Gostaria de criar a sua primeira tarefa agora para começar a se organizar?
          </p>
        </div>
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
          <button @click="showEmptyModal = false" class="px-4 py-2 rounded-md text-sm font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors">
            Agora não
          </button>
          <button @click="goToTasks" class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            Sim, criar tarefa
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 md:p-8 flex-1 w-full max-w-6xl mx-auto space-y-8">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p class="text-muted-foreground mt-1">Acompanhe o progresso e as estatísticas das suas tarefas.</p>
        </div>
        
        <div class="flex items-center gap-2 bg-card border border-border rounded-lg p-1 shadow-sm">
          <Clock class="w-4 h-4 text-muted-foreground ml-2" />
          <select v-model="periodInDays" class="bg-transparent border-none text-sm font-medium text-foreground focus:ring-0 cursor-pointer py-1.5 pr-8 pl-2 outline-none appearance-none">
            <option value="1" class="bg-card text-foreground">Hoje (24h)</option>
            <option value="7" class="bg-card text-foreground">Últimos 7 dias</option>
            <option value="30" class="bg-card text-foreground">Últimos 30 dias</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 class="w-10 h-10 animate-spin text-primary mb-4" />
        <p>Gerando relatório...</p>
      </div>

      <template v-else-if="report">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <div class="flex items-center justify-between pb-2">
              <span class="text-sm font-medium text-muted-foreground">Total de Tarefas</span>
              <ListTodo class="w-4 h-4 text-muted-foreground" />
            </div>
            <div class="text-3xl font-bold">{{ report.summary.total }}</div>
          </div>

          <div class="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <div class="flex items-center justify-between pb-2">
              <span class="text-sm font-medium text-muted-foreground">Concluídas</span>
              <CheckSquare class="w-4 h-4 text-green-500" />
            </div>
            <div class="text-3xl font-bold text-green-500">{{ report.summary.completed }}</div>
          </div>

          <div class="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <div class="flex items-center justify-between pb-2">
              <span class="text-sm font-medium text-muted-foreground">Pendentes</span>
              <Clock class="w-4 h-4 text-yellow-500" />
            </div>
            <div class="text-3xl font-bold text-yellow-500">{{ report.summary.pending }}</div>
          </div>

          <div class="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <div class="flex items-center justify-between pb-2">
              <span class="text-sm font-medium text-muted-foreground">Taxa de Conclusão</span>
              <TrendingUp class="w-4 h-4 text-primary" />
            </div>
            <div class="text-3xl font-bold text-primary">{{ report.summary.completionPercentage }}%</div>
            <div class="w-full bg-muted rounded-full h-1.5 mt-3">
              <div class="bg-primary h-1.5 rounded-full" :style="`width: ${report.summary.completionPercentage}%`"></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div class="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div class="px-6 py-5 border-b border-border flex items-center gap-2">
              <PieChart class="w-5 h-5 text-primary" />
              <h3 class="font-semibold">Progresso por Categoria</h3>
            </div>
            <div class="p-6 space-y-6 flex-1">
              <div v-if="report.byCategory.length === 0" class="text-center text-muted-foreground py-10">
                Nenhuma categoria encontrada neste período.
              </div>
              
              <div v-for="cat in report.byCategory" :key="cat.category" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-medium">{{ cat.category }}</span>
                  <span class="text-muted-foreground">{{ cat.completed }} de {{ cat.total }} ({{ cat.completionPercentage }}%)</span>
                </div>
                <div class="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div class="bg-primary h-2.5 rounded-full transition-all duration-500" :style="`width: ${cat.completionPercentage}%`"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div class="px-6 py-5 border-b border-border flex items-center gap-2">
              <Activity class="w-5 h-5 text-primary" />
              <h3 class="font-semibold">Atividade Recente</h3>
            </div>
            <div class="p-6 flex flex-col gap-6">
              <div class="bg-muted/50 rounded-lg p-4 border border-border">
                <span class="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Período Analisado</span>
                <span class="font-medium text-foreground">{{ report.recentActivity.period }}</span>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <ListTodo class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-semibold text-foreground">{{ report.recentActivity.created }}</p>
                  <p class="text-sm text-muted-foreground">Novas tarefas criadas</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                  <CheckSquare class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-semibold text-foreground">{{ report.recentActivity.completed }}</p>
                  <p class="text-sm text-muted-foreground">Tarefas finalizadas</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>
      
    </div>
  </AppLayout>
</template>
