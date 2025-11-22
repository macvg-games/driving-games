varying vec3 WorldNormal;
varying vec3 Normal;
varying vec2 TexCoord;
varying vec3 Position;

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

uniform vec3 uCameraPosition;

float saturate(float v) { return max(0.0, min(1.0, v)); }

void main(void)
{
    vec3 final_color = baseColor * multiply;
    
    vec3 viewNormal = normalize(uCameraPosition - Position);

    float frensel = dot(WorldNormal, normalize(static_view_dir)) * frensel_dot_mult;
    //frensel = saturate(1.0 - frensel);
    frensel = pow(frensel, frensel_power.x);
    
    float frensel2 = dot(WorldNormal, static_view_dir) * frensel_dot_mult;
    frensel2 = saturate(1.0 - frensel2);
    frensel2 = pow(frensel2, frensel_power.y);
    
    if (dot(WorldNormal, viewNormal) > -0.1) {
        gl_FragColor = vec4(baseColor, 1);
    } else {
        gl_FragColor = vec4(hyperColor, 1);
    }

    
    //gl_FragColor = vec4(mix(hyperColor, baseColor * frensel, clamp(sign(dot(WorldNormal, viewNormal)), 0.0, 1.0)), 1);
}