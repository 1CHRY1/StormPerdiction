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
    //     "zeta": [
    //         -0.0037395752337,
    //         -0.014200948934,
    //         -0.03412842273,
    //         -0.039439474587,
    //         -0.013727981937,
    //         0.00741540213,
    //         0.010757454621,
    //         0.0035129502469,
    //         0.11329716303,
    //         0.4649848114,
    //         0.48604784218,
    //         0.21098935772,
    //         0.091251294042,
    //         -0.18136826019,
    //         -0.46650463893,
    //         -0.66475675185,
    //         -0.81742307484,
    //         -0.94134380148,
    //         -0.96586311186,
    //         -0.52985947228,
    //         0.30246865181,
    //         1.081383047,
    //         1.6971915891,
    //         1.8882013398,
    //         1.7032299648,
    //         1.1729743105,
    //         0.62121997374,
    //         0.2350655764,
    //         -0.02069778509,
    //         -0.27727191408,
    //         -0.49279256941,
    //         -0.59692795719,
    //         -0.2317605427,
    //         0.62756467473,
    //         1.1582605246,
    //         1.30403511,
    //         1.0589425606,
    //         0.58335222031,
    //         0.2642704763,
    //         -0.0038062992166,
    //         -0.23504610115,
    //         -0.43739378783,
    //         -0.624550319,
    //         -0.69182248118,
    //         -0.12879621138,
    //         0.92456716725,
    //         1.665817065,
    //         2.0715850105,
    //         2.0379270809,
    //         1.6545761208,
    //         1.1303987177,
    //         0.71289626571,
    //         0.42717507702,
    //         0.18446094655,
    //         -0.079473410735,
    //         -0.28032824362,
    //         -0.30472767641,
    //         0.40345869887,
    //         1.0757236336,
    //         1.4112745774,
    //         1.3754861102,
    //         0.92049703604,
    //         0.52973728606,
    //         0.25022150126,
    //         -0.018508207999,
    //         -0.24230460501,
    //         -0.45638778409,
    //         -0.60303617014,
    //         -0.48365067816,
    //         0.66154462127,
    //         1.6141637107,
    //         2.2118596863,
    //         2.3807233949,
    //         2.065651652,
    //         1.5398566783,
    //         1.0525264658,
    //         0.67508059659,
    //         0.42262891914,
    //         0.13685554697,
    //         -0.12943027694,
    //         -0.31538570014,
    //         -0.21258654765,
    //         0.7991081148,
    //         1.3968273401,
    //         1.6276822505,
    //         1.4489262137,
    //         0.89619035179,
    //         0.55436141229,
    //         0.2688110193,
    //         0.01575726493,
    //         -0.21807985331,
    //         -0.45008354256,
    //         -0.5918374873,
    //         -0.31000344726,
    //         1.0296187975,
    //         1.9342057171,
    //         2.4128979964,
    //         2.4517078195,
    //         2.0269046672,
    //         1.4595933271,
    //         0.98535023301,
    //         0.65953125589,
    //         0.39868605543,
    //         0.091761267918,
    //         -0.15688458269,
    //         -0.29673106161,
    //         0.19549435116,
    //         1.2144515352,
    //         1.7497663842,
    //         1.868137262,
    //         1.4984914507,
    //         0.96696289335,
    //         0.63016113665,
    //         0.31004952203,
    //         0.048432790371,
    //         -0.18294019661,
    //         -0.41670296589,
    //         -0.53704714429,
    //         0.032835774272,
    //         1.4014309773,
    //         2.1964664525,
    //         2.5373893951,
    //         2.3733780278,
    //         1.8052752699,
    //         1.2700247954,
    //         0.8316813808,
    //         0.54391032289,
    //         0.27317395973,
    //         -0.036179468946,
    //         -0.26002230357,
    //         -0.34370812183,
    //         0.65510714786,
    //         1.4678619469,
    //         1.8994863035,
    //         1.8837494021,
    //         1.3080471227,
    //         0.85328813927,
    //         0.52853809518,
    //         0.22969792411,
    //         -0.014111170044,
    //         -0.26659017265,
    //         -0.48901997714,
    //         -0.54655631126,
    //         0.46868771536
    //     ]
    // }

    // let usData = []
    // let vsData = []
    let zData = []
    for (let i = 0; i < data.zeta.length; i++) {
        // usData.push([i, data.us[i]])
        // vsData.push([i, data.vs[i]])
        zData.push([i, data.zeta[i]])
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
            name: '潮位(m)',
            nameTextStyle: {
                fontWeight: 'bold',
            },
        },
        series: [
            {
                name: '潮位',
                data: zData,
                type: 'line',
                smooth: true,
                markLine: {
                    symbolSize: 5,
                    itemStyle: {
                        normal: {
                            color: 'rgb(94, 208, 251)',
                            borderColor: 'black',
                            borderWidth: 0.5,
                        },
                    },
                    lineStyle: {
                        color: 'red',
                        opacity: 0.8,
                        width: 3,
                    },
                    data: [
                        {
                            name: 'timeStep',
                            xAxis: parseFloat(0),
                            label: {
                                formatter: `0`,
                                backgroundColor: 'rgb(208, 236, 255)',
                                color: 'red',
                                fontSize: '15px',
                                position: 'end',
                                offset: [0, 10],
                            },
                        },
                    ],
                },
            },
        ]
    }
    return {
        option: tideLineOption,
        // usData,
        // vsData,
        zData
    }
}



