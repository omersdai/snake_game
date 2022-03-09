const snakeContainer = document.getElementById('snakeContainer');
const gameScoreEl = document.getElementById('gameScore');
const bestScoreEl = document.getElementById('bestScore');
const resetBtn = document.getElementById('resetBtn');

const gameHeight = 550;
const gameWidth = 1000;
const squareSize = 25;
const rowCount = parseInt(gameWidth / squareSize);
const colCount = parseInt(gameHeight / squareSize);
const squareCount = rowCount * colCount;

const tick = 60;

snakeContainer.style.height = gameHeight + 'px';
snakeContainer.style.width = gameWidth + 'px';

const BEST_SCORE = 'snakeBestScore';
const foodHtml = '<i class="fas fa-apple-alt"></i>';
const [UP, RIGHT, DOWN, LEFT] = [
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
];

const actionMap = {
  ArrowUp: UP,
  ArrowRight: RIGHT,
  ArrowDown: DOWN,
  ArrowLeft: LEFT,
  w: UP,
  d: RIGHT,
  s: DOWN,
  a: LEFT,
};

const startingSquares = [0, 1, 2];

let squares;
let keyPressed;
let direction;
let x;
let y;
let snake;
let emptySquares;
let food;
let score;
let bestScore;
let interval;

document.addEventListener('keydown', (e) => {
  e.preventDefault(); // do not scroll window
  const action = actionMap[e.key];
  if ([UP, RIGHT, DOWN, LEFT].includes(action)) keyPressed = action;
  console.log(action);
});

resetBtn.addEventListener('click', () => {
  endGame();
  startGame();
});

function startGame() {
  // Reset game variables
  keyPressed = RIGHT;
  direction = RIGHT;
  x = 2;
  y = 0;
  snake = [];
  score = 0;
  bestScore = parseInt(localStorage.getItem(BEST_SCORE));

  emptySquares = new Set();
  for (let i = 0; i < squareCount; i++) emptySquares.add(i);

  startingSquares.forEach((square) => snake.unshift(square));
  snake.forEach((square) => emptySquares.delete(square));

  insertFood();
  renderGame();

  interval = setInterval(gameTick, tick);
}

function endGame() {
  clearInterval(interval);
}

function moveSnake(square) {
  snake.unshift(square);
  emptySquares.delete(square);

  // Check if snake is on food
  if (square === food) {
    insertFood();
    score++;
    if (bestScore < score) {
      bestScore = score;
      localStorage.setItem(BEST_SCORE, bestScore);
    }
  } else {
    emptySquares.add(snake.pop());
  }

  renderGame();
}

function insertFood() {
  if (emptySquares.size === 0) {
    // no more squares left, end of game
    food = null;
    return;
  }

  let idx = Math.floor(Math.random() * emptySquares.size);
  let i = 0;
  for (let s of emptySquares) {
    if (idx === i++) {
      food = s;
      break;
    }
  }
}

function gameTick() {
  // Check direction change
  if (
    (keyPressed === UP && direction !== DOWN) ||
    (keyPressed === RIGHT && direction !== LEFT) ||
    (keyPressed === DOWN && direction !== UP) ||
    (keyPressed === LEFT && direction !== RIGHT)
  ) {
    direction = keyPressed;
  }

  switch (direction) {
    case UP:
    case 'w':
      y--;
      break;
    case RIGHT:
    case 'd':
      x++;
      break;
    case DOWN:
    case 's':
      y++;
      break;
    case LEFT:
    case 'a':
      x--;
      break;
  }

  if (x < 0) x = rowCount - 1;
  if (y < 0) y = colCount - 1;
  if (rowCount <= x) x = 0;
  if (colCount <= y) y = 0;

  let square = getIndex(x, y);

  if (
    // x < 0 ||
    // y < 0 ||
    // rowCount <= x ||
    // colCount <= y ||
    snake.includes(square) ||
    emptySquares.size === 0
  ) {
    endGame();
  } else {
    moveSnake(square);
  }
}

function renderGame() {
  squares.forEach((square) => {
    square.className = 'square';
    square.innerHTML = '';
  });

  snake.forEach((square) => squares[square].classList.add('snake'));
  squares[food].innerHTML = foodHtml;

  gameScoreEl.innerText = score;
  bestScoreEl.innerText = bestScore;
}

function initializeGame() {
  for (let i = 0; i < squareCount; i++) {
    const square = document.createElement('div');
    square.className = 'square';
    square.style.height = squareSize + 'px';
    square.style.width = squareSize + 'px';
    snakeContainer.appendChild(square);
  }
  squares = snakeContainer.querySelectorAll('div.square');
  if (!localStorage.getItem(BEST_SCORE)) localStorage.setItem(BEST_SCORE, '0');

  startGame();
}

function getIndex(x, y) {
  return x + y * rowCount;
}

initializeGame();
