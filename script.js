/* script.js */
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let clickValue = 1;
let autoClickerActive = false;
let autoClickerInterval = null;

const scoreDisplay = document.getElementById('score-display');
const highScoreDisplay = document.getElementById('highscore-display');
const clickButton = document.getElementById('click-button');
const upgradeClickButton = document.getElementById('upgrade-click');
const upgradeAutoButton = document.getElementById('upgrade-auto');
const clickSound = document.getElementById('click-sound');

function updateScoreDisplay() {
  scoreDisplay.textContent = "Score: " + score;
  highScoreDisplay.textContent = "High Score: " + highScore;
  
  // Enable upgrades based on current score
  upgradeClickButton.disabled = score < 50;
  upgradeAutoButton.disabled = score < 100 || autoClickerActive;
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
}

function handleClick() {
  score += clickValue;
  saveHighScore();
  updateScoreDisplay();
  
  // Play click sound if available
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {}); // catch promise rejection in some browsers
  }
  
  // Visual pop animation
  clickButton.classList.add('pop');
  setTimeout(() => {
    clickButton.classList.remove('pop');
  }, 300);
}

clickButton.addEventListener('click', handleClick);

// Upgrade to increase click value
upgradeClickButton.addEventListener('click', () => {
  if (score >= 50) {
    score -= 50;
    clickValue++;
    updateScoreDisplay();
    upgradeClickButton.textContent = `Increase Click Value (Now: ${clickValue}) (Cost: 50)`;
  }
});

// Upgrade to add auto clicker functionality
upgradeAutoButton.addEventListener('click', () => {
  if (score >= 100 && !autoClickerActive) {
    score -= 100;
    autoClickerActive = true;
    updateScoreDisplay();
    upgradeAutoButton.textContent = "Auto Clicker Active";
    
    // Auto click every second
    autoClickerInterval = setInterval(() => {
      score += clickValue;
      saveHighScore();
      updateScoreDisplay();
    }, 1000);
  }
});

// Initialize display on load
updateScoreDisplay();
