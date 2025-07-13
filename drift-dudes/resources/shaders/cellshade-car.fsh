precision mediump int;
precision mediump float;

uniform vec3 CamPos;
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

	
	float Filter = texture2D(Texture2, vTextureCoord.st).r;
	//gl_FragColor.rgb = vec3(Filter); return;
	
	if (Filter>0.9) // Lights
	{
		gl_FragColor.rgb = Tex.rgb*1.2;
		return;
	}
	
	if (Filter>0.45 && Filter<0.51 ) // no shade
	{
		gl_FragColor.rgb = Tex.rgb;
		return;
	}

	


	vec3 Normal = normalize(NormalCol); 
	float NdotL = dot(Normal, normalize(Colors.xyz))*0.5+0.5;
	
	gl_FragColor = Tex;	
	//gl_FragColor.rb -= Normal.rb*0.1;
	gl_FragColor.rgb *= texture2D(Texture1, vec2(NdotL,Normal.y*0.5+0.5)).rgb*2.0;




	//Filter=0.52;
	if (Filter<0.1 ) // body
	{

//gl_FragColor.rgb *=0.1;
	vec3 ViewDir 	= normalize( CamPos - Position.xyz );
	vec3 reflectDir = reflect(ViewDir, Normal);  
	gl_FragColor.rgb += vec3(texture2D(Texture3, reflectDir.zy*0.5+0.5).g-0.2);


	}
	else
	if (Filter>0.51 ) // Glass
	{	
		vec3 LigthPos = normalize(Position.xyz-vec3(-200.0,Position.y,0.0));
		float NdotL = dot(Normal, LigthPos)*0.5+0.5;
		gl_FragColor.rgb += vec3(texture2D(Texture3, vec2(NdotL,0.5+Normal.y*0.25)).r);
	}
	





}
