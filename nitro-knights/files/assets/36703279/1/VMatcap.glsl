precision highp float;

attribute vec3 vVertex;
attribute vec3 vNormal;
attribute vec2 vTexCoord;

varying vec3 Position;
varying vec3 Normal;
varying vec3 WorldNormal;
varying vec2 TexCoord;
varying vec3 LocalPosition;

uniform mat4 matrix_view;
uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;
uniform mat3 matrix_normal;

void main()
{
    TexCoord = vTexCoord;
    //TilePosition = vec2(floor())
    vec4 pt = vec4(vVertex,1.0);

    mat3 viewModel = mat3(matrix_view * matrix_model);
    Normal = normalize(viewModel * vNormal);
    WorldNormal = normalize(matrix_normal * vNormal);
    Position = vec3(matrix_model * pt);
    LocalPosition = vVertex;
    gl_Position = matrix_viewProjection * matrix_model  * pt;
}
