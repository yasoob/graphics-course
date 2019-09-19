"use strict";
/* exported Scene */
class Scene {
  constructor(gl) {
    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
    // this.triangleGeometry = new TriangleGeometry(gl);
    // this.starGeometry = new StarGeometry(gl);

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.heartGeometry = new HeartGeometry(gl);
    this.donutGeometry = new DonutGeometry(gl);
    
    this.avatarPosition = { x: -0.7, y:- 0.7, z:0.0};
    this.avatarMoveVector = {x:0, y:0, z:0};
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  moveAvatar(directionVector){
    this.avatarMoveVector = directionVector;
  }

  update(gl, keysPressed) {
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    this.timeAtLastFrame = timeAtThisFrame;

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
      // console.log("Let's change some position now, shall we?");
    }

    gl.uniform3f(objectPositionHandle, -0.7, 0.7, 0.0);
    this.heartGeometry.draw();
    
    gl.uniform3f(objectPositionHandle, -0.7, 0.0, 0.0);
    this.donutGeometry.draw();

    this.avatarPosition.x += this.avatarMoveVector.x * dt;
    this.avatarPosition.y += this.avatarMoveVector.y * dt;
    this.avatarPosition.z += this.avatarMoveVector.z * dt;

    var screenCutoff = 1.2
    if (this.avatarPosition.x < -screenCutoff){
      this.avatarPosition.x = screenCutoff;
    } else if (this.avatarPosition.x > screenCutoff) {
      this.avatarPosition.x = -screenCutoff;
    }

    if (this.avatarPosition.y < -screenCutoff) {
      this.avatarPosition.y = screenCutoff;
    } else if (this.avatarPosition.y > screenCutoff) {
      this.avatarPosition.y = -screenCutoff;
    }

    gl.uniform3f(objectPositionHandle, this.avatarPosition.x, this.avatarPosition.y , this.avatarPosition.z);
    this.donutGeometry.draw();
  }
}
