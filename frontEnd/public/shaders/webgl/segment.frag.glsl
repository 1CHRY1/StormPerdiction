#version 300 es
precision highp float;

in float velocity;
in float opacity;
uniform float maxSpeed;
uniform float aaWidth;
uniform float fillWidth;

const float PI = 3.14159265359f;

out vec4 fragColor;

const vec3 color[10] = vec3[10](vec3(224, 249, 123) / 255.0f, vec3(233, 231, 116) / 255.0f, vec3(240, 213, 108) / 255.0f, vec3(246, 195, 101) / 255.0f, vec3(250, 176, 94) / 255.0f, vec3(253, 157, 87) / 255.0f, vec3(255, 137, 80) / 255.0f, vec3(255, 115, 73) / 255.0f, vec3(255, 90, 66) / 255.0f, vec3(255, 59, 59) / 255.0f);

// int rampColors0[8] = int[](
//     0x3288bd,
//     0x66c2a5,
//     0xabdda4,
//     0xe6f598,
//     0xfee08b,
//     0xfdae61,
//     0xf46d43,
//     0xd53e4f
// );
const vec3 color2[8] = vec3[8](vec3(0.20f, 0.21f, 0.74f), vec3(0.40f, 0.77f, 0.65f), vec3(0.66f, 0.87f, 0.65f), vec3(0.90f, 0.97f, 0.59f), vec3(0.99f, 0.93f, 0.72f), vec3(0.98f, 0.67f, 0.38f), vec3(0.96f, 0.42f, 0.26f), vec3(0.83f, 0.24f, 0.31f));

vec3 getColor(float v) {
    if(v == 0.0f) {
        return vec3(224, 249, 123);
    }

    float normalV = v / maxSpeed;
    int ceilIndex = int(ceil(normalV * 8.0f));
    int floorIndex = int(floor(normalV * 8.0f));
    float interval = (normalV * 8.0f) - floor(normalV * 8.0f);
    return mix(color2[floorIndex], color2[ceilIndex], interval);
    // return vec3(0.0f, 0.7f, 0.0f);
}

float getAlpha(float param) {
    if(aaWidth == 0.0f) {
        return 1.0f;
    } else {
        return 1.0f - sin(clamp((param * (0.5f * fillWidth + aaWidth) - 0.5f * fillWidth) / aaWidth, 0.0f, 1.0f) * 2.0f / PI);
    }
}

void main() {
    float alpha = getAlpha(opacity);
    vec3 color = getColor(velocity);
    // fragColor = vec4(color, 1.0f) * alpha;
    fragColor = vec4(color, 1.0f);
    // fragColor = vec4(color, 0.8f);
    // fragColor = vec4(1.0,0.0,0.0,1.0);
}