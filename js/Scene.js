"use strict";
/* exported Scene */
class Scene {
  constructor(gl) {
    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
    // this.triangleGeometry = new TriangleGeometry(gl);
    // this.starGeometry = new StarGeometry(gl);
    this.heartGeometry = new HeartGeometry(gl);
    this.donutGeometry = new DonutGeometry(gl);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false

    // clear the screen
    gl.clearColor(0.0, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(this.solidProgram.glProgram);
    // this.starGeometry.draw();

    const objectPositionHandle = gl.getUniformLocation(this.solidProgram.glProgram,
      "gameObject.position");
    if (objectPositionHandle === null){
      console.log("Couldn't find uniform: gameObject.position");
    } else{
      console.log("Let's change some position now, shall we?");
    }
    
    gl.uniform3f(objectPositionHandle, -0.7, 0.7, 0.0);
    this.heartGeometry.draw();
    
    gl.uniform3f(objectPositionHandle, -0.7, 0.0, 0.0);
    this.donutGeometry.draw();

    gl.uniform3f(objectPositionHandle, -0.7, -0.7 , 0.0);
    this.donutGeometry.draw();
  }
}
