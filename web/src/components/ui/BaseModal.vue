<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
}>()

defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div class="bg-card border border-border rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <div class="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 class="text-lg font-semibold text-foreground">{{ title }}</h2>
        <button @click="$emit('close')" class="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6">
        <slot />
      </div>

    </div>
  </div>
</template>
