import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PolicyBrief } from 'src/schemas/policies-briefs.schema';
import { SearchService } from '../search/search.service';

@Injectable()
export class PoliciesBriefsService {
  constructor(
    @InjectModel(PolicyBrief.name) private PolicyBriefModel: Model<PolicyBrief>,
    private searchService: SearchService,
  ) {}

  // Crear un PolicyBrief
  async create(PolicyBrief: PolicyBrief): Promise<PolicyBrief> {
    const nuevaPolicyBrief = new this.PolicyBriefModel(PolicyBrief);
    return nuevaPolicyBrief.save();
  }

  // Obtener todos los PolicyBriefs
  async findAll(
    page: number = 1,
    size: number = 10,
    sortBy: string = 'anio_publicacion',
    sortOrder: string = 'asc',
    autor?: string,
    anio_publicacion?: number
  ): Promise<PolicyBrief[]> {
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
  
    return this.PolicyBriefModel.find(filter)
      .skip(skip)
      .limit(size)
      .sort({ [sortBy]: order })
      .exec();
  }

  // Buscar un PolicyBrief por su título
  async findOneByTitulo(titulo: string): Promise<PolicyBrief> {
    return this.PolicyBriefModel.findOne({ titulo }).exec();
  }

  // Buscar PolicyBriefs por título con aproximación
  async findByTitulo(titulo: string): Promise<PolicyBrief[]> {
    return await this.PolicyBriefModel.find({ titulo: { $regex: titulo, $options: 'i' } }).exec();
  }

  // Buscar PolicyBriefs por autor con aproximación
  async findByAutor(autor: string): Promise<PolicyBrief[]> {
    return await this.PolicyBriefModel.find({ autores: { $elemMatch: { $regex: autor, $options: 'i' } } }).exec();
  }  
  
  // Buscar PolicyBriefs por su id
  async findById(id: string): Promise<PolicyBrief> {
    return this.PolicyBriefModel.findById(id).exec();
  }

  // Actualizar un PolicyBrief por su id
  async update(id: string, PolicyBrief: Partial<PolicyBrief>): Promise<PolicyBrief> {
    return this.PolicyBriefModel.findOneAndUpdate({ _id: id }, PolicyBrief, { new: true }).exec();
  }

  // Eliminado lógico
  async delete(id: string): Promise<PolicyBrief> {
    const documento = await this.PolicyBriefModel.findById(id);

    if (!documento) {
      throw new Error('Documento Policy Brief no encontrado');
    }

    documento.eliminado = true;
    return documento.save();
  }

  // Restaurar un documento Policy Brief por su ID
  async restore(id: string): Promise<PolicyBrief> {
    const documento = await this.PolicyBriefModel.findById(id);

    if (!documento) {
      throw new Error('Documento Policy Brief no encontrado');
    }

    documento.eliminado = false;
    return documento.save();
  }


  //Metodos ElasticSearch
  async syncPoliciesWithElasticsearch() {
    const policies = await this.PolicyBriefModel.find().exec();
    
    for (const policy of policies) {
      await this.searchService.indexDocument(
        'policies-briefs',    // Índice en Elasticsearch
        policy._id.toString(),
        {
          titulo: policy.titulo,              // Campo para búsquedas
          autores: policy.autores,            // Campo para búsquedas
          anio_publicacion: policy.anio_publicacion, // Campo para filtros o búsquedas
          mensaje_clave: policy.mensaje_clave,
          eliminado: policy.eliminado,         // Campo opcional para mejorar el resultado de búsqueda
        }
      );
    }
  }

  async findDeleted(): Promise<PolicyBrief[]> {
    return this.PolicyBriefModel.find({ eliminado: true }).exec();
  }

}
