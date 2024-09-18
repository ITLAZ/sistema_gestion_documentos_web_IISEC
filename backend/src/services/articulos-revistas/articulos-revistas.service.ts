import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticuloRevista } from 'src/schemas/articulos-revistas.schema';

@Injectable()
export class ArticulosRevistasService {
  constructor(
    @InjectModel(ArticuloRevista.name) // Cambia 'ArticuloRevistaModel' por ArticuloRevista.name
    private articuloRevistaModel: Model<ArticuloRevista>
  ) {}
  

  async create(articulo: ArticuloRevista): Promise<ArticuloRevista> {
    const nuevoArticulo = new this.articuloRevistaModel(articulo);
    return nuevoArticulo.save();
  }

  async findAll(): Promise<ArticuloRevista[]> {
    return this.articuloRevistaModel.find().exec();
  }
}


