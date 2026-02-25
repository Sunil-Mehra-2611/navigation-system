"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../types");
let NavigationService = class NavigationService {
    constructor() {
        this.navigationState = {
            x: types_1.INITIAL_X,
            y: types_1.INITIAL_Y,
            direction: types_1.Direction.UP,
            path: [{ x: types_1.INITIAL_X, y: types_1.INITIAL_Y }],
        };
    }
    /**
     * Get current navigation state
     */
    getState() {
        return { ...this.navigationState };
    }
    /**
     * Move in a direction with boundary validation
     */
    move(direction) {
        const { x, y } = this.navigationState;
        let newX = x;
        let newY = y;
        switch (direction) {
            case types_1.Direction.UP:
                newY = Math.max(0, y - 1);
                break;
            case types_1.Direction.DOWN:
                newY = Math.min(types_1.GRID_SIZE - 1, y + 1);
                break;
            case types_1.Direction.LEFT:
                newX = Math.max(0, x - 1);
                break;
            case types_1.Direction.RIGHT:
                newX = Math.min(types_1.GRID_SIZE - 1, x + 1);
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
    calculatePath(targetX, targetY) {
        const start = { x: this.navigationState.x, y: this.navigationState.y };
        const target = { x: targetX, y: targetY };
        // Validate target
        if (targetX < 0 ||
            targetX >= types_1.GRID_SIZE ||
            targetY < 0 ||
            targetY >= types_1.GRID_SIZE) {
            return [start];
        }
        // A* pathfinding
        const openSet = [start];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        const key = (pos) => `${pos.x},${pos.y}`;
        const heuristic = (pos) => Math.abs(pos.x - target.x) + Math.abs(pos.y - target.y);
        gScore.set(key(start), 0);
        fScore.set(key(start), heuristic(start));
        while (openSet.length > 0) {
            // Find node with lowest fScore
            let current = openSet[0];
            let currentIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                if ((fScore.get(key(openSet[i])) || Infinity) <
                    (fScore.get(key(current)) || Infinity)) {
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            if (current.x === target.x && current.y === target.y) {
                // Reconstruct path
                const path = [current];
                let curr = current;
                while (cameFrom.has(key(curr))) {
                    curr = cameFrom.get(key(curr));
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
                if (neighbor.x < 0 ||
                    neighbor.x >= types_1.GRID_SIZE ||
                    neighbor.y < 0 ||
                    neighbor.y >= types_1.GRID_SIZE) {
                    continue;
                }
                const tentativeGScore = (gScore.get(key(current)) || 0) + 1;
                if (!gScore.has(key(neighbor)) ||
                    tentativeGScore < (gScore.get(key(neighbor)) || Infinity)) {
                    cameFrom.set(key(neighbor), current);
                    gScore.set(key(neighbor), tentativeGScore);
                    fScore.set(key(neighbor), tentativeGScore + heuristic(neighbor));
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
    autoNavigate(targetX, targetY) {
        const path = this.calculatePath(targetX, targetY);
        return path;
    }
    /**
     * Reset path tracking
     */
    resetPath() {
        this.navigationState.path = [
            { x: this.navigationState.x, y: this.navigationState.y },
        ];
    }
    /**
     * Reset to initial position
     */
    reset() {
        this.navigationState = {
            x: types_1.INITIAL_X,
            y: types_1.INITIAL_Y,
            direction: types_1.Direction.UP,
            path: [{ x: types_1.INITIAL_X, y: types_1.INITIAL_Y }],
        };
        return { ...this.navigationState };
    }
};
exports.NavigationService = NavigationService;
exports.NavigationService = NavigationService = __decorate([
    (0, common_1.Injectable)()
], NavigationService);
//# sourceMappingURL=navigation.service.js.map