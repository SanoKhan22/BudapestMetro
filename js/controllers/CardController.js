/* Card Controller - Card drawing and deck management */

const CardController = (function() {
  
  /**
   * Initialize and shuffle deck
   */
  function initializeDeck() {
    const deck = CONSTANTS.DECK_COMPOSITION.map(cardData => 
      new Card(cardData.type, cardData.platformType)
    );
    
    const shuffledDeck = shuffleDeck(deck);
    GameState.setDeck(shuffledDeck);
    GameState.setCurrentCard(null);
    
    return shuffledDeck;
  }
  
  /**
   * Shuffle deck using Fisher-Yates algorithm
   * @param {Card[]} deck
   * @returns {Card[]}
   */
  function shuffleDeck(deck) {
    const shuffled = [...deck];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }
  
  /**
   * Draw a card from the deck
   * @returns {Card|null}
   */
  function drawCard() {
    const deck = GameState.getDeck();
    
    if (deck.length === 0) {
      console.warn('Deck is empty');
      return null;
    }
    
    // Draw card from deck
    const card = deck.shift();
    GameState.setDeck(deck);
    GameState.setCurrentCard(card);
    
    // Track drawn cards
    GameState.incrementDrawnCards(card.platformType);
    
    // Check if it's a Switch card
    if (card.isSwitch()) {
      handleSwitchCard();
    }
    
    // Check round end condition
    GameController.handleRoundEndCondition();
    
    return card;
  }
  
  /**
   * Handle Switch card - auto-draw second card
   */
  function handleSwitchCard() {
    GameState.setSwitchActive(true);
    
    // Auto-draw second card
    const deck = GameState.getDeck();
    if (deck.length > 0) {
      const secondCard = deck.shift();
      GameState.setDeck(deck);
      GameState.setCurrentCard(secondCard);
      
      // Track the second card
      GameState.incrementDrawnCards(secondCard.platformType);
    }
  }
  
  /**
   * Reset deck for new round
   */
  function resetDeck() {
    return initializeDeck();
  }
  
  /**
   * Get remaining cards in deck
   * @returns {number}
   */
  function getRemainingCards() {
    return GameState.getDeck().length;
  }
  
  /**
   * Check if deck is empty
   * @returns {boolean}
   */
  function isDeckEmpty() {
    return GameState.getDeck().length === 0;
  }
  
  // Public API
  return {
    initializeDeck,
    shuffleDeck,
    drawCard,
    handleSwitchCard,
    resetDeck,
    getRemainingCards,
    isDeckEmpty
  };
})();
