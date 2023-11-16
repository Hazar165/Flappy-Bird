let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d")

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();
let fly = new Audio();
let score_audio = new Audio()

bird.src = "img/bird.png";
bg.src = "img/back.png";
fg.src = "img/road.png";
pipeNorth.src = "img/pipeBottom.png";
pipeSouth.src = "img/pipeUp.png";
fly.src = "audio/fly.mp3"
score_audio.src = "audio/scor.mp3"

let gravity = 0.2;
let velY = 0;
let bX = 20;
let bY = 230;
let score = 0;
let bestScore = 0;
let gap = 110;
let pipe = [];
let pause;
pipe[0] = {
   x: cvs.width,
   y: 0
}
let constant;
let scoreText = document.getElementById('score');
let bestScoreText = document.getElementById('best_score');

function draw() {
   if (pause) {
      ctx.drawImage(bg, 0, 0);
      ctx.drawImage(bird, bX, bY);
      ctx.drawImage(fg, 0, cvs.height - fg.height);
      if (bY >= cvs.height - fg.height) {
         reload();
      }

      velY += gravity;
      bY += velY;

      for (let i = 0; i < pipe.length; i++) {
         if (pipe[i].x < -pipeSouth.width) {
            pipe.shift();
         } else {
            ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y + pipeSouth.height + gap);
            pipe[i].x -= 2;
            if (pipe[i].x == 80) {
               pipe.push({
                  x: cvs.width,
                  y: Math.floor(Math.random() * pipeSouth.height) - pipeSouth.height
               })
            }
         }
         if (bX + bird.width >= pipe[i].x &&
            bX <= pipe[i].x + pipeSouth.width &&
            (bY <= pipe[i].y + pipeSouth.height ||
               bY + bird.height >= pipe[i].y + pipeSouth.height + gap)) {
            reload();
         }
         if (pipe[i].x == 0) {
            score_audio.play();
            score++;
         }
      }
      ctx.drawImage(fg, 0, cvs.height - fg.height);
      scoreText.innerHTML = 'SCORE: ' + score;
      bestScoreText.innerHTML = 'BEST SCORE: ' + bestScore;
   } else {
      ctx.drawImage(bg, 0, 0);
      ctx.drawImage(bird, bX, bY);
      for (let i = 0; i < pipe.length; i++) {
         ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y);
         ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y + pipeSouth.height + gap);
      }
      ctx.drawImage(fg, 0, cvs.height - fg.height)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, cvs.width, cvs.height)
   }
}


function reload() {
   if (score > bestScore) {
      bestScore = score;
   }
   game_pause();
   bX = 20;
   bY = 230;
   velY = 0;
   score = 0;
   pipe = [];
   pipe[0] = {
      x: cvs.width,
      y: 0
   }
}

document.addEventListener("keydown", function (e) {
   if (e.code == 'ArrowUp') {
      moveUp();
   }
});

function moveUp() {
   velY = -4;
   fly.play();
}

function game_pause() {
   pause = !pause;
}

setInterval(draw, 20)
