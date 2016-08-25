import MatrixView from './MatrixView';
import '../css/demo.css';
import '../css/matrix.css';
console.log('import?');
console.log('MATRIX DEMO');

if (location.search === '?preview') {
	document.body.classList.add('preview');
}

let size = 2;
let inputLeft = [];
let inputRight = [];
let resultCpu = [];
let resultGpu = [];
let highlight = [0,0];

const inputLeftView = new MatrixView({el: document.querySelector('.input-left')});
const inputRightView = new MatrixView({el: document.querySelector('.input-right')});
const cpuResult = new MatrixView({el: document.querySelector('.cpu-result')});
const gpuResult = new MatrixView({el: document.querySelector('.gpu-result')});

const generateMatrices = () => {
	inputLeft = [];
	inputRight = [];
	resultCpu = [];
	resultGpu = [];

	for(let i = 0; i < size * size; i++) {
		inputLeft.push(Math.round(Math.random()*10));
		inputRight.push(Math.round(Math.random()*10));
		// inputRight.push(1);
		resultCpu.push('&nbsp;');
		resultGpu.push('&nbsp;');
	}
	inputLeftView.matrix = inputLeft;
	inputRightView.matrix = inputRight;
	cpuResult.matrix = resultCpu;
	gpuResult.matrix = resultGpu;

	document.querySelector('.cpu-time').innerHTML = '&nbsp';
	document.querySelector('.gpu-time').innerHTML = '&nbsp';

	highlight = [0,0];
}

document.querySelector('.size-value').value = document.querySelector('.size').value = size;

document.querySelector('.size').addEventListener('input', (e) => {
	size = document.querySelector('.size-value').value = document.querySelector('.size').value;
	generateMatrices();
});

document.querySelector('.size-value').addEventListener('change', (e) => {
	size = document.querySelector('.size').value = document.querySelector('.size-value').value;
	generateMatrices();
});

generateMatrices();

document.body.addEventListener('keydown', (e) => {
	if(e.key === 'r') {
		generateMatrices();
	} else if (e.key === 'ArrowUp') {
		highlight[0] = Math.max(0, highlight[0] - 1);
	} else if (e.key === 'ArrowLeft') {
		highlight[1] = Math.max(0, highlight[1] - 1);
	} else if (e.key === 'ArrowDown') {
		highlight[0] = Math.min(size - 1, highlight[0] + 1);
	} else if (e.key === 'ArrowRight') {
		highlight[1] = Math.min(size - 1, highlight[1] + 1);
	}
	updateHighlights();
});


const updateHighlights = () => {
	inputLeftView.highlightRow = highlight[0];
	inputRightView.highlightCol = highlight[1];
	cpuResult.highlightCell = highlight;
	gpuResult.highlightCell = highlight;
	inputLeftView.rowOffset =
		inputRightView.rowOffset =
		cpuResult.rowOffset =
		gpuResult.rowOffset = Math.max(0, highlight[0] - (inputLeftView.width - 1));
	inputLeftView.colOffset =
		inputRightView.colOffset =
		cpuResult.colOffset =
		gpuResult.colOffset = Math.max(0, highlight[1] - (inputLeftView.width - 1));
}

updateHighlights();


const offsetForPoint = (point) => {
	// return 4 * (point[1] * size + point[0]);
	return point[1] * size + point[0];
}

const dataAtPoint = (data, point) => {
	const offset = offsetForPoint(point);
	return data[offset];
}

const toWolframString = (data) => {
	const rows = [];
	for (let row = 0; row < size; row++) {
		const cols = data.slice(row * size, row * size + size);
		rows.push('{' + cols.join(',') + '}');
	}
	return '{' + rows.join(',') + '}';
}

const toImageDataArray = (data) => {
	console.log(data);
	const array = [];
	for(let i = 0; i < data.length; i++) {
		array.push(0);
		array.push(0);
		array.push(0);
		array.push(data[i]);
	}
	console.log(array);
	return new Uint8ClampedArray(array);
};

const fromImageDataArray = (data) => {
	console.log(data);
	const array = [];
	for(let i = 0; i< data.length; i += 4){
		const value = data[i + 3] +
			(data[i + 2] << 8 >>> 0) +
			(data[i + 1] << 16 >>> 0) +
			(data[i] << 24 >>> 0);
		array.push(value);
	}
	console.log(array);
	return array;
}

