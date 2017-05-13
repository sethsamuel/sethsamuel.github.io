import {createProgram, createTexture} from './webgl';

export default class RenderProgram {
	constructor({shaderSource}) {
		let {gl, shaderProgram} = createProgram(shaderSource.vertexSource, shaderSource.fragmentSource);
		this.gl = gl;
		this.shaderProgram = shaderProgram;
		this.currentState = 0;

		// INITIALIZE BUFFERS
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		this.vertices = [
			1, 1, 0,
			-1, 1, 0,
			1, -1, 0,
			-1, -1, 0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
		// END INITIALIZE BUFFERS

		// POINTERS
		const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
		gl.enableVertexAttribArray(aPosition);
		//gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
		gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

		const uWidth = gl.getUniformLocation(shaderProgram, "uWidth");
		gl.uniform1f(uWidth, gl.canvas.width);

	}

	draw(stateTexture) {
		const gl = this.gl;

		gl.useProgram(this.shaderProgram);

		gl.bindTexture(gl.TEXTURE_2D, stateTexture);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}
