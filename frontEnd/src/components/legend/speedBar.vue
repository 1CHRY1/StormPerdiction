<template>
    <div class="Speed-bar">
        <div class="tt">流线速度</div>
        <div class="bar" ref="bar" @click="handleClick">
            <div class="slider" :style="Pos" @mousedown="mousedown"></div>
        </div>
        <div class="percentage">
            {{ props.nowSpeed }}
        </div>
    </div>
</template>

<script setup>
import { ref,watch,onMounted } from 'vue';

const bar = ref()
const Pos = ref("left: 0")
const selectedValue = ref(0) // all  100
const emits = defineEmits(['speedValue'])
const props = defineProps({
  nowSpeed: Number,
  maxSpeed:Number,
})
const mousedown = (e) => {
    window.addEventListener('mouseup', mouseup)
    window.addEventListener('mousemove', handleMove)
}
const handleMove = (e) => {
    if (!bar.value) return;
    let w = bar.value.clientWidth
    let x = e.pageX - bar.value.getBoundingClientRect().left
    if(x<=0)
        x=0
    else if(x<w)
        x=x
    else if(x>=w)
        x = w

    Pos.value = `left: ${x}px`
    selectedValue.value =x / w//0-1
    
    emits('speedValue',Math.ceil(selectedValue.value * props.maxSpeed))
}
const mouseup = () => {
    window.removeEventListener('mouseup', mouseup)
    window.removeEventListener('mousemove', handleMove)
}
const handleClick = (e) => {
    let w = bar.value.clientWidth
    let x = e.pageX - bar.value.getBoundingClientRect().left
    if(x<=0)
        x=0
    else if(x<w)
        x=x
    else if(x>=w)
        x = w
    Pos.value = `left: ${x}px`
    selectedValue.value = x / w//0-1
    emits('speedValue',Math.ceil(selectedValue.value * props.maxSpeed))
}

onMounted(()=>{
    const totalWidth = 8 //vw
    const x = Math.ceil(props.nowSpeed / props.maxSpeed * totalWidth)
    Pos.value = `left: ${x}vw`
})

</script>

<style scoped>
.Speed-bar {
    /* position: absolute;
    bottom: 28vh;
    right: 1vw; */
    position: relative;
    z-index: 10;
    height: 5vh;
    width: 18vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: rgb(65,65,65);
    border-radius: 1vh;
}
.tt{
    color: white;
    font-size: calc(0.6vh + 0.6vw);
    margin-left: 1vw;
    margin-right: 1vw;
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