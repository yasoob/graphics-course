"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");

    this.selectedObjIndex = [0];
    this.selectedMatStripeWidth = 0;

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.triangleGeometry = new TriangleGeometry(gl);
    this.quadGeometry = new QuadGeometry(gl);
    this.donutGeometry = new DonutGeometry(gl);

    // TODO: create more geometries

    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.fsStriped = new Shader(gl, gl.FRAGMENT_SHADER, "striped-fs.glsl");    
    // TODO: create more shaders    

    this.programs = [];
    this.programs.push( this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid));
    this.programs.push( this.stripedProgram = new Program(gl, this.vsIdle, this.fsStriped));    
    // TODO: create more programs

    this.camera = new OrthoCamera(...this.programs);

    // PRACTICAL TODO: create materials, set properties reflecting uniforms
    // PRACTICAL TODO: create meshes combining materials and geometries
    this.stripedMaterial = new Material(gl, this.stripedProgram);
    this.stripedMaterial.solidColor.set(0.1, 0.4, 0.5);
    // this.stripedMaterial.solidColor.set(0.1, 0.4, 0.5);
    this.stripedMaterial.stripeWidth = 0.5;

    this.solidMaterial = new Material(gl, this.solidProgram);
    this.solidMaterial.solidColor.set(1, 1, 1);

    this.selectedMaterial = new Material(gl, this.stripedProgram);
    this.selectedMaterial.solidColor.set(0,0,0);
    this.selectedMaterial.stripeWidth = this.selectedMatStripeWidth;

    // PRACTICAL TODO: create game objects
    this.gameObjects = [];
    
    var triangleMesh = new Mesh(this.stripedMaterial, this.triangleGeometry);
    var triangleObj = new GameObject(triangleMesh);
    triangleObj.scale = new Vec2(0.5,0.5);

    var donutMesh = new Mesh(this.solidMaterial, this.donutGeometry);
    var donutObj = new GameObject(donutMesh);
    donutObj.position = new Vec3(-0.5,0.5,0);

    this.gameObjects.push(triangleObj);
    this.gameObjects.push(donutObj);

    this.addComponentsAndGatherUniforms(...this.programs);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(
      canvas.clientWidth/canvas.clientHeight
    );
  }

  mouseDraged(pos){
    var selectedObj = this.gameObjects[this.selectedObjIndex[0]];
    pos = new Vec2(pos.x, pos.y);
    pos.xy00mul(this.camera.viewProjMatrix.clone().invert());
    var position = new Vec3(selectedObj.position.x + pos.x, selectedObj.position.y + pos.y, 0);
    selectedObj.position = position; //(pos.x, pos.y);
  }

  selectObjects(mousePos){
    var anythingSelected = false;
    mousePos = new Vec2(mousePos.x, mousePos.y);
    mousePos.xy01mul(this.camera.viewProjMatrix.clone().invert());
    for (var i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].contains(mousePos)) {
        var selectedObj = i;
        this.selectedObjIndex = [selectedObj];
        anythingSelected = true;
      }
    }
    if (!anythingSelected) {
      this.selectedObjIndex = [];
    }
  }


  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
    this.timeAtLastFrame = timeAtThisFrame;

    if(keysPressed.LEFT){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object
    }
    if(keysPressed.RIGHT){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object
    }    
    if(keysPressed.UP){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object        
    }        
    if(keysPressed.DOWN){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object
    }       
    
    if (keysPressed.TAB){
      keysPressed['TAB'] = false;
      var selectedObj = (this.selectedObjIndex[0] + 1) % this.gameObjects.length;
      this.selectedObjIndex = [selectedObj];
      console.log(this.selectedObjIndex, selectedObj);
    }

    for (var i = 0; i < this.gameObjects.length; i++) {
      if (this.selectedObjIndex.includes(i)) {

        // Rotate an object if A or D pressed
        if (keysPressed.D){
          this.gameObjects[i].orientation -= 0.01;
        } else if (keysPressed.A){
          this.gameObjects[i].orientation += 0.01;
        }

        // Remove an object when backspace/Delete pressed
        if (keysPressed.BACK_SPACE){
          this.gameObjects.splice(i,1);
        }
        
        // Move the object if arrow keys are pressed
        if (keysPressed.LEFT) {
          this.gameObjects[i].position.x -= 0.01;
          console.log(this.gameObjects[i].position);
        } else if (keysPressed.RIGHT) {
          this.gameObjects[i].position.x += 0.01;
          console.log(this.gameObjects[i].position);
        } else if (keysPressed.UP){
          this.gameObjects[i].position.y += 0.01;
          console.log(this.gameObjects[i].position);
        } else if (keysPressed.DOWN) {
          this.gameObjects[i].position.y -= 0.01;
          console.log(this.gameObjects[i].position);
        }

        // Camera zoom
        if (keysPressed.X){
          this.camera.windowSize.x *= 1.01;
          this.camera.windowSize.y *= 1.01;
        } else if (keysPressed.Z) {
          this.camera.windowSize.x *= 0.99;
          this.camera.windowSize.y *= 0.99;
        }

        // I,J,K,L camera view move
        if (keysPressed.J){
          this.camera.position.x += 0.01;
        } else if (keysPressed.L){
          this.camera.position.x -= 0.01;
        } else if (keysPressed.I){
          this.camera.position.y -= 0.01;
        } else if (keysPressed.K) {
          this.camera.position.y += 0.01;
        }

        // N, new Object at origin
        if (keysPressed.N){
          keysPressed['N'] = false;

          var donutMesh = new Mesh(this.solidMaterial, this.donutGeometry);
          var donutObj = new GameObject(donutMesh);
          donutObj.position = new Vec3(0.0, 0.0, 0.0);
          donutObj.position.mul(this.camera.viewProjMatrix.clone().invert());
          this.gameObjects.push(donutObj);
        }
      }  
    }
    

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    for (var i=0; i<this.gameObjects.length; i++){
      // this.gameObjects[i].position.x += 0.001;
      // this.gameObjects[i].orientation += 0.01;
      this.gameObjects[i].update();
      if (this.selectedObjIndex.includes(i)){
        this.gameObjects[i].using(this.selectedMaterial).draw(this, this.camera);
        // console.log(mousePos);
      } else {
        this.gameObjects[i].draw(this, this.camera);
      }
      // console.log(this.gameObjects[i]);
    }
    // PRACTICAL TODO: update all game objects
    // PRACTICAL TODO: draw all game objects
    this.selectedMatStripeWidth = 0.2 * (Math.sin(t*3) + 2);
    this.selectedMaterial.stripeWidth = this.selectedMatStripeWidth;
    this.camera.update();
  }
}
