"use strict";
/* exported App */
class App{
  constructor(canvas, overlay) {
    this.canvas = canvas;
    this.overlay = overlay;
    this.mouseDown = false;

    // obtain WebGL context
    this.gl = canvas.getContext("webgl2", { alpha: false });
    if (this.gl === null) {
      throw new Error("Browser does not support WebGL2");
    }

    this.keysPressed = {};

    // serves as a registry for textures or models being loaded
    this.gl.pendingResources = {};
    // create a simple scene
    this.scene = new Scene(this.gl);

    this.resize();
  }

  // match WebGL rendering resolution and viewport to the canvas size
  resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.scene.resize(this.gl, this.canvas);
   
  }

  getRelativeMousePosition(event) {
    var rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  canvasToWebGL(pos){
    const x = pos.x / canvas.width * 2 - 1;
    const y = pos.y / canvas.height * -2 + 1;
    return { x: x, y: y };
  }

  movementToWebGL(offset){
    return { x: offset.x * 2/this.canvas.width, y: offset.y * 2/-this.canvas.height };
  }

  registerEventHandlers() {
    document.onkeydown = (event) => {
      //jshint unused:false
      this.keysPressed[keyNames[event.keyCode]] = true;
      event.preventDefault();
    };
    document.onkeyup = (event) => {
      //jshint unused:false
      this.keysPressed[keyNames[event.keyCode]] = false;    
      event.preventDefault();
    };
    this.canvas.onmousedown = (event) => {
      //jshint unused:false
      this.mouseDown = true;
      var pos = this.getRelativeMousePosition(event);
      var mousePos = this.canvasToWebGL(pos);

      this.scene.selectObjects(mousePos);
    };
    this.canvas.onmousemove = (event) => {
      if (this.mouseDown){
        var posMove = this.movementToWebGL({x: event.movementX, y: event.movementY});
        this.scene.mouseDraged(posMove);
      }
      event.stopPropagation();
    };
    this.canvas.onmouseout = (event) => {
    };
    this.canvas.onmouseup = (event) => {
      //jshint unused:false
      this.mouseDown = false;
    };
    window.addEventListener('resize', () => this.resize() );
    window.requestAnimationFrame( () => this.update() );
  };

  // animation frame update
  update() {
    const pendingResourceNames = Object.keys(this.gl.pendingResources);
    if (pendingResourceNames.length === 0) {
      // animate and draw scene
      this.scene.update(this.gl, this.keysPressed);
      // this.overlay.innerHTML = "Ready.";
    } else {
      this.overlay.innerHTML = `<font color="red">Loading: ${pendingResourceNames}</font>`;
    }

    // refresh
    window.requestAnimationFrame( () => this.update() );
  }
}

// entry point from HTML
window.addEventListener('load', () => {
  const canvas = document.getElementById("canvas");
  const overlay = document.getElementById("overlay");
  // overlay.innerHTML = "WebGL";

  const app = new App(canvas, overlay);
  app.registerEventHandlers();
});