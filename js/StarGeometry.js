"use strict";
/* exported TriangleGeometry */
class StarGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();

    var starArray = [0,0,0.5];
    var drawInstructions = [];
    var radius = 0.2;
    var totalCorners = 5;
    var offset = Math.PI/totalCorners;
    for (var i=0; i<totalCorners; i++) {
      var internal_x = Math.sin(Math.PI * 2 * (i/totalCorners)) * (radius-0.12);
      var internal_y = Math.cos(Math.PI * 2 * (i/totalCorners)) * (radius-0.12);

      var external_x = Math.sin((Math.PI * 2 * (i/totalCorners)) + offset) * radius;
      var external_y = Math.cos((Math.PI * 2 * (i/totalCorners)) + offset) * radius;

      starArray.push(internal_x, internal_y, 0.5);
      starArray.push(external_x, external_y, 0.5);
    }
    starArray.push(starArray[3]);
    starArray.push(starArray[4]);
    starArray.push(starArray[5]);

    for (var i=0; i<totalCorners*2; i++){
      drawInstructions.push(0, i+1, i+2);
    }

    console.log(starArray);
    console.log(drawInstructions);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      // new Float32Array([
      //   -0.5, -0.5,  0.5,
      //   -0.5,  0.5,  0.5,
      //    0,   -0.5,  0.5,
      //    0.0,  0.5,  0.5,
      // ]),
      new Float32Array(starArray),
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
      new Float32Array([
         0.5,  0.3, 0.5,
         0.5,  1, 0.5,
         0.5,  0.0, 0.5,
         0.5,  0.0, 0.5,
         0.5,  0.3, 0.5,
         0.5,  0.5, 0.5,
         0.5,  0.0, 0.5,
         0.5,  0.0, 0.5,
         0.5,  0.3, 0.5,
         0.5,  0.5, 0.5,
         0.5,  0.0, 0.5,
         0.5,  0.0, 0.5,
         0.5,  0.0, 0.5,
      ]),
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

    gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);
  }
}
