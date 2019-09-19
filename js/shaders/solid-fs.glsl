Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;
  in vec4 color;
  in vec4 worldPosition; 

  out vec4 fragmentColor;

  void main(void) {
    fragmentColor = color;
    //fragColor = vec4( fract( worldPosition.x * 10.0), 0, 0, 1);
  }
`;