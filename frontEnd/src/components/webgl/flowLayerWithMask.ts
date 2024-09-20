import axios from "axios";
import * as util from './util'
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Delaunay } from 'd3-delaunay'
import * as dat from 'dat.gui'
import earcut from 'earcut'

type basicType = {
    id: string
    geojsonURL: string
    stationURL: string
    uvURLs: string[]
    binPrefix: string
}
type paramsType = {
    particleNum: number,
    velocityFactor: number,
    aaWidth: number,
    fillWidth: number,
    fadeFactor: number,
    framePerStep: number
}
type configureType = basicType & paramsType


class FlowLayer {
    id: string
    type: string = 'custom'

    geojsonURL: string = ''
    stationURL: string = ''
    binPrefix: string = ''
    uvURLs: string[] = []

    // fuck 
    // uvUrlList: string[] = []
    // currentResourcePointer: number = 0
    // maxSpeed: number = 0


    ready: boolean = false
    map: mapbox.Map | null = null
    GL: WebGL2RenderingContext | null = null

    gui: dat.GUI | null = null


    program_mask: WebGLProgram | null = null
    Locations_mask: { [name: string]: number | WebGLUniformLocation | null } = {}
    maskTexture: WebGLTexture | null = null
    maskFbo: WebGLFramebuffer | null = null
    vao_mask: WebGLVertexArrayObject | null = null
    maskPosBuffer: WebGLBuffer | null = null
    maskIndexBuffer: WebGLBuffer | null = null
    maskIndexLength: number = 0

    programe_delaunay: WebGLProgram | null = null
    Locations_delaunay: { [name: string]: number | WebGLUniformLocation | null } = {}

    indexLength_delaunay: number = 0
    vertexData_station: Float32Array | null = null
    indexData_station: Uint32Array | null = null
    velocityData_Array: Float32Array[] = []
    velocityData_from: Float32Array | null = null
    velocityData_to: Float32Array | null = null
    totalResourceCount: number = 26
    uvResourcePointer: number = 1
    particleRandomInitData: number[] = []
    velocityEmptyInitData: number[] = []

    vao_delaunay: WebGLVertexArrayObject | null = null
    stationBuffer: WebGLBuffer | null = null
    stationIndexBuffer: WebGLBuffer | null = null
    velocityBuffer_from: WebGLBuffer | null = null
    velocityBuffer_to: WebGLBuffer | null = null

    uvTexture: WebGLTexture | null = null
    fbo_delaunay: WebGLFramebuffer | null = null

    Locations_showing: { [name: string]: number | WebGLUniformLocation | null } = {}
    program_showing: WebGLProgram | null = null
    vao_showing: WebGLVertexArrayObject | null = null
    positionBuffer_showing: WebGLBuffer | null = null
    texCoordBuffer_showing: WebGLBuffer | null = null
    showingTexture: WebGLTexture | null = null


    testTexture: WebGLTexture | null = null

    Locations_simulate: { [name: string]: number | WebGLUniformLocation | null } = {}
    program_simulate: WebGLProgram | null = null
    pposBuffer_simulate_1: WebGLBuffer | null = null
    pposBuffer_simulate_2: WebGLBuffer | null = null
    vao_simulate_1: WebGLVertexArrayObject | null = null
    vao_simulate_2: WebGLVertexArrayObject | null = null
    // velocityBuffer: WebGLBuffer | null = null
    velocityBuffer1: WebGLBuffer | null = null
    velocityBuffer2: WebGLBuffer | null = null

    xfo_simulate_1: WebGLTransformFeedback | null = null
    xfo_simulate_2: WebGLTransformFeedback | null = null


    program_segmentShowing: WebGLProgram | null = null
    Locations_segmentShowing: { [name: string]: number | WebGLUniformLocation | null } = {}
    vao_segmentShowing1: WebGLVertexArrayObject | null = null
    vao_segmentShowing2: WebGLVertexArrayObject | null = null


    program_historyShowing: WebGLProgram | null = null
    Locations_historyShowing: { [name: string]: number | WebGLUniformLocation | null } = {}
    trajectoryTexture_1: WebGLTexture | null = null
    trajectoryTexture_2: WebGLTexture | null = null
    fbo_historyShowing_1: WebGLFramebuffer | null = null
    fbo_historyShowing_2: WebGLFramebuffer | null = null

    program_finalShowing: WebGLProgram | null = null
    Locations_finalShowing: { [name: string]: number | WebGLUniformLocation | null } = {}


    nowXFVAO_simu: WebGLVertexArrayObject | null = null
    nowXFO_simu: WebGLTransformFeedback | null = null
    nowSegRenderVAO: WebGLVertexArrayObject | null = null
    nowRenderFBO: WebGLFramebuffer | null = null
    nowHideFBO: WebGLFramebuffer | null = null
    nowHistoryTrajectoryTexture: WebGLTexture | null = null
    nowTotalTrajectoryTexture: WebGLTexture | null = null




    programControl: { [name: string]: Boolean } = {}


    /// static data
    flowExtent: number[] = [9999, 9999, -9999, -9999] //xmin, ymin, xmax, ymax
    flowMaxVelocity: number = 0
    particleNum: number = 65536
    dropRate: number = 0.003
    dropRateBump: number = 0.001
    velocityFactor: number = 100.0
    fadeFactor: number = 0.97
    aaWidth: number = 1.0
    fillWidth: number = 2.0

    // max
    maxParticleNum: number = 65536
    maxVelocityFactor: number = 100.0

    /// dynamic data
    globalFrames: number = 0
    randomSeed = Math.random()
    framePerStep = 120 //frame
    localFrames = 0
    progressRatio = 0
    mapExtent: number[] = [9999, 9999, -9999, -9999] //xmin, ymin, xmax, ymax

