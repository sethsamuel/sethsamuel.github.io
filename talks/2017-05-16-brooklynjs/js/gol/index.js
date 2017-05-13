import {createProgram} from './webgl';
import StateProgram from './state-program';
import RenderProgram from './render-program';
import GameOfLife from './programs/gameoflife';
import GameOfLifeBlur from './programs/gameoflife-blur';

console.log('🐭');

let golStateProgram = new StateProgram({shaderSource: GameOfLife});
let golRenderProgram = new RenderProgram({shaderSource: GameOfLifeBlur});

let gl = document.querySelector('canvas').getContext('webgl2');

// // const uMousePosition = gl.getUniformLocation(shaderProgram, "uMousePosition");
//
//
// // INTERACTION HANDLER
// var mousePosition = [];
// gl.canvas.addEventListener('mousemove', evt => {
//   mousePosition = [
//     (evt.clientX/gl.canvas.width - 0.5) * 2.0,
//     (1.0 - evt.clientY/gl.canvas.height - 0.5) * 2.0
//   ];
// 	// draw();
// });
// END INTERACTION HANDLER

// DRAW LOOP
gl.clearColor(0, 0, 0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

//Initial state
// const initialCanvas = document.createElement('canvas');
// initialCanvas.width = gl.canvas.width;
// initialCanvas.height = gl.canvas.height;
// const context = initialCanvas.getContext('2d');
// context.globalAlpha = 1.0;
const initialArray = [];
console.time('Init');
for (var i = 0; i < gl.canvas.width; i++) {
	for (var j = 0; j < gl.canvas.height; j++) {
		if (Math.random() < 0.35) {
			// context.fillStyle = 'red';
			// context.fillRect(i, j, 1, 1);
			initialArray[(j*gl.canvas.width + i)*4] = 255;
			initialArray[(j*gl.canvas.width + i)*4+1] = 0.0;
			initialArray[(j*gl.canvas.width + i)*4+2] = 0.0;
			initialArray[(j*gl.canvas.width + i)*4+3] = 255;
		} else {
			// context.fillStyle = 'black';
			// context.fillRect(i, j, 1, 1);
			initialArray[(j*gl.canvas.width + i)*4] = 0.0;
			initialArray[(j*gl.canvas.width + i)*4+1] = 0.0;
			initialArray[(j*gl.canvas.width + i)*4+2] = 0.0;
			initialArray[(j*gl.canvas.width + i)*4+3] = 255;
		}
	}
}
// context.fillStyle = 'red';
// context.fillRect(0, 0, 64, 64);
// golStateProgram.setState(initialCanvas);
golStateProgram.setState(new ImageData(new Uint8ClampedArray(initialArray), gl.canvas.width, gl.canvas.height));
console.timeEnd('Init');


let flip = 0;

function draw() {
	// gl.uniform2f(uMousePosition, mousePosition[0], mousePosition[1]);

	// golStateProgram.drawState();

	golStateProgram.incrementState();

	golRenderProgram.draw(golStateProgram.stateTexture());

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
// END DRAW LOOP
