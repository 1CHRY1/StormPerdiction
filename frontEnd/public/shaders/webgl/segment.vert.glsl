#version 300 es

// in vec3 positionInfo_from;
// in vec3 positionInfo_to;
in vec4 a_positionInfo;// x1,y1, x2,y2
in float a_velocity;// v

uniform mat4 u_matrix;
uniform mat4 u_centerOffsetMatrix;
uniform vec2 u_centerHigh;// x_high, y_high
uniform vec2 u_centerLow;// x_low, y_low
uniform vec2 u_canvasSize;
uniform float aaWidth;
uniform float fillWidth;

out float velocity;
out float opacity;

const float PI = 3.14159265359f;

vec2 translateToRelative(vec2 pos_high, vec2 pos_low) {
    // x_high, y_high      x_low, y_low
    vec2 highDiff = pos_high - u_centerHigh;
    vec2 lowDiff = pos_low - u_centerLow;
    return highDiff + lowDiff;
}

vec2 lnglat2Mercator(float lng, float lat) {
    float x = (180.0f + lng) / 360.0f;
    float y = (180.0f - (180.0f / PI) * log(tan(PI / 4.0f + (lat * PI) / 360.0f))) / 360.0f;
    return vec2(x, y);
}

vec4 getClipSpacePosition(vec2 pos) { // pos in lnglat
    vec2 mercatorPos = lnglat2Mercator(pos.x, pos.y);

    // vec2 relativePos = translateToRelative(mercatorPos, vec2(0.0f, 0.0f));

    return u_matrix * vec4(mercatorPos, 0.0f, 1.0f);
    // return u_matrix * vec4(relativePos + vec2(u_centerHigh[0],u_centerHigh[1]), 0.0f, 1.0f);
    // return u_centerOffsetMatrix * u_matrix * vec4(mercatorPos, 0.0f, 1.0f);
}

void main() {
    /////// vertex:2         instance:particleNum

    // vec2 pos = vec2(gl_VertexID % 2 == 0 ? a_positionInfo.zw : a_positionInfo.xy);
    // velocity = a_velocity;
    // gl_Position = u_matrix * vec4(lnglat2Mercator(pos.x, pos.y), 0.0f, 1.0f);
    // gl_PointSize = 5.0f;

    /// with anti-aliasing
    vec2 fromPos = vec2(a_positionInfo.x, a_positionInfo.y);
    vec2 toPos = vec2(a_positionInfo.z, a_positionInfo.w);
    int parity = gl_VertexID % 2;

    vec4 currentNodeCS = getClipSpacePosition(fromPos);
    vec4 nextNodeCS = getClipSpacePosition(toPos);
    vec4 currentNodeSS = currentNodeCS / currentNodeCS.w;
    vec4 nextNodeSS = nextNodeCS / nextNodeCS.w;

    vec2 fromToVector = normalize(nextNodeSS.xy - currentNodeSS.xy);
    vec3 view = vec3(0.0f, 0.0f, 1.0f);
    vec2 offsetVector = normalize(cross(vec3(fromToVector, 0.0f), view).xy) * (gl_VertexID % 2 == 0 ? 1.0f : -1.0f);

    float ssOffset = (fillWidth + aaWidth * 2.0f) * 0.5f;
    vec4 basePositionSS = gl_VertexID / 2 == 0 ? currentNodeSS : nextNodeSS;
    vec2 offsetedPositionSS = basePositionSS.xy + offsetVector.xy * ssOffset / u_canvasSize;

    float w = gl_VertexID / 2 == 0 ? currentNodeCS.w : nextNodeCS.w;

    // vec4 offsetedPositionCS = vec4(offsetedPositionSS, 0.0f, 1.0f) * basePositionSS.w;
    vec4 offsetedPositionCS = vec4(offsetedPositionSS, 0.0f, 1.0f) * w;// ????
    gl_Position = offsetedPositionCS;
    velocity = a_velocity;
    opacity = abs(2.0f * float(parity) - 1.0f); // 0,1 ==> -1,1

    /// TEST  TRIANGLE STRIP offset 
    // vec2 pos = vec2(gl_VertexID / 2 == 0 ? a_positionInfo.xy : a_positionInfo.zw);// vertex 0, 1, 2, 3
    // velocity = a_velocity;

    // float size = 5.0f;
    // vec2[4] offset = vec2[4](vec2(0.0f, 1.0f), vec2(0.0f, -1.0f), vec2(0.0f, 1.0f), vec2(0.0f, -1.0f));

    // vec4 positionInCS = getClipSpacePosition(pos);
    // vec4 positionInSS = positionInCS / positionInCS.w;
    // vec2 positionOffsetedInSS = positionInSS.xy + offset[gl_VertexID % 4] * size / u_canvasSize;

    // gl_Position = vec4(positionOffsetedInSS, 0.0f, 1.0f) * positionInCS.w;
}