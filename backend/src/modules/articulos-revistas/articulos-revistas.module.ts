// articulos-revistas.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticulosRevistasController } from 'src/controllers/articulos-revistas.controller';
import { ArticuloRevista, ArticuloRevistaSchema } from 'src/schemas/articulos-revistas.schema';
import { ArticulosRevistasService } from 'src/services/articulos-revistas/articulos-revistas.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { SearchService } from 'src/services/search/search.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: ArticuloRevista.name, schema: ArticuloRevistaSchema }]), MyElasticsearchModule],
  controllers: [ArticulosRevistasController],
  providers: [ArticulosRevistasService, FileUploadService, SearchService],
  exports: [ArticulosRevistasService],
})
export class ArticulosRevistasModule {}
