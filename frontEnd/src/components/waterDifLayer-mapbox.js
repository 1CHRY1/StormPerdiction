// Custom layer implemented as ES6 class
import mapboxgl from 'mapbox-gl'
import { init, tickRender, main } from './originWaterDif.js'

export default class WaterDifLayer {

    prepare = false
    canvas = undefined
    map = undefined

    constructor() {
        this.id = 'WaterDifLayer';
        this.type = 'custom';
        this.renderingMode = '2d';

    }

    async onAdd(map, gl) {

        this.map = map
        this.canvas = document.querySelector('#WebGPUFrame')
        this.prepare = await init(this.canvas)

    }

    render(gl, matrix) {

        if(this.prepare){
            tickRender(matrix)
        }
        this.map.triggerRepaint()
    }
}