onMounted(async () => {

    chartIns = echarts.init(tideChartRef.value)

    const stationDataUrl = `/api/v1/data/nc/field/velocity/point?name=${name.value}`
    const { option, zData } = await getTideLineDataOption(stationDataUrl)

    chartIns.setOption(option)

    ////// dynamic data update //////
    let i = 0
    let timeStepPerView = 12
    let index = 12
    let zdt = zData

    let opt = {
        series: [
            {
                name: '潮位',
                data: zData,
                type: 'line',
                smooth: true,
                markLine: {
                    symbolSize: 5,
                    itemStyle: {
                        normal: {
                            color: 'rgb(94, 208, 251)',
                            borderColor: 'black',
                            borderWidth: 0.5,
                        },
                    },
                    lineStyle: {
                        color: '#12c791',
                        opacity: 0.8,
                        width: 3,
                    },
                    data: [
                        {
                            name: 'timeStep',
                            xAxis: parseFloat(props.timeStep),
                            label: {
                                formatter: `${parseFloat(props.timeStep)}`,
                                backgroundColor: 'rgb(208, 236, 255)',
                                color: '#12c791',
                                fontSize: '15px',
                                position: 'end',
                                offset: [0, 10],
                            },
                        },
                    ],
                },
            },
        ]
    }

    watch(() => props.progress, (newVal) => {
        // console.log('progress changed', newVal)
        // chartIns.dispatchAction({
        //     type: 'dataZoom',
        //     // // 开始位置的百分比，0 - 100
        //     // start: newVal - 5 <= 0 ? 0 : newVal - 5,
        //     // // 结束位置的百分比，0 - 100
        //     // end: newVal + 5 >= 100 ? 100 : newVal + 5,
        //     start: newVal - 10 <= 0 ? 0 : newVal - 10,
        //     end: newVal >= 100 ? 100 : newVal,
        // })
        option.series[0].markLine.data[0].xAxis = parseFloat(newVal)
        option.series[0].markLine.data[0].label.formatter = `${parseFloat(newVal)}`
        chartIns.setOption(option)
    })



})

</script>

<style scoped>
.tide-line-chart {
    position: relative;
    width: 20vw;
    height: 28vh;
    background-color: rgb(36, 36, 36);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}

.title {
    position: relative;
    width: 20vw;
    height: 4vh;
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
    width: 20vw;
    height: 24vh;
    display: flex;
    justify-content: center;
    align-items: center;
}


.content>#tideChart {
    position: relative;
    width: 19.5vw;
    height: 23vh;
    border-radius: 10px;
    background-color: rgb(206, 206, 206);
}
</style>