

class Station {
  constructor(data) {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.type = data.type; // 'A', 'B', 'C', 'D', '?'
    this.train = data.train || false;
    this.side = data.side; // 'Buda' or 'Pest'
    this.district = data.district;
    this.visitedBy = []; // Array of line IDs
    this.isHeavyTraffic = false; // For abilities mode
  }
  
  /**
   * Check if this station is a Joker station
   * @returns {boolean}
   */
  isJoker() {
    return this.type === '?' || this.id === CONSTANTS.JOKER_STATION_ID;
  }
  
  /**
   * Check if this station matches a card type
   * @param {string} cardType - Card type ('A', 'B', 'C', 'D', 'JOKER')
   * @returns {boolean}
   */
  matchesCard(cardType) {
    if (this.isJoker()) return true;
    if (cardType === 'JOKER') return true;
    return this.type === cardType;
  }
  
  /**
   * Add a line ID to visitedBy array
   * @param {number} lineId
   */
  addVisitor(lineId) {
    if (!this.visitedBy.includes(lineId)) {
      this.visitedBy.push(lineId);
    }
  }
  
  /**
   * Get number of lines visiting this station
   * @returns {number}
   */
  getVisitorCount() {
    return this.visitedBy.length;
  }
  
  /**
   * Check if visited by specific line
   * @param {number} lineId
   * @returns {boolean}
   */
  isVisitedBy(lineId) {
    return this.visitedBy.includes(lineId);
  }
}
