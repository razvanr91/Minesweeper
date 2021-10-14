let gameBoard = document.getElementById("gameBoard");
let gameBoardRow = document.getElementById("gameBoardRow");
let resetButton = document.getElementById("reset")
let cellNumber = 0;
let maxCells = 10;

resetButton.addEventListener("click", resetGame);

function generateBoard() {
	for (let i = 0; i < 100; i++) {
		let cell = createCell();
		gameBoardRow.append(cell);
		cellNumber++;
		if (cellNumber === maxCells) {
			let col = createColumn();
			gameBoardRow.append(col);
			cellNumber = 0;
		}
	}
}

function createCell() {
	let cell = document.createElement("div");
	cell.classList.add("cell");

	// Add event for regular click
	cell.addEventListener("click", (e) => {});

	// Add event for right click
	cell.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});

	return cell;
}

function createColumn() {
	let col = document.createElement("div");
	col.classList.add("col");
	return col;
}

function resetGame() {
	location.reload();
}

generateBoard();
