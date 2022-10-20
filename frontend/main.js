"use strict";
// const packageName = require('./users.service');


function formLogin() {
    document.getElementById('button_login').classList.add('active');
    document.getElementById('button_register').classList.remove('active');
    document.getElementById('form_register').setAttribute('hidden', 'true');
    document.getElementById('form_login').removeAttribute('hidden');
}

function formRegister() {
    document.getElementById('button_login').classList.remove('active');
    document.getElementById('button_register').classList.add('active');
    document.getElementById('form_login').setAttribute('hidden', 'true');
    document.getElementById('form_register').removeAttribute('hidden');
}

function startGame() {

    paco('http://localhost:3000/', { answer: 42 })
        .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
        });



    let startButton = document.getElementById("startButton");
    startButton.remove();

    // Saves the canvas into a const variable
    const canvas = document.getElementById("leCanvas");

    let x;
    let y;
    let growthRate;
    let speed = 1;
    const difficulty = document.getElementById("difficulty");
    setDifficulty();

    canvas.setAttribute("width", x);
    canvas.setAttribute("height", y);
    const ctx = canvas.getContext("2d");
    const pScore = document.getElementById("score");
    const pHighScore = document.getElementById("highScore");

    let direction;
    let snakeBody = [[150, 150]]

    let score = 0;
    let highScore = localStorage.getItem("hScore");
    let alive;
    let foodEaten = false;
    let grow = 0;
    let foodPosition = [numberProcessor(Math.floor(Math.random() * x - 15)) + 15, numberProcessor(Math.floor(Math.random() * y + 15)) - 15];
    let valid_position = [];
    let p = 0;

    pHighScore.textContent = "High score: " + highScore;

    function setDifficulty() {
        switch (difficulty.value) {
            case "easy":
                speed = 1.6;
                growthRate = 1;
                x = 960;
                y = 540;
                break;
            case "medium":
                speed = 1;
                growthRate = 3;
                x = 1440;
                y = 810;
                break;
            case "hard":
                speed = 0.9;
                growthRate = 5;
                x = 1920;
                y = 1080;
                break;
            default:
                break;
        }
    }

    function numberProcessor(num) {
        return Math.round(num / 30) * 30;
    }

    // Depending on the direction variable, moves the snake accordingly
    function move() {
        switch (direction) {
            case "right":
                snakeBody.unshift([snakeBody[0][0] + 10 + 20, snakeBody[0][1]]);
                if (grow == 0) snakeBody.pop();
                if (grow >= 1) grow--;
                break;
            case "left":
                snakeBody.unshift([snakeBody[0][0] - 10 - 20, snakeBody[0][1]]);
                if (grow == 0) snakeBody.pop();
                if (grow >= 1) grow--;
                break;
            case "up":
                snakeBody.unshift([snakeBody[0][0], snakeBody[0][1] - 10 - 20]);
                if (grow == 0) snakeBody.pop();
                if (grow >= 1) grow--;
                break;
            case "down":
                snakeBody.unshift([snakeBody[0][0], snakeBody[0][1] + 10 + 20]);
                if (grow == 0) snakeBody.pop();
                if (grow >= 1) grow--;
                break;
            default:
                break;
        }
    }

    // Calls the majority of functions 
    function draw() {
        ctx.clearRect(0, 0, x, y);
        move();
        foodCollision();
        bodyCollision();
        borderCollision();
        drawBody();
        generateFood();
        drawGrid();
    }

    // Prints every snake part
    function drawBody() {
        snakeBody.forEach(coords => {
            ctx.beginPath();
            ctx.rect(coords[0], coords[1], 30, 30);
            ctx.fillStyle = "#33730C";
            ctx.fill();
            ctx.closePath();
        });
    }

    // Generetes the food coords at an empty spot
    function generateFood() {
        if (foodEaten !== false) {
            valid_position[0] = false;
            while (valid_position[0] == false) {
                foodPosition = [numberProcessor(Math.floor(Math.random() * x - 15)) + 15, numberProcessor(Math.floor(Math.random() * y + 15)) - 15];
                valid_position[1] = snakeBody.length;
                for (let i = 0; i < snakeBody.length; i++) {
                    if (foodPosition[0] - 15 == snakeBody[i][0] && foodPosition[1] - 15 == snakeBody[i][1]) {
                        valid_position[1]--;
                    }
                }
                if (valid_position[1] == snakeBody.length) {
                    valid_position[0] = true;
                }
            }
            foodEaten = false;
            grow = growthRate + grow;
        }
        drawFood()
    }

    // Generetes the food
    function drawFood() {
        ctx.beginPath();
        ctx.arc(foodPosition[0], foodPosition[1], 15, 0, Math.PI * 2, false);
        ctx.fillStyle = "#B91D1D";
        ctx.fill();
        ctx.closePath();
    }


    function drawGrid() {
        for (var i = 0; i <= x; i += 30) {
            ctx.moveTo(0.5 + i + p, p);
            ctx.lineTo(0.5 + i + p, y + p);
        }
        for (var i = 0; i <= y; i += 30) {
            ctx.moveTo(p, 0.5 + i + p);
            ctx.lineTo(x + p, 0.5 + i + p);
        }
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    // Add event listener on keydown
    document.addEventListener('keydown', (event) => {
        control(event.code);
    }, false);

    // Change direction var so the move() function knows what to do
    function control(key) {
        if ((key === "ArrowRight" || key === "KeyD") && direction != "left") {
            direction = "right";
        } else if ((key === "ArrowUp" || key === "KeyW") && direction != "down") {
            direction = "up";
        } else if ((key === "ArrowLeft" || key === "KeyA") && direction != "right") {
            direction = "left";
        } else if ((key === "ArrowDown" || key === "KeyS") && direction !== "up") {
            direction = "down";
        }
    }

    // Detects if the snake eats the food and increases the score
    function foodCollision() {
        if ((snakeBody[0][0] + 40 > foodPosition[0] && snakeBody[0][0] - 10 < foodPosition[0]) && (snakeBody[0][1] - 0 < foodPosition[1] && snakeBody[0][1] + 30 > foodPosition[1])) {
            foodEaten = true;
            score++;

            pScore.textContent = "Score: " + score;
            highScoreFunction();
        }
    }

    // If the head collides with the body, the game ends and an alerts pops up
    function bodyCollision() {
        for (let i = 1; i < snakeBody.length; i++) {
            if (snakeBody[0][0] == snakeBody[i][0] && snakeBody[0][1] == snakeBody[i][1]) {
                alive = false;
                alert("You died\nYou can't eat yourself to get bigger");
            }
        }
    }

    // If the head collides with a wall, the game ends and an alerts pops up
    function borderCollision() {
        if (snakeBody[0][0] < -10 || snakeBody[0][0] > (x - 10) || snakeBody[0][1] < -10 || snakeBody[0][1] > (y - 10)) {
            alive = false;
            alert("You died\nTry not to hug the walls");
        }
    }

    // Detects if the actual score is the highest recorded score, if it is, overrides the previous one
    function highScoreFunction() {
        if (localStorage.getItem("hScore")) {
            if (localStorage.getItem("hScore") < score) {
                localStorage.setItem('hScore', score);
                pHighScore.textContent = "High score: " + score;
            }
        } else {
            localStorage.setItem('hScore', score);
        }
    }

    // The button to reset the game
    document.getElementById("reset").addEventListener("click", function () {
        location.reload();
    });

    const interval = setInterval(function () {
        if (alive !== false) {
            draw();
        }
    }, 50 * speed);

}
