attribute vec3 VertexPos;
attribute vec2 TextureCoor;

uniform mat4 PrMatrix;
uniform mat4 MvMatrix;
uniform mat4 NoMatrix;
uniform mat4 CaMatrix;

varying vec2 vTextureCoord;

void main(void)
{
	gl_Position = PrMatrix * CaMatrix * MvMatrix * vec4(VertexPos, 1.0);
	vTextureCoord = TextureCoor;
}
