import { Injectable } from '@nestjs/common';
import {
  Direction,
  GRID_SIZE,
  INITIAL_X,
  INITIAL_Y,
  NavigationState,
  Position,
} from '../types';

@Injectable()
export class NavigationService {
  private navigationState: NavigationState = {
    x: INITIAL_X,
    y: INITIAL_Y,
    direction: Direction.UP,
    path: [{ x: INITIAL_X, y: INITIAL_Y }],
  };

  /**
   * Get current navigation state
   */
  getState(): NavigationState {
    return { ...this.navigationState };
  }

  /**
   * Move in a direction with boundary validation
   */
  move(direction: Direction): NavigationState {
    const { x, y } = this.navigationState;
    let newX = x;
    let newY = y;

    switch (direction) {
      case Direction.UP:
        newY = Math.max(0, y - 1);
        break;
      case Direction.DOWN:
        newY = Math.min(GRID_SIZE - 1, y + 1);
        break;
      case Direction.LEFT:
        newX = Math.max(0, x - 1);
        break;
      case Direction.RIGHT:
        newX = Math.min(GRID_SIZE - 1, x + 1);
        break;
    }

    // Update state
    this.navigationState.x = newX;
    this.navigationState.y = newY;
    this.navigationState.direction = direction;

    // Add to path if position changed
    if (newX !== x || newY !== y) {
      this.navigationState.path.push({ x: newX, y: newY });
    }

    return { ...this.navigationState };
  }

  /**
   * Calculate path using A* algorithm
   */
  calculatePath(targetX: number, targetY: number): Position[] {
    const start = { x: this.navigationState.x, y: this.navigationState.y };
    const target = { x: targetX, y: targetY };

    // Validate target
    if (
      targetX < 0 ||
      targetX >= GRID_SIZE ||
      targetY < 0 ||
      targetY >= GRID_SIZE
    ) {
      return [start];
    }

    // A* pathfinding
    const openSet: Position[] = [start];
    const cameFrom = new Map<string, Position>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const key = (pos: Position) => `${pos.x},${pos.y}`;
    const heuristic = (pos: Position) =>
      Math.abs(pos.x - target.x) + Math.abs(pos.y - target.y);

    gScore.set(key(start), 0);
    fScore.set(key(start), heuristic(start));

    while (openSet.length > 0) {
      // Find node with lowest fScore
      let current = openSet[0];
      let currentIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (
          (fScore.get(key(openSet[i])) || Infinity) <
          (fScore.get(key(current)) || Infinity)
        ) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      if (current.x === target.x && current.y === target.y) {
        // Reconstruct path
        const path: Position[] = [current];
        let curr = current;
        while (cameFrom.has(key(curr))) {
          curr = cameFrom.get(key(curr))!;
          path.unshift(curr);
        }
        return path;
      }

      openSet.splice(currentIndex, 1);

      // Check neighbors
      const neighbors = [
        { x: current.x, y: current.y - 1 }, // UP
        { x: current.x, y: current.y + 1 }, // DOWN
        { x: current.x - 1, y: current.y }, // LEFT
        { x: current.x + 1, y: current.y }, // RIGHT
      ];

      for (const neighbor of neighbors) {
        if (
          neighbor.x < 0 ||
          neighbor.x >= GRID_SIZE ||
          neighbor.y < 0 ||
          neighbor.y >= GRID_SIZE
        ) {
          continue;
        }

        const tentativeGScore =
          (gScore.get(key(current)) || 0) + 1;

        if (
          !gScore.has(key(neighbor)) ||
          tentativeGScore < (gScore.get(key(neighbor)) || Infinity)
        ) {
          cameFrom.set(key(neighbor), current);
          gScore.set(key(neighbor), tentativeGScore);
          fScore.set(
            key(neighbor),
            tentativeGScore + heuristic(neighbor)
          );

          if (!openSet.some((p) => p.x === neighbor.x && p.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return [start];
  }

  /**
   * Auto-navigate to target position
   */
  autoNavigate(targetX: number, targetY: number): Position[] {
    const path = this.calculatePath(targetX, targetY);
    return path;
  }

  /**
   * Reset path tracking
   */
  resetPath(): void {
    this.navigationState.path = [
      { x: this.navigationState.x, y: this.navigationState.y },
    ];
  }

  /**
   * Reset to initial position
   */
  reset(): NavigationState {
    this.navigationState = {
      x: INITIAL_X,
      y: INITIAL_Y,
      direction: Direction.UP,
      path: [{ x: INITIAL_X, y: INITIAL_Y }],
    };
    return { ...this.navigationState };
  }
}
