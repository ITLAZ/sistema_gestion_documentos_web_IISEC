import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CapituloLibro } from 'src/schemas/capitulos-libros.schema';

@Injectable()
export class CapitulosLibrosService {
  constructor(@InjectModel(CapituloLibro.name) private capituloLibro: Model<CapituloLibro>) {}

  async create(capitulo: CapituloLibro): Promise<CapituloLibro> {
    const nuevoCapitulo = new this.capituloLibro(capitulo);
    return nuevoCapitulo.save();
  }

  async findAll(): Promise<CapituloLibro[]> {
    return this.capituloLibro.find().exec();
  }
}
