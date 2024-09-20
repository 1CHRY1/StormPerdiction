

export function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
    var shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

export function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    var program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        // console.log('program created successfully')
        return program;
    }
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export function createProgram2(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader, outVaryings: Iterable<string>) {
    const prg = gl.createProgram()!
    gl.attachShader(prg, vs)
    gl.attachShader(prg, fs)
    if (outVaryings) {
        gl.transformFeedbackVaryings(prg, outVaryings, gl.SEPARATE_ATTRIBS)
    }
    gl.linkProgram(prg)
    var success = gl.getProgramParameter(prg, gl.LINK_STATUS);
    if (success) {
        console.log('program created successfully')
        return prg;
    }
    console.warn(gl.getProgramInfoLog(prg));
    gl.deleteProgram(prg);
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    // 获取浏览器显示的画布的CSS像素值
    const displayWidth = canvas.clientWidth
    const displayHeight = canvas.clientHeight

    // 检查画布大小是否相同。
    const needResize =
        canvas.width !== displayWidth || canvas.height !== displayHeight

    if (needResize) {
        // 使画布大小相同
        canvas.width = displayWidth
        canvas.height = displayHeight
    }

    return needResize
}

export async function loadImageBitmap(url: string) {
    return new Promise((resolve, reject) => {
        // 创建一个Image对象
        const image = new Image();
        image.src = url;
        // 当图片加载完成时，使用createImageBitmap函数来创建ImageBitmap
        image.onload = () => {
            createImageBitmap(image).then(resolve).catch(reject);
        };
        // 当图片加载失败时，拒绝Promise
        image.onerror = () => {
            reject(new Error('Image failed to load'));
        };
        // 设置图片的src属性为提供的URL
    });
}

export function createEmptyTexture(gl: WebGL2RenderingContext) {

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    return texture
}

export function initGL(canvasId: string) {
    const canvas = document.querySelector(`#${canvasId}`) as HTMLCanvasElement
    const gl = canvas.getContext('webgl2', {
        premultipliedAlpha: true
    }) as WebGL2RenderingContext
    if (!gl) {
        console.warn('webgl2 not supported!')
        return
    }
    resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement)
    return gl
}

export function createVBO(gl: WebGL2RenderingContext, data: Array<number>) {
    const buffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    return buffer
}

export function createIBO(gl: WebGL2RenderingContext, data: Array<number>) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
    return indexBuffer
}


export function createCanvasSizeTexture(gl: WebGL2RenderingContext, type = 'RGBA8') {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    if (type === 'RGBA8') {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    } else if (type === 'RG32F') {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, gl.canvas.width, gl.canvas.height, 0, gl.RG, gl.FLOAT, new Float32Array(gl.canvas.width * gl.canvas.height * 2).fill(0));
    }
    return texture
}

export function encodeFloatToDouble(value: number) {

    const result = new Float32Array(2);
    result[0] = value;

    const delta = value - result[0];
    result[1] = delta;
    return result;
}



////// matrix
// a simple 3x3 matrix class
export class M3 {
    value: Array<number>
    constructor(data: Array<number> = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
        this.value = data
    }

    transition(x: number, y: number): M3 {
        let transMat = new M3([
            1, 0, 0,
            0, 1, 0,
            x, y, 1
        ])
        return this.mutiply(transMat.value, this.value)
    }

    scale(x: number, y: number): M3 {
        let scaleMat = new M3([
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        ])
        return this.mutiply(scaleMat.value, this.value)
    }

    rotate(angle: number): M3 {
        let rad = angle * Math.PI / 180
        let s = Math.sin(rad)
        let c = Math.cos(rad)
        let rotateMat = new M3([
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ])
        return this.mutiply(rotateMat.value, this.value)
    }

