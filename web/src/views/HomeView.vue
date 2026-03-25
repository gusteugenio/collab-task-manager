<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { Sun, Moon, LayoutDashboard, RefreshCw, Users, PieChart, ArrowRight, Github, Linkedin, Mail, Phone } from 'lucide-vue-next'

const authStore = useAuthStore()
const uiStore = useUiStore()
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans transition-colors duration-300">
    <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <RouterLink to="/" class="flex items-center gap-2 text-2xl font-black tracking-tighter">
            <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <LayoutDashboard class="w-5 h-5" />
            </div>
            <span>Collab<span class="text-primary">Task</span></span>
          </RouterLink>
          <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#solucao" class="hover:text-primary transition-colors">Solução</a>
            <a href="#features" class="hover:text-primary transition-colors">Recursos</a>
            <a href="#contato" class="hover:text-primary transition-colors">Contato</a>
          </nav>
        </div>
        
        <div class="flex items-center gap-4">
          <button @click="uiStore.toggleTheme()" class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <Moon v-if="!uiStore.isDark" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5" />
          </button>
          
          <template v-if="!authStore.isAuthenticated">
            <RouterLink to="/login" class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              Entrar
            </RouterLink>
            <RouterLink to="/register" class="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-md transition-all shadow-lg shadow-primary/25">
              Começar grátis
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/dashboard" class="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-md transition-all">
              Meu Dashboard
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <section id="solucao" class="relative pt-20 pb-32 overflow-hidden bg-background">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        
        <div class="container mx-auto px-4 text-center max-w-5xl relative z-10">
          <h1 class="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Organize suas tarefas <br class="hidden sm:block" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              sem complicação
            </span>
          </h1>
          <p class="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A plataforma definitiva para gerenciar projetos, colaborar em tempo real e acompanhar o progresso da sua equipe de forma visual e intuitiva.
          </p>
          <div class="flex justify-center mb-16 relative z-20">
            <RouterLink v-if="!authStore.isAuthenticated" to="/register" class="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium px-8 py-4 rounded-full transition-all shadow-xl shadow-primary/30 hover:-translate-y-1">
              Começar grátis <ArrowRight class="w-5 h-5" />
            </RouterLink>
            <RouterLink v-else to="/dashboard" class="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium px-8 py-4 rounded-full transition-all shadow-xl shadow-primary/30 hover:-translate-y-1">
              Acessar painel <ArrowRight class="w-5 h-5" />
            </RouterLink>
          </div>

          <div class="relative mx-auto w-full max-w-4xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col z-0">
            <div class="h-10 border-b border-border bg-muted/50 flex items-center px-4 gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div class="p-6 grid grid-cols-4 gap-6 text-left h-[400px] bg-background">
              <div class="col-span-1 space-y-4 border-r border-border pr-6">
                <div class="h-8 w-full bg-muted rounded-md mb-8"></div>
                <div class="h-4 w-3/4 bg-primary/20 rounded-md"></div>
                <div class="h-4 w-1/2 bg-muted rounded-md"></div>
                <div class="h-4 w-2/3 bg-muted rounded-md"></div>
              </div>
              <div class="col-span-3 grid grid-cols-3 gap-4">
                <div class="bg-muted/30 rounded-lg p-4 space-y-4">
                  <div class="h-4 w-20 bg-primary/40 rounded-full mb-6"></div>
                  <div class="h-20 w-full bg-card border border-border rounded-md shadow-sm"></div>
                  <div class="h-20 w-full bg-card border border-border rounded-md shadow-sm"></div>
                </div>
                <div class="bg-muted/30 rounded-lg p-4 space-y-4">
                  <div class="h-4 w-20 bg-yellow-500/40 rounded-full mb-6"></div>
                  <div class="h-20 w-full bg-card border border-border rounded-md shadow-sm"></div>
                </div>
                <div class="bg-muted/30 rounded-lg p-4 space-y-4">
                  <div class="h-4 w-20 bg-green-500/40 rounded-full mb-6"></div>
                  <div class="h-20 w-full bg-card border border-border rounded-md shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="py-24">
        <div class="container mx-auto px-4 max-w-6xl">
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors shadow-sm">
              <div class="w-12 h-12 bg-primary/10 dark:bg-primary/25 text-primary rounded-xl flex items-center justify-center mb-6">
                <LayoutDashboard class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-bold mb-2">Boards organizados</h3>
              <p class="text-muted-foreground text-sm">
                Crie quadros, categorize por status ou etiquetas e mantenha a visão geral do projeto sempre clara.
              </p>
            </div>

            <div class="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors shadow-sm">
              <div class="w-12 h-12 bg-primary/10 dark:bg-primary/25 text-primary rounded-xl flex items-center justify-center mb-6">
                <RefreshCw class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-bold mb-2">Atualizações automáticas</h3>
              <p class="text-muted-foreground text-sm">
                Seu board sempre atualizado. As mudanças da equipe aparecem automaticamente para você.
              </p>
            </div>

            <div class="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors shadow-sm">
              <div class="w-12 h-12 bg-primary/10 dark:bg-primary/25 text-primary rounded-xl flex items-center justify-center mb-6">
                <Users class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-bold mb-2">Colaboração em equipe</h3>
              <p class="text-muted-foreground text-sm">
                Compartilhe tarefas específicas. Apenas colaboradores autorizados podem visualizar e editar o card.
              </p>
            </div>

            <div class="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors shadow-sm">
              <div class="w-12 h-12 bg-primary/10 dark:bg-primary/25 text-primary rounded-xl flex items-center justify-center mb-6">
                <PieChart class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-bold mb-2">Progresso visual</h3>
              <p class="text-muted-foreground text-sm">
                Acompanhe indicadores de desempenho e gráficos de relatórios simples integrados ao seu dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div class="container mx-auto px-4 text-center max-w-2xl relative z-10">
          <h2 class="text-4xl font-bold mb-6">Pronto para transformar sua produtividade?</h2>
          <p class="text-lg mb-10 text-primary-foreground/80">
            Junte-se agora e descubra como o foco na colaboração pode acelerar as entregas do seu time.
          </p>
          <RouterLink v-if="!authStore.isAuthenticated" to="/register" class="inline-block bg-background text-primary text-lg font-bold px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-transform relative z-20">
            Comece agora gratuitamente
          </RouterLink>
        </div>
      </section>
    </main>

    <footer id="contato" class="bg-card border-t border-border py-12">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div>
            <div class="flex items-center gap-2 text-xl font-bold mb-4">
              <div class="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                <LayoutDashboard class="w-3 h-3" />
              </div>
              CollabTask
            </div>
            <p class="max-w-xs text-sm text-muted-foreground">
              Construído para simplificar a gestão de tarefas e potencializar equipes através da colaboração.
            </p>
          </div>
          
          <div class="text-center md:text-right">
            <h4 class="font-bold mb-4">Desenvolvido por Gustavo Eugênio</h4>
            <div class="space-y-3 flex flex-col text-sm text-muted-foreground">
              <a href="https://github.com/gusteugenio" target="_blank" class="flex items-center gap-2 hover:text-primary transition-colors">
                <Github class="w-5 h-5 text-zinc-600" />
                <span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/gusteugenio/" target="_blank" class="flex items-center gap-2 hover:text-primary transition-colors">
                <Linkedin class="w-5 h-5 text-zinc-600" />
                <span>LinkedIn</span>
              </a>
              <a href="mailto:gustavoeugenio297@gmail.com" class="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail class="w-5 h-5 text-zinc-600" />
                <span>gustavoeugenio297@gmail.com</span>
              </a>
              <div class="flex items-center gap-2">
                <Phone class="w-5 h-5 text-zinc-600" />
                <span>(18) 99659-3525</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          &copy; {{ new Date().getFullYear() }} CollabTask. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  </div>
</template>
