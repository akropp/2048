// DOM elements
let gridContainer = document.querySelector('.grid-container');
let scoreDisplay = document.getElementById('score');
let gameMessage = document.querySelector('.game-message');
let gameMessageText = document.getElementById('game-message-text');
let restartButton = document.getElementById('restart-button');
let newGameButton = document.getElementById('new-game-button');

// Game state
let score = 0;
let gameOver = false;
let gameWon = false;

// Initialize the game
function initGame() {
    // Clear the grid
    gridContainer.innerHTML = '';
    
    // Reset game state
    score = 0;
    gameOver = false;
    gameWon = false;
    scoreDisplay.innerHTML = '0';
    
    // Create 16 empty tiles
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gridContainer.appendChild(tile);
    }
    
    // Add two random tiles
    addRandomTile();
    addRandomTile();
    
    // Add game message element back to the grid
    const gameMessageElement = document.createElement('div');
    gameMessageElement.className = 'game-message';
    
    const messageText = document.createElement('p');
    messageText.id = 'game-message-text';
    gameMessageElement.appendChild(messageText);
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'controls';
    
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn';
    restartBtn.id = 'restart-button';
    restartBtn.textContent = 'Try Again';
    restartBtn.addEventListener('click', initGame);
    
    controlsDiv.appendChild(restartBtn);
    gameMessageElement.appendChild(controlsDiv);
    gridContainer.appendChild(gameMessageElement);
    
    // Update references to the newly created elements
    gameMessage = document.querySelector('.game-message');
    gameMessageText = document.getElementById('game-message-text');
    restartButton = document.getElementById('restart-button');
    
    // Hide game message
    if (gameMessage) {
        gameMessage.classList.remove('game-won', 'game-over');
    }
}

function addRandomTile() {
    const tiles = Array.from(document.querySelectorAll('.grid-container > .tile'));
    const emptyTiles = tiles.filter(tile => !tile.textContent);
    
    if (emptyTiles.length === 0) return;
    
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    randomTile.textContent = value;
    randomTile.className = 'tile'; // Reset classes
    randomTile.classList.add(`tile-${value}`);
    
    // Add pop animation
    randomTile.classList.add('pop');
    setTimeout(() => {
        randomTile.classList.remove('pop');
    }, 200);
}

// Handle keyboard events
document.addEventListener('keydown', (event) => {
    if (gameOver || gameWon) return;
    
    let moved = false;
    
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
        default:
            return; // Exit if not an arrow key
    }
    
    if (moved) {
        addRandomTile();
        checkGameStatus();
    }
});

function moveUp() {
    let moved = false;
    const tiles = document.querySelectorAll('.grid-container > .tile');
    const grid = [];
    
    // Create a 4x4 grid from the tiles
    for (let i = 0; i < 4; i++) {
        grid[i] = [];
        for (let j = 0; j < 4; j++) {
            const value = parseInt(tiles[i * 4 + j].textContent) || 0;
            grid[i][j] = value;
        }
    }
    
    // Process each column
    for (let col = 0; col < 4; col++) {
        // Move all non-zero numbers up
        for (let row = 1; row < 4; row++) {
            if (grid[row][col] !== 0) {
                let currentRow = row;
                while (currentRow > 0 && grid[currentRow - 1][col] === 0) {
                    grid[currentRow - 1][col] = grid[currentRow][col];
                    grid[currentRow][col] = 0;
                    currentRow--;
                    moved = true;
                }
                
                // Check for merge
                if (currentRow > 0 && grid[currentRow - 1][col] === grid[currentRow][col]) {
                    grid[currentRow - 1][col] *= 2;
                    grid[currentRow][col] = 0;
                    updateScore(grid[currentRow - 1][col]);
                    moved = true;
                }
            }
        }
    }
    
    // Update the UI
    updateGridUI(grid);
    return moved;
}

function moveDown() {
    let moved = false;
    const tiles = document.querySelectorAll('.grid-container > .tile');
    const grid = [];
    
    // Create a 4x4 grid from the tiles
    for (let i = 0; i < 4; i++) {
        grid[i] = [];
        for (let j = 0; j < 4; j++) {
            const value = parseInt(tiles[i * 4 + j].textContent) || 0;
            grid[i][j] = value;
        }
    }
    
    // Process each column
    for (let col = 0; col < 4; col++) {
        // Move all non-zero numbers down
        for (let row = 2; row >= 0; row--) {
            if (grid[row][col] !== 0) {
                let currentRow = row;
                while (currentRow < 3 && grid[currentRow + 1][col] === 0) {
                    grid[currentRow + 1][col] = grid[currentRow][col];
                    grid[currentRow][col] = 0;
                    currentRow++;
                    moved = true;
                }
                
                // Check for merge
                if (currentRow < 3 && grid[currentRow + 1][col] === grid[currentRow][col]) {
                    grid[currentRow + 1][col] *= 2;
                    grid[currentRow][col] = 0;
                    updateScore(grid[currentRow + 1][col]);
                    moved = true;
                }
            }
        }
    }
    
    // Update the UI
    updateGridUI(grid);
    return moved;
}

