import {createProgram} from './gol/webgl';
import StateProgram from './gol/state-program';
import RenderProgram from './gol/render-program';
import GameOfLifeColorVote from './gol/programs/gameoflife-colorvote';
import Identity2D from './gol/programs/identity2d';

console.log('🐭');

let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
let gl = canvas.getContext('webgl2');

let golStateProgram = new StateProgram({shaderSource: GameOfLifeColorVote});
let golRenderProgram = new RenderProgram({shaderSource: Identity2D});

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
		let die = Math.random();
		if (die < 0.33) {
			initialArray[(j*gl.canvas.width + i)*4] = 255;
			initialArray[(j*gl.canvas.width + i)*4+1] = 0;
			initialArray[(j*gl.canvas.width + i)*4+2] = 0;
			initialArray[(j*gl.canvas.width + i)*4+3] = 255;
		} else if (die < 0.66) {
			initialArray[(j*gl.canvas.width + i)*4] = 0;
			initialArray[(j*gl.canvas.width + i)*4+1] = 255;
			initialArray[(j*gl.canvas.width + i)*4+2] = 0;
			initialArray[(j*gl.canvas.width + i)*4+3] = 255;
		} else {
			initialArray[(j*gl.canvas.width + i)*4] = 0;
			initialArray[(j*gl.canvas.width + i)*4+1] = 0;
			initialArray[(j*gl.canvas.width + i)*4+2] = 255;
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

var isPaused = true;
function draw() {
	// gl.uniform2f(uMousePosition, mousePosition[0], mousePosition[1]);

	// golStateProgram.drawState();


	golRenderProgram.draw(golStateProgram.stateTexture());

  // setTimeout(draw, 100);
	if (!isPaused) {
		golStateProgram.incrementState();
		requestAnimationFrame(draw);
	}
}
requestAnimationFrame(draw);
// END DRAW LOOP

gl.canvas.addEventListener('click', evt => {
	golStateProgram.incrementState();
	draw();
});
document.addEventListener('keypress', evt => {
	console.log(evt);
	if (evt.key == 'p') {
		isPaused = !isPaused;
	}
	draw();
});

