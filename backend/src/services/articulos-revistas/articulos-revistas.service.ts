import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticuloRevista } from 'src/schemas/articulos-revistas.schema';
import { SearchService } from '../search/search.service';

@Injectable()
export class ArticulosRevistasService {
  constructor(
    @InjectModel(ArticuloRevista.name) // Cambia 'ArticuloRevistaModel' por ArticuloRevista.name
    private articuloRevistaModel: Model<ArticuloRevista>,
    private readonly searchService: SearchService,
  ) {}
  
  async create(articulo: ArticuloRevista): Promise<ArticuloRevista> {
    const nuevoArticulo = new this.articuloRevistaModel(articulo);
    return nuevoArticulo.save();
  }

  async findAll(
    page: number = 1,
    size: number = 10,
    sortBy: string = 'anio_revista',
    sortOrder: string = 'asc',
    autor?: string,
    anio_revista?: number
  ): Promise<ArticuloRevista[]> {
    const skip = (page - 1) * size;
    const order = sortOrder === 'asc' ? 1 : -1;
    
    // Creamos el objeto de filtro dinámicamente
    const filter: any = {};
    if (autor) {
      filter.autores = autor;
    }
    if (anio_revista) {
      filter.anio_revista = anio_revista;
    }
    
    return this.articuloRevistaModel.find(filter)
      .skip(skip)
      .limit(size)
      .sort({ [sortBy]: order })
      .exec();
  }


  async findOneByTitulo(titulo: string): Promise<ArticuloRevista> {
    return this.articuloRevistaModel.findOne({ titulo }).exec();
  }

  async findByTitulo(titulo: string): Promise<ArticuloRevista[]> {
    return await this.articuloRevistaModel.find({ titulo: { $regex: titulo, $options: 'i' } }).exec();
  }

  async findByAutor(autor: string): Promise<ArticuloRevista[]> {
    return await this.articuloRevistaModel.find({ autores: { $elemMatch: { $regex: autor, $options: 'i' } } }).exec();
  }  
  
  async findById(id: string): Promise<ArticuloRevista> {
    return this.articuloRevistaModel.findById(id).exec();
  }

  // Actualizar un ArticuloRevista por su id
  async update(id: string, ArticuloRevista: Partial<ArticuloRevista>): Promise<ArticuloRevista> {
    return this.articuloRevistaModel.findOneAndUpdate({ _id: id }, ArticuloRevista, { new: true }).exec();
  }

  async delete(id: string): Promise<ArticuloRevista> {
    return this.articuloRevistaModel.findByIdAndDelete(id).exec();
  }

  async syncArticulosWithElasticsearch() {
    const articulos = await this.articuloRevistaModel.find().exec();
    
    for (const articulo of articulos) {
      await this.searchService.indexDocument(
        'articulos-revistas',    // Índice en Elasticsearch
        articulo._id.toString(),
        {
          titulo: articulo.titulo,    // Campo para búsquedas          
          autores: articulo.autores,    // Campo para búsquedas
          nombre_revista: articulo.nombre_revista,    // Campo para búsquedas          
          anio_revista: articulo.anio_revista, // Campo para filtros o búsquedas
          abstract: articulo.abstract,           // Campo opcional para mejorar el resultado de búsqueda
          eliminado: articulo.eliminado,
        }
      );
    }
  }

  async findDeleted(): Promise<ArticuloRevista[]> {
    return this.articuloRevistaModel.find({ eliminado: true }).exec();
  }
  

}


