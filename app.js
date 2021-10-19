let gameBoard = document.getElementById("gameBoard");
let gameBoardRow = document.getElementById("gameBoardRow");
let resetButton = document.getElementById("reset");
let gameOver = false;
let cellNumber = 0;
let maxCellsRow = 10;
let totalCells = 100;
let numberOfBombs = 20;
let numberOfFlags = 20;
let usedFlags = 0;
let bombsArray = generateRandomNumberArray(numberOfBombs);
let gameArray = [];

let bombsDisplay = document.getElementById("bombs");
bombsDisplay.innerHTML = numberOfBombs;

let flagsDisplay = document.getElementById("flags");
flagsDisplay.innerHTML = numberOfFlags;

resetButton.addEventListener("click", resetGame);

function generateBoard() {
	for (let i = 0; i < totalCells; i++) {
		let cell = createCell(i);
		if (!bombsArray.includes(i)) {
			gameArray[i] = "clear";
		} else {
			gameArray[i] = "bomb";
		}
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

function checkWin() {
	let guessedBombs = 0;
	for (let i = 0; i < bombsArray.length; i++) {
		let cell = document.getElementById(bombsArray[i].toString());
		if (cell.classList.contains("flagged")) ++guessedBombs;
	}

	if (guessedBombs === numberOfBombs) {
		flagsDisplay.innerHTML = "YOU";
		bombsDisplay.innerHTML = "WIN";
		gameOver = true;
	}
}

function createCell(id) {
	let cell = document.createElement("div");
	cell.classList.add("cell", "text-center", "align-middle");
	cell.setAttribute("id", id);

	// Add event for regular click
	cell.addEventListener("click", (e) => {
		clickCell(cell.id);
	});

	// Add event for right click
	cell.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		addFlag(cell);
	});

	return cell;
}

function addFlag(cell) {
	if (gameOver) return;
	if (!cell.classList.contains("clicked-cell") && usedFlags < numberOfBombs) {
		if (cell.innerHTML === "") {
			cell.innerHTML = `<i class="fas fa-flag fs-1 mt-1 text-danger"></i>`;
			numberOfFlags--;
			flagsDisplay.innerHTML = numberOfFlags;
			usedFlags++;
			cell.classList.add("flagged");
			checkWin();
		} else {
			cell.innerHTML = "";
			numberOfFlags++;
			flagsDisplay.innerHTML = numberOfFlags;
			usedFlags--;
			cell.classList.remove("flagged");
		}
	}
}

function clickCell(id) {
	if (gameOver) return;

	if (id <= maxCellsRow * maxCellsRow - 1 && id >= 0) {
		let cell = document.getElementById(id.toString());
		cell.classList.add("text-center", "fs-1");
		let cellId = parseInt(cell.id);
		if (cell.classList.contains("flagged") || cell.classList.contains("clicked-cell"))
			return;
		if (checkForBombs(cellId) && !gameOver) {
			cell.innerHTML = `<i class="fas fa-bomb fs-1 mt-1"></i>`;
			endGame();
			return (gameOver = true);
		} else if (!cell.classList.contains("clicked-cell")) {
			switch (gameArray[id]) {
				case 1:
					cell.classList.add("text-success");
					break;
				case 2:
					cell.classList.add("text-primary");
					break;
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
					cell.classList.add("text-danger");
					break;
			}
			if (gameArray[id] != 0) cell.innerHTML = gameArray[id];
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
	// Set timeout due to error for too many recursions
	setTimeout(() => {
		if (id <= maxCellsRow * maxCellsRow - 1 && id >= 0) {

			// If cell is not next to any wall && id is not on the las row
			if (!rightWallCell && !leftWallCell && (id < maxCellsRow * maxCellsRow - maxCellsRow) && !checkForBombs(id + maxCellsRow)) {
				clickCell(id+maxCellsRow);
			}

			// If cell is on right wall || cell is on first row || cell is not on first row
			// || cell is on left wall check the cell underneath
			if (
				(rightWallCell || id < maxCellsRow || id > maxCellsRow || leftWallCell) &&
				!checkForBombs(id + maxCellsRow)
			) {
				clickCell(id + maxCellsRow);
			}

			// If cell is on left wall || cell is not next to any wall && is not on first row 
			// || cell is next to right wall and not on first row Check the cell above
			if (((leftWallCell) || (!leftWallCell && !rightWallCell && id > maxCellsRow) || (rightWallCell && id > maxCellsRow)) && !checkForBombs(id - maxCellsRow)) {
				clickCell(id - maxCellsRow);
			}

			// If first cell || cell is on left wall but not on the first row ||
			// cell is on first row || cell is not next to right wall check the cell to the right
			if (
				(id === 0 || (id > 0 && leftWallCell) || (id < maxCellsRow ) || (!rightWallCell)) &&
				!checkForBombs(id + 1)
			) {
				clickCell(id + 1);
			}

			// If cell is on first row and is not the first cell || cell is next to the right wall and 
			// is not on first row check the cell to the left
			if (
				((id < maxCellsRow && id != 0) || (rightWallCell && id > maxCellsRow)) &&
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
		let number = Math.floor(Math.random() * (totalCells - 1));
		if (number === 0 && !numbers.includes(number)) {
			numbers.push(number);
		} else {
			number++;
			if (numbers.includes(number)) {
				number = Math.floor(Math.random() * (totalCells - 1));
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

function endGame() {
	bombsDisplay.innerHTML = "GAME";
	flagsDisplay.innerHTML = "OVER";
	gameOver = true;
	for (let i = 0; i < totalCells; i++) {
		if (gameArray[i] === "bomb") {
			let cell = document.getElementById(i);
			cell.classList.add("clicked-cell");
			cell.innerHTML = `<i class="fas fa-bomb fs-1 mt-1"></i>`;
		}
	}
	resetButton.innerHTML = `<i class="far fa-sad-cry"></i>`;
}

generateBoard();
