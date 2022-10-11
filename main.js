"use strict";

window.onload = load => {

    // Saves the canvas into a const variable
    const canvas = document.getElementById("leCanvas");
    const ctx = canvas.getContext("2d");
    const pScore = document.getElementById("score");
    const pHighScore = document.getElementById("highScore");
    const difficulty = document.getElementById("difficulty");

    let x = canvas.width;
    let y = canvas.height;
    let direction;
    let snakeBody = [[150, 150]]

    let growthRate;
    let score = 0;
    let highScore = localStorage.getItem("hScore");
    let speed = 1;
    let alive;
    let foodEaten = false;
    let grow;
    let foodPosition = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];;
    let p = 10;

    pHighScore.textContent = "High score: " + highScore;
    changeDifficulty();
    function changeDifficulty() {
        console.log(difficulty.value);

        switch (difficulty.value) {
            case "easy":
                speed = 1.5;
                growthRate = 1;
                break;
            case "medium":
                speed = 1;
                growthRate = 3;
                break;
            case "hard":
                speed = 0.9;
                growthRate = 5;
                break;
            default:
                break;
        }
    }

    // Depending on the direction variable, moves the snake accordingly
    function move() {
        switch (direction) {
            case "right":
                snakeBody.unshift([snakeBody[0][0] + 10 + 21, snakeBody[0][1]]);
                if (grow !== true) snakeBody.pop(); grow = false;
                break;
            case "left":
                snakeBody.unshift([snakeBody[0][0] - 10 - 21, snakeBody[0][1]]);
                if (grow !== true) snakeBody.pop(); grow = false;
                break;
            case "up":
                snakeBody.unshift([snakeBody[0][0], snakeBody[0][1] - 10 - 21]);
                if (grow !== true) snakeBody.pop(); grow = false;
                break;
            case "down":
                snakeBody.unshift([snakeBody[0][0], snakeBody[0][1] + 10 + 21]);
                if (grow !== true) snakeBody.pop(); grow = false;
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
        drawFood();
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

    // Generetes the food at a random spot
    function drawFood() {
        if (foodEaten !== false) {
            foodPosition = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];
            foodEaten = false;
            grow = true;
        }

        ctx.beginPath();
        ctx.arc(foodPosition[0], foodPosition[1], 20, 0, Math.PI * 2, false);
        ctx.fillStyle = "#B91D1D";
        ctx.fill();
        ctx.closePath();
    }

    function drawGrid() {
        // for (var i = 0; i <= x; i += 40) {
        //     ctx.moveTo(0.5 + i + p, p);
        //     ctx.lineTo(0.5 + i + p, y + p);
        // }

        // for (var i = 0; i <= y; i += 40) {
        //     ctx.moveTo(p, 0.5 + i + p);
        //     ctx.lineTo(x + p, 0.5 + i + p);
        // }
        // ctx.strokeStyle = "black";
        // ctx.stroke();
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
        if ((snakeBody[0][0] + 40 > foodPosition[0] && snakeBody[0][0] - 10 < foodPosition[0]) && (snakeBody[0][1] - 0 < foodPosition[1] && snakeBody[0][1] + 50 > foodPosition[1])) {
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
        if (snakeBody[0][0] < -10 || snakeBody[0][0] > 1910 || snakeBody[0][1] < -10 || snakeBody[0][1] > 1050) {
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
