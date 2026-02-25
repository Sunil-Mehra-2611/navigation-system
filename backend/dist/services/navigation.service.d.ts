import { Direction, NavigationState, Position } from '../types';
export declare class NavigationService {
    private navigationState;
    /**
     * Get current navigation state
     */
    getState(): NavigationState;
    /**
     * Move in a direction with boundary validation
     */
    move(direction: Direction): NavigationState;
    /**
     * Calculate path using A* algorithm
     */
    calculatePath(targetX: number, targetY: number): Position[];
    /**
     * Auto-navigate to target position
     */
    autoNavigate(targetX: number, targetY: number): Position[];
    /**
     * Reset path tracking
     */
    resetPath(): void;
    /**
     * Reset to initial position
     */
    reset(): NavigationState;
}
//# sourceMappingURL=navigation.service.d.ts.map