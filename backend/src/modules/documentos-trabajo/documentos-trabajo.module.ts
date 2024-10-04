import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentosTrabajoController } from 'src/controllers/documentos-trabajo.controller';
import { DocumentoTrabajo, DocumentoTrabajoSchema } from 'src/schemas/documentos-trabajo.schema';
import { DocumentosTrabajoService } from 'src/services/documentos-trabajo/documentos-trabajo.service';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: DocumentoTrabajo.name, schema: DocumentoTrabajoSchema }])],
  controllers: [DocumentosTrabajoController],
  providers: [DocumentosTrabajoService, FileUploadService],
  exports: [DocumentosTrabajoService],
})
export class DocumentosTrabajoModule {}
