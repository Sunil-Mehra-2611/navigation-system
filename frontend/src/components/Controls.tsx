import React, { useState, useCallback } from 'react';
import { Direction } from '../types';
import socketService from '../services/socketService';

interface ControlsProps {
  isConnected: boolean;
  isAutoNavigating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ isConnected, isAutoNavigating }) => {
  const [targetX, setTargetX] = useState<string>('10');
  const [targetY, setTargetY] = useState<string>('10');

  const handleMove = useCallback(
    (direction: Direction) => {
      if (isConnected && !isAutoNavigating) {
        socketService.move(direction);
      }
    },
    [isConnected, isAutoNavigating]
  );

  const handleAutoNavigate = useCallback(() => {
    const x = parseInt(targetX, 10);
    const y = parseInt(targetY, 10);

    if (isNaN(x) || isNaN(y) || x < 0 || x >= 20 || y < 0 || y >= 20) {
      alert('Invalid coordinates. Please enter values between 0-19.');
      return;
    }

    if (isConnected) {
      socketService.autoNavigate(x, y);
    }
  }, [targetX, targetY, isConnected]);

  const handleReset = useCallback(() => {
    if (isConnected) {
      socketService.reset();
    }
  }, [isConnected]);

  const handleResetPath = useCallback(() => {
    if (isConnected) {
      socketService.resetPath();
    }
  }, [isConnected]);

  return (
    <div className="controls-container">
      <div className="controls-section">
        <h3>Movement Controls</h3>
        <div className="arrow-buttons">
          <button
            className="arrow-btn up-btn"
            onClick={() => handleMove(Direction.UP)}
            disabled={!isConnected || isAutoNavigating}
            title="Move Up (↑)"
          >
            ↑
          </button>
          <div className="horizontal-buttons">
            <button
              className="arrow-btn left-btn"
              onClick={() => handleMove(Direction.LEFT)}
              disabled={!isConnected || isAutoNavigating}
              title="Move Left (←)"
            >
              ←
            </button>
            <button
              className="arrow-btn down-btn"
              onClick={() => handleMove(Direction.DOWN)}
              disabled={!isConnected || isAutoNavigating}
              title="Move Down (↓)"
            >
              ↓
            </button>
            <button
              className="arrow-btn right-btn"
              onClick={() => handleMove(Direction.RIGHT)}
              disabled={!isConnected || isAutoNavigating}
              title="Move Right (→)"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <h3>Auto-Navigation</h3>
        <div className="auto-nav-inputs">
          <div className="input-group">
            <label>Target X:</label>
            <input
              type="number"
              min="0"
              max="19"
              value={targetX}
              onChange={(e) => setTargetX(e.target.value)}
              disabled={!isConnected || isAutoNavigating}
            />
          </div>
          <div className="input-group">
            <label>Target Y:</label>
            <input
              type="number"
              min="0"
              max="19"
              value={targetY}
              onChange={(e) => setTargetY(e.target.value)}
              disabled={!isConnected || isAutoNavigating}
            />
          </div>
        </div>
        <button
          className="action-btn navigate-btn"
          onClick={handleAutoNavigate}
          disabled={!isConnected || isAutoNavigating}
        >
          {isAutoNavigating ? 'Navigating...' : 'Navigate'}
        </button>
      </div>

      <div className="controls-section">
        <h3>Actions</h3>
        <button
          className="action-btn reset-path-btn"
          onClick={handleResetPath}
          disabled={!isConnected}
        >
          Reset Path
        </button>
        <button
          className="action-btn reset-btn"
          onClick={handleReset}
          disabled={!isConnected}
        >
          Reset Position
        </button>
      </div>

      <div className="connection-status">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
    </div>
  );
};

export default Controls;
