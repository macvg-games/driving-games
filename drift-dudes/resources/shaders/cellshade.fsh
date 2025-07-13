precision mediump int;
precision mediump float;

uniform vec4 Colors;
uniform sampler2D Texture0;
uniform sampler2D Texture1;

varying vec2 vTextureCoord;
varying vec3 NormalCol;

void main(void)
{

  vec4 Tex = texture2D(Texture0, vTextureCoord.st);
  if (Tex.a<1.0) discard;

	vec3 Normal = normalize(NormalCol); 
	gl_FragColor = Tex;
	
	float NdotL = dot(Normal, normalize(Colors.xyz))*0.5+0.5;
	gl_FragColor.rb -= Normal.rb*0.05;

	gl_FragColor.rgb *= texture2D(Texture1, vec2(NdotL,Normal.y*0.5+0.5)).rgb*2.0;
}
