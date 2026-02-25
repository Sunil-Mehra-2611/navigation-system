export declare const GRID_SIZE = 20;
export declare const INITIAL_X = 0;
export declare const INITIAL_Y = 0;
export declare enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}
export interface Position {
    x: number;
    y: number;
}
export interface NavigationState extends Position {
    direction: Direction;
    path: Position[];
}
export interface MoveEvent {
    direction: Direction;
}
export interface AutoNavigateEvent {
    targetX: number;
    targetY: number;
}
export interface PositionUpdatedEvent extends NavigationState {
}
export interface PathUpdatedEvent {
    path: Position[];
}
//# sourceMappingURL=index.d.ts.map