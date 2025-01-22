import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  //Documentacion
  const config = new DocumentBuilder()
  .setTitle('Mi API')
  .setDescription('API para gestionar recursos del sistema')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Puerto abierto
  app.enableCors();

// Usa el puerto desde el archivo .env, o por defecto 3000 si no está definido
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`Aplicación corriendo en: http://localhost:${port}`);
}
bootstrap();
