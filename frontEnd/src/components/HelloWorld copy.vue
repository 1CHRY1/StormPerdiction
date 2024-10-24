<template>
  <div id="map" ref="mapRef">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita, excepturi?</div>
</template>

<script setup lang="ts">
import { onMounted, ref} from 'vue'




onMounted(async () => {


})


</script>

<style>
.tide-line-chart-block {
  position: absolute;
  bottom: 3.3vh;
  left: .5vw;
  z-index: 3;
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
</style>
