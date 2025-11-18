

const ScoreView = (function() {
  
  /**
   * Display round score breakdown
   * @param {Object} roundScore - {pk, pm, pd, fp}
   * @param {number} roundNumber
   */
  function displayRoundScore(roundScore, roundNumber) {
    const scoreDisplay = document.querySelector('#score-display');
    if (!scoreDisplay) return;
    
    const html = `
      <div class="score-item">
        <span class="label">Round ${roundNumber}</span>
        <span class="value">Complete</span>
      </div>
      <div class="score-item">
        <span class="label">Districts (PK)</span>
        <span class="value">${roundScore.pk}</span>
      </div>
      <div class="score-item">
        <span class="label">Max in District (PM)</span>
        <span class="value">${roundScore.pm}</span>
      </div>
      <div class="score-item">
        <span class="label">Danube Crossings (PD)</span>
        <span class="value">${roundScore.pd}</span>
      </div>
      <div class="score-item total">
        <span class="label">Round Score (FP)</span>
        <span class="value">${roundScore.fp}</span>
      </div>
    `;
    
    scoreDisplay.innerHTML = html;
  }
  
  /**
   * Display current round progress
   * @param {Object} drawnCards
   */
  function displayRoundProgress(drawnCards) {
    const scoreDisplay = document.querySelector('#score-display');
    if (!scoreDisplay) return;
    
    const total = drawnCards.sidePlatform + drawnCards.centerPlatform;
    const railwayCount = GameState.getRailwayStationCount();
    const railwayPoints = ScoringUtil.calculateRailwayPoints(railwayCount);
    
    const html = `
      <div class="score-item">
        <span class="label">Cards Drawn</span>
        <span class="value">${total} / 8</span>
      </div>
      <div class="score-item">
        <span class="label">Side Platform</span>
        <span class="value">${drawnCards.sidePlatform}</span>
      </div>
      <div class="score-item">
        <span class="label">Center Platform</span>
        <span class="value">${drawnCards.centerPlatform}</span>
      </div>
      <div class="score-item">
        <span class="label">Railway Stations 🚂</span>
        <span class="value">${railwayCount} (${railwayPoints} pts)</span>
      </div>
    `;
    
    scoreDisplay.innerHTML = html;
  }
  
  /**
   * Display cumulative scores
   * @param {Array} roundScores
   */
  function displayCumulativeScores(roundScores) {
    const scoreDisplay = document.querySelector('#score-display');
    if (!scoreDisplay) return;
    
    const totalFP = roundScores.reduce((sum, score) => sum + (score.fp || 0), 0);
    
    let html = '<div class="score-section-title">Round Scores</div>';
    
    roundScores.forEach((score, index) => {
      html += `
        <div class="score-item">
          <span class="label">Round ${index + 1}</span>
          <span class="value">${score.fp} pts</span>
        </div>
      `;
    });
    
    html += `
      <div class="score-item total">
        <span class="label">Total</span>
        <span class="value">${totalFP} pts</span>
      </div>
    `;
    
    scoreDisplay.innerHTML = html;
  }
  
  /**
   * Display final game score
   * @param {Object} finalScore
   */
  function displayFinalScore(finalScore) {
    const scoreDisplay = document.querySelector('#score-display');
    if (!scoreDisplay) return;
    
    const html = `
      <div class="score-section-title">Final Score</div>
      <div class="score-item">
        <span class="label">Round Points</span>
        <span class="value">${finalScore.sumFP}</span>
      </div>
      <div class="score-item">
        <span class="label">Railway Points (PP)</span>
        <span class="value">${finalScore.pp}</span>
      </div>
      <div class="score-item">
        <span class="label">2-Line Junctions</span>
        <span class="value">${finalScore.junctions.p2} × 2 = ${finalScore.junctions.p2 * 2}</span>
      </div>
      <div class="score-item">
        <span class="label">3-Line Junctions</span>
        <span class="value">${finalScore.junctions.p3} × 5 = ${finalScore.junctions.p3 * 5}</span>
      </div>
      <div class="score-item">
        <span class="label">4-Line Junctions</span>
        <span class="value">${finalScore.junctions.p4} × 9 = ${finalScore.junctions.p4 * 9}</span>
      </div>
      <div class="score-item total">
        <span class="label">TOTAL SCORE</span>
        <span class="value">${finalScore.total}</span>
      </div>
    `;
    
    scoreDisplay.innerHTML = html;
  }
  
  
  function clearScoreDisplay() {
    const scoreDisplay = document.querySelector('#score-display');
    if (scoreDisplay) {
      scoreDisplay.innerHTML = '<div class="score-placeholder">Scores will appear here</div>';
    }
  }
  return {
    displayRoundScore,
    displayRoundProgress,
    displayCumulativeScores,
    displayFinalScore,
    clearScoreDisplay
  };
})();
