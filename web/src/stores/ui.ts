import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isSidebarOpen = ref(true)

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function setSidebar(value: boolean) {
    isSidebarOpen.value = value
  }

  return { isSidebarOpen, toggleSidebar, setSidebar }
})
