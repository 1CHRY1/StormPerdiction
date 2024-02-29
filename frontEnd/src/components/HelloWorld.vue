<script setup>

import { onMounted } from 'vue'
import { viewing } from './map';
import { init, tickRender, main } from './originWaterDif.js'
import axios from 'axios'


onMounted(async () => {

  // const response = await fetch(`/api/v1/data/nc/txt?time=${time}`)
  const res = await axios.get(`/api/v1/data/nc/field/flow/json?name=new_flowfield.json`)
  console.log("interfaceParser::", res.data);
  // /data/nc/field/wind/json?name=new_windfield.json
  // /data/nc/field/flow/json?name=new_flowfield.json
  // /data/nc/field/add/json?name=zetaTri_1.json
  // /data/nc/field/flow/pic?name=mask_0.png
  // /data/nc/field/wind/pic?name=mask_0.png
  const url = `/api/v1/data/nc/field/flow/pic?name=mask_0.png`
  const url2 = `/api/v1/data/nc/field/flow/pic?name=projection_mapbox.png`
  const url3 = `/api/v1/data/nc/field/flow/pic?name=uv_0.png`


  fetch(url3)
    .then(response => response.blob())
    .then(blob => createImageBitmap(blob, { imageOrientation: "none", premultiplyAlpha: "none", colorSpaceConversion: "default" }))
    .then(imageBitmap => {
      console.log(url3, imageBitmap);
    })
    .catch(error => console.error(`Error loading image (url: ${url})`, error));

  // viewing()


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
