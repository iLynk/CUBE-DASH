// BOARD
const board = document.getElementById("board");
const boardWidth = window.innerWidth / 1.4;
const boardHeight = window.innerHeight / 1.6;
const imagePaths = [
  "/background/lvl1Background.png",
  "/background/lvl2Background.png",
  "/background/lvl3Background.png",
  "/background/lvl4Background.png",
  // Ajoutez ici tous les chemins d'accès aux images que vous souhaitez précharger
];
let context;

// DINO
let dinoWidth = 80;
let dinoHeight = 90;
let dinoX = 100;
let dinoY = boardHeight - 90;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

// SCORE
const startGameButton = document.querySelector("#startGame");
const scoreDisplay = document.querySelector("#score");
const finalScoreDisplay = document.querySelector("#final-score");
const highScoreDisplay = document.querySelector("#highscore");
let count = 0;
let highScore = 0;

// OBSTACLES
let obstacleArray = [];

let obstacle1Width = 34;
let obstacle2Width = 69;
let obstacle3Width = 102;

let obstacleHeight = 70;
let obstacleX = boardWidth;
let obstacleY = boardHeight - obstacleHeight;

let obstacle1Img;
let obstacle2Img;
let obstacle3Img;

// PHYSIQUE
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOverState = false;

const worldTheme = document.querySelector("#world");

const startGame = () => {
  dinoImg1.src = "./sprite/dino1.png";
  dinoImg2.src = "./sprite/dino2.png";
  dinoImg3.src = "./sprite/dino3.png";
  dinoDuck1.src = "./sprite/dino-duck1.png";
  dinoDuck2.src = "./sprite/dino-duck2.png";
  worldTheme.currentTime = 0;
  battleTheme1.currentTime = 0;
  gusty.currentTime = 0;
  final.currentTime = 0;
  newRecord.pause();
  gameOverDisplay.classList.add("invisible");
  worldTheme.volume = 0.05;
  worldTheme.play();
  gameOverState = false;
  count = 0;
  scoreDisplay.classList.remove("invisible");
  board.classList.remove("invisible");
  startGameButton.classList.add("invisible");
  board.height = boardHeight;
  board.width = boardWidth;
  velocityX = -8;

  context = board.getContext("2d");

  dinoImg = new Image();
  dinoImg.src = "./sprite/dino1.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  obstacle1Img = new Image();
  obstacle1Img.src = "./imgs/cactus1.png";

  obstacle2Img = new Image();
  obstacle2Img.src = "./imgs/cactus2.png";

  obstacle3Img = new Image();
  obstacle3Img.src = "./imgs/cactus3.png";

  requestAnimationFrame(update);
  if (obstacleInterval) {
    clearInterval(obstacleInterval);
  }
  clearInterval(dinoImageChangeInterval);
  clearInterval(dinoDuckImageChangeInterval);
  obstacleInterval = setInterval(placeObstacles, 1300);
};

let updateRAF;
let obstacleInterval;
const gameOverDisplay = document.querySelector("#gameOver");

const deathSound = document.querySelector("#death");
const newRecord = document.querySelector("#newRecord");

const gameOver = () => {
  board.style.backgroundImage = 'url("/background/lvl1Background.png")';
  gameOverDisplay.classList.remove("invisible");
  gusty.pause();
  battleTheme1.pause();
  worldTheme.pause();
  final.pause();
  clearInterval(scoreInterval);
  clearInterval(obstacleInterval);
  cancelAnimationFrame(updateRAF);
  obstacleArray.length = 0;
  let finalScore = count;

  if (finalScore > highScore) {
    newRecord.volume = 0.05;
    newRecord.play();
    highScore = finalScore;
    highScoreDisplay.textContent = `YOUR HIGHSCORE : ${highScore}`;
  } else {
    deathSound.volume = 0.02;
    deathSound.play();
  }

  finalScoreDisplay.textContent = `YOUR FINAL SCORE IS : ${finalScore}`;
  scoreDisplay.classList.add("invisible");
  board.classList.add("invisible");
  startGameButton.classList.remove("invisible");

  clearInterval(dinoImageChangeInterval);
  clearInterval(dinoDuckImageChangeInterval);
};

