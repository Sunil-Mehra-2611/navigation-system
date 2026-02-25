import { io, Socket } from 'socket.io-client';

class PanoramaSocketService {
  private socket: Socket | null = null;

  connect(): void {
    this.socket = io('http://localhost:3001/panorama', {
      reconnection: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to panorama socket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from panorama socket');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emitNavigate(panoramaId: string): void {
    if (this.socket) {
      this.socket.emit('navigate', { panoramaId });
    }
  }

  emitCameraRotate(yaw: number, pitch: number): void {
    if (this.socket) {
      this.socket.emit('cameraRotate', { yaw, pitch });
    }
  }

  onUserNavigated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('userNavigated', callback);
    }
  }

  onCameraRotated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('cameraRotated', callback);
    }
  }
}

export default new PanoramaSocketService();
