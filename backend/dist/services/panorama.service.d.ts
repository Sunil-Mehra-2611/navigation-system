import { PanoramaResponseDto } from '../dto/panorama.dto';
export declare class PanoramaService {
    private panoramas;
    constructor();
    findById(id: string): Promise<PanoramaResponseDto>;
    findAll(): Promise<any[]>;
    seedData(): void;
}
//# sourceMappingURL=panorama.service.d.ts.map