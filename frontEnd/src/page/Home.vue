<script setup lang="ts">
import { computed } from 'vue'
import AsideMenu from '../feature/aside-menu/AsideMenu.vue'
import { useKeepAliveStore } from '../store/keepActiveStore'

interface Props {
  header: string
}
defineProps<Props>()

const keepAliveStore = useKeepAliveStore()
const keepAliveComponents = computed(() => {
  return keepAliveStore.getKeepAliveComponent()
})

// const handleClick = async () => {
//   fetch('https://typhoon.slt.zj.gov.cn/Api/TyhoonActivity', {
//     method: 'GET',
//   }).then((res) => {
//     console.log(res.status)
//     console.log(res.headers)
//   })
// }
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-white text-xl">
    <!-- <div
      class="h-12 leading-[3rem] text-xl text-white tracking-widest pl-4 bg-[#134d8c]"
      @click="handleClick"
    >
      {{ header }}
    </div> -->
    <div class="flex flex-auto flex-row bg-[rgb(6,22,50)]">
      <div class="flex flex-col bg-red-300">
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
