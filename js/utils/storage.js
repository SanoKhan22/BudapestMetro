/* Local Storage Utility */

const StorageUtil = (function() {
  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  function isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Public API
  return {
    /**
     * Save game result to localStorage
     * @param {string} name - Player name
     * @param {number} score - Final score
     * @param {number} time - Elapsed time in seconds
     */
    saveGameResult(name, score, time) {
      if (!isLocalStorageAvailable()) {
        console.warn('localStorage not available');
        return;
      }
      
      try {
        const results = this.loadGameResults();
        
        const newResult = {
          name: name,
          score: score,
          time: time,
          date: new Date().toISOString()
        };
        
        results.push(newResult);
        
        // Sort by score (descending)
        results.sort((a, b) => b.score - a.score);
        
        // Keep only top 50 results
        const topResults = results.slice(0, 50);
        
        localStorage.setItem(
          CONSTANTS.STORAGE_KEYS.GAME_RESULTS,
          JSON.stringify(topResults)
        );
      } catch (e) {
        console.error('Error saving game result:', e);
      }
    },
    
    /**
     * Load all game results from localStorage
     * @returns {Array} Array of {name, score, time, date}
     */
    loadGameResults() {
      if (!isLocalStorageAvailable()) {
        return [];
      }
      
      try {
        const data = localStorage.getItem(CONSTANTS.STORAGE_KEYS.GAME_RESULTS);
        if (!data) return [];
        
        const results = JSON.parse(data);
        return Array.isArray(results) ? results : [];
      } catch (e) {
        console.error('Error loading game results:', e);
        return [];
      }
    },
    
    /**
     * Clear all saved game results
     */
    clearGameResults() {
      if (!isLocalStorageAvailable()) {
        return;
      }
      
      try {
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.GAME_RESULTS);
      } catch (e) {
        console.error('Error clearing game results:', e);
      }
    },
    
    /**
     * Sort results by score (descending)
     * @param {Array} results
     * @returns {Array}
     */
    sortResultsByScore(results) {
      return [...results].sort((a, b) => b.score - a.score);
    }
  };
})();
