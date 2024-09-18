import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentoTrabajo, DocumentoTrabajoSchema } from 'src/schemas/documentos-trabajo.schema';
import { DocumentosTrabajoService } from 'src/services/documentos-trabajo/documentos-trabajo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: DocumentoTrabajo.name, schema: DocumentoTrabajoSchema }])],
  providers: [DocumentosTrabajoService],
  exports: [DocumentosTrabajoService],
})
export class DocumentosTrabajoModule {}
