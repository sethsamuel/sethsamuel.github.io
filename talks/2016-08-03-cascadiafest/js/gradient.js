const demoCss = require('../css/demo.css');
console.log('GRADIENT DEMO');
(() => {
	const canvas = document.querySelector("canvas");
	const gl = canvas.getContext('webgl');
	let uniformColor;
	let vertexBuffer;
	let vPosition;
	let texture;

	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	// gl.viewport(0, 0, canvas.width, canvas.height);

	const thresholdInput = document.querySelector('input');

	initShaders();
	initBuffers();

	draw();

	function draw(){
		const timestamp = ((1+Math.sin((new Date()).getTime()/0xff0000))/2.0 * 0xffffff);
		const r = ((timestamp & 0xff0000) >> 16)/255.0;
		const g = ((timestamp & 0x00ff00) >> 8)/255.0;
		const b = ((timestamp & 0x0000ff) >> 0)/255.0;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.uniform3f(uniformColor, r, g, b);
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		requestAnimationFrame(draw);
	}

	function initBuffers(){
		vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		const vertices = [
			1, 1, 0,
			-1, 1, 0,
			1, -1, 0,
			-1, -1, 0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	}

	function initShaders(){
		const fragmentShader = getFragmentShader();
		const vertexShader = getVertexShader();

		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			console.error("Unable to initialize the shader program.");
		}else{
			console.log("Initialized shader program");
		}

		gl.useProgram(shaderProgram);

		uniformColor = gl.getUniformLocation(shaderProgram, "aColor");
		vPosition = gl.getAttribLocation(shaderProgram, "vPosition");
		gl.enableVertexAttribArray(vPosition);
	}

	function getFragmentShader(){
		const shader = gl.createShader(gl.FRAGMENT_SHADER);
		const source = `
			precision highp float;
			uniform vec3 aColor;
			varying vec2 vCoord;
			void main(void) {
				gl_FragColor = vec4(vCoord.s, vCoord.t, 0, 1.0);
			}
		`;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
			return null;
		}else{
			console.log("Fragment shader compiled");
		}
		return shader;
	}

	function getVertexShader(){
		const shader = gl.createShader(gl.VERTEX_SHADER);
		const source = `
			precision highp float;
			attribute vec3 vPosition;
			varying vec2 vCoord;
			void main(void) {
				vCoord = vec2((vPosition.s+1.0)/2.0, 1.0-(vPosition.t+1.0)/2.0);
				gl_Position = vec4(vPosition, 1.0);
			}
		`;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
			return null;
		}else{
			console.log("Vertex shader compiled");
		}

		return shader;
	}
})()