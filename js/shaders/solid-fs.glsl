Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;
  in vec4 color;

  out vec4 fragmentColor;

  void main(void) {
    fragmentColor = color;
  }
`;