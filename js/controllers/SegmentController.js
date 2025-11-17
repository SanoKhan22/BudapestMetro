/* Segment Controller - Segment building logic */

const SegmentController = (function() {
  // Private state
  let selectedFromStation = null;
  
  /**
   * Handle station click
   * @param {number} stationId
   */
  function handleStationClick(stationId) {
    const currentCard = GameState.getCurrentCard();
    
    if (!currentCard) {
      console.log('No card drawn yet');
      return;
    }
    
    if (selectedFromStation === null) {
      // First click - select starting station
      selectFromStation(stationId);
    } else {
      // Second click - attempt to build segment
      selectToStation(stationId);
    }
  }
  
  /**
   * Select starting station
   * @param {number} stationId
   */
  function selectFromStation(stationId) {
    const currentLine = GameState.getCurrentLine();
    if (!currentLine) return;
    
    // Check if station is an endpoint or if switch is active
    const isEndpoint = currentLine.isEndpoint(stationId);
    const isSwitchActive = GameState.isSwitchActive();
    const isVisited = currentLine.hasVisited(stationId);
    
    if (!isEndpoint && !isSwitchActive) {
      console.log('Can only start from endpoint (unless Switch card active)');
      return;
    }
    
    if (!isVisited && !isSwitchActive) {
      console.log('Station not part of current line');
      return;
    }
    
    // Valid starting point
    selectedFromStation = stationId;
    GridView.selectStation(stationId);
    GridView.clearHighlights();
    GridView.selectStation(stationId);
    
    console.log('Selected from station:', stationId);
  }
  
  /**
   * Select target station and attempt to build segment
   * @param {number} stationId
   */
  function selectToStation(stationId) {
    if (selectedFromStation === stationId) {
      // Clicked same station - deselect
      cancelSelection();
      return;
    }
    
    // Attempt to build segment
    attemptBuildSegment(selectedFromStation, stationId);
  }
  
  /**
   * Attempt to build a segment
   * @param {number} fromId
   * @param {number} toId
   */
  function attemptBuildSegment(fromId, toId) {
    const validation = ValidationUtil.validateSegment(GameState, fromId, toId);
    
    if (validation.valid) {
      buildSegment(fromId, toId);
    } else {
      console.log('Invalid segment:', validation.errors);
      GridView.highlightInvalidMove(fromId, toId);
    }
    
    // Reset selection
    cancelSelection();
  }
  
  /**
   * Build a valid segment
   * @param {number} fromId
   * @param {number} toId
   */
  function buildSegment(fromId, toId) {
    const currentLine = GameState.getCurrentLine();
    if (!currentLine) return;
    
    // Add segment to game state
    GameState.addSegment(fromId, toId);
    
    // Render segment
    GridView.renderSegment(fromId, toId, currentLine.color, currentLine.name);
    
    // Update station states
    const fromStation = GameState.getStationById(fromId);
    const toStation = GameState.getStationById(toId);
    
    if (fromStation) GridView.updateStationState(fromId, fromStation);
    if (toStation) GridView.updateStationState(toId, toStation);
    
    // Highlight new endpoints
    GridView.highlightEndpoints(currentLine.getEndpoints());
    
    // Reset switch active state
    GameState.setSwitchActive(false);
    
    console.log('Segment built:', fromId, '->', toId);
  }
  
  /**
   * Cancel current selection
   */
  function cancelSelection() {
    selectedFromStation = null;
    GridView.clearHighlights();
  }
  
  /**
   * Get valid target stations for current selection
   * @param {number} fromId
   * @param {Card} card
   * @returns {number[]}
   */
  function getValidTargets(fromId, card) {
    const allStations = GameState.getAllStations();
    const validTargets = [];
    
    allStations.forEach(station => {
      if (station.id === fromId) return;
      
      const validation = ValidationUtil.validateSegment(GameState, fromId, station.id);
      if (validation.valid) {
        validTargets.push(station.id);
      }
    });
    
    return validTargets;
  }
  
  // Public API
  return {
    handleStationClick,
    selectFromStation,
    selectToStation,
    attemptBuildSegment,
    buildSegment,
    cancelSelection,
    getValidTargets
  };
})();
