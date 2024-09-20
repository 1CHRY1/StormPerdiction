<template>
  <div id="map" ref="mapRef"></div>
</template>

<script setup lang="ts">

import { onMounted, ref, reactive, watch, computed, watchEffect } from 'vue'
import { initMap } from '../util/initMap';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'

import FlowLayer from './webgl/flowLayerWithMask';
import { config_9711wind } from './webgl/config'
const mapRef = ref(null)




onMounted(async () => {
  const map = await initMap(mapRef.value!, { center: [120.55, 32.08], zoom: 6.5, })


  const flowLayer = new FlowLayer(config_9711wind)


  window.addEventListener('keydown', async (e) => {
    if (e.key === '7') {
      await flowLayer.setProgress(70)
    } else if (e.key === '3') {
      await flowLayer.setProgress(30)
    }
  })



  map.addLayer(flowLayer)

})


</script>

<style>
.tide-line-chart-block {
  position: absolute;
  bottom: 3.3vh;
  left: .5vw;
  z-index: 3;
}

#GPUFrame {
  z-index: 5;
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
