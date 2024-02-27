import mapboxgl, { Map } from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css'
// import { DEMLayer } from "./demLayer.js"
import FlowLayer from "./flowlayer-mapbox.js"
import WaterDifLayer from "./waterDifLayer-mapbox.js"


// import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js'

export function viewing() {

    // let stats

    mapboxgl.accessToken = 'pk.eyJ1IjoieWNzb2t1IiwiYSI6ImNrenozdWdodDAza3EzY3BtdHh4cm5pangifQ.ZigfygDi2bK4HXY1pWh-wg';

    let ORIGIN = [121.496140, 25.056555, -20];

    var map = new Map({
        container: 'map',
        // style: 'mapbox://styles/mapbox/light-v9', // style URL
        style: "mapbox://styles/ycsoku/cldjl0d2m000501qlpmmex490", // style URL
        // style: 'mapbox://styles/ycsoku/clrjfv4jz00pe01pdfxgshp6z',
        center: [120.980697, 32.684162], // starting position [lng, lat]
        zoom: 5,
        maxZoom: 20,
        antialias: true,
        projection: 'mercator'
    })

    map.on('load', () => {

        // const container = document.getElementById('stats');
        // stats = new Stats()
        // container.appendChild(stats.dom)

        // map.addSource('mapbox-dem', {
        // 'type': 'raster-dem',
        // 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        // 'tileSize': 512,
        // 'maxzoom': 16
        // });

        // map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 3.0 });

        // map.addLayer({
        //     'id': 'bridge-column',
        //     'type': 'fill-extrusion',
        //     'source': {
        //         'type': 'geojson',
        //         'data': '/json/bridgeColumn.geojson',
        //     },
        //     'paint': {
        //         'fill-extrusion-color': "#aaaabb",  
        //         'fill-extrusion-height': 65,
        //         'fill-extrusion-opacity': 1.0
        //     },
        // })

        // map.addLayer({
        //     'id': 'bridge-surf',
        //     'type': 'fill-extrusion',
        //     'source': {
        //         'type': 'geojson',
        //         'data': '/json/bridgeSurf.geojson',
        //     },
        //     'paint': {
        //         'fill-extrusion-color': "#aaaabb",  
        //         'fill-extrusion-height': 80,
        //         'fill-extrusion-base': 65,
        //         'fill-extrusion-opacity': 1.0
        //     },
        // })


        map.addLayer(new WaterDifLayer())
        // map.addLayer(new DEMLayer())
        // window.addEventListener('keydown', (e) => {
        //     console.log(e);
        //     if (e.key == 'Enter')
        //         map.addLayer(new FlowLayer())
        // })

    })

    map.on('render', () => {

        // stats?.update()
    })
}