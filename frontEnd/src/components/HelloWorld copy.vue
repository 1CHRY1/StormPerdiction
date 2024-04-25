<template>
  <div id="map" ref="mapRef"></div>
  <canvas id="GPUFrame"></canvas>
  <controller :flow-progress="flowProgress" :max-particle-num="maxParticleNum" :now-particle-num="nowParticleNum"
    :now-speed="nowSpeed" :max-speed="maxSpeed" @particle-num-value="getParticleNumValue"
    @progress-value="getProgressValue" @speed-value="getSpeedValue">
  </controller>


  <timeShower :type="'9711'" :time-step="timeStep"></timeShower>
  <flowLegend :max-speed="maxSpeed" :desc="'风速(m/s)'"></flowLegend>
</template>

<script setup>

import { onMounted, ref, reactive, watch, computed, watchEffect } from 'vue'
import { initScrMap } from '../util/initMap';
import newFlow from '../components/layers/newFlow.js'
import newFlow2 from '../components/layers/newFlow_mask.js'

import timeShower from '../components/legend/timeShower.vue'
import flowLegend from './legend/flowLegend.vue';
import controller from './legend/controller.vue'
import axios from 'axios';

const mapRef = ref()
const nowParticleNum = ref(0)
const maxParticleNum = ref(0)
const nowSpeed = ref(0)
const maxSpeed = ref(0)
const flowProgress = ref(0)


let wind9711src = new Array(22)
for (let i = 0; i < 22; i++) {
  wind9711src[i] = `/ffvsrc/9711wind/uv_${16 + i}.bin`
}
let flow9711src = new Array(22)
for (let i = 0; i < 22; i++) {
  if (i * 6 < 132)
    flow9711src[i] = `/ffvsrc/9711flow/uv_${i * 6}.bin`
}
let windsrc = new Array(30)
for (let i = 0; i < 30; i++) {
  windsrc[i] = `/ffvsrc/wind/uv_${i + 10}.bin`
}
let flowsrc = new Array(30)
for (let i = 0; i < 30; i++) {
  flowsrc[i] = `/ffvsrc/flow/uv_${i + 10}.bin`
}

let testSrc = new Array(228)
for (let i = 0; i < 228; i++) {
  testSrc[i] = `/bin/uv_${i}.bin`
}

// flow9711
// let flowLayer = reactive(new lastFlow(
//   '/ffvsrc/9711flow/station.bin',
//   flow9711src,
//   url => url.match(/uv_(\d+)\.bin/)[1], 
//   '/ffvsrc/flowbound2.geojson',
// ))

// wind9711
// let flowLayer = reactive(new newFlow(
//   '/bin/station.bin',
//   ['/bin/uv_0.bin',
//   '/bin/uv_1.bin',
//   '/bin/uv_2.bin',
//   '/bin/uv_3.bin',],
//   url => url.match(/uv_(\d+)\.bin/)[1],
// ))

// flow
// let flowLayer = reactive(new lastFlow(
//   '//ffvsrc//flow//station.bin',
//   flowsrc,
//   url => url.match(/uv_(\d+)\.bin/)[1],
//   '//ffvsrc//flowbound2.geojson',
// ))
// wind
let flowLayer = reactive(new newFlow2(
  'flowlayer',
  '/bin/station.bin',
  testSrc,
  url => url.match(/uv_(\d+)\.bin/)[1],
  '/ffvsrc/windBound.geojson'
))
flowLayer.framesPerPhase = 30



const timeStep = computed(() => {
  return flowProgress.value / 100 * flowLayer.uvUrlList.length
})

watchEffect(() => {
  //progress
  let progress = flowLayer.currentResourcePointer / flowLayer.uvUrlList.length
  flowProgress.value = Math.floor(progress * 100)

  //particleNum
  nowParticleNum.value = flowLayer.particleNum.n
  maxParticleNum.value = flowLayer.maxParticleNum

  nowSpeed.value = flowLayer.speedFactor.n
  maxSpeed.value = 10.0

})




onMounted(async () => {
  const map = await initScrMap(mapRef.value, [120.55, 32.08], 6.5)

  map.addLayer(flowLayer)
  console.log('map added layer')

})


const getProgressValue = (e) => {
  flowProgress.value = e
  flowLayer.setProgress(flowProgress.value)
}
const getParticleNumValue = (e) => {
  nowParticleNum.value = e
  flowLayer.particleNum.n = e;
}
const getSpeedValue = (e) => {
  nowSpeed.value = e
  flowLayer.speedFactor.n = e;
}

</script>

<style>
.adwtLegend {
  width: 120px;
  height: 200px;
  background-color: rgba(95, 158, 160, 0.372);
}

.adwtLegend>p {
  font-size: 18px;
  color: aliceblue;
  font-weight: bold;
  padding: 5px;
  text-align: center;
  line-height: 20px;
}

.localFlex {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.lable {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 150px;
  background: rgba(95, 158, 160, 0.372);
}

.lable>p {}

.rampColor {
  width: 30px;
  height: 150px;
  margin-right: 10px;
  margin-left: 10px;
  background: rgb(9, 1, 145);
  background: linear-gradient(0deg, rgba(9, 1, 145, 1) 0%, rgba(70, 184, 3, 1) 50%, rgba(255, 0, 0, 1) 100%);
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

#stats {
  z-index: 2;
}
</style>
