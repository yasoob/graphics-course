"use strict";
/* exported TriangleGeometry */
class HeartGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();

    var heartArray = [0,0,0.5];
    var drawInstructions = [];
    var totalCorners = 100;
    var angleOffset = 2 * Math.PI / totalCorners;

    var xPos = (t) => { return 16 * ((3 / 4) * Math.sin(t) - (1 / 4) * Math.sin(3 * t))};
    var yPos = (t) => { return 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)};
    
    for (var i=0; i< totalCorners; i++) {
      var localOffset = angleOffset * i;
      var x = xPos(localOffset)/totalCorners;
      var y = yPos(localOffset)/totalCorners;
      heartArray.push(x, y, 0.5);
    }
    
    // heartArray.push(heartArray[3]);
    // heartArray.push(heartArray[4]);
    // heartArray.push(heartArray[5]);

    for (var i=0; i<totalCorners-1; i++){
      drawInstructions.push(0, i+1, i+2);
    }
    drawInstructions.push(0, totalCorners, 1);

    var colorBuffer = [];
    for (var i=0; i<totalCorners+1; i++){
      colorBuffer.push(0.8, 0.1 , 0.2);
    }
    console.log("Array", heartArray);
    console.log("Draw instructions: ", drawInstructions);
    console.log("Color Buffer", colorBuffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      // new Float32Array([
      //   -0.5, -0.5,  0.5,
      //   -0.5,  0.5,  0.5,
      //    0,   -0.5,  0.5,
      //    0.0,  0.5,  0.5,
      // ]),
      new Float32Array(heartArray),
      gl.STATIC_DRAW);

    // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      // new Uint16Array([
      //   0, 1, 2,
      //   2, 3, 1,
      // ]),
      new Uint16Array(drawInstructions),
      gl.STATIC_DRAW);

    // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
    this.inputLayout = gl.createVertexArray();
    gl.bindVertexArray(this.inputLayout);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    // gl.bindVertexArray(null);

    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(colorBuffer),
      gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    gl.bindVertexArray(null);
  }

  draw() {
    const gl = this.gl;

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  

    gl.drawElements(gl.TRIANGLES, 100*3, gl.UNSIGNED_SHORT, 0);
  }
}
