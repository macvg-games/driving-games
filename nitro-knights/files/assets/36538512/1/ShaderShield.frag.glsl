varying vec3 WorldNormal;
varying vec2 TexCoord;
varying vec3 Position;
varying vec3 LocalPosition;

uniform vec3 baseColor;
uniform vec3 hyperColor;
uniform float multiply;

uniform vec2 uMapBound;

uniform float alphaMultiplier;

uniform float frensel_dot_mult;
uniform vec2 frensel_power;
uniform vec3 static_view_dir;

uniform float uTime;
uniform float appearTime;

uniform sampler2D uHeightMap;

float saturate(float v) { return max(0.0, min(1.0, v)); }

void main(void)
{
    vec3 kek = LocalPosition;
    
    vec3 hx = texture2D(uHeightMap, kek.zy).rgb;
    vec3 hy = texture2D(uHeightMap, kek.xz).rgb;
    vec3 hz = texture2D(uHeightMap, kek.xy).rgb;
    
    float height = ((hx + hy + hz)/3.0).r;
    
    //gl_FragColor = vec4(height, 0, 0, 1);
    //return;
    
    if (height < appearTime) {
        discard;
    }
    
    if (height < (appearTime + appearTime*0.1)) {
        gl_FragColor = vec4(1.0, 0.2, 0.0, 1.0);
        return;
    }
    
    
    
    vec3 final_color;
    if (Position.x < 0.0 || Position.z < 0.0 || Position.x > uMapBound.x || Position.z > uMapBound.y) {
        final_color = hyperColor * multiply;
    } else {
        final_color = baseColor * multiply;
    }
    
    float frensel = dot(WorldNormal, static_view_dir) * frensel_dot_mult;
    frensel = saturate(1.0 - frensel);
    frensel = pow(frensel, mix(frensel_power.x, frensel_power.y, sin(uTime)));
    
    gl_FragColor = vec4(final_color, frensel - alphaMultiplier);
}