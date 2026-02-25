import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NavigationService } from '../services/navigation.service';
import { MoveEvent, AutoNavigateEvent } from '../types';
export declare class NavigationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private navigationService;
    server: Server;
    private autoNavigationIntervals;
    constructor(navigationService: NavigationService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    /**
     * Handle movement events
     */
    handleMove(client: Socket, data: MoveEvent): void;
    /**
     * Handle auto-navigation
     */
    handleAutoNavigate(client: Socket, data: AutoNavigateEvent): void;
    /**
     * Handle path reset
     */
    handleResetPath(client: Socket): void;
    /**
     * Handle reset
     */
    handleReset(client: Socket): void;
    /**
     * Get current state
     */
    handleGetState(client: Socket): void;
}
//# sourceMappingURL=navigation.gateway.d.ts.map