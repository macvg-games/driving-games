attribute vec3 VertexPos;
attribute vec2 TextureCoor;

uniform mat4 PrMatrix;
uniform mat4 MvMatrix;
uniform mat4 NoMatrix;
uniform mat4 CaMatrix;
uniform vec4 ParticlesXYZS[30];
uniform vec4 Colors;

varying vec2 vTextureCoord;


void main(void)
{
	int ID = int(-VertexPos.x);
	vec4 ParticlesPosB = vec4(VertexPos.xyz,1.0);
	ParticlesPosB.x += Colors.x*ParticlesPosB.y;
	ParticlesPosB.z += Colors.z*ParticlesPosB.y;
	
	ParticlesPosB.xyz += ParticlesXYZS[ID].xyz;


	gl_Position = PrMatrix * CaMatrix * MvMatrix*ParticlesPosB;
	vTextureCoord = TextureCoor.st;
	vTextureCoord.s *= 0.6;
	vTextureCoord.s -= Colors.a;

}
