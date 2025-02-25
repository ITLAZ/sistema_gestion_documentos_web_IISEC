import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { InfoIISEC } from "src/schemas/info-iisec.schema";
import { SearchService } from "../search/search.service";

@Injectable()
export class InfoIisecService {
  constructor(
    @InjectModel(InfoIISEC.name) private InfoIISECModel: Model<InfoIISEC>,
    private readonly searchService: SearchService,
  ) {}

  // Crear un InfoIISEC
  async create(InfoIISEC: InfoIISEC): Promise<InfoIISEC> {
    const nuevoInfoIISEC = new this.InfoIISECModel(InfoIISEC);
    return nuevoInfoIISEC.save();
  }

  // Obtener todos los InfoIISECs
  async findAll(
    page: number = 1,
    size: number = 10,
    sortBy: string = 'anio_publicacion',
    sortOrder: string = 'asc',
    autor?: string,
    anio_publicacion?: number
  ): Promise<InfoIISEC[]> {
    const skip = (page - 1) * size;
    const order = sortOrder === 'asc' ? 1 : -1;
    
    // Construir el filtro dinámico
    const filter: any = { eliminado: false };
    if (autor) {
      filter.autores = autor;
    }
    if (anio_publicacion) {
      filter.anio_publicacion = anio_publicacion;
    }
  
    return this.InfoIISECModel.find(filter)
      .skip(skip)
      .limit(size)
      .sort({ [sortBy]: order })
      .exec();
  }

  // Buscar un InfoIISEC por su título
  async findOneByTitulo(titulo: string): Promise<InfoIISEC> {
    return this.InfoIISECModel.findOne({ titulo }).exec();
  }

  // Buscar InfoIISECs por título con aproximación
  async findByTitulo(titulo: string): Promise<InfoIISEC[]> {
    return await this.InfoIISECModel.find({
      titulo: { $regex: titulo, $options: "i" },
    }).exec();
  }

  // Buscar InfoIISECs por autor con aproximación
  async findByAutor(autor: string): Promise<InfoIISEC[]> {
    return await this.InfoIISECModel.find({
      autores: { $elemMatch: { $regex: autor, $options: "i" } },
    }).exec();
  }

  // Buscar InfoIISECs por su id
  async findById(id: string): Promise<InfoIISEC> {
    return this.InfoIISECModel.findById(id).exec();
  }

  // Actualizar un InfoIISEC por su id
  async update(id: string, InfoIISEC: Partial<InfoIISEC>): Promise<InfoIISEC> {
    return this.InfoIISECModel.findOneAndUpdate({ _id: id }, InfoIISEC, {
      new: true,
    }).exec();
  }

  // Cambiar estado a eliminado lógico
  async delete(id: string): Promise<InfoIISEC> {
    const documento = await this.InfoIISECModel.findById(id);

    if (!documento) {
      throw new Error('Documento Info IISEC no encontrado');
    }

    documento.eliminado = true;
    return documento.save();
  }

  // Restaurar un Documento Info IISEC por su ID
  async restore(id: string): Promise<InfoIISEC> {
    const documento = await this.InfoIISECModel.findById(id);

    if (!documento) {
      throw new Error('Documento Info IISEC no encontrado');
    }

    documento.eliminado = false; // Cambiar el estado de eliminado a falso
    return documento.save();
  }


  //Metodos ElasticSearch
  async syncInfoIisecWithElasticsearch() {
    const infos = await this.InfoIISECModel.find().exec();
    
    for (const info of infos) {
      await this.searchService.indexDocument(
        'info-iisec',    // Índice en Elasticsearch
        info._id.toString(),
        {
          titulo: info.titulo,              // Campo para búsquedas
          autores: info.autores,            // Campo para búsquedas
          anio_publicacion: info.anio_publicacion, // Campo para filtros o búsquedas
          observaciones: info.observaciones,           // Campo opcional para mejorar el resultado de búsqueda
          eliminado: info.eliminado,
        }
      );
    }
  }

  async findDeleted(): Promise<InfoIISEC[]> {
    return this.InfoIISECModel.find({ eliminado: true }).exec();
  }
  
}
