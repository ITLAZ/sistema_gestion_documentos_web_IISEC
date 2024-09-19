import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Libro } from 'src/schemas/libros.schema';

@Injectable()
export class LibrosService {
  constructor(
    @InjectModel(Libro.name) private libroModel: Model<Libro>,
  ) {}

  // Crear un libro
  async create(libro: Libro): Promise<Libro> {
    const nuevoLibro = new this.libroModel(libro);
    return nuevoLibro.save();
  }

  // Obtener todos los libros
  async findAll(): Promise<Libro[]> {
    return this.libroModel.find().exec();
  }

  // Buscar un libro por su título
  async findOneByTitulo(titulo: string): Promise<Libro> {
    return this.libroModel.findOne({ titulo }).exec();
  }

  // Actualizar un libro por su título
  async update(titulo: string, libro: Partial<Libro>): Promise<Libro> {
    return this.libroModel.findOneAndUpdate({ titulo }, libro, { new: true }).exec();
  }

}



