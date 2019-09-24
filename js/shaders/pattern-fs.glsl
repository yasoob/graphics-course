Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;
  in vec4 worldPosition; 
  uniform float stripeWidth;
  uniform vec2 colorbg;
  out vec4 fragmentColor;

  void main(void) {
    fragmentColor = vec4(fract(worldPosition.x * stripeWidth), colorbg.x, colorbg.y, 1);
  }
`;