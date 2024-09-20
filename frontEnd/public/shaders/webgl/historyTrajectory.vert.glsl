#version 300 es

uniform sampler2D showTexture;
uniform sampler2D uv_texture;
uniform float fadeFactor;

out vec2 v_texCoord;

const vec2[4] vertices = vec2[4](
    vec2(-1.0, -1.0),
    vec2(-1.0, 1.0),
    vec2(1.0, -1.0),
    vec2(1.0, 1.0)
);

const vec2[4] texCoords = vec2[4](
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0)
);

void main(){

    int index = gl_VertexID;
    gl_Position = vec4(vertices[index], 0.0, 1.0);
    v_texCoord = texCoords[index];

}