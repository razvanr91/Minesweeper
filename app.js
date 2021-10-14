let gameBoard = document.getElementById("gameBoard");
let gameBoardRow = document.getElementById("gameBoardRow");
let cellNumber = 0;
let maxCells = 10;

for (let i = 0; i < 100; i++) {
	let cell = document.createElement("div");
	cell.classList.add("cell");
	gameBoardRow.append(cell);
	cellNumber++;
	if (cellNumber === maxCells) {
		let col = document.createElement("div");
		col.classList.add("col");
		gameBoardRow.append(col);
		cellNumber = 0;
	}
}
