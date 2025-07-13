attribute vec3 VertexPos;
attribute vec2 TextureCoor;

uniform mat4 PrMatrix;
uniform mat4 MvMatrix;
uniform mat4 NoMatrix;
uniform mat4 CaMatrix;
uniform vec4 Colors;

varying float WateRPos;
varying vec2 xzpos;
varying vec2 ScreenSize;
varying float Alpha;

void main(void)
{

	
	xzpos = VertexPos.xz/8000.0+0.5;
	
	Alpha = 6.6-abs(VertexPos.x)/1000.0-abs(VertexPos.z)/1000.0;
	if (Alpha>0.4) Alpha = 0.4;

	WateRPos = VertexPos.y;
	WateRPos +=sin(Colors.r*100.0+VertexPos.x*0.007+VertexPos.z*0.01)*8.0;
	
	ScreenSize = Colors.gb;
	
	gl_Position = PrMatrix * CaMatrix * MvMatrix * vec4(
	VertexPos.x, 
	sin(Colors.r*30.0+VertexPos.x*0.002+VertexPos.z*0.006)*5.0, 
	VertexPos.z, 1.0);
	
	ScreenSize.x +=sin(Colors.r*260.0+VertexPos.x*0.7+VertexPos.z*0.9)*20.0;
	ScreenSize.y +=sin(Colors.r*170.0+VertexPos.x*0.81+VertexPos.z*0.5)*20.0;

}
