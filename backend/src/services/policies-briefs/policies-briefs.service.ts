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
  async findAll(): Promise<PolicyBrief[]> {
    return this.PolicyBriefModel.find().exec();
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

  // Eliminar un PolicyBrief por su id
  async delete(id: string): Promise<PolicyBrief> {
    return this.PolicyBriefModel.findByIdAndDelete(id).exec();
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
          mensaje_clave: policy.mensaje_clave         // Campo opcional para mejorar el resultado de búsqueda
        }
      );
    }
  }
}
