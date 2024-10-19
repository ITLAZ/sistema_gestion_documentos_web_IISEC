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
  async findAll(): Promise<InfoIISEC[]> {
    return this.InfoIISECModel.find().exec();
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

  // Eliminar un InfoIISEC por su id
  async delete(id: string): Promise<InfoIISEC> {
    return this.InfoIISECModel.findByIdAndDelete(id).exec();
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
          observaciones: info.observaciones         // Campo opcional para mejorar el resultado de búsqueda
        }
      );
    }
  }
}
