// capitulos-libros.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CapitulosLibrosController } from 'src/controllers/capitulos-libros.controller';
import { CapituloLibro, CapituloLibroSchema } from 'src/schemas/capitulos-libros.schema';
import { CapitulosLibrosService } from 'src/services/capitulos-libros/capitulos-libros.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { SearchService } from 'src/services/search/search.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { LogsService } from 'src/services/logs_service/logs.service';
import { MyElasticsearchService } from 'src/services/my-elasticsearch/my-elasticsearch.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: CapituloLibro.name, schema: CapituloLibroSchema },
    { name: Log.name, schema: LogSchema },
  ]), MyElasticsearchModule],
  controllers: [CapitulosLibrosController],
  providers: [CapitulosLibrosService, FileUploadService, SearchService, LogsService,MyElasticsearchService,],
  exports: [CapitulosLibrosService],
})
export class CapitulosLibrosModule {}
