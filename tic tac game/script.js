let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let aiMode = false;

const startButton = document.getElementById("start-button");
const backButton = document.getElementById("back-button");
const exitButton = document.getElementById("exit-button");
const restartButton = document.getElementById("restart-button");
const privacyButton = document.getElementById("privacy-button");
const gameContainer = document.getElementById("game-container");
const introScreen = document.getElementById("intro-screen");
const modeSelectScreen = document.getElementById("mode-select-screen");
const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");

const clickSound = document.getElementById("click-sound");
const celebrationSound = document.getElementById("celebration-sound");
const backgroundMusic = document.getElementById("background-music");

function startBackgroundMusic() {
    backgroundMusic.play();
}

function playClickSound() {
    clickSound.play();
}

function playCelebrationSound() {
    celebrationSound.play();
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    currentPlayer = "X";
    messageElement.innerText = `Player ${currentPlayer}'s turn`;
    createBoard();
}

function createBoard() {
    boardElement.innerHTML = ""; // Clear the board
    for (let i = 0; i < 9; i++) {
        const button = document.createElement("button");
        button.id = "cell-" + i;
        button.className = "cell";
        button.addEventListener("click", () => handleClick(i));
        boardElement.appendChild(button);
    }
}

function handleClick(index) {
    if (gameBoard[index] === "" && !gameOver) {
        gameBoard[index] = currentPlayer;
        document.getElementById("cell-" + index).innerText = currentPlayer;
        playClickSound();
        if (checkWinner()) {
            playCelebrationSound();
            gameOver = true;
            highlightWinningCombination();
            messageElement.innerText = `Player ${currentPlayer} wins!`;
        } else if (gameBoard.every(cell => cell !== "")) {
            gameOver = true;
            messageElement.innerText = "It's a draw!";
        } else {
            togglePlayer();
            if (aiMode && currentPlayer === "O") {
                aiMove();
            }
        }
    }
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return combo; // Return the winning combination
        }
    }
    return null;
}

function highlightWinningCombination() {
    const winningCombo = checkWinner();
    if (winningCombo) {
        winningCombo.forEach(index => {
            const cell = document.getElementById(`cell-${index}`);
            cell.style.backgroundColor = currentPlayer === "X" ? "#FFD700" : "#FF4500"; // Gold for X, OrangeRed for O
        });
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    messageElement.innerText = `Player ${currentPlayer}'s turn`;
}

function aiMove() {
    const availableCells = gameBoard
        .map((cell, index) => (cell === "" ? index : null))
        .filter(val => val !== null);
    const aiChoice = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameBoard[aiChoice] = "O";
    document.getElementById(`cell-${aiChoice}`).innerText = "O";
    if (checkWinner()) {
        playCelebrationSound();
        gameOver = true;
        highlightWinningCombination();
        messageElement.innerText = "Player O wins!";
    } else if (gameBoard.every(cell => cell !== "")) {
        gameOver = true;
        messageElement.innerText = "It's a draw!";
    } else {
        togglePlayer();
    }
}

function showGameScreen() {
    introScreen.style.display = "none";
    modeSelectScreen.style.display = "none";
    gameContainer.style.display = "block";
    resetGame();
}

function showModeSelectScreen() {
    introScreen.style.display = "none";
    modeSelectScreen.style.display = "block";
    gameContainer.style.display = "none";
}

// Event Listeners
startButton.addEventListener("click", () => {
    playClickSound();
    startBackgroundMusic();
    showModeSelectScreen();
});

privacyButton.addEventListener("click", () => {
    alert("AJ Srabon built the Tic-Tac-Toe game as a Free game. This SERVICE is provided by AJ Srabon at no cost and is intended for use as is.");
});

document.getElementById("play-with-ai").addEventListener("click", () => {
    aiMode = true;
    showGameScreen();
});

document.getElementById("play-with-friends").addEventListener("click", () => {
    aiMode = false;
    showGameScreen();
});

backButton.addEventListener("click", () => {
    playClickSound();
    showModeSelectScreen();
});

restartButton.addEventListener("click", () => {
    playClickSound();
    resetGame();
});

exitButton.addEventListener("click", () => {
    playClickSound();
    window.location.reload(); // Reloads the page to exit the game
});
