require('../css/demo.css');
require('../css/edgefinder.css');

console.log('EDGES');

{
	const canvas = document.querySelector("canvas");
	const gl = canvas.getContext('webgl');
	let uniformColor;
	let vertexBuffer;
	let vPosition;
	let uSampler;
	let uThreshold;
	let texture;

	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	// gl.viewport(0, 0, canvas.width, canvas.height);

	const img = document.querySelector("img");
	const thresholdInput = document.querySelector('input');

	initShaders();
	initBuffers();
	initTextures();

	function draw(){
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.uniform1f(uThreshold, parseFloat(thresholdInput.value));
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(uSampler, 0);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		requestAnimationFrame(draw);
	}

	function initTextures(){
		texture = gl.createTexture();
		const image = new Image();
		image.crossOrigin = true;
		image.onload = () => {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			// gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);

			draw();
		};
		image.src = '../images/edgefinder.jpg';
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

		vPosition = gl.getAttribLocation(shaderProgram, "vPosition");
		gl.enableVertexAttribArray(vPosition);

		uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
		uThreshold = gl.getUniformLocation(shaderProgram, "uThreshold");
	}

	function getFragmentShader(){
		const shader = gl.createShader(gl.FRAGMENT_SHADER);
		const source = `
			precision highp float;
			uniform vec3 aColor;
			uniform sampler2D uSampler;
			uniform float uThreshold;
			varying vec2 vCoord;
			void main(void) {
				vec4 c = texture2D(uSampler, vCoord);
				vec4 cLeft = texture2D(uSampler, vCoord - vec2(-0.005,0.0));
				if(distance(cLeft.rgb, c.rgb) > uThreshold){
					gl_FragColor = vec4(1.0,0.0,1.0,1.0);
				}else{
					gl_FragColor = vec4(0.0,0.0,0.0,1.0);
				}
				// gl_FragColor = vec4(cLeft.rgb - c.rgb, 1.0);
				//gl_FragColor = texture2D(uSampler, vCoord);
				// gl_FragColor = vec4(vCoord.s, vCoord.t, 0.0, 1.0);
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
}