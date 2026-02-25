import { Injectable, NotFoundException } from '@nestjs/common';
import { PanoramaResponseDto } from '../dto/panorama.dto';

@Injectable()
export class PanoramaService {
  private panoramas = new Map<string, any>();

  constructor() {
    this.seedData();
    console.log('✅ Panorama service initialized with', this.panoramas.size, 'panoramas');
  }

  async findById(id: string): Promise<PanoramaResponseDto> {
    const panorama = this.panoramas.get(id);
    
    if (!panorama) {
      throw new NotFoundException(`Panorama with ID ${id} not found`);
    }

    return {
      id: panorama.id,
      imageUrl: panorama.imageUrl,
      videoUrl: panorama.videoUrl,
      isVideo: panorama.isVideo,
      location: panorama.location,
      connections: {
        forward: panorama.forwardId,
        left: panorama.leftId,
        right: panorama.rightId,
        backward: panorama.backwardId,
      },
      yaw: panorama.yaw,
      pitch: panorama.pitch,
    };
  }

  async findAll(): Promise<any[]> {
    return Array.from(this.panoramas.values());
  }

  seedData(): void {
    const data = [
      {
        id: '1',
        imageUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/warm_restaurant_night.jpg',
        isVideo: false,
        location: 'Warm Restaurant',
        forwardId: '2',
        leftId: '4',
        rightId: '5',
        backwardId: '3',
        yaw: 0,
        pitch: 0,
      },
      {
        id: '2',
        imageUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/studio_small_08.jpg',
        isVideo: false,
        location: 'Photography Studio',
        forwardId: '3',
        leftId: '1',
        rightId: '4',
        backwardId: '5',
        yaw: 0,
        pitch: 0,
      },
      {
        id: '3',
        imageUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/modern_buildings_2.jpg',
        isVideo: false,
        location: 'Modern Buildings',
        forwardId: '4',
        leftId: '2',
        rightId: '1',
        backwardId: '5',
        yaw: 0,
        pitch: 0,
      },
      {
        id: '4',
        imageUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/christmas_photo_studio_07.jpg',
        isVideo: false,
        location: 'Christmas Studio',
        forwardId: '5',
        leftId: '3',
        rightId: '2',
        backwardId: '1',
        yaw: 0,
        pitch: 0,
      },
      {
        id: '5',
        imageUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/empty_warehouse_01.jpg',
        isVideo: false,
        location: 'Empty Warehouse',
        forwardId: '1',
        leftId: '4',
        rightId: '3',
        backwardId: '2',
        yaw: 0,
        pitch: 0,
      },
    ];

    data.forEach(p => this.panoramas.set(p.id, p));
  }
}
