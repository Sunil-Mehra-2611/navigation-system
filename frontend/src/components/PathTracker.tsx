import React, { useMemo } from 'react';
import { Position } from '../types';

interface PathTrackerProps {
  path: Position[];
}

const PathTracker: React.FC<PathTrackerProps> = ({ path }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    if (path.length === 0) {
      return { distance: 0, uniquePositions: 0, efficiency: 0 };
    }

    let distance = 0;
    for (let i = 1; i < path.length; i++) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      distance += Math.sqrt(dx * dx + dy * dy);
    }

    const uniquePositions = new Set(path.map((p) => `${p.x},${p.y}`)).size;

    // Efficiency: straight line distance vs actual distance
    const startPos = path[0];
    const endPos = path[path.length - 1];
    const straightLineDistance = Math.sqrt(
      Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
    );
    const efficiency =
      distance > 0 ? Math.round((straightLineDistance / distance) * 100) : 0;

    return {
      distance: distance.toFixed(2),
      uniquePositions,
      efficiency,
    };
  }, [path]);

  // Get last 10 positions for display
  const recentPositions = useMemo(() => {
    return path.slice(-10);
  }, [path]);

  return (
    <div className="path-tracker">
      <h3>Path Tracker</h3>

      <div className="tracker-stats">
        <div className="stat-item">
          <span className="stat-label">Total Steps:</span>
          <span className="stat-value">{path.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Distance:</span>
          <span className="stat-value">{stats.distance}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Unique Positions:</span>
          <span className="stat-value">{stats.uniquePositions}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Efficiency:</span>
          <span className="stat-value">{stats.efficiency}%</span>
        </div>
      </div>

      <div className="recent-positions">
        <h4>Recent Positions</h4>
        <div className="position-list">
          {recentPositions.length === 0 ? (
            <div className="empty-message">No positions yet</div>
          ) : (
            recentPositions.map((pos, index) => (
              <div key={index} className="position-item">
                <span className="position-index">{path.length - recentPositions.length + index + 1}</span>
                <span className="position-coords">
                  ({pos.x}, {pos.y})
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PathTracker;
