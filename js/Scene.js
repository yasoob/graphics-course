"use strict";
/* exported Scene */
class Scene {
  constructor(gl) {
    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.wavingShader = new Shader(gl, gl.VERTEX_SHADER, "waving-vs.glsl");

    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.patternShader = new Shader(gl, gl.FRAGMENT_SHADER, "pattern-fs.glsl");

    this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
    this.patternProgram = new Program(gl, this.vsIdle, this.patternShader);
    this.wavingProgram = new Program(gl, this.wavingShader, this.fsSolid);

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.starGeometry = new StarGeometry(gl);
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
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
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

    const stripeObjectPositionHandle = gl.getUniformLocation(this.patternProgram.glProgram,
      "gameObject.position");
    if (stripeObjectPositionHandle === null) {
      console.log("Couldn't find uniform: gameObject.position");
    } else {
      // console.log("Let's change some position now, shall we?");
    }

    const objectTimeHandle = gl.getUniformLocation(this.solidProgram.glProgram,
      "gameObject.time");
    if (objectTimeHandle === null) {
      console.log("Couldn't find uniform: gameObject.time");
    } else {
      // console.log("Let's change some position now, shall we?");
    }

    const objectStripeWidthHandle = gl.getUniformLocation(this.patternProgram.glProgram,
      "stripeWidth");
    if (objectStripeWidthHandle === null) {
      console.log("Couldn't find uniform: stripeWidth");
    } else {
      // console.log("Let's change some position now, shall we?");
    }

    const objectStripeColorHandle = gl.getUniformLocation(this.patternProgram.glProgram,
      "colorbg");
    if (objectStripeColorHandle === null) {
      console.log("Couldn't find uniform: colorbg");
    } else {
      // console.log("Let's change some position now, shall we?");
    }

    const wavingObjectPositionHandle = gl.getUniformLocation(this.wavingProgram.glProgram,
      "gameObject.position");
    if (wavingObjectPositionHandle === null) {
      console.log("Couldn't find uniform: gameObject.position");
    } else {
      // console.log("Let's change some position now, shall we?");
    }

    const wavingObjectTimeHandle = gl.getUniformLocation(this.wavingProgram.glProgram,
      "gameObject.time");
    if (wavingObjectTimeHandle === null) {
      console.log("Couldn't find uniform: gameObject.position");
    } else {
      // console.log("Let's change some position now, shall we?");
    }

    
    // -----------------
    // Making the heart 
    // -----------------
    gl.uniform1f(objectTimeHandle, 1);
    // console.log("timeAtThisFrame: " + Math.sin(timeAtThisFrame));
    gl.uniform3f(objectPositionHandle, -0.7, 0.7, 0.0);
    this.heartGeometry.draw();
    
    // -----------------------
    // Making the first donut 
    // -----------------------
    gl.uniform1f(objectTimeHandle, t);
    gl.uniform3f(objectPositionHandle, -0.7, 0.0, 0.0);
    this.donutGeometry.draw();

    // -----------------------------
    // Making the 1st pattern object 
    // -----------------------------
    gl.useProgram(this.patternProgram.glProgram);
    gl.uniform3f(stripeObjectPositionHandle, 0.0, 0.0, 0.0);
    gl.uniform1f(objectStripeWidthHandle, 30.0);
    gl.uniform2f(objectStripeColorHandle, 0.5, 0.2);
    this.donutGeometry.draw();

    // -----------------------------
    // Making the 2nd pattern object 
    // -----------------------------
    gl.uniform1f(objectStripeWidthHandle, 10.0);
    gl.uniform3f(stripeObjectPositionHandle, 0.0, 0.7, 0.0);
    gl.uniform2f(objectStripeColorHandle, 0.5, 1.0);
    this.heartGeometry.draw();

    // ---------------------------------
    // Making the waving animated shape
    // ---------------------------------
    gl.useProgram(this.wavingProgram.glProgram);
    gl.uniform3f(wavingObjectPositionHandle, 0.7, 0.7, 0.0);    
    gl.uniform1f(wavingObjectTimeHandle, t);
    this.starGeometry.draw();

    // ----------------------------------------------
    // Making the second donut with keyboard controls
    // ----------------------------------------------
    gl.useProgram(this.solidProgram.glProgram);
    gl.uniform1f(objectTimeHandle, 1);
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
