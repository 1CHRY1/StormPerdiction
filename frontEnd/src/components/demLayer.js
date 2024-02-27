import mapboxgl from 'mapbox-gl'
import * as Scratch from './scratch/scratch.js'
import { mat4 } from 'gl-matrix'
import axios from 'axios'
import earcut from 'earcut'
// import { preLoad, tick } from './flowLayer copy.js'
// import { tickLogic, init, showFlowField } from './flowLayerself.js'

// import { tickLogic, init, showFlowField } from './flowLayer.js' //ogflow chanagjiang
import { tickLogic, init, showFlowField } from './flowLayerLHY.js' //main

import { INIT,TICKLOGIC } from './waterDifLayerLHY.js'
// import { main } from './originWaterDif.js'



/**
 * @typedef {object} MapOptions
 * @property {BoundingBox2D} cameraBounds
 * @property {Array[number]} cameraPos
 * @property {number} zoomLevel
 */

class BoundingBox2D {

    constructor(boundary) {

        if (boundary) this.boundary = boundary
        else this.boundary = [
            Infinity,
            Infinity,
            -Infinity,
            -Infinity,
        ]
    }

    static create(boundary) {

        if (boundary && boundary.length == 4) return new BoundingBox2D(boundary)
        else return new BoundingBox2D()
    }

    update(x, y) {

        this.boundary[0] = x < this.boundary[0] ? x : this.boundary[0]
        this.boundary[1] = y < this.boundary[1] ? y : this.boundary[1]
        this.boundary[2] = x > this.boundary[2] ? x : this.boundary[2]
        this.boundary[3] = y > this.boundary[3] ? y : this.boundary[3]
    }

    updateByBox(box) {

        this.update(box.boundary[0], box.boundary[1])
        this.update(box.boundary[2], box.boundary[3])
    }

    /**
     * 
     * @param {BoundingBox2D} bBox 
     */
    overlap(bBox) {

        if (this.boundary[0] > bBox.boundary[2] || this.boundary[2] < bBox.boundary[0]) return false
        if (this.boundary[1] > bBox.boundary[3] || this.boundary[3] < bBox.boundary[1]) return false

        return true
    }

    center() {

        return [
            (this.boundary[0] + this.boundary[2]) / 2,
            (this.boundary[1] + this.boundary[3]) / 2,
        ]
    }

    size() {

        return [
            this.boundary[2] - this.boundary[0],
            this.boundary[3] - this.boundary[1],
        ]
    }

    reset() {

        this.boundary = [
            Infinity,
            Infinity,
            -Infinity,
            -Infinity,
        ]
    }

    release() {

        this.boundary = null
        return null
    }
}

class TerrainNode2D {

    /**
     * @param {number} level 
     * @param {number} id 
     * @param {TerrainNode2D} [parent]
     */
    constructor(level = 0, id = 0, parent = undefined) {

        this.parent = parent
        this.level = level
        this.id = id

        this.size = 180.0 / Math.pow(2, level)

        const subId = this.id % 4
        const minLon = (this.parent ? this.parent.bBox.boundary[0] : 0.0) + (subId % 2) * this.size
        const maxLon = minLon + this.size
        const minLat = (this.parent ? this.parent.bBox.boundary[1] : -90.0) + Math.floor((subId / 2)) * this.size
        const maxLat = minLat + this.size

        this.bBox = BoundingBox2D.create([
            minLon, minLat,
            maxLon, maxLat,
        ])

        /**
         * @type {TerrainNode2D[]}
         */
        this.children = []
    }

    release() {

        this.bBox = this.bBox.release()
        this.children = null
        this.parent = null
        this.level = null
        this.size = null
        this.id = null
    }

    /**
     * @param {MapOptions} options
     * @returns 
     */
    isSubdividable(options) {

        // if (!this.bBox.overlap(options.cameraBounds)) return false

        const center = this.bBox.center()

        const hFactor = Math.ceil(Math.abs(center[0] - options.cameraPos[0]) / this.size)
        const vFactor = Math.ceil(Math.abs(center[1] - options.cameraPos[1]) / this.size)
        const distance = Math.max(hFactor, vFactor)
        if (distance <= 3) return true
        else return false
    }
}

class TerrainTile {

    constructor(maxLevel) {

        this.maxLevel = maxLevel
        this.maxVisibleNodeLevel = 0
        this.minVisibleNodeLevel = this.maxLevel
        this.maxBindingUsedNum = 5000

        this.tileBox = new BoundingBox2D()
        this.sectorSize = []

        this.nodeLevelArray = Scratch.aRef(new Uint32Array(this.maxBindingUsedNum), 'Storage (Node level)')
        nodeLevelBuffer = Scratch.StorageBuffer.create({
            name: 'Storage Buffer (Node level)',
            resource: { arrayRef: this.nodeLevelArray }
        }).use()
        this.nodeBoxArray = Scratch.aRef(new Float32Array(this.maxBindingUsedNum * 4), 'Storage (Node bBox)')
        nodeBoxBuffer = Scratch.StorageBuffer.create({
            name: 'Storage Buffer (Node bBox)',
            resource: { arrayRef: this.nodeBoxArray }
        }).use()

        this.stack = []

        this.bindingUsed = 0
        this.lodMapBinding = Scratch.Binding.create({
            name: `Binding (Terrain node)`,
            range: () => [4, this.bindingUsed],
            sharedUniforms: [
                { buffer: gStaticBuffer },
            ],
            uniforms: [
                {
                    name: 'tileUniform',
                    dynamic: true,
                    map: {
                        tileBox: {
                            type: 'vec4f',
                            value: () => this.tileBox.boundary,
                        },
                        levelRange: {
                            type: 'vec2f',
                            value: () => [this.minVisibleNodeLevel, this.maxVisibleNodeLevel],
                        },
                        sectorSize: {
                            type: 'vec2f',
                            value: () => this.sectorSize,
                        }
                    }
                }
            ],
            storages: [
                { buffer: nodeLevelBuffer },
                { buffer: nodeBoxBuffer },
            ],
        })
        this.meshBinding = Scratch.Binding.create({
            name: `Binding (Terrain node)`,
            range: () => [indexNum / 3 * (this.asLine ? 6 : 3), this.bindingUsed],
            uniforms: [
                {
                    name: 'tileUniform',
                    dynamic: true,
                    map: {
                        tileBox: {
                            type: 'vec4f',
                            value: () => this.tileBox.boundary,
                        },
                        levelRange: {
                            type: 'vec2f',
                            value: () => [this.minVisibleNodeLevel, this.maxVisibleNodeLevel],
                        },
                        sectorSize: {
                            type: 'vec2f',
                            value: () => this.sectorSize,
                        }
                    }
                }
            ],
            sharedUniforms: [
                { buffer: gStaticBuffer },
                { buffer: gDynamicBuffer }
            ],
            samplers: [lSamplerDesc],
            textures: [
                { texture: demTexture },
                { texture: borderTexture },
                { texture: lodMapTexture },
                { texture: paletteTexture },
            ],
            storages: [
                { buffer: indexBuffer },
                { buffer: positionBuffer },
                { buffer: nodeLevelBuffer },
                { buffer: nodeBoxBuffer },
            ],
        })

        this.asLine = 0
        this.lodMapPipeline = Scratch.RenderPipeline.create({
            name: 'Render Pipeline (LOD Map)',
            shader: { module: Scratch.shaderLoader.load('Shader (Terrain Mesh)', '/shaders/lodMap.wgsl') },
            primitive: { topology: 'triangle-strip' },
        })
        this.meshRenderPipeline = Scratch.RenderPipeline.create({
            name: 'Render Pipeline (Terrain Mesh)',
            shader: { module: Scratch.shaderLoader.load('Shader (Terrain Mesh)', '/shaders/terrainMesh.wgsl') },
            colorTargetStates: [{ blend: Scratch.NoBlending }],
            depthTest: true,
        })
        this.meshLineRenderPipeline = Scratch.RenderPipeline.create({
            name: 'Render Pipeline (Terrain Mesh)',
            shader: { module: Scratch.shaderLoader.load('Shader (Terrain Mesh)', '/shaders/terrainMeshLine.wgsl') },
            depthTest: true,
            primitive: { topology: 'line-list' },
        })

        lodMapPass.add(this.lodMapPipeline, this.lodMapBinding)
        meshRenderPass.add(this.asLine ? this.meshLineRenderPipeline : this.meshRenderPipeline, this.meshBinding)
    }

