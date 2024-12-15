const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const playButton = document.getElementById("play-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");

const boardSize = 20;
let snake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 }
];
let food = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
let direction = { x: 1, y: 0 };
let score = 0;
let gameInterval;
let isPaused = true;

// Create the game board
function createBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    gameBoard.appendChild(cell);
  }
}

// Draw the snake on the game board
function drawSnake() {
  const cells = document.querySelectorAll(".grid-cell");
  cells.forEach((cell) => cell.classList.remove("snake"));

  snake.forEach((segment) => {
    const index = segment.y * boardSize + segment.x;
    cells[index].classList.add("snake");
  });
}

// Draw the food on the game board
function drawFood() {
  const cells = document.querySelectorAll(".grid-cell");
  cells.forEach((cell) => cell.classList.remove("food"));

  const index = food.y * boardSize + food.x;
  cells[index].classList.add("food");
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap the snake around the edges
  head.x = (head.x + boardSize) % boardSize;
  head.y = (head.y + boardSize) % boardSize;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
  } else {
    snake.pop(); // Remove the tail if no food was eaten
  }
}

// Check for collisions
function checkCollision() {
  const head = snake[0];

  // Check if the snake collides with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      showGameOver();
      return true;
    }
  }
  return false;
}

function showGameOver() {
  clearInterval(gameInterval); // Stop the game loop
  const overlay = document.getElementById("game-over-overlay");
  overlay.style.display = "flex"; // Show the overlay
}

// Reset the game
function resetGame() {
  clearInterval(gameInterval);
  const overlay = document.getElementById("game-over-overlay");
  overlay.style.display = "none"; // Hide the overlay
  isPaused = true;
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  generateFood();
  drawSnake();
  drawFood();
}

document.getElementById("restart-btn").addEventListener("click", resetGame);

// Generate new food position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize)
  };
}

// Update the game
function updateGame() {
  if (!isPaused) {
    moveSnake();
    if (!checkCollision()) {
      drawSnake();
      drawFood();
    }
  }
}

// Start the game loop
// Start the game loop with a slower speed
function startGame() {
  clearInterval(gameInterval); // Clear any existing interval
  gameInterval = setInterval(updateGame, 300); // Increase interval to 500ms for slower movement
}


// Pause the game
function pauseGame() {
  isPaused = true;
}

// Resume the game
function resumeGame() {
  isPaused = false;
}

// Event listeners for controls
playButton.addEventListener("click", resumeGame);
playButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
resetButton.addEventListener("click", resetGame);

// Listen for key presses
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Initialize the game
function initializeGame() {
  createBoard();
  drawSnake();
  drawFood();
}

initializeGame();
startGame();
