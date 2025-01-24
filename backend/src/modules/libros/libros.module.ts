
// libros.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibrosController } from 'src/controllers/libros.controller';
import { Libro,LibroSchema } from 'src/schemas/libros.schema';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { LibrosService } from 'src/services/libros/libros.service';
import { SearchService } from 'src/services/search/search.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';
import { LogsService } from 'src/services/logs_service/logs.service';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { MyElasticsearchService } from 'src/services/my-elasticsearch/my-elasticsearch.service';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Libro.name, schema: LibroSchema},
    { name: Log.name, schema: LogSchema },
  ]), MyElasticsearchModule],
  controllers: [LibrosController],
  providers: [LibrosService, FileUploadService, SearchService, LogsService,MyElasticsearchService,],
  exports: [LibrosService],
})
export class LibrosModule {}

