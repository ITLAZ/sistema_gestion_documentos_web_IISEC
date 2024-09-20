import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from 'src/schemas/usuarios.schema';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>) {}

  async create(Usuario: Usuario): Promise<Usuario> {
    const nuevoUsuario = new this.UsuarioModel(Usuario);
    return nuevoUsuario.save();
  }

  async findAll(): Promise<Usuario[]> {
    return this.UsuarioModel.find().exec();
  }
}