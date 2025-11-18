

const GameController = (function() {
  
  /**
   * Initialize new game
   * @param {string} playerName
   * @param {string} gameMode
   */
  function initializeGame(playerName, gameMode = CONSTANTS.GAME_MODES.SIMPLE) {
    GameState.initialize(playerName, gameMode);
    return Promise.all([
      loadStationData(),
      loadLineData()
    ]).then(() => {
      randomizeRoundOrder();
      const roundOrder = GameState.getRoundOrder();
      startRound(roundOrder[0]);
      GameState.startTimer();
      
      return true;
    }).catch(error => {
      console.error('Error initializing game:', error);
      return false;
    });
  }
  
  /**
   * Load station data from JSON
   * @returns {Promise}
   */
  function loadStationData() {
    return fetch('metros-starter/stations.json')
      .then(response => response.json())
      .then(data => {
        const stations = data.map(stationData => new Station(stationData));
        GameState.setStations(stations);
        return stations;
      });
  }
  
  /**
   * Load metro line data from JSON
   * @returns {Promise}
   */
  function loadLineData() {
    return fetch('metros-starter/lines.json')
      .then(response => response.json())
      .then(data => {
        const lines = data.map(lineData => new MetroLine(lineData));
        GameState.setMetroLines(lines);
        return lines;
      });
  }
  
  
  function randomizeRoundOrder() {
    const lineIds = [0, 1, 2, 3]; // M1, M2, M3, M4
    for (let i = lineIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lineIds[i], lineIds[j]] = [lineIds[j], lineIds[i]];
    }
    
    GameState.setRoundOrder(lineIds);
    return lineIds;
  }
  
  /**
   * Start a round for given line
   * @param {number} lineId
   */
  function startRound(lineId) {
    GameState.setCurrentLineId(lineId);
    GameState.resetDrawnCards();
    CardController.initializeDeck();
    const currentLine = GameState.getCurrentLine();
    if (currentLine) {
      currentLine.endpoints = [currentLine.startStationId];
      currentLine.visitedStations = new Set([currentLine.startStationId]);
      const startStation = GameState.getStationById(currentLine.startStationId);
      if (startStation) {
        startStation.addVisitor(lineId);
      }
    }
  }
  
  
  function endRound() {
    const currentLine = GameState.getCurrentLine();
    if (!currentLine) return;
    const roundScore = ScoringUtil.calculateRoundScore(currentLine, GameState.getAllStations());
    GameState.addRoundScore(roundScore);
    const roundNumber = GameState.getCurrentRoundIndex() + 1;
    ScoreView.displayRoundScore(roundScore, roundNumber);
    
    console.log(`Round ${roundNumber} complete! Score: ${roundScore.fp} (PK:${roundScore.pk} × PM:${roundScore.pm} + PD:${roundScore.pd})`);
    setTimeout(() => {
      GameState.nextRound();
      if (GameState.isGameComplete()) {
        endGame();
      } else {
        const roundOrder = GameState.getRoundOrder();
        const nextLineId = roundOrder[GameState.getCurrentRoundIndex()];
        startRound(nextLineId);
        ScoreView.displayCumulativeScores(GameState.getRoundScores());
      }
    }, 2000); // 2 second delay to show round score
  }
  
  
  function endGame() {
    GameState.stopTimer();
    const finalScore = ScoringUtil.calculateFinalScore(GameState);
    GameState.setFinalScore(finalScore);
    ScoreView.displayFinalScore(finalScore);
    
    console.log('Game complete! Final score:', finalScore.total);
    StorageUtil.saveGameResult(
      GameState.getPlayerName(),
      finalScore.total,
      GameState.getElapsedTime()
    );
  }
  
  /**
   * Check if round should end
   * @returns {boolean}
   */
  function checkRoundEndCondition() {
    const gameMode = GameState.getGameMode();
    const drawnCards = GameState.getDrawnCards();
    
    if (gameMode === CONSTANTS.GAME_MODES.SIMPLE) {
      const totalCards = drawnCards.sidePlatform + drawnCards.centerPlatform;
      return totalCards >= CONSTANTS.SIMPLE_ROUND_LENGTH;
    } else if (gameMode === CONSTANTS.GAME_MODES.PLATFORM_ENDING) {
      return drawnCards.sidePlatform >= CONSTANTS.PLATFORM_TYPE_LIMIT ||
             drawnCards.centerPlatform >= CONSTANTS.PLATFORM_TYPE_LIMIT;
    }
    
    return false;
  }
  
  
  function handleRoundEndCondition() {
    if (checkRoundEndCondition()) {
      const gameMode = GameState.getGameMode();
      if (gameMode === CONSTANTS.GAME_MODES.PLATFORM_ENDING) {
        const endRoundBtn = document.querySelector('#end-round-btn');
        if (endRoundBtn) {
          endRoundBtn.classList.remove('hidden');
        }
      } else {
        endRound();
      }
    }
  }
  return {
    initializeGame,
    loadStationData,
    loadLineData,
    randomizeRoundOrder,
    startRound,
    endRound,
    endGame,
    checkRoundEndCondition,
    handleRoundEndCondition
  };
})();
