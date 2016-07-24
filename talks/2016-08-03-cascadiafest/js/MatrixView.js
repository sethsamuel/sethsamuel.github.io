export default class MatrixView {
	constructor(options = {}) {
		this.el = options.el || document.createElement('div');
		this.el.classList.add('matrix');
		this.width = 3;
		this._matrix = [];
	}

	set matrix(matrix){
		const size = Math.sqrt(matrix.length);
		if(Math.floor(size) !== size) {
			throw new Error('Matrix must be square');
		}

		this._matrix = matrix;
		this.size = size;
		this.render();
	}

	get matrix() {
		return this._matrix;
	}

	render() {
		const els = ['<table>'];
		for(let row = 0; row < Math.min(this.size, this.width); row++) {
			els.push('<tr>');
			for(let col = 0; col < Math.min(this.size, this.width); col++) {
				els.push('<td>');
				els.push(this.matrix[row*this.size + col]);
				els.push('</td>');
			}
			els.push('</tr>');
		}
		els.push('</table>');
		this.el.innerHTML = els.join('');
	}
}