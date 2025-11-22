precision highp float;

uniform sampler2D uDiffuseMap;
uniform sampler2D uMask;
uniform sampler2D uColorTexture;
uniform sampler2D uDissolveMask;
uniform sampler2D uPalette;

uniform vec3 uLightPos;
uniform vec4 uAmbientLight;
uniform float uTime;
uniform float uDissolve;
uniform vec3 uTint;
uniform vec2 uMapBound;
uniform vec2 uPaletteSample;
uniform float uEmissive;

varying vec3 Normal;
varying vec3 WorldNormal;
varying vec2 TexCoord;
varying vec3 Position;
varying vec3 LocalPosition;

vec4 material_preview_matcap(vec4 color, vec4 mask)
{
	vec2 matCapLookup = vec2(0,0);
    
	matCapLookup.x =  0.5 + 0.5 * Normal.x;
	matCapLookup.y =  0.5 + 0.5 * Normal.y;
    
    vec3 emissive = vec3(1.0, 1.0, 1.0) * uEmissive;
    
	return texture2D(uDiffuseMap, matCapLookup) * mask.r + mix(color, color * texture2D(uPalette, uPaletteSample), mask.g) + vec4(emissive, 1.0);
}

vec4 toon_light(vec4 color)
{
    vec3 normal = normalize(WorldNormal);
    float NdotL = dot(uLightPos, normal);
    
    float lightIntensity = smoothstep(0.0, 0.3, NdotL);
    
    return vec4(color.rgb * uTint, 1) * (NdotL + uAmbientLight);
}

void main()
{
    vec3 kek = LocalPosition;
    
    vec3 hx = texture2D(uDissolveMask, kek.zy).rgb;
    vec3 hy = texture2D(uDissolveMask, kek.xz).rgb;
    vec3 hz = texture2D(uDissolveMask, kek.xy).rgb;
    
    float height = ((hx + hy + hz)/3.0).r;
    
    //gl_FragColor = vec4(height, 0, 0, 1.0);
    //return;
    
    if (height <= uDissolve) {
        discard;
    }
    
    if (height < (uDissolve + uDissolve*0.2)) {
        gl_FragColor = vec4(1.0, 0.2, 0.0, 1.0);
        return;
    }
    
    vec4 tex = texture2D(uColorTexture, TexCoord);
    vec4 mask = texture2D(uMask, TexCoord);

	vec4 matCapColor = material_preview_matcap(tex, mask);

    vec4 toonColor = toon_light(tex);
    
    vec4 albedo = mix(toonColor, matCapColor, mask.r);
    
    float hyperX = 1.0-ceil(clamp(sin(Position.x*3.1415/uMapBound.x), 0.0, 1.0));
    float hyperY = 1.0-ceil(clamp(sin(Position.z*3.1415/uMapBound.y), 0.0, 1.0));
    
    //vec4(1.0, 0.2, 0.0, 1.0)
    float hyperT = clamp(hyperX+hyperY, 0.0, 1.0);
    vec4 final = mix(albedo, vec4(vec3(1.0, 1.0, 1.0)-albedo.rgb, 1.0), hyperT);
    
    float blink = mod(-uTime*0.997, 1.0);
    
    gl_FragColor = mix(final, mix(vec4(1, 1, 1, 1), vec4(0, 0, 0, 1), hyperT), blink);
}


