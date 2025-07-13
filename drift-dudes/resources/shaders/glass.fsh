precision mediump int;
precision mediump float;

uniform vec4 Colors;
uniform vec3 CamPos;
uniform sampler2D Texture3;

varying vec2 vTextureCoord;
varying vec3 NormalCol;
varying vec4 Position;

void main(void)
{

 	vec3 Normal = normalize(NormalCol); 	
	gl_FragColor = vec4(0.1,0.2,0.4,0.5);
	vec3 ViewDir 	= normalize( Position.xyz - CamPos  );
	vec3 reflectDir = reflect(Normal,ViewDir);  
	vec2 UVs;
	UVs.x = 0.5-reflectDir.x;
	UVs.y = 0.5-reflectDir.y*0.5;
	gl_FragColor.rgba += vec4(texture2D(Texture3, UVs).r);


}
