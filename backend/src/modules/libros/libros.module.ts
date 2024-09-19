
// libros.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibrosController } from 'src/controllers/libros.controller';
import { Libro,LibroSchema } from 'src/schemas/libros.schema';
import { LibrosService } from 'src/services/libros/libros.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Libro.name, schema: LibroSchema }])],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [LibrosService],
})
export class LibrosModule {}

