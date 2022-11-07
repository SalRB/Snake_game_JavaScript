"use strict";

window.onload = async load => {

    checkLocalStorage();

    document.getElementById('reset').setAttribute('hidden', 'true');

    // Gets all the users from the server
    const users = JSON.parse(await getUsers('http://localhost:3000/', { answer: 42 }))

    const [easyRanking, mediumRanking, hardRanking] = sortRankings(users);

    printRankings(easyRanking, mediumRanking, hardRanking);

    // Sorts the best scores of each difficulty
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
    const snakeColor = document.getElementById("snakeColor").value;
    document.getElementById("snakeColorDiv").setAttribute("hidden", "true");

    let direction;
    let snakeBody = [[150, 150]]

    let score = 0;
    let alive;
    let foodEaten = false;
    let grow = 0;
    let valid_position = [];
    let foodPosition = generateValidCoords(false);
    let p = 0;
    let walls = [];
    let wallPosition;
    let starCoords;

    // Depending on the chosen difficulty changes paramaters such as the speed, the scores per food eaten and the size increased per food eaten
    function setDifficulty() {
        switch (selectedDifficulty) {
            case "easy":
                speed = 1.7;
                growthRate = 1;
                scoregrowthRate = 1;
                x = 960;
                y = 540;
                break;
            case "medium":
                speed = 1.1;
                growthRate = 3;
                scoregrowthRate = 2;
                x = 1440;
                y = 810;
                break;
            case "hard":
                speed = 1.1;
                growthRate = 5;
                scoregrowthRate = 3;
                x = 1440;
                y = 810;
                break;
            default:
                break;
        }
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

        if (foodEaten !== false) {
            if (selectedDifficulty == "medium" || selectedDifficulty == "hard") {
                walls.push(generateValidCoords(true));
            }
            foodPosition = generateValidCoords(false);

            if (Math.floor(Math.random() * 4) == 3 && selectedDifficulty == "hard") {
                starCoords = generateValidCoords(false);
            }

            foodEaten = false;
            grow = growthRate + grow;
        }
        if (selectedDifficulty == "medium" || selectedDifficulty == "hard") {
            drawWall();
            wallCollision();
        }
        if (selectedDifficulty == "hard" && starCoords) {
            starCollision();
            drawStar(5, 17, 8);
        }

        drawFood();

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

    // Prints the food
    function drawFood() {
        ctx.beginPath();
        ctx.arc(foodPosition[0], foodPosition[1], 15, 0, Math.PI * 2, false);
        ctx.fillStyle = "#B91D1D";
        ctx.fill();
        ctx.closePath();
    }

    // Prints walls
    function drawWall() {
        walls.forEach(coords => {
            ctx.beginPath();
            ctx.rect(coords[0], coords[1], 30, 30);
            ctx.fillStyle = "#696969";
            ctx.fill();
            ctx.closePath();
        });
    }

    // Prints the star
    function drawStar(spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = starCoords[0];
        let y = starCoords[1];
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(starCoords[0], starCoords[1] - outerRadius)
        for (let i = 0; i < spikes; i++) {
            x = starCoords[0] + Math.cos(rot) * outerRadius;
            y = starCoords[1] + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y)
            rot += step

            x = starCoords[0] + Math.cos(rot) * innerRadius;
            y = starCoords[1] + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y)
            rot += step
        }
        ctx.lineTo(starCoords[0], starCoords[1] - outerRadius);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "#00ced1";
        ctx.fill();
    }

    // Prints a grid
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

    // Generates coords on an ampty tile 
    function generateValidCoords(isSquare) {
        let coords;
        valid_position[0] = false;
        while (valid_position[0] == false) {
            coords = [Math.round(Math.floor(Math.random() * x - 15) / 30) * 30, Math.round(Math.floor(Math.random() * y + 15) / 30) * 30];
            valid_position[1] = snakeBody.length;
            for (let i = 0; i < snakeBody.length; i++) {
                if ((coords[0] == snakeBody[i][0] && coords[1] - 30 == snakeBody[i][1]) || (coords[0] == snakeBody[i][0] && coords[1] == snakeBody[i][1])) {
                    valid_position[1]--;
                }
            }
            if (valid_position[1] == snakeBody.length) {
                valid_position[0] = true;
            }
        }
        if (isSquare == false) {
            coords[0] = coords[0] + 15;
            coords[1] = coords[1] - 15;
        }
        return coords;
    }

    // Detects if the snake eats the food and increases the score
    function foodCollision() {
        if ((snakeBody[0][0] + 40 > foodPosition[0] && snakeBody[0][0] - 10 < foodPosition[0]) && (snakeBody[0][1] - 0 < foodPosition[1] && snakeBody[0][1] + 30 > foodPosition[1])) {
            foodEaten = true;
            score = score + scoregrowthRate;

            pScore.textContent = "Score: " + score;
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

    // If the head collides with the border of the canvas, the game ends and an alerts pops up
    function borderCollision() {
        if (snakeBody[0][0] < -10 || snakeBody[0][0] > (x - 10) || snakeBody[0][1] < -10 || snakeBody[0][1] > (y - 10)) {
            gameOver("You died\nTry not to hug the walls");
        }
    }

    // If the head collides with a wall, the game ends and an alerts pops up
    function wallCollision() {
        for (let i = 0; i < walls.length; i++) {
            if (snakeBody[0][0] == walls[i][0] && snakeBody[0][1] == walls[i][1]) {
                gameOver("You died\nOops, you died, git gud");
            }
        }
    }

    // If the head collides with a star, score is increased but also is speed
    function starCollision() {
        if (snakeBody[0][0] == starCoords[0] - 15 && snakeBody[0][1] == starCoords[1] - 15) {
            starCoords = [];
            speed = speed * 0.97;
            score = score + 15;
            console.log(speed);
            clearInterval(interval)
            interval = setInterval(function () {
                if (alive !== false) {
                    draw();
                }
            }, 50 * speed);
        }
    }

    // The button to reset the game
    document.getElementById("reset").addEventListener("click", function () {
        location.reload();
    });

    //Prints the game over alert and sends a request to the server to check if the new score is higher than tehe previous one
    async function gameOver(message) {
        alive = false;
        alert(message);
        if (localStorage.getItem('usr')) {
            await updateScore('http://localhost:3000/score', { email: window.atob(localStorage.getItem('usr')), difficulty: selectedDifficulty, score: score });
        }
    }

    let interval = setInterval(function () {
        if (alive !== false) {
            draw();
        }
    }, 50 * speed);

}
