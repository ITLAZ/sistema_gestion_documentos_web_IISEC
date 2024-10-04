import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IdeaReflexion } from "src/schemas/ideas-reflexiones.schema";

@Injectable()
export class IdeasReflexionesService {
  constructor(
    @InjectModel(IdeaReflexion.name)
    private IdeaReflexionModel: Model<IdeaReflexion>
  ) {}

  // Crear un IdeaReflexion
  async create(IdeaReflexion: IdeaReflexion): Promise<IdeaReflexion> {
    const nuevaIdeaReflexion = new this.IdeaReflexionModel(IdeaReflexion);
    return nuevaIdeaReflexion.save();
  }

  // Obtener todos los IdeaReflexions
  async findAll(): Promise<IdeaReflexion[]> {
    return this.IdeaReflexionModel.find().exec();
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
    return this.IdeaReflexionModel.findOneAndUpdate({ id }, IdeaReflexion, {
      new: true,
    }).exec();
  }

  // Eliminar un IdeaReflexion por su id
  async delete(id: string): Promise<IdeaReflexion> {
    return this.IdeaReflexionModel.findByIdAndDelete(id).exec();
  }
}
