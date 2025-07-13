attribute vec3 VertexPos;
attribute vec2 TextureCoor;
attribute vec3 VertexNormal;


uniform mat4 PrMatrix;
uniform mat4 MvMatrix;
uniform mat3 NoMatrix;
uniform mat4 CaMatrix;

varying vec2 vTextureCoord;
varying vec3 NormalCol;
varying vec4 Position;

void main(void)
{
	NormalCol =  normalize(NoMatrix * VertexNormal);
	Position =  MvMatrix * vec4(VertexPos, 1.0);
	gl_Position = PrMatrix * CaMatrix * Position;
	vTextureCoord = TextureCoor;
}
