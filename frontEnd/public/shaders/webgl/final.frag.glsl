#version 300 es
precision highp float;

uniform sampler2D showTexture;
uniform sampler2D uvTexture;

in vec2 v_texCoord;
out vec4 fragColor;

void main() {
    // fragColor = texture(showTexture, v_texCoord) * 1.0f;
    // vec2 uv = texture(uvTexture, v_texCoord).xy;
    // if(uv == vec2(0.0f)) {
    //     fragColor = vec4(0.0f);
    //     return;
    // }
    vec4 color = texture(showTexture, v_texCoord).rgba;
    // if (color.xyz == vec3(0.0f)){
    //     fragColor = vec4(0.0f);
    //     return;
    // }

    fragColor = vec4(color);
    // fragColor = vec4(0);
    // fragColor = texture(showTexture, v_texCoord) * 0.5;
}