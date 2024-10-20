import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CapituloLibro } from 'src/schemas/capitulos-libros.schema';
import { SearchService } from '../search/search.service';

@Injectable()
export class CapitulosLibrosService {
  constructor(
    @InjectModel(CapituloLibro.name) private CapituloLibroModel: Model<CapituloLibro>,
    private readonly searchService: SearchService,
  ) {}

  // Crear un CapituloLibro
  async create(CapituloLibro: CapituloLibro): Promise<CapituloLibro> {
    const nuevoCapituloLibro = new this.CapituloLibroModel(CapituloLibro);
    return nuevoCapituloLibro.save();
  }

  // Obtener todos los CapituloLibros
  async findAll(): Promise<CapituloLibro[]> {
    return this.CapituloLibroModel.find().exec();
  }

  // Buscar un CapituloLibro por su título
  async findOneByTitulo(titulo: string): Promise<CapituloLibro> {
    return this.CapituloLibroModel.findOne({ titulo }).exec();
  }

  // Buscar CapituloLibros por título con aproximación
  async findByTitulo(titulo: string): Promise<CapituloLibro[]> {
    return await this.CapituloLibroModel.find({ titulo: { $regex: titulo, $options: 'i' } }).exec();
  }

  // Buscar CapituloLibros por autor con aproximación
  async findByAutor(autor: string): Promise<CapituloLibro[]> {
    return await this.CapituloLibroModel.find({ autores: { $elemMatch: { $regex: autor, $options: 'i' } } }).exec();
  }  
  
  // Buscar CapituloLibros por su id
  async findById(id: string): Promise<CapituloLibro> {
    return this.CapituloLibroModel.findById(id).exec();
  }

  // Actualizar un CapituloLibro por su id
  async update(id: string, CapituloLibro: Partial<CapituloLibro>): Promise<CapituloLibro> {
    return this.CapituloLibroModel.findOneAndUpdate({ _id: id }, CapituloLibro, { new: true }).exec();
  }
  // Eliminar un capítulo por su id
  async delete(id: string): Promise<CapituloLibro> {
    return this.CapituloLibroModel.findByIdAndDelete(id).exec();
  }


  // Metodos ElasticSearch
  async syncCapitulosWithElasticsearch() {
    const capitulos = await this.CapituloLibroModel.find().exec();
    
    for (const capitulo of capitulos) {
      await this.searchService.indexDocument(
        'capitulos-libros',    // Índice en Elasticsearch
        capitulo._id.toString(),
        {
          titulo_capitulo: capitulo.titulo_capitulo,    // Campo para búsquedas          
          autores: capitulo.autores,    // Campo para búsquedas
          titulo_libro: capitulo.titulo_libro,    // Campo para búsquedas          
          anio_publicacion: capitulo.anio_publicacion, // Campo para filtros o búsquedas
          editorial: capitulo.editorial,  
          editores: capitulo.editores,         // Campo opcional para mejorar el resultado de búsqueda
        }
      );
    }
  }
}
