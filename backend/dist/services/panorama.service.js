"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanoramaService = void 0;
const common_1 = require("@nestjs/common");
let PanoramaService = class PanoramaService {
    constructor() {
        this.panoramas = new Map();
        this.seedData();
        console.log('✅ Panorama service initialized with', this.panoramas.size, 'panoramas');
    }
    async findById(id) {
        const panorama = this.panoramas.get(id);
        if (!panorama) {
            throw new common_1.NotFoundException(`Panorama with ID ${id} not found`);
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
    async findAll() {
        return Array.from(this.panoramas.values());
    }
    seedData() {
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
};
exports.PanoramaService = PanoramaService;
exports.PanoramaService = PanoramaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PanoramaService);
//# sourceMappingURL=panorama.service.js.map