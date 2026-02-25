"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const navigation_service_1 = require("../services/navigation.service");
const types_1 = require("../types");
let NavigationGateway = class NavigationGateway {
    constructor(navigationService) {
        this.navigationService = navigationService;
        this.autoNavigationIntervals = new Map();
    }
    afterInit(server) {
        console.log('✅ WebSocket Gateway initialized');
    }
    handleConnection(client) {
        console.log(`✅ Client connected: ${client.id}`);
        // Send current state to new client
        const state = this.navigationService.getState();
        client.emit('positionUpdated', state);
    }
    handleDisconnect(client) {
        console.log(`❌ Client disconnected: ${client.id}`);
        // Clear auto-navigation if active
        if (this.autoNavigationIntervals.has(client.id)) {
            clearInterval(this.autoNavigationIntervals.get(client.id));
            this.autoNavigationIntervals.delete(client.id);
        }
    }
    /**
     * Handle movement events
     */
    handleMove(client, data) {
        try {
            // Validate direction
            if (!Object.values(types_1.Direction).includes(data.direction)) {
                client.emit('error', { message: 'Invalid direction' });
                return;
            }
            // Update position
            const newState = this.navigationService.move(data.direction);
            // Broadcast to all clients
            this.server.emit('positionUpdated', newState);
            console.log(`📍 Position updated: (${newState.x}, ${newState.y}) - Direction: ${newState.direction}`);
        }
        catch (error) {
            console.error('Error handling move:', error);
            client.emit('error', { message: 'Failed to move' });
        }
    }
    /**
     * Handle auto-navigation
     */
    handleAutoNavigate(client, data) {
        try {
            const { targetX, targetY } = data;
            // Validate target
            if (typeof targetX !== 'number' ||
                typeof targetY !== 'number' ||
                targetX < 0 ||
                targetY < 0 ||
                targetX >= 20 ||
                targetY >= 20) {
                client.emit('error', { message: 'Invalid target coordinates' });
                return;
            }
            // Calculate path
            const path = this.navigationService.autoNavigate(targetX, targetY);
            // Clear existing auto-navigation
            if (this.autoNavigationIntervals.has(client.id)) {
                clearInterval(this.autoNavigationIntervals.get(client.id));
            }
            // Emit path
            this.server.emit('pathUpdated', { path });
            // Auto-navigate step by step
            let stepIndex = 1;
            const interval = setInterval(() => {
                if (stepIndex >= path.length) {
                    clearInterval(interval);
                    this.autoNavigationIntervals.delete(client.id);
                    this.server.emit('navigationComplete', {});
                    console.log('✅ Auto-navigation completed');
                    return;
                }
                const currentPos = path[stepIndex - 1];
                const nextPos = path[stepIndex];
                // Determine direction
                let direction;
                if (nextPos.y < currentPos.y)
                    direction = types_1.Direction.UP;
                else if (nextPos.y > currentPos.y)
                    direction = types_1.Direction.DOWN;
                else if (nextPos.x < currentPos.x)
                    direction = types_1.Direction.LEFT;
                else
                    direction = types_1.Direction.RIGHT;
                // Move
                const newState = this.navigationService.move(direction);
                this.server.emit('positionUpdated', newState);
                stepIndex++;
            }, 500); // 500ms per step
            this.autoNavigationIntervals.set(client.id, interval);
            console.log(`🗺️ Auto-navigation started to (${targetX}, ${targetY}), path length: ${path.length}`);
        }
        catch (error) {
            console.error('Error handling auto-navigate:', error);
            client.emit('error', { message: 'Failed to auto-navigate' });
        }
    }
    /**
     * Handle path reset
     */
    handleResetPath(client) {
        try {
            this.navigationService.resetPath();
            const state = this.navigationService.getState();
            this.server.emit('positionUpdated', state);
            console.log('🔄 Path reset');
        }
        catch (error) {
            console.error('Error resetting path:', error);
            client.emit('error', { message: 'Failed to reset path' });
        }
    }
    /**
     * Handle reset
     */
    handleReset(client) {
        try {
            // Clear auto-navigation
            if (this.autoNavigationIntervals.has(client.id)) {
                clearInterval(this.autoNavigationIntervals.get(client.id));
                this.autoNavigationIntervals.delete(client.id);
            }
            const state = this.navigationService.reset();
            this.server.emit('positionUpdated', state);
            console.log('🔄 Navigation reset to initial position');
        }
        catch (error) {
            console.error('Error resetting navigation:', error);
            client.emit('error', { message: 'Failed to reset' });
        }
    }
    /**
     * Get current state
     */
    handleGetState(client) {
        try {
            const state = this.navigationService.getState();
            client.emit('positionUpdated', state);
        }
        catch (error) {
            console.error('Error getting state:', error);
            client.emit('error', { message: 'Failed to get state' });
        }
    }
};
exports.NavigationGateway = NavigationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NavigationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('move'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NavigationGateway.prototype, "handleMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('autoNavigate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NavigationGateway.prototype, "handleAutoNavigate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('resetPath'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NavigationGateway.prototype, "handleResetPath", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NavigationGateway.prototype, "handleReset", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getState'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NavigationGateway.prototype, "handleGetState", null);
exports.NavigationGateway = NavigationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        namespace: '/navigation',
    }),
    __metadata("design:paramtypes", [navigation_service_1.NavigationService])
], NavigationGateway);
//# sourceMappingURL=navigation.gateway.js.map