precision mediump int;
precision mediump float;

uniform vec4 Colors;
uniform sampler2D Texture0;

varying vec2 vTextureCoord;
varying float zz;

void main(void)
{

  vec4 Tex = texture2D(Texture0, vec2(vTextureCoord.x+Colors.r,vTextureCoord.y) );
  Tex.a-=zz;
  Tex.a*=Colors.a;
  if (Tex.a<0.1) discard;

Tex.rg-=zz*0.3;
gl_FragColor = Tex;
}
