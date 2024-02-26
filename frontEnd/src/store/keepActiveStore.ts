// stores/counter.js
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useKeepAliveStore = defineStore('keepAlive', () => {
  const keepAliveComponent: Ref<Set<string>> = ref(new Set())

  function getKeepAliveComponent() {
    return [...keepAliveComponent.value]
  }
  function addKeepAliveComponent(name: string) {
    keepAliveComponent.value.add(name)
  }
  function clearKeepAliveComponent() {
    keepAliveComponent.value.clear()
  }
  return {
    keepAliveComponent,
    getKeepAliveComponent,
    addKeepAliveComponent,
    clearKeepAliveComponent,
  }
})
