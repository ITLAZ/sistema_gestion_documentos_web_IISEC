import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Libro } from 'src/schemas/libros.schema';
import { SearchService } from '../search/search.service';

@Injectable()
export class LibrosService {
  constructor(
    @InjectModel(Libro.name) private libroModel: Model<Libro>,
    private readonly searchService: SearchService,
  ) {}

  // Crear un libro
  async create(libro: Libro): Promise<Libro> {
    const nuevoLibro = new this.libroModel(libro);
    return nuevoLibro.save();
  }

  async updateAllLibros(): Promise<void> {
    try {
      const libros = await this.libroModel.find().exec();
  
      // Crear un array de promesas para indexar los libros
      const indexPromises = libros.map(libro => 
        this.searchService.indexData('libros', {
          id: libro._id,
          titulo: libro.titulo,
          autores: libro.autores,
          abstract: libro.abstract,
        })
      );
  
      // Esperar a que todas las indexaciones se completen
      await Promise.all(indexPromises);
  
      console.log(`${libros.length} libros han sido actualizados e indexados en Elasticsearch.`);
    } catch (error) {
      console.error('Error al actualizar libros:', error);
      throw new Error('No se pudieron actualizar los libros en Elasticsearch.');
    }
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

   // Eliminar un libro por su id
   async delete(id: string): Promise<Libro> {
    return this.libroModel.findByIdAndDelete(id).exec();
  }

}



