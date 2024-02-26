import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '../store/mapStore'

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
    let map = new mapbox.Map({
      container: container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
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
