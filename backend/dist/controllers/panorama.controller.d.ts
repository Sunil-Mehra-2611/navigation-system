import { PanoramaService } from '../services/panorama.service';
import { PanoramaResponseDto } from '../dto/panorama.dto';
export declare class PanoramaController {
    private readonly panoramaService;
    constructor(panoramaService: PanoramaService);
    seedData(): Promise<{
        message: string;
    }>;
    getAllPanoramas(): Promise<any[]>;
    getPanorama(id: string): Promise<PanoramaResponseDto>;
}
//# sourceMappingURL=panorama.controller.d.ts.map