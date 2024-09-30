import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/schemas/usuarios.schema';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>) {}

  async create(usuarioDto: Partial<Usuario>): Promise<Usuario> {
    const nuevoUsuario = new this.UsuarioModel(usuarioDto);
    return nuevoUsuario.save();
  }

  async validatePassword(usuario: string, plainPassword: string): Promise<boolean> {
    const user = await this.UsuarioModel.findOne({ usuario });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Comparar la contraseña proporcionada con la almacenada
    return user.compararContrasenia(plainPassword);
  }
  async findAll(): Promise<Usuario[]> {
    return this.UsuarioModel.find().exec();
  }

  async validarCredenciales(usuario: string, plainPassword: string): Promise<string | null> {
    // Buscar el usuario en la base de datos por su nombre de usuario
    const usuarioEncontrado = await this.UsuarioModel.findOne({ usuario });

    if (!usuarioEncontrado) {
      return null; // Usuario no encontrado
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada
    const contraseniaCoincide = await bcrypt.compare(plainPassword, usuarioEncontrado.contrasenia);

    if (!contraseniaCoincide) {
      return null; // Contraseña incorrecta
    }

    // Retorna el ID del usuario si las credenciales son válidas
    return usuarioEncontrado._id.toString();
  }
}