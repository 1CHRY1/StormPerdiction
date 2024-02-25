<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css'
import { ref } from 'vue'
import MapView from './MapView.vue'

const currentComponent = ref('map')
</script>

<template>
  <!-- <div
    v-if="stationInfoPopup"
    class="h-72 w-64 bg-white absolute m-2 top-2 right-2 border-2 rounded-xl border-zinc-300 z-10 shadow"
  >
    <div
      class="flex h-10 leading-10 tracking-widest justify-center my-0.5 text-xl"
    >
      {{ `${stationInfo.name}` }}
    </div>
    <div class="h-[1px] bg-zinc-600"></div>
    <div class="mx-3 my-2 flex flex-col">
      <div class="my-1">
        <span class="inline-block pr-2">当前时间:</span>
        <span class="inline-block pr-3">{{ stationInfo.time }}</span>
      </div>
      <div class="my-1">
        <span class="inline-block pr-2">站点位置:</span>
        <span class="inline-block pr-3">{{ stationInfo.lon }}</span
        ><span>{{ stationInfo.lat }}</span>
      </div>
      <div class="my-1">
        <span class="inline-block pr-2">当前潮位:</span>
        <span class="inline-block pr-3">{{ stationInfo.lon }}</span
        ><span>{{ stationInfo.lat }}</span>
      </div>
    </div>
  </div> -->
  <KeepAlive>
    <MapView current-component="currentComponent"></MapView>
  </KeepAlive>
</template>
