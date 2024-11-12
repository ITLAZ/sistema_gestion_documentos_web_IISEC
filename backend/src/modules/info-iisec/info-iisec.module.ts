import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfoIisecController } from 'src/controllers/info-iisec.controller';
import { InfoIISEC,InfoIISECSchema } from 'src/schemas/info-iisec.schema';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { InfoIisecService } from 'src/services/info-iisec/info-iisec.service';
import { SearchService } from 'src/services/search/search.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { LogsService } from 'src/services/logs_service/logs.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: InfoIISEC.name, schema: InfoIISECSchema },
    { name: Log.name, schema: LogSchema },
  ]), MyElasticsearchModule],
  controllers: [InfoIisecController],
  providers: [InfoIisecService, FileUploadService, SearchService, LogsService],
  exports: [InfoIisecService],
})
export class InfoIisecModule {}
