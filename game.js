const GAME_DURATION = 30;
const SPAWN_INTERVAL_MS = 650;
const MIN_FISH_LIFETIME_MS = 900;
const FISH_LIFETIME_VARIATION_MS = 1300;

const gameArea = document.getElementById("gameArea");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const messageElement = document.getElementById("message");
const startButton = document.getElementById("startButton");

let score = 0;
let timeLeft = GAME_DURATION;
let isRunning = false;
let timerIntervalId = null;
let spawnIntervalId = null;

function randomInRange(max, min = 0) {
  if (max <= min) return min;
  return Math.floor(Math.random() * (max - min) + min);
}

function clearFish() {
  gameArea.querySelectorAll(".fish").forEach((fish) => fish.remove());
}

function updateHud() {
  scoreElement.textContent = String(score);
  timeElement.textContent = String(timeLeft);
}

function moveFish(fish) {
  const width = Math.max(20, gameArea.clientWidth - 44);
  const height = Math.max(20, gameArea.clientHeight - 44);
  fish.style.left = `${randomInRange(width)}px`;
  fish.style.top = `${randomInRange(height)}px`;
}

function spawnFish() {
  if (!isRunning) return;

  const fish = document.createElement("button");
  fish.type = "button";
  fish.className = "fish";
  fish.textContent = "🐠";
  fish.setAttribute("aria-label", "Fish");

  moveFish(fish);
  gameArea.appendChild(fish);

  requestAnimationFrame(() => {
    if (fish.isConnected && isRunning) moveFish(fish);
  });

  const lifetime = MIN_FISH_LIFETIME_MS + randomInRange(FISH_LIFETIME_VARIATION_MS);
  const removeTimeoutId = setTimeout(() => fish.remove(), lifetime);

  fish.addEventListener("click", () => {
    if (!isRunning) return;
    clearTimeout(removeTimeoutId);
    fish.remove();
    score += 1;
    updateHud();
  });
}

function stopGame() {
  isRunning = false;
  clearInterval(timerIntervalId);
  clearInterval(spawnIntervalId);
  clearFish();
  startButton.textContent = "Restart Game";
  messageElement.textContent = `Time over! Final score: ${score}`;
}

function tick() {
  timeLeft -= 1;
  updateHud();
  if (timeLeft <= 0) stopGame();
}

function startGame() {
  score = 0;
  timeLeft = GAME_DURATION;
  isRunning = true;
  messageElement.textContent = "Catch the fish!";
  startButton.textContent = "Running...";
  updateHud();
  clearFish();

  clearInterval(timerIntervalId);
  clearInterval(spawnIntervalId);
  timerIntervalId = setInterval(tick, 1000);
  spawnIntervalId = setInterval(spawnFish, SPAWN_INTERVAL_MS);
  spawnFish();
}

startButton.addEventListener("click", () => {
  startGame();
});

updateHud();
