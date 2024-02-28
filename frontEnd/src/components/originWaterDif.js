
import axios from "axios";

const rand = (min, max) => {
    return min + Math.random() * (max - min);
}

let canvas
let device
let context
let passDescriptor
let pipeline
let vertexBuffer
let vertexBuffer_Attrib
let indexBuffer
let uniformBuffer
let uniformBindGroup
let indexData
let uniformData

const init = async (cvs) => {

    canvas = cvs
    // const { vertex, attrib, index, attribBoundary } = (await axios.get("/json/testTri.json")).data
    const { vertex, attrib, index, attribBoundary } = (await axios.get("/json/zetaTri/zetaTri_3.json")).data


    // const vertex = [[0.5, 0.5], [0.0, 0.5], [0.0, 0.0], [0.3, 0.1], [0.7, 0.2]]
    // const index = [[0, 1, 2], [0, 3, 4]]
    // const attrib = [0.1, 0.3, 0.4, 0.2, 0.6]
    // const attribBoundary = {
    //     "max": 0.7,
    //     "min": -0.1
    // }


    const adapter = await navigator.gpu.requestAdapter()
    device = await adapter?.requestDevice()

    context = cvs.getContext("webgpu")
    const format = navigator.gpu.getPreferredCanvasFormat()

    context.configure({
        format,
        device,
        alphaMode: 'premultiplied'
    });

    const shaderSrc = (await axios.get("/shader/waterdif.wgsl")).data;
    const module = device.createShaderModule({
        label: "mmodule",
        code: shaderSrc,
    })





    const vertexBufferData = new Float32Array(vertex.flat())
    const attribData = new Float32Array(attrib)
    indexData = new Uint32Array(index.flat())
    const numVertices = attrib.length



    //////Vetexbuffer for position
    vertexBuffer = device.createBuffer({
        label: 'vertexBuf',
        size: vertexBufferData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(vertexBuffer, 0, vertexBufferData);

    vertexBuffer_Attrib = device.createBuffer({
        label: 'vertexbuffer_Attrib',
        size: attribData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(vertexBuffer_Attrib, 0, attribData);

    indexBuffer = device.createBuffer({
        label: 'index buffer',
        size: indexData.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(indexBuffer, 0, indexData);


    uniformData = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])
    uniformBuffer = device.createBuffer({
        label: "uniform buffer",
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(uniformBuffer, 0, uniformData)

    let uniformBindGroupLayout = device.createBindGroupLayout({
        'label': 'bindgroup layout',
        'entries': [
            {
                binding: 0,
                buffer: uniformBuffer,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT
            }
        ]
    })

    uniformBindGroup = device.createBindGroup({
        label: 'uniform bind group',
        layout: uniformBindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } }
        ]
    })

    let pipelineLayout = device.createPipelineLayout({
        label: 'pipeline    layout',
        bindGroupLayouts: [
            uniformBindGroupLayout
        ]
    })

    pipeline = device.createRenderPipeline({
        label: "pipeline",
        layout: pipelineLayout,
        vertex: {
            module,
            entryPoint: "vMain",
            constants: {
                "attribMax": attribBoundary['max'],/////note!!!!
                "attribMin": attribBoundary['min']
            },
            buffers: [//声明一下 vertexBuffer
                {
                    arrayStride: 2 * 4,// 2 float32 
                    stepMode: 'vertex',
                    attributes: [
                        { shaderLocation: 0, offset: 0, format: "float32x2" }//对应@location(0)
                    ]
                },
                {
                    arrayStride: 1 * 4,
                    stepMode: 'vertex',
                    attributes: [
                        { shaderLocation: 1, offset: 0, format: "float32" },//offset
                    ]
                }
            ],
        },
        fragment: {
            module,
            entryPoint: "fMain",
            targets: [{ format: format }],
        },
        primitive: {
            topology: "triangle-list"
        },
    });


    passDescriptor = {
        label: 'descriptor',
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            resolveTarget: undefined,
            clearValue: [0.0, 0.0, 0.0, 0.0],
            loadOp: "clear",
            storeOp: "store",
        }]
    }

    return true
}

const render = () => {

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    passDescriptor.colorAttachments[0].view =
        context.getCurrentTexture().createView();
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass(passDescriptor);
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setVertexBuffer(1, vertexBuffer_Attrib);
    pass.setIndexBuffer(indexBuffer, "uint32");
    pass.setBindGroup(0, uniformBindGroup)

    pass.drawIndexed(indexData.length)

    pass.end();
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

}

const tickRender = (ogMatrix) => {

    let mapbox_Matrix = new Float32Array(ogMatrix);
    // uniformData = new Float32Array(ogMatrix)
    // console.log(uniformData);
    device.queue.writeBuffer(uniformBuffer, 0, mapbox_Matrix)
    render()
}

const main = async (canvas) => {
    await init(canvas)
    tickRender()
}

export {
    init,
    tickRender,
    main
}