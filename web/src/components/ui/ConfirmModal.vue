<script setup lang="ts">
import { X, AlertTriangle, Loader2 } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  message: string
  isLoading?: boolean
}>()

defineEmits(['close', 'confirm'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div class="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div class="p-6 text-center">
        <div class="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle class="w-6 h-6" />
        </div>
        
        <h3 class="text-lg font-bold text-foreground">{{ title }}</h3>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ message }}</p>
      </div>

      <div class="flex items-center gap-3 p-4 bg-muted/50 border-t border-border">
        <button 
          @click="$emit('close')" 
          class="flex-1 px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          :disabled="isLoading"
        >
          Cancelar
        </button>
        <button 
          @click="$emit('confirm')" 
          class="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          Excluir
        </button>
      </div>
    </div>
  </div>
</template>