    /**
     * @param {MapOptions} options 
     */
    registerRenderableNode(options) {

        this.tileBox.reset()
        this.sectorSize = []
        this.bindingUsed = 0
        this.maxVisibleNodeLevel = 0
        this.minVisibleNodeLevel = this.maxLevel

        this.stack.push(new TerrainNode2D(0, 0))
        const visibleNode = []
        while (this.stack.length > 0) {

            let node = this.stack.pop()
            if (!node.bBox.overlap(boundaryCondition)) continue

            if (!node.isSubdividable(options) || node.level >= this.maxLevel || node.level >= options.zoomLevel) {

                visibleNode.push(node)
                if (node.level > this.maxVisibleNodeLevel) {

                    this.sectorSize = node.bBox.size()
                    this.maxVisibleNodeLevel = node.level
                }
                continue
            }

            for (let i = 0; i < 4; i++) {

                if (!node.children[i]) node.children[i] = new TerrainNode2D(node.level + 1, 4 * node.id + i, node)
                this.stack.push(node.children[i])
            }
        }

        visibleNode.sort((a, b) => a.level - b.level).forEach(node => {

            if (this.bindingUsed >= this.maxBindingUsedNum || node.level + 5 < this.maxVisibleNodeLevel) return

            this.minVisibleNodeLevel = node.level < this.minVisibleNodeLevel ? node.level : this.minVisibleNodeLevel
            this.tileBox.updateByBox(node.bBox)

            this.nodeLevelArray.elements(this.bindingUsed, node.level)
            this.nodeBoxArray.elements(this.bindingUsed * 4 + 0, node.bBox.boundary[0])
            this.nodeBoxArray.elements(this.bindingUsed * 4 + 1, node.bBox.boundary[1])
            this.nodeBoxArray.elements(this.bindingUsed * 4 + 2, node.bBox.boundary[2])
            this.nodeBoxArray.elements(this.bindingUsed * 4 + 3, node.bBox.boundary[3])

            this.bindingUsed++
            node.release()
        })
    }
}

function grid(c = 200, r = 200) {

    const col = c + 1
    const row = r + 1
    const positions = []
    const uvs = []
    let rowStep = 1.0 / r
    let colStep = 1.0 / c
    let x = 0.0, y = 0.0
    for (let i = 0; i < row; i++) {
        x = 0.0
        for (let j = 0; j < col; j++) {
            positions.push(x)
            positions.push(y)
            uvs.push(j / col)
            uvs.push(1.0 - i / row)
            x += colStep
        }
        y += rowStep
    }

    const indices = []
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {

            indices.push(i * col + j)
            indices.push((i + 1) * col + j)
            indices.push(i * col + j + 1)

            indices.push(i * col + j + 1)
            indices.push((i + 1) * col + j)
            indices.push((i + 1) * col + j + 1)
        }
    }

    return {
        positions,
        uvs,
        indices,
    }
}

function quadGrid(time = 5) {

    function middle(v1, v2) {

        return [
            (v1[0] + v2[0]) / 2,
            (v1[1] + v2[1]) / 2,
        ]
    }

    const indices = []
    const positions = []
    const vertexMap = new Map()
    function add2Map(v) {

        const key = v.join('-')
        if (!vertexMap.has(key)) vertexMap.set(key, positions.length / 2)
        positions.push(v[0])
        positions.push(v[1])
        return v
    }

    const tl = add2Map([0.0, 1.0])
    const bl = add2Map([0.0, 0.0])
    const tr = add2Map([1.0, 1.0])
    const br = add2Map([1.0, 0.0])
    const firstTriangle = {
        fst: tl,
        snd: bl,
        ted: br,
        level: 0,
    }
    const secondTriangle = {
        fst: br,
        snd: tr,
        ted: tl,
        level: 0,
    }
    const stack = []
    stack.push(firstTriangle)
    stack.push(secondTriangle)

    const triangles = []
    while (stack.length) {

        const triangle = stack.pop(stack)

        if (triangle.level >= time) {
            triangles.push(triangle)
            continue
        }

        const oV1 = triangle.fst
        const oV2 = triangle.snd
        const oV3 = triangle.ted
        const nV = add2Map(middle(oV1, oV3))
        stack.push({ fst: oV1, snd: nV, ted: oV2, level: triangle.level + 0.5 })
        stack.push({ fst: oV3, snd: nV, ted: oV2, level: triangle.level + 0.5 })
    }

    triangles.forEach(triangle => {

        const kV1 = triangle.fst.join('-')
        const kV2 = triangle.snd.join('-')
        const kV3 = triangle.ted.join('-')

        indices.push(vertexMap.get(kV1))
        indices.push(vertexMap.get(kV2))
        indices.push(vertexMap.get(kV3))
    })

    return {
        positions,
        indices,
    }
}

function encodeFloatToDouble(value) {
    const result = new Float32Array(2);
    result[0] = value;

    const delta = value - result[0];
    result[1] = delta;
    return result;
}

/**
 * @type {TerrainTile}
 */
let terrain2d = undefined
const MAX_LEVEL = 14
const coordinates = [
    120.0437360613468201,
    31.1739019522094871,
    121.9662324011692220,
    32.0840108580467813,
]
const boundaryCondition = BoundingBox2D.create([
    120.0437360613468201,
    31.1739019522094871,
    121.9662324011692220,
    32.0840108580467813,
])

