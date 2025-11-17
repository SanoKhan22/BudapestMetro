/* Game Constants */

const CONSTANTS = {
  // Grid
  GRID_SIZE: 10,
  
  // Deck Composition
  DECK_COMPOSITION: [
    // Side platform cards (5)
    { type: 'A', platformType: 'side' },
    { type: 'B', platformType: 'side' },
    { type: 'C', platformType: 'side' },
    { type: 'D', platformType: 'side' },
    { type: 'JOKER', platformType: 'side' },
    
    // Center platform cards (6)
    { type: 'A', platformType: 'center' },
    { type: 'B', platformType: 'center' },
    { type: 'C', platformType: 'center' },
    { type: 'D', platformType: 'center' },
    { type: 'JOKER', platformType: 'center' },
    { type: 'SWITCH', platformType: 'center' }
  ],
  
  // Railway Station Scoring Scale
  RAILWAY_SCORING: [0, 1, 2, 4, 6, 8, 11, 14, 17, 21, 25],
  
  // Junction Points
  JUNCTION_POINTS: {
    P2: 2,  // 2 lines
    P3: 5,  // 3 lines
    P4: 9   // 4 lines
  },
  
  // Game Modes
  GAME_MODES: {
    SIMPLE: 'simple',
    PLATFORM_ENDING: 'platform-ending',
    ABILITIES: 'abilities'
  },
  
  // Round Ending
  SIMPLE_ROUND_LENGTH: 8,
  PLATFORM_TYPE_LIMIT: 5,
  
  // Metro Line Colors
  LINE_COLORS: {
    M1: '#FFD800',
    M2: '#E41F18',
    M3: '#005CA5',
    M4: '#4CA22F'
  },
  
  // Metro Line Names
  LINE_NAMES: {
    0: 'M1',
    1: 'M2',
    2: 'M3',
    3: 'M4'
  },
  
  // Abilities
  ABILITIES: {
    DOUBLE_DRAW: 'double_draw',
    JOKER: 'joker',
    SWITCH: 'switch',
    HEAVY_TRAFFIC: 'heavy_traffic'
  },
  
  // Ability Names (for display)
  ABILITY_NAMES: {
    double_draw: 'Double Draw',
    joker: 'Joker',
    switch: 'Switch',
    heavy_traffic: 'Heavy Traffic'
  },
  
  // Railway Station IDs
  RAILWAY_STATIONS: [9, 25, 33, 36, 48],
  
  // Joker Station ID
  JOKER_STATION_ID: 30,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    GAME_RESULTS: 'budapest_metro_results'
  }
};
