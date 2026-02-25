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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanoramaController = void 0;
const common_1 = require("@nestjs/common");
const panorama_service_1 = require("../services/panorama.service");
let PanoramaController = class PanoramaController {
    constructor(panoramaService) {
        this.panoramaService = panoramaService;
    }
    async seedData() {
        await this.panoramaService.seedData();
        return { message: 'Seed data created successfully' };
    }
    async getAllPanoramas() {
        return this.panoramaService.findAll();
    }
    async getPanorama(id) {
        return this.panoramaService.findById(id);
    }
};
exports.PanoramaController = PanoramaController;
__decorate([
    (0, common_1.Get)('seed/data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PanoramaController.prototype, "seedData", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PanoramaController.prototype, "getAllPanoramas", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PanoramaController.prototype, "getPanorama", null);
exports.PanoramaController = PanoramaController = __decorate([
    (0, common_1.Controller)('panorama'),
    __metadata("design:paramtypes", [panorama_service_1.PanoramaService])
], PanoramaController);
//# sourceMappingURL=panorama.controller.js.map