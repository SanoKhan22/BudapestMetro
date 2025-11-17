/* Game Controller - Main game flow management */

const GameController = (function() {
  
  /**
   * Initialize new game
   * @param {string} playerName
   * @param {string} gameMode
   */
  function initializeGame(playerName, gameMode = CONSTANTS.GAME_MODES.SIMPLE) {
    // Initialize game state
    GameState.initialize(playerName, gameMode);
    
    // Load station and line data
    return Promise.all([
      loadStationData(),
      loadLineData()
    ]).then(() => {
      // Randomize round order
      randomizeRoundOrder();
      
      // Start first round
      const roundOrder = GameState.getRoundOrder();
      startRound(roundOrder[0]);
      
      // Start timer
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
  
  /**
   * Randomize the order of metro lines for rounds
   */
  function randomizeRoundOrder() {
    const lineIds = [0, 1, 2, 3]; // M1, M2, M3, M4
    
    // Fisher-Yates shuffle
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
    
    // Initialize deck for this round
    CardController.initializeDeck();
    
    // Set starting station as first endpoint
    const currentLine = GameState.getCurrentLine();
    if (currentLine) {
      currentLine.endpoints = [currentLine.startStationId];
      currentLine.visitedStations = new Set([currentLine.startStationId]);
      
      // Mark starting station as visited
      const startStation = GameState.getStationById(currentLine.startStationId);
      if (startStation) {
        startStation.addVisitor(lineId);
      }
    }
  }
  
  /**
   * End current round
   */
  function endRound() {
    const currentLine = GameState.getCurrentLine();
    if (!currentLine) return;
    
    // Calculate round score
    const roundScore = ScoringUtil.calculateRoundScore(currentLine, GameState.getAllStations());
    GameState.addRoundScore(roundScore);
    
    // Move to next round
    GameState.nextRound();
    
    // Check if game is complete
    if (GameState.isGameComplete()) {
      endGame();
    } else {
      // Start next round
      const roundOrder = GameState.getRoundOrder();
      const nextLineId = roundOrder[GameState.getCurrentRoundIndex()];
      startRound(nextLineId);
    }
  }
  
  /**
   * End game and calculate final score
   */
  function endGame() {
    // Stop timer
    GameState.stopTimer();
    
    // Calculate final score
    const finalScore = ScoringUtil.calculateFinalScore(GameState);
    GameState.setFinalScore(finalScore);
    
    // Save to localStorage
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
      // Simple mode: 8 cards
      const totalCards = drawnCards.sidePlatform + drawnCards.centerPlatform;
      return totalCards >= CONSTANTS.SIMPLE_ROUND_LENGTH;
    } else if (gameMode === CONSTANTS.GAME_MODES.PLATFORM_ENDING) {
      // Platform ending mode: 5 of one type
      return drawnCards.sidePlatform >= CONSTANTS.PLATFORM_TYPE_LIMIT ||
             drawnCards.centerPlatform >= CONSTANTS.PLATFORM_TYPE_LIMIT;
    }
    
    return false;
  }
  
  /**
   * Handle round end condition check
   */
  function handleRoundEndCondition() {
    if (checkRoundEndCondition()) {
      // Show end round button or auto-end
      const gameMode = GameState.getGameMode();
      if (gameMode === CONSTANTS.GAME_MODES.PLATFORM_ENDING) {
        // Show "End Round" button
        const endRoundBtn = document.querySelector('#end-round-btn');
        if (endRoundBtn) {
          endRoundBtn.classList.remove('hidden');
        }
      } else {
        // Auto-end round in simple mode
        endRound();
      }
    }
  }
  
  // Public API
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
