attribute vec3 VertexPos;

uniform mat4 PrMatrix;
uniform mat4 MvMatrix;
uniform mat4 CaMatrix;

void main(void)
{
	gl_Position = PrMatrix * CaMatrix * MvMatrix * vec4(VertexPos, 1.0);
}
