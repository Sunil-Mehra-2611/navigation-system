// Grid configuration
export const GRID_SIZE = 20;
export const INITIAL_X = 0;
export const INITIAL_Y = 0;

// Direction enum
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

// Position interface
export interface Position {
  x: number;
  y: number;
}

// Navigation state
export interface NavigationState extends Position {
  direction: Direction;
  path: Position[];
}

// WebSocket events
export interface MoveEvent {
  direction: Direction;
}

export interface AutoNavigateEvent {
  targetX: number;
  targetY: number;
}

export interface PositionUpdatedEvent extends NavigationState {}

export interface PathUpdatedEvent {
  path: Position[];
}
