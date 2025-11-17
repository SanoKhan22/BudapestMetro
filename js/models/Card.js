/* Card Model */

class Card {
  constructor(type, platformType) {
    this.type = type; // 'A', 'B', 'C', 'D', 'JOKER', 'SWITCH'
    this.platformType = platformType; // 'side' or 'center'
  }
  
  /**
   * Check if this is a Switch card
   * @returns {boolean}
   */
  isSwitch() {
    return this.type === 'SWITCH';
  }
  
  /**
   * Check if this is a Joker card
   * @returns {boolean}
   */
  isJoker() {
    return this.type === 'JOKER';
  }
  
  /**
   * Check if this is a center platform card
   * @returns {boolean}
   */
  isCenterPlatform() {
    return this.platformType === 'center';
  }
  
  /**
   * Check if this is a side platform card
   * @returns {boolean}
   */
  isSidePlatform() {
    return this.platformType === 'side';
  }
}
