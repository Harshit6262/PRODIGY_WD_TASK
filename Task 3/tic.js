const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const scoreText = document.getElementById("scoreText");
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;
let scores = {X: 0, O: 0};

cells.forEach(cell => cell.addEventListener ("click", cellClicked));

function cellClicked() {
    const index = this.getAttribute("data-index");

    if (options[index] !== "" || !running) return;

    updateCell(this, index);
    checkWinner();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s Turn`;
}

function checkWinner() {
    let roundWon = false;
    let winningCombo = [];

    for(let conditon of winningConditions) {
        const [a, b, c] = conditon;
        if(options[a] && options[a] === options[b] && options[a] === options[c]){
            roundWon = true;
            winningCombo = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent =`${currentPlayer} Wins!`;
        winningCombo.forEach(idx => {
            cells[idx].classList.add('blink');
        });
        scores[currentPlayer]++;
        updateScore();
    }else if (!options.includes("")) {
        statusText.textContent = "Draw!";
        running = false;
    }else {
        changePlayer();
    }
}

let restartButton = document.querySelector(".restart");

restartButton.addEventListener("click", function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s Turn`;
    cells.forEach(cell => { 
        cell.textContent = "";
        cell.classList.remove('blink');
    });
    running = true;
} );



function updateScore() {
    scoreText.textContent = `X: ${scores.X} | O: ${scores.O}`;
}

let resetButton = document.querySelector(".reset");

resetButton.addEventListener("click", function resetScore() {
    scores = {X: 0, O: 0};
    updateScore();
} );
