import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentoTrabajo } from 'src/schemas/documentos-trabajo.schema';
import { SearchService } from '../search/search.service';

@Injectable()
export class DocumentosTrabajoService {
  constructor(
    @InjectModel(DocumentoTrabajo.name) private DocumentoTrabajoModel: Model<DocumentoTrabajo>,
    private readonly searchService: SearchService,
  ) {}

  // Crear un DocumentoTrabajo
  async create(DocumentoTrabajo: DocumentoTrabajo): Promise<DocumentoTrabajo> {
    const nuevoDocumentoTrabajo = new this.DocumentoTrabajoModel(DocumentoTrabajo);
    return nuevoDocumentoTrabajo.save();
  }

  // Obtener todos los DocumentoTrabajos
  async findAll(
    page: number = 1,
    size: number = 10,
    sortBy: string = 'anio_publicacion',
    sortOrder: string = 'asc',
    autor?: string,
    anio_publicacion?: number
  ): Promise<DocumentoTrabajo[]> {
    const skip = (page - 1) * size;
    const order = sortOrder === 'asc' ? 1 : -1;
    
    // Construir el filtro dinámico
    const filter: any = {};
    if (autor) {
      filter.autores = autor;
    }
    if (anio_publicacion) {
      filter.anio_publicacion = anio_publicacion;
    }
  
    return this.DocumentoTrabajoModel.find(filter)
      .skip(skip)
      .limit(size)
      .sort({ [sortBy]: order })
      .exec();
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

  // Eliminado lógico
  async delete(id: string): Promise<DocumentoTrabajo> {
    const documento = await this.DocumentoTrabajoModel.findById(id);

    if (!documento) {
      throw new Error('Documento no encontrado');
    }

    documento.eliminado = false;

    return documento.save();
  }

  //Metodos ElasticSearch
  async syncDocumentosWithElasticsearch() {
    const documentos = await this.DocumentoTrabajoModel.find().exec();
    
    for (const documento of documentos) {
      await this.searchService.indexDocument(
        'documentos-trabajo',    // Índice en Elasticsearch
        documento._id.toString(),
        {
          titulo: documento.titulo,              // Campo para búsquedas
          autores: documento.autores,            // Campo para búsquedas
          anio_publicacion: documento.anio_publicacion, // Campo para filtros o búsquedas
          abstract: documento.abstract,           // Campo opcional para mejorar el resultado de búsqueda
          eliminado: documento.eliminado,
        }
      );
    }
  }

  async findDeleted(): Promise<DocumentoTrabajo[]> {
    return this.DocumentoTrabajoModel.find({ eliminado: true }).exec();
  }
  
}
