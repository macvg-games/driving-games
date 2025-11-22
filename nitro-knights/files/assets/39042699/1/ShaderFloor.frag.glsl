precision highp float;

uniform float uCellSize;
uniform sampler2D uTexture;
uniform sampler2D uTextureAdd;
uniform vec2 uHighlight;
uniform float uRadius;
uniform float uBrightness;

varying vec3 Normal;
varying vec3 WorldNormal;
varying vec2 TexCoord;
varying vec3 Position;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

float draw_circle(vec2 position, float radius) {
    return smoothstep(0.8*radius, 0.1*radius, length(position));
}

void main()
{
    float tileX = step(0.5, fract(Position.x/(2.0*uCellSize)));
    float tileZ = step(0.5, fract((Position.z+1.0)/(2.0*uCellSize)));
    
    float colorT = random(
        vec2(floor(Position.x/uCellSize), 
             floor((Position.z+1.0)/uCellSize)));
    
    vec4 color1 = mix(vec4(0.85, 0.85, 0.85, 1), vec4(1, 1, 1, 1), colorT);
    vec4 color2 = mix(vec4(0.6, 0.6, 0.6, 1), vec4(0.85, 0.85, 0.85, 1), colorT);
    
    float sampleX = fract(Position.x/uCellSize);
    float sampleY = fract((Position.z+1.0)/uCellSize);
    vec4 tex = texture2D(uTexture, vec2(sampleX, sampleY));
    
    vec4 texAdd = mix(vec4(0, 0, 0, 0), texture2D(uTextureAdd, vec2(sampleX, sampleY)), draw_circle(uHighlight - vec2(Position.x, Position.z), uRadius)) * uBrightness;
    
    gl_FragColor = tex+texAdd;//mix(tex*color1, tex*color2, abs(tileX-tileZ));
}