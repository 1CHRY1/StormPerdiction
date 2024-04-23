<script setup lang="ts">
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, onMounted, ref } from 'vue'
import { router } from '../../router'
import { useStationStore } from '../../store/stationStore'
import { initMap } from '../../util/initMap'
// import AccuracyGraph from './AccuracyGraph.vue'
import { addLayer } from './util'

const stationStore = useStationStore()
const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)
const isPopup: Ref<boolean> = ref(false)
const x: Ref<number> = ref(0)
const y: Ref<number> = ref(0)

onMounted(async () => {
  const map: mapbox.Map = await initMap(
    mapContainerRef.value as HTMLDivElement,
    {
      center: [120.55, 32.08],
      zoom: 6.5,
    },
  )
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
        router.push('/accuracy-assessment/data')
      }
    }
  })

  map.on('mousemove', 'stations', (event: mapbox.MapMouseEvent) => {
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
        isPopup.value = true
        x.value = event.point.x
        y.value = event.point.y
      }
    }
  })

  map.on('mouseleave', 'stations', () => {
    isPopup.value = false
  })
})
</script>

<template>
  <div class="relative h-full w-full">
    <!-- <div
      class="absolute w-[500px] h-[400px] bg-white bg-opacity-20 p-2 rounded border border-black"
      :style="{
        zIndex: isPopup ? '10' : '-10',
        top: `${y - 450}px`,
        left: `${x - 350}px`,
      }"
    >
      <AccuracyGraph v-model="isPopup" class="bg-blue-300 bg-opacity-30"></AccuracyGraph>
    </div> -->
    <div ref="mapContainerRef" class="map-container h-full w-full" />
  </div>
</template>
