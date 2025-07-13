attribute vec3 VertexPos;
attribute vec2 TextureCoor;

uniform mat4 PrMatrix;
uniform mat4 MvMatrix;
uniform mat4 NoMatrix;
uniform mat4 CaMatrix;
uniform vec3 GlyphPos;

varying vec2 vTextureCoord;

void main(void)
{
	
	vec3 Vertex = VertexPos;

	//if (Vertex.y<0.0) 
	Vertex.x -=Vertex.y*GlyphPos.z;
	Vertex.xy += GlyphPos.xy;
	gl_Position = PrMatrix * CaMatrix * MvMatrix * vec4(Vertex, 1.0);
	vTextureCoord = TextureCoor;

}
