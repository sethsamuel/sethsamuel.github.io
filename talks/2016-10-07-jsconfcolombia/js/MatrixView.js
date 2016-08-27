export default class MatrixView {
	constructor(options = {}) {
		this.el = options.el || document.createElement('div');
		this.el.classList.add('matrix');
		this.width = 3;
		this._matrix = [];
		this._highlightRow = -1;
		this._highlightCol = -1;
		this._highlightCell = [-1,-1];
		this._rowOffset = 0;
		this._colOffset = 0
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

	get highlightRow() {
		return this._highlightRow;
	}

	set highlightRow(row){
		this._highlightRow = row;
		this.render();
	}

	get highlightCol() {
		return this._highlightCol;
	}

	set highlightCol(col){
		this._highlightCol = col;
		this.render();
	}

	get highlightCell() {
		return this._highlightCell;
	}

	set highlightCell(cell){
		this._highlightCell = cell;
		this.render();
	}

	get rowOffset() {
		return this._rowOffset;
	}

	set rowOffset(offset){
		this._rowOffset = offset;
		this.render();
	}

	get colOffset() {
		return this._colOffset;
	}

	set colOffset(offset){
		this._colOffset = offset;
		this.render();
	}


	render() {
		const els = ['<table>'];
		console.log(this.rowOffset);
		console.log(this.highlightRow);
		for(let row = 0; row < Math.min(this.size, this.width); row++) {
			els.push(`<tr class='${((row+this.rowOffset) === this.highlightRow) ? "highlight" : ""}'>`);
			for(let col = 0; col < Math.min(this.size, this.width); col++) {
				els.push(`<td class='${((col+this.colOffset) === this.highlightCol || ((row+this.rowOffset) === this.highlightCell[0] && (col+this.colOffset) === this.highlightCell[1])) ? "highlight" : ""}'>`);
				els.push(this.matrix[(row+this.rowOffset)*this.size + (col+this.colOffset)]);
				els.push('</td>');
			}
			els.push('</tr>');
		}
		els.push('</table>');
		this.el.innerHTML = els.join('');
	}
}