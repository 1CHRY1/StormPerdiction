<script setup>

import { onMounted } from 'vue'
import { viewing } from './map';
import { init, tickRender, main } from './originWaterDif.js'
import axios from 'axios'


onMounted(async () => {

  // const response = await fetch(`/api/v1/data/nc/txt?time=${time}`)


  // /data/nc/field/wind/json?name=new_windfield.json
  // /data/nc/field/flow/json?name=new_flowfield.json
  // /data/nc/field/add/json?name=zetaTri_1.json
  // /data/nc/field/flow/pic?name=mask_0.png
  // /data/nc/field/wind/pic?name=mask_0.png
  // const url = `/api/v1/data/nc/field/flow/pic?name=mask_0.png`
  // const url2 = `/api/v1/data/nc/field/flow/pic?name=projection_mapbox.png`
  // const url3 = `/api/v1/data/nc/field/flow/pic?name=uv_0.png`

  //9711 api test
  const url = [
    `/api/v1/data/nc/field/flow/9711/json?name=flow_field_description.json`,
    `/api/v1/data/nc/field/wind/9711/json?name=flow_field_description.json`,
    `/api/v1/data/nc/field/add/9711/json?name=contour_23.geojson`,
    `/api/v1/data/nc/field/add/9711/pic?name=addWater_23.png`,
    `/api/v1/data/nc/field/flow/9711/pic?name=mask_0.png`,
    `/api/v1/data/nc/field/flow/9711/pic?name=uv_0.png`,
    `/api/v1/data/nc/field/wind/9711/pic?name=mask_0.png`,
    `/api/v1/data/nc/field/wind/9711/pic?name=uv_0.png`,

  ]



  const jsonAPITest = (url3) => {
    const json = axios.get(url3).then((res) => {
      console.log(`${url3} response is ::`, res.data)
      return res.data
    }).catch((e) => {
      console.error('ERRRO::', e)
    })

  }

  const textureAPITest = (url3) => {
    fetch(url3)
      .then(response => response.blob())
      .then(blob => createImageBitmap(blob, { imageOrientation: "none", premultiplyAlpha: "none", colorSpaceConversion: "default" }))
      .then(imageBitmap => {
        console.log(url3, imageBitmap);
      })
      .catch(error => console.error(`Error loading image (url: ${url3})`, error));
  }

  // jsonAPITest(url[0])
  // jsonAPITest(url[1])
  // jsonAPITest(url[2])
  // textureAPITest(url[3])
  // textureAPITest(url[4])
  // textureAPITest(url[5])
  // textureAPITest(url[6])
  // textureAPITest(url[7])




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

  <div class='adwtLegend'>
    <p>风暴增水(m)</p>
    <div class = 'localFlex'>
      <div class='rampColor'></div>
      <div class="lable">
        <p>1</p>
        <p>1</p>
        <p>1</p>
      </div>
    </div>
  </div>
</template>

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
  display:flex;
  flex-direction: row;
  justify-content:space-around;
}

.lable{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 150px;
  background:  rgba(95, 158, 160, 0.372);
}

.lable>p{

}

.rampColor {
  width: 30px;
  height: 150px;
  margin-right: 10px;
  margin-left: 10px;
  background: rgb(9, 1, 145);
  background: linear-gradient(0deg, rgba(9, 1, 145, 1) 0%, rgba(70, 184, 3, 1) 50%, rgba(255, 0, 0, 1) 100%);
}


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
