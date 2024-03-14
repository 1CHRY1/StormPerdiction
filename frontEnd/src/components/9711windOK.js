import axios from "axios"
import { GUI } from "dat.gui"
import * as Scratch from './scratch/scratch.js'

class DescriptionParser {

    constructor(descriptionUrl) {
        this.url = descriptionUrl
        this.flowFieldResourceArray = []
        this.seedingResourceArray = []
        this.upResourceArray = []
        this.transform2DHighResource = ''
        this.transform2DLowResource = ''
        this.transform2DResource = ''
        this.transform3DResource = ''
        this.maxDropRate = 0.0
        this.maxDropRateBump = 0.0
        this.maxSegmentNum = 0.0
        this.maxTrajectoryNum = 0.0
        this.maxTextureSize = 0.0
        this.extent = [0.0, 0.0, 0.0, 0.0]
        this.flowBoundary = [0.0, 0.0, 0.0, 0.0]
        this.flowFieldTextureSize = [0.0, 0.0]
        this.seedingTextureSize = [0.0, 0.0]
        this.transformTextureSize = [0.0, 0.0]
        this.upTextureSize = [0.0, 0.0]
    }

    async Parsing() {

        await axios.get(this.url)
            .then(async (response) => {

                this.flowBoundary[0] = response.data["flow_boundary"]["u_min"]
                this.flowBoundary[1] = response.data["flow_boundary"]["v_min"]
                this.flowBoundary[2] = response.data["flow_boundary"]["u_max"]
                this.flowBoundary[3] = response.data["flow_boundary"]["v_max"]

                this.maxTextureSize = response.data["constraints"]["max_texture_size"]
                this.maxTrajectoryNum = response.data["constraints"]["max_streamline_num"]
                this.maxSegmentNum = response.data["constraints"]["max_segment_num"] - 1
                this.maxDropRate = response.data["constraints"]["max_drop_rate"]
                this.maxDropRateBump = response.data["constraints"]["max_drop_rate_bump"]

                this.extent[0] = response.data["extent"][0]
                this.extent[1] = response.data["extent"][1]
                this.extent[2] = response.data["extent"][2]
                this.extent[3] = response.data["extent"][3]

                for (const url of response.data["flow_fields"]) {
                    this.flowFieldResourceArray.push(url)
                }
                this.flowFieldTextureSize[0] = response.data["texture_size"]["flow_field"][0]
                this.flowFieldTextureSize[1] = response.data["texture_size"]["flow_field"][1]

                for (const url of response.data["area_masks"]) {
                    this.seedingResourceArray.push(url)
                }
                this.seedingTextureSize[0] = response.data["texture_size"]["area_mask"][0]
                this.seedingTextureSize[1] = response.data["texture_size"]["area_mask"][1]

                // this.transform2DHighResource = response.data["projection"]["2D"]["high"]
                // this.transform2DLowResource = response.data["projection"]["2D"]["low"]
                // this.transform2DResource = response.data["projection"]["2D"]["normal"]
                this.transform2DResource = response.data["projection"][0]

                // this.transform3DResource = response.data["projection"]["3D"]
                this.transformTextureSize[0] = response.data["texture_size"]["projection"][0]
                this.transformTextureSize[1] = response.data["texture_size"]["projection"][1]

            })
            .catch((error) => {
                console.log("ERROR::RESOURCE_NOT_LOAD_BY_URL", error)
            });
    }
}

class DynamicController {

    constructor(constraints) {
        this.particleNum = 10000
        this.segmentNum = 32
        this.speedFactor = 5.0
        this.dropRate = 0.003
        this.dropRateBump = 0.001
        this.fillWidth = 1.0
        this.aaWidth = 2.0
        this.isUnsteady = true
        this.stop = false

        this["particleNum"] = this.particleNum

        if (constraints) {
            this.constraints = constraints
        } else {
            this.constraints = {
                MAX_TEXTURE_SIZE: 0.0,
                MAX_STREAMLINE_NUM: 0.0,
                MAX_SEGMENT_NUM: 0.0,
                MAX_DORP_RATE: 0.0,
                MAX_DORP_RATE_BUMP: 0.0
            }
        }
    }
    Create(constraints) {
        return new DynamicController(constraints)
    }
}

class FrameTimer {

    constructor() {

        this.progress = 0.0
        this.totalPrograseRate = 0.0
        this.phaseCount = 0.0
        this.timeCount = 0.0
        this.timeLast = 0.0
        this.tickPerPhase = 0.0
    }

