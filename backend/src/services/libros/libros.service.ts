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
  
  // Buscar libros por su id
  async findById(id: string): Promise<Libro> {
    return this.libroModel.findById(id).exec();
  }

  // Actualizar un libro por su id
  async update(id: string, libro: Partial<Libro>): Promise<Libro> {
    return this.libroModel.findOneAndUpdate({ id }, libro, { new: true }).exec();
  }

}



