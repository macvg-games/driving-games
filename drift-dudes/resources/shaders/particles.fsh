precision mediump int;
precision mediump float;

uniform sampler2D Texture0;

varying vec2 vTextureCoord;

void main(void)
{
  vec4 Tex = texture2D(Texture0, vec2(vTextureCoord.s, vTextureCoord.t));
  if (Tex.a<0.9) discard;
gl_FragColor = Tex;
}
