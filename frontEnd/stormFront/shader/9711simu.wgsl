struct UniformBlock {
    groupSize : vec2u,
    canvasSize : vec2u,

    progress : f32,
    particleNum : u32,
    segmentNum : f32,
    fullLife : f32,
    dropRate : f32,
    dropRateBump : f32,
    speedFactor : f32,
    randomSeed : f32,
    startStorageIndex : f32,
    startReadIndex : f32,
    fillWidth : f32,
    aaWidth : f32,
    maxParticleNum : f32,
    maxSegmentNum : f32,
    flowBoundary : vec4f, //vec4f(uMin, vMin, uMax, vMax)
    u_centerHigh : vec2f,
    u_centerLow : vec2f,
    u_matrix : mat4x4f
}

//Uniform bindings
@group(0) @binding(0) var<uniform> flowUniform : UniformBlock;

//Storage bindings
@group(1) @binding(0) var<storage, read_write> particleVelocity : array<f32>;
@group(1) @binding(1) var<storage, read_write> indexArray : array<u32>;
@group(1) @binding(2) var<storage, read_write> aliveNum : array<atomic < u32>, 4>;
@group(1) @binding(3) var<storage, read_write> particleAge : array<f32>;
@group(1) @binding(4) var<storage, read_write> particleAttribute : array<f32>;

//Texture bindings
@group(2) @binding(0) var fTexture1 : texture_2d<f32>;
@group(2) @binding(1) var fTexture2 : texture_2d<f32>;
@group(2) @binding(2) var seedingTexture : texture_2d<f32>;
//@group(2) @binding(3) var uvtex : texture_2d<f32>;

//Constants
override blockSize : u32;

//pseudo-random generator
fn rand(co : vec2f) -> f32 {
    let rand_constants = vec3f(12.9898, 78.233, 4375.85453);
    let t = dot(rand_constants.xy, co);
    return abs(fract(sin(t) * (rand_constants.z + t)));
}

fn uvCorrection(uv : vec2f, dim : vec2f) -> vec2f {

    return clamp(uv, vec2f(0.0), dim - vec2f(1.0));
}

fn linearSampling(texture : texture_2d<f32>, uv : vec2f, dim : vec2f) -> vec4f {

    let tl = textureLoad(texture, vec2i(uv), 0);
    let tr = textureLoad(texture, vec2i(uvCorrection(uv + vec2f(1.0, 0.0), dim).xy), 0);
    let bl = textureLoad(texture, vec2i(uvCorrection(uv + vec2f(0.0, 1.0), dim).xy), 0);
    let br = textureLoad(texture, vec2i(uvCorrection(uv + vec2f(1.0, 1.0), dim).xy), 0);

    let mix_x = fract(uv.x);
    let mix_y = fract(uv.y);
    let top = mix(tl, tr, mix_x);
    let bottom = mix(bl, br, mix_x);
    return mix(top, bottom, mix_y);
}

fn drop(velocity : f32, uv : vec2f) -> f32 {
    let seed = uv * flowUniform.randomSeed;
    let drop_rate = flowUniform.dropRate + velocity * flowUniform.dropRateBump;
    return step(drop_rate, rand(seed));
}

fn get_speed(uv : vec2f, fTexture : texture_2d<f32>) -> vec2f {

    let dim = vec2f(textureDimensions(fTexture, 0).xy);
    return clamp(linearSampling(fTexture, uv, dim).xy, vec2f(0.0), vec2f(1.0));
}

fn speed_gettt(min : f32, max : f32, uv : vec2f, tex : texture_2d<f32>) -> f32{

    let dim = vec2f(textureDimensions(tex, 0).xy);
    let color = textureLoad(tex, vec2i(uv), 0);
    let u32value = pack4x8unorm(color);

    return f32(f32(u32value) / f32(42949672995));
}


fn lookup_speed(position : vec2f) -> vec2f {

    let textureSize = textureDimensions(seedingTexture, 0);
    let uv = position * vec2f(textureSize);

    let speed1 = mix(flowUniform.flowBoundary.xy, flowUniform.flowBoundary.zw, get_speed(uv, fTexture1));
    let speed2 = mix(flowUniform.flowBoundary.xy, flowUniform.flowBoundary.zw, get_speed(uv, fTexture2));

    return mix(speed1, speed2, flowUniform.progress);

    //update in 2024/3/6 for  utex and vtex test
    //let speedU = speed_gettt(flowUniform.flowBoundary.x, flowUniform.flowBoundary.z,uv,utex);
    //let speedV = speed_gettt(flowUniform.flowBoundary.y, flowUniform.flowBoundary.w,uv,vtex);
    //return vec2f(speedU, speedV);

    //update in 2024/3/7 for  utex and vtex test
    //let speed1 = mix(flowUniform.flowBoundary.xy, flowUniform.flowBoundary.zw, get_speed(uv, uvtex));
    //return speed1;

}

fn speed_rate(velocity : vec2f) -> f32 {

    return length(velocity) / length(flowUniform.flowBoundary.zw);
    //return length(velocity - flowUniform.flowBoundary.xy) / length(flowUniform.flowBoundary.zw - flowUniform.flowBoundary.xy);
}


fn is_in_flow_progress(position : vec2f) -> f32 {

    let dim = vec2f(textureDimensions(seedingTexture, 0).xy);
    let uv = position * dim;
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x >= dim.x || uv.y >= dim.y)
    {
        return 1.0;
    }
    let color1 = textureLoad(seedingTexture, vec2u(uv), 0);
    //let color1 = textureLoad(seedingTexture, uv, 0);

    let xy1 = vec2u((u32(color1.x * 255.0) << 8) + u32(color1.y * 255.0), (u32(color1.z * 255.0) << 8) + u32(color1.w * 255.0));
    return select(0.0, 1.0, (xy1.x == vec2u(uv).x) && (xy1.y == vec2u(uv).y));
}

