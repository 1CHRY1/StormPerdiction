import mapboxgl, { Map } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FlowLayer, WindLayer } from './LayerFromWebGPU'

// import FlowLayer from './flowlayer-mapbox'
// import WindLayer from './windlayer-mapbox'

// import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js'

export function viewing() {
  // let stats

  mapboxgl.accessToken =
    'pk.eyJ1IjoieWNzb2t1IiwiYSI6ImNrenozdWdodDAza3EzY3BtdHh4cm5pangifQ.ZigfygDi2bK4HXY1pWh-wg'

  let ORIGIN = [121.49614, 25.056555, -20]

  var map = new Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/light-v9', // style URL
    style: 'mapbox://styles/ycsoku/cldjl0d2m000501qlpmmex490', // style URL
    // style: 'mapbox://styles/ycsoku/clrjfv4jz00pe01pdfxgshp6z',
    center: [120.980697, 32.684162], // starting position [lng, lat]
    zoom: 5,
    maxZoom: 20,
    antialias: true,
    projection: 'mercator',
  })

  map.on('load', () => {
    ////// main //////////
    map.addLayer(new FlowLayer())
    // map.addLayer(new WindLayer())
  })

  map.on('render', () => {
    // stats?.update()
  })
}
