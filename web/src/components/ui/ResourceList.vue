<script setup lang="ts">
import { Loader2, Inbox } from 'lucide-vue-next'

defineProps<{
  items: any[]
  isLoading: boolean
  emptyMessage: string
  emptyTitle: string
}>()
</script>

<template>
  <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Loader2 class="w-10 h-10 animate-spin text-primary mb-4" />
      <p>Carregando dados...</p>
    </div>

    <div v-else-if="items.length === 0" class="text-center py-16 px-6">
      <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
        <Inbox class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-semibold text-foreground mb-1">{{ emptyTitle }}</h3>
      <p class="text-muted-foreground">{{ emptyMessage }}</p>
      <slot name="empty-action" />
    </div>

    <ul v-else class="divide-y divide-border">
      <slot />
    </ul>
  </div>
</template>