function moveLeft() {
    let moved = false;
    const tiles = document.querySelectorAll('.grid-container > .tile');
    const grid = [];
    
    // Create a 4x4 grid from the tiles
    for (let i = 0; i < 4; i++) {
        grid[i] = [];
        for (let j = 0; j < 4; j++) {
            const value = parseInt(tiles[i * 4 + j].textContent) || 0;
            grid[i][j] = value;
        }
    }
    
    // Process each row
    for (let row = 0; row < 4; row++) {
        // Move all non-zero numbers left
        for (let col = 1; col < 4; col++) {
            if (grid[row][col] !== 0) {
                let currentCol = col;
                while (currentCol > 0 && grid[row][currentCol - 1] === 0) {
                    grid[row][currentCol - 1] = grid[row][currentCol];
                    grid[row][currentCol] = 0;
                    currentCol--;
                    moved = true;
                }
                
                // Check for merge
                if (currentCol > 0 && grid[row][currentCol - 1] === grid[row][currentCol]) {
                    grid[row][currentCol - 1] *= 2;
                    grid[row][currentCol] = 0;
                    updateScore(grid[row][currentCol - 1]);
                    moved = true;
                }
            }
        }
    }
    
    // Update the UI
    updateGridUI(grid);
    return moved;
}

function moveRight() {
    let moved = false;
    const tiles = document.querySelectorAll('.grid-container > .tile');
    const grid = [];
    
    // Create a 4x4 grid from the tiles
    for (let i = 0; i < 4; i++) {
        grid[i] = [];
        for (let j = 0; j < 4; j++) {
            const value = parseInt(tiles[i * 4 + j].textContent) || 0;
            grid[i][j] = value;
        }
    }
    
    // Process each row
    for (let row = 0; row < 4; row++) {
        // Move all non-zero numbers right
        for (let col = 2; col >= 0; col--) {
            if (grid[row][col] !== 0) {
                let currentCol = col;
                while (currentCol < 3 && grid[row][currentCol + 1] === 0) {
                    grid[row][currentCol + 1] = grid[row][currentCol];
                    grid[row][currentCol] = 0;
                    currentCol++;
                    moved = true;
                }
                
                // Check for merge
                if (currentCol < 3 && grid[row][currentCol + 1] === grid[row][currentCol]) {
                    grid[row][currentCol + 1] *= 2;
                    grid[row][currentCol] = 0;
                    updateScore(grid[row][currentCol + 1]);
                    moved = true;
                }
            }
        }
    }
    
    // Update the UI
    updateGridUI(grid);
    return moved;
}

function updateGridUI(grid) {
    const tiles = document.querySelectorAll('.grid-container > .tile');
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const index = i * 4 + j;
            const value = grid[i][j];
            
            tiles[index].textContent = value || '';
            tiles[index].className = 'tile';
            if (value > 0) {
                tiles[index].classList.add(`tile-${value}`);
            }
        }
    }
}

function updateScore(points) {
    score += points;
    scoreDisplay.innerHTML = score;
}

function checkGameStatus() {
    const tiles = document.querySelectorAll('.grid-container > .tile');
    const grid = [];
    
    // Create a 4x4 grid from the tiles
    for (let i = 0; i < 4; i++) {
        grid[i] = [];
        for (let j = 0; j < 4; j++) {
            const value = parseInt(tiles[i * 4 + j].textContent) || 0;
            grid[i][j] = value;
            
            // Check for 2048 tile
            if (value === 2048 && !gameWon) {
                gameWon = true;
                gameMessageText.textContent = 'You Win!';
                gameMessage.classList.add('game-won');
                return;
            }
        }
    }
    
    // Check if there are any empty cells
    let hasEmptyCell = false;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                hasEmptyCell = true;
                break;
            }
        }
        if (hasEmptyCell) break;
    }
    
    // Check if any moves are possible
    let hasPossibleMoves = false;
    
    // Check horizontal merges
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === grid[i][j + 1] && grid[i][j] !== 0) {
                hasPossibleMoves = true;
                break;
            }
        }
        if (hasPossibleMoves) break;
    }
    
    // Check vertical merges
    if (!hasPossibleMoves) {
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 3; i++) {
                if (grid[i][j] === grid[i + 1][j] && grid[i][j] !== 0) {
                    hasPossibleMoves = true;
                    break;
                }
            }
            if (hasPossibleMoves) break;
        }
    }
    
    // If no empty cells and no possible moves, game over
    if (!hasEmptyCell && !hasPossibleMoves && !gameOver) {
        gameOver = true;
        console.log("Game over detected!");
        
        // Make sure we have a valid reference to the message elements
        gameMessage = document.querySelector('.game-message');
        gameMessageText = document.getElementById('game-message-text');
        
        if (gameMessageText && gameMessage) {
            gameMessageText.textContent = 'Game Over!';
            gameMessage.classList.add('game-over');
            console.log("Game over message should be displayed now");
        } else {
            console.error("Could not find game message elements");
        }
    }
}

// Call the initGame function to start the game
initGame();

// Add event listener for the new game button
document.getElementById('new-game-button').addEventListener('click', initGame);
