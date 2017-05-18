import {createProgram} from './gol/webgl';
import StateProgram from './gol/state-program';
import RenderProgram from './gol/render-program';
import GameOfLife from './gol/programs/gameoflife';
import Identity2D from './gol/programs/identity2d';
import PathfinderRander from './gol/programs/pathfinder-render';
import PathfinderState from './gol/programs/pathfinder-state';

console.log('🐭');

let canvas = document.createElement('canvas');
document.body.appendChild(canvas);
let gl = canvas.getContext('webgl2');

let golStateProgram = new StateProgram({shaderSource: PathfinderState});
let golRenderProgram = new RenderProgram({shaderSource: PathfinderRander});

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
// document.body.style.backgroundImage = 'url(https://maps.googleapis.com/maps/api/staticmap?center=40.6870183,-73.9909988&zoom=16&size=512x512&scale=2)';
document.body.style.backgroundImage = 'url(./images/map.png)';
document.body.style.backgroundSize = '512px';
gl.clearColor(0, 0, 0, 0.0);
gl.clear(gl.COLOR_BUFFER_BIT);
document.body.style.padding = '0';
document.body.style.margin = '0';

//Initial state
// const initialCanvas = document.createElement('canvas');
// initialCanvas.width = gl.canvas.width;
// initialCanvas.height = gl.canvas.height;
// const context = initialCanvas.getContext('2d');
// context.globalAlpha = 1.0;
const initialArray = Array(gl.canvas.width * gl.canvas.height * 4).fill(0);
console.time('Init');
const startX = Math.round(gl.canvas.width * 0.38/4);
const startY = Math.round(gl.canvas.height - (gl.canvas.height * 0.39 / 4));
const startWidth = Math.pow(256/4,0.5);

//Create random sort of people
var people = [];
for (var i = 0; i < 256; i++) {
  people.push(i);
}
people = people.sort(() => {return Math.random() > Math.random();});

for (var i = startX; i < startX + startWidth; i+=1) {
	for (var j = startY; j < startY + startWidth; j+=1) {
			initialArray[(j*gl.canvas.width + i)*4] = people.pop();
			initialArray[(j*gl.canvas.width + i)*4+1] = people.pop();
			initialArray[(j*gl.canvas.width + i)*4+2] = people.pop();
			initialArray[(j*gl.canvas.width + i)*4+3] = people.pop();
	}
}
golStateProgram.setState(new ImageData(new Uint8ClampedArray(initialArray), gl.canvas.width, gl.canvas.height));
console.timeEnd('Init');


function draw() {

	// golStateProgram.drawState();

	// golStateProgram.incrementState();

	golRenderProgram.draw(golStateProgram.stateTexture(), ()=>{
    const uScale = gl.getUniformLocation(golRenderProgram.shaderProgram, "uScale");
    gl.uniform1f(uScale, 4);
  });

  // requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

gl.canvas.addEventListener('click', evt => {
	golStateProgram.incrementState();
	draw();
});
