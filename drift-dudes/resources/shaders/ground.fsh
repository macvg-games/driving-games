precision mediump int;
precision mediump float;

uniform vec4 Colors;
uniform sampler2D Texture0;
uniform sampler2D Texture1;

varying vec2 vTextureCoord;
varying vec2 xzpos;

void main(void)
{

  vec3 Tex    = vec4(texture2D(Texture0, vTextureCoord.st).rgb,1.0).rgb;
  vec3 Shadow = texture2D(Texture1, xzpos).rgb;
  Tex.rgb *= Shadow.r;
  Tex.rgb -= Shadow.g;
  gl_FragColor.rgb = Tex;
}
