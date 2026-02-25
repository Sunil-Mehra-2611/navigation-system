import { Controller, Get, Param } from '@nestjs/common';
import { PanoramaService } from '../services/panorama.service';
import { PanoramaResponseDto } from '../dto/panorama.dto';

@Controller('panorama')
export class PanoramaController {
  constructor(private readonly panoramaService: PanoramaService) {}

  @Get('seed/data')
  async seedData() {
    await this.panoramaService.seedData();
    return { message: 'Seed data created successfully' };
  }

  @Get('all')
  async getAllPanoramas() {
    return this.panoramaService.findAll();
  }

  @Get(':id')
  async getPanorama(@Param('id') id: string): Promise<PanoramaResponseDto> {
    return this.panoramaService.findById(id);
  }
}
