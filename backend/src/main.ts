import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3000);
}
bootstrap();