    constructor(configure: configureType) {
        this.id = configure.id
        this.geojsonURL = configure.geojsonURL
        this.stationURL = configure.stationURL
        this.uvURLs = configure.uvURLs
        this.uvUrlList = configure.uvURLs
        this.binPrefix = configure.binPrefix

        this.totalResourceCount = configure.uvURLs.length
        this.uvResourcePointer = 1
        this.currentResourcePointer = 1

        this.particleNum = configure.particleNum
        this.velocityFactor = configure.velocityFactor
        this.aaWidth = configure.aaWidth
        this.fillWidth = configure.fillWidth
        this.fadeFactor = configure.fadeFactor
        this.framePerStep = configure.framePerStep
    }

    async onAdd(map: mapbox.Map, gl: WebGL2RenderingContext) {

        // this.initGUI()
        const available_extensions = gl.getSupportedExtensions();
        available_extensions?.forEach(ext => {
            gl.getExtension(ext)
        })


        this.map = map
        this.GL = gl

        await this.programInit_mask(gl)

        await this.programInit_delaunay(gl)

        await this.programInit_showing(gl)

        await this.programInit_simulate(gl)

        await this.programInit_segmentShowing(gl)

        await this.programInit_historyShowing(gl)

        await this.programInit_finalShowing(gl)

        this.programControl = {
            'delaunay': true,
            'delaunay_showing': false,
            'simulate': true,
            'final_showing': true,
            'clear_fbo': false,
            'onlySegment': false,
            'historyAndSegment': true
        }

        window.addEventListener('keydown', (e: any) => {
            if (e.key === '1') {
                // this.hide()
                this.particleNum = 1000   
            }else if (e.key === '2') {
                // this.show()
                this.particleNum = 65536    
            }
        })

        const idle = () => {
            // this.programControl['delaunay_showing'] = false
            this.programControl['historyAndSegment'] = false
            this.programControl['onlySegment'] = true

            // this.programControl['clear_fbo'] = true

        }

        const restart = () => {
            reSeed()
            // this.programControl['delaunay_showing'] = false
            this.programControl['historyAndSegment'] = true
            this.programControl['onlySegment'] = false

            // this.programControl['clear_fbo'] = false

        }

        this.map.on('movestart', idle)
        this.map.on('move', idle)
        this.map.on('moveend', restart)
        this.map.on('dragstart', idle)
        this.map.on('drag', idle)
        this.map.on('dragend', restart)
        this.map.on('zoomstart', idle)
        this.map.on('zoom', idle)
        this.map.on('zoomend', restart)
        this.map.on('rotatestart', idle)
        this.map.on('rotate', idle)
        this.map.on('rotateend', restart)
        this.map.on('pitchstart', idle)
        this.map.on('pitch', idle)
        this.map.on('pitchend', restart)

        const reSeed = () => {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.pposBuffer_simulate_1)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.particleRandomInitData), gl.STATIC_DRAW)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer1)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.velocityEmptyInitData), gl.STATIC_DRAW)

            gl.bindBuffer(gl.ARRAY_BUFFER, this.pposBuffer_simulate_2)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.particleRandomInitData), gl.STATIC_DRAW)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer2)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.velocityEmptyInitData), gl.STATIC_DRAW)
            gl.bindBuffer(gl.ARRAY_BUFFER, null)
        }

        this.nowHistoryTrajectoryTexture = this.trajectoryTexture_1
        this.nowTotalTrajectoryTexture = this.trajectoryTexture_2

        this.ready = true

    }

    render(gl: WebGL2RenderingContext, matrix: Array<number>) {
        if (this.ready) {

            let mapCenterInMercator = mapbox.MercatorCoordinate.fromLngLat(this.map!.getCenter())
            let mercatorCenterOffsetMatrix = [
                1, 0, 0, mapCenterInMercator.x,
                0, 1, 0, mapCenterInMercator.y,
                0, 0, 1, 0,
                0, 0, 0, 1
                // 1, 0, 0, 0,
                // 0, 1, 0, 0,
                // 0, 0, 1, 0,
                // 0,0,0,1
            ]
            let centerXdecode = util.encodeFloatToDouble(mapCenterInMercator.x)
            let centerYdecode = util.encodeFloatToDouble(mapCenterInMercator.y)

            ////////// update dynamic data
            this.globalFrames += 1
            this.localFrames = (this.localFrames + 1) % this.framePerStep
            this.progressRatio = this.localFrames / this.framePerStep
            this.mapExtent = getMapExtent(this.map!)
            this.randomSeed = Math.random()

            /// ensure particle num not descrease
            // this.validExtentCheck(gl)

            if (this.localFrames === 0) {
                this.nextStep(gl)
            }

            this.xfSwap(this.globalFrames)



            /////////// 0 :: mask program to get mask texture
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.maskFbo)
            gl.useProgram(this.program_mask!)
            // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

            gl.bindVertexArray(this.vao_mask)
            gl.uniformMatrix4fv(this.Locations_mask['u_matrix'] as WebGLUniformLocation, false, matrix)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.maskIndexBuffer)
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.drawElements(gl.TRIANGLES, this.maskIndexLength, gl.UNSIGNED_SHORT, 0)
            gl.bindFramebuffer(gl.FRAMEBUFFER, null)




            ////////// 1st::: delaunay program to get uv texture

            if (this.programControl['delaunay']) {

                gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo_delaunay)
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)

                gl.useProgram(this.programe_delaunay!)
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
                gl.uniformMatrix4fv(this.Locations_delaunay['u_matrix'] as WebGLUniformLocation, false, matrix)
                gl.uniform4f(this.Locations_delaunay['u_flowExtent'] as WebGLUniformLocation, this.flowExtent[0], this.flowExtent[1], this.flowExtent[2], this.flowExtent[3])
                gl.uniform1f(this.Locations_delaunay['progressRatio'] as WebGLUniformLocation, this.progressRatio)
                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, this.maskTexture!)
                gl.uniform1i(this.Locations_delaunay['maskTexture'] as WebGLUniformLocation, 0)
                gl.bindVertexArray(this.vao_delaunay)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.stationIndexBuffer)

                gl.drawElements(gl.TRIANGLES, this.indexLength_delaunay, gl.UNSIGNED_INT, 0)

                gl.bindFramebuffer(gl.FRAMEBUFFER, null)
            }




            // ////////// 3rd::: simulate program to get new position
            if (this.programControl['simulate']) {
                gl.enable(gl.RASTERIZER_DISCARD)

                gl.useProgram(this.program_simulate!)
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
                gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.nowXFO_simu!)
                // gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.xfo_simulate_1)
                // gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.pposBuffer_simulate_2)// output
                // gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, this.velocityBuffer2)// output

                gl.bindVertexArray(this.nowXFVAO_simu)
                // gl.bindVertexArray(this.vao_simulate_1)
                gl.uniform4f(this.Locations_simulate['mapExtent'], this.mapExtent[0], this.mapExtent[1], this.mapExtent[2], this.mapExtent[3])
                gl.uniform4f(this.Locations_simulate['flowExtent'], this.flowExtent[0], this.flowExtent[1], this.flowExtent[2], this.flowExtent[3])
                gl.uniformMatrix4fv(this.Locations_simulate['u_matrix'], false, matrix)
                gl.uniform1f(this.Locations_simulate['maxSpeed'], this.flowMaxVelocity)
                gl.uniform1f(this.Locations_simulate['randomSeed'], Math.random())

                gl.uniform1i(this.Locations_simulate['particleNum'], this.particleNum)
                gl.uniform1f(this.Locations_simulate['dropRate'], this.dropRate)
                gl.uniform1f(this.Locations_simulate['dropRateBump'], this.dropRateBump)
                gl.uniform1f(this.Locations_simulate['speedFactor'], this.velocityFactor)
                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, this.uvTexture!)

                gl.beginTransformFeedback(gl.POINTS)
                gl.drawArrays(gl.POINTS, 0, this.particleNum)
                gl.endTransformFeedback()
                gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)
                gl.bindBuffer(gl.ARRAY_BUFFER, null)
                gl.disable(gl.RASTERIZER_DISCARD)
            }

            ////////////// clear fbo
            if (this.programControl['clear_fbo']) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.nowHideFBO) // render to trajectoryTexture_1
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.bindFramebuffer(gl.FRAMEBUFFER, null)

                gl.bindFramebuffer(gl.FRAMEBUFFER, this.nowRenderFBO) // render to trajectoryTexture_1
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.bindFramebuffer(gl.FRAMEBUFFER, null)
            }



            ////////4 ::: render to frame buffer
            //// 4.1 ::: the history trajectory showing program 
            if (this.programControl['historyAndSegment']) {
                // gl.enable(gl.BLEND);
                // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.nowRenderFBO!) // render to frame buffer
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                // gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo_historyShowsing_1) // render to trajectoryTexture_1
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

                gl.useProgram(this.program_historyShowing!)

                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, this.nowHistoryTrajectoryTexture!) // history info in trajectoryTexture_1
                gl.uniform1i(this.Locations_historyShowing['showTexture'] as WebGLUniformLocation, 0)
                gl.activeTexture(gl.TEXTURE1)
                gl.bindTexture(gl.TEXTURE_2D, this.uvTexture!) // history info in trajectoryTexture_2
                gl.uniform1i(this.Locations_historyShowing['uv_texture'] as WebGLUniformLocation, 1)
                gl.uniform1f(this.Locations_historyShowing['fadeFactor'] as WebGLUniformLocation, this.fadeFactor)

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)


                // ////// 4.2 ::: the segment showing program  ///// single segment SHOWING  like particle
                gl.useProgram(this.program_segmentShowing!)
                gl.uniformMatrix4fv(this.Locations_segmentShowing['u_matrix'], false, matrix)
                gl.uniformMatrix4fv(this.Locations_segmentShowing['u_centerOffsetMatrix'], false, mercatorCenterOffsetMatrix)
                gl.uniform2f(this.Locations_segmentShowing['u_centerHigh'], centerXdecode[0], centerYdecode[0])
                gl.uniform2f(this.Locations_segmentShowing['u_centerLow'], centerXdecode[1], centerYdecode[1])

                gl.uniform1f(this.Locations_segmentShowing['maxSpeed'], this.flowMaxVelocity)
                gl.uniform2f(this.Locations_segmentShowing['u_canvasSize'], gl.canvas.width, gl.canvas.height)
                gl.uniform1f(this.Locations_segmentShowing['aaWidth'] as WebGLUniformLocation, this.aaWidth)
                gl.uniform1f(this.Locations_segmentShowing['fillWidth'] as WebGLUniformLocation, this.fillWidth)
                gl.bindVertexArray(this.nowSegRenderVAO)
                // gl.bindVertexArray(this.vao_segmentShowing1)
                // gl.drawArraysInstanced(gl.LINES, 0, 2, this.particleNum)
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.particleNum) //with anti-aliasing
                gl.bindFramebuffer(gl.FRAMEBUFFER, null)
            }

            if (this.programControl['onlySegment']) {

                gl.bindFramebuffer(gl.FRAMEBUFFER, this.nowRenderFBO!) // render to frame buffer
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

                gl.useProgram(this.program_segmentShowing!)
                gl.uniformMatrix4fv(this.Locations_segmentShowing['u_matrix'], false, matrix)
                gl.uniformMatrix4fv(this.Locations_segmentShowing['u_centerOffsetMatrix'], false, mercatorCenterOffsetMatrix)
                gl.uniform2f(this.Locations_segmentShowing['u_centerHigh'], centerXdecode[0], centerYdecode[0])
                gl.uniform2f(this.Locations_segmentShowing['u_centerLow'], centerXdecode[1], centerYdecode[1])

                gl.uniform1f(this.Locations_segmentShowing['maxSpeed'], this.flowMaxVelocity)
                gl.uniform2f(this.Locations_segmentShowing['u_canvasSize'], gl.canvas.width, gl.canvas.height)
                gl.uniform1f(this.Locations_segmentShowing['aaWidth'] as WebGLUniformLocation, this.aaWidth)
                gl.uniform1f(this.Locations_segmentShowing['fillWidth'] as WebGLUniformLocation, this.fillWidth)
                gl.bindVertexArray(this.nowSegRenderVAO)
                // gl.bindVertexArray(this.vao_segmentShowing1)
                // gl.drawArraysInstanced(gl.LINES, 0, 2, this.particleNum)

                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.particleNum) //with anti-aliasing
                gl.bindFramebuffer(gl.FRAMEBUFFER, null)
            }

            ////////// 2nd::: show uvTexture program  ///// background SHOWING
            if (this.programControl['delaunay_showing']) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.nowRenderFBO!)
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)

                gl.useProgram(this.program_showing!)
                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, this.uvTexture)
                gl.bindVertexArray(this.vao_showing)
                gl.uniform1i(this.Locations_showing['uv_texture'] as WebGLUniformLocation, 0)
                // gl.enable(gl.BLEND);
                // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
                gl.bindFramebuffer(gl.FRAMEBUFFER, null)

            }

            //////// 5 ::: render to canvas
            if (this.programControl['final_showing']) {
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
                gl.useProgram(this.program_finalShowing!)

                gl.activeTexture(gl.TEXTURE0)
                // gl.bindTexture(gl.TEXTURE_2D, this.maskTexture!) `````````````````````````
                gl.bindTexture(gl.TEXTURE_2D, this.nowTotalTrajectoryTexture!) // history info in trajectoryTexture_1
                gl.uniform1i(this.Locations_finalShowing['showTexture'] as WebGLUniformLocation, 0)
                gl.activeTexture(gl.TEXTURE1)
                gl.bindTexture(gl.TEXTURE_2D, this.uvTexture!)
                gl.uniform1i(this.Locations_finalShowing['uvTexture'] as WebGLUniformLocation, 1)
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            }
        }
        else {
            console.log('layer not readydd')
        }
        this.map!.triggerRepaint()
    }

    hide() {
        // stop render
        this.map?.setLayoutProperty(this.id, 'visibility', 'none')
    }

    show() {
        this.map?.setLayoutProperty(this.id, 'visibility', 'visible')
    }

    destroy() {
        this.map?.removeLayer(this.id)
    }

    // F EXPOSE
    get uvUrlList() {
        return this.uvURLs
    }
    set uvUrlList(value: string[]) {
        this.uvURLs = value
    }
    get currentResourcePointer() {
        return this.uvResourcePointer
    }
    set currentResourcePointer(value: number) {
        // this.uvResourcePointer = value
    }
    get maxSpeed() {
        return 100
    }
    set maxSpeed(value: number) {
        // this.flowMaxVelocity = value
    }
    get speedFactor() {
        return this.velocityFactor
    }
    set speedFactor(value: number) {
        this.velocityFactor = value
    }









    async setProgress(progress: number) {
        let x = Math.ceil(progress / 100 * (this.uvUrlList.length - 1))
        let next = x + 1;
        if (next == this.uvUrlList.length)
            next = 0

        let nowVelocityArrayIndex = (this.uvResourcePointer) % 3
        let nextVelocityArrayIndex = (this.uvResourcePointer + 1) % 3
        let nnextVelocityArrayIndex = (this.uvResourcePointer + 2) % 3

        // this.getVelocityData(this.binPrefix + this.uvURLs[x]).then(data => {
        //     this.progressRatio = 0
        //     this.velocityData_Array[nowVelocityArrayIndex] = data
        // })

        // this.getVelocityData(this.binPrefix + this.uvURLs[next]).then(data => {
        //     this.velocityData_Array[nextVelocityArrayIndex] = data
        // })

        const data = await this.getVelocityData(this.binPrefix + this.uvURLs[x])
        this.velocityData_Array[nowVelocityArrayIndex] = data

        const data2 = await this.getVelocityData(this.binPrefix + this.uvURLs[next])
        this.velocityData_Array[nextVelocityArrayIndex] = data2

        const data3 = await this.getVelocityData(this.binPrefix + this.uvURLs[nnextVelocityArrayIndex])
        this.velocityData_Array[nnextVelocityArrayIndex] = data3

        let gl = this.GL!

        this.velocityData_from = this.velocityData_Array[nowVelocityArrayIndex]
        this.velocityData_to = this.velocityData_Array[nextVelocityArrayIndex]

        gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer_from)
        gl.bufferData(gl.ARRAY_BUFFER, this.velocityData_from, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer_to)
        gl.bufferData(gl.ARRAY_BUFFER, this.velocityData_to, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)


        this.progressRatio = 0
        this.localFrames = 0
        this.uvResourcePointer = x

    }

    async programInit_mask(gl: WebGL2RenderingContext) {
        // const maskShapeUrl = '/geojson/CHENGTONG.geojson'
        const maskShapeUrl = this.geojsonURL;
        var data = await this.parsePolygon(maskShapeUrl)
        var vertexData = data.vertexData
        var indexData = data.indexData

        const vsSource = (await axios.get('/shaders/webgl/polygon.vert.glsl')).data
        const fsSource = (await axios.get('/shaders/webgl/polygon.frag.glsl')).data
        const vs = util.createShader(gl, gl.VERTEX_SHADER, vsSource)!
        const fs = util.createShader(gl, gl.FRAGMENT_SHADER, fsSource)!
        this.program_mask = util.createProgram(gl, vs, fs)!

        this.maskTexture = util.createCanvasSizeTexture(gl)
        this.maskFbo = gl.createFramebuffer()!
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.maskFbo)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.maskTexture, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        this.Locations_mask['a_postion'] = gl.getAttribLocation(this.program_mask, 'a_position')
        this.Locations_mask['u_matrix'] = gl.getUniformLocation(this.program_mask, 'u_matrix')

        this.maskPosBuffer = util.createVBO(gl, vertexData)
        this.maskIndexBuffer = util.createIBO(gl, indexData)
        this.maskIndexLength = indexData.length
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.vao_mask = gl.createVertexArray()!
        gl.bindVertexArray(this.vao_mask)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.maskPosBuffer)
        gl.enableVertexAttribArray(this.Locations_mask['a_postion'] as number)
        gl.vertexAttribPointer(
            this.Locations_mask['a_postion'] as number,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.bindVertexArray(null)
    }

    async programInit_delaunay(gl: WebGL2RenderingContext) {
        let { vertexData_station, indexData_station } = await this.getStationData(this.binPrefix + this.stationURL)
        this.vertexData_station = vertexData_station as Float32Array
        this.indexData_station = indexData_station

        // this.velocityData_Array.push(await this.getVelocityData('/flowResource/bin/uv_0.bin'))
        // this.velocityData_Array.push(await this.getVelocityData('/flowResource/bin/uv_1.bin'))
        // this.velocityData_Array.push(await this.getVelocityData('/flowResource/bin/uv_2.bin'))

        this.velocityData_Array.push(await this.getVelocityData(this.binPrefix + this.uvURLs[0]))
        this.velocityData_Array.push(await this.getVelocityData(this.binPrefix + this.uvURLs[1]))
        this.velocityData_Array.push(await this.getVelocityData(this.binPrefix + this.uvURLs[2]))

        this.uvResourcePointer = 1
        let toIndex = this.uvResourcePointer
        let fromIndex = (this.uvResourcePointer + 2) % 3
        this.velocityData_from = this.velocityData_Array[fromIndex]
        this.velocityData_to = this.velocityData_Array[toIndex]

        ////////// 1st::: delaunay program to get uv texture

        const vsSource_delaunay = (await axios.get('/shaders/webgl/delaunay.vert.glsl')).data
        const fsSource_delaunay = (await axios.get('/shaders/webgl/delaunay.frag.glsl')).data
        const vs_delaunay = util.createShader(gl, gl.VERTEX_SHADER, vsSource_delaunay)!
        const fs_delaunay = util.createShader(gl, gl.FRAGMENT_SHADER, fsSource_delaunay)!
        this.programe_delaunay = util.createProgram(gl, vs_delaunay, fs_delaunay)!

        this.Locations_delaunay['a_postion'] = gl.getAttribLocation(this.programe_delaunay!, 'a_position')
        this.Locations_delaunay['a_velocity_from'] = gl.getAttribLocation(this.programe_delaunay!, 'a_velocity_from')
        this.Locations_delaunay['a_velocity_to'] = gl.getAttribLocation(this.programe_delaunay, 'a_velocity_to')

        this.Locations_delaunay['progressRatio'] = gl.getUniformLocation(this.programe_delaunay!, 'progressRatio')
        this.Locations_delaunay['u_flowExtent'] = gl.getUniformLocation(this.programe_delaunay!, 'u_flowExtent')
        this.Locations_delaunay['u_matrix'] = gl.getUniformLocation(this.programe_delaunay!, 'u_matrix')
        this.Locations_delaunay['u_maskTexture'] = gl.getUniformLocation(this.programe_delaunay!, 'u_maskTexture')


        ///// vertex data
        this.vao_delaunay = gl.createVertexArray()!
        gl.bindVertexArray(this.vao_delaunay)
        this.indexLength_delaunay = indexData_station.length
        this.stationBuffer = util.createVBO(gl, Array.from(new Float32Array(vertexData_station)))
        gl.enableVertexAttribArray(this.Locations_delaunay['a_position'] as number)
        gl.vertexAttribPointer(
            this.Locations_delaunay['a_position'] as number,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )
        this.velocityBuffer_from = util.createVBO(gl, Array.from(new Float32Array(this.velocityData_from)))
        gl.enableVertexAttribArray(this.Locations_delaunay['a_velocity_from'] as number)
        gl.vertexAttribPointer(
            this.Locations_delaunay['a_velocity_from'] as number,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )
        this.velocityBuffer_to = util.createVBO(gl, Array.from(new Float32Array(this.velocityData_to)))
        gl.enableVertexAttribArray(this.Locations_delaunay['a_velocity_to'] as number)
        gl.vertexAttribPointer(
            this.Locations_delaunay['a_velocity_to'] as number,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )
        this.stationIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.stationIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indexData_station), gl.STATIC_DRAW);
        gl.bindVertexArray(null)

        ///// frame buffer
        this.uvTexture = util.createCanvasSizeTexture(gl, "RG32F")

        this.fbo_delaunay = gl.createFramebuffer()!
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo_delaunay)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.uvTexture, 0)

        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    async programInit_showing(gl: WebGL2RenderingContext) {

        ////////// 2nd::: show uvTexture program
        const vsSource_showing = (await axios.get('/shaders/webgl/showing.vert.glsl')).data
        const fsSource_showing = (await axios.get('/shaders/webgl/showing.frag.glsl')).data
        const vs_showing = util.createShader(gl, gl.VERTEX_SHADER, vsSource_showing)!
        const fs_showing = util.createShader(gl, gl.FRAGMENT_SHADER, fsSource_showing)!
        this.program_showing = util.createProgram(gl, vs_showing, fs_showing)!

        this.Locations_showing['a_pos'] = gl.getAttribLocation(this.program_showing, 'a_pos')
        this.Locations_showing['a_texCoord'] = gl.getAttribLocation(this.program_showing, 'a_texCoord')
        this.Locations_showing['uv_texture'] = gl.getUniformLocation(this.program_showing, 'uv_texture')


        this.vao_showing = gl.createVertexArray()!
        gl.bindVertexArray(this.vao_showing)
        const positionData_showing = [
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0
        ]
        this.positionBuffer_showing = util.createVBO(gl, positionData_showing)
        gl.enableVertexAttribArray(this.Locations_showing['a_pos'] as number)
        gl.vertexAttribPointer(
            this.Locations_showing['a_pos'] as number,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )
        const texCoordData_showing = [
            0, 1,
            1, 1,
            0, 0,
            1, 0,
        ]
        this.texCoordBuffer_showing = util.createVBO(gl, texCoordData_showing)
        gl.enableVertexAttribArray(this.Locations_showing['a_texCoord'] as number)
        gl.vertexAttribPointer(
            this.Locations_showing['a_texCoord'] as number,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )
        // this.showingTexture = util.createEmptyTexture(gl)!
        gl.bindVertexArray(null)
        // let image = await util.loadImageBitmap('/images/02texture/leaves.jpg') as ImageBitmap
        // this.testTexture = util.createEmptyTexture(gl)
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    }

    async programInit_simulate(gl: WebGL2RenderingContext) {
        let particleInfoData1 = new Array(this.maxParticleNum * 4).fill(0)
        let particleInfoData2 = new Array(this.maxParticleNum * 4).fill(0)
        let velocityColorData1 = new Array(this.maxParticleNum).fill(0)
        let velocityColorData2 = new Array(this.maxParticleNum).fill(0)

        for (let i = 0; i < this.maxParticleNum; i += 1) {
            particleInfoData2[i * 3 + 0] = particleInfoData1[i * 3 + 0] += Math.random()
            particleInfoData2[i * 3 + 1] = particleInfoData1[i * 3 + 1] += Math.random()
            particleInfoData2[i * 3 + 2] = particleInfoData1[i * 3 + 2] += Math.random()
            particleInfoData2[i * 3 + 3] = particleInfoData1[i * 3 + 3] += Math.random()
        }
        this.particleRandomInitData = particleInfoData1;
        this.velocityEmptyInitData = velocityColorData1
        const VSS = (await axios.get('/shaders/webgl/simulate.vert.glsl'))
        const FSS = (await axios.get('/shaders/webgl/simulate.frag.glsl'))
        const VS = util.createShader(gl, gl.VERTEX_SHADER, VSS.data)!
        const FS = util.createShader(gl, gl.FRAGMENT_SHADER, FSS.data)!
        const outVaryings = ['out_particleInfo', 'out_verlocity']
        this.program_simulate = util.createProgram2(gl, VS, FS, outVaryings)!

        this.Locations_simulate['a_particleInfo'] = gl.getAttribLocation(this.program_simulate, 'a_particleInfo')
        // this.Locations_simulate['a_velocity'] = gl.getAttribLocation(this.program_simulate, 'a_velocity')

        this.Locations_simulate['mapExtent'] = gl.getUniformLocation(this.program_simulate, 'mapExtent')
        this.Locations_simulate['flowExtent'] = gl.getUniformLocation(this.program_simulate, 'flowExtent')
        this.Locations_simulate['u_matrix'] = gl.getUniformLocation(this.program_simulate, 'u_matrix')
        this.Locations_simulate['maxSpeed'] = gl.getUniformLocation(this.program_simulate, 'maxSpeed')
        this.Locations_simulate['randomSeed'] = gl.getUniformLocation(this.program_simulate, 'randomSeed')
        this.Locations_simulate['dropRate'] = gl.getUniformLocation(this.program_simulate, 'dropRate')
        this.Locations_simulate['dropRateBump'] = gl.getUniformLocation(this.program_simulate, 'dropRateBump')
        this.Locations_simulate['speedFactor'] = gl.getUniformLocation(this.program_simulate, 'speedFactor')
        this.Locations_simulate['uvTexture'] = gl.getUniformLocation(this.program_simulate, 'uvTexture')


        this.velocityBuffer1 = util.createVBO(gl, velocityColorData1)
        this.velocityBuffer2 = util.createVBO(gl, velocityColorData2)

        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.vao_simulate_1 = gl.createVertexArray()!
        gl.bindVertexArray(this.vao_simulate_1)
        this.pposBuffer_simulate_1 = util.createVBO(gl, particleInfoData1)
        gl.enableVertexAttribArray(this.Locations_simulate['a_particleInfo'] as number)
        gl.vertexAttribPointer(
            this.Locations_simulate['a_particleInfo'] as number,
            4,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.bindVertexArray(null)

        this.vao_simulate_2 = gl.createVertexArray()!
        gl.bindVertexArray(this.vao_simulate_2)
        this.pposBuffer_simulate_2 = util.createVBO(gl, particleInfoData2)
        gl.enableVertexAttribArray(this.Locations_simulate['a_particleInfo'] as number)
        gl.vertexAttribPointer(
            this.Locations_simulate['a_particleInfo'] as number,
            4,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.bindVertexArray(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.xfo_simulate_1 = gl.createTransformFeedback()!
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.xfo_simulate_1)
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.pposBuffer_simulate_2)
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, this.velocityBuffer2)
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

        this.xfo_simulate_2 = gl.createTransformFeedback()!
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.xfo_simulate_2)
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.pposBuffer_simulate_1)
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, this.velocityBuffer1)
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)
    }

    async programInit_segmentShowing(gl: WebGL2RenderingContext) {
        const VSS = (await axios.get('/shaders/webgl/segment.vert.glsl')).data
        const FSS = (await axios.get('/shaders/webgl/segment.frag.glsl')).data
        const VS = util.createShader(gl, gl.VERTEX_SHADER, VSS)!
        const FS = util.createShader(gl, gl.FRAGMENT_SHADER, FSS)!
        this.program_segmentShowing = util.createProgram(gl, VS, FS)!

        this.Locations_segmentShowing['a_positionInfo'] = gl.getAttribLocation(this.program_segmentShowing, 'a_positionInfo')
        this.Locations_segmentShowing['a_velocity'] = gl.getAttribLocation(this.program_segmentShowing, 'a_velocity')
        this.Locations_segmentShowing['u_matrix'] = gl.getUniformLocation(this.program_segmentShowing, 'u_matrix')
        this.Locations_segmentShowing['u_centerOffsetMatrix'] = gl.getUniformLocation(this.program_segmentShowing, 'u_centerOffsetMatrix')
        this.Locations_segmentShowing['u_centerHigh'] = gl.getUniformLocation(this.program_segmentShowing, 'u_centerHigh')
        this.Locations_segmentShowing['u_centerLow'] = gl.getUniformLocation(this.program_segmentShowing, 'u_centerLow')

        this.Locations_segmentShowing['maxSpeed'] = gl.getUniformLocation(this.program_segmentShowing, 'maxSpeed')
        this.Locations_segmentShowing['u_canvasSize'] = gl.getUniformLocation(this.program_segmentShowing, 'u_canvasSize')
        this.Locations_segmentShowing['aaWidth'] = gl.getUniformLocation(this.program_segmentShowing, 'aaWidth')
        this.Locations_segmentShowing['fillWidth'] = gl.getUniformLocation(this.program_segmentShowing, 'fillWidth')



        this.vao_segmentShowing1 = gl.createVertexArray()!
        gl.bindVertexArray(this.vao_segmentShowing1)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.pposBuffer_simulate_2)
        gl.enableVertexAttribArray(this.Locations_segmentShowing['a_positionInfo'] as number)
        gl.vertexAttribPointer(
            this.Locations_segmentShowing['a_positionInfo'] as number,
            4,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.vertexAttribDivisor(this.Locations_segmentShowing['a_positionInfo'] as number, 1)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer2)
        gl.enableVertexAttribArray(this.Locations_segmentShowing['a_velocity'] as number)
        gl.vertexAttribPointer(
            this.Locations_segmentShowing['a_velocity'] as number,
            1,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.vertexAttribDivisor(this.Locations_segmentShowing['a_velocity'] as number, 1)
        gl.bindVertexArray(null)



        this.vao_segmentShowing2 = gl.createVertexArray()!
        gl.bindVertexArray(this.vao_segmentShowing2)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.pposBuffer_simulate_1)
        gl.enableVertexAttribArray(this.Locations_segmentShowing['a_positionInfo'] as number)
        gl.vertexAttribPointer(
            this.Locations_segmentShowing['a_positionInfo'] as number,
            4,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.vertexAttribDivisor(this.Locations_segmentShowing['a_positionInfo'] as number, 1)


        gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer1)
        gl.enableVertexAttribArray(this.Locations_segmentShowing['a_velocity'] as number)
        gl.vertexAttribPointer(
            this.Locations_segmentShowing['a_velocity'] as number,
            1,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.vertexAttribDivisor(this.Locations_segmentShowing['a_velocity'] as number, 1)
        gl.bindVertexArray(null)


    }

    async programInit_historyShowing(gl: WebGL2RenderingContext) {
        const VSS = (await axios.get('/shaders/webgl/historyTrajectory.vert.glsl')).data
        const FSS = (await axios.get('/shaders/webgl/historyTrajectory.frag.glsl')).data
        const VS = util.createShader(gl, gl.VERTEX_SHADER, VSS)!
        const FS = util.createShader(gl, gl.FRAGMENT_SHADER, FSS)!
        this.program_historyShowing = util.createProgram(gl, VS, FS)!

        this.trajectoryTexture_1 = util.createCanvasSizeTexture(gl, "RGBA8")
        this.fbo_historyShowing_1 = gl.createFramebuffer()!
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo_historyShowing_1)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.trajectoryTexture_1, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        this.trajectoryTexture_2 = util.createCanvasSizeTexture(gl, "RGBA8")
        this.fbo_historyShowing_2 = gl.createFramebuffer()!
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo_historyShowing_2)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.trajectoryTexture_2, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        this.Locations_historyShowing['showTexture'] = gl.getUniformLocation(this.program_historyShowing, 'showTexture')
        this.Locations_historyShowing['fadeFactor'] = gl.getUniformLocation(this.program_historyShowing, 'fadeFactor')

    }

    async programInit_finalShowing(gl: WebGL2RenderingContext) {
        const VSS = (await axios.get('/shaders/webgl/final.vert.glsl')).data
        const FSS = (await axios.get('/shaders/webgl/final.frag.glsl')).data
        const VS = util.createShader(gl, gl.VERTEX_SHADER, VSS)!
        const FS = util.createShader(gl, gl.FRAGMENT_SHADER, FSS)!
        this.program_finalShowing = util.createProgram(gl, VS, FS)!
        this.Locations_finalShowing['showTexture'] = gl.getUniformLocation(this.program_finalShowing, 'showTexture')
        this.Locations_finalShowing['uvTexture'] = gl.getUniformLocation(this.program_finalShowing, 'uvTexture')

    }

    async getStationData(url: string) {
        let vertexData
        let indexData
        const stationData = (await axios.get(url, { responseType: 'arraybuffer' })).data
        const meshes = new Delaunay(new Float32Array(stationData))
        indexData = meshes.triangles // Uint32Array
        vertexData = meshes.points // Float32Array
        for (let i = 0; i < vertexData.length; i += 2) {
            let [lng, lat] = [vertexData[i], vertexData[i + 1]]
            if (lng < this.flowExtent[0]) this.flowExtent[0] = lng
            if (lat < this.flowExtent[1]) this.flowExtent[1] = lat
            if (lng > this.flowExtent[2]) this.flowExtent[2] = lng
            if (lat > this.flowExtent[3]) this.flowExtent[3] = lat
        }
        // PROCESS 

        return {
            vertexData_station: vertexData,
            indexData_station: indexData
        }
    }

    async getVelocityData(url: string) {
        const velocityData = new Float32Array((await axios.get(url, { responseType: 'arraybuffer' })).data)
        for (let i = 0; i < velocityData.length; i += 2) {
            let [u, v] = [velocityData[i], velocityData[i + 1]]
            let velocity = Math.sqrt(u * u + v * v)
            if (velocity > this.flowMaxVelocity) this.flowMaxVelocity = velocity
        }
        return velocityData
    }

    printBuffer(gl: WebGL2RenderingContext, buffer: WebGLBuffer, size: number, label: string = '') {
        ////// debug
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        const debugArr = new Float32Array(size)
        gl.getBufferSubData(gl.ARRAY_BUFFER, 0, debugArr)
        console.log(`${label}`, debugArr)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        return debugArr
    }
    xfSwap(count: number) {

        if (count % 2 == 1) {
            this.nowXFVAO_simu = this.vao_simulate_1 // xf input 
            this.nowXFO_simu = this.xfo_simulate_1 // xfo , out to ppos2 , velocity2
            this.nowSegRenderVAO = this.vao_segmentShowing1 // render using ppos2 , velocity2

            this.nowRenderFBO = this.fbo_historyShowing_1 // render target ==> trajectoryTexture_1
            this.nowHideFBO = this.fbo_historyShowing_2 // hide target ==> trajectoryTexture_2
            this.nowHistoryTrajectoryTexture = this.trajectoryTexture_2 // render history texture ==> trajectoryTexture_2
            this.nowTotalTrajectoryTexture = this.trajectoryTexture_1 // render total texture ==> trajectoryTexture_1
        } else {
            this.nowXFVAO_simu = this.vao_simulate_2 // xf input 
            this.nowXFO_simu = this.xfo_simulate_2 // xfo , out to ppos1 , velocity1
            this.nowSegRenderVAO = this.vao_segmentShowing2 // render using ppos1 , velocity1

            this.nowRenderFBO = this.fbo_historyShowing_2 // render target ==> trajectoryTexture_2
            this.nowHideFBO = this.fbo_historyShowing_1 // hide target ==> trajectoryTexture_1
            this.nowHistoryTrajectoryTexture = this.trajectoryTexture_1 // render history texture ==> trajectoryTexture_1
            this.nowTotalTrajectoryTexture = this.trajectoryTexture_2 // render total texture ==> trajectoryTexture_2
        }
        // let tempxfo = this.xfo_simulate_1
        // this.xfo_simulate_1 = this.xfo_simulate_2
        // this.xfo_simulate_2 = tempxfo

        // let tempVao = this.vao_simulate_1
        // this.vao_simulate_1 = this.vao_simulate_2
        // this.vao_simulate_2 = tempVao

        // let tempBuffer4pos = this.pposBuffer_simulate_2
        // this.pposBuffer_simulate_2 = this.pposBuffer_simulate_1
        // this.pposBuffer_simulate_1 = tempBuffer4pos

        // let tempBuffer4Velocity = this.velocityBuffer2
        // this.velocityBuffer2 = this.velocityBuffer1
        // this.velocityBuffer1 = tempBuffer4Velocity

        // let tempFBOshowing = this.fbo_historyShowing_1
        // this.fbo_historyShowing_1 = this.fbo_historyShowing_2
        // this.fbo_historyShowing_2 = tempFBOshowing

        // let tempTextureshowing = this.trajectoryTexture_1
        // this.trajectoryTexture_1 = this.trajectoryTexture_2
        // this.trajectoryTexture_2 = tempTextureshowing

    }
    nextStep(gl: WebGL2RenderingContext) {
        this.uvResourcePointer = (this.uvResourcePointer + 1) % this.totalResourceCount
        let fromIndex = (this.uvResourcePointer - 1 + 3) % 3
        let toIndex = (this.uvResourcePointer) % 3
        let updateIndex = (this.uvResourcePointer + 1) % 3
        this.velocityData_from = this.velocityData_Array[fromIndex]
        this.velocityData_to = this.velocityData_Array[toIndex]

        gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer_from)
        gl.bufferData(gl.ARRAY_BUFFER, this.velocityData_from, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.velocityBuffer_to)
        gl.bufferData(gl.ARRAY_BUFFER, this.velocityData_to, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        console.log('///////// TIME STEP UPDATE //////////')
        console.log(this.id, this.uvResourcePointer)

        this.getVelocityData(this.binPrefix + this.uvURLs[this.uvResourcePointer]).then(data => {
            this.velocityData_Array[updateIndex] = data
        })
    }
    initGUI() {
        this.gui = new dat.GUI()
        let parameters = {
            particleNum: this.particleNum,
            velocityFactor: this.velocityFactor,
            fadeFactor: this.fadeFactor,
            aaWidth: this.aaWidth,
            fillWidth: this.fillWidth,
            framePerStep: this.framePerStep,
        }
        this.gui.domElement.style.position = 'absolute'
        this.gui.domElement.style.top = '2vh'
        this.gui.domElement.style.right = '2vw'
        this.gui.add(parameters, 'particleNum', 0, 65536).onChange(value => this.particleNum = value)
        this.gui.add(parameters, 'velocityFactor', 1, 50, 1).onChange(value => this.velocityFactor = value)
        this.gui.add(parameters, 'fadeFactor', 0.8, 1.0, 0.01).onChange(value => this.fadeFactor = value)
        this.gui.add(parameters, 'aaWidth', 0, 5, 0.1).onChange(value => this.aaWidth = value)
        this.gui.add(parameters, 'fillWidth', 0, 5, 0.1).onChange(value => this.fillWidth = value)
        this.gui.add(parameters, 'framePerStep', 30, 240, 10).onChange(value => this.framePerStep = value)
        this.gui.open()
    }

    async parsePolygon(url: string) {
        const geojson = (await axios.get(url)).data
        let coordinate = geojson.features[0].geometry.coordinates[0];
        var data = earcut.flatten(coordinate);
        var triangle = earcut(data.vertices, data.holes, data.dimensions);
        coordinate = data.vertices.flat()

        let vertexData = []
        for (let i = 0; i < coordinate.length; i += 2) {
            let [x, y] = this.lnglat2Mercator(coordinate[i], coordinate[i + 1]);
            vertexData.push(x);
            vertexData.push(y);
        }

        return {
            vertexData: vertexData,
            indexData: triangle,
        }
    }

    lnglat2Mercator(lng: number, lat: number) {
        let x = (180 + lng) / 360;
        let y =
            (180 -
                (180 / Math.PI) *
                Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) /
            360;
        return [x, y];
    }

}



export default FlowLayer
export {
    type configureType
}







function getMapExtent(map: mapbox.Map) {
    const bounds = map.getBounds()
    const boundsArray = bounds.toArray()
    return [boundsArray[0][0], boundsArray[0][1], boundsArray[1][0], boundsArray[1][1]]
}


function multiplyMatrixByVec4(matrix: Array<number>, vec4: Array<number>) {
    // 矩阵乘法结果初始化为0
    var result = [0, 0, 0, 0];

    // 遍历结果向量的每个元素
    for (var i = 0; i < 4; i++) {
        // 对于每个结果元素，执行矩阵的一行与向量的点积
        for (var j = 0; j < 4; j++) {
            result[i] += matrix[i * 4 + j] * vec4[j];
        }
    }

    return result;
}

