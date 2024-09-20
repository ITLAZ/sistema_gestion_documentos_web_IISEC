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

  // Buscar libros por título con aproximación
  async findByTitulo(titulo: string): Promise<Libro[]> {
    return await this.libroModel.find({ titulo: { $regex: titulo, $options: 'i' } }).exec();
  }

  // Buscar libros por autor con aproximación
  async findByAutor(autor: string): Promise<Libro[]> {
    return await this.libroModel.find({ autores: { $elemMatch: { $regex: autor, $options: 'i' } } }).exec();
  }  


// Buscar un libro por su autor
  async findOneByAutores(autores: string): Promise<Libro> {
    return this.libroModel.findOne({ autores }).exec();
  }
  // Actualizar un libro por su título
  async update(titulo: string, libro: Partial<Libro>): Promise<Libro> {
    return this.libroModel.findOneAndUpdate({ titulo }, libro, { new: true }).exec();
  }

}