/**
 * @type {Scratch.Screen}
 */
let screen

let indexNum = 0
let indexBuffer = undefined
let positionBuffer = undefined

let originMatrix = undefined
let mapMatrix = undefined
let highX = undefined
let highY = undefined
let highZ = undefined
let highE = undefined
let lowX = undefined
let lowY = undefined
let lowZ = undefined
let lowE = undefined

let nodeBoxBuffer = undefined
let nodeLevelBuffer = undefined

let gStaticBuffer = undefined
let gDynamicBuffer = undefined
let gObjectBuffer = undefined

let demTexture = undefined
let borderTexture = undefined
let paletteTexture = undefined
let lodMapTexture = undefined

let lodMapPass = undefined

let jsonRenderPass = undefined
let meshRenderPass = undefined
let meshRenderPipeline = undefined

let isInitialized = false
let terrainWorker = undefined

/**
 * @type {Scratch.SamplerDescription}
 */
const lSamplerDesc = {
    name: 'Sampler (linear)',
    bindingType: 'filtering',
    filterMinMag: ['linear', 'linear'],
    addressModeUVW: ['clamp-to-edge', 'clamp-to-edge'],
    mipmap: 'linear',
}
const waterColor = [3.0 / 255.0, 38.0 / 255.0, 36.0 / 255.0]

async function makeBridgeSurf() {

    const bridgeSurf = await axios.get('/json/bridgeSurf.geojson').then((response) => { return response.data })

    // Update bounding box
    let lonMin = Infinity, lonMax = -Infinity
    let latMin = Infinity, latMax = -Infinity
    bridgeSurf.features.forEach(feature => {

        feature.geometry.coordinates[0][0].forEach(coords => {
            lonMin = coords[0] < lonMin ? coords[0] : lonMin
            lonMax = coords[0] > lonMax ? coords[0] : lonMax
            latMin = coords[1] < latMin ? coords[1] : latMin
            latMax = coords[1] > latMax ? coords[1] : latMax
        })
    })
    let mCoordMin = mapboxgl.MercatorCoordinate.fromLngLat([lonMin, latMin])
    let mCoordMax = mapboxgl.MercatorCoordinate.fromLngLat([lonMax, latMax])
    let hlMinLon = encodeFloatToDouble(mCoordMin.x)
    let hlMinLat = encodeFloatToDouble(mCoordMin.y)
    let hlMaxLon = encodeFloatToDouble(mCoordMax.x)
    let hlMaxLat = encodeFloatToDouble(mCoordMax.y)

    let exIndexOffset = 0
    let indices = []
    let exIndices = []
    let exVertices = []
    bridgeSurf.features.forEach(feature => {

        const tempCoords = []
        const vertexNum = feature.geometry.coordinates[0][0].length;
        feature.geometry.coordinates[0][0].forEach(coords => {

            const mCoords = mapboxgl.MercatorCoordinate.fromLngLat(coords)
            tempCoords.push((mCoords.x - mCoordMin.x) / (mCoordMax.x - mCoordMin.x))
            tempCoords.push((mCoords.y - mCoordMin.y) / (mCoordMax.y - mCoordMin.y))
        })

        // Vertices filling
        for (let i = 0; i < tempCoords.length; i += 2) {

            const lon = tempCoords[i + 0]
            const lat = tempCoords[i + 1]
            const hlLon = encodeFloatToDouble(lon)
            const hlLat = encodeFloatToDouble(lat)

            exVertices.push(hlLon[0])
            exVertices.push(hlLat[0])
            exVertices.push(hlLon[1])
            exVertices.push(hlLat[1])

            exVertices.push(hlLon[0])
            exVertices.push(hlLat[0])
            exVertices.push(hlLon[1])
            exVertices.push(hlLat[1])
        }

        // Face indexing
        const triangles = earcut(tempCoords, null, 2)
        for (let i = 0; i < triangles.length; i++) indices.push(exIndexOffset + triangles[i] * 2)

        // Extrusion indexing
        for (let i = 0; i < vertexNum; i++) {

            exIndices.push(exIndexOffset + i * 2 + 0)
            exIndices.push(exIndexOffset + i * 2 + 1)
            exIndices.push(exIndexOffset + ((i + 1) % vertexNum) * 2 + 0)

            exIndices.push(exIndexOffset + i * 2 + 1)
            exIndices.push(exIndexOffset + ((i + 1) % vertexNum) * 2 + 0)
            exIndices.push(exIndexOffset + ((i + 1) % vertexNum) * 2 + 1)
        }

        exIndexOffset += vertexNum * 2
    })

    const indexBuffer = Scratch.IndexBuffer.create({
        name: 'Index Buffer (Bridge Surface)',
        resource: { arrayRef: Scratch.aRef(new Uint16Array(indices)) }
    })

    const exIndexBuffer = Scratch.IndexBuffer.create({
        name: 'Index Buffer (Bridge Surface Extrusion)',
        resource: { arrayRef: Scratch.aRef(new Uint16Array(exIndices)) }
    })

    const exVertexBuffer = Scratch.VertexBuffer.create({
        name: 'Vertex Buffer (Bridge Surface)',
        resource: { arrayRef: Scratch.aRef(new Float32Array(exVertices)), structure: [{ components: 4 }] },
    })

    const uniformBuffer_object = Scratch.UniformBuffer.create({
        name: 'Uniform Buffer (Object Static)',
        blocks: [
            Scratch.bRef({
                name: 'centerUniform',
                map: {
                    hlZ: {
                        type: 'vec2f',
                        value: () => new Float32Array([highZ, lowZ]),
                    },
                    boundsH: {
                        type: 'vec4f',
                        value: () => [hlMinLon[0], hlMinLat[0], hlMaxLon[0], hlMaxLat[0]],
                    },
                    boundsL: {
                        type: 'vec4f',
                        value: () => [hlMinLon[1], hlMinLat[1], hlMaxLon[1], hlMaxLat[1]],
                    },
                    eT: {
                        type: 'vec2f',
                        value: () => encodeFloatToDouble(4.3745),
                    },
                    eB: {
                        type: 'vec2f',
                        value: () => encodeFloatToDouble(-80.06899999999999),
                    },
                }
            }),
        ]
    }).use()

    const binding_bf = Scratch.Binding.create({
        name: 'Binding (Bridge Surface)',
        range: () => [indices.length],
        sharedUniforms: [
            { buffer: uniformBuffer_object },
            { buffer: gStaticBuffer },
            { buffer: gDynamicBuffer },
        ],
        index: { buffer: indexBuffer },
        vertices: [{ buffer: exVertexBuffer }],
        textures: [{ texture: demTexture }],
    })
    const binding_bf_ex = Scratch.Binding.create({
        name: 'Binding (Bridge Surface Extrusion)',
        range: () => [exIndices.length],
        sharedUniforms: [
            { buffer: uniformBuffer_object },
            { buffer: gStaticBuffer },
            { buffer: gDynamicBuffer },
        ],
        index: { buffer: exIndexBuffer },
        vertices: [{ buffer: exVertexBuffer }],
        textures: [{ texture: demTexture }],
    })

    const bfRenderPipeline = Scratch.RenderPipeline.create({
        name: 'Render Pipeline (Bridge Surface)',
        shader: { module: Scratch.shaderLoader.load('Shader (Bridge)', '/shaders/bridgeSurf.wgsl') },
        colorTargetStates: [{ blend: Scratch.NormalBlending }],
        depthTest: true,
    })

    const bfExRenderPipeline = Scratch.RenderPipeline.create({
        name: 'Render Pipeline (Bridge Surface Extrusion)',
        shader: { module: Scratch.shaderLoader.load('Shader (Bridge)', '/shaders/bridgeSurfEx.wgsl') },
        colorTargetStates: [{ blend: Scratch.NormalBlending }],
        depthTest: true,
    })

    jsonRenderPass
        .add(bfRenderPipeline, binding_bf)
        .add(bfExRenderPipeline, binding_bf_ex)
}

