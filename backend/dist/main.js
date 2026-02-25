"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    const PORT = process.env.PORT || 3001;
    await app.listen(PORT);
    console.log(`
╔════════════════════════════════════════╗
║   360° Panorama System Started         ║
║   🚀 Server: http://localhost:${PORT}     ║
║   📡 WebSocket: ws://localhost:${PORT}    ║
╚════════════════════════════════════════╝
  `);
}
bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map