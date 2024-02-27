<script setup>

import { onMounted } from 'vue'
import { viewing } from './map';
import { init, tickRender, main } from './originWaterDif.js'


onMounted(async () => {
  viewing()


  // const canvas = document.querySelector('#WebGPUFrame')
  // // await main(canvas)
  // await init(canvas)
  // tickRender()
})

</script>

<template>
  <div id="stats"></div>
  <div id="map" class="playground"></div>
  <canvas id="WebGPUFrame-flow" class="playground"></canvas>
  <canvas id="WebGPUFrame" class="playground"></canvas>
</template>

<style>
#WebGPUFrame {
  z-index: 1;
  pointer-events: none;
}

#WebGPUFrame-flow {
  z-index: 1;
  pointer-events: none;
}

#map {
  z-index: 0;
}

#stats {
  z-index: 2;
}

.playground {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
}
</style>