async function makeBridgeColumn() {

    const bridgeColumn = await axios.get('/json/bridgeColumn.geojson').then((response) => { return response.data })

    // Update bounding box
    let lonMin = Infinity, lonMax = -Infinity
    let latMin = Infinity, latMax = -Infinity
    bridgeColumn.features.forEach(feature => {

        feature.geometry.coordinates[0][0].forEach(coords => {
            lonMin = coords[0] < lonMin ? coords[0] : lonMin
            lonMax = coords[0] > lonMax ? coords[0] : lonMax
            latMin = coords[1] < latMin ? coords[1] : latMin
            latMax = coords[1] > latMax ? coords[1] : latMax
        })
    })
    let mCoordMin = mapboxgl.MercatorCoordinate.fromLngLat([lonMin, latMin])
    let mCoordMax = mapboxgl.MercatorCoordinate.fromLngLat([lonMax, latMax])
    let hlMinLon = encodeFloatToDouble(mCoordMin.x)
    let hlMinLat = encodeFloatToDouble(mCoordMin.y)
    let hlMaxLon = encodeFloatToDouble(mCoordMax.x)
    let hlMaxLat = encodeFloatToDouble(mCoordMax.y)

    let exIndexOffset = 0
    let bc_indices = []
    let bcEx_indices = []
    let bcEx_vertices = []
    bridgeColumn.features.forEach(feature => {

        const tempCoords = []
        const vertexNum = feature.geometry.coordinates[0][0].length;
        feature.geometry.coordinates[0][0].forEach(coords => {

            const mCoords = mapboxgl.MercatorCoordinate.fromLngLat(coords)
            tempCoords.push((mCoords.x - mCoordMin.x) / (mCoordMax.x - mCoordMin.x))
            tempCoords.push((mCoords.y - mCoordMin.y) / (mCoordMax.y - mCoordMin.y))
        })

        // Vertices filling
        for (let i = 0; i < tempCoords.length; i += 2) {

            const lon = tempCoords[i + 0]
            const lat = tempCoords[i + 1]
            const hlLon = encodeFloatToDouble(lon)
            const hlLat = encodeFloatToDouble(lat)

            bcEx_vertices.push(hlLon[0])
            bcEx_vertices.push(hlLat[0])
            bcEx_vertices.push(hlLon[1])
            bcEx_vertices.push(hlLat[1])

            bcEx_vertices.push(hlLon[0])
            bcEx_vertices.push(hlLat[0])
            bcEx_vertices.push(hlLon[1])
            bcEx_vertices.push(hlLat[1])
        }

        // Face indexing
        const triangles = earcut(tempCoords, null, 2)
        for (let i = 0; i < triangles.length; i++) bc_indices.push(exIndexOffset + triangles[i] * 2)

        // Extrusion indexing
        for (let i = 0; i < vertexNum; i++) {

            bcEx_indices.push(exIndexOffset + i * 2 + 0)
            bcEx_indices.push(exIndexOffset + i * 2 + 1)
            bcEx_indices.push(exIndexOffset + ((i + 1) % vertexNum) * 2 + 0)

            bcEx_indices.push(exIndexOffset + i * 2 + 1)
            bcEx_indices.push(exIndexOffset + ((i + 1) % vertexNum) * 2 + 0)
            bcEx_indices.push(exIndexOffset + ((i + 1) % vertexNum) * 2 + 1)
        }

        exIndexOffset += vertexNum * 2
    })

    const indexBuffer_bc = Scratch.IndexBuffer.create({
        name: 'Index Buffer (Bridge Column)',
        resource: { arrayRef: Scratch.aRef(new Uint16Array(bc_indices)) }
    })

    const indexBuffer_bcEx = Scratch.IndexBuffer.create({
        name: 'Index Buffer (Bridge Column Extrusion)',
        resource: { arrayRef: Scratch.aRef(new Uint16Array(bcEx_indices)) }
    })

    const vertexBuffer_bcEx = Scratch.VertexBuffer.create({
        name: 'Vertex Buffer (Bridge Column Extrusion)',
        resource: { arrayRef: Scratch.aRef(new Float32Array(bcEx_vertices)), structure: [{ components: 4 }] },
    })

    const uniformBuffer_object = Scratch.UniformBuffer.create({
        name: 'Uniform Buffer (Object Static)',
        blocks: [
            Scratch.bRef({
                name: 'centerUniform',
                map: {
                    hlZ: {
                        type: 'vec2f',
                        value: () => new Float32Array([highZ, lowZ]),
                    },
                    boundsH: {
                        type: 'vec4f',
                        value: () => [hlMinLon[0], hlMinLat[0], hlMaxLon[0], hlMaxLat[0]],
                    },
                    boundsL: {
                        type: 'vec4f',
                        value: () => [hlMinLon[1], hlMinLat[1], hlMaxLon[1], hlMaxLat[1]],
                    },
                    eT: {
                        type: 'vec2f',
                        value: () => encodeFloatToDouble(4.3745),
                    },
                    eB: {
                        type: 'vec2f',
                        value: () => encodeFloatToDouble(-80.06899999999999),
                    },
                }
            }),
        ]
    }).use()

    const binding_bc = Scratch.Binding.create({
        name: 'Binding (Bridge Column)',
        range: () => [bc_indices.length],
        sharedUniforms: [
            { buffer: uniformBuffer_object },
            { buffer: gStaticBuffer },
            { buffer: gDynamicBuffer },
        ],
        index: { buffer: indexBuffer_bc },
        vertices: [{ buffer: vertexBuffer_bcEx }],
        textures: [{ texture: demTexture }],
    })

    const binding_bc_ex = Scratch.Binding.create({
        name: 'Binding (Bridge Column Extrusion)',
        range: () => [bcEx_indices.length],
        sharedUniforms: [
            { buffer: uniformBuffer_object },
            { buffer: gStaticBuffer },
            { buffer: gDynamicBuffer },
        ],
        index: { buffer: indexBuffer_bcEx },
        vertices: [{ buffer: vertexBuffer_bcEx }],
        textures: [{ texture: demTexture }],
    })

    const bcRenderPipeline = Scratch.RenderPipeline.create({
        name: 'Render Pipeline (Bridge Column)',
        shader: { module: Scratch.shaderLoader.load('Shader (Bridge)', '/shaders/bridge.wgsl') },
        colorTargetStates: [{ blend: Scratch.NormalBlending }],
        depthTest: true,
    })

    const bcExRenderPipeline = Scratch.RenderPipeline.create({
        name: 'Render Pipeline (Bridge Column Extrusion)',
        shader: { module: Scratch.shaderLoader.load('Shader (Bridge)', '/shaders/bridgeEx.wgsl') },
        colorTargetStates: [{ blend: Scratch.NormalBlending }],
        depthTest: true,
    })

    jsonRenderPass
        .add(bcRenderPipeline, binding_bc)
        .add(bcExRenderPipeline, binding_bc_ex)
}

