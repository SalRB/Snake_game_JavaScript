"use strict";

window.onload = async load => {

    checkLocalStorage();

    document.getElementById('reset').setAttribute('hidden', 'true');

    // getUsers('http://localhost:3000/', { answer: 42 })
    //     .then((data) => {
    //         users = JSON.parse(data);
    //         loadRankings();
    //     });

    const users = JSON.parse(await getUsers('http://localhost:3000/', { answer: 42 }))

    const [easyRanking, mediumRanking, hardRanking] = sortRankings(users);

    printRankings(easyRanking, mediumRanking, hardRanking);

    function sortRankings(array) {
        let easy = [];
        let medium = [];
        let hard = [];

        array.forEach(element => {
            const scores = element.score;
            easy = [...easy, { username: element.username, score: element.score.easy }]
            medium = [...medium, { username: element.username, score: element.score.medium }]
            hard = [...hard, { username: element.username, score: element.score.hard }]
        });

        easy.sort((first, next) => (first.score > next.score) ? -1 : ((first.score < next.score) ? 1 : 0));
        medium.sort((first, next) => (first.score > next.score) ? -1 : ((first.score < next.score) ? 1 : 0));
        hard.sort((first, next) => (first.score > next.score) ? -1 : ((first.score < next.score) ? 1 : 0));
        return [easy, medium, hard];

    }
}

function startGame() {

    document.getElementById('reset').removeAttribute('hidden', 'true');
    let startButton = document.getElementById("startButton");
    startButton.remove();

    // Saves the canvas into a const variable
    const canvas = document.getElementById("leCanvas");

    let x;
    let y;
    let growthRate;
    let speed = 1;
    const difficulty = document.getElementById("difficulty");
    const selectedDifficulty = difficulty.value;

    let scoregrowthRate;
    setDifficulty();

    canvas.setAttribute("width", x);
    canvas.setAttribute("height", y);
    const ctx = canvas.getContext("2d");
    const pScore = document.getElementById("score");
    // const pHighScore = document.getElementById("highScore");
    const snakeColor = document.getElementById("snakeColor").value;
    document.getElementById("snakeColorDiv").setAttribute("hidden", "true");

    let direction;
    let snakeBody = [[150, 150]]

    let score = 0;
    // let highScore = localStorage.getItem("hScore");
    let alive;
    let foodEaten = false;
    let grow = 0;
    let foodPosition = [numberProcessor(Math.floor(Math.random() * x - 15)) + 15, numberProcessor(Math.floor(Math.random() * y + 15)) - 15];
    let valid_position = [];
    let p = 0;
    let walls = [];
    let wallPosition;

    // pHighScore.textContent = "High score: " + highScore;

    function setDifficulty() {
        switch (selectedDifficulty) {
            case "easy":
                speed = 1.6;
                growthRate = 1;
                scoregrowthRate = 1;
                x = 960;
                y = 540;
                break;
            case "medium":
                speed = 1;
                growthRate = 3;
                scoregrowthRate = 2;
                x = 1440;
                y = 810;
                break;
            case "hard":
                speed = 0.9;
                growthRate = 5;
                scoregrowthRate = 3;
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
        if (selectedDifficulty == "medium" || selectedDifficulty == "hard") {
            generateWall();
            wallCollision();
        }
        if (selectedDifficulty == "hard") {
            drawStar(285, 285, 5, 17, 8);
            // drawStar(285, 285, 5, 30, 15);
        }
        generateFood();
        drawGrid();
    }

    // Prints every snake part
    function drawBody() {
        snakeBody.forEach(coords => {
            ctx.beginPath();
            ctx.rect(coords[0], coords[1], 30, 30);
            ctx.fillStyle = snakeColor;
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

    function generateWall() {
        if (foodEaten !== false) {
            valid_position[0] = false;
            while (valid_position[0] == false) {
                wallPosition = [numberProcessor(Math.floor(Math.random() * x - 15)), numberProcessor(Math.floor(Math.random() * y + 15))];
                valid_position[1] = snakeBody.length;
                for (let i = 0; i < snakeBody.length; i++) {
                    if (wallPosition[0] - 15 == snakeBody[i][0] && wallPosition[1] - 15 == snakeBody[i][1]) {
                        valid_position[1]--;
                    }
                }
                if (valid_position[1] == snakeBody.length) {
                    valid_position[0] = true;
                }
            }
            walls.push(wallPosition);
        }
        drawWall()
    }

    function drawWall() {
        walls.forEach(coords => {
            ctx.beginPath();
            ctx.rect(coords[0], coords[1], 30, 30);
            ctx.fillStyle = "#696969";
            ctx.fill();
            ctx.closePath();
        });
    }

    function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        var rot = Math.PI / 2 * 3;
        var x = cx;
        var y = cy;
        var step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius)
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y)
            rot += step

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y)
            rot += step
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        // ctx.lineWidth = 5;
        // ctx.strokeStyle = 'blue';
        ctx.stroke();
        ctx.fillStyle = "#00ced1";
        ctx.fill();
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
            score = score + scoregrowthRate;

            pScore.textContent = "Score: " + score;
            highScoreFunction();
        }
    }

    // If the head collides with the body, the game ends and an alerts pops up
    function bodyCollision() {
        for (let i = 1; i < snakeBody.length; i++) {
            if (snakeBody[0][0] == snakeBody[i][0] && snakeBody[0][1] == snakeBody[i][1]) {
                gameOver("You died\nYou can't eat yourself to get bigger");
            }
        }
    }

    // If the head collides with a wall, the game ends and an alerts pops up
    function borderCollision() {
        if (snakeBody[0][0] < -10 || snakeBody[0][0] > (x - 10) || snakeBody[0][1] < -10 || snakeBody[0][1] > (y - 10)) {
            gameOver("You died\nTry not to hug the walls");
        }
    }

    function wallCollision() {
        for (let i = 0; i < walls.length; i++) {
            if (snakeBody[0][0] == walls[i][0] && snakeBody[0][1] == walls[i][1]) {
                gameOver("You died\nOops, you died, git gud");
            }
        }
    }

    // Detects if the actual score is the highest recorded score, if it is, overrides the previous one
    function highScoreFunction() {
        // if (localStorage.getItem("hScore")) {
        //     if (localStorage.getItem("hScore") < score) {
        //         localStorage.setItem('hScore', score);
        //         pHighScore.textContent = "High score: " + score;
        //     }
        // } else {
        //     localStorage.setItem('hScore', score);
        // }
    }

    // The button to reset the game
    document.getElementById("reset").addEventListener("click", function () {
        location.reload();
    });

    async function gameOver(message) {
        alive = false;
        alert(message);
        if (localStorage.getItem('usr')) {
            console.log(await updateScore('http://localhost:3000/score', { email: window.atob(localStorage.getItem('usr')), difficulty: selectedDifficulty, score: score }));
        }
    }


    const interval = setInterval(function () {
        if (alive !== false) {
            draw();
        }
    }, 50 * speed);

}
