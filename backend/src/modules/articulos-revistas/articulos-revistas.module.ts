// articulos-revistas.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticuloRevista, ArticuloRevistaSchema } from 'src/schemas/articulos-revistas.schema';
import { ArticulosRevistasService } from 'src/services/articulos-revistas/articulos-revistas.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ArticuloRevista.name, schema: ArticuloRevistaSchema }])],
  providers: [ArticulosRevistasService],
  exports: [ArticulosRevistasService],
})
export class ArticulosRevistasModule {}
