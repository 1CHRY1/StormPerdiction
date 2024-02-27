import axios from "axios";
import * as Scratch from './scratch/scratch.js'

let screen

let vertexBuffer
let indexBuffer
let attribBuffer1
let attribBuffer2

let renderBinding
let renderPipline
let renderPass


const INIT = async (scenneTexture) => {

    screen = scenneTexture
    // const { vertex, attrib, index } = (await axios.get("/images/zetaTri/zeta_tri_0.json")).data

    const vertex = [[0.5, 0.5], [0.0, 0.5], [0.0, 0.0], [0.3, 0.1], [0.7, 0.2]]
    const index = [[0, 1, 2], [0, 3, 4]]
    const attrib = [0.1, 0.3, 0.4, 0.2, 0.6]

    let vertexData = new Float32Array(vertex)
    let vertexRef = Scratch.aRef(vertexData, 'vertexRef_WaterDIF')
    vertexBuffer = Scratch.VertexBuffer.create({
        name: 'vertexBuffer_WaterDIF',
        resource: {
            arrayRef: vertexRef,
            structure: [{ components: 2 }]
        }
    })

    let attribData1 = new Float32Array(attrib)
    let attribRef1 = Scratch.aRef(attribData1, 'attribRef1_WaterDIF')
    attribBuffer1 = Scratch.VertexBuffer.create({
        name: 'attribBuffer1_WaterDIF',
        resource: {
            arrayRef: attribRef1,
            structure: [{ components: 1 }]
        }
    })

    let indexData = new Uint32Array(index)
    let indexRef = Scratch.aRef(indexData, 'indexRef_WaterDIF')
    indexBuffer = Scratch.IndexBuffer.create({
        name: 'indexBuffer_WaterDIF',
        resource: {
            arrayRef: indexRef
        }
    })

    let attribData2 = new Float32Array(attrib)
    let attribRef2 = Scratch.aRef(attribData2, 'attribRef2_WaterDIF')
    attribBuffer2 = Scratch.StorageBuffer.create({
        name: 'attribBuffer2_WaterDIF',
        resource: { arrayRef: attribRef2 }
    })

    renderBinding = Scratch.Binding.create({
        name: 'renderBinding_WaterDIF',
        range: () => [3],
        // index: { buffer: indexBuffer },
        vertices: [
            {
                buffer: vertexBuffer
            },
            {
                buffer: attribBuffer1
            }
        ]
    })

    renderPipline = Scratch.RenderPipeline.create({
        name: 'renderPipline_WaterDIF',
        shader: { module: Scratch.shaderLoader.load('waterdifShader', '/shaders/waterdif.wgsl') },
        colorTargetStates: [{ blend: Scratch.PremultipliedBlending }],
        primitive: { topology: 'triangle-list' },
    })

    renderPass = Scratch.RenderPass.create({
        name: 'renderpass_WaterDIF',
        colorAttachments: [
            {
                colorResource: screen,
                loadOp: 'load',
            }
        ]
    })

    // Scratch.director.addStage({
    //     name: 'WaterDif show',
    //     items: [
    //         renderPass,
    //     ]
    // })

    return renderPass
}


const TICKLOGIC = () => {

}

export {
    INIT,
    TICKLOGIC
}