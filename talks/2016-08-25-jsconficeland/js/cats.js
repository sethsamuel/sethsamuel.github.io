require('../css/demo.css');
require('../css/cats.css');

console.log('CATS');

// http://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
function rgb2hsv (c) {
    var rr, gg, bb,
        r = c[0] / 255,
        g = c[1] / 255,
        b = c[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return [
        Math.round(h * 360),
        Math.round(s * 100),
        Math.round(v * 100)
    ];
}

{
	const canvas = document.querySelector("canvas");
	const gl = canvas.getContext('webgl');
	let uniformColor;
	let vertexBuffer;
	let vPosition;
	let uSampler;
	let uElapsed;
	let uSpeed;
	let texture;

	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	// gl.viewport(0, 0, canvas.width, canvas.height);

	const img = document.querySelector("img");
	const speedInput = document.querySelector('input');

	initShaders();
	initBuffers();
	initTextures();
	const startTime = performance.now();

	function draw(){
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.uniform1f(uSpeed, parseFloat(speedInput.value));
		gl.uniform1f(uElapsed, performance.now() - startTime);
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
			//Convert image to HSV
			const canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			const context = canvas.getContext('2d');
			context.drawImage(image, 0, 0);
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			var hsvImageDataArray = [];
			console.time('HSV convert');
			for(let i = 0; i < imageData.data.length; i += 4) {
				const hsv = rgb2hsv(imageData.data.slice(i, i + 3));
				hsvImageDataArray.push(hsv[0]);
				hsvImageDataArray.push(hsv[1]);
				hsvImageDataArray.push(hsv[2]);
				hsvImageDataArray.push(255);
			}
			console.timeEnd('HSV convert');
			const hsvImageData = new ImageData(new Uint8ClampedArray(hsvImageDataArray), imageData.width, imageData.height);

			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hsvImageData);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			// gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);

			draw();
		};
		image.src = '../images/cats.png';
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
		uSpeed = gl.getUniformLocation(shaderProgram, "uSpeed");
		uElapsed = gl.getUniformLocation(shaderProgram, "uElapsed");
	}

	function getFragmentShader(){
		const shader = gl.createShader(gl.FRAGMENT_SHADER);
		const source = `
			precision highp float;
			uniform vec3 aColor;
			uniform sampler2D uSampler;
			uniform float uSpeed;
			uniform float uElapsed;
			varying vec2 vCoord;

			//http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
			vec3 hsv2rgb(vec3 c) {
				vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	    	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	    	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
			}

			void main(void) {
				vec4 c = texture2D(uSampler, vCoord);
				vec3 shiftedC = vec3(c.x + uElapsed*uSpeed*0.0001, 1.0, 0.9);
				gl_FragColor = vec4(hsv2rgb(shiftedC), 1.0);
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