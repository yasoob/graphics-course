Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  in vec4 vertexColor;
  uniform struct{
  	vec3 position;
  } gameObject;

  out vec4 color;

  void main(void) {
    gl_Position = vertexPosition;
    gl_Position.xyz += gameObject.position;
    color = vertexColor;
  }
`;