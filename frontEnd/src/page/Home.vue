<script setup lang="ts">
interface Props {
  header: string
}
defineProps<Props>()

import { computed } from 'vue'
import AsideMenu from '../feature/aside-menu/AsideMenu.vue'
import { useKeepAliveStore } from '../store/keepActiveStore'
import { useStationStore } from '../store/stationStore'

const keepAliveStore = useKeepAliveStore()
const keepAliveComponents = computed(() => {
  return keepAliveStore.getKeepAliveComponent()
})

const handleClick = async () => {
  const a = useStationStore().currentStationID
  console.log(a)
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-white">
    <div
      @click="handleClick"
      class="h-12 leading-[3rem] text-xl text-white tracking-widest pl-4 bg-blue-500"
    >
      {{ header }}
    </div>
    <div class="flex flex-auto flex-row bg-pink-200">
      <div class="flex flex-col bg-red-300 w-[280px]">
        <AsideMenu class="h-full"></AsideMenu>
      </div>
      <div class="relative flex-auto">
        <router-view v-slot="{ Component }">
          <keep-alive :include="keepAliveComponents">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>
