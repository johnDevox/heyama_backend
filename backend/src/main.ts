import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('PORT:', process.env.PORT);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3001);

  console.log(`API running on http://localhost:${process.env.PORT || 3001}`);
}

void bootstrap();
