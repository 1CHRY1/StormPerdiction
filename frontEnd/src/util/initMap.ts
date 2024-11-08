import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '../store/mapStore'
import mapboxgl from 'mapbox-gl'
import {styleLight, styleDark} from './mapStyleJson'

mapbox.accessToken =
  'pk.eyJ1IjoibnVqYWJlc2xvbyIsImEiOiJjbGp6Y3czZ2cwOXhvM3FtdDJ5ZXJmc3B4In0.5DCKDt0E2dFoiRhg3yWNRA'

export const initMap = async (
  container: HTMLDivElement,
  {
    center,
    zoom,
  }: {
    center: [number, number]
    zoom: number
  },
) => {
  const map = (await new Promise((resolve) => {
    // container.style.backgroundColor = 
    const map = new mapbox.Map({
      container,
      // style: 'mapbox://styles/nujabesloo/clvdqkwi600xf01rjha1k0etv',
      style: styleDark.styleJson as any,
      center,
      zoom,
      projection: 'mercator' as any,
    })

    // map.addControl(
    //   new MapboxLanguage({
    //     defaultLanguage: 'zh-Hans',
    //   }),
    // )

    map.on('load', async () => {
      resolve(map)
    })
  })) as mapbox.Map

  useMapStore().map = map

  return map
}


export const initM = async (mapdom: HTMLDivElement) => {

  const GPUFrame = document.querySelector('#GPUFrame')

  const map = (await new Promise((resolve) => {
    scr.StartDash().then(() => {
      let mapp = new ScratchMap({
        // style: 'mapbox://styles/nujabesloo/clvdqkwi600xf01rjha1k0etv',
        style: styleDark.styleJson as any,
        center: [120.55, 32.08],
        projection: 'mercator',
        GPUFrame: GPUFrame,
        container: mapdom,
        antialias: true,
        maxZoom: 18,
        zoom: 6.5,
      }).on('load', async () => {
        console.log('map load');
        resolve(mapp)
      })
    })
  })) as mapbox.Map
  useMapStore().map = map

  return map
}