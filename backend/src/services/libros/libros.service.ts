import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Libro } from 'src/schemas/libros.schema';

@Injectable()
export class LibrosService {
  constructor(@InjectModel(Libro.name) private libroModel: Model<Libro>) {}

  async create(libro: Libro): Promise<Libro> {
    const nuevoLibro = new this.libroModel(libro);
    return nuevoLibro.save();
  }

  async findAll(): Promise<Libro[]> {
    return this.libroModel.find().exec();
  }
}

