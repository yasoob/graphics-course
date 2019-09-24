Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  in vec4 vertexColor;
  uniform struct{
  	vec3 position;
    float time;
  } gameObject;
  
  out vec4 worldPosition;
  out vec4 color;

  void main(void) {
    gl_Position = vertexPosition;
    gl_Position.xyz += gameObject.position;
    worldPosition = gl_Position;
    color = vertexColor;
    color.b = vertexColor.b * sin(gameObject.time);
  }
`;