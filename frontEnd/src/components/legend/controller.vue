<template>
    <div class="controller">
        <div class="header">控制面板</div>
        <div class="content">
            <particleNumBar :nowParticleNum="nowParticleNum" :maxParticleNum="maxParticleNum"
                @particle-num-value="getParticleNumValue"></particleNumBar>
            <speedBar :now-speed="nowSpeed" :max-speed="maxSpeed" @speed-value="getSpeedValue"></speedBar>
            <progressBar @progress-value="getProgressValue" :progress-v="flowProgress"></progressBar>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import particleNumBar from './particleNumBar.vue'
import progressBar from './progressBar.vue'
import speedBar from './speedBar.vue'

const props = defineProps({
    nowParticleNum: Number,
    maxParticleNum: Number,
    nowSpeed: Number,
    maxSpeed: Number,
    flowProgress: Number
})

const emits = defineEmits(['particle-num-value', 'progress-value', 'speed-value'])

const nowParticleNum = computed(()=>props.nowParticleNum)
const maxParticleNum = computed(()=>props.maxParticleNum)
const nowSpeed = computed(()=>props.nowSpeed)
const maxSpeed = computed(()=>props.maxSpeed)
const flowProgress = computed(()=>props.flowProgress)

const getProgressValue = (e) => {
    flowProgress.value = e
    emits('progress-value', e)
}
const getParticleNumValue = (e) => {
    nowParticleNum.value = e
    emits('particle-num-value', e)
}
const getSpeedValue = (e) => {
    nowSpeed.value = e
    emits('speed-value', e)
}



</script>

<style scoped>
.controller {
    position: absolute;
    top: 5vh;
    right: 20vw;
    width: 19vw;
    height: 23vh;
    background: rgb(38, 38, 38);
    box-shadow: 7px 5px 10px rgba(0, 0, 0, 0.333);
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.header {
    height: 4vh;
    width: 19vw;
    font-size: calc(0.8vw + 0.8vh);
    font-weight: 600;
    text-align: center;
    line-height: 4vh;
    color: white;
    background-color: rgb(80, 104, 119)
}

.content {
    height: 18vh;
    width: 19vw;

}

.particleNum-bar,.Speed-bar,.progress-bar{
    transform: translateX(2.5%);
    margin-top: 1vh;
}
.tt{
    font-size: calc(0.6vw + 0.6vh);
    color: aliceblue;
    font-weight: 600;
    text-align: center;
}

.content {}
</style>