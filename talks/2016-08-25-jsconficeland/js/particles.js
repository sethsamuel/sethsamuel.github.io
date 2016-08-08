require('../css/demo.css');
console.log('PARTICLES');

{
	const canvas = document.querySelector("canvas");
	const gl = canvas.getContext('webgl');
	let uniformColor;
	let vertexBuffer;
	let vPosition;
	let uTime;

	const particleCount = 50000;

	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	// gl.viewport(0, 0, canvas.width, canvas.height);

	const img = document.querySelector("img");
	const thresholdInput = document.querySelector('input');

	initShaders();
	initBuffers();
	draw();

	const tStart = new Date().getTime();

	function draw(){
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.uniform1f(uTime, (new Date().getTime() - tStart)/3000);
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.GL_POINTS, 0, particleCount);

		requestAnimationFrame(draw);
	}


	function initBuffers(){
		vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		let particles = [];
		for(let i = 0;i<particleCount;i++){
			particles.push(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
		}

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particles), gl.STATIC_DRAW);
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

		vPosition = gl.getAttribLocation(shaderProgram, "vPosition");
		gl.enableVertexAttribArray(vPosition);

		uTime = gl.getUniformLocation(shaderProgram, "uTime");
	}

	function getFragmentShader(){
		const shader = gl.createShader(gl.FRAGMENT_SHADER);
		const source = `
			precision highp float;
			uniform float uTime;
			varying vec2 vCoord;
			void main(void) {
				gl_FragColor = vec4(vCoord.s, vCoord.t, 0.0, 1.0);
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
			uniform float uTime;
			void main(void) {
				vCoord = vec2((vPosition.s+1.0)/2.0, 1.0-(vPosition.t+1.0)/2.0);
				gl_Position = vec4(sin(vPosition.x+uTime*6.28*vPosition.z*vPosition.z), cos(vPosition.y+uTime*6.28*vPosition.z), vPosition.z, 1.0);
				gl_PointSize = 3.0;
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
}