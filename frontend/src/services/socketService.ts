import { io, Socket } from 'socket.io-client';
import { NavigationState, Direction, Position } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Initialize socket connection
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io('http://localhost:3001/navigation', {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          console.log('✅ Connected to server');
          this.emit('connected');
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('❌ Disconnected from server');
          this.emit('disconnected');
        });

        this.socket.on('error', (error) => {
          console.error('❌ Socket error:', error);
          this.emit('error', error);
        });

        this.socket.on('positionUpdated', (state: NavigationState) => {
          this.emit('positionUpdated', state);
        });

        this.socket.on('pathUpdated', (data: { path: Position[] }) => {
          this.emit('pathUpdated', data.path);
        });

        this.socket.on('navigationComplete', () => {
          this.emit('navigationComplete');
        });

        // Timeout for connection
        setTimeout(() => {
          if (!this.socket?.connected) {
            reject(new Error('Connection timeout'));
          }
        }, 5000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Move in a direction
   */
  move(direction: Direction): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('move', { direction });
  }

  /**
   * Auto-navigate to target
   */
  autoNavigate(targetX: number, targetY: number): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('autoNavigate', { targetX, targetY });
  }

  /**
   * Reset path
   */
  resetPath(): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('resetPath');
  }

  /**
   * Reset navigation
   */
  reset(): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('reset');
  }

  /**
   * Get current state
   */
  getState(): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('getState');
  }

  /**
   * Register event listener
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Unregister event listener
   */
  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event)!;
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data?: any): void {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach((callback) => callback(data));
  }
}

export default new SocketService();
