#version 300 es

in vec4 a_particleInfo;//(x1,y1, x2,y2)
// in float a_velocity;// v_to

// global uniform
uniform vec4 mapExtent;
uniform vec4 flowExtent;
uniform mat4 u_matrix;

// status 
uniform float maxSpeed;
uniform float randomSeed;

// particle control
uniform int particleNum;
uniform float dropRate;
uniform float dropRateBump;
uniform float speedFactor;

uniform sampler2D uvTexture;

out vec4 out_particleInfo;//(x1,y1, x2,y2)
out float out_verlocity;

const float PI = 3.14159265359f;
const float EARTH_RADIUS = 6371000.0f;

/// tool func
vec2 lnglat2Mercator(float lng, float lat) {
    float x = (180.0f + lng) / 360.0f;
    float y = (180.0f - (180.0f / PI) * log(tan(PI / 4.0f + (lat * PI) / 360.0f))) / 360.0f;
    return vec2(x, y);
}
vec2 uvCorrect(vec2 uv, vec2 dim) {
    return clamp(uv, vec2(0.0f, 0.0f), dim - vec2(1.0f, 1.0f));
}
float rand(vec2 co) {
    vec3 rand_constants = vec3(12.9898f, 78.233f, 4375.85453f);
    float t = dot(rand_constants.xy, co);
    return abs(fract(sin(t) * (rand_constants.z + t)));
}

bool validExtent(vec4 rect1, vec4 rect2) {
    // rect：(xmin,ymin,xmax,ymax)
    if(rect1.x >= rect2.z || rect1.z <= rect2.x || rect1.y >= rect2.w || rect1.w <= rect2.y) {
        return false;
    }
    return true;
}

vec4 currentExtent() {
    float lonMin = max(flowExtent.x, mapExtent.x);
    float latMin = max(flowExtent.y, mapExtent.y);
    float lonMax = min(flowExtent.z, mapExtent.z);
    float latMax = min(flowExtent.w, mapExtent.w);
    return vec4(lonMin, latMin, lonMax, latMax);
    // return flowExtent;
}
float drop(vec2 velocity, vec2 seed) {
    float speedRate = length(velocity) / maxSpeed;
    float drop_rate = dropRate + speedRate * dropRateBump;
    return step(1.0f - drop_rate, rand(seed));
}

/// main func
vec2 calculateDisplacedLonLat(float lon, float lat, float offsetX, float offsetY) {
    float latRad = radians(lat);
    float lonRad = radians(lon);

    float newLatRad = latRad + (offsetY / EARTH_RADIUS);
    float newLat = degrees(newLatRad);

    float radiusAtLat = EARTH_RADIUS * cos(latRad);
    float newLonRad = lonRad + (offsetX / radiusAtLat);
    float newLon = degrees(newLonRad);

    return vec2(newLon, newLat);
}

vec4 getRebirthPos(vec2 nowPos, vec4 cExtent) {
    vec2 seed = randomSeed * nowPos;
    vec2 rebirthPos = vec2(rand(seed + randomSeed), rand(seed - randomSeed));
    float x = mix(cExtent.x, cExtent.z, rebirthPos.x);
    float y = mix(cExtent.y, cExtent.w, rebirthPos.y);
    return vec4(x, y, x, y);
}

bool validExtentCheck(vec2 pos, vec4 extent) {
    if(pos.x <= extent.x || pos.x >= extent.z || pos.y <= extent.y || pos.y >= extent.w) {
        return false;
    }
    return true;
}

vec2 getVelocity(vec2 uv) {
    vec2 dimention = vec2(textureSize(uvTexture, 0));
    vec2 uvCorrected = uvCorrect(uv, dimention);
    vec2 uvSpeed = texture(uvTexture, uvCorrected).rg;
    return uvSpeed;
    // float speed = mix(0.0f, maxSpeed, length(uvSpeed));
}

void main() {

    vec4 cExtent = currentExtent();
    vec2 nowPos = a_particleInfo.zw;

    // Bounding box check
    if(!validExtent(flowExtent, mapExtent)) {
        out_particleInfo = getRebirthPos(nowPos, flowExtent);
        out_verlocity = 0.0f;
        return;
    }

    // Particle now postion check
    if(!validExtentCheck(nowPos, cExtent)) {
        out_particleInfo = getRebirthPos(nowPos, cExtent);
        out_verlocity = 0.0f;
        return;
    }

    vec2 mercatorPos = lnglat2Mercator(nowPos.x, nowPos.y);
    vec4 posinCS = u_matrix * vec4(mercatorPos, 0.0f, 1.0f);
    vec2 posInSS = posinCS.xy / posinCS.w;
    vec2 uv = (posInSS + 1.0f) / 2.0f;
    vec2 uvSpeed = getVelocity(uv);
    vec2 newPos = calculateDisplacedLonLat(nowPos.x, nowPos.y, uvSpeed.x * speedFactor, uvSpeed.y * speedFactor);
    newPos = clamp(newPos, cExtent.xy, cExtent.zw);

    vec2 seed = randomSeed * nowPos;
    if(drop(uvSpeed, seed) == 1.0f || all(lessThan(abs(uvSpeed), vec2(0.000001f))) || !validExtentCheck(newPos, cExtent)) {
        out_particleInfo = getRebirthPos(nowPos, cExtent);
        out_verlocity = 0.0f;
    } else {
        out_particleInfo = vec4(nowPos.x, nowPos.y, newPos.x, newPos.y);
        out_verlocity = length(uvSpeed);
    }

    //// test
    // float x = clamp(a_particleInfo.x + 0.0001f, 0.0f, 0.9f);
    // float y = clamp(a_particleInfo.y + 0.0001f, 0.0f, 0.9f);
    // float x = a_particleInfo.x + 0.0001f;
    // float y = a_particleInfo.y + 0.0001f;

    // vec2 new_fromPos = a_particleInfo.zw;
    // vec2 new_toPos = a_particleInfo.zw + vec2(0.001,0.001);
    // out_particleInfo = vec4(new_fromPos, new_toPos);
    // out_verlocity = 0.0f;
}