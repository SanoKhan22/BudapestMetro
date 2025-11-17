/* Metro Line Model */

class MetroLine {
  constructor(data) {
    this.id = data.id;
    this.name = data.name; // 'M1', 'M2', 'M3', 'M4'
    this.color = data.color; // Hex color
    this.startStationId = data.start;
    this.segments = []; // Array of {from: stationId, to: stationId}
    this.endpoints = [data.start]; // Array of station IDs (starts with starting station)
    this.visitedStations = new Set([data.start]); // Set of station IDs
    this.ability = null; // For abilities mode
    this.abilityUsed = false;
  }
  
  /**
   * Add a segment to this line
   * @param {number} fromId - Starting station ID
   * @param {number} toId - Target station ID
   */
  addSegment(fromId, toId) {
    this.segments.push({ from: fromId, to: toId });
    this.visitedStations.add(fromId);
    this.visitedStations.add(toId);
    this.updateEndpoints(fromId, toId);
  }
  
  /**
   * Update endpoints after adding a segment
   * @param {number} fromId - Starting station ID
   * @param {number} toId - Target station ID
   */
  updateEndpoints(fromId, toId) {
    // Remove fromId if it was an endpoint (unless it's a branch point)
    const fromIndex = this.endpoints.indexOf(fromId);
    if (fromIndex > -1) {
      // Check if fromId is used in multiple segments (branch point)
      const segmentsFromStation = this.segments.filter(
        seg => seg.from === fromId || seg.to === fromId
      );
      
      // If only used in one segment (the one we just added), remove as endpoint
      if (segmentsFromStation.length === 1) {
        this.endpoints.splice(fromIndex, 1);
      }
    }
    
    // Add toId as new endpoint if not already there
    if (!this.endpoints.includes(toId)) {
      this.endpoints.push(toId);
    }
  }
  
  /**
   * Check if a station has been visited by this line
   * @param {number} stationId
   * @returns {boolean}
   */
  hasVisited(stationId) {
    return this.visitedStations.has(stationId);
  }
  
  /**
   * Get array of endpoint station IDs
   * @returns {number[]}
   */
  getEndpoints() {
    return [...this.endpoints];
  }
  
  /**
   * Get number of segments
   * @returns {number}
   */
  getSegmentCount() {
    return this.segments.length;
  }
  
  /**
   * Get array of all visited station IDs
   * @returns {number[]}
   */
  getAllStations() {
    return Array.from(this.visitedStations);
  }
  
  /**
   * Check if station is an endpoint
   * @param {number} stationId
   * @returns {boolean}
   */
  isEndpoint(stationId) {
    return this.endpoints.includes(stationId);
  }
}
