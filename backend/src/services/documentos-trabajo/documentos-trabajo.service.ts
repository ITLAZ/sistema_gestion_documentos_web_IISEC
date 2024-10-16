import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentoTrabajo } from 'src/schemas/documentos-trabajo.schema';

@Injectable()
export class DocumentosTrabajoService {
  constructor(
    @InjectModel(DocumentoTrabajo.name) private DocumentoTrabajoModel: Model<DocumentoTrabajo>,
  ) {}

  // Crear un DocumentoTrabajo
  async create(DocumentoTrabajo: DocumentoTrabajo): Promise<DocumentoTrabajo> {
    const nuevoDocumentoTrabajo = new this.DocumentoTrabajoModel(DocumentoTrabajo);
    return nuevoDocumentoTrabajo.save();
  }

  // Obtener todos los DocumentoTrabajos
  async findAll(): Promise<DocumentoTrabajo[]> {
    return this.DocumentoTrabajoModel.find().exec();
  }

  // Buscar un DocumentoTrabajo por su título
  async findOneByTitulo(titulo: string): Promise<DocumentoTrabajo> {
    return this.DocumentoTrabajoModel.findOne({ titulo }).exec();
  }

  // Buscar DocumentoTrabajos por título con aproximación
  async findByTitulo(titulo: string): Promise<DocumentoTrabajo[]> {
    return await this.DocumentoTrabajoModel.find({ titulo: { $regex: titulo, $options: 'i' } }).exec();
  }

  // Buscar DocumentoTrabajos por autor con aproximación
  async findByAutor(autor: string): Promise<DocumentoTrabajo[]> {
    return await this.DocumentoTrabajoModel.find({ autores: { $elemMatch: { $regex: autor, $options: 'i' } } }).exec();
  }  
  
  // Buscar DocumentoTrabajos por su id
  async findById(id: string): Promise<DocumentoTrabajo> {
    return this.DocumentoTrabajoModel.findById(id).exec();
  }

  // Actualizar un DocumentoTrabajo por su id
  async update(id: string, DocumentoTrabajo: Partial<DocumentoTrabajo>): Promise<DocumentoTrabajo> {
    return this.DocumentoTrabajoModel.findOneAndUpdate({ _id: id }, DocumentoTrabajo, { new: true }).exec();
  }

  // Eliminar un DocumentoTrabajo por su id
  async delete(id: string): Promise<DocumentoTrabajo> {
    return this.DocumentoTrabajoModel.findByIdAndDelete(id).exec();
  }


}
