export function createProgram(vertexSource, fragmentSource) {
	// GLOBALS
	const body = document.body;
	const canvas = document.querySelector('canvas');
	const gl = canvas.getContext('webgl2');
	// END GLOBALS

	// BEGIN WINDOW SIZING
	function resize() {
		const size = Math.pow(2,Math.floor(Math.log2(Math.min(window.innerWidth, window.innerHeight))))*2;
		// const size = 256;
		canvas.width = size;
		canvas.height = size;
		canvas.style.width = size/2 + 'px';
		canvas.style.height = size/2 + 'px';

		// Set viewport
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	resize();

	window.addEventListener('resize', resize);
	// END WINDOW SIZING

	// GL SETTINGS

	// Color to draw on clear
	gl.clearColor(0,0,0,1);

	// Clear buffers
	gl.clear(gl.COLOR_BUFFER_BIT);

	// END GL SETTINGS

	// INITIALIZE SHADERS

	// CREATE VERTEX SHADER
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexSource);
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		throw new Error("An error occurred compiling the shader: " + gl.getShaderInfoLog(vertexShader));
	}else{
		console.log("Vertex shader compiled");
	}
	// END CREATE VERTEX SHADER

	// CREATE FRAGMENT SHADER
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentSource);
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		throw new Error("An error occurred compiling the shader: " + gl.getShaderInfoLog(fragmentShader));
	}else{
		console.log("Fragment shader compiled");
	}
	// END CREATE FRAGMENT SHADER

	// COMPILE PROGRAM
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		throw new Error("Unable to initialize the shader program.");
	}else{
		console.log("Initialized shader program");
	}
	gl.useProgram(shaderProgram);
	// END COMPILE PROGRAM

	// END INITIALIZE SHADERS


	return {gl, shaderProgram};
}

export function createTexture() {
	const gl = document.querySelector('canvas').getContext('webgl2');
	const tTexture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.bindTexture(gl.TEXTURE_2D, null);
	return tTexture;
}
