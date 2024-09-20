#version 300 es

in vec2 a_position;//station position ==> vec2(lng,lat)
in vec2 a_velocity_from;//velocity from bin ==> vec2(u,v)
in vec2 a_velocity_to;//velocity to bin ==> vec2(u,v)

uniform float progressRatio;
uniform vec4 u_flowExtent;// minx, miny, maxx, maxy
uniform mat4 u_matrix;
// uniform sampler2D u_maskTexture;

out vec2 v_velocity;

const float PI = 3.141592653f;


vec2 lnglat2Mercator(float lng, float lat) {
    float x = (180.0f + lng) / 360.0f;
    float y = (180.0f - (180.0f / PI) * log(tan(PI / 4.0f + (lat * PI) / 360.0f))) / 360.0f;
    return vec2(x, y);
}

void main() {

    float x = (a_position.x - u_flowExtent.x) / (u_flowExtent.z - u_flowExtent.x);
    float y = (a_position.y - u_flowExtent.y) / (u_flowExtent.w - u_flowExtent.y);

    vec2 mercator = lnglat2Mercator(a_position.x, a_position.y);

    v_velocity = mix(a_velocity_from, a_velocity_to, progressRatio);
    // v_velocity = a_position;
    // v_velocity = vec2(1.0f, 0.0f);
    // gl_Position = u_matrix * vec4(x, y, 0.0f, 1.0f);

    // gl_Position = u_matrix * vec4(mercator.x, mercator.y, 0.0f, 1.0f);

    // vec2 mercator = lnglat2Mercator(a_position.x, a_position.y);

    // 管线测试
    // float vert[6] = float[6](0.0f, 0.0f, 0.5f, 0.5f, 0.5f, -0.5f);
    // int id = gl_VertexID;
    // vec2 position = vec2(vert[id * 2], vert[id * 2 + 1]);

    // gl_Position = u_matrix * vec4(x, y, 0.0f, 1.0f);
    // gl_Position = u_matrix * vec4(a_position, 0.0f, 1.0f);
    gl_Position = u_matrix * vec4(mercator, 0.0f, 1.0f);

}