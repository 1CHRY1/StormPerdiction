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
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'

import tideLineChart from './tideLineChart.vue';

const mapRef = ref(null)

// 吴淞潮位站
const WUSONG_geojson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "吴淞"
      },
      "geometry": {
        "coordinates": [
          121.37, 31.38
        ],
        "type": "Point"
      }
    }
  ]
}





onMounted(async () => {
  const map = await initScrMap(mapRef.value, [120.55, 32.08], 6.5)


  // const marker = new mapboxgl.Marker()
  // marker.setLngLat([121.37, 31.38]).addTo(map)

  const wusongSource = map.addSource('wusong',{
    type: 'geojson',
    data: WUSONG_geojson
  })
  const wusongPoint = map.addLayer({
    id: 'wusong',
    source: 'wusong',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#00e1ff'
    }
  })
  const wusongText = map.addLayer({
    id: 'wusongText',
    source: 'wusong',
    type:'symbol',
    layout: {
      'text-field': ['get','name'],
      'text-anchor':'bottom',
      'text-size': 14,
      'text-offset': [0,1.5]
    },
    paint:{
      'text-color':'#e4fcff'
    }
  })

  const mercator = mapboxgl.MercatorCoordinate.fromLngLat([121.37, 31.38])
  console.log(mercator)


  console.log('map added layer')

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
