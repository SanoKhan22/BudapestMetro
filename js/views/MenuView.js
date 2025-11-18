

const MenuView = (function() {
  let elements = {};
  
  
  function initElements() {
    elements = {
      menuScreen: document.querySelector('#menu-screen'),
      playerNameInput: document.querySelector('#player-name-input'),
      startGameBtn: document.querySelector('#start-game-btn'),
      rulesBtn: document.querySelector('#rules-btn'),
      leaderboardBtn: document.querySelector('#leaderboard-btn'),
      rulesModal: document.querySelector('#rules-modal'),
      closeRulesBtn: document.querySelector('#close-rules-btn'),
      leaderboardModal: document.querySelector('#leaderboard-modal'),
      closeLeaderboardBtn: document.querySelector('#close-leaderboard-btn'),
      leaderboardContent: document.querySelector('#leaderboard-content')
    };
  }
  return {
    
    initialize() {
      initElements();
    },
    
    
    render() {
      this.showMenu();
    },
    
    
    showMenu() {
      if (elements.menuScreen) {
        elements.menuScreen.classList.remove('hidden');
      }
    },
    
    
    hideMenu() {
      if (elements.menuScreen) {
        elements.menuScreen.classList.add('hidden');
      }
    },
    
    /**
     * Get player name from input
     * @returns {string}
     */
    getPlayerName() {
      const name = elements.playerNameInput ? elements.playerNameInput.value.trim() : '';
      return name || 'Player';
    },
    
    
    clearPlayerName() {
      if (elements.playerNameInput) {
        elements.playerNameInput.value = '';
      }
    },
    
    
    showRulesModal() {
      if (elements.rulesModal) {
        elements.rulesModal.classList.remove('hidden');
      }
    },
    
    
    hideRulesModal() {
      if (elements.rulesModal) {
        elements.rulesModal.classList.add('hidden');
      }
    },
    
    
    showLeaderboardModal() {
      if (elements.leaderboardModal) {
        elements.leaderboardModal.classList.remove('hidden');
      }
    },
    
    
    hideLeaderboardModal() {
      if (elements.leaderboardModal) {
        elements.leaderboardModal.classList.add('hidden');
      }
    },
    
    /**
     * Render leaderboard with game results
     * @param {Array} results - Array of {name, score, time, date}
     */
    renderLeaderboard(results) {
      if (!elements.leaderboardContent) return;
      
      if (!results || results.length === 0) {
        elements.leaderboardContent.innerHTML = `
          <div class="leaderboard-empty">
            No games played yet. Start a new game to see your results here!
          </div>
        `;
        return;
      }
      
      const tableHTML = `
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${results.map((result, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${this.escapeHtml(result.name)}</td>
                <td><strong>${result.score}</strong></td>
                <td>${this.formatTime(result.time)}</td>
                <td>${this.formatDate(result.date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      elements.leaderboardContent.innerHTML = tableHTML;
    },
    
    /**
     * Format time in seconds to MM:SS
     * @param {number} seconds
     * @returns {string}
     */
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Format date to readable string
     * @param {string} dateString
     * @returns {string}
     */
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} text
     * @returns {string}
     */
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
    
    /**
     * Attach event listeners
     * @param {Object} handlers - Object with handler functions
     */
    attachEventListeners(handlers) {
      if (elements.startGameBtn && handlers.onStartGame) {
        elements.startGameBtn.addEventListener('click', handlers.onStartGame);
      }
      if (elements.rulesBtn && handlers.onShowRules) {
        elements.rulesBtn.addEventListener('click', handlers.onShowRules);
      }
      if (elements.closeRulesBtn && handlers.onCloseRules) {
        elements.closeRulesBtn.addEventListener('click', handlers.onCloseRules);
      }
      if (elements.leaderboardBtn && handlers.onShowLeaderboard) {
        elements.leaderboardBtn.addEventListener('click', handlers.onShowLeaderboard);
      }
      if (elements.closeLeaderboardBtn && handlers.onCloseLeaderboard) {
        elements.closeLeaderboardBtn.addEventListener('click', handlers.onCloseLeaderboard);
      }
      if (elements.rulesModal && handlers.onCloseRules) {
        elements.rulesModal.addEventListener('click', (e) => {
          if (e.target === elements.rulesModal) {
            handlers.onCloseRules();
          }
        });
      }
      
      if (elements.leaderboardModal && handlers.onCloseLeaderboard) {
        elements.leaderboardModal.addEventListener('click', (e) => {
          if (e.target === elements.leaderboardModal) {
            handlers.onCloseLeaderboard();
          }
        });
      }
      if (elements.playerNameInput && handlers.onStartGame) {
        elements.playerNameInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            handlers.onStartGame();
          }
        });
      }
    }
  };
})();
