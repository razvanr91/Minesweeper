let gameBoard = document.getElementById("gameBoard");
let gameBoardRow = document.getElementById("gameBoardRow");
let resetButton = document.getElementById("reset");
let gameOver = false;
let cellNumber = 0;
let maxCellsRow = 10;
let totalCells = 100;
let numberOfBombs = 15;
let bombsArray = generateRandomNumberArray(numberOfBombs);
let gameArray = [];

resetButton.addEventListener("click", resetGame);
console.log(bombsArray);

function generateBoard() {
	for (let i = 0; i < totalCells; i++) {
		let cell = createCell(i);
		if (!bombsArray.includes(i)) {
			gameArray[i] = "clear";
		} else {
			gameArray[i] = "bomb";
		}
		cell.innerHTML = gameArray[i];
		gameBoardRow.append(cell);
		cellNumber++;
		if (cellNumber === maxCellsRow) {
			let col = createColumn();
			gameBoardRow.append(col);
			cellNumber = 0;
		}
	}

	for(let i = 0; i < totalCells; i++) {
		let leftWallCell = i % maxCellsRow === 0;
		let rightWallCell = i % maxCellsRow === maxCellsRow - 1;
		let nearbyBombs = 0;
		if(gameArray[i] === "clear") {
			if(leftWallCell && i < 10 && gameArray[i+maxCellsRow] === "bomb") nearbyBombs++;
			if(rightWallCell && i > 0 && gameArray[i+maxCellsRow] === "bomb") nearbyBombs++;
			if(i < 9 && gameArray[i - 1] === "bomb") nearbyBombs++;
			document.getElementById(i).innerHTML = nearbyBombs;
		}
	}
}

console.log(gameArray);

function createCell(id) {
	let cell = document.createElement("div");
	cell.classList.add("cell", "text-center", "align-middle");
	cell.setAttribute("id", id);

	let rightWallCell = id % maxCellsRow === maxCellsRow - 1;
	let leftWallCell = id % maxCellsRow === 0;

	// Add event for regular click
	cell.addEventListener("click", (e) => {
		clickCell(cell);
	});

	// Add event for right click
	cell.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		if (cell.innerHTML === "")
			cell.innerHTML = `<i class="fas fa-flag fs-1 mt-1 text-danger"></i>`;
	});

	return cell;
}

function clickCell(cell) {
	let cellId = parseInt(cell.id);
	if (checkForBombs(cellId) && !gameOver) {
		cell.innerHTML = `<i class="fas fa-bomb fs-1 mt-1"></i>`;
		// return (gameOver = true);
	} else if (!cell.classList.contains("clicked-cell")) {
		checkCell(cellId);
	}
	cell.classList.add("clicked-cell");
}

function checkCell(id) {
	let rightWallCell = id % maxCellsRow === maxCellsRow - 1;
	let leftWallCell = id % maxCellsRow === 0;

	if (!leftWallCell && id > 0) {
		let newCell = document.getElementById(id - 1);
		if (!checkForBombs(newCell.id)) {
			clickCell(newCell);
		} else {
			document.getElementById(id).innerHTML = "1";
		}
	}

	if (!rightWallCell && id > 9) {
		let newCell = document.getElementById(id + 1 - maxCellsRow);
		if (!checkForBombs(newCell.id)) clickCell(newCell);
	}
}

function checkForBombs(id) {
	return bombsArray.includes(Number.parseInt(id));
}

function createColumn() {
	let col = document.createElement("div");
	col.classList.add("col");
	return col;
}

function generateRandomNumberArray(size) {
	let numbers = [];
	while (numbers.length < size) {
		let number = Math.floor(Math.random() * totalCells);
		if (number === 0 && !numbers.includes(number)) {
			numbers.push(number);
		} else {
			number++;
			if (numbers.includes(number)) {
				number = Math.floor(Math.random() * totalCells + 1);
			} else {
				numbers.push(number);
			}
		}
	}
	return numbers;
}

function resetGame() {
	location.reload();
}

generateBoard();
