// stores/counter.js
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useStationStore = defineStore('station', () => {
  const currentStationID: Ref<string> = ref('0')
  function reset() {
    currentStationID.value = '0'
  }
  return { currentStationID, reset }
})
