// capitulos-libros.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CapitulosLibrosController } from 'src/controllers/capitulos-libros.controller';
import { CapituloLibro, CapituloLibroSchema } from 'src/schemas/capitulos-libros.schema';
import { CapitulosLibrosService } from 'src/services/capitulos-libros/capitulos-libros.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CapituloLibro.name, schema: CapituloLibroSchema }])],
  controllers: [CapitulosLibrosController],
  providers: [CapitulosLibrosService, FileUploadService],
  exports: [CapitulosLibrosService],
})
export class CapitulosLibrosModule {}
