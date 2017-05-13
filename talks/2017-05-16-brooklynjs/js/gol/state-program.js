import {createProgram, createTexture} from './webgl';

export default class StateProgram {
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

		this.uShouldUpdate = gl.getUniformLocation(shaderProgram, "uShouldUpdate");

		this.tTexture0 = createTexture();
		this.tTexture1 = createTexture();

		this.frameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		this.frameBuffer.width = gl.canvas.width;
		this.frameBuffer.height = gl.canvas.height;
		gl.bindTexture(gl.TEXTURE_2D, this.tTexture1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		var renderBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);

		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	}

	setState(state) {
		const gl = this.gl;
		gl.bindTexture(gl.TEXTURE_2D, this.tTexture0);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, state);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	drawState() {
		const gl = this.gl;
		gl.useProgram(this.shaderProgram);

		gl.uniform1i(this.uShouldUpdate, 0);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		if (this.currentState == 0) {
			gl.bindTexture(gl.TEXTURE_2D, this.tTexture0);
		} else {
			gl.bindTexture(gl.TEXTURE_2D, this.tTexture1);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

	}

	incrementState({mousePosition}) {
		const gl = this.gl;
		gl.useProgram(this.shaderProgram);

		gl.uniform1i(this.uShouldUpdate, 1);

		if (mousePosition && mousePosition.length == 2) {
			const uMousePosition = gl.getUniformLocation(this.shaderProgram, "uMousePosition");
			console.log(mousePosition);
			gl.uniform2f(uMousePosition, mousePosition[0], mousePosition[1]);
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		if (this.currentState == 0) {
			gl.bindTexture(gl.TEXTURE_2D, this.tTexture0);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tTexture1, 0);
		} else {
			gl.bindTexture(gl.TEXTURE_2D, this.tTexture1);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tTexture0, 0);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		this.currentState = (this.currentState + 1) % 2;
	}

	stateTexture() {
		if (this.currentState == 0) {
			return this.tTexture0;
		} else {
			return this.tTexture1;
		}
	}
}
