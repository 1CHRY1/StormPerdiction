import * as Scratch from './scratch/scratch.js'
import mapboxgl from "mapbox-gl"
import { tickLogic,init,showFlowField } from "./9711flowOK"

export default class FlowLayer9711{
    constructor() {
        this.id = 'FlowLayer9711';
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

        const { simulationPass, renderPass } = await init(this.screen)
        this.simulation_gpu = simulationPass
        this.render_gpu = renderPass
        Scratch.director.addStage({
            name: 'FlowLayer9711 Shower',
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

        if (this.ready) {
            this.screen.swap()
            tickLogic(undefined, [mapCenter.lng, mapCenter.lat], matrix)
            Scratch.director.tick()
            if (this.frameCount === 30) {
                // showFlowField(true)
                Scratch.director.addStage({
                    name: 'FlowLayer9711 Shower',
                    items: [
                        this.simulation_gpu,
                        this.render_gpu
                    ]
                })
            }
        }
        this.map.triggerRepaint();
        this.frameCount++;
    }

    onRemove(map,gl){
        showFlowField(false)
        this.screen.swap()
    }
}