attribute vec3 VertexPos;
attribute vec2 TextureCoor;

uniform mat4 PrMatrix;
uniform mat4 MvMatrix;
uniform mat4 NoMatrix;
uniform mat4 CaMatrix;
uniform vec4 ParticlesXYZS[30];
uniform vec2 ParticlesRT[30];

varying vec2 vTextureCoord;


mat4 rotationZaxis( float angle)
{
    float s = sin(angle); float c = cos(angle); float oc = 1.0 - c;
    return mat4(c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, oc + c, 0.0, 0.0, 0.0, 0.0, 1.0);
}

void main(void)
{



	int ID = int(VertexPos.z);

//ParticlesPos *=  Look;
	mat4 ModelView = CaMatrix;

	vec3 cameraRight = vec3( ModelView[0].x, ModelView[1].x, ModelView[2].x );
	vec3 cameraUp = vec3( ModelView[0].y, ModelView[1].y, ModelView[2].y );

	vec4 ParticlesPos = vec4( VertexPos.x*ParticlesXYZS[ID].w, VertexPos.y*ParticlesXYZS[ID].w, 0.0 ,1.0);
	ParticlesPos = rotationZaxis(ParticlesRT[ID].x) * ParticlesPos;

	vec4 ParticlesPosB = vec4((cameraRight * ParticlesPos.x) + (cameraUp * ParticlesPos.y),1.0);

	ParticlesPosB.xyz += ParticlesXYZS[ID].xyz;


	gl_Position = PrMatrix * CaMatrix * ParticlesPosB;
	vTextureCoord = vec2 (TextureCoor.s+ParticlesRT[ID].y, TextureCoor.t);

}
