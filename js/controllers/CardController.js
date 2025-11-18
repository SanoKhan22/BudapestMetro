

const CardController = (function() {
  
  
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
    const card = deck.shift();
    GameState.setDeck(deck);
    GameState.setCurrentCard(card);
    GameState.incrementDrawnCards(card.platformType);
    if (card.isSwitch()) {
      handleSwitchCard();
    }
    GameController.handleRoundEndCondition();
    
    return card;
  }
  
  
  function handleSwitchCard() {
    GameState.setSwitchActive(true);
    const deck = GameState.getDeck();
    if (deck.length > 0) {
      const secondCard = deck.shift();
      GameState.setDeck(deck);
      GameState.setCurrentCard(secondCard);
      GameState.incrementDrawnCards(secondCard.platformType);
    }
  }
  
  
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
