precision mediump int;
precision mediump float;

uniform vec4 Colors;
uniform sampler2D Texture0;

varying vec2 vTextureCoord;

void main(void)
{

  vec4 Tex = texture2D(Texture0, vTextureCoord.st)*Colors;
  if (Tex.a<0.01) discard;

gl_FragColor = Tex;
}