export class DEMLayer {

    constructor() {

        this.id = 'DemLayer'
        this.type = 'custom'
        this.renderingMode = '3d'
        this.map = undefined
        this.isInitialized = false
        Scratch.StartDash()
    }

    async onAdd(map, gl) {

        /**
         * @type {mapboxgl.Map}
         */
        this.map = map

        /**
         * @type {HTMLCanvasElement}
         */
        const gpuCanvas = document.getElementById('WebGPUFrame')

        screen = Scratch.Screen.create({ canvas: gpuCanvas })
        const sceneTexture = screen.createScreenDependentTexture('Texture (DEM Scene)', undefined, [2, 2])
        const depthTexture = screen.createScreenDependentTexture('Texture (Depth)', 'depth32float', [2, 2])
        // const fxaaPass = Scratch.FXAAPass.create({
        //     threshold: 0.0312,
        //     searchStep: 10,
        //     inputColorAttachment: sceneTexture,
        // })
        // screen.addScreenDependentTexture(fxaaPass.getOutputAttachment(), [2, 2])

        demTexture = Scratch.imageLoader.load('Texture (Water DEM)', '/images/dem.png')
        borderTexture = Scratch.imageLoader.load('Texture (Water DEM)', '/images/border.png')
        paletteTexture = Scratch.imageLoader.load('Texture (DEM Palette)', '/images/demPalette10.png')
        lodMapTexture = Scratch.Texture.create({
            name: 'Texture (LOD Map)',
            format: 'rgba8unorm',
            resource: { size: () => [256, 256] }
        })

        const { positions, indices } = quadGrid(5)
        indexNum = indices.length
        positionBuffer = Scratch.VertexBuffer.create({
            name: 'Vertex Buffer (Terrain Position)',
            randomAccessible: true,
            resource: { arrayRef: Scratch.aRef(new Float32Array(positions)), structure: [{ components: 2 }] }
        }).use()
        indexBuffer = Scratch.IndexBuffer.create({
            name: 'Index Buffer (Terrain Index)',
            randomAccessible: true,
            resource: { arrayRef: Scratch.aRef(new Uint32Array(indices)) }
        }).use()

        gStaticBuffer = Scratch.UniformBuffer.create({
            name: 'Uniform Buffer (Terrain global static)',
            blocks: [
                Scratch.bRef({
                    name: 'block',
                    map: {
                        adjust: {
                            type: 'mat4x4f',
                            value: () => [
                                1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1, 0.0,
                                0.0, 0.0, 0.0, 1.0
                            ]
                        },
                        terrainBox: {
                            type: 'vec4f',
                            value: () => coordinates
                        },
                        e: {
                            type: 'vec2f',
                            value: () => new Float32Array([
                                -80.06899999999999,
                                4.3745,
                            ])
                        },
                    }
                }),
            ]
        }).use()

        gDynamicBuffer = Scratch.UniformBuffer.create({
            name: 'Uniform Buffer (Terrain global dynamic)',
            blocks: [
                Scratch.bRef({
                    name: 'dynamicUniform',
                    dynamic: true,
                    map: {
                        matrix: {
                            type: 'mat4x4f',
                            value: () => mapMatrix,
                        },
                        oMatrix: {
                            type: 'mat4x4f',
                            value: () => originMatrix,
                        },
                        exaggeration: {
                            type: 'f32',
                            value: () => 3.0,
                        },
                        zoom: {
                            type: 'f32',
                            value: () => this.map.getZoom(),
                        },
                        centerLow: {
                            type: 'vec2f',
                            value: () => new Float32Array([lowX, lowY]),
                        },
                        centerHigh: {
                            type: 'vec2f',
                            value: () => new Float32Array([highX, highY]),
                        },
                        z: {
                            type: 'vec2f',
                            value: () => [highZ, lowZ],
                        },
                    }
                }),
            ]
        }).use()

        const outputBinding = Scratch.Binding.create({
            range: () => [4],
            samplers: [lSamplerDesc],
            uniforms: [
                {
                    name: 'staticUniform',
                    map: {
                        gamma: {
                            type: 'f32',
                            value: () => 1.0,
                        },
                    }
                }
            ],
            // textures: [ { texture: fxaaPass.getOutputAttachment()} ]
            textures: [{ texture: sceneTexture }]
        })

        const outputPipeline = Scratch.RenderPipeline.create({
            shader: { module: Scratch.shaderLoader.load('Shader (Output)', '/shaders/last.wgsl') },
            primitive: { topology: 'triangle-strip' },
        })

        lodMapPass = Scratch.RenderPass.create({
            name: 'Render Pass (LOD Map)',
            colorAttachments: [{ colorResource: lodMapTexture }]
        })

        meshRenderPass = Scratch.RenderPass.create({
            name: 'Render Pass (Water DEM)',
            colorAttachments: [{ colorResource: sceneTexture }],
            depthStencilAttachment: { depthStencilResource: depthTexture }
        })

        jsonRenderPass = Scratch.RenderPass.create({
            name: 'Render Pass (Water DEM)',
            colorAttachments: [{ colorResource: sceneTexture, loadOp: 'load' }],
            depthStencilAttachment: { depthStencilResource: depthTexture, depthLoadOp: 'load' }
        })

        const outputRenderPass = Scratch.RenderPass.create({
            name: 'DEM Layer Output',
            colorAttachments: [{ colorResource: screen.getCurrentCanvasTexture() }]
        }).add(outputPipeline, outputBinding)


        // Scratch.director.addStage({
        //     name: 'Water DEM Shower',
        //     items: [
        //         lodMapPass,
        //         meshRenderPass,
        //     ],
        //     visibility: true,
        // })

        //test for water dif 
        const waterdifRenderpass =  await INIT(sceneTexture)
        console.log(waterdifRenderpass);

        const { simulationPass, renderPass } = await init(screen)
        // const { simulationPass, renderPass } = await init(sceneTexture)
        Scratch.director.addStage({
            name: 'Flow Field Shower',
            items: [
                simulationPass,
                renderPass,
            ],
            visibility: true,
        })

        // Scratch.director.addStage({
        //     name: 'Bridge Shower',
        //     items: [
        //         jsonRenderPass
        //     ],
        //     visibility: true,
        // })

        // Scratch.director.addStage({
        //     name: 'WaterDif show',
        //     items:[
        //         waterdifRenderpass,
        //     ],
        //     visibility: true
        // })

        // Scratch.director.addStage({
        //     name: 'OutPut',
        //     items: [
        //         outputRenderPass,
        //     ],
        //     visibility: true,
        // })



        terrain2d = new TerrainTile(MAX_LEVEL)

        await makeBridgeColumn()
        await makeBridgeSurf()

        // await preLoad(sceneTexture.texture)
        // await init(document.getElementById('WebGPUFrame-flow'))

        this.isInitialized = true
        showFlowField(true)
        showBridge(false)
        // window.addEventListener("keydown", (e) => {
        //     // console.log(e.key);
        //     if (e.key === '1')
        //         showFlowField(false)
        //     if (e.key === '2')
        //         showFlowField(true)
        //     if (e.key === '3')
        //         showBridge(true)
        //     if (e.key === '4')
        //         showBridge(false)
        //     if (e.key === '5')
        //         showDEM(true)
        //     if (e.key === '6')
        //         showDEM(false)
        //     if (e.key === '7')
        //         Scratch.director.showStage('Water DEM Shower')
        //     if (e.key === '8')
        //         Scratch.director.hideStage('Water DEM Shower')
        // })
    }

