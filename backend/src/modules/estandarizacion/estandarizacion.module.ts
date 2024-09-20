import { Module } from '@nestjs/common';
import { EstandarizacionController } from './estandarizacion.controller';
import { EstandarizacionService } from './estandarizacion.service';

@Module({
  controllers: [EstandarizacionController],
  providers: [EstandarizacionService]
})
export class EstandarizacionoNombreModule {}