    tickTimer() {
        let lastPhase = Math.floor(this.timeCount / this.tickPerPhase)
        let nowPhase = Math.floor((this.timeCount + 1) % this.timeLast / this.tickPerPhase)

        this.timeCount = (this.timeCount + 1) % this.timeLast
        this.progress = this.timeCount % this.tickPerPhase / this.tickPerPhase

        if (Math.abs(nowPhase - lastPhase) === 1) return true
        return false
    }
}


let parser
let controller
let frameTimer

/**
 * @type {Scratch.Screen}
 */
let screen

let centerX = new Float32Array([0.0, 0.0]) //[HIGH, LOW]
let centerY = new Float32Array([0.0, 0.0]) //[HIGH, LOW]
let g_matrix = new Float32Array(16).fill(0)

let aliveNumIndirectRef
let aliveNum_indirect

let mapBuffer
let gDynamicBuffer

let simuBindArr
let bindingIndex = 0;

let simulation_pipeline
let simulation_pass
let render_pass
let stageName
let stage
let gui

let singleTestBinding
let flowTextureArr
let flowTextureArrSize = 3
let startReadIndex = 0
let startStorageIndex = 1
let utex
let vtex
let uvtex

// flow 注意修改speedfactor
// let prefix = '/images/9711/'
let prefix = '/myBackEnd/9711/'
// let prefix = '/myBackEnd/smallFlow/'
// let prefix = '/myBackEnd/9711flow/'

let jsonPrefix = '/api/v1/data/nc/field/wind/9711/json?name='
let picPrefix = '/api/v1/data/nc/field/wind/9711/pic?name='


const setGUI = (controller) => {

    gui = new GUI()

    gui.domElement.style.display = "none"
    gui.domElement.style.position = "absolute"
    gui.domElement.style.right = "100px"
    gui.domElement.style.top = "100px"
    const guidiv = document.getElementsByClassName("dg ac")[0]
    guidiv.style.zIndex = '2'

    const folder = gui.addFolder("Controller")
    folder.add(controller, "stop", false)
    folder.add(controller, "particleNum", 0, parser.maxTrajectoryNum)
    folder.add(controller, "segmentNum", 1, parser.maxSegmentNum)
    folder.add(controller, "speedFactor", 0.0, 10.0)
    folder.add(controller, "dropRate", 0.0, 1.0)
    folder.add(controller, "dropRateBump", 0.0, 1.0)
    folder.add(controller, "fillWidth", 0.0, 5.0)
    folder.add(controller, "aaWidth", 0.0, 5.0)
    folder.open()
}


