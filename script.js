// script.js
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

const scoreDisplay = document.getElementById('score-display');
const highScoreDisplay = document.getElementById('highscore-display');
const clickButton = document.getElementById('click-button');

scoreDisplay.textContent = "Score: " + score;
highScoreDisplay.textContent = "High Score: " + highScore;

clickButton.addEventListener('click', () => {
  score++;
  scoreDisplay.textContent = "Score: " + score;
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreDisplay.textContent = "High Score: " + highScore;
  }
  
  // Add a pop animation effect for satisfying feedback
  clickButton.classList.add('pop');
  setTimeout(() => {
    clickButton.classList.remove('pop');
  }, 200);
});
