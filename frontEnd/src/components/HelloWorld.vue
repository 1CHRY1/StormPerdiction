<script setup>

import { onMounted } from 'vue'
// import { init, tickRender, main } from './originWaterDif.js'
import axios from 'axios'
import { main } from './layers/main'


onMounted(async () => {
  console.log('hellop');
  main()
  // let typhURL = `/api/v1/data/level/typh`
  // let myres = (await axios.get(typhURL))
  // console.log(myres.data.data);


})

</script>

<template>
  <div id="map"></div>
  <canvas id="WebGPUFrame"></canvas>

  <!-- <div class='adwtLegend'>
    <p>风暴增水(m)</p>
    <div class='localFlex'>
      <div class='rampColor'></div>
      <div class="lable">
        <p>1</p>
        <p>1</p>
        <p>1</p>
      </div>
    </div>
  </div> -->
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


#WebGPUFrame {
  z-index: 1;
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
