/* Game State Model - Central state management */

const GameState = (function() {
  // Private state
  let state = {
    playerName: '',
    startTime: null,
    elapsedTime: 0,
    timerInterval: null,
    
    // Round management
    roundOrder: [], // Randomized order of metro line IDs [0,1,2,3]
    currentRoundIndex: 0,
    currentLineId: null,
    
    // Card system
    deck: [],
    currentCard: null,
    drawnCards: {
      sidePlatform: 0,
      centerPlatform: 0
    },
    switchActive: false,
    
    // Grid and stations
    stations: [], // Array of Station objects
    metroLines: [], // Array of MetroLine objects
    
    // Scoring
    roundScores: [],
    railwayStationCount: 0,
    finalScore: 0,
    
    // Extra features
    gameMode: CONSTANTS.GAME_MODES.SIMPLE,
    abilities: {} // Map of lineId -> ability
  };
  
  // Public API
  return {
    /**
     * Initialize new game
     * @param {string} playerName
     * @param {string} gameMode
     */
    initialize(playerName, gameMode = CONSTANTS.GAME_MODES.SIMPLE) {
      state.playerName = playerName;
      state.gameMode = gameMode;
      state.startTime = null;
      state.elapsedTime = 0;
      state.roundOrder = [];
      state.currentRoundIndex = 0;
      state.currentLineId = null;
      state.deck = [];
      state.currentCard = null;
      state.drawnCards = { sidePlatform: 0, centerPlatform: 0 };
      state.switchActive = false;
      state.stations = [];
      state.metroLines = [];
      state.roundScores = [];
      state.railwayStationCount = 0;
      state.finalScore = 0;
      state.abilities = {};
    },
    
    /**
     * Start the game timer
     */
    startTimer() {
      state.startTime = Date.now();
      state.timerInterval = setInterval(() => {
        state.elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
      }, 1000);
    },
    
    /**
     * Stop the game timer
     */
    stopTimer() {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
      }
    },
    
    /**
     * Get elapsed time in seconds
     * @returns {number}
     */
    getElapsedTime() {
      return state.elapsedTime;
    },
    
    /**
     * Get current metro line object
     * @returns {MetroLine|null}
     */
    getCurrentLine() {
      if (state.currentLineId === null) return null;
      return state.metroLines[state.currentLineId];
    },
    
    /**
     * Get current card
     * @returns {Card|null}
     */
    getCurrentCard() {
      return state.currentCard;
    },
    
    /**
     * Set current card
     * @param {Card} card
     */
    setCurrentCard(card) {
      state.currentCard = card;
    },
    
    /**
     * Get station by ID
     * @param {number} id
     * @returns {Station|null}
     */
    getStationById(id) {
      return state.stations.find(s => s.id === id) || null;
    },
    
    /**
     * Get all stations
     * @returns {Station[]}
     */
    getAllStations() {
      return state.stations;
    },
    
    /**
     * Set stations array
     * @param {Station[]} stations
     */
    setStations(stations) {
      state.stations = stations;
    },
    
    /**
     * Get all metro lines
     * @returns {MetroLine[]}
     */
    getAllLines() {
      return state.metroLines;
    },
    
    /**
     * Set metro lines array
     * @param {MetroLine[]} lines
     */
    setMetroLines(lines) {
      state.metroLines = lines;
    },
    
    /**
     * Add segment to current line
     * @param {number} fromId
     * @param {number} toId
     */
    addSegment(fromId, toId) {
      const currentLine = this.getCurrentLine();
      if (!currentLine) return;
      
      currentLine.addSegment(fromId, toId);
      
      // Update station visited status
      const fromStation = this.getStationById(fromId);
      const toStation = this.getStationById(toId);
      
      if (fromStation) fromStation.addVisitor(state.currentLineId);
      if (toStation) toStation.addVisitor(state.currentLineId);
      
      // Check if railway station
      if (toStation && toStation.train && !state.railwayStationCount) {
        state.railwayStationCount = 0;
      }
      if (toStation && toStation.train) {
        state.railwayStationCount++;
      }
    },
    
    /**
     * Get deck
     * @returns {Card[]}
     */
    getDeck() {
      return state.deck;
    },
    
    /**
     * Set deck
     * @param {Card[]} deck
     */
    setDeck(deck) {
      state.deck = deck;
    },
    
    /**
     * Get drawn cards count
     * @returns {{sidePlatform: number, centerPlatform: number}}
     */
    getDrawnCards() {
      return { ...state.drawnCards };
    },
    
    /**
     * Increment drawn card count
     * @param {string} platformType
     */
    incrementDrawnCards(platformType) {
      if (platformType === 'side') {
        state.drawnCards.sidePlatform++;
      } else if (platformType === 'center') {
        state.drawnCards.centerPlatform++;
      }
    },
    
    /**
     * Reset drawn cards count
     */
    resetDrawnCards() {
      state.drawnCards = { sidePlatform: 0, centerPlatform: 0 };
    },
    
    /**
     * Get switch active status
     * @returns {boolean}
     */
    isSwitchActive() {
      return state.switchActive;
    },
    
    /**
     * Set switch active status
     * @param {boolean} active
     */
    setSwitchActive(active) {
      state.switchActive = active;
    },
    
    /**
     * Get round order
     * @returns {number[]}
     */
    getRoundOrder() {
      return [...state.roundOrder];
    },
    
    /**
     * Set round order
     * @param {number[]} order
     */
    setRoundOrder(order) {
      state.roundOrder = order;
    },
    
    /**
     * Get current round index
     * @returns {number}
     */
    getCurrentRoundIndex() {
      return state.currentRoundIndex;
    },
    
    /**
     * Set current line ID
     * @param {number} lineId
     */
    setCurrentLineId(lineId) {
      state.currentLineId = lineId;
    },
    
    /**
     * Get current line ID
     * @returns {number|null}
     */
    getCurrentLineId() {
      return state.currentLineId;
    },
    
    /**
     * Move to next round
     */
    nextRound() {
      state.currentRoundIndex++;
      if (state.currentRoundIndex < state.roundOrder.length) {
        state.currentLineId = state.roundOrder[state.currentRoundIndex];
      }
    },
    
    /**
     * Check if game is complete
     * @returns {boolean}
     */
    isGameComplete() {
      return state.currentRoundIndex >= 4;
    },
    
    /**
     * Add round score
     * @param {number} score
     */
    addRoundScore(score) {
      state.roundScores.push(score);
    },
    
    /**
     * Get round scores
     * @returns {number[]}
     */
    getRoundScores() {
      return [...state.roundScores];
    },
    
    /**
     * Get railway station count
     * @returns {number}
     */
    getRailwayStationCount() {
      return state.railwayStationCount;
    },
    
    /**
     * Get player name
     * @returns {string}
     */
    getPlayerName() {
      return state.playerName;
    },
    
    /**
     * Get game mode
     * @returns {string}
     */
    getGameMode() {
      return state.gameMode;
    },
    
    /**
     * Set final score
     * @param {number} score
     */
    setFinalScore(score) {
      state.finalScore = score;
    },
    
    /**
     * Get final score
     * @returns {number}
     */
    getFinalScore() {
      return state.finalScore;
    },
    
    /**
     * Get abilities map
     * @returns {Object}
     */
    getAbilities() {
      return { ...state.abilities };
    },
    
    /**
     * Set ability for line
     * @param {number} lineId
     * @param {string} ability
     */
    setAbility(lineId, ability) {
      state.abilities[lineId] = ability;
    }
  };
})();
