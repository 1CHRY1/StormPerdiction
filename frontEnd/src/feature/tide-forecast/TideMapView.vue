<script setup lang="ts">
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, onMounted, ref } from 'vue'
import { router } from '../../router'
import { useStationStore } from '../../store/stationStore'
// import { useMapStore } from '../../store/mapStore'
import { initMap } from '../../util/initMap'
import radioVue from './radio.vue'
import { addLayer } from './util'
// import { FlowLayer, WaterDifLayer, WindLayer } from '../../components/LayerFromWebGPU'

const stationStore = useStationStore()
const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)

onMounted(async () => {
  const map: mapbox.Map = await initMap(
    mapContainerRef.value as HTMLDivElement,
    {
      center: [120.55, 32.08],
      zoom: 6.5,
    },
  )

  window.addEventListener('keydown', (e) => {
    if (e.key === '\\') console.log(map)
  })

  addLayer(map)

  map.on('click', (event: mapbox.MapMouseEvent) => {
    const box: [[number, number], [number, number]] = [
      [event.point.x - 3, event.point.y - 3],
      [event.point.x + 3, event.point.y + 3],
    ]

    if (map.getLayer('stations')) {
      const stations = map.queryRenderedFeatures(box, {
        layers: ['stations'],
      })
      if (stations && stations[0]) {
        const id = stations[0].properties!.id as string
        stationStore.currentStationID = id
        router.push('/tide-forecast/data')
      }
    }
  })
})
</script>

<template>
  <div ref="mapContainerRef" class="map-container h-full w-full" />
  <canvas id="WebGPUFrame" class="playground"></canvas>
  <radioVue></radioVue>
</template>

<style scoped>
#radio {
  position: absolute;
  left: 10rem;
  top: 3rem;
  /* z-index: 2; */
}

#WebGPUFrame {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  top: 0;
  pointer-events: none;
}
</style>
