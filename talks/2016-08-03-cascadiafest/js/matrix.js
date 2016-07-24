import MatrixView from './MatrixView';
import '../css/demo.css';
import '../css/matrix.css';
console.log('import?');
console.log('MATRIX DEMO');

let size = 256;
let inputLeft = [];
let inputRight = [];
let resultCpu = [];
let resultGpu = [];

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
		resultCpu.push('&nbsp;');
		resultGpu.push('&nbsp;');
	}
	inputLeftView.matrix = inputLeft;
	inputRightView.matrix = inputRight;
	cpuResult.matrix = resultCpu;
	gpuResult.matrix = resultGpu;

	document.querySelector('.cpu-time').innerHTML = '&nbsp';
	document.querySelector('.gpu-time').innerHTML = '&nbsp';
}

size = document.querySelector('.size-value').value = document.querySelector('.size').value;

document.querySelector('.size').addEventListener('input', (e) => {
	size = document.querySelector('.size-value').value = document.querySelector('.size').value;
	generateMatrices();
});

document.querySelector('.size-value').addEventListener('change', (e) => {
	size = document.querySelector('.size').value = document.querySelector('.size-value').value;
	generateMatrices();
});

generateMatrices();

document.body.addEventListener('keypress', (e) => {
	if(e.key === 'r') {
		generateMatrices();
	}
});

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
		return;
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