import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '../store/mapStore'
import { ScratchMap } from '../components/layers/main'
import * as scr from '../components/scratch/scratch'

mapbox.accessToken =
  'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'

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
    const map = new mapbox.Map({
      container,
      style: 'mapbox://styles/johnnyt/clrldnfyk001f01q2092ndx2y',
      center,
      zoom,
      projection: 'mercator' as any,
    })

    map.addControl(
      new MapboxLanguage({
        defaultLanguage: 'zh-Hans',
      }),
    )

    map.on('load', async () => {
      resolve(map)
    })
  })) as mapbox.Map

  useMapStore().map = map

  return map
}

export const initScratchMap = async (mapdom: HTMLDivElement) => {

  const GPUFrame = document.querySelector('#GPUFrame')

  const map = (await new Promise((resolve) => {
    scr.StartDash().then(() => {
      let mapp = new ScratchMap({
        // style: 'mapbox://styles/johnnyt/clrldnfyk001f01q2092ndx2y',
        // style: "mapbox://styles/ycsoku/cldjl0d2m000501qlpmmex490",
        // accessToken: 'pk.eyJ1IjoieWNzb2t1IiwiYSI6ImNrenozdWdodDAza3EzY3BtdHh4cm5pangifQ.ZigfygDi2bK4HXY1pWh-wg',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [131, 30],
        projection: 'mercator',
        GPUFrame: GPUFrame,
        container: mapdom,
        antialias: true,
        maxZoom: 18,
        zoom: 3,
      }).on('load', async () => {
        console.log('load!!');
        
        resolve(mapp)
      })
    })
  })) as mapbox.Map

  useMapStore().map = map

  return map
}
export const initScratchMap2 = async (mapdom: HTMLDivElement) => {

  const GPUFrame = document.querySelector('#GPUFrame')

  const map = (await new Promise((resolve) => {
    scr.StartDash().then(() => {
      let mapp = new ScratchMap({
        style: 'mapbox://styles/johnnyt/clrldnfyk001f01q2092ndx2y',
        center: [120.55, 32.08],
        projection: 'mercator',
        GPUFrame: GPUFrame,
        container: mapdom,
        antialias: true,
        maxZoom: 18,
        zoom: 6.5,
      }).on('load', async () => {
        resolve(mapp)
      })


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
        style: 'mapbox://styles/mapbox/streets-v9',
        // style: 'mapbox://styles/mapbox/dark-v11',
        // style: 'mapbox://styles/johnnyt/clrldnfyk001f01q2092ndx2y',

        center: [120.55, 32.08],
        projection: 'mercator',
        GPUFrame: GPUFrame,
        container: mapdom,
        antialias: true,
        maxZoom: 18,
        zoom: 6.5,
      }).on('load', async () => {
        resolve(mapp)
      })


    })
  })) as mapbox.Map

  useMapStore().map = map

  return map
}