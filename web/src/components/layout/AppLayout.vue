<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { 
  LayoutDashboard, CheckSquare, PieChart, LogOut, Sun, Moon, Menu 
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// garante que no mobile o menu comece fechado
onMounted(() => {
  if (window.innerWidth < 768) {
    uiStore.setSidebar(false)
  }
})
</script>

<template>
  <div class="min-h-screen bg-muted/20 flex transition-colors duration-300">
    
    <div 
      v-if="uiStore.isSidebarOpen" 
      @click="uiStore.setSidebar(false)" 
      class="md:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm transition-opacity"
    ></div>

    <aside 
      :class="[uiStore.isSidebarOpen ? 'translate-x-0' : '-translate-x-full', 'md:translate-x-0']" 
      class="w-64 bg-card border-r border-border flex flex-col fixed h-full z-30 transition-transform duration-300"
    >
      <div class="h-16 flex items-center px-6 border-b border-border">
        <RouterLink to="/" class="flex items-center gap-2 text-xl font-black tracking-tighter">
          <div class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
            <LayoutDashboard class="w-4 h-4" />
          </div>
          <span>Collab<span class="text-primary">Task</span></span>
        </RouterLink>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 mt-2 px-2">Menu</div>
        
        <RouterLink @click="uiStore.setSidebar(false)" to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors">
          <PieChart class="w-5 h-5" />
          Dashboard
        </RouterLink>
        
        <RouterLink @click="uiStore.setSidebar(false)" to="/tasks" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <CheckSquare class="w-5 h-5" />
          Minhas Tarefas
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-border">
        <div class="flex items-center gap-3 px-3 py-2 mb-4">
          <div class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-sm font-medium truncate">{{ authStore.user?.name || 'Usuário' }}</span>
            <span class="text-xs text-muted-foreground truncate">{{ authStore.user?.email || '' }}</span>
          </div>
        </div>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors font-medium">
          <LogOut class="w-5 h-5" />
          Sair da conta
        </button>
      </div>
    </aside>

    <main class="flex-1 md:ml-64 flex flex-col min-h-screen">
      
      <header class="h-16 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
        <div class="flex items-center gap-4">
          <button @click="uiStore.toggleSidebar()" class="md:hidden p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <Menu class="w-6 h-6" />
          </button>
          <h2 class="text-lg font-semibold text-foreground">Visão Geral</h2>
        </div>
        <div class="flex items-center gap-4">
          <button @click="uiStore.toggleTheme()" class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <Moon v-if="!uiStore.isDark" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5" />
          </button>
        </div>
      </header>

      <slot />

    </main>
  </div>
</template>
