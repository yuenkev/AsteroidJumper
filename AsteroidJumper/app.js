document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const ship = document.createElement("div");
  let shipLeftSpace = 50;
  let startPoint = 150;
  let shipBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
      console.log(platforms);
    }
  }

  function movePlatforms() {
    if (shipBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";

        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove("platform");
          platforms.shift();
          score++;
          console.log(platforms);
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function createship() {
    grid.appendChild(ship);
    ship.classList.add("ship");
    shipLeftSpace = platforms[0].left;
    ship.style.left = shipLeftSpace + "px";
    ship.style.bottom = shipBottomSpace + "px";
  }

  function fall() {
    isJumping = false;
    clearInterval(upTimerId);
    downTimerId = setInterval(function () {
      shipBottomSpace -= 2;
      ship.style.bottom = shipBottomSpace + "px";
      if (shipBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          shipBottomSpace >= platform.bottom &&
          shipBottomSpace <= platform.bottom + 15 &&
          shipLeftSpace + 60 >= platform.left &&
          shipLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          console.log("landed");
          startPoint = shipBottomSpace;
          jump();
          isJumping = true;
        }
      });
    }, 20);
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      shipBottomSpace += 10;
      ship.style.bottom = shipBottomSpace + "px";
      if (shipBottomSpace > startPoint + 200) {
        fall();
        isJumping - false;
      }
    }, 30);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (shipLeftSpace <= 340) {
        shipLeftSpace += 5;
        ship.style.left = shipLeftSpace + "px";
      } else moveLeft();
    }, 20);
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (shipLeftSpace >= 0) {
        shipLeftSpace -= 5;
        ship.style.left = shipLeftSpace + "px";
      } else moveRight();
    }, 20);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function control(event) {
    if (event.key === "ArrowLeft") {
      //move left
      moveLeft();
    } else if (event.key === "ArrowRight") {
      //move right
      moveRight();
    } else if (event.key === "ArrowUp") {
      //move straight
      moveStraight();
    }
  }

  function gameOver() {
    console.log("game over");
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createship();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener("keyup", control);
    }
  }

  //attach to button
  start();
});
