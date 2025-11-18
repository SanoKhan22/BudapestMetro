

const GameView = (function() {
  let elements = {};
  
  
  function initElements() {
    elements = {
      gameScreen: document.querySelector('#game-screen'),
      playerNameDisplay: document.querySelector('#player-name-display'),
      timerDisplay: document.querySelector('#timer-display'),
      currentLineDisplay: document.querySelector('#current-line-display'),
      roundNumber: document.querySelector('#round-number'),
      roundOrderDisplay: document.querySelector('#round-order-display'),
      cardDisplay: document.querySelector('#card-display'),
      drawCardBtn: document.querySelector('#draw-card-btn'),
      skipCardBtn: document.querySelector('#skip-card-btn'),
      endRoundBtn: document.querySelector('#end-round-btn'),
      backToMenuBtn: document.querySelector('#back-to-menu-btn'),
      scoreDisplay: document.querySelector('#score-display')
    };
  }
  return {
    
    initialize() {
      initElements();
    },
    
    
    showGame() {
      if (elements.gameScreen) {
        elements.gameScreen.classList.remove('hidden');
      }
    },
    
    
    hideGame() {
      if (elements.gameScreen) {
        elements.gameScreen.classList.add('hidden');
      }
    },
    
    /**
     * Update player name display
     * @param {string} name
     */
    updatePlayerName(name) {
      if (elements.playerNameDisplay) {
        elements.playerNameDisplay.textContent = name;
      }
    },
    
    /**
     * Update timer display
     * @param {number} seconds
     */
    updateTimer(seconds) {
      if (elements.timerDisplay) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        elements.timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      }
    },
    
    /**
     * Update current line display
     * @param {MetroLine} line
     */
    updateCurrentLine(line) {
      if (elements.currentLineDisplay && line) {
        elements.currentLineDisplay.textContent = line.name;
        elements.currentLineDisplay.style.backgroundColor = line.color;
      }
    },
    
    /**
     * Update round number
     * @param {number} roundIndex
     */
    updateRoundNumber(roundIndex) {
      if (elements.roundNumber) {
        elements.roundNumber.textContent = roundIndex + 1;
      }
    },
    
    /**
     * Display round order
     * @param {number[]} roundOrder
     * @param {number} currentIndex
     */
    displayRoundOrder(roundOrder, currentIndex) {
      if (!elements.roundOrderDisplay) return;
      
      const html = roundOrder.map((lineId, index) => {
        const lineName = CONSTANTS.LINE_NAMES[lineId];
        const color = CONSTANTS.LINE_COLORS[lineName];
        const classes = ['round-indicator'];
        
        if (index === currentIndex) classes.push('current');
        if (index < currentIndex) classes.push('completed');
        
        return `
          <div class="${classes.join(' ')}" style="background-color: ${color}">
            ${lineName}
          </div>
        `;
      }).join('');
      
      elements.roundOrderDisplay.innerHTML = html;
    },
    
    /**
     * Update card display
     * @param {Card} card
     */
    updateCardDisplay(card) {
      if (!elements.cardDisplay) return;
      
      if (!card) {
        elements.cardDisplay.innerHTML = '<div class="card-placeholder">Draw a card to start</div>';
        return;
      }
      
      const platformClass = card.isCenterPlatform() ? 'center-platform' : 'side-platform';
      const letter = card.isSwitch() ? '⚡' : card.type;
      
      const html = `
        <div class="card ${platformClass}">
          <div class="card-tracks">
            <div class="track"></div>
            <div class="track"></div>
          </div>
          <div class="card-people">
            <span>👤</span>
            <span>👤</span>
            <span>👤</span>
            <span>👤</span>
          </div>
          <div class="card-letter">${letter}</div>
        </div>
      `;
      
      elements.cardDisplay.innerHTML = html;
    },
    
    /**
     * Show/hide end round button
     * @param {boolean} show
     */
    toggleEndRoundButton(show) {
      if (elements.endRoundBtn) {
        if (show) {
          elements.endRoundBtn.classList.remove('hidden');
        } else {
          elements.endRoundBtn.classList.add('hidden');
        }
      }
    },
    
    /**
     * Attach event listeners
     * @param {Object} handlers
     */
    attachEventListeners(handlers) {
      if (elements.drawCardBtn && handlers.onDrawCard) {
        elements.drawCardBtn.addEventListener('click', handlers.onDrawCard);
      }
      
      if (elements.skipCardBtn && handlers.onSkipCard) {
        elements.skipCardBtn.addEventListener('click', handlers.onSkipCard);
      }
      
      if (elements.endRoundBtn && handlers.onEndRound) {
        elements.endRoundBtn.addEventListener('click', handlers.onEndRound);
      }
      
      if (elements.backToMenuBtn && handlers.onBackToMenu) {
        elements.backToMenuBtn.addEventListener('click', handlers.onBackToMenu);
      }
    }
  };
})();
