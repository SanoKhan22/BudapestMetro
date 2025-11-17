/* Geometry Utility - Grid geometry and line math */

const GeometryUtil = (function() {
  
  /**
   * Calculate Euclidean distance between two stations
   * @param {Station} station1
   * @param {Station} station2
   * @returns {number}
   */
  function getDistance(station1, station2) {
    const dx = station2.x - station1.x;
    const dy = station2.y - station1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Calculate Manhattan distance
   * @param {Station} station1
   * @param {Station} station2
   * @returns {number}
   */
  function getManhattanDistance(station1, station2) {
    return Math.abs(station2.x - station1.x) + Math.abs(station2.y - station1.y);
  }
  
  /**
   * Check if two stations are horizontally aligned
   * @param {Station} station1
   * @param {Station} station2
   * @returns {boolean}
   */
  function isHorizontal(station1, station2) {
    return station1.y === station2.y && station1.x !== station2.x;
  }
  
  /**
   * Check if two stations are vertically aligned
   * @param {Station} station1
   * @param {Station} station2
   * @returns {boolean}
   */
  function isVertical(station1, station2) {
    return station1.x === station2.x && station1.y !== station2.y;
  }
  
  /**
   * Check if two stations are at 45° diagonal
   * @param {Station} station1
   * @param {Station} station2
   * @returns {boolean}
   */
  function isDiagonal45(station1, station2) {
    const dx = Math.abs(station2.x - station1.x);
    const dy = Math.abs(station2.y - station1.y);
    return dx === dy && dx > 0;
  }
  
  /**
   * Get angle between two stations in degrees
   * @param {Station} station1
   * @param {Station} station2
   * @returns {number}
   */
  function getAngle(station1, station2) {
    const dx = station2.x - station1.x;
    const dy = station2.y - station1.y;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
  
  /**
   * Get all stations that lie on the line segment between two stations
   * @param {Station} from
   * @param {Station} to
   * @param {Station[]} allStations
   * @returns {Station[]}
   */
  function getStationsBetween(from, to, allStations) {
    const stationsBetween = [];
    
    allStations.forEach(station => {
      if (station.id === from.id || station.id === to.id) return;
      
      if (pointOnLineSegment(station, from, to)) {
        stationsBetween.push(station);
      }
    });
    
    return stationsBetween;
  }
  
  /**
   * Check if a point lies on a line segment
   * @param {Object} point - {x, y}
   * @param {Object} lineStart - {x, y}
   * @param {Object} lineEnd - {x, y}
   * @returns {boolean}
   */
  function pointOnLineSegment(point, lineStart, lineEnd) {
    // Check if point is within bounding box
    const minX = Math.min(lineStart.x, lineEnd.x);
    const maxX = Math.max(lineStart.x, lineEnd.x);
    const minY = Math.min(lineStart.y, lineEnd.y);
    const maxY = Math.max(lineStart.y, lineEnd.y);
    
    if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
      return false;
    }
    
    // Calculate cross product to check collinearity
    const crossProduct = (point.y - lineStart.y) * (lineEnd.x - lineStart.x) -
                        (point.x - lineStart.x) * (lineEnd.y - lineStart.y);
    
    // If cross product is 0, points are collinear
    return Math.abs(crossProduct) < 0.0001;
  }
  
  /**
   * Check if two line segments intersect
   * @param {Object} seg1 - {from: Station, to: Station}
   * @param {Object} seg2 - {from: Station, to: Station}
   * @returns {boolean}
   */
  function doSegmentsIntersect(seg1, seg2) {
    const p1 = seg1.from;
    const p2 = seg1.to;
    const p3 = seg2.from;
    const p4 = seg2.to;
    
    // Check if segments share an endpoint (allowed)
    if (p1.id === p3.id || p1.id === p4.id || p2.id === p3.id || p2.id === p4.id) {
      return false;
    }
    
    // Calculate direction of cross products
    const d1 = direction(p3, p4, p1);
    const d2 = direction(p3, p4, p2);
    const d3 = direction(p1, p2, p3);
    const d4 = direction(p1, p2, p4);
    
    // Segments intersect if they straddle each other
    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
      return true;
    }
    
    // Check for collinear cases
    if (d1 === 0 && onSegment(p3, p1, p4)) return true;
    if (d2 === 0 && onSegment(p3, p2, p4)) return true;
    if (d3 === 0 && onSegment(p1, p3, p2)) return true;
    if (d4 === 0 && onSegment(p1, p4, p2)) return true;
    
    return false;
  }
  
  /**
   * Calculate direction of point c relative to line ab
   * @param {Object} a
   * @param {Object} b
   * @param {Object} c
   * @returns {number}
   */
  function direction(a, b, c) {
    return (c.x - a.x) * (b.y - a.y) - (b.x - a.x) * (c.y - a.y);
  }
  
  /**
   * Check if point q lies on segment pr
   * @param {Object} p
   * @param {Object} q
   * @param {Object} r
   * @returns {boolean}
   */
  function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
           q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
  }
  
  // Public API
  return {
    getDistance,
    getManhattanDistance,
    isHorizontal,
    isVertical,
    isDiagonal45,
    getAngle,
    getStationsBetween,
    pointOnLineSegment,
    doSegmentsIntersect
  };
})();
