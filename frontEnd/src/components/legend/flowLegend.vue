<template>
    <div class="flow-legend">
        <div class="legend-title">{{ props.desc }}</div>
        <hr>
        <div class="legend-body">
            <canvas id="pallete-flow" width="40" height="160"></canvas>
            <div class="legend-desc">
                <div class="legend-text" v-for="i in 8">{{ getValue(i) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    maxSpeed: Object,
    desc:String
})

const getValue = (i) => {
    if (props.maxSpeed){
        return (props.maxSpeed.value / 8 * (8 - i)).toFixed(2)
    }else
        return  i;
}


watch(props, () => {
    console.log(props);
})
onMounted(() => {
    let rampColor = [
        '#3288bd',
        '#66c2a5',
        '#abdda4',
        '#e6f598',
        '#fee08b',
        '#fdae61',
        '#f46d43',
        '#d53e4f'
    ]
    drawPallete(rampColor);

})

const drawPallete = (rampColor) => {
    // console.log();
    const canvas = document.querySelector('#pallete-flow')
    const ctx = canvas.getContext("2d");

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // let width = 200
    // let height = 200 / rampColor.length
    let width = canvas.width
    let height = canvas.height / rampColor.length

    for (let i = 0; i < rampColor.length; i++) {
        ctx.fillStyle = rampColor[i];
        ctx.fillRect(0, (rampColor.length - 1 - i) * height, width, height);
    }
}

</script>

<style scoped>
.flow-legend {
    width: 120px;
    height: 215px;
    background-color: rgba(172, 235, 247, 0.973);
    position: absolute;
    bottom: 5vh;
    right: 4vw;
    border-radius: 5px;
    box-shadow: rgb(2, 78, 114) 0px 14px 28px, rgba(121, 168, 255, 0.479) 0px 5px 5px;
}

.flow-legend .legend-title {

    font-size: 20px;
    color: rgb(0, 36, 153);
    font-weight: 800;
    padding: 5px;
    text-align: center;
    line-height: 30px;
}

.flow-legend .legend-body {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

}

hr {
    border-top-width: 2px;
    border-color: rgba(21, 48, 199, 0.568);
    padding: 3px;
}

#pallete-flow {
    margin-left: 15px;
    margin-right: 15px;
}

.legend-desc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 20px;
    height: 160px;
}

.legend-text {
    color: rgb(0, 34, 145);
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    width: 40px;
}
</style>