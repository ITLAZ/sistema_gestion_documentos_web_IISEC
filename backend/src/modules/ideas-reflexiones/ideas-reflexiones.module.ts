import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdeasReflexionesController } from 'src/controllers/ideas-reflexiones.controller';
import { IdeaReflexion,IdeaReflexionSchema } from 'src/schemas/ideas-reflexiones.schema';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { IdeasReflexionesService } from 'src/services/ideas-reflexiones/ideas-reflexiones.service';
import { SearchService } from 'src/services/search/search.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { LogsService } from 'src/services/logs_service/logs.service';
import { MyElasticsearchService } from 'src/services/my-elasticsearch/my-elasticsearch.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: IdeaReflexion.name, schema: IdeaReflexionSchema },
    { name: Log.name, schema: LogSchema },
  ]), MyElasticsearchModule],
  controllers: [IdeasReflexionesController],
  providers: [IdeasReflexionesService, FileUploadService, SearchService, LogsService,MyElasticsearchService,],
  exports: [IdeasReflexionesService],
})
export class IdeasReflexionesModule {}