fn die(particleIndex : u32, nextIndex : u32, nextOffset : u32, particleInfo : vec4f)
{

    let seed = flowUniform.randomSeed + particleInfo.xy;
    let texcoords = vec2f(rand(seed + 1.4), rand(seed + 2.1));

    let dim = vec2f(textureDimensions(seedingTexture, 0));
    let uv = uvCorrection(texcoords * dim, dim);

    let rebirthColor = textureLoad(seedingTexture, vec2u(uv), 0);
    var rebirth_x = f32((u32(rebirthColor.x * 255.0) << 8) + u32(rebirthColor.y * 255.0));
    var rebirth_y = f32((u32(rebirthColor.z * 255.0) << 8) + u32(rebirthColor.w * 255.0));
    rebirth_x = rebirth_x + rand(seed + rebirth_x);
    rebirth_y = rebirth_y + rand(seed + rebirth_y);
    let rebirthPos = vec2f(rebirth_x, rebirth_y) / dim;

    particleVelocity[2 * nextIndex] = rebirthPos.x;
    particleVelocity[2 * nextIndex + 1] = rebirthPos.y;
    particleAge[nextIndex - nextOffset] = particleInfo.z + 1.0;
    particleAttribute[nextIndex] = speed_rate(lookup_speed(rebirthPos));
}

fn simulation(particleIndex : u32, nextIndex : u32, nextOffset : u32, particleInfo : vec4f)
{

    let textureSize = vec2f(textureDimensions(seedingTexture, 0));
    let velocity = lookup_speed(particleInfo.xy);
    let speedRate = speed_rate(velocity);

    //var newPos = particleInfo.xy + velocity * flowUniform.speedFactor / textureSize * 0.1; // wind
    //var newPos = particleInfo.xy + velocity * flowUniform.speedFactor / textureSize * 10.0; // flow
    var newPos = particleInfo.xy + velocity * flowUniform.speedFactor / textureSize; // flow


    newPos = clamp(newPos, vec2f(0.0), vec2f(1.0));

    let dropped = drop(speedRate, particleInfo.xy) * is_in_flow_progress(newPos);
    //let dropped = drop(speedRate, particleInfo.xy);

    let dyingInfo = vec4f(particleInfo.xy, flowUniform.fullLife - flowUniform.maxSegmentNum, particleInfo.w);
    let newInfo = vec4f(newPos, particleInfo.z + 1.0, speedRate);
    let realInfo = mix(dyingInfo, newInfo, dropped);

    particleVelocity[2 * nextIndex] = realInfo.x;
    particleVelocity[2 * nextIndex + 1] = realInfo.y;
    particleAge[nextIndex - nextOffset] = realInfo.z;
    particleAttribute[nextIndex] = realInfo.w;
}

fn freeze(particleIndex : u32, nextIndex : u32, nextOffset : u32, particleInfo : vec4f)
{

    particleVelocity[2 * nextIndex] = particleInfo.x;
    particleVelocity[2 * nextIndex + 1] = particleInfo.y;
    particleAge[nextIndex - nextOffset] = particleInfo.z + 1.0;
    particleAttribute[nextIndex] = particleInfo.w;
}

fn rebirth(particleIndex : u32, nextIndex : u32, nextOffset : u32, particleInfo : vec4f)
{

    particleVelocity[2 * nextIndex] = particleInfo.x;
    particleVelocity[2 * nextIndex + 1] = particleInfo.y;
    particleAge[nextIndex - nextOffset] = 1.0;
    particleAttribute[nextIndex] = particleInfo.w;
}

@compute @workgroup_size(blockSize, blockSize, 1)
fn cMain(@builtin(global_invocation_id) id : vec3 < u32>)
{

    let indexOffset = u32(flowUniform.startReadIndex * flowUniform.maxParticleNum);
    let nextIndexOffset = u32(flowUniform.startStorageIndex * flowUniform.maxParticleNum);
    let particleIndex = indexOffset + id.y * flowUniform.groupSize.x * blockSize + id.x;
    let nextIndex = nextIndexOffset + id.y * flowUniform.groupSize.x * blockSize + id.x;
    //let nextIndex = particleIndex;

    //let particleIndex = id.y * flowUniform.groupSize.x * blockSize + id.x;
    let currentPos = vec2f(particleVelocity[2 * particleIndex], particleVelocity[2 * particleIndex + 1]);
    let currentAge = particleAge[particleIndex - indexOffset];
    let currentAttribute = particleAttribute[particleIndex];
    let particleInfo = vec4f(currentPos, currentAge, currentAttribute);

    if (currentAge < flowUniform.fullLife - flowUniform.maxSegmentNum)
    {
        simulation(particleIndex, nextIndex, nextIndexOffset, particleInfo);
    }
    else if (currentAge == flowUniform.fullLife)
    {
        die(particleIndex, nextIndex, nextIndexOffset, particleInfo);
    }
    else if (abs(flowUniform.fullLife - currentAge) <= flowUniform.maxSegmentNum)
    {
        freeze(particleIndex, nextIndex, nextIndexOffset, particleInfo);
    }
    else {
        rebirth(particleIndex, nextIndex, nextIndexOffset, particleInfo);
    }

    if ((id.y * flowUniform.groupSize.x * blockSize + id.x < flowUniform.particleNum) && particleAge[nextIndex - nextIndexOffset] < flowUniform.fullLife)
    {
        indexArray[atomicAdd(&aliveNum[1], 1)] = particleIndex - indexOffset;
    }
}
