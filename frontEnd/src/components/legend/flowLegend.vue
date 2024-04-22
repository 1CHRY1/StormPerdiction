<template>
    <div class="flow-legend">
        <div class="legend-title">{{ props.desc }}</div>
        <hr>
        <div class="legend-body">
            <canvas id="pallete-flow" width="40" height="160"></canvas>
            <div class="legend-desc">
                <div class="legend-text" v-for="i in 8">{{ value[i - 1] }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps(['maxSpeed', 'desc', 'addRange'])
const value = reactive(['0', '0', '0', '0', '0', '0', '0', '0'])
const getValue = () => {
    if (props.desc === '流速(m/s)' || props.desc === '风速(m/s)') {
        if (props.maxSpeed) {
            for (let i = 0; i < 8; i++) {
                value[7-i] = (props.maxSpeed / 8 * (i)).toFixed(2)
            }
        }
    } else if (props.desc === '风暴增水(m)') {

        let max = props.addRange[0]
        let min = props.addRange[1]

        for (let i = 0; i < 8; i++) {
            value[7-i] = (min + (max - min) / (8-i) * i).toFixed(2)
        }

        for (let i = 6; i > 1; i--) {
            if(value[i]==value[i-1]){
                value[i] = ' '
            }
        }
        if(value[0]===value[1] || value[0] === '-'+value[1] || value[1] === '-'+value[0]){
            value[1] = ''
        }
        if(value[7]===value[6] || value[7] === '-'+value[6] || value[6] === '-'+value[7]){
            value[6] = ''
        }

    }

}

watch(props, (v) => {
    getValue()
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
    const canvas = document.querySelector('#pallete-flow')
    console.log(canvas);
    const ctx = canvas.getContext("2d");

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

    font-size: 18px;
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
    display: block;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    height: 20px;
    width: 40px;
}
</style>