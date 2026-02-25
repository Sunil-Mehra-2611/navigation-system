import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
