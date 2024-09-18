// capitulos-libros.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CapituloLibro, CapituloLibroSchema } from 'src/schemas/capitulos-libros.schema';
import { CapitulosLibrosService } from 'src/services/capitulos-libros/capitulos-libros.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CapituloLibro.name, schema: CapituloLibroSchema }])],
  providers: [CapitulosLibrosService],
  exports: [CapitulosLibrosService],
})
export class CapitulosLibrosModule {}
