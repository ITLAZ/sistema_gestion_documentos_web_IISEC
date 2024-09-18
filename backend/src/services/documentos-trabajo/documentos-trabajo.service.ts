import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentoTrabajo } from 'src/schemas/documentos-trabajo.schema';

@Injectable()
export class DocumentosTrabajoService {
  constructor(@InjectModel(DocumentoTrabajo.name) private documentoTrabajoModel: Model<DocumentoTrabajo>) {}

  async create(documento: DocumentoTrabajo): Promise<DocumentoTrabajo> {
    const nuevoDocumento = new this.documentoTrabajoModel(documento);
    return nuevoDocumento.save();
  }

  async findAll(): Promise<DocumentoTrabajo[]> {
    return this.documentoTrabajoModel.find().exec();
  }
}
