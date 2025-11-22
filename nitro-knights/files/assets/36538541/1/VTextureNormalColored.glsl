attribute vec4 vVertex;
attribute vec3 vNormal;
attribute vec2 vTexCoord;

uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;
uniform mat3 matrix_normal;

uniform mat4   matrix_view;

varying vec4 Color;
varying vec3 WorldNormal;
varying vec3 Normal;
varying vec3 Position;
varying vec3 LocalPosition;
varying vec2 TexCoord;
//varying vec3 ViewNormal;

void main(void)
{
    TexCoord = vTexCoord;
    
    WorldNormal = normalize(matrix_normal * vNormal);
    mat3 viewModel = mat3(matrix_view * matrix_model);
    Normal = normalize(viewModel * vNormal);

    Position = vec3(matrix_model * vVertex);
    LocalPosition = vVertex.xyz;

  //  mat4 modelView = matrix_view * matrix_model;
    //mat4 modelViewProj = matrix_viewProjection * matrix_model;

    // Get surface normal in eye coordinates
    //vec3 eyeNormal = normalize(matrix_normal * aNormal);

    // Get vertex position in eye coordinates
    //vec4 vertexPos = modelView * aPosition;
    //vec3 vertexEyePos = vertexPos.xyz / vertexPos.w;

    // Get vector to light source
    //vec3 lightDir = normalize(uLightPos - vertexEyePos);

    // Dot product gives us diffuse intensity. The diffuse intensity will be
    // used as the 1D color texture coordinate to look for the color of the
    // resulting fragment (see fragment shader).
    //vertOutTexCoord = max(0.0, dot(eyeNormal, lightDir));
    
    gl_Position = matrix_viewProjection * matrix_model * vVertex;
}