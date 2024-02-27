// Custom layer implemented as ES6 class
import mapboxgl from 'mapbox-gl'
import { tickLogic, init, showFlowField } from './flowLayerLHY.js' //main
import * as Scratch from './scratch/scratch.js'

export default class FlowLayer {
    
    
    constructor() {
        this.id = 'FlowLayer';
        this.type = 'custom';
        this.renderingMode = '2d';
        
    }
    

    async onAdd(map, gl) {

        this.map = map

        const gpuCanvas = document.getElementById('WebGPUFrame')
        this.screen = Scratch.Screen.create({ canvas: gpuCanvas })
        // const sceneTexture = this.screen.createScreenDependentTexture(' Scene Texture', undefined, [2, 2])
        // const sceneTexture = screen.getCurrentCanvasTexture();

        const { simulationPass, renderPass } = await init(this.screen)

        Scratch.director.addStage({
            name: 'Flow Field Shower',
            items: [
                simulationPass,
                renderPass,
            ]
        })
        showFlowField(true)

    }

    render(gl, matrix) {
        const mapCenter = this.map.getCenter()

        let centerX = encodeFloatToDouble(mapCenter[0])
        let centerY = encodeFloatToDouble(mapCenter[1])

        // const mat = matrix.slice();
        // mat[12] += mat[0] * centerX[0] + mat[4] * centerY[0];
        // mat[13] += mat[1] * centerX[0] + mat[5] * centerY[0];
        // mat[14] += mat[2] * centerX[0] + mat[6] * centerY[0];
        // mat[15] += mat[3] * centerX[0] + mat[7] * centerY[0];

        this.screen.swap()
        tickLogic(undefined, [mapCenter.lng, mapCenter.lat],matrix)
        // tick(mapMatrix, [mercatorCenter.x, mercatorCenter.y])

        Scratch.director.tick()
    }
}


const encodeFloatToDouble = (value) => {
    const result = new Float32Array(2);
    result[0] = value;
    const delta = value - result[0];
    result[1] = delta;
    return result;
}