const goCpu = document.querySelector('.go-cpu');
goCpu.addEventListener('click', (e) => {
	document.querySelector('.spinner').classList.add('active');
	e.target.setAttribute('disabled', true);
	setTimeout(() => {
			if(size < 9){
			console.log(toWolframString(inputLeft) + '*' + toWolframString(inputRight));
		}
		const startTime = performance.now();
		let productMatrix = [];
		const timeStart = new Date();
		for (let row = 0; row < size; row++) {
			for(let col = 0; col < size; col++) {
				let sum = 0;
				for(let k = 0; k < size; k++){
					sum += dataAtPoint(inputLeft, [k, row])*dataAtPoint(inputRight, [col, k]);
				}
				productMatrix[offsetForPoint([col, row])] = sum;
			}
		}
		const elapsed = performance.now() - startTime;
		document.querySelector('.cpu-time').innerText = elapsed.toFixed(2) + 'ms';
		cpuResult.matrix = resultCpu = productMatrix;
		document.querySelector('.spinner').classList.remove('active');
		e.target.removeAttribute('disabled');
	}, 100);
});


const goGpu = document.querySelector('.go-gpu');
goGpu.addEventListener('click', (e) => {
	document.querySelector('.spinner').classList.add('active');
	e.target.setAttribute('disabled', true);
	setTimeout(() => {
		const startTime = performance.now();
		calculateGpuResult((err, result) => {
			if(err) {
				return console.error(err);
			}
			const elapsed = performance.now() - startTime;
			document.querySelector('.gpu-time').innerText = elapsed.toFixed(2) + 'ms';
			gpuResult.matrix = resultGpu = result;
			document.querySelector('.spinner').classList.remove('active');
			e.target.removeAttribute('disabled');
		});
	}, 100);
});

const calculateGpuResult = (done) => {
	// const canvas = document.querySelector("canvas");
	const canvas = document.createElement('canvas');

	canvas.width = canvas.height = size;
	const gl = canvas.getContext('webgl');
	let vertexBuffer;
	let vPosition;
	let textureLeft;
	let textureRight;
	let uSamplerLeft;
	let uSamplerRight;

	gl.clearColor(0,0,0,0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	// gl.viewport(0, 0, canvas.width, canvas.height);

	initShaders();
	initBuffers();
	initTextures();
	draw();

	function draw(){
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureLeft);
		gl.uniform1i(uSamplerLeft, 0);

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, textureRight);
		gl.uniform1i(uSamplerRight, 1);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		gl.flush();
		let pixels = new Uint8Array(size * size * 4);
		gl.readPixels(0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		console.log('pixels', pixels);
		console.log(pixels.length);
		const outputData = fromImageDataArray(pixels);
		return done(null, outputData);
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

		uSamplerLeft = gl.getUniformLocation(shaderProgram, "uSamplerLeft");
		uSamplerRight = gl.getUniformLocation(shaderProgram, "uSamplerRight");

		vPosition = gl.getAttribLocation(shaderProgram, "vPosition");
		gl.enableVertexAttribArray(vPosition);
	}

	function initTextures() {
		{
			textureLeft = gl.createTexture();
			const imageData = new ImageData(toImageDataArray(inputLeft), size, size);
			// tmpContext.putImageData(imageData, 0, 0);
			console.log('left imageData',imageData.data);


			gl.bindTexture(gl.TEXTURE_2D, textureLeft);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}

		{
			textureRight = gl.createTexture();

			const imageData = new ImageData(toImageDataArray(inputRight), size, size);
			console.log('right imageData',imageData.data);

			// tmpContext.putImageData(imageData, 0, 0);
			gl.bindTexture(gl.TEXTURE_2D, textureRight);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}


	function getFragmentShader(){
		const shader = gl.createShader(gl.FRAGMENT_SHADER);
		const source = `
			precision highp float;
			uniform sampler2D uSamplerLeft;
			uniform sampler2D uSamplerRight;
			varying vec2 vCoord;

			float floatFromVec4(vec4 v) {
				return (v.r*pow(2.0,24.0) + v.g*pow(2.0,16.0) + v.b*pow(2.0,8.0) + v.a*pow(2.0,0.0));
			}

			// Row = t, col = s
			void main(void) {
				float sum = 0.0;
				for(int i = 0; i < ${size}; i++) {
					vec4 cLeft = texture2D(uSamplerLeft, vec2(float(i)/${size}.0,vCoord.t));
					vec4 cRight = texture2D(uSamplerRight, vec2(vCoord.s,float(i)/${size}.0));
					sum = sum + (floatFromVec4(cLeft)*255.0 * floatFromVec4(cRight)*255.0);
				}

				float a = (mod(sum, pow(2.0,8.0)));
				float b = (mod(sum - a, pow(2.0,16.0))) * pow(2.0, -8.0);
				float g = (mod(sum - b - a, pow(2.0,24.0))) * pow(2.0, -16.0);
				float r = (mod(sum - g - b - a, pow(2.0,32.0))) * pow(2.0, -24.0);
				gl_FragColor = vec4(
					r/255.0,
					g/255.0,
					b/255.0,
					a/255.0
				);
			}
		`;
		console.log(source);
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
				vCoord = vec2((vPosition.s+1.0)/2.0, (vPosition.t+1.0)/2.0);
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
};