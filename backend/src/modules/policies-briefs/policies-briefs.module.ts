import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoliciesBriefsController } from 'src/controllers/policies-briefs.controller';
import { PolicyBrief,PolicyBriefSchema } from 'src/schemas/policies-briefs.schema';
import { PoliciesBriefsService } from 'src/services/policies-briefs/policies-briefs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: PolicyBrief.name, schema: PolicyBriefSchema }])],
  controllers: [PoliciesBriefsController],
  providers: [PoliciesBriefsService],
  exports: [PoliciesBriefsService],
})
export class PoliciesBriefsModule {}
