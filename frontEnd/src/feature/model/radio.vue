<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import { onMounted, ref, watch } from 'vue'
import {
  FlowLayer,
  WaterDifLayer,
  WindLayer,
} from '../../components/LayerFromWebGPU'
import { useMapStore } from '../../store/mapStore'

const mapstore = useMapStore()
const radio = ref()
const IDMap: any = {
  流场: 'FlowLayer',
  风场: 'WindLayer',
  增水场: 'WaterDifLayer',
}

// let map:mapboxgl.Map
// let flowLayer
// let windLayer
// let waterDifLayer

onMounted(() => {
  // flowLayer = new FlowLayer()
  // windLayer = new WindLayer()
  // waterDifLayer = new WaterDifLayer()
  // window.addEventListener('keydown', (e) => {
  //   if (e.key === 'Enter') {
  //     console.log(mapstore.map?.getStyle().layers)
  //   }
  // })
})

const myRemoveLayer = (map: mapboxgl.Map, id: string) => {
  if (id && map.getLayer(id)) {
    map.removeLayer(id)
  }

}
const myAddLayer = (map: mapboxgl.Map, layer: mapboxgl.AnyLayer) => {
  if (map.loaded()) {
    // console.log('add layer', layer.id)
    map.addLayer(layer)

  }

}

watch(radio, (newV, oldV) => {
  if (mapstore.map && mapstore.map?.loaded()) {
    // console.log(IDMap[newV])
    switch (newV) {
      case '风场':
        console.log('加载风场')
        myAddLayer(mapstore.map, new WindLayer() as mapboxgl.AnyLayer)
        break
      case '流场':
        console.log('加载流场')
        myAddLayer(mapstore.map, new FlowLayer() as mapboxgl.AnyLayer)
        break
      case '增水场':
        console.log('加载增水场')
        myAddLayer(mapstore.map, new WaterDifLayer() as mapboxgl.AnyLayer)
        break
      default:
        console.log('do nothing')
    }
    // console.log(mapstore.map.getLayer('WaterDifLayer'))
    myRemoveLayer(mapstore.map, IDMap[oldV])
    // console.log(mapstore.map.getLayer('WaterDifLayer'))
  }
})
</script>

<template>
  <div id="radio">
    <el-radio-group v-model="radio" size="large">
      <el-radio-button label="流场" />
      <el-radio-button label="风场" />
      <el-radio-button label="增水场" />
    </el-radio-group>
  </div>
</template>

<style scoped>

#radio{
  z-index: 2;
}
</style>