    mutiply(b: any, a: any): M3 {

        var a00 = a[0 * 3 + 0]
        var a01 = a[0 * 3 + 1]
        var a02 = a[0 * 3 + 2]
        var a10 = a[1 * 3 + 0]
        var a11 = a[1 * 3 + 1]
        var a12 = a[1 * 3 + 2]
        var a20 = a[2 * 3 + 0]
        var a21 = a[2 * 3 + 1]
        var a22 = a[2 * 3 + 2]
        var b00 = b[0 * 3 + 0]
        var b01 = b[0 * 3 + 1]
        var b02 = b[0 * 3 + 2]
        var b10 = b[1 * 3 + 0]
        var b11 = b[1 * 3 + 1]
        var b12 = b[1 * 3 + 2]
        var b20 = b[2 * 3 + 0]
        var b21 = b[2 * 3 + 1]
        var b22 = b[2 * 3 + 2]

        return new M3([
            b00 * a00 + b01 * a10 + b02 * a20,// b 一行 * a 一列
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22
        ])
    }
}

export class M4 {
    value: Array<number>
    constructor(data: Array<number> = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) {
        this.value = data
    }

    mutiply(b: any, a: any): M4 {
        // b * a
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];

        // 线代上的 B * A  ， B 左乘 A
        return new M4([
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,//b一行 * a一列
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]);
    }

    transition(x: number, y: number, z: number): M4 {
        let transMat = new M4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ])
        return this.mutiply(transMat.value, this.value) //一定是变换矩阵左乘原矩阵
    }

    scale(x: number, y: number, z: number): M4 {
        let scaleMat = new M4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ])
        return this.mutiply(scaleMat.value, this.value)
    }

    rotateX(angle: number): M4 {
        let rad = angle * Math.PI / 180
        let s = Math.sin(rad)
        let c = Math.cos(rad)
        let rotateMat = new M4([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ])
        return this.mutiply(rotateMat.value, this.value)
    }
    rotateY(angle: number): M4 {
        let rad = angle * Math.PI / 180
        let s = Math.sin(rad)
        let c = Math.cos(rad)
        let rotateMat = new M4([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ])
        return this.mutiply(rotateMat.value, this.value)
    }
    rotateZ(angle: number): M4 {
        let rad = angle * Math.PI / 180
        let s = Math.sin(rad)
        let c = Math.cos(rad)
        let rotateMat = new M4([
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.mutiply(rotateMat.value, this.value)
    }

    // 正交投影
    projection(width: number, height: number, depth: number): M4 {
        let orthographicMat = new M4([
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ])
        // return this.mutiply(orthographicMat.value, this.value)
        return orthographicMat
    }

}

export class M2 {
    value: Array<number>
    constructor(data: Array<number> = [1, 0, 0, 1]) {
        this.value = data
    }
    static rotateMat(angle: number): M2 {
        let rad = angle * Math.PI / 180
        let s = Math.sin(rad)
        let c = Math.cos(rad)
        let rotateMat = new M2([
            c, -s,
            s, c
        ])
        return rotateMat
    }
    static mutiply(b: any, a: any): M2 {
        // B * A
        var a00 = a[0 * 2 + 0]
        var a01 = a[0 * 2 + 1]
        var a10 = a[1 * 2 + 0]
        var a11 = a[1 * 2 + 1]
        var b00 = b[0 * 2 + 0]
        var b01 = b[0 * 2 + 1]
        var b10 = b[1 * 2 + 0]
        var b11 = b[1 * 2 + 1]
        return new M2([
            b00 * a00 + b01 * a10,
            b00 * a01 + b01 * a11,
            b10 * a00 + b11 * a10,
            b10 * a01 + b11 * a11,
        ])
    }
    static mutiplyVec(b: any, a: any): Array<number> {
        // mat2 * vec2 = vec2
        var b00 = b[0 * 2 + 0]
        var b01 = b[0 * 2 + 1]
        var b10 = b[1 * 2 + 0]
        var b11 = b[1 * 2 + 1]
        return [
            b00 * a[0] + b01 * a[1],
            b10 * a[0] + b11 * a[1]
        ]
    }
}