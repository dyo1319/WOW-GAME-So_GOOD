document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('resetScores'); 
    
    startButton.addEventListener('click', function () {
      window.location.href = '../game.html';
    });
    
    resetButton.addEventListener('click', function () { 
      localStorage.setItem('bestScore', 0);
      localStorage.setItem('lastScore', 0);
      const lastScoreElements = document.getElementsByClassName('lastscore');
      for (const element of lastScoreElements) {
        element.textContent = 'Last Score: 0';
      }
  
      const bestScoreElements = document.getElementsByClassName('bestscore');
      for (const element of bestScoreElements) {
        element.textContent = 'Best Score: 0';
      }
    });
  
    const lastScore = parseInt(localStorage.getItem('lastScore'));
    if (!isNaN(lastScore)) {
      const lastScoreElements = document.getElementsByClassName('lastscore');
      for (const element of lastScoreElements) {
        element.textContent = 'Last Score: ' + lastScore;
      }

      let bestScore = parseInt(localStorage.getItem('bestScore'));
      if (isNaN(bestScore) || lastScore > bestScore) {
        localStorage.setItem('bestScore', lastScore);
        bestScore = lastScore; 
      }
      const bestScoreElements = document.getElementsByClassName('bestscore');
      for (const element of bestScoreElements) {
        element.textContent = 'Best Score: ' + bestScore;
      }
    }
  });
  