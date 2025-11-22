precision highp float;

uniform vec3 uColor;
uniform vec3 uHyperColor;
uniform vec2 uMapBound;

varying vec3 Normal;
varying vec3 WorldNormal;
varying vec2 TexCoord;
varying vec3 Position;

void main()
{
    //vec4 betweenDissolveColor = vec4(1.0, 1.0, 1.0, 1.0);
    
    float hyperX = 1.0-ceil(clamp(sin(Position.x*3.1415/uMapBound.x), 0.0, 1.0));
    float hyperY = 1.0-ceil(clamp(sin(Position.z*3.1415/uMapBound.y), 0.0, 1.0));
    
    //vec4(1.0, 0.2, 0.0, 1.0)
    float hyperT = clamp(hyperX+hyperY, 0.0, 1.0);
    
    if (hyperT < 1.0) {
        //gl_FragColor = vec4(uColor, 1.0);;
        //return;
        discard;
    }
    
    gl_FragColor = vec4(uHyperColor, 1.0);
}


