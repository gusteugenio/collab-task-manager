<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'
import { LayoutDashboard, Loader2, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    
    await authStore.login({ email: email.value, password: password.value })
    router.push('/dashboard')
    
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Erro ao criar conta. Verifique os dados e tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

    <div class="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 relative z-10">
      <div class="flex flex-col items-center mb-8">
        <RouterLink to="/" class="flex items-center gap-2 text-2xl font-black tracking-tighter mb-6">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <LayoutDashboard class="w-5 h-5" />
          </div>
          <span>Collab<span class="text-primary">Task</span></span>
        </RouterLink>
        <h1 class="text-2xl font-bold text-foreground">Crie sua conta</h1>
        <p class="text-muted-foreground text-sm mt-1">Comece a organizar suas tarefas agora mesmo</p>
      </div>

      <div v-if="errorMessage" class="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
        <AlertCircle class="w-4 h-4 flex-shrink-0" />
        <p>{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Nome completo</Label>
          <Input id="name" type="text" placeholder="Seu nome" v-model="name" required />
        </div>

        <div class="space-y-2">
          <Label for="email">E-mail</Label>
          <Input id="email" type="email" placeholder="usuario@gmail.com" v-model="email" required />
        </div>
        
        <div class="space-y-2">
          <Label for="password">Senha</Label>
          <Input id="password" type="password" placeholder="Mínimo de 6 caracteres" v-model="password" minlength="6" required />
        </div>

        <Button type="submit" class="w-full mt-2" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          {{ isLoading ? 'Criando conta...' : 'Cadastrar' }}
        </Button>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        Já tem uma conta? 
        <RouterLink to="/login" class="text-primary font-medium hover:underline">
          Fazer login
        </RouterLink>
      </div>
    </div>
  </div>
</template>
