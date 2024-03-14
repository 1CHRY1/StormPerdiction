import { UUID } from "../../core/utils/uuid.js"
import getDevice from "../context/device.js"
import { ArrayRef } from "../data/arrayRef.js"
import { BlockRef } from "../data/blockRef.js"
import director from "../director/director.js"
import monitor from "../monitor/monitor.js"

/**
 * @typedef {Object} BufferDescription
 * @property {string} name
 * @property {number} usage
 * @property {number} size
 */

/**
 * @typedef {ArrayRef | BlockRef} Ref
 */

class Buffer {

    /**
     * @param {BufferDescription} [description] 
     */
    constructor(description) {

        this.uuid = UUID()

        this.name = 'Buffer'
        this.refCount = 0
        this.device = getDevice()
        this.onChangeHandlers = []

        this.resource = {
            data: undefined,
            dataType: 'clean'
        }
        if (description) {

            this.usage = description.usage ? description.usage : GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            this.name = description.name ? description.name : 'Buffer'
            this.resource = description.resource ? description.resource : {
                data: undefined,
                dataType: 'clean'
            }
            if (description.size) {
                this.size = description.size
                this.buffer = this.device.createBuffer({
                    label: this.name,
                    size: this.size,
                    usage: this.usage
                })
                monitor.memorySizeInBytes += this.size
            }

        }

        /**
         * @type {{[mapName: string]: {start: number, length: number, ref: Ref, dataOffset?: number, size?: number, callbackIndex: number}}}
         */
        this.areaMap = {}
        this.lastAreaName = null

        this.dirtyList = new Set()
        director.addBuffer(this)
    }

    static create(description) {
        const buffer = new Buffer(description)
        return buffer
    }

    use() {

        this.refCount++
        return this
    }

    release() {

        if (--this.refCount === 0) this.destroy()

        return null
    }

    /**
     * 
     * @param {Ref} ref
     * @param {number} [dataOffset]
     * @param {number} [size]
     * @param {number} alignment
     */
    registerStrutureMap(ref, dataOffset, size, alignment = 1) {

        let offset = 0
        if (this.lastAreaName) {
            const lastArea = this.areaMap[this.lastAreaName]
            offset = lastArea.start + lastArea.length
        }
        this.lastAreaName = ref.name

        let alignmentOffset = 0
        if (ref.value.byteLength % alignment) {
            alignmentOffset = alignment - (ref.value.byteLength % alignment)
        }
        let length = ref.value.byteLength + alignmentOffset

        this.areaMap[ref.name] = {
            start: offset,
            length: length,

            // Related CPU typedArray data information
            ref: ref.use(),
            dataOffset: dataOffset,
            size: size,
            callbackIndex: ref.registerCallback(() => this.makeDirty(ref.name))
        }

        this.makeDirty(ref.name)
    }

    /**
     * 
     * @param {string} name 
     */
    makeDirty(name) {

        this.dirtyList.add(name)
    }

    /**
     * 
     * @param {string} name 
     */
    updateSubArea(name) {

        const subArea = this.areaMap[name]

        this.device.queue.writeBuffer(this.buffer, subArea.start, subArea.ref.value, subArea.dataOffset, subArea.size)
    }

    update() {
        let encoder = this.device.createCommandEncoder()
        switch (this.resource.dataType) {
            case 'clean':

                if (!this.dirtyList.size) return
                this.dirtyList.forEach((name) => {
                    this.updateSubArea(name)
                })
                this.dirtyList = new Set()
                break;

            case 'size':

                if (this.buffer) return;
                this.buffer = this.device.createBuffer({
                    label: this.name,
                    size: this.size,
                    usage: this.usage
                })
                monitor.memorySizeInBytes += this.size
                break;

            case 'texture'://GPUTexture
                let texture = this.resource.data()
                if (!texture) return;
                encoder.copyTextureToBuffer(
                    { texture: texture, mipLevel: 0, origin: [0, 0, 0], aspect: 'all' },
                    { buffer: this.buffer, offset: 0, bytesPerRow: texture.width * 4, rowsPerImage: texture.height },
                    [texture.width, texture.height]
                )
                break;

            case 'buffer'://GPUBuffer
                let srcBuffer = this.resource.data()
                if(!srcBuffer) return
                //default copy all
                encoder.copyBuffertoBuffer(
                    srcBuffer, 0,
                    this.buffer, 0,
                    this.buffer.size
                )
                break;
        }
        this.device.queue.submit([encoder.finish()])

        this.resource.dataType = 'clean'
    }

    destroy() {

        if (this.buffer) {
            this.buffer.destroy()
            this.buffer = null
        }

        if (this.size) monitor.memorySizeInBytes -= this.size

        director.removeBuffer(this.uuid)

        this.uuid = null
        this.name = null
        this.refCount = null
        this.size = null
        this.usage = null
        this.lastAreaName = null

        for (const key in this.areaMap) {
            let area = this.areaMap[key]
            area.callbackIndex = area.ref.removeCallback(area.callbackIndex)
            area.ref = area.ref.release()
            area.dataOffset = null
            area.length = null
            area.start = null
            area.size = null
        }
        this.areaMap = null

        this.dirtyList.clear()
        this.dirtyList = null
    }

    reset(description) {
        // if (description && description.size) {

        //     this.size = description.size,
        //         this.usage = description.usage
        //     this.name = description.name

        //     this.buffer = this.device.createBuffer({
        //         label: this.name,
        //         size: this.size,
        //         usage: this.usage
        //     })
        //     monitor.memorySizeInBytes += this.size
        // }
        if (description) {

            this.usage = description.usage ? description.usage : GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            this.name = description.name ? description.name : 'Buffer'
            this.resource = description.resource ? description.resource : {
                data: undefined,
                dataType: 'clean'
            }
            if (description.size) {
                this.size = description.size
                if (!this.buffer) {
                    this.buffer = this.device.createBuffer({
                        label: this.name,
                        size: this.size,
                        usage: this.usage
                    })
                    monitor.memorySizeInBytes += this.size
                }

            }

        }
        this.update()
        this.onChangeHandlers.forEach(handler => handler && handler())

    }

    registerCallback(callback) {
        this.onChangeHandlers.push(callback)
        return this.onChangeHandlers.length - 1

    }
    removeCallback(index) {
        this.onChangeHandlers[index] = null
        return null

    }

}

export {
    Buffer
}