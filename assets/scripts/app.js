const playBoard = document.querySelector(".play__board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high__score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX;
let foodY;
let snakeX = 5;
let snakeY = 10;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.textContent = `High Score: ${highScore}`;

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const gameOverHandler = () => {
  clearInterval(setIntervalId);
  alert(`Game Over! Press Ok to replay...`);
  location.reload();
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowDown" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  } else if (e.key === "ArrowLeft" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowRight" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  }
  initGame();
};

controls.forEach((key) => {
  key.addEventListener("click", () =>
    changeDirection({ key: key.dataset.key })
  );
});

const initGame = () => {
  if (gameOver) return gameOverHandler();
  let htmlMarkup = `<div class="food" style="grid-area:${foodX} / ${foodY}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area:${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][0] === snakeBody[i][0] &&
      snakeBody[0][1] === snakeBody[i][1]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};

document.addEventListener("keydown", changeDirection);

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
initGame();