function update() {
  updateRAF = requestAnimationFrame(update);
  if (gameOverState) {
    console.log("lose");
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y so it doesn't exceed the ground
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  //obstacle
  for (let i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
    obstacle.x += velocityX; //moves the obstacles substracting his x poition
    context.drawImage(
      obstacle.img,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );

    if (checkCollision(dino, obstacle)) {
      gameOverState = true;
      //dinoImg.src = "./imgs/dino-dead.png";
      gameOver();
      dinoImg.onlad = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }
}

function placeObstacles() {
  if (gameOverState) {
    return;
  }

  let obstacle = {
    img: null,
    x: obstacleX,
    y: obstacleY,
    width: null,
    height: obstacleHeight,
  };

  let placeObstacleChance = Math.random();

  if (placeObstacleChance > 0.75) {
    obstacle.img = obstacle3Img;
    obstacle.width = obstacle3Width;
    obstacleArray.push(obstacle);
  } else if (placeObstacleChance > 0.45) {
    obstacle.img = obstacle2Img;
    obstacle.width = obstacle2Width;
    obstacleArray.push(obstacle);
  } else if (placeObstacleChance > 0.15) {
    obstacle.img = obstacle1Img;
    obstacle.width = obstacle1Width;
    obstacleArray.push(obstacle);
  }
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// SCORE
const battleTheme1 = document.querySelector("#battle1");
const gusty = document.querySelector("#gusty");
const final = document.querySelector("#final");

const score = () => {
  scoreInterval = setInterval(() => {
    switch (count) {
      case 150:
        board.style.backgroundImage = 'url("/background/lvl2Background.png")';
        worldTheme.pause();
        gusty.volume = 0.03;
        gusty.play();
        velocityX = -10;
        clearInterval(obstacleInterval);
        obstacleInterval = setInterval(placeObstacles, 900);
        break;

      case 300:
        board.style.backgroundImage = 'url("/background/lvl3Background.png")';
        gusty.pause();
        battleTheme1.volume = 0.05;
        battleTheme1.play();
        velocityX = -13;
        clearInterval(obstacleInterval);
        obstacleInterval = setInterval(placeObstacles, 800);
        break;

      case 500:
        board.style.backgroundImage = 'url("/background/lvl4Background.png")';
        dinoImg1.src = "./sprite/grr.png";
        dinoImg2.src = "./sprite/grr2.png";
        dinoImg3.src = "./sprite/grr3.png";
        dinoDuck1.src = "./sprite/grr-duck1.png";
        dinoDuck2.src = "./sprite/grr-duck2.png";
        battleTheme1.pause();
        final.volume = 0.05;
        final.play();
        velocityX = -16;
        clearInterval(obstacleInterval);
        obstacleInterval = setInterval(placeObstacles, 600);
        break;

      default:
        break;
    }
    scoreDisplay.textContent = `YOUR SCORE : ${count}`;
    count++;
  }, 90);
};

document.addEventListener("DOMContentLoaded", () => {
  preloadImages().then(() => {
    // Toutes les images sont chargées, vous pouvez commencer le jeu ici.
    startGameButton.addEventListener("click", () => {
      document.addEventListener("keydown", (e) => {
        console.log("keydown event");
        moveDino(e);
      });
      score();
      startGame();
    });
  });
});

// ANIMATION DINO
let dinoImg1, dinoImg2, dinoImg3;

dinoImg1 = new Image();
dinoImg1.src = "./sprite/dino1.png";

dinoImg2 = new Image();
dinoImg2.src = "./sprite/dino2.png";

dinoImg3 = new Image();
dinoImg3.src = "./sprite/dino3.png";

dinoDuck1 = new Image();
dinoDuck1.src = "./sprite/dino-duck1.png";

dinoDuck2 = new Image();
dinoDuck2.src = "./sprite/dino-duck2.png";

const dinoImages = [dinoImg1, dinoImg2, dinoImg3];
const dinoDuckImages = [dinoDuck1, dinoDuck2];

let currentDinoImageIndex = 0;
let dinoImageChangeInterval;

function changeDinoImage() {
  currentDinoImageIndex = (currentDinoImageIndex + 1) % dinoImages.length;
  dinoImg = dinoImages[currentDinoImageIndex];
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

let currentDinoDuckImageIndex = 0;
let dinoDuckImageChangeInterval;

const changeDinoDuckImage = () => {
  clearInterval(dinoImageChangeInterval);
  currentDinoDuckImageIndex =
    (currentDinoDuckImageIndex + 1) % dinoDuckImages.length;
  dinoImg = dinoDuckImages[currentDinoDuckImageIndex];
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
};

let isJumping = false;
let isDucking = false;

// Saut du Dino
function moveDino(e) {
  if (gameOverState) {
    return;
  }
  animateDino();

  if ((e.key === " " || e.key === "ArrowUp") && dino.y === dinoY) {
    jump();
  }
  if (e.key === "ArrowDown") {
    velocityY += 6;
    duck();
  }
}

// Fonction pour gérer l'animation du dino
function animateDino() {
  if (isJumping) {
    // Gérez l'animation du saut ici
    currentDinoImageIndex = (currentDinoImageIndex + 1) % dinoImages.length;
    dinoImg = dinoImages[currentDinoImageIndex];
  } else if (isDucking) {
    // Gérez l'animation de l'accroupissement ici
    currentDinoDuckImageIndex =
      (currentDinoDuckImageIndex + 1) % dinoDuckImages.length;
    dinoImg = dinoDuckImages[currentDinoDuckImageIndex];
  } else {
    // Gérez l'animation par défaut ici
    currentDinoImageIndex = (currentDinoImageIndex + 1) % dinoImages.length;
    dinoImg = dinoImages[currentDinoImageIndex];
  }

  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

// Fonction pour gérer le saut du dino
function jump() {
  if (gameOverState) {
    return;
  }
  if (dino.y === dinoY) {
    clearInterval(dinoDuckImageChangeInterval);
    isJumping = true;
    isDucking = false;

    const jumpSound = document.querySelector("#jump");
    jumpSound.volume = 0.003;
    jumpSound.play();
    velocityY = -12;

    // Réinitialisez l'animation de l'accroupissement
    currentDinoDuckImageIndex = 0;

    // Lancez l'animation du saut
    dinoImageChangeInterval = setInterval(animateDino, 100);
  }
}

// Fonction pour gérer l'accroupissement du dino
function duck() {
  if (gameOverState) {
    return;
  }
  isDucking = true;
  isJumping = false;

  // Réinitialisez l'animation du saut
  clearInterval(dinoImageChangeInterval);

  // Lancez l'animation de l'accroupissement
  dinoDuckImageChangeInterval = setInterval(animateDino, 100);
}

const loadedImages = [];

function preloadImages() {
  const imagePromises = imagePaths.map((path) => {
    const img = new Image();
    img.src = path;

    return new Promise((resolve) => {
      img.onload = () => {
        loadedImages.push(img);
        resolve(img);
      };
    });
  });

  return Promise.all(imagePromises);
}
