precision mediump int;
precision mediump float;

uniform sampler2D Texture0;
uniform sampler2D Texture1;
uniform vec3 LightDir;
varying float WateRPos;
varying vec2 xzpos;
varying vec2 ScreenSize;
varying float Alpha;

void main(void)
{

  vec3 Tex = texture2D(Texture0, gl_FragCoord.xy/ScreenSize).rgb;
  float Seam = texture2D(Texture1, xzpos.st).b*5.0;

gl_FragColor.rgb = Tex+vec3(Seam);

gl_FragColor.a  = Alpha;

if (WateRPos>-10.0) {gl_FragColor.rgb += LightDir*4.0; gl_FragColor.a = 0.9;}
else
if (WateRPos>-15.0) {gl_FragColor.rgb += LightDir;gl_FragColor.a = 0.7;}
else {
 gl_FragColor.rgb *=Alpha;
}

}
 