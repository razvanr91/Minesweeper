let gameBoard = document.getElementById("gameBoard");
let gameBoardRow = document.getElementById("gameBoardRow");
let resetButton = document.getElementById("reset");
let cellNumber = 0;
let maxCellsRow = 10;
let totalCells = 100;
let numberOfBombs = 15;
let bombsArray = generateRandomNumberArray(numberOfBombs);
let gameArray = [];

resetButton.addEventListener("click", resetGame);

function generateBoard() {
	for (let i = 0; i < totalCells; i++) {
		let cell = createCell(i);
		gameBoardRow.append(cell);
		cellNumber++;
		if (cellNumber === maxCellsRow) {
			let col = createColumn();
			gameBoardRow.append(col);
			cellNumber = 0;
		}
	}
}

function createCell(id) {
	let cell = document.createElement("div");
	cell.classList.add("cell", "text-center", "align-middle");
	cell.setAttribute("id", id);

	// Add event for regular click
	cell.addEventListener("click", (e) => {
		if (bombsArray.includes(id) && cell.innerHTML === "") {
			cell.innerHTML = `<i class="fas fa-bomb fs-1 mt-1"></i>`;
		} else if (cell.innerHTML === "") {
			// Right wall
			cell.innerHTML = id % 10 === 10 - 1;
			// Left wall
			cell.innerHTML = id % 10 === 0;
		}
	});

	// Add event for right click
	cell.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		if (cell.innerHTML === "")
			cell.innerHTML = `<i class="fas fa-flag fs-1 mt-1 text-danger"></i>`;
	});

	return cell;
}

function checkForBombs(id) {}

function createColumn() {
	let col = document.createElement("div");
	col.classList.add("col");
	return col;
}

function generateRandomNumberArray(size) {
	let numbers = [];
	for (let i = 0; i < size; i++) {
		let number = Math.floor(Math.random() * totalCells + 1);
		if (numbers.includes(number)) {
			number = Math.floor(Math.random() * totalCells + 1);
		} else {
			numbers.push(number);
		}
	}
	return numbers;
}

function resetGame() {
	location.reload();
}

generateBoard();
