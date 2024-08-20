<template>
  <div id="map" ref="mapRef"></div>
  <canvas id="GPUFrame"></canvas>
  <div class="tide-line-chart-block">
    <tideLineChart></tideLineChart>
  </div>
</template>

<script setup>

import { onMounted, ref, reactive, watch, computed, watchEffect } from 'vue'
import { initScrMap } from '../util/initMap';
import tideLineChart from './tideLineChart.vue';

const mapRef = ref(null)

onMounted(async() => {
  const map= await initScrMap(mapRef.value, [120.55, 32.08], 6.5)
})



</script>

<style>
.tide-line-chart-block {
  position: absolute;
  bottom: 3vh;
  left: 20vw;
  z-index: 3;
}

#GPUFrame {
  z-index: 1;
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
}

#map {
  z-index: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
}
</style>
