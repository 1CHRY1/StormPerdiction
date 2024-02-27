import { Texture } from "../../platform/texture/texture"
import { Buffer } from "../../platform/buffer/buffer"
import { getDevice } from "../../scratch"




//目标：拿到rgba8填的buffer
class ImageBufferLoader {

    constructor() {

        this.workerIndex = 0
        this.imageResource = new WeakMap()
        this.workerKeys = new Map()
    }

    load(name, url, mipMapped, targetFormat = 'rgba8unorm') {

        const device = getDevice()
        // const textureDesc = { name: name, mipMapped: mipMapped}
        const workerKey = { index: this.workerIndex }
        this.workerKeys.set(this.workerIndex, workerKey)

        const textureDesc = {
            name: name,
            mipMapped: mipMapped,
            format: targetFormat,
            resource: {
                imageBitmap: () => this.imageResource.get(workerKey) ? { imageBitmap: this.imageResource.get(workerKey).deref(), index: workerKey.index } : { imageBitmap: null, index: workerKey.index },
                dataType: "imageBitmap"
            },
        }
        const texture = Texture.create(textureDesc)
        var imageBufferDesc = {
            name: undefined,
            size: undefined,
            usage: undefined,
            resource: {}
        }
        const imageBuffer = Buffer.create()

        const imageLoaderWorker = new Worker(new URL('./imageLoader.worker.js', import.meta.url))

        imageLoaderWorker.addEventListener('message', (event) => {
            const { imageBitmap } = event.data
            this.imageResource.set(workerKey, new WeakRef(imageBitmap))
            imageLoaderWorker.terminate()

            // ImageBitmap resource is stored by weakRef
            // Must update texture at once to ref this imageBitmap
            texture.update()
            // init alloc buffer
            imageBufferDesc.name = 'imageBuffer'
            imageBufferDesc.size = imageBitmap.width * imageBitmap.height * 4
            imageBufferDesc.usage = GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            imageBufferDesc.resource.dataType = 'size'

            imageBuffer.reset(imageBufferDesc)
            imageBufferDesc.resource.data = () => texture.texture
            imageBufferDesc.resource.dataType = 'texture'
            imageBuffer.reset(imageBufferDesc)
        })

        imageLoaderWorker.addEventListener('error', (error) => {

            console.error("Error loading image: ", error)
            imageLoaderWorker.terminate()
        });

        imageLoaderWorker.postMessage({ url })

        this.workerIndex++
        //return a buffer from rgba8img
        return imageBuffer
    }
}

const imageBufferLoader = new ImageBufferLoader()

export default imageBufferLoader

export {
    imageBufferLoader,
}
