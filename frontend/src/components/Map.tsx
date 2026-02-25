import React, { useMemo } from 'react';
import { NavigationState, GRID_SIZE, CELL_SIZE, Direction } from '../types';

interface MapProps {
  state: NavigationState;
}

const Map: React.FC<MapProps> = ({ state }) => {
  const mapWidth = GRID_SIZE * CELL_SIZE;
  const mapHeight = GRID_SIZE * CELL_SIZE;

  // Get rotation angle based on direction
  const getRotation = (direction: Direction): number => {
    switch (direction) {
      case Direction.UP:
        return 0;
      case Direction.RIGHT:
        return 90;
      case Direction.DOWN:
        return 180;
      case Direction.LEFT:
        return 270;
      default:
        return 0;
    }
  };

  // Memoize grid cells
  const gridCells = useMemo(() => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        cells.push(
          <div
            key={`${x}-${y}`}
            className="grid-cell"
            style={{
              left: `${x * CELL_SIZE}px`,
              top: `${y * CELL_SIZE}px`,
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
            }}
          />
        );
      }
    }
    return cells;
  }, []);

  // Memoize path visualization
  const pathVisualization = useMemo(() => {
    return state.path.map((pos, index) => (
      <div
        key={`path-${index}`}
        className="path-point"
        style={{
          left: `${pos.x * CELL_SIZE + CELL_SIZE / 2}px`,
          top: `${pos.y * CELL_SIZE + CELL_SIZE / 2}px`,
          opacity: 0.3 + (index / state.path.length) * 0.7,
        }}
      />
    ));
  }, [state.path]);

  return (
    <div className="map-container">
      <div
        className="map"
        style={{
          width: `${mapWidth}px`,
          height: `${mapHeight}px`,
        }}
      >
        {/* Grid cells */}
        {gridCells}

        {/* Path visualization */}
        <div className="path-visualization">{pathVisualization}</div>

        {/* Marker */}
        <div
          className="marker"
          style={{
            left: `${state.x * CELL_SIZE}px`,
            top: `${state.y * CELL_SIZE}px`,
            transform: `rotate(${getRotation(state.direction)}deg)`,
          }}
        >
          <div className="marker-icon">🚗</div>
        </div>
      </div>

      {/* Coordinates display */}
      <div className="coordinates">
        <div className="coord-item">
          <span className="coord-label">X:</span>
          <span className="coord-value">{state.x}</span>
        </div>
        <div className="coord-item">
          <span className="coord-label">Y:</span>
          <span className="coord-value">{state.y}</span>
        </div>
        <div className="coord-item">
          <span className="coord-label">Direction:</span>
          <span className="coord-value">{state.direction}</span>
        </div>
        <div className="coord-item">
          <span className="coord-label">Path Length:</span>
          <span className="coord-value">{state.path.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
