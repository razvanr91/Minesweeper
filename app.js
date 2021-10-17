let gameBoard = document.getElementById("gameBoard");
let gameBoardRow = document.getElementById("gameBoardRow");
let resetButton = document.getElementById("reset");
let gameOver = false;
let cellNumber = 0;
let maxCellsRow = 10;
let totalCells = 100;
let numberOfBombs = 20;
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

	for (let i = 0; i < totalCells; i++) {
		let leftWallCell = i % maxCellsRow === 0;
		let rightWallCell = i % maxCellsRow === maxCellsRow - 1;
		let nearbyBombs = 0;
		if (gameArray[i] == "clear") {
			// If it's fist cell
			if (i === 0) {
				if (gameArray[1] === "bomb") nearbyBombs++;
				if (gameArray[i + maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + maxCellsRow + 1] === "bomb") nearbyBombs++;
			}
			// If it's a cell on the left wall and it's smaller than 90 and bigger than 0
			if (leftWallCell && i < maxCellsRow * maxCellsRow - maxCellsRow && i != 0) {
				if (gameArray[i - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + 1 - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + 1] === "bomb") nearbyBombs++;
				if (gameArray[i + 1 + maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + maxCellsRow] === "bomb") nearbyBombs++;
			}
			// Check for i === 90
			if (i === maxCellsRow * maxCellsRow - maxCellsRow) {
				if (gameArray[i - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + 1 - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + 1] === "bomb") nearbyBombs++;
			}

			// Check for first cell on right wall
			if (i === maxCellsRow - 1) {
				if (gameArray[i - 1] === "bomb") nearbyBombs++;
				if (gameArray[i - 1 + maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + maxCellsRow] === "bomb") nearbyBombs++;
			}

			// Check for all other cell on right wall except for the first and last
			if (rightWallCell && i > maxCellsRow - 1 && i != maxCellsRow * maxCellsRow - 1) {
				if (gameArray[i - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i - 1 - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i - 1] === "bomb") nearbyBombs++;
				if (gameArray[i - 1 + maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + maxCellsRow] === "bomb") nearbyBombs++;
			}

			// Check for cells that are in the middle
			if (!leftWallCell && !rightWallCell) {
				if (gameArray[i - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + 1 - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + 1] === "bomb") nearbyBombs++;
				if (gameArray[i + 1 + maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i + maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i - 1 + maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i - 1] === "bomb") nearbyBombs++;
				if (gameArray[i - 1 - maxCellsRow] === "bomb") nearbyBombs++;
			}

			// Check for i === 99
			if (i === maxCellsRow * maxCellsRow - 1) {
				if (gameArray[i - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i - 1 - maxCellsRow] === "bomb") nearbyBombs++;
				if (gameArray[i - 1] === "bomb") nearbyBombs++;
			}
			gameArray[i] = nearbyBombs;
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
		clickCell(cell.id);
	});

	// Add event for right click
	cell.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		if (cell.innerHTML === "")
			cell.innerHTML = `<i class="fas fa-flag fs-1 mt-1 text-danger"></i>`;
	});

	return cell;
}

function clickCell(id) {
	if (id <= maxCellsRow * maxCellsRow - 1 && id >= 0) {
		let cell = document.getElementById(id.toString());
		let cellId = parseInt(cell.id);
		if (checkForBombs(cellId) && !gameOver) {
			cell.innerHTML = `<i class="fas fa-bomb fs-1 mt-1"></i>`;
			// return (gameOver = true);
		} else if (!cell.classList.contains("clicked-cell")) {
			cell.innerHTML = gameArray[id];
			checkCell(cellId);
		}
		cell.classList.add("clicked-cell");
	}
}

function checkCell(id) {
	let rightWallCell = id % maxCellsRow === maxCellsRow - 1;
	let leftWallCell = id % maxCellsRow === 0;
	let half = (maxCellsRow * maxCellsRow) / 2 - 1;
	let halfRow = maxCellsRow / 2 - 1;
	setTimeout(() => {
		if (id <= maxCellsRow * maxCellsRow - 1 && id >= 0) {
			// If cell is on right wall || cell is on first row || cell is not on first row
			// || cell is on left wall && cell is on the upper side of the board
			//  check the cell underneath
			if (
				(rightWallCell || id < maxCellsRow || id > maxCellsRow || leftWallCell) &&
				id <= half &&
				!checkForBombs(id + maxCellsRow)
			) {
				clickCell(id + maxCellsRow);
			}

			// If cell is on left wall and and on the upper side of the board check the cell above
			if (leftWallCell && id >= half && !checkForBombs(id - maxCellsRow)) {
				clickCell(id - maxCellsRow);
			}

			// If first cell || cell is on left wall but not on the first row ||
			// cell is on first half of first row check next cell
			if (
				(id === 0 || (id > 0 && leftWallCell) || (id < maxCellsRow && id <= halfRow)) &&
				!checkForBombs(id + 1)
			) {
				clickCell(id + 1);
			}

			// If cell is on right side of first row || cell on right wall and lower that the first row check cell before current cell
			if (
				((id < maxCellsRow && id > halfRow) || (rightWallCell && id > maxCellsRow)) &&
				!checkForBombs(id - 1)
			) {
				clickCell(id - 1);
			}

			// If is last cell check the one diagonal to it
			if (id === maxCellsRow * maxCellsRow - 1 && !checkForBombs(id - maxCellsRow - 1)) {
				clickCell(id - maxCellsRow - 1);
			}

			// If last cell on the left check the one diagonal to it
			if (
				id === maxCellsRow * maxCellsRow - maxCellsRow &&
				!checkForBombs(id + 1 - maxCellsRow)
			) {
				clickCell(id + 1 - maxCellsRow);
			}

			// If last cell on first row check the one diagonal to it
			if (id < maxCellsRow && rightWallCell && !checkForBombs(id + maxCellsRow - 1)) {
				clickCell(id + maxCellsRow - 1);
			}

			// If cell on right wall and lower that half the board check cell above
			if (rightWallCell && id >= half && !checkForBombs(id - maxCellsRow)) {
				clickCell(id - maxCellsRow);
			}
		}
	}, 10);
}

function checkForBombs(id) {
	return bombsArray.includes(parseInt(id));
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
