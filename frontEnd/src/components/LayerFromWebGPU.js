import FlowLayer from './flowlayer-mapbox'
import WindLayer from './windlayer-mapbox'
import WindLayer9711 from './9711windOK-mapboxlayer'
import FlowLayer9711 from './9711flowOK-mapboxlayer'
import {prepareAddWaterLayer,addWaterLayer,prepareAddWaterLayer2,addWaterLayer2} from './9711add'

// import SteadyFlowLayer from './layers/flow'
import flow9711 from './layers/9711flow'
import wind9711 from './layers/9711wind'

///////////front version vs backend version
import windd from './layers/wind_front'
import floww from './layers/flow_front'
// import windd from './layers/wind_back'
// import floww from './layers/flow_back'





export{
/////////old //////////
    FlowLayer,
    WindLayer,
    WindLayer9711,
    FlowLayer9711,

    prepareAddWaterLayer,addWaterLayer,prepareAddWaterLayer2,addWaterLayer2,
////////new //////////
    flow9711,
    wind9711,
    floww,
    windd,
}