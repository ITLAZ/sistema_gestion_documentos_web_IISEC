import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoliciesBriefsController } from 'src/controllers/policies-briefs.controller';
import { PolicyBrief,PolicyBriefSchema } from 'src/schemas/policies-briefs.schema';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { PoliciesBriefsService } from 'src/services/policies-briefs/policies-briefs.service';
import { SearchService } from 'src/services/search/search.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { LogsService } from 'src/services/logs_service/logs.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: PolicyBrief.name, schema: PolicyBriefSchema },
    { name: Log.name, schema: LogSchema },
  ]), MyElasticsearchModule],
  controllers: [PoliciesBriefsController],
  providers: [PoliciesBriefsService, FileUploadService, SearchService, LogsService],
  exports: [PoliciesBriefsService],
})
export class PoliciesBriefsModule {}
