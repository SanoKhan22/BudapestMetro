/* Scoring Utility - Score calculations */

const ScoringUtil = (function() {
  
  /**
   * Calculate districts covered by metro line (PK)
   * @param {MetroLine} metroLine
   * @param {Station[]} allStations
   * @returns {number}
   */
  function calculateDistrictsCovered(metroLine, allStations) {
    const districts = new Set();
    
    metroLine.getAllStations().forEach(stationId => {
      const station = allStations.find(s => s.id === stationId);
      if (station) {
        districts.add(station.district);
      }
    });
    
    return districts.size;
  }
  
  /**
   * Calculate max stations in single district (PM)
   * @param {MetroLine} metroLine
   * @param {Station[]} allStations
   * @returns {number}
   */
  function calculateMaxStationsInDistrict(metroLine, allStations) {
    const districtCounts = {};
    
    metroLine.getAllStations().forEach(stationId => {
      const station = allStations.find(s => s.id === stationId);
      if (station) {
        districtCounts[station.district] = (districtCounts[station.district] || 0) + 1;
      }
    });
    
    return Math.max(...Object.values(districtCounts), 0);
  }
  
  /**
   * Calculate Danube crossings (PD)
   * @param {MetroLine} metroLine
   * @param {Station[]} allStations
   * @returns {number}
   */
  function calculateDanubeCrossings(metroLine, allStations) {
    let crossings = 0;
    
    metroLine.segments.forEach(segment => {
      const fromStation = allStations.find(s => s.id === segment.from);
      const toStation = allStations.find(s => s.id === segment.to);
      
      if (fromStation && toStation) {
        if (fromStation.side !== toStation.side) {
          crossings++;
        }
      }
    });
    
    return crossings;
  }
  
  /**
   * Calculate round score: FP = (PK × PM) + PD
   * @param {MetroLine} metroLine
   * @param {Station[]} allStations
   * @returns {Object}
   */
  function calculateRoundScore(metroLine, allStations) {
    const pk = calculateDistrictsCovered(metroLine, allStations);
    const pm = calculateMaxStationsInDistrict(metroLine, allStations);
    const pd = calculateDanubeCrossings(metroLine, allStations);
    const fp = (pk * pm) + pd;
    
    return { pk, pm, pd, fp };
  }
  
  /**
   * Count junctions (P2, P3, P4)
   * @param {Station[]} allStations
   * @returns {Object}
   */
  function calculateJunctions(allStations) {
    let p2 = 0, p3 = 0, p4 = 0;
    
    allStations.forEach(station => {
      const count = station.getVisitorCount();
      if (count === 2) p2++;
      else if (count === 3) p3++;
      else if (count === 4) p4++;
    });
    
    return { p2, p3, p4 };
  }
  
  /**
   * Calculate railway points from count
   * @param {number} count
   * @returns {number}
   */
  function calculateRailwayPoints(count) {
    if (count >= CONSTANTS.RAILWAY_SCORING.length) {
      return CONSTANTS.RAILWAY_SCORING[CONSTANTS.RAILWAY_SCORING.length - 1];
    }
    return CONSTANTS.RAILWAY_SCORING[count] || 0;
  }
  
  /**
   * Calculate final score
   * @param {GameState} gameState
   * @returns {Object}
   */
  function calculateFinalScore(gameState) {
    const roundScores = gameState.getRoundScores();
    const sumFP = roundScores.reduce((sum, score) => sum + (score.fp || 0), 0);
    
    const pp = calculateRailwayPoints(gameState.getRailwayStationCount());
    const junctions = calculateJunctions(gameState.getAllStations());
    
    const junctionPoints = (2 * junctions.p2) + (5 * junctions.p3) + (9 * junctions.p4);
    const total = sumFP + pp + junctionPoints;
    
    return {
      total,
      sumFP,
      pp,
      junctions,
      junctionPoints
    };
  }
  
  // Public API
  return {
    calculateDistrictsCovered,
    calculateMaxStationsInDistrict,
    calculateDanubeCrossings,
    calculateRoundScore,
    calculateJunctions,
    calculateRailwayPoints,
    calculateFinalScore
  };
})();
