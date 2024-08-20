<template>
    <div class="tide-line-chart">
        <div class="title">
            <div class="left-title">潮位过程线</div>
            <div class="right-title">{{ nameMap[name] }}</div>
        </div>
        <div class="content">
            <!-- <div class="btn">停止</div> -->
            <div id="tideChart" ref="tideChartRef"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios';

//////////// station info /////////////
const name = ref('wusong')
const nameMap = {
    'wusong': '吴淞站'
}


/////////// tide line chart ///////////
const tideChartRef = ref(null)
let chartIns = null

const props = defineProps({
    progress: {
        type: Number,
        default: 0
    }
})



const getTideLineDataOption = async (dataUrl) => {

    const data = (await axios.get(dataUrl)).data
    // const data = {
    //     "us": [
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0
    //     ],
    //     "vs": [
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0,
    //         0.0
    //     ]
    // }

    let usData = []
    let vsData = []
    for (let i = 0; i < data.us.length; i++) {
        usData.push([i, data.us[i]])
        vsData.push([i, data.vs[i]])
    }

    // const timeData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

    const tideLineOption = {
        grid: {
            left: '10%',
            right: '3%',
            bottom: '15%',
            top: '17%',
            containLabel: false,
        },
        dataZoom: {
            // bottom: 10,
            // height: 5,
            // type: 'slider',//类型,滑动块插件
            type: 'inside',
            show: true,//是否显示下滑块
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'value',
            name: '时间步',
            nameLocation: 'middle',
            nameGap: 20,
            nameTextStyle: {
                fontWeight: 'bold',
            },
        },
        yAxis: {
            type: 'value',
            name: '速度(m/s)',
            nameTextStyle: {
                fontWeight: 'bold',
            },
        },
        // series: [
        //     {
        //         name: '东西向流速',
        //         data: usData,
        //         type: 'line',
        //         smooth: true,
        //     },
        //     {
        //         name: '南北向流速',
        //         data: [],
        //         type: 'line',
        //         smooth: true,
        //     }
        // ]
    }
    return {
        option: tideLineOption,
        usData,
        vsData,
    }
}



onMounted(async () => {

    chartIns = echarts.init(tideChartRef.value)

    const stationDataUrl = `/api/v1/data/nc/field/velocity/point?name=${name.value}`
    const { option, usData, vsData } = await getTideLineDataOption(stationDataUrl)

    chartIns.setOption(option)

    ////// dynamic data update //////
    let i = 0
    let timeStepPerView = 12
    let index = 12
    let udata = usData
    let vdata = vsData
    // let udata = usData.slice(0, 11)
    // let vdata = vsData.slice(0, 11)
    // setInterval(() => {
    //     if (i >= 12) {
    //         i = 0
    //     }
    //     if (index >= usData.length - 1) {
    //         index = 12
    //         udata = usData.slice(0, 11)
    //         vdata = vsData.slice(0, 11)
    //     }
    //     // udata = usData.slice(i * timeStepPerView, (i + 1) * timeStepPerView - 1)
    //     // vdata = vsData.slice(i * timeStepPerView, (i + 1) * timeStepPerView - 1)
    //     udata.push(usData[index])
    //     vdata.push(vsData[index])
    //     let option = {
    //         series: [
    //             {
    //                 name: '东西向流速',
    //                 data: udata,
    //                 type: 'line',
    //                 smooth: true,
    //             },
    //             {
    //                 name: '南北向流速',
    //                 data: vdata,
    //                 type: 'line',
    //                 smooth: true,
    //             }
    //         ]
    //     }
    //     chartIns.setOption(option)
    //     i++
    //     index++
    // }, 1000)


    let opt = {
        series: [
            {
                name: '东西向流速',
                data: udata,
                type: 'line',
                smooth: true,
            },
            {
                name: '南北向流速',
                data: vdata,
                type: 'line',
                smooth: true,
            }
        ]
    }
    chartIns.setOption(opt)

    // window.addEventListener('keydown', (e) => {
    //     if (e.key === '1') {
    //         chartIns.dispatchAction({
    //             type: 'dataZoom',
    //             // 开始位置的百分比，0 - 100
    //             start: 0,
    //             // 结束位置的百分比，0 - 100
    //             end: 20,
    //         })
    //     }
    //     if (e.key === '2') {
    //         chartIns.dispatchAction({
    //             type: 'dataZoom',
    //             // 开始位置的百分比，0 - 100
    //             start: 30,
    //             // 结束位置的百分比，0 - 100
    //             end: 50,
    //         })
    //     }
    // })


    watch(() => props.progress, (newVal) => {
        console.log('progress changed', newVal)
        chartIns.dispatchAction({
            type: 'dataZoom',
            // 开始位置的百分比，0 - 100
            start: newVal - 5 <= 0 ? 0 : newVal - 5,
            // 结束位置的百分比，0 - 100
            end: newVal + 5 >= 100 ? 100 : newVal + 5,
        })
    })



})

</script>

<style scoped>
.tide-line-chart {
    position: relative;
    width: 24vw;
    height: 32vh;
    background-color: rgb(36, 36, 36);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}

.title {
    position: relative;
    width: 24vw;
    height: 4.5vh;
    background-color: rgb(63, 100, 144);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.title>.left-title {

    position: relative;
    font-size: calc(0.8vw + 0.8vh);
    font-weight: bold;
    color: rgb(255, 255, 255);
    margin-left: 1vw;
    letter-spacing: .05vw;

}

.title>.right-title {
    position: relative;
    font-size: calc(0.6vw + 0.8vh);
    font-weight: bold;
    color: rgb(163, 255, 255);
    margin-right: 1vw;
}

.content {
    position: relative;
    background-color: rgb(36, 36, 36);
    width: 24vw;
    height: 27.5vh;
    display: flex;
    justify-content: center;
    align-items: center;
}


.content>#tideChart {
    position: relative;
    width: 23.2vw;
    height: 26.1vh;
    border-radius: 10px;
    background-color: rgb(206, 206, 206);
}
</style>