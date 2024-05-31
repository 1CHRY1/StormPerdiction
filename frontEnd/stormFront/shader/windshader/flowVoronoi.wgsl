struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
    @location(0) position: vec4f,//xh,yh,xl,yl  0,1
    @location(1) vFrom: vec2f,// velocity from
    @location(2) vTo: vec2f,// velocity to
};

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) velocity: vec2f,
    @location(1) uv: vec2f,
};

struct FrameUniformBlock {
    randomSeed: f32,
    viewPort: vec2f,
    mapBounds: vec4f,
    zoomLevel: f32,
    progressRate: f32,
    maxSpeed: f32,
};

struct StaticUniformBlock {
    groupSize: vec2u,
    extent: vec4f,
};

struct DynamicUniformBlock {
    far: f32,
    near: f32,
    uMatrix: mat4x4f,
    centerLow: vec3f,
    centerHigh: vec3f,
};

// Uniform Bindings
@group(0) @binding(0) var<uniform> frameUniform: FrameUniformBlock;
@group(0) @binding(1) var<uniform> staticUniform: StaticUniformBlock;
@group(0) @binding(2) var<uniform> dynamicUniform: DynamicUniformBlock;

// @group(1) @binding(0) var<storage, read_write> outbuffer: array<f32>;

// @group(1) @binding(0) var border: texture_2d<f32>;

const PI = 3.1415926535;

fn translateRelativeToEye(high: vec3f, low: vec3f) -> vec3f {

    let highDiff = high - dynamicUniform.centerHigh;
    let lowDiff = low - dynamicUniform.centerLow;

    return highDiff + lowDiff;
}

fn calcWebMercatorCoord(coord: vec2f) -> vec2f {

    let lon = (180.0 + coord.x) / 360.0;
    let lat = (180.0 - (180.0 / PI * log(tan(PI / 4.0 + coord.y * PI / 360.0)))) / 360.0;
    return vec2f(lon, lat);
}

fn calBorderUV(pos: vec4f) -> vec2f {
    
    let cs_pos = dynamicUniform.uMatrix * pos;
    let ss_pos = cs_pos.xy/cs_pos.w;
    var uv = (ss_pos + 1.0) / 2.0;
    uv = vec2f(uv.x, 1.0-uv.y);
    return uv;
}

fn calBorderUV2(pos:vec4f) -> vec2f{

    let lb = vec2f(staticUniform.extent.x,staticUniform.extent.y);
    let rt = vec2f(staticUniform.extent.z,staticUniform.extent.w);
    // let m_lb = calcWebMercatorCoord(lb);
    // let m_rt = calcWebMercatorCoord(rt);
    let m_lb = lb;
    let m_rt = rt;

    let texLeftBot = vec4f(m_lb,0.0,1.0);
    let texRightTop = vec4f(m_rt,0.0,1.0);

    let mappedU = (pos.x-texLeftBot.x)/(texRightTop.x-texLeftBot.x);
    let mappedV = (pos.y-texLeftBot.y)/(texRightTop.y-texLeftBot.y);

    return vec2f(mappedU,1.0-mappedV);

}

fn calBorderUV3(cspos:vec4f) -> vec2f{

    let lb = vec2f(staticUniform.extent.x,staticUniform.extent.y);
    let rt = vec2f(staticUniform.extent.z,staticUniform.extent.w);
    let m_lb = calcWebMercatorCoord(lb);
    let m_rt = calcWebMercatorCoord(rt);
    // let m_lb = lb;
    // let m_rt = rt;

    let texLeftBot = vec4f(m_lb,0.0,1.0);
    let texRightTop = vec4f(m_rt,0.0,1.0);

    let cs_lb = dynamicUniform.uMatrix * texLeftBot;
    let cs_rt = dynamicUniform.uMatrix * texRightTop;

    let ss_lb = cs_lb.xy/cs_lb.w;
    let ss_rt = cs_rt.xy/cs_rt.w;

    let ss_pos =cspos.xy/ cspos.w;

    let mappedU = (ss_pos.x-ss_lb.x)/(ss_rt.x-ss_lb.x);
    let mappedV = (ss_pos.y-ss_lb.y)/(ss_rt.y-ss_lb.y);

    return vec2f(mappedU,mappedV);

}

fn calBorderUV4(geopos:vec2f)->vec2f{

    let lb = vec2f(staticUniform.extent.x,staticUniform.extent.y);
    let rt = vec2f(staticUniform.extent.z,staticUniform.extent.w);
    let m_lb = calcWebMercatorCoord(lb);
    let m_rt = calcWebMercatorCoord(rt);

    let mappedU = (geopos.x-m_lb.x)/(m_rt.x-m_lb.x);
    let mappedV = (geopos.y-m_lb.y)/(m_rt.y-m_lb.y);
    return vec2f(mappedU,mappedV);

}





@vertex
fn vMain(input: VertexInput) -> VertexOutput {
    let pos = vec4f(translateRelativeToEye(vec3f(input.position.xy, 0.0), vec3f(input.position.zw, 0.0)), 1.0);
    // let mapped_uv = calBorderUV(pos);



    var output: VertexOutput;
    output.position = dynamicUniform.uMatrix * pos;
    output.velocity = mix(input.vFrom, input.vTo, frameUniform.progressRate);
    // output.uv = mapped_uv;
    return output;
}

@fragment
fn fMain(input: VertexOutput) -> @location(0) vec2f {

    // let dim = vec2f(textureDimensions(border,0).xy);
    // let color = textureLoad(border,vec2i(dim*input.uv),0);
    // if(color.x == 0.0){
    //     return vec2f(0.0);
    // }


    return input.velocity;  
    
}
