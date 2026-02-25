import { Module } from '@nestjs/common';
import { PanoramaController } from './controllers/panorama.controller';
import { PanoramaService } from './services/panorama.service';
import { PanoramaGateway } from './gateway/panorama.gateway';

@Module({
  imports: [],
  controllers: [PanoramaController],
  providers: [PanoramaService, PanoramaGateway],
})
export class AppModule {}
