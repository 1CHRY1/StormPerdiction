// stores/counter.js
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useModelStore = defineStore('model', {
  state: () => {
    const modelID: Ref<string | null> = ref(null)
    const modelProgress: Ref<number> = ref(0)
    const modelStatus: Ref<'running' | 'finish' | 'no'> = ref('no')

    function reset() {
      modelID.value = null
      modelProgress.value = 0
      modelStatus.value = 'no'
    }

    function run(id: string) {
      modelID.value = id
      modelProgress.value = 0
      modelStatus.value = 'running'
    }

    function finish() {
      modelStatus.value = 'finish'
    }
    return { modelID, modelProgress, modelStatus, reset, run, finish }
  },
  persist: true,
})