const init = async (sceneTexture) => {


    // parser = new DescriptionParser("/images/9711/9711.json")
    parser = new DescriptionParser(jsonPrefix+'flow_field_description.json')


    await parser.Parsing()

    controller = new DynamicController({
        MAX_TEXTURE_SIZE: parser.maxTextureSize,
        MAX_STREAMLINE_NUM: parser.maxTrajectoryNum,
        MAX_SEGMENT_NUM: parser.maxSegmentNum,
        MAX_DORP_RATE: parser.maxDropRate,
        MAX_DORP_RATE_BUMP: parser.maxDropRateBump
    })
    setGUI(controller)

    frameTimer = new FrameTimer()

    screen = sceneTexture

    frameTimer.phaseCount = parser.flowFieldResourceArray.length
    frameTimer.progress = 0.0
    frameTimer.timeCount = 0
    frameTimer.tickPerPhase = 180
    frameTimer.timeLast = frameTimer.phaseCount * frameTimer.tickPerPhase
    frameTimer.totalPrograseRate = 0.0

    /////////Data prepare
    //// BUFFER
    let defaultPositions = new Float32Array(parser.maxTrajectoryNum * parser.maxSegmentNum * 2)
    for (let i = 0; i < defaultPositions.length; ++i) {
        defaultPositions[i] = Math.random()
    }
    let positionRef = Scratch.aRef(defaultPositions, 'positionRef');
    let position_storage = Scratch.StorageBuffer.create({
        name: 'position_storage',
        resource: { arrayRef: positionRef }
    })

    let defaultAges = new Float32Array(parser.maxTrajectoryNum).fill(parser.maxSegmentNum * 10.0)
    for (let i = 0; i < 10; i++) {
        defaultAges[i] += Number.parseInt(Math.random() * 10)
    }

    let ageRef = Scratch.aRef(defaultAges, 'ageRef')
    let age_storage = Scratch.StorageBuffer.create({
        name: 'age_storage',
        resource: { arrayRef: ageRef }
    })

    let defaultAttribs = new Float32Array(parser.maxTrajectoryNum * parser.maxSegmentNum).fill(0.0)
    let attribRef = Scratch.aRef(defaultAttribs, 'attribRef')
    let attrib_storage = Scratch.StorageBuffer.create({
        name: 'attrib_storage',
        resource: { arrayRef: attribRef }
    })

    let defaultIndexes = new Uint32Array(parser.maxTrajectoryNum).fill(0)
    let indexRef = Scratch.aRef(defaultIndexes, 'indexRef')
    let index_storage = Scratch.StorageBuffer.create({
        name: 'index_storage',
        resource: { arrayRef: indexRef }
    })

    let defaultAliveNumIndirect = new Uint32Array([(parser.maxSegmentNum - 1) * 2, controller.particleNum, 0, 0])
    // let defaultAliveNumIndirect = new Uint32Array([4, controller.particleNum, 0, 0])

    aliveNumIndirectRef = Scratch.aRef(defaultAliveNumIndirect, 'aliveNumIndirectRef')
    aliveNum_indirect = Scratch.IndirectBuffer.create({
        name: 'aliveNum_indirect',
        randomAccessible: true,
        resource: { arrayRef: aliveNumIndirectRef }
    })

    mapBuffer = Scratch.MapBuffer.create({
        name: 'mapbuffer',
        mapTarget: aliveNum_indirect
    })

    //// TEXTURE
    flowTextureArr = new Array(flowTextureArrSize)


    flowTextureArr[0] = Scratch.imageLoader.load('flowTexture0', picPrefix + parser.flowFieldResourceArray[0], undefined, 'rg32float')
    flowTextureArr[1] = Scratch.imageLoader.load('flowTexture1', picPrefix + parser.flowFieldResourceArray[0], undefined, 'rg32float')
    flowTextureArr[2] = Scratch.imageLoader.load('flowTexture2', picPrefix + parser.flowFieldResourceArray[0], undefined, 'rg32float')

    // utex = Scratch.imageLoader.load('utex', "/images/9711/texU.png", undefined, 'rg32float')
    // vtex = Scratch.imageLoader.load('vtex', "/images/9711/texV.png", undefined, 'rg32float')
    // uvtex = Scratch.imageLoader.load('uvtex', "/images/9711/texUVnorm.png", undefined, 'rg32float')



    const transformTex = Scratch.imageLoader.load('transformTex',picPrefix + parser.transform2DResource, undefined, 'rg32float')

    const seedTexture = Scratch.imageLoader.load('seedTexture',picPrefix + parser.seedingResourceArray[0])

    const groupNum = Math.ceil(Math.sqrt(parser.maxTrajectoryNum / 16 / 16))

    // Uniform Buffer
    gDynamicBuffer = Scratch.UniformBuffer.create({
        name: 'Uniform Buffer (Flow Field Visualization Dynamic)',
        blocks: [
            Scratch.bRef({
                name: 'flowUniform',
                dynamic: true,
                map: {
                    groupSize: {
                        type: 'vec2u',
                        value: () => [groupNum, groupNum],
                    },
                    canvasSize: {
                        type: 'vec2u',
                        value: () => [screen.context.canvas.width, screen.context.canvas.height],
                        // value: () => [screen.texture.width, screen.texture.height],
                    },
                    progress: {
                        type: 'f32',
                        value: () => frameTimer.progress,
                    },
                    particleNum: {
                        type: 'u32',
                        value: () => controller.particleNum,
                    },
                    segmentNum: {
                        type: 'f32',
                        value: () => controller.segmentNum,
                    },
                    fullLife: {
                        type: 'f32',
                        value: () => parser.maxSegmentNum * 10,
                    },
                    dropRate: {
                        type: 'f32',
                        value: () => controller.dropRate,
                    },
                    dropRateBump: {
                        type: 'f32',
                        value: () => controller.dropRateBump,
                    },
                    speedFactor: {
                        type: 'f32',
                        value: () => controller.speedFactor * 0.1,//for 9711 wind especially
                    },
                    randomSeed: {
                        type: 'f32',
                        value: () => Math.random(),
                    },
                    startStorageIndex: {
                        type: 'f32',
                        value: () => startStorageIndex,
                    },
                    startReadIndex: {
                        type: 'f32',
                        value: () => startReadIndex,
                    },
                    fillWidth: {
                        type: 'f32',
                        value: () => controller.fillWidth,
                    },
                    aaWidth: {
                        type: 'f32',
                        value: () => controller.aaWidth,
                    },
                    maxParticleNum: {
                        type: 'f32',
                        value: () => parser.maxTrajectoryNum,
                    },
                    maxSegmentNum: {
                        type: 'f32',
                        value: () => parser.maxSegmentNum,
                    },
                    flowBoundary: {
                        type: 'vec4f',
                        value: () => parser.flowBoundary,
                    },
                    u_centerHigh: {
                        type: 'vec2f',
                        value: () => [centerX[0], centerY[0]],
                    },
                    u_centerLow: {
                        type: 'vec2f',
                        value: () => [centerX[1], centerY[1]],
                    },
                    u_matrix: {
                        type: 'mat4x4f',
                        value: () => g_matrix,
                    },
                }
            })
        ]
    }).use()

    //// BINDING

    ///// mutiple simu binding
    singleTestBinding = Scratch.Binding.create({
        name: 'simulation_binding singgle test ',
        range: () => [groupNum, groupNum, 1],
        sharedUniforms: [
            { buffer: gDynamicBuffer }
        ],
        textures: [
            { texture: flowTextureArr[0], sampleType: 'unfilterable-float' },
            { texture: flowTextureArr[0], sampleType: 'unfilterable-float' },
            { texture: seedTexture, sampleType: 'float' },
            // { texture: utex, sampleType: 'unfilterable-float' },
            // { texture: vtex, sampleType: 'unfilterable-float' },
            // { texture: uvtex, sampleType: 'unfilterable-float' },
        ],
        storages: [
            { writable: true, buffer: position_storage, },
            { writable: true, buffer: index_storage },
            { writable: true, buffer: aliveNum_indirect },
            { writable: true, buffer: age_storage },
            { writable: true, buffer: attrib_storage },

        ]
    })


    simuBindArr = new Array(3);
    simuBindArr[0] = Scratch.Binding.create({
        name: 'simulation_binding 0',
        range: () => [groupNum, groupNum, 1],
        sharedUniforms: [
            { buffer: gDynamicBuffer }
        ],
        textures: [
            { texture: flowTextureArr[0], sampleType: 'unfilterable-float' },
            { texture: flowTextureArr[1], sampleType: 'unfilterable-float' },
            { texture: seedTexture, sampleType: 'float' },
        ],
        storages: [
            { writable: true, buffer: position_storage, },
            { writable: true, buffer: index_storage },
            { writable: true, buffer: aliveNum_indirect },
            { writable: true, buffer: age_storage },
            { writable: true, buffer: attrib_storage },

        ]
    })

    simuBindArr[1] = Scratch.Binding.create({
        name: 'simulation_binding 1',
        range: () => [groupNum, groupNum, 1],
        sharedUniforms: [
            { buffer: gDynamicBuffer }
        ],
        textures: [
            { texture: flowTextureArr[1], sampleType: 'unfilterable-float' },
            { texture: flowTextureArr[2], sampleType: 'unfilterable-float' },
            { texture: seedTexture, sampleType: 'float' },
        ],
        storages: [
            { writable: true, buffer: position_storage, },
            { writable: true, buffer: index_storage },
            { writable: true, buffer: aliveNum_indirect },
            { writable: true, buffer: age_storage },
            { writable: true, buffer: attrib_storage },
        ]
    })

    simuBindArr[2] = Scratch.Binding.create({
        name: 'simulation_binding 2',
        range: () => [groupNum, groupNum, 1],
        sharedUniforms: [
            { buffer: gDynamicBuffer }
        ],
        textures: [
            { texture: flowTextureArr[2], sampleType: 'unfilterable-float' },
            { texture: flowTextureArr[0], sampleType: 'unfilterable-float' },
            { texture: seedTexture, sampleType: 'float' },
        ],
        storages: [
            { writable: true, buffer: position_storage, },
            { writable: true, buffer: index_storage },
            { writable: true, buffer: aliveNum_indirect },
            { writable: true, buffer: age_storage },
            { writable: true, buffer: attrib_storage },

        ]
    })

    let render_binding = Scratch.Binding.create({
        // range: () => [(parser.maxSegmentNum - 1) * 2, 1000, 0, 0],
        // range: () => [4, 100, 0, 0],

        name: 'render_binding',
        sharedUniforms: [
            { buffer: gDynamicBuffer }
        ],
        textures: [
            { texture: transformTex, sampleType: 'unfilterable-float' },
        ],
        indirect: { buffer: aliveNum_indirect },
        storages: [
            { buffer: position_storage },
            { buffer: index_storage },
            { buffer: attrib_storage },
        ]
    })

    //// PIPELINE
    simulation_pipeline = Scratch.ComputePipeline.create({
        name: 'simulation_pipeline',
        constants: { blockSize: 16 },
        shader: Scratch.shaderLoader.load('FFsimu', '/shader/9711simu.wgsl')
    })

    let render_pipeline = Scratch.RenderPipeline.create({
        name: 'render_pipeline',
        shader: { module: Scratch.shaderLoader.load('FFrendLHY', '/shader/9711rend.wgsl') },
        colorTargetStates: [{ blend: Scratch.PremultipliedBlending }],
        primitive: { topology: 'triangle-strip' },
    })

    //// PASS
    simulation_pass = Scratch.ComputePass.create({
        name: 'simulation pass',
    }).add(simulation_pipeline, simuBindArr[bindingIndex]);
    // simulation_pass = Scratch.ComputePass.create({
    //     name: 'simulation pass',
    // }).add(simulation_pipeline, singleTestBinding);

    render_pass = Scratch.RenderPass.create({
        name: 'render pass',
        colorAttachments: [
            {
                // colorResource: screen,
                // loadOp: 'load',
                colorResource:screen.getCurrentCanvasTexture(),
                loadOp:'clear'
            }
        ],
    }).add(render_pipeline, render_binding);


    // Scratch.director.addStage({
    //     name: 'Flow Field Shower',
    //     items: [
    //         simulation_pass,
    //         render_pass,
    //     ]
    // })

    return {
        simulationPass: simulation_pass,
        renderPass: render_pass,
    }

    //// EXECUTE
    // Scratch.director.addStage({
    //     name: 'Flow Field Shower',
    //     items: [
    //         simulation_pass,
    //         render_pass,
    //     ]
    // })

}

