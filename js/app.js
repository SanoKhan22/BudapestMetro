/* Application Entry Point */

(function() {
  'use strict';
  
  // Initialize when DOM is ready
  // Note: We use a simple check instead of DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('readystatechange', function() {
      if (document.readyState === 'interactive') {
        init();
      }
    });
  } else {
    init();
  }
  
  /**
   * Initialize application
   */
  function init() {
    // Initialize views
    MenuView.initialize();
    GridView.initialize();
    GameView.initialize();
    
    // Show menu screen
    showScreen('menu');
    
    // Attach menu event handlers
    MenuView.attachEventListeners({
      onStartGame: handleStartGame,
      onShowRules: () => MenuView.showRulesModal(),
      onCloseRules: () => MenuView.hideRulesModal(),
      onShowLeaderboard: handleShowLeaderboard,
      onCloseLeaderboard: () => MenuView.hideLeaderboardModal()
    });
    
    // Attach game event handlers
    GameView.attachEventListeners({
      onDrawCard: handleDrawCard,
      onSkipCard: handleSkipCard,
      onEndRound: handleEndRound,
      onBackToMenu: handleBackToMenu
    });
    
    // Add blue heart click handler (hidden requirement)
    const heart = document.querySelector('body');
    if (heart) {
      const heartEmoji = Array.from(heart.childNodes).find(
        node => node.nodeType === Node.TEXT_NODE && node.textContent.includes('💙')
      );
      if (heartEmoji) {
        const span = document.createElement('span');
        span.textContent = '💙';
        span.style.cursor = 'pointer';
        span.style.position = 'fixed';
        span.style.bottom = '10px';
        span.style.right = '10px';
        span.style.fontSize = '24px';
        span.style.zIndex = '9999';
        
        let colors = ['💙', '❤️', '💚', '💛', '💜', '🧡'];
        let colorIndex = 0;
        
        span.addEventListener('click', () => {
          colorIndex = (colorIndex + 1) % colors.length;
          span.textContent = colors[colorIndex];
        });
        
        document.body.appendChild(span);
      }
    }
  }
  
  /**
   * Show specific screen
   * @param {string} screenName - 'menu' or 'game'
   */
  function showScreen(screenName) {
    const menuScreen = document.querySelector('#menu-screen');
    const gameScreen = document.querySelector('#game-screen');
    
    if (screenName === 'menu') {
      if (menuScreen) menuScreen.classList.remove('hidden');
      if (gameScreen) gameScreen.classList.add('hidden');
    } else if (screenName === 'game') {
      if (menuScreen) menuScreen.classList.add('hidden');
      if (gameScreen) gameScreen.classList.remove('hidden');
    }
  }
  
  /**
   * Handle start game button
   */
  function handleStartGame() {
    const playerName = MenuView.getPlayerName();
    
    // Hide menu, show game
    showScreen('game');
    
    // Initialize game
    GameController.initializeGame(playerName, CONSTANTS.GAME_MODES.SIMPLE)
      .then(success => {
        if (success) {
          // Render grid with stations
          const stations = GameState.getAllStations();
          GridView.renderGrid(stations);
          
          // Update game info
          updateGameInfo();
          
          // TODO: Attach game event listeners
          console.log('Game initialized successfully!');
        } else {
          console.error('Failed to initialize game');
        }
      });
  }
  
  /**
   * Handle show leaderboard
   */
  function handleShowLeaderboard() {
    const results = StorageUtil.loadGameResults();
    MenuView.renderLeaderboard(results);
    MenuView.showLeaderboardModal();
  }
  
  /**
   * Update game info display
   */
  function updateGameInfo() {
    // Update player name
    const playerNameEl = document.querySelector('#player-name-display');
    if (playerNameEl) {
      playerNameEl.textContent = GameState.getPlayerName();
    }
    
    // Update current line
    updateCurrentLineDisplay();
    
    // Start timer update
    setInterval(updateTimer, 1000);
  }
  
  /**
   * Update timer display
   */
  function updateTimer() {
    const timerEl = document.querySelector('#timer-display');
    if (timerEl) {
      const seconds = GameState.getElapsedTime();
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }
  
  /**
   * Update current line display
   */
  function updateCurrentLineDisplay() {
    const currentLine = GameState.getCurrentLine();
    GameView.updateCurrentLine(currentLine);
    
    // Display round order
    const roundOrder = GameState.getRoundOrder();
    const currentIndex = GameState.getCurrentRoundIndex();
    GameView.displayRoundOrder(roundOrder, currentIndex);
    GameView.updateRoundNumber(currentIndex);
  }
  
  /**
   * Handle draw card
   */
  function handleDrawCard() {
    const card = CardController.drawCard();
    if (card) {
      GameView.updateCardDisplay(card);
      console.log('Drew card:', card.type, card.platformType);
    }
  }
  
  /**
   * Handle skip card
   */
  function handleSkipCard() {
    handleDrawCard();
  }
  
  /**
   * Handle end round
   */
  function handleEndRound() {
    GameController.endRound();
    updateCurrentLineDisplay();
    GameView.updateCardDisplay(null);
    GameView.toggleEndRoundButton(false);
  }
  
  /**
   * Handle back to menu
   */
  function handleBackToMenu() {
    // TODO: Add custom modal confirmation instead of confirm()
    // For now, just return to menu
    GameState.stopTimer();
    showScreen('menu');
  }
  
})();
