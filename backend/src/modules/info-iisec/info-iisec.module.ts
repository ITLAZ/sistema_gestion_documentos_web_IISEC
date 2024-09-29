import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfoIisecController } from 'src/controllers/info-iisec.controller';
import { InfoIISEC,InfoIISECSchema } from 'src/schemas/info-iisec.schema';
import { InfoIisecService } from 'src/services/info-iisec/info-iisec.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: InfoIISEC.name, schema: InfoIISECSchema }])],
  controllers: [InfoIisecController],
  providers: [InfoIisecService],
  exports: [InfoIisecService],
})
export class InfoIisecModule {}
