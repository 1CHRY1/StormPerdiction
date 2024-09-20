#version 300 es

in vec4 a_pos;
in vec2 a_texCoord;
uniform sampler2D showingTexture;

out vec2 v_texCoord;

void main() {
    v_texCoord = a_texCoord;
    gl_Position = a_pos * vec4(1, -1, 1, 1);
}
