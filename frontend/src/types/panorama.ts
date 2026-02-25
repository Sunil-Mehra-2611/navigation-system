export interface PanoramaConnections {
  forward: string | null;
  left: string | null;
  right: string | null;
  backward: string | null;
}

export interface Panorama {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  isVideo?: boolean;
  location?: string;
  connections: PanoramaConnections;
  yaw: number;
  pitch: number;
}

export enum Direction {
  FORWARD = 'forward',
  LEFT = 'left',
  RIGHT = 'right',
  BACKWARD = 'backward',
}
