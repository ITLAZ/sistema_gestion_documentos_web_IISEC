import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsController } from 'src/controllers/logs.controller';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { LogsService } from 'src/services/logs_service/logs.service';
import { MyElasticsearchModule } from '../my-elasticsearch/my-elasticsearch.module';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Log.name, schema: LogSchema },
      ]), MyElasticsearchModule],
      controllers: [LogsController],
      providers: [LogsService],
      exports: [LogsService],
})
export class LogsModuleModule {}
