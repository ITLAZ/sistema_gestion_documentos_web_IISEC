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
  async findAll(
    page: number = 1,
    size: number = 10,
    sortBy: string = 'anio_publicacion',
    sortOrder: string = 'asc',
    autor?: string,
    anio_publicacion?: number
  ): Promise<CapituloLibro[]> {
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
  
    return this.CapituloLibroModel.find(filter)
      .skip(skip)
      .limit(size)
      .sort({ [sortBy]: order })
      .exec();
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
  
  // Eliminado lógico
  async delete(id: string): Promise<CapituloLibro> {
    const capitulo = await this.CapituloLibroModel.findById(id);

    if (!capitulo) {
      throw new Error('Capítulo no encontrado');
    }

    capitulo.eliminado = true;

    return capitulo.save();
  }

  // Restaurar un Capítulo de Libro por su ID
  async restore(id: string): Promise<CapituloLibro> {
    const capitulo = await this.CapituloLibroModel.findById(id);

    if (!capitulo) {
      throw new Error('Capítulo de Libro no encontrado');
    }

    capitulo.eliminado = false;
    return capitulo.save();
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
          eliminado: capitulo.eliminado,
        }
      );
    }
  }

  async findDeleted(): Promise<CapituloLibro[]> {
    return this.CapituloLibroModel.find({ eliminado: true }).exec();
  }
  
}
