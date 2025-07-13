precision mediump int;
precision mediump float;

uniform vec4 Colors;
uniform sampler2D Texture0;
uniform sampler2D Texture1;
uniform sampler2D Texture2;
uniform sampler2D Texture3;

varying vec2 vTextureCoord;
varying vec3 NormalCol;
varying vec4 Position;

void main(void)
{

  	vec4 Tex = texture2D(Texture0, vTextureCoord.st);
  
  	if (Tex.a<1.0) discard;

	

	


	vec3 Normal = normalize(NormalCol); 
	float NdotL = dot(Normal, normalize(Colors.xyz))*0.5+0.5;
	
	gl_FragColor.rgb = Tex.rgb*0.05 + vec3(0.2,0.2,0.25);	
	gl_FragColor.rg += Normal.g*0.02;

	gl_FragColor.rgb *= texture2D(Texture1, vec2(NdotL,Normal.y*0.5+0.5)).b*2.0;

/*
		vec3 LigthPos = normalize(Position.xyz-vec3(200.0,Position.y+50.0,-200.0));
		float NdotL = dot(NormalCol, LigthPos)*0.5;
		gl_FragColor.rgb += texture2D(Texture3, vec2(NdotL,0.5-Normal.y*0.5)).g*0.5-0.1;
	*/






}
