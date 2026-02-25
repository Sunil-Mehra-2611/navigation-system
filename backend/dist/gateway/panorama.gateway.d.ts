import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class PanoramaGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleNavigate(client: Socket, data: {
        panoramaId: string;
        userId?: string;
    }): void;
    handleCameraRotate(client: Socket, data: {
        yaw: number;
        pitch: number;
    }): void;
}
//# sourceMappingURL=panorama.gateway.d.ts.map