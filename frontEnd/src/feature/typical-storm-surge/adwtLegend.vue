<script setup lang="ts">
import { onMounted, watch, ref, Ref } from 'vue';

const props = defineProps({
    contourData: Object
})
const contourArr: Ref<Array<number>> = ref([]);


const getCountourArr = (geojson: any) => {

    let features: Array<any> = geojson["features"]
    let contorArr: Array<any> = []
    features.forEach((feat: any) => {
        if (feat['properties']['addWater'] && contorArr.indexOf(feat['properties']['addWater']) == -1)
            contorArr.push(feat['properties']['addWater'])
    })
    // contorArr.
    contorArr.sort()
    contorArr.reverse()
    console.log(contorArr);

    return contorArr
}

watch(props, () => {
    contourArr.value = getCountourArr(props.contourData)
})


onMounted(() => {
})

</script>

<template>
    <div class='adwtLegend'>
        <p id="title">风暴增水(m)</p>
        <div class='localFlex'>
            <div class='rampColor' :style="{ height: contourArr.length * 15 + 'px' }"></div>
            <div class="lable" :style="{ height: contourArr.length * 15 + 'px' }">
                <p v-for="c in contourArr">{{ c }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.adwtLegend {
    width: 120px;
    border-radius: 3px;
    /* height: 200px; */
    background: rgb(20, 97, 143);
    background: radial-gradient(circle, rgba(20, 97, 143, 0.8827906162464986) 0%, rgba(22, 44, 103, 1) 100%);
}

.adwtLegend>p {
    font-size: 18px;
    /* color: aliceblue; */
    font-weight: bold;
    padding: 10px 5px;
    text-align: center;
    line-height: 18px;
}

.localFlex {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: left;
}

.lable {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 30px;
}

.lable>p {
    color: aliceblue;
    font-size: 13px;
    line-height: 15px;
}

.rampColor {
    width: 30px;
    margin-left: 25px;
    background: rgb(9, 1, 145);
    background: linear-gradient(0deg, rgba(9, 1, 145, 1) 0%, rgba(70, 184, 3, 1) 50%, rgba(255, 0, 0, 1) 100%);
}
</style>