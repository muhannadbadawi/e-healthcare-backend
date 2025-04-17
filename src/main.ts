import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.enableCors({
    origin: 'http://localhost:5173', // ✅ allow your frontend
    credentials: true, // optional: if using cookies or auth headers
  });

  await app.listen(port);
}
void bootstrap();
