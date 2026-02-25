import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/panorama',
})
export class PanoramaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('navigate')
  handleNavigate(client: Socket, data: { panoramaId: string; userId?: string }) {
    this.server.emit('userNavigated', {
      panoramaId: data.panoramaId,
      userId: data.userId || client.id,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('cameraRotate')
  handleCameraRotate(client: Socket, data: { yaw: number; pitch: number }) {
    client.broadcast.emit('cameraRotated', {
      userId: client.id,
      yaw: data.yaw,
      pitch: data.pitch,
    });
  }
}
