import { Ground } from './ground.js';
import { Sky } from './sky.js';
import { MountainsLow } from './mountainsLow.js';
import { MountainsHigh } from './mountainsHigh.js';
import { Runner } from './madara.js';
// import { Attack } from './attack.js';
import { Enemies } from './enemies.js';

window.onload = init;

let ctx;
let delta;
let previousTime;

let speed;
let speedFactor = 2.5;
let BASE_SPEED = 16;

let sky;
let mountainsHigh;
let mountainsLow;
let ground;
let runner;
// let attack;
let enemies;

function init() {
    let canvas = document.getElementById("my-canvas");

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

        sky = new Sky(ctx);
        sky.load(loaded);

        mountainsHigh = new MountainsHigh(ctx);
        mountainsHigh.load(loaded);

        mountainsLow = new MountainsLow(ctx);
        mountainsLow.load(loaded);

        ground = new Ground(ctx);
        ground.load(loaded);

        runner = new Runner(ctx);
        runner.load(loaded);

        // attack = new Attack(ctx);
        // attack.load(loaded);

        enemies = new Enemies(ctx);
        enemies.load(loaded);

        document.body.onkeydown = function (e) {
            if (e.keyCode == 32) {
                handleUserAction();
            }
        };

        // document.body.onkeyup = function (e) {
        //     if (e.keyCode == 86) {
        //         handleAttack();
        //     }
        // }

        loadAudio();

        canvas.onclick = handleUserAction;

    } else {
        alert("Canvas is not supported.");
    }
}

let loaderCounter = 0;

function loaded() {

    loaderCounter++;

    if (loaderCounter < 6)
        return;

    previousTime = performance.now();
    window.requestAnimationFrame(main);

}

let running = false;

function main(currentTime) {

    if (running) {
        window.requestAnimationFrame(main);
    }

    delta = parseInt(currentTime - previousTime);
    speed = Math.abs(speedFactor * delta / BASE_SPEED);

    clearCanvas();
    update();
    draw();
    showStats();

    previousTime = currentTime;

    if (speed < 10) {
        speedFactor += 0.002;
    }

}

function clearCanvas() {
    let linearGradient = ctx.createLinearGradient(ctx.canvas.width / 2, 0, ctx.canvas.width / 2, ctx.canvas.height);
    linearGradient.addColorStop(0, '#5078F2');
    linearGradient.addColorStop(0.5, '#EFE9F4');
    linearGradient.addColorStop(1, '#5078F2');
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


function update() {
    sky.update(speed);
    mountainsHigh.update(speed);
    mountainsLow.update(speed);
    ground.update(speed);
    runner.update(speed);
    // attack.update(speed);
    enemies.update(speed);

    detectCollision();
}


function draw() {
    sky.draw();
    mountainsHigh.draw();
    mountainsLow.draw();
    ground.draw();
    runner.draw();
    // attack.draw();
    enemies.draw();

    if (running) {
        drawScore();
    }

    if (isGameOver) {
        gameOver();
    }
}

let score = 0;

function showStats() {
    let fpsSpan = document.getElementById("fps");
    let speedSpan = document.getElementById("speed");
    let fps;
    if (delta != 0) {
        fps = parseInt(1000 / delta);
    }
    fpsSpan.innerHTML = fps;
    speedSpan.innerHTML = speed.toFixed(1);
    drawScore();
}

function drawScore() {
    score += speed;
    let scoreSpan = document.getElementById("score");
    let scoreText = "Score: " + parseInt(score);
    scoreSpan.innerHTML = scoreText;
}
function handleUserAction() {
    if (isGameOver) {
        resetGame();
        isGameOver = false;
    } else if (!running) {
        running = true;
        window.requestAnimationFrame(main);
        runner.startRunning();
        startSound.play();
    } else {
        if (runner.jump()) {
            jumpSound.play();
        }
    }
}

// function handleAttack() {
//     if (!running) {
//         running = true;     
//         window.requestAnimationFrame(main);
//         runner.startRunning();
//     } else {
//         runner.attack();
//         attackSound.play();
//         setTimeout(() => {
//             runner.stopRunning();
//             runner.startRunning();
//         }, 800 / speed);
//     }

//     let text = document.createElement("div");
//     text.innerHTML = "KATON!";
//     text.style.position = "absolute";
//     text.style.top = runner.Sprite.Destination.y + 20 + 'px';
//     text.style.left = runner.Sprite.Destination.x + runner.Sprite.Destination.width * 3.1 + 'px';
//     text.style.transform = "translateX(-50%)";
//     text.style.color = "black";
//     text.style.fontSize = "1.6vw";
//     text.style.fontFamily = "Luckiest Guy";
//     document.body.appendChild(text);
//     setTimeout(() => {
//         document.body.removeChild(text);
//     }, 1000 / speed);

// }

let isGameOver = false;

function detectCollision() {

    for (let i = 0; i < enemies.list.length; i++) {
        if (enemies.list[i].isActive) {

            let circle1 = {
                radius: runner.Sprite.Destination.width * 0.4,
                x: runner.Sprite.Destination.x + runner.Sprite.Destination.width / 2,
                y: runner.Sprite.Destination.y + runner.Sprite.Destination.height / 2
            };
            let circle2 = {
                radius: enemies.list[i].width * 0.4,
                x: enemies.list[i].x + enemies.list[i].width / 2,
                y: enemies.list[i].y + enemies.list[i].height / 2
            };

            var dx = circle1.x - circle2.x;
            var dy = circle1.y - circle2.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < circle1.radius + circle2.radius) {
                isGameOver = true;
            }

        }
    }
}


function gameOver() {

    endSound.play();
    startSound.stop();

    running = false;

    ctx.font = 'bold 80px Luckiest Guy';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 40;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeText('Game Over', ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText('Game Over', ctx.canvas.width / 2, ctx.canvas.height / 2);

}

let startSound;
let jumpSound;
let endSound;
// let attackSound;


function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");

    this.play = function () {
        this.sound.play();
    }

    this.stop = function () {
        this.sound.pause();
    }
}

function loadAudio() {
    startSound = new Sound('sounds/backg.wav');
    jumpSound = new Sound('sounds/jump.wav');
    endSound = new Sound('sounds/fail.wav');
    // attackSound = new Sound('sounds/katon.wav');
}

function resetGame() {
    running = false;
    isGameOver = true;
    score = 0;
    speedFactor = 2.5;
    enemies.reset();
    previousTime = performance.now();
}