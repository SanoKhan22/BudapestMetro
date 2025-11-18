/* Validation Utility - Segment validation rules */

const ValidationUtil = (function() {
  
  /**
   * Main validation function - checks all rules
   * @param {GameState} gameState
   * @param {number} fromId
   * @param {number} toId
   * @returns {Object} {valid: boolean, errors: string[]}
   */
  function validateSegment(gameState, fromId, toId) {
    const errors = [];
    
    const fromStation = gameState.getStationById(fromId);
    const toStation = gameState.getStationById(toId);
    
    if (!fromStation || !toStation) {
      errors.push('Invalid station IDs');
      return { valid: false, errors };
    }
    
    // Check if valid start point
    if (!isValidStartPoint(gameState, fromId)) {
      errors.push('Must start from line endpoint');
    }
    
    // Check if matches card type
    if (!matchesCardType(gameState, toId)) {
      errors.push('Station type does not match card');
    }
    
    // Check angle (90° or 45°)
    if (!isValidAngle(fromStation, toStation)) {
      errors.push('Segment must be at 90° or 45° angle');
    }
    
    // Check for pass-through stations
    if (passesThroughStation(fromStation, toStation, gameState.getAllStations())) {
      errors.push('Segment cannot pass through other stations');
    }
    
    // Check for intersections
    if (intersectsExistingSegment(fromStation, toStation, gameState)) {
      errors.push('Segment cannot intersect existing segments');
    }
    
    // Check for parallel segments
    if (isParallelSegment(fromId, toId, gameState)) {
      errors.push('Parallel segments not allowed');
    }
    
    // Check for loops
    if (createsLoop(gameState, toId)) {
      errors.push('Cannot revisit station on same line');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Check if station is valid starting point
   * @param {GameState} gameState
   * @param {number} stationId
   * @returns {boolean}
   */
  function isValidStartPoint(gameState, stationId) {
    const currentLine = gameState.getCurrentLine();
    if (!currentLine) return false;
    
    // If switch is active, can start from any visited station
    if (gameState.isSwitchActive()) {
      return currentLine.hasVisited(stationId);
    }
    
    // Otherwise, must be an endpoint
    return currentLine.isEndpoint(stationId);
  }
  
  /**
   * Check if target station matches current card type
   * @param {GameState} gameState
   * @param {number} stationId
   * @returns {boolean}
   */
  function matchesCardType(gameState, stationId) {
    const card = gameState.getCurrentCard();
    const station = gameState.getStationById(stationId);
    
    if (!card || !station) return false;
    
    return station.matchesCard(card.type);
  }
  
  /**
   * Check if segment is at valid angle (90° or 45°)
   * @param {Station} from
   * @param {Station} to
   * @returns {boolean}
   */
  function isValidAngle(from, to) {
    return GeometryUtil.isHorizontal(from, to) ||
           GeometryUtil.isVertical(from, to) ||
           GeometryUtil.isDiagonal45(from, to);
  }
  
  /**
   * Check if segment passes through another station
   * @param {Station} from
   * @param {Station} to
   * @param {Station[]} allStations
   * @returns {boolean}
   */
  function passesThroughStation(from, to, allStations) {
    const stationsBetween = GeometryUtil.getStationsBetween(from, to, allStations);
    return stationsBetween.length > 0;
  }
  
  /**
   * Check if segment intersects existing segments
   * @param {Station} from
   * @param {Station} to
   * @param {GameState} gameState
   * @returns {boolean}
   */
  function intersectsExistingSegment(from, to, gameState) {
    const allLines = gameState.getAllLines();
    const newSeg = { from, to };
    
    for (const line of allLines) {
      for (const segment of line.segments) {
        const existingFrom = gameState.getStationById(segment.from);
        const existingTo = gameState.getStationById(segment.to);
        
        if (!existingFrom || !existingTo) continue;
        
        const existingSeg = { from: existingFrom, to: existingTo };
        
        if (GeometryUtil.doSegmentsIntersect(newSeg, existingSeg)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Check if parallel segment already exists
   * @param {number} fromId
   * @param {number} toId
   * @param {GameState} gameState
   * @returns {boolean}
   */
  function isParallelSegment(fromId, toId, gameState) {
    const allLines = gameState.getAllLines();
    
    for (const line of allLines) {
      for (const segment of line.segments) {
        // Check both directions
        if ((segment.from === fromId && segment.to === toId) ||
            (segment.from === toId && segment.to === fromId)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Check if segment creates a loop
   * @param {GameState} gameState
   * @param {number} toStationId
   * @returns {boolean}
   */
  function createsLoop(gameState, toStationId) {
    const currentLine = gameState.getCurrentLine();
    if (!currentLine) return false;
    
    return currentLine.hasVisited(toStationId);
  }
  
  // Public API
  return {
    validateSegment,
    isValidStartPoint,
    matchesCardType,
    isValidAngle,
    passesThroughStation,
    intersectsExistingSegment,
    isParallelSegment,
    createsLoop
  };
})();
