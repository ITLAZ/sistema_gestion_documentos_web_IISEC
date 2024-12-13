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

  async syncLibrosWithElasticsearch() {
    const libros = await this.libroModel.find().exec();
    
    for (const libro of libros) {
      await this.searchService.indexDocument(
        'libros',    // Índice en Elasticsearch
        libro._id.toString(),
        {
          titulo: libro.titulo,              // Campo para búsquedas
          autores: libro.autores,            // Campo para búsquedas
          anio_publicacion: libro.anio_publicacion, // Campo para filtros o búsquedas
          abstract: libro.abstract,           // Campo opcional para mejorar el resultado de búsqueda
          eliminado: libro.eliminado,  
        }
      );
    }
  }
  
  async updateAllLibros(): Promise<void> {
    try {
      // Obtener todos los libros desde MongoDB
      const libros = await this.libroModel.find().exec();
      const mongoIds = libros.map(libro => libro._id.toString()); // IDs actuales en MongoDB
  
      // Obtener todos los documentos de Elasticsearch
      const esResult = await this.searchService.getAllDocuments('libros');
      const esIds = esResult.map(doc => doc._id); // IDs actuales en Elasticsearch
  
      // Identificar los documentos que están en Elasticsearch pero no en MongoDB
      const idsToDelete = esIds.filter(id => !mongoIds.includes(id));
  
      // Eliminar los documentos huérfanos en Elasticsearch
      const deletePromises = idsToDelete.map(id => this.searchService.deleteDocument('libros', id));
      await Promise.all(deletePromises);
  
      console.log(`${idsToDelete.length} documentos huérfanos eliminados de Elasticsearch.`);
  
      // Reindexar los documentos actuales
      const indexPromises = libros.map(libro =>
        this.searchService.indexData('libros', {
          id: libro._id,
          titulo: libro.titulo,
          autores: libro.autores,
          abstract: libro.abstract,
          eliminado: libro.eliminado, 
        })
      );
      await Promise.all(indexPromises);
  
      console.log(`${libros.length} libros han sido actualizados e indexados en Elasticsearch.`);
    } catch (error) {
      console.error('Error al actualizar libros:', error);
      throw new Error('No se pudieron actualizar los libros en Elasticsearch.');
    }
  }
  

  // Obtener todos los libros
  async findAll(
    page: number = 1, 
    size: number = 10, 
    sortBy: string = 'anio_publicacion', 
    sortOrder: string = 'asc',
    autor?: string, // Parámetro opcional para filtrar por autor
    anio_publicacion?: number // Parámetro opcional para filtrar por año de publicación
  ): Promise<Libro[]> {
    const skip = (page - 1) * size;
    const order = sortOrder === 'desc' ? -1 : 1; // Si es 'desc', ordenamos de forma descendente, si no, de forma ascendente.
    
    // Creamos el objeto de filtro dinámicamente
    const filter: any = { eliminado: false };
    if (autor) {
      filter.autores = autor; // Asumimos que el campo en la base de datos es 'autores'
    }
    if (anio_publicacion) {
      filter.anio_publicacion = anio_publicacion;
    }

    return this.libroModel.find(filter)
      .skip(skip)
      .limit(size)
      .sort({ [sortBy]: order })
      .exec();
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
    return this.libroModel.findOneAndUpdate({ _id: id }, libro, { new: true }).exec();
  }

  // Eliminar de forma lógica
  async delete(id: string): Promise<Libro> {
    const libro = await this.libroModel.findById(id);

    if (!libro) {
      throw new Error('Libro no encontrado');
    }

    libro.eliminado = true;

    return libro.save();
  }

  // Restaurar un Libro por su ID
  async restore(id: string): Promise<Libro> {
    const libro = await this.libroModel.findById(id);

    if (!libro) {
      throw new Error('Libro no encontrado');
    }

    libro.eliminado = false; // Cambiar el estado de eliminado a falso
    return libro.save();
  }


  // Buscar libros eliminados
  async findDeleted(): Promise<Libro[]> {
    return this.libroModel.find({ eliminado: true }).exec();
  }

}



