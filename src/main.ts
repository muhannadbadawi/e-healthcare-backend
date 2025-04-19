import { NestFactory } from '@nestjs/core'; // NestFactory: Is a tool from NestJS to create our app
import { AppModule } from './app.module'; // AppModule: It is the main module in the application, containing others modules and linking the rest of the modules to gother
import { ConfigService } from '@nestjs/config'; // ConfigService: It's a service used to get configs value from configration files like ".env"
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
