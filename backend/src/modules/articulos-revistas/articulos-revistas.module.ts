// articulos-revistas.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticulosRevistasController } from 'src/controllers/articulos-revistas.controller';
import { ArticuloRevista, ArticuloRevistaSchema } from 'src/schemas/articulos-revistas.schema';
import { ArticulosRevistasService } from 'src/services/articulos-revistas/articulos-revistas.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { SearchService } from 'src/services/search/search.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';
import { LogsService } from 'src/services/logs_service/logs.service';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { MyElasticsearchService } from 'src/services/my-elasticsearch/my-elasticsearch.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: ArticuloRevista.name, schema: ArticuloRevistaSchema },
    { name: Log.name, schema: LogSchema },
  ]), MyElasticsearchModule],
  controllers: [ArticulosRevistasController],
  providers: [ArticulosRevistasService, FileUploadService, SearchService, LogsService,MyElasticsearchService,],
  exports: [ArticulosRevistasService],
})
export class ArticulosRevistasModule {}
