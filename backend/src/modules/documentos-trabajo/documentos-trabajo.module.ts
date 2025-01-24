import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentosTrabajoController } from 'src/controllers/documentos-trabajo.controller';
import { DocumentoTrabajo, DocumentoTrabajoSchema } from 'src/schemas/documentos-trabajo.schema';
import { DocumentosTrabajoService } from 'src/services/documentos-trabajo/documentos-trabajo.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { SearchService } from 'src/services/search/search.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { LogsService } from 'src/services/logs_service/logs.service';
import { MyElasticsearchService } from 'src/services/my-elasticsearch/my-elasticsearch.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: DocumentoTrabajo.name, schema: DocumentoTrabajoSchema },
    { name: Log.name, schema: LogSchema },
  ]), MyElasticsearchModule],
  controllers: [DocumentosTrabajoController],
  providers: [DocumentosTrabajoService, FileUploadService, SearchService, LogsService,MyElasticsearchService,],
  exports: [DocumentosTrabajoService],
})
export class DocumentosTrabajoModule {}
