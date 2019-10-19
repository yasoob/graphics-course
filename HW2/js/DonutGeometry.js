"use strict";
class DonutGeometry {
    constructor(gl) {
        this.gl = gl;

        // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
        this.vertexBuffer = gl.createBuffer();

        var donutArray = [];
        var internalCircleArray = [];
        var externalCircleArray = [];

        var drawInstructions = [];
        this.totalCorners = 100;
        var internalRadius = 0.1;
        var externalRadius = 0.2;
        var innerCircleAngleOffset = 2 * Math.PI / this.totalCorners;
        var outerCircleAngleOffset = 2 * Math.PI / (this.totalCorners *2);

        var xPos = (t) => { return  Math.sin(t) };
        var yPos = (t) => { return Math.cos(t) };

        // Finding vertices coordinates of inner circle
        for (var i = 0; i < this.totalCorners; i++) {
            var localOffset = innerCircleAngleOffset * i
            var x = xPos(localOffset) * internalRadius;
            var y = yPos(localOffset) * internalRadius;
            internalCircleArray.push([x, y, 0.5]);
        }

        // Finding vertices coordinates of outer circle
        for (var i = 0; i < this.totalCorners*2; i++) {
            var localOffset = outerCircleAngleOffset * i
            var x = xPos(localOffset) * externalRadius;
            var y = yPos(localOffset) * externalRadius;
            externalCircleArray.push([x, y, 0.5]);
        }
        console.log("Total corners:", this.totalCorners);
        // Merge both vertices
        for (var i=0; i<this.totalCorners; i++){
            // elem 2 of internal
            donutArray.push(...internalCircleArray[i]);
            // elem 1 of external
            typeof externalCircleArray[2*i-1] == "undefined" ? donutArray.push(...externalCircleArray[externalCircleArray.length -1 ]) : donutArray.push(...externalCircleArray[2*i - 1]) ;
            // elem 2 of external
            donutArray.push(...externalCircleArray[2*i]);
            // elem 3 of external
            donutArray.push(...externalCircleArray[2*i + 1]);
        }

        // For fixing the last lone triangle left
        donutArray.push(donutArray[0]);
        donutArray.push(donutArray[1]);
        donutArray.push(donutArray[2]);

        for (var i = 0; i < this.totalCorners; i++) {
            drawInstructions.push(4*i, 4*i + 1, 4*i + 2);
            drawInstructions.push(4*i, 4*i + 2, 4*i + 3);
            drawInstructions.push(4*i, 4*i + 3, 4*i + 4);
        }
        // drawInstructions.push(0, this.totalCorners, 0);

        var colorBuffer = [];
        for (var i = 0; i < this.totalCorners * 4 + 1; i++) {
            colorBuffer.push(0.5,0.1,0.7);
        }

        console.log("internal Circle Array", internalCircleArray);
        console.log("external Circle Array", externalCircleArray);
        console.log("donutArray: ", donutArray);
        console.log("Draw instructions", drawInstructions);
        console.log("Color Buffer", colorBuffer);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(donutArray),
            gl.STATIC_DRAW);

        // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
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

        gl.drawElements(gl.TRIANGLES, 9 * this.totalCorners, gl.UNSIGNED_SHORT, 0);
    }
}
