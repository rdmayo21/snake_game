const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score-value');

const gridSize = 20;
const tileCount = 20;
canvas.width = canvas.height = gridSize * tileCount;

let snake = [
    {x: 10, y: 10},
];
let food = getRandomFood();
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 200; // Initial game speed (lower is faster)
const minGameSpeed = 50; // Minimum game speed (maximum speed)
const speedIncrease = 10; // Amount to decrease the interval by for each point

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    }
}

function drawGame() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = getRandomFood();
        // Increase game speed (decrease interval) with each point
        gameSpeed = Math.max(minGameSpeed, gameSpeed - speedIncrease);
        clearInterval(gameLoop);
        gameLoop = setInterval(drawGame, gameSpeed);
        console.log("New game speed:", gameSpeed); // Log the new speed for debugging
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = 'blue';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    food = getRandomFood();
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 200; // Reset game speed to initial value
    clearInterval(gameLoop);
    gameLoop = setInterval(drawGame, gameSpeed);
}

function updateScore() {
    scoreElement.textContent = score;
}

let gameLoop = setInterval(drawGame, gameSpeed);
