#version 300 es
precision highp float;

in vec2 v_texCoord;
uniform sampler2D showingTexture;
uniform sampler2D showingTexture2;
out vec4 fragColor;

const vec3 color[10] = vec3[10](vec3(224, 249, 123) / 255.0f, vec3(233, 231, 116) / 255.0f, vec3(240, 213, 108) / 255.0f, vec3(246, 195, 101) / 255.0f, vec3(250, 176, 94) / 255.0f, vec3(253, 157, 87) / 255.0f, vec3(255, 137, 80) / 255.0f, vec3(255, 115, 73) / 255.0f, vec3(255, 90, 66) / 255.0f, vec3(255, 59, 59) / 255.0f);
const vec3 color2[8] = vec3[8](vec3(0.20f, 0.21f, 0.74f), vec3(0.40f, 0.77f, 0.65f), vec3(0.66f, 0.87f, 0.65f), vec3(0.90f, 0.97f, 0.59f), vec3(0.99f, 0.93f, 0.72f), vec3(0.98f, 0.67f, 0.38f), vec3(0.96f, 0.42f, 0.26f), vec3(0.83f, 0.24f, 0.31f));

const float maxV = 2.5f;
const float minV = 0.0f;

vec3 getColor(vec2 velocity) {

    float magnitude = length(velocity);
    float normalized = (magnitude - minV) / (maxV - minV);// normal
    int indexFloor = int(floor(normalized * 8.0f));
    int indexCeil = int(ceil(normalized * 8.0f));
    float factor = normalized * 8.0f - float(indexFloor);
    float roundedValue = round(factor * 8.0f) / 8.0f;
    return mix(color2[indexFloor], color2[indexCeil], factor);
    // return mix(color[indexFloor], color[indexCeil], roundedValue);
}

void main() {
    float alpha = 1.0f;
    vec2 velocityUV = texture(showingTexture, v_texCoord).rg;
    if(velocityUV == vec2(0.0f)) {
        fragColor = vec4(0.0f);
        return;
    }

    vec3 velocityColor = getColor(velocityUV);
    // fragColor = vec4(velocityColor, 1.0f) * alpha;
    fragColor = vec4(velocityColor, alpha);
    // fragColor = vec4(0.5f);

}