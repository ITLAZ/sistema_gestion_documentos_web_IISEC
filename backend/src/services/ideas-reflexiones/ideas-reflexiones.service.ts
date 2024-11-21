import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IdeaReflexion } from "src/schemas/ideas-reflexiones.schema";
import { SearchService } from "../search/search.service";

@Injectable()
export class IdeasReflexionesService {
  constructor(
    @InjectModel(IdeaReflexion.name)
    private IdeaReflexionModel: Model<IdeaReflexion>,
    private readonly searchService: SearchService,
  ) {}

  // Crear un IdeaReflexion
  async create(IdeaReflexion: IdeaReflexion): Promise<IdeaReflexion> {
    const nuevaIdeaReflexion = new this.IdeaReflexionModel(IdeaReflexion);
    return nuevaIdeaReflexion.save();
  }

  // Obtener todos los ideas-reflexiones
  async findAll(
    page: number = 1,
    size: number = 10,
    sortBy: string = 'anio_publicacion',
    sortOrder: string = 'asc',
    autor?: string,
    anio_publicacion?: number
  ): Promise<IdeaReflexion[]> {
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

    return this.IdeaReflexionModel.find(filter)
      .skip(skip)
      .limit(size)
      .sort({ [sortBy]: order })
      .exec();
  }


  // Buscar un IdeaReflexion por su título
  async findOneByTitulo(titulo: string): Promise<IdeaReflexion> {
    return this.IdeaReflexionModel.findOne({ titulo }).exec();
  }

  // Buscar IdeaReflexions por título con aproximación
  async findByTitulo(titulo: string): Promise<IdeaReflexion[]> {
    return await this.IdeaReflexionModel.find({
      titulo: { $regex: titulo, $options: "i" },
    }).exec();
  }

  // Buscar IdeaReflexions por autor con aproximación
  async findByAutor(autor: string): Promise<IdeaReflexion[]> {
    return await this.IdeaReflexionModel.find({
      autores: { $elemMatch: { $regex: autor, $options: "i" } },
    }).exec();
  }

  // Buscar IdeaReflexions por su id
  async findById(id: string): Promise<IdeaReflexion> {
    return this.IdeaReflexionModel.findById(id).exec();
  }

  // Actualizar un IdeaReflexion por su id
  async update(
    id: string,
    IdeaReflexion: Partial<IdeaReflexion>
  ): Promise<IdeaReflexion> {
    return this.IdeaReflexionModel.findOneAndUpdate({ _id: id }, IdeaReflexion, {
      new: true,
    }).exec();
  }

  // Cambiar estado a eliminado lógico
  async delete(id: string): Promise<IdeaReflexion> {
    const ideaReflexion = await this.IdeaReflexionModel.findById(id);

    if (!ideaReflexion) {
      throw new Error('Idea o reflexión no encontrada');
    }

    ideaReflexion.eliminado = true;

    return ideaReflexion.save();
  }

  // Restaurar una Idea o Reflexión por su ID
  async restore(id: string): Promise<IdeaReflexion> {
    const documento = await this.IdeaReflexionModel.findById(id);

    if (!documento) {
      throw new Error('Idea o Reflexión no encontrada');
    }

    documento.eliminado = false; // Cambiar el estado de eliminado a falso
    return documento.save();
  }

  //Metodos ElasticSearch
  async syncIdeasWithElasticsearch() {
    const ideas = await this.IdeaReflexionModel.find().exec();
    
    for (const idea of ideas) {
      await this.searchService.indexDocument(
        'ideas-reflexiones',    // Índice en Elasticsearch
        idea._id.toString(),
        {
          titulo: idea.titulo,              // Campo para búsquedas
          autores: idea.autores,            // Campo para búsquedas
          anio_publicacion: idea.anio_publicacion, // Campo para filtros o búsquedas
          observaciones: idea.observaciones,         // Campo opcional para mejorar el resultado de búsqueda
          eliminado: idea.eliminado,
        }
      );
    }
  }

  async findDeleted(): Promise<IdeaReflexion[]> {
    return this.IdeaReflexionModel.find({ eliminado: true }).exec();
  }
  
}
