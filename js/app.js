

(function() {
  'use strict';
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
  
  
  function init() {
    MenuView.initialize();
    GridView.initialize();
    GameView.initialize();
    showScreen('menu');
    MenuView.attachEventListeners({
      onStartGame: handleStartGame,
      onShowRules: () => MenuView.showRulesModal(),
      onCloseRules: () => MenuView.hideRulesModal(),
      onShowLeaderboard: handleShowLeaderboard,
      onCloseLeaderboard: () => MenuView.hideLeaderboardModal()
    });
    GameView.attachEventListeners({
      onDrawCard: handleDrawCard,
      onSkipCard: handleSkipCard,
      onEndRound: handleEndRound,
      onBackToMenu: handleBackToMenu
    });
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
  
  
  function handleStartGame() {
    const playerName = MenuView.getPlayerName();
    showScreen('game');
    GameController.initializeGame(playerName, CONSTANTS.GAME_MODES.SIMPLE)
      .then(success => {
        if (success) {
          const stations = GameState.getAllStations();
          GridView.renderGrid(stations);
          GridView.attachGridListeners(SegmentController.handleStationClick);
          updateGameInfo();
          const currentLine = GameState.getCurrentLine();
          if (currentLine) {
            GridView.highlightEndpoints(currentLine.getEndpoints());
          }
          
          console.log('Game initialized successfully!');
        } else {
          console.error('Failed to initialize game');
        }
      });
  }
  
  
  function handleShowLeaderboard() {
    const results = StorageUtil.loadGameResults();
    MenuView.renderLeaderboard(results);
    MenuView.showLeaderboardModal();
  }
  
  
  function updateGameInfo() {
    const playerNameEl = document.querySelector('#player-name-display');
    if (playerNameEl) {
      playerNameEl.textContent = GameState.getPlayerName();
    }
    updateCurrentLineDisplay();
    setInterval(updateTimer, 1000);
  }
  
  
  function updateTimer() {
    const timerEl = document.querySelector('#timer-display');
    if (timerEl) {
      const seconds = GameState.getElapsedTime();
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }
  
  
  function updateCurrentLineDisplay() {
    const currentLine = GameState.getCurrentLine();
    GameView.updateCurrentLine(currentLine);
    const roundOrder = GameState.getRoundOrder();
    const currentIndex = GameState.getCurrentRoundIndex();
    GameView.displayRoundOrder(roundOrder, currentIndex);
    GameView.updateRoundNumber(currentIndex);
  }
  
  
  function handleRoundTransition() {
    updateCurrentLineDisplay();
    GameView.updateCardDisplay(null);
    GridView.clearHighlights();
    const currentLine = GameState.getCurrentLine();
    if (currentLine) {
      GridView.highlightEndpoints(currentLine.getEndpoints());
    }
    const drawnCards = GameState.getDrawnCards();
    ScoreView.displayRoundProgress(drawnCards);
    
    console.log(`Round ${GameState.getCurrentRoundIndex() + 1} started - ${currentLine.name}`);
  }
  
  
  function handleDrawCard() {
    const card = CardController.drawCard();
    if (card) {
      GameView.updateCardDisplay(card);
      const drawnCards = GameState.getDrawnCards();
      ScoreView.displayRoundProgress(drawnCards);
      
      console.log('Drew card:', card.type, card.platformType);
    }
  }
  
  
  function handleSkipCard() {
    const currentCard = GameState.getCurrentCard();
    if (!currentCard) {
      console.warn('No card to skip');
      return;
    }
    handleDrawCard();
    console.log('Skipped card, drew new card');
  }
  
  
  function handleEndRound() {
    GameController.endRound();
    if (!GameState.isGameComplete()) {
      updateCurrentLineDisplay();
      GameView.updateCardDisplay(null);
      GameView.toggleEndRoundButton(false);
      ScoreView.clearScoreDisplay();
      const currentLine = GameState.getCurrentLine();
      if (currentLine) {
        GridView.highlightEndpoints(currentLine.getEndpoints());
      }
      
      console.log('New round started!');
    }
  }
  
  
  function handleBackToMenu() {
    // TODO: Add custom modal confirmation instead of confirm()
    GameState.stopTimer();
    showScreen('menu');
  }
  
})();
