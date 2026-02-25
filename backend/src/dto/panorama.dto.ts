export class PanoramaConnectionsDto {
  forward: string | null;
  left: string | null;
  right: string | null;
  backward: string | null;
}

export class PanoramaResponseDto {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  isVideo?: boolean;
  location?: string;
  connections: PanoramaConnectionsDto;
  yaw: number;
  pitch: number;
}
