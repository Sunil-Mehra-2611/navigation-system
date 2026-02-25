// Position interface
export interface Position {
  x: number;
  y: number;
}

// Direction enum
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

// Navigation state
export interface NavigationState extends Position {
  direction: Direction;
  path: Position[];
}

// Grid configuration
export const GRID_SIZE = 20;
export const CELL_SIZE = 40; // pixels