const encodeFloatToDouble = (value) => {
    const result = new Float32Array(2);
    result[0] = value;
    const delta = value - result[0];
    result[1] = delta;
    return result;
}

let stopped = false;
const tickLogic = (mapbox_matrix, mercatorCenter, ogMatrix) => {

    if (controller.stop) {
        simulation_pass.empty()
        stopped = true
    }
    if (!controller.stop && stopped) {
        simulation_pass.add(simulation_pipeline, simuBindArr[bindingIndex])
        // simulation_pass.add(simulation_pipeline, singleTestBinding)
        stopped = false
    }
    if (!controller.stop) {
        // aliveNumIndirectRef.value = new Uint32Array([(parser.maxSegmentNum - 1) * 2, 0, 0, 0]);
        aliveNumIndirectRef.elements(1, 0)

        startReadIndex = (startReadIndex + 1) % parser.maxSegmentNum
        startStorageIndex = (startStorageIndex + 1) % parser.maxSegmentNum

        if (frameTimer.tickTimer()) {

            let nowPhase = Math.floor(frameTimer.timeCount / frameTimer.tickPerPhase)
            let updatePhase = (nowPhase + 1) % frameTimer.phaseCount

            // using mutiple binding
            bindingIndex = nowPhase % flowTextureArrSize
            simulation_pass.empty()
            simulation_pass.add(simulation_pipeline, simuBindArr[bindingIndex])
            // simulation_pass.add(simulation_pipeline, singleTestBinding)
            updateReparse(flowTextureArr[updatePhase % flowTextureArrSize],picPrefix+ parser.flowFieldResourceArray[updatePhase]);

            // single texture test
            // simulation_pass.empty()
            // simulation_pass.add(simulation_pipeline, simuBindArr[bindingIndex])
        }

    }


    if (0 && frameTimer.timeCount % 5 === 0) {
        mapBuffer.mapping().then((buffer) => {
            console.log("aliveNum", (new Uint32Array(buffer)))
        })
    }

    centerX = encodeFloatToDouble(mercatorCenter[0])
    centerY = encodeFloatToDouble(mercatorCenter[1])

    g_matrix = new Float32Array(ogMatrix)

    // screen.swap()

}

export function showFlowField(visibility) {

    if (visibility) {
        // controller.stop = false
        Scratch.director.showStage('WindLayer9711 Shower')
        // gui.show()
        gui.hide()
    }
    else {
        // controller.stop = true
        Scratch.director.hideStage('WindLayer9711 Shower')
        gui.hide()
    }
}

const rendering = (mapbox_matrix, mercatorCenter) => {
    tickLogic(mapbox_matrix, mercatorCenter)
    // tickRender()
}


const updateReparse = (oldTexture, url) => {

    // get rgba8 image buffer
    const imgBuffer = Scratch.imageBufferLoader.load('imgBuffer', url, false)

    const updateDesc = {
        format: "rg32float",
        resource: {
            dataType: 'buffer',
            buffer: () => imgBuffer.buffer
        }
    }
    // when buffer load  call back to reparse
    imgBuffer.registerCallback(() => {
        if (imgBuffer.resource.dataType === 'clean') {
            oldTexture.reset(updateDesc)
        }
    })
}


export {
    init,
    tickLogic,
    rendering,
}