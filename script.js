const snakeContainer = document.getElementById('snakeContainer');
const gameScore = document.getElementById('gameScore');
const resetBtn = document.getElementById('resetBtn');

const gameHeight = 500;
const gameWidth = 700;
const squareSize = 50;
const rowCount = gameWidth / squareSize;
const colCount = gameHeight / squareSize;
const squareCount = rowCount * colCount;

const tick = 130;

snakeContainer.style.height = gameHeight + 'px';
snakeContainer.style.width = gameWidth + 'px';
fillSquares();

const squares = snakeContainer.querySelectorAll('div.square');

const foodHtml = '<i class="fas fa-apple-alt fa-2x"></i>';
const [UP, RIGHT, DOWN, LEFT] = [
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
];

const startingSquares = [0, 1, 2];

let keyPressed;
let direction;
let x;
let y;
let snake;
let emptySquares;
let food;
let score;
let interval;

document.addEventListener('keydown', (e) => {
  if ([UP, RIGHT, DOWN, LEFT].includes(e.key)) keyPressed = e.key;
});

resetBtn.addEventListener('click', () => {
  endGame();
  startGame();
});

startGame();

function startGame() {
  // Initiliaze game variables
  keyPressed = RIGHT;
  direction = RIGHT;
  x = 2;
  y = 0;
  snake = [];
  score = 0;

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

function updateGame() {
  moveSnake();
  renderGame();
}

function moveSnake() {
  let square = getIndex(x, y);
  if (snake.includes(square)) {
    endGame();
    return;
  }
  snake.unshift(square);
  emptySquares.delete(square);

  // Check if snake is on food
  if (square === food) {
    insertFood();
    score++;
  } else {
    emptySquares.add(snake.pop());
  }
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
      y--;
      break;
    case RIGHT:
      x++;
      break;
    case DOWN:
      y++;
      break;
    case LEFT:
      x--;
      break;
  }
  if (
    x < 0 ||
    y < 0 ||
    rowCount <= x ||
    colCount <= y ||
    emptySquares.size === 0
  ) {
    endGame();
  } else {
    updateGame();
  }
}

function renderGame() {
  squares.forEach((square) => {
    square.className = 'square';
    square.innerHTML = '';
  });

  snake.forEach((square) => squares[square].classList.add('snake'));
  squares[food].innerHTML = foodHtml;

  gameScore.textContent = score;
}

function fillSquares() {
  for (let i = 0; i < squareCount; i++) {
    const square = document.createElement('div');
    square.className = 'square';
    square.style.height = squareSize + 'px';
    square.style.width = squareSize + 'px';
    snakeContainer.appendChild(square);
  }
}

function getIndex(x, y) {
  return x + y * rowCount;
}
