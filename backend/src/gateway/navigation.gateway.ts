import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NavigationService } from '../services/navigation.service';
import { Direction, MoveEvent, AutoNavigateEvent } from '../types';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/navigation',
})
export class NavigationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private autoNavigationIntervals = new Map<string, NodeJS.Timeout>();

  constructor(private navigationService: NavigationService) {}

  afterInit(server: Server) {
    console.log('✅ WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);

    // Send current state to new client
    const state = this.navigationService.getState();
    client.emit('positionUpdated', state);
  }

  handleDisconnect(client: Socket) {
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
  @SubscribeMessage('move')
  handleMove(client: Socket, data: MoveEvent) {
    try {
      // Validate direction
      if (!Object.values(Direction).includes(data.direction)) {
        client.emit('error', { message: 'Invalid direction' });
        return;
      }

      // Update position
      const newState = this.navigationService.move(data.direction);

      // Broadcast to all clients
      this.server.emit('positionUpdated', newState);

      console.log(
        `📍 Position updated: (${newState.x}, ${newState.y}) - Direction: ${newState.direction}`
      );
    } catch (error) {
      console.error('Error handling move:', error);
      client.emit('error', { message: 'Failed to move' });
    }
  }

  /**
   * Handle auto-navigation
   */
  @SubscribeMessage('autoNavigate')
  handleAutoNavigate(client: Socket, data: AutoNavigateEvent) {
    try {
      const { targetX, targetY } = data;

      // Validate target
      if (
        typeof targetX !== 'number' ||
        typeof targetY !== 'number' ||
        targetX < 0 ||
        targetY < 0 ||
        targetX >= 20 ||
        targetY >= 20
      ) {
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
        let direction: Direction;
        if (nextPos.y < currentPos.y) direction = Direction.UP;
        else if (nextPos.y > currentPos.y) direction = Direction.DOWN;
        else if (nextPos.x < currentPos.x) direction = Direction.LEFT;
        else direction = Direction.RIGHT;

        // Move
        const newState = this.navigationService.move(direction);
        this.server.emit('positionUpdated', newState);

        stepIndex++;
      }, 500); // 500ms per step

      this.autoNavigationIntervals.set(client.id, interval);

      console.log(
        `🗺️ Auto-navigation started to (${targetX}, ${targetY}), path length: ${path.length}`
      );
    } catch (error) {
      console.error('Error handling auto-navigate:', error);
      client.emit('error', { message: 'Failed to auto-navigate' });
    }
  }

  /**
   * Handle path reset
   */
  @SubscribeMessage('resetPath')
  handleResetPath(client: Socket) {
    try {
      this.navigationService.resetPath();
      const state = this.navigationService.getState();
      this.server.emit('positionUpdated', state);
      console.log('🔄 Path reset');
    } catch (error) {
      console.error('Error resetting path:', error);
      client.emit('error', { message: 'Failed to reset path' });
    }
  }

  /**
   * Handle reset
   */
  @SubscribeMessage('reset')
  handleReset(client: Socket) {
    try {
      // Clear auto-navigation
      if (this.autoNavigationIntervals.has(client.id)) {
        clearInterval(this.autoNavigationIntervals.get(client.id));
        this.autoNavigationIntervals.delete(client.id);
      }

      const state = this.navigationService.reset();
      this.server.emit('positionUpdated', state);
      console.log('🔄 Navigation reset to initial position');
    } catch (error) {
      console.error('Error resetting navigation:', error);
      client.emit('error', { message: 'Failed to reset' });
    }
  }

  /**
   * Get current state
   */
  @SubscribeMessage('getState')
  handleGetState(client: Socket) {
    try {
      const state = this.navigationService.getState();
      client.emit('positionUpdated', state);
    } catch (error) {
      console.error('Error getting state:', error);
      client.emit('error', { message: 'Failed to get state' });
    }
  }
}
