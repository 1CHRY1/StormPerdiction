struct VertexInput{
    @builtin(vertex_index) vertexIndex:u32,
    @location(0) vertexPos: vec2<f32>,
    @location(1) attrib: f32
}

struct VertexOutput{
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
}

struct UniformBlock{
    u_matrix: mat4x4f
}

// Constants
override attribMax: f32;
override attribMin: f32;

@group(0) @binding(0) var<uniform> ubo: UniformBlock;



@vertex fn vMain(vInput: VertexInput)-> VertexOutput {

    let alpha = (vInput.attrib - attribMin)/(attribMax - attribMin);
    var vsOutput: VertexOutput;
    vsOutput.position = ubo.u_matrix * vec4f(vInput.vertexPos, 0.0, 1.0);
    // vsOutput.color = vec4f(getColor(vInput.attrib, vec2f(attribMin, attribMax)),vInput.attrib);
    vsOutput.color = vec4f(getColor(vInput.attrib, vec2f(attribMin, attribMax)),alpha);

    return vsOutput;
}



fn colorFromInt(color: u32) -> vec3f {
    
    let b = f32(color & 0xFF) / 255.0;
    let g = f32((color >> 8) & 0xFF) / 255.0;
    let r = f32((color >> 16) & 0xFF) / 255.0;

    return vec3f(r, g, b);
}

fn getColor(attrib: f32, boundary: vec2f) -> vec3f{
    let rampColors = array<u32, 8>(
        0x3288bd,
        0x66c2a5,
        0xabdda4,
        0xe6f598,
        0xfee08b,
        0xfdae61,
        0xf46d43,
        0xd53e4f
    );
    let index = (attrib - boundary.x)/(boundary.y - boundary.x);
    let bottomIndex = floor(index * 8.0);
    let topIndex = ceil(index * 8.0);
    let interval = index * 8.0 - bottomIndex;
    let slowColor = colorFromInt(rampColors[u32(bottomIndex)]);
    let fastColor = colorFromInt(rampColors[u32(topIndex)]);

    
    // return select(slowColor, fastColor, interval>0.5);
    return mix(slowColor, fastColor, interval);
}


@fragment
fn fMain(fsInput: VertexOutput) -> @location(0) vec4f {

    return fsInput.color;
    // return vec4f(1.0, 0.0, 0.0, 1.0);
    

}
