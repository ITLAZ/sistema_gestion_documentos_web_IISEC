import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { InfoIISEC } from "src/schemas/info-iisec.schema";

@Injectable()
export class InfoIisecService {
  constructor(
    @InjectModel(InfoIISEC.name) private InfoIISECModel: Model<InfoIISEC>
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
}