    render(gl, matrix) {

        if (!this.isInitialized) return

        this.map.triggerRepaint()

        if (!terrain2d) return

        const cameraPos = new mapboxgl.MercatorCoordinate(...this.map.transform._computeCameraPosition().slice(0, 2)).toLngLat()
        const cameraBounds = new BoundingBox2D(this.map.getBounds().toArray().flat())
        const zoomLevel = this.map.getZoom()
        const mapCenter = this.map.getCenter()
        const cameraHeight = new mapboxgl.MercatorCoordinate(...this.map.transform._computeCameraPosition().slice(0, 3)).toAltitude()
        const mercatorCenter = mapboxgl.MercatorCoordinate.fromLngLat([mapCenter.lng, mapCenter.lat], cameraHeight)
        const mercatorCenterX = encodeFloatToDouble(mercatorCenter.x)
        const mercatorCenterY = encodeFloatToDouble(mercatorCenter.y)
        const mercatorCenterZ = encodeFloatToDouble(mercatorCenter.z)
        lowX = mercatorCenterX[1]
        lowY = mercatorCenterY[1]
        lowZ = mercatorCenterZ[1]
        highX = mercatorCenterX[0]
        highY = mercatorCenterY[0]
        highZ = mercatorCenterZ[0]
        // mapMatrix = matrix.slice()
        mapMatrix = new Float32Array(getMercatorMatrix(this.map.transform.clone()))
        mapMatrix[12] += mapMatrix[0] * highX + mapMatrix[4] * highY
        mapMatrix[13] += mapMatrix[1] * highX + mapMatrix[5] * highY
        mapMatrix[14] += mapMatrix[2] * highX + mapMatrix[6] * highY
        mapMatrix[15] += mapMatrix[3] * highX + mapMatrix[7] * highY
        // originMatrix = matrix.slice()
        originMatrix = new Float32Array(getMercatorMatrix(this.map.transform.clone()))
        originMatrix[12] += originMatrix[0] * highX + originMatrix[4] * highY + originMatrix[8] * highZ
        originMatrix[13] += originMatrix[1] * highX + originMatrix[5] * highY + originMatrix[9] * highZ
        originMatrix[14] += originMatrix[2] * highX + originMatrix[6] * highY + originMatrix[10] * highZ
        originMatrix[15] += originMatrix[3] * highX + originMatrix[7] * highY + originMatrix[11] * highZ

        terrain2d.registerRenderableNode({
            cameraBounds,
            cameraPos: [cameraPos.lng, cameraPos.lat],
            zoomLevel,
        })

        screen.swap()

        // Flow-field visualization
        tickLogic(mapMatrix, [mercatorCenter.x, mercatorCenter.y], matrix)
        // tick(mapMatrix, [mercatorCenter.x, mercatorCenter.y])

        // DEM layer tick
        Scratch.director.tick()

        // console.log(Scratch.monitor.getMemoryInMB())

    }
}

function showBridge(visibility) {

    if (visibility) Scratch.director.showStage('Bridge Shower')
    else Scratch.director.hideStage('Bridge Shower')
}

function showDEM(visibility) {

    if (visibility) Scratch.director.showStage('OutPut')
    else Scratch.director.hideStage('OutPut')
}

function smoothstep(e0, e1, x) {
    x = clamp((x - e0) / (e1 - e0), 0, 1);
    return x * x * (3 - 2 * x);
}

function getProjectionInterpolationT(projection, zoom, width, height, maxSize = Infinity) {
    const range = projection.range;
    if (!range) return 0;

    const size = Math.min(maxSize, Math.max(width, height));
    // The interpolation ranges are manually defined based on what makes
    // sense in a 1024px wide map. Adjust the ranges to the current size
    // of the map. The smaller the map, the earlier you can start unskewing.
    const rangeAdjustment = Math.log(size / 1024) / Math.LN2;
    const zoomA = range[0] + rangeAdjustment;
    const zoomB = range[1] + rangeAdjustment;
    const t = smoothstep(zoomA, zoomB, zoom);
    return t;
}

