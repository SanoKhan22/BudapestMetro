/* Grid View - Handles grid and station rendering */

const GridView = (function() {
  // Cache DOM elements
  let elements = {};
  let svgNamespace = 'http://www.w3.org/2000/svg';
  
  /**
   * Initialize and cache DOM elements
   */
  function initElements() {
    elements = {
      gridContainer: document.querySelector('#grid-container')
    };
  }
  
  // Public API
  return {
    /**
     * Initialize grid view
     */
    initialize() {
      initElements();
    },
    
    /**
     * Render 10×10 grid with stations
     * @param {Station[]} stations - Array of station objects
     */
    renderGrid(stations) {
      if (!elements.gridContainer) return;
      
      // Create grid structure
      const gridHTML = `
        <div class="game-grid" id="game-grid">
          <div class="danube-river"></div>
          ${this.generateGridCells(stations)}
        </div>
        <svg id="segments-svg" class="segment-line" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
        </svg>
      `;
      
      elements.gridContainer.innerHTML = gridHTML;
    },
    
    /**
     * Generate grid cells HTML
     * @param {Station[]} stations
     * @returns {string}
     */
    generateGridCells(stations) {
      let cellsHTML = '';
      
      for (let y = 0; y < CONSTANTS.GRID_SIZE; y++) {
        for (let x = 0; x < CONSTANTS.GRID_SIZE; x++) {
          const station = stations.find(s => s.x === x && s.y === y);
          
          if (station) {
            cellsHTML += this.generateStationCell(station);
          } else {
            cellsHTML += `<div class="grid-cell" data-x="${x}" data-y="${y}"></div>`;
          }
        }
      }
      
      return cellsHTML;
    },
    
    /**
     * Generate station cell HTML
     * @param {Station} station
     * @returns {string}
     */
    generateStationCell(station) {
      const startingStations = {
        19: 'M1',
        28: 'M2',
        3: 'M3',
        39: 'M4'
      };
      
      const startClass = startingStations[station.id] 
        ? `start-${startingStations[station.id].toLowerCase()}` 
        : '';
      
      const jokerClass = station.isJoker() ? 'joker' : '';
      const trainIcon = station.train ? '<span class="train-icon">🚂</span>' : '';
      const letter = station.isJoker() ? '?' : station.type;
      
      return `
        <div class="grid-cell" data-x="${station.x}" data-y="${station.y}">
          <div class="station ${startClass} ${jokerClass}" 
               data-station-id="${station.id}">
            ${letter}
            ${trainIcon}
          </div>
        </div>
      `;
    },
    
    /**
     * Render a single station
     * @param {Station} station
     * @param {HTMLElement} cell
     */
    renderStation(station, cell) {
      if (!cell) return;
      
      const startingStations = {
        19: 'M1',
        28: 'M2',
        3: 'M3',
        39: 'M4'
      };
      
      const startClass = startingStations[station.id] 
        ? `start-${startingStations[station.id].toLowerCase()}` 
        : '';
      
      const jokerClass = station.isJoker() ? 'joker' : '';
      const trainIcon = station.train ? '<span class="train-icon">🚂</span>' : '';
      const letter = station.isJoker() ? '?' : station.type;
      
      cell.innerHTML = `
        <div class="station ${startClass} ${jokerClass}" 
             data-station-id="${station.id}">
          ${letter}
          ${trainIcon}
        </div>
      `;
    },
    
    /**
     * Draw segment line between two stations
     * @param {number} fromId - Starting station ID
     * @param {number} toId - Target station ID
     * @param {string} color - Line color
     * @param {string} lineName - Line name (M1, M2, M3, M4)
     */
    renderSegment(fromId, toId, color, lineName) {
      const svg = document.querySelector('#segments-svg');
      if (!svg) return;
      
      const fromStation = GameState.getStationById(fromId);
      const toStation = GameState.getStationById(toId);
      
      if (!fromStation || !toStation) return;
      
      // Calculate positions (center of cells)
      const grid = document.querySelector('#game-grid');
      if (!grid) return;
      
      const gridRect = grid.getBoundingClientRect();
      const cellSize = gridRect.width / CONSTANTS.GRID_SIZE;
      
      const x1 = (fromStation.x + 0.5) * cellSize;
      const y1 = (fromStation.y + 0.5) * cellSize;
      const x2 = (toStation.x + 0.5) * cellSize;
      const y2 = (toStation.y + 0.5) * cellSize;
      
      // Create line element
      const line = document.createElementNS(svgNamespace, 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('class', `segment-${lineName.toLowerCase()}`);
      line.setAttribute('data-from', fromId);
      line.setAttribute('data-to', toId);
      
      svg.appendChild(line);
    },
    
    /**
     * Highlight valid target stations
     * @param {number[]} stationIds - Array of valid station IDs
     */
    highlightValidMoves(stationIds) {
      // Clear previous highlights
      this.clearHighlights();
      
      stationIds.forEach(id => {
        const stationEl = document.querySelector(`[data-station-id="${id}"]`);
        if (stationEl) {
          const cell = stationEl.closest('.grid-cell');
          if (cell) {
            cell.classList.add('valid-target');
          }
        }
      });
    },
    
    /**
     * Highlight invalid move
     * @param {number} fromId
     * @param {number} toId
     */
    highlightInvalidMove(fromId, toId) {
      const toStationEl = document.querySelector(`[data-station-id="${toId}"]`);
      if (toStationEl) {
        const cell = toStationEl.closest('.grid-cell');
        if (cell) {
          cell.classList.add('invalid-target');
          setTimeout(() => {
            cell.classList.remove('invalid-target');
          }, 1000);
        }
      }
    },
    
    /**
     * Clear all highlights
     */
    clearHighlights() {
      const cells = document.querySelectorAll('.grid-cell');
      cells.forEach(cell => {
        cell.classList.remove('valid-target', 'invalid-target', 'selected');
      });
    },
    
    /**
     * Mark station as selected
     * @param {number} stationId
     */
    selectStation(stationId) {
      const stationEl = document.querySelector(`[data-station-id="${stationId}"]`);
      if (stationEl) {
        const cell = stationEl.closest('.grid-cell');
        if (cell) {
          cell.classList.add('selected');
        }
      }
    },
    
    /**
     * Update station visual state (visited, endpoint, junction)
     * @param {number} stationId
     * @param {Station} station
     */
    updateStationState(stationId, station) {
      const stationEl = document.querySelector(`[data-station-id="${stationId}"]`);
      if (!stationEl) return;
      
      // Remove old state classes
      stationEl.classList.remove('visited', 'visited-m1', 'visited-m2', 'visited-m3', 'visited-m4', 
                                 'endpoint', 'junction-2', 'junction-3', 'junction-4');
      
      // Add visited classes
      if (station.visitedBy.length > 0) {
        stationEl.classList.add('visited');
        station.visitedBy.forEach(lineId => {
          const lineName = CONSTANTS.LINE_NAMES[lineId];
          stationEl.classList.add(`visited-${lineName.toLowerCase()}`);
        });
      }
      
      // Add junction classes
      const visitorCount = station.getVisitorCount();
      if (visitorCount === 2) {
        stationEl.classList.add('junction-2');
      } else if (visitorCount === 3) {
        stationEl.classList.add('junction-3');
      } else if (visitorCount === 4) {
        stationEl.classList.add('junction-4');
      }
    },
    
    /**
     * Highlight endpoints of current line
     * @param {number[]} endpointIds
     */
    highlightEndpoints(endpointIds) {
      // Remove old endpoint highlights
      const oldEndpoints = document.querySelectorAll('.station.endpoint');
      oldEndpoints.forEach(el => el.classList.remove('endpoint'));
      
      // Add new endpoint highlights
      endpointIds.forEach(id => {
        const stationEl = document.querySelector(`[data-station-id="${id}"]`);
        if (stationEl) {
          stationEl.classList.add('endpoint');
        }
      });
    },
    
    /**
     * Get station element by ID
     * @param {number} stationId
     * @returns {HTMLElement|null}
     */
    getStationElement(stationId) {
      return document.querySelector(`[data-station-id="${stationId}"]`);
    },
    
    /**
     * Attach grid event listeners
     * @param {Function} onStationClick - Handler for station clicks
     */
    attachGridListeners(onStationClick) {
      const grid = document.querySelector('#game-grid');
      if (!grid) return;
      
      // Use event delegation for station clicks
      grid.addEventListener('click', (e) => {
        const stationEl = e.target.closest('.station');
        if (stationEl) {
          const stationId = parseInt(stationEl.dataset.stationId);
          if (!isNaN(stationId)) {
            onStationClick(stationId);
          }
        }
      });
    }
  };
})();
