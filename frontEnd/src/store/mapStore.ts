// stores/counter.js
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const map: Ref<null | mapboxgl.Map> = ref(null)
  return { map }
})
