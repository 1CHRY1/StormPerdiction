<template>
    <div class="particleNum-bar">
        <div class="tt">流线数量</div>
        <div class="bar" ref="bar" @click="handleClick">
            <div class="slider" :style="Pos" @mousedown="mousedown"></div>
        </div>
        <div class="percentage">
            {{ props.nowParticleNum }}
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const bar = ref()
const Pos = ref("left: 0")
const selectedValue = ref(0) // all  100
const emits = defineEmits(['particleNumValue'])
const props = defineProps({
    nowParticleNum: Number,
    maxParticleNum: Number,
})
const mousedown = (e) => {
    window.addEventListener('mouseup', mouseup)
    window.addEventListener('mousemove', handleMove)
}
const handleMove = (e) => {
    if (!bar.value) return;
    let w = bar.value.clientWidth
    let x = e.pageX - bar.value.getBoundingClientRect().left
    if (x <= 0)
        x = 0
    else if (x < w)
        x = x
    else if (x >= w)
        x = w

    Pos.value = `left: ${x}px`
    selectedValue.value = x / w//0-1
    emits('particleNumValue', Math.ceil(selectedValue.value * props.maxParticleNum))
}
const mouseup = () => {
    window.removeEventListener('mouseup', mouseup)
    window.removeEventListener('mousemove', handleMove)
}
const handleClick = (e) => {
    let w = bar.value.clientWidth
    let x = e.pageX - bar.value.getBoundingClientRect().left
    if (x <= 0)
        x = 0
    else if (x < w)
        x = x
    else if (x >= w)
        x = w
    Pos.value = `left: ${x}px`
    selectedValue.value = x / w//0-1
    emits('particleNumValue', Math.ceil(selectedValue.value * props.maxParticleNum))
}
onMounted(() => {
    const totalWidth = 8 //vw
    const x = Math.ceil(props.nowParticleNum / props.maxParticleNum * totalWidth)
    console.log(x);
    Pos.value = `left: ${x}vw`
})

</script>

<style scoped>
.particleNum-bar {
    position: relative;
    z-index: 10;
    height: 5vh;
    width: 18vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: rgb(65, 65, 65);
    border-radius: 1vh;
}

.tt {
    color: white;
    font-size: calc(0.6vh + 0.6vw);
    margin-right: 1vw;
    margin-left: 1vw;
    user-select: none;
}


.bar {
    position: relative;
    width: 8vw;
    height: 1.5vh;
    background-color: rgb(43, 70, 92);
}

.slider {
    position: absolute;
    top: -0.5vh;
    width: 10px;
    height: 2.5vh;
    background-color: rgb(179, 245, 255);
}

.percentage {
    position: relative;
    user-select: none;
    margin-left: 1vw;
    color: white;
}
</style>