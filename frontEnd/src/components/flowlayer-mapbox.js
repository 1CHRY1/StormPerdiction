// Custom layer implemented as ES6 class
import mapboxgl from 'mapbox-gl'
import { tickLogic, init, showFlowField } from './flowLayerLHY.js' //main
import * as Scratch from './scratch/scratch.js'

export default class FlowLayer {
    
    
    constructor() {
        this.id = 'FlowLayer';
        this.type = 'custom';
        this.renderingMode = '2d';
        this.ready = false;
        this.frameCount = 0;
        this.simulation_gpu = undefined;
        this.render_gpu = undefined;
        
    }
    

    async onAdd(map, gl) {

        this.map = map

        const gpuCanvas = document.getElementById('WebGPUFrame')
        this.screen = Scratch.Screen.create({ canvas: gpuCanvas })
        // const sceneTexture = this.screen.createScreenDependentTexture(' Scene Texture', undefined, [2, 2])
        // const sceneTexture = screen.getCurrentCanvasTexture();

        const { simulationPass, renderPass } = await init(this.screen)
        this.simulation_gpu = simulationPass
        this.render_gpu = renderPass
        Scratch.director.addStage({
            name: 'Flow Field Shower',
            items: [
                this.simulation_gpu,
                // this.render_gpu
            ]
        })
        showFlowField(true)

        this.ready = true
    }

    render(gl, matrix) {
        const mapCenter = this.map.getCenter()

        if(this.ready){
            this.screen.swap()
            tickLogic(undefined, [mapCenter.lng, mapCenter.lat],matrix)
            Scratch.director.tick()
            if(this.frameCount===10){
                // showFlowField(true)
                Scratch.director.addStage({
                    name: 'Flow Field Shower',
                    items: [
                        this.simulation_gpu,
                        this.render_gpu
                    ]
                })
            }
        }
        this.map.triggerRepaint();
        this.frameCount ++;

    }
}



