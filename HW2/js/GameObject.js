"use strict"; 
/* exported GameObject */
class GameObject extends UniformProvider {
  constructor(mesh) { 
    super("gameObject");

    this.position = new Vec3(0, 0, 0); 
    this.orientation = 0; 
    this.scale = new Vec3(1, 1, 1); 

    this.addComponentsAndGatherUniforms(mesh); // defines this.modelMatrix
    this.modelMatrix.set();
  }

  update(){
    this.modelMatrix.set();
    this.modelMatrix.scale(this.scale);
    this.modelMatrix.rotate(this.orientation);
    this.modelMatrix.translate(this.position);
  }

  contains(mousePos){
    var status = false;
    if (mousePos.x > this.position.x - 0.15 && mousePos.x < this.position.x + 0.15){
      if (mousePos.y > this.position.y - 0.15 && mousePos.y < this.position.y + 0.15) {
        status = true;
      }
    }
    return status;
  }
}