function getMercatorMatrix(t) {

    if (!t.height) return;

    const offset = t.centerOffset;

    // Z-axis uses pixel coordinates when globe mode is enabled
    const pixelsPerMeter = t.pixelsPerMeter;

    if (t.projection.name === 'globe') {
        t._mercatorScaleRatio = mercatorZfromAltitude(1, t.center.lat) / mercatorZfromAltitude(1, GLOBE_SCALE_MATCH_LATITUDE);
    }

    const projectionT = getProjectionInterpolationT(t.projection, t.zoom, t.width, t.height, 1024);

    // 'this._pixelsPerMercatorPixel' is the ratio between pixelsPerMeter in the current projection relative to Mercator.
    // This is useful for converting e.g. camera position between pixel spaces as some logic
    // such as raycasting expects the scale to be in mercator pixels
    t._pixelsPerMercatorPixel = t.projection.pixelSpaceConversion(t.center.lat, t.worldSize, projectionT);

    t.cameraToCenterDistance = 0.5 / Math.tan(t._fov * 0.5) * t.height * t._pixelsPerMercatorPixel;

    t._updateCameraState();

    t._farZ = t.projection.farthestPixelDistance(t);

    // The larger the value of nearZ is
    // - the more depth precision is available for features (good)
    // - clipping starts appearing sooner when the camera is close to 3d features (bad)
    //
    // Smaller values worked well for mapbox-gl-js but deckgl was encountering precision issues
    // when rendering it's layers using custom layers. This value was experimentally chosen and
    // seems to solve z-fighting issues in deckgl while not clipping buildings too close to the camera.
    t._nearZ = t.height / 50;

    let _farZ = Math.max(Math.pow(2, t.tileZoom), 5000000.0)
    // let _farZ = Math.min(Math.pow(2, t.tileZoom + 5), 50000.0)
    // let _nearZ = Math.max(Math.pow(2, t.tileZoom - 8), 0.0)

    const zUnit = t.projection.zAxisUnit === "meters" ? pixelsPerMeter : 1.0;
    const worldToCamera = t._camera.getWorldToCamera(t.worldSize, zUnit);

    let cameraToClip;

    const cameraToClipPerspective = t._camera.getCameraToClipPerspective(t._fov, t.width / t.height, t._nearZ, _farZ);
    // Apply offset/padding
    cameraToClipPerspective[8] = -offset.x * 2 / t.width;
    cameraToClipPerspective[9] = offset.y * 2 / t.height;

    if (t.isOrthographic) {
        const cameraToCenterDistance = 0.5 * t.height / Math.tan(t._fov / 2.0) * 1.0;

        // Calculate bounds for orthographic view
        let top = cameraToCenterDistance * Math.tan(t._fov * 0.5);
        let right = top * t.aspect;
        let left = -right;
        let bottom = -top;
        // Apply offset/padding
        right -= offset.x;
        left -= offset.x;
        top += offset.y;
        bottom += offset.y;

        cameraToClip = t._camera.getCameraToClipOrthographic(left, right, bottom, top, t._nearZ, t._farZ);

        const mixValue =
            t.pitch >= OrthographicPitchTranstionValue ? 1.0 : t.pitch / OrthographicPitchTranstionValue;
        // lerpMatrix(cameraToClip, cameraToClip, cameraToClipPerspective, easeIn(mixValue));
    } else {
        cameraToClip = cameraToClipPerspective;
    }

    const worldToClipPerspective = mat4.mul([], cameraToClipPerspective, worldToCamera);
    let m = mat4.mul([], cameraToClip, worldToCamera);

    if (t.projection.isReprojectedInTileSpace) {
        // Projections undistort as you zoom in (shear, scale, rotate).
        // Apply the undistortion around the center of the map.
        const mc = t.locationCoordinate(t.center);
        const adjustments = mat4.identity([]);
        mat4.translate(adjustments, adjustments, [mc.x * t.worldSize, mc.y * t.worldSize, 0]);
        mat4.multiply(adjustments, adjustments, getProjectionAdjustments(t));
        mat4.translate(adjustments, adjustments, [-mc.x * t.worldSize, -mc.y * t.worldSize, 0]);
        mat4.multiply(m, m, adjustments);
        mat4.multiply(worldToClipPerspective, worldToClipPerspective, adjustments);
        t.inverseAdjustmentMatrix = getProjectionAdjustmentInverted(t);
    } else {
        t.inverseAdjustmentMatrix = [1, 0, 0, 1];
    }

    // The mercatorMatrix can be used to transform points from mercator coordinates
    // ([0, 0] nw, [1, 1] se) to GL coordinates. / zUnit compensates for scaling done in worldToCamera.
    t.mercatorMatrix = mat4.scale([], m, [t.worldSize, t.worldSize, t.worldSize / zUnit, 1.0]);

    t.projMatrix = m;

    // For tile cover calculation, use inverted of base (non elevated) matrix
    // as tile elevations are in tile coordinates and relative to center elevation.
    t.invProjMatrix = mat4.invert(new Float64Array(16), t.projMatrix);

    return t.mercatorMatrix

    // const clipToCamera = mat4.invert([], cameraToClip);
    // t.frustumCorners = FrustumCorners.fromInvProjectionMatrix(clipToCamera, t.horizonLineFromTop(), t.height);

    // // Create a camera frustum in mercator units
    // t.cameraFrustum = Frustum.fromInvProjectionMatrix(t.invProjMatrix, t.worldSize, 0.0, !isGlobe);

    // const view = new Float32Array(16);
    // mat4.identity(view);
    // mat4.scale(view, view, [1, -1, 1]);
    // mat4.rotateX(view, view, t._pitch);
    // mat4.rotateZ(view, view, t.angle);

    // const projection = mat4.perspective(new Float32Array(16), t._fov, t.width / t.height, t._nearZ, t._farZ);

    // t.starsProjMatrix = mat4.clone(projection);

    // // The distance in pixels the skybox needs to be shifted down by to meet the shifted horizon.
    // const skyboxHorizonShift = (Math.PI / 2 - t._pitch) * (t.height / t._fov) * t._horizonShift;
    // // Apply center of perspective offset to skybox projection
    // projection[8] = -offset.x * 2 / t.width;
    // projection[9] = (offset.y + skyboxHorizonShift) * 2 / t.height;
    // t.skyboxMatrix = mat4.multiply(view, projection, view);

    // // Make a second projection matrix that is aligned to a pixel grid for rendering raster tiles.
    // // We're rounding the (floating point) x/y values to achieve to avoid rendering raster images to fractional
    // // coordinates. Additionally, we adjust by half a pixel in either direction in case that viewport dimension
    // // is an odd integer to preserve rendering to the pixel grid. We're rotating t shift based on the angle
    // // of the transformation so that 0°, 90°, 180°, and 270° rasters are crisp, and adjust the shift so that
    // // it is always <= 0.5 pixels.
    // const point = t.point;
    // const x = point.x, y = point.y;
    // const xShift = (t.width % 2) / 2, yShift = (t.height % 2) / 2,
    //     angleCos = Math.cos(t.angle), angleSin = Math.sin(t.angle),
    //     dx = x - Math.round(x) + angleCos * xShift + angleSin * yShift,
    //     dy = y - Math.round(y) + angleCos * yShift + angleSin * xShift;
    // const alignedM = new Float64Array(m);
    // mat4.translate(alignedM, alignedM, [ dx > 0.5 ? dx - 1 : dx, dy > 0.5 ? dy - 1 : dy, 0 ]);
    // t.alignedProjMatrix = alignedM;

    // m = mat4.create();
    // mat4.scale(m, m, [t.width / 2, -t.height / 2, 1]);
    // mat4.translate(m, m, [1, -1, 0]);
    // t.labelPlaneMatrix = m;

    // m = mat4.create();
    // mat4.scale(m, m, [1, -1, 1]);
    // mat4.translate(m, m, [-1, -1, 0]);
    // mat4.scale(m, m, [2 / t.width, 2 / t.height, 1]);
    // t.glCoordMatrix = m;

    // // matrix for conversion from location to screen coordinates
    // t.pixelMatrix = mat4.multiply(new Float64Array(16), t.labelPlaneMatrix, worldToClipPerspective);

    // t._calcFogMatrices();
    // t._distanceTileDataCache = {};

    // // inverse matrix for conversion from screen coordinates to location
    // m = mat4.invert(new Float64Array(16), t.pixelMatrix);
    // if (!m) throw new Error("failed to invert matrix");
    // t.pixelMatrixInverse = m;

    // if (t.projection.name === 'globe' || t.mercatorFromTransition) {
    //     t.globeMatrix = calculateGlobeMatrix(t);

    //     const globeCenter = [t.globeMatrix[12], t.globeMatrix[13], t.globeMatrix[14]];

    //     t.globeCenterInViewSpace = vec3.transformMat4(globeCenter, globeCenter, worldToCamera);
    //     t.globeRadius = t.worldSize / 2.0 / Math.PI - 1.0;
    // } else {
    //     t.globeMatrix = m;
    // }

    // t._projMatrixCache = {};
    // t._alignedProjMatrixCache = {};
    // t._pixelsToTileUnitsCache = {};
}

