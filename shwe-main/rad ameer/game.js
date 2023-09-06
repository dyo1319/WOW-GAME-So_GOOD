document.addEventListener("DOMContentLoaded", function () {
  const roadContainer = document.getElementById("road-container");
  const maxArea = document.getElementById("max-area");
  const car = document.getElementById("car");
  let maxAreaWidth = maxArea.offsetWidth;
  let maxAreaHeight = maxArea.offsetHeight;
  let carXPosition = maxAreaWidth / 2 - car.offsetWidth / 2;
  let carYPosition = 0;
  const carSpeed = 2;
  const CarSidesSpeed = 1.5;
  let enemyCarSpeed = 5;
  const keysPressed = {
    a: false,
    d: false,
    w: false,
    s: false,
  };

  let gameOver = false;

  function updateGameDimensions() {
    maxAreaWidth = maxArea.offsetWidth;
    maxAreaHeight = maxArea.offsetHeight;
    carXPosition = Math.max(0, Math.min(maxAreaWidth - car.offsetWidth, carXPosition));
    carYPosition = Math.max(0, Math.min(maxAreaHeight - car.offsetHeight, carYPosition));
  }
  updateGameDimensions();
  window.addEventListener("resize", updateGameDimensions);

  function updateCarPosition() {
    let deltaX = 0;
    let deltaY = 0;

    if (keysPressed["a"]) {
      deltaX -= CarSidesSpeed;
    }
    if (keysPressed["d"]) {
      deltaX += CarSidesSpeed;
    }
    if (keysPressed["w"]) {
      deltaY += carSpeed;
    }
    if (keysPressed["s"]) {
      deltaY -= carSpeed;
    }
    carXPosition += deltaX;
    carYPosition += deltaY;
    carXPosition = Math.max(0, Math.min(maxAreaWidth - car.offsetWidth, carXPosition));
    carYPosition = Math.max(0, Math.min(maxAreaHeight - car.offsetHeight, carYPosition));
    car.style.left = carXPosition + "px";
    car.style.bottom = carYPosition + "px";
  }
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (keysPressed[key] === false) {
      keysPressed[key] = true;
    }
  });
  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    keysPressed[key] = false;
  });
  function animateCar() {
    if (!gameOver) { // Check if the game is not over
      updateCarPosition();
      handleCollisions();
      handleBoxCollision();
      requestAnimationFrame(animateCar);
      checkGameOver(); // Check for game over condition
    }
  }
  animateCar();

  const boxImages = [
    "./pics/box.png",
    "./pics/box.png",
  ];
  function createRandomBox() {
    const randomBoxIndex = getRandomNumber(0, boxImages.length - 1);
    const randomBoxImage = boxImages[randomBoxIndex];

    const box = document.createElement("div");
    box.className = "box";
    box.style.backgroundImage = `url(${randomBoxImage})`;

    const maxXPosition = maxAreaWidth - 100;
    const randomXPosition = getRandomNumber(0, maxXPosition);

    box.style.left = randomXPosition + "px";
    box.style.top = -(box.offsetHeight + getRandomNumber(100, 300)) + "px";

    maxArea.appendChild(box);

    function moveBox() {
      const currentYPosition = parseInt(box.style.top, 10);
      if (currentYPosition > maxAreaHeight) {
        box.remove();
      } else {
        box.style.top = currentYPosition + enemyCarSpeed + "px";
        requestAnimationFrame(moveBox);
      }
    }
    moveBox();
  }
  setInterval(createRandomBox, 5000);

  const carImages = [
    "./pics/car1.png",
    "./pics/motor.png",
    "./pics/truck.png",
    "./pics/longtruck.png",
    "./pics/car3.png",
    "./pics/car5.png",
    "./pics/green.png",
    "./pics/purbl.png",
    "./pics/white.png",
  ];
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function createRandomEnemyCar() {
    const randomCarIndex = getRandomNumber(0, carImages.length - 1);
    const randomCarImage = carImages[randomCarIndex];
    const enemyCar = document.createElement("div");
    enemyCar.className = "enemy-car";
    enemyCar.style.backgroundImage = `url(${randomCarImage})`;
    const maxXPosition = maxAreaWidth - 100;
    const randomXPosition = getRandomNumber(0, maxXPosition);
    enemyCar.style.left = randomXPosition + "px";
    enemyCar.style.top = -(enemyCar.offsetHeight + getRandomNumber(100, 300)) + "px";
    maxArea.appendChild(enemyCar);
    function moveEnemyCar() {
      const currentYPosition = parseInt(enemyCar.style.top, 10);
      if (currentYPosition > maxAreaHeight) {
        enemyCar.remove();
      } else {
        enemyCar.style.top = currentYPosition + enemyCarSpeed + "px";
        requestAnimationFrame(moveEnemyCar);
      }
    }
    moveEnemyCar();
  }
  setInterval(createRandomEnemyCar, 300);


  
  let score = 0;
  function updateScore() {
    score += 1;
    document.getElementById("score-display").textContent = "Score: " + score;
  }
  setInterval(updateScore, 100);
  function checkGameOver() {
    if (health <= 0 || fuel <= 0) {
      gameOver = true;
      localStorage.setItem('lastScore', score);
      window.location.href = "./menu/menu.html";
    }
  }
});

let health = 100;
let fuel = 100;
let collisionCooldown = false;

function handleCollisions() {
  if (!collisionCooldown) {
    const enemyCars = document.querySelectorAll(".enemy-car");
    enemyCars.forEach((enemyCar) => {
      if (isColliding(car, enemyCar)) {
        if (health > 0) {
          health -= 20;
          updateHealthAndFuel();
          collisionCooldown = true;
          setTimeout(() => {
            collisionCooldown = false;
          }, 1000);
        }
      }
    });
  }
}

function isColliding(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function updateHealthAndFuel() {
  document.getElementById("health-display").textContent = "Health: " + health;
  if (fuel > 0) {
    fuel -= 5;
  }
  document.getElementById("fuel-display").textContent = "Fuel: " + fuel;
}

setInterval(updateHealthAndFuel, 1000);

function handleCollision() {
  if (health > 0) {
    health -= 20;
    updateHealthAndFuel();
  }
}

let messageShown = false;
let boxCollision = false;

function handleBoxCollision() {
  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box) => {
    if (isColliding(car, box)) {
      if (!messageShown) {
        const boxMessage = document.querySelector(".box-message");
        boxMessage.style.display = "block";
        messageShown = true;
        boxCollision = true;
        document.addEventListener("keydown", handleKey);
      }
    }
  });
}

function handleKey(event) {
  if (messageShown && boxCollision) {
    if (event.key === "q") {
      health = 100;
      updateHealthAndFuel();
      boxCollision = false;
      messageShown = false;
      const boxMessage = document.querySelector(".box-message");
      boxMessage.style.display = "none";
    } else if (event.key === "e") {
      fuel = 100;
      updateHealthAndFuel();
      boxCollision = false;
      messageShown = false;
      const boxMessage = document.querySelector(".box-message");
      boxMessage.style.display = "none";
    }
  }
}
