<script setup lang="ts">
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, onMounted, ref } from 'vue'
import { router } from '../../router'
import { useStationStore } from '../../store/stationStore'
import { initMap } from '../../util/initMap'

let stationStore = useStationStore()
const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)
const addLayer = async (map: mapbox.Map) => {
  map.addSource('stations', {
    type: 'geojson',
    data: '/geojson/tide.geojson',
    attribution: 'name',
  })

  const image = await new Promise((resolve) => {
    map.loadImage('/png/custom_marker.png', (_, image) => {
      resolve(image)
    })
  })
  map.addImage('station-marker', image as any)
  map.addLayer({
    id: 'stations',
    source: 'stations',
    type: 'symbol',
    layout: {
      'icon-image': 'station-marker',
      'icon-size': 0.6,
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 1.25],
      'text-anchor': 'top',
    },
  })
}

onMounted(async () => {
  const map = await initMap(mapContainerRef.value as HTMLDivElement, {
    center: [120, 31.5],
    zoom: 7.2,
  })
  if (map) {
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
  }
})
</script>

<template>
  <div ref="mapContainerRef" class="map-container h-full w-full" />
</template>