function circumferenceAtLatitude(latitude) {

    const earthRadius = 6371008.8
    const earthCircumference = 2 * Math.PI * earthRadius
    return earthCircumference * Math.cos(latitude * Math.PI / 180)
}

function mercatorZfromAltitude(altitude, lat) {
    return altitude / circumferenceAtLatitude(lat)
}

function getMercatorMatrix2(t) {

    if (!t.height) return;

    const offset = t.centerOffset;

    // Z-axis uses pixel coordinates when globe mode is enabled
    const pixelsPerMeter = t.pixelsPerMeter;

    if (t.projection.name === 'globe') {
        t._mercatorScaleRatio = mercatorZfromAltitude(1, t.center.lat) / mercatorZfromAltitude(1, GLOBE_SCALE_MATCH_LATITUDE);
    }

    const projectionT = getProjectionInterpolationT(t.projection, t.zoom, t.width, t.height, 1024);

    // 'this._pixelsPerMercatorPixel' is the ratio between pixelsPerMeter in the current projection relative to Mercator.
    // This is useful for converting e.g. camera position between pixel spaces as some logic
    // such as raycasting expects the scale to be in mercator pixels
    t._pixelsPerMercatorPixel = t.projection.pixelSpaceConversion(t.center.lat, t.worldSize, projectionT);

    t.cameraToCenterDistance = 0.5 / Math.tan(t._fov * 0.5) * t.height * t._pixelsPerMercatorPixel;

    t._updateCameraState();

    t._farZ = t.projection.farthestPixelDistance(t);

    // The larger the value of nearZ is
    // - the more depth precision is available for features (good)
    // - clipping starts appearing sooner when the camera is close to 3d features (bad)
    //
    // Smaller values worked well for mapbox-gl-js but deckgl was encountering precision issues
    // when rendering it's layers using custom layers. This value was experimentally chosen and
    // seems to solve z-fighting issues in deckgl while not clipping buildings too close to the camera.
    t._nearZ = t.height / 50;

    let _farZ = Math.max(t._farZ, - 1 / mercatorZfromAltitude(-80.06899999999999, t.center.lat))
    let _nearZ = Math.max(t._nearZ, mercatorZfromAltitude(4.3745, t.center.lat))

    const zUnit = t.projection.zAxisUnit === "meters" ? pixelsPerMeter : 1.0;
    const worldToCamera = t._camera.getWorldToCamera(t.worldSize, zUnit);

    let cameraToClip;

    const cameraToClipPerspective = t._camera.getCameraToClipPerspective(t._fov, t.width / t.height, _nearZ, _farZ);
    // Apply offset/padding
    cameraToClipPerspective[8] = -offset.x * 2 / t.width;
    cameraToClipPerspective[9] = offset.y * 2 / t.height;

    if (t.isOrthographic) {
        const cameraToCenterDistance = 0.5 * t.height / Math.tan(t._fov / 2.0) * 1.0;

        // Calculate bounds for orthographic view
        let top = cameraToCenterDistance * Math.tan(t._fov * 0.5);
        let right = top * t.aspect;
        let left = -right;
        let bottom = -top;
        // Apply offset/padding
        right -= offset.x;
        left -= offset.x;
        top += offset.y;
        bottom += offset.y;

        cameraToClip = t._camera.getCameraToClipOrthographic(left, right, bottom, top, t._nearZ, t._farZ);

        const mixValue =
            t.pitch >= OrthographicPitchTranstionValue ? 1.0 : t.pitch / OrthographicPitchTranstionValue;
        // lerpMatrix(cameraToClip, cameraToClip, cameraToClipPerspective, easeIn(mixValue));
    } else {
        cameraToClip = cameraToClipPerspective;
    }

    const worldToClipPerspective = mat4.mul([], cameraToClipPerspective, worldToCamera);
    let m = mat4.mul([], cameraToClip, worldToCamera);

    if (t.projection.isReprojectedInTileSpace) {
        // Projections undistort as you zoom in (shear, scale, rotate).
        // Apply the undistortion around the center of the map.
        const mc = t.locationCoordinate(t.center);
        const adjustments = mat4.identity([]);
        mat4.translate(adjustments, adjustments, [mc.x * t.worldSize, mc.y * t.worldSize, 0]);
        mat4.multiply(adjustments, adjustments, getProjectionAdjustments(t));
        mat4.translate(adjustments, adjustments, [-mc.x * t.worldSize, -mc.y * t.worldSize, 0]);
        mat4.multiply(m, m, adjustments);
        mat4.multiply(worldToClipPerspective, worldToClipPerspective, adjustments);
        t.inverseAdjustmentMatrix = getProjectionAdjustmentInverted(t);
    } else {
        t.inverseAdjustmentMatrix = [1, 0, 0, 1];
    }

    // The mercatorMatrix can be used to transform points from mercator coordinates
    // ([0, 0] nw, [1, 1] se) to GL coordinates. / zUnit compensates for scaling done in worldToCamera.
    t.mercatorMatrix = mat4.scale([], m, [t.worldSize, t.worldSize, t.worldSize / zUnit, 1.0]);

    t.projMatrix = m;

    // For tile cover calculation, use inverted of base (non elevated) matrix
    // as tile elevations are in tile coordinates and relative to center elevation.
    t.invProjMatrix = mat4.invert(new Float64Array(16), t.projMatrix);

    return t.mercatorMatrix
}