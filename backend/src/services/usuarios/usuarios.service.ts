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

  async validarCredenciales(usuario: string, contrasenia: string): Promise<string | null> {
    const usuarioEncontrado = await this.UsuarioModel.findOne({ usuario });

    // Verificar si el usuario existe y si la contraseña es correcta
    if (usuarioEncontrado && usuarioEncontrado.contrasenia === contrasenia) {
      return usuarioEncontrado._id.toString(); // Devuelve el ID del usuario como string
    }
    
    return null; // Si no se encuentra o la contraseña es incorrecta
  }
}