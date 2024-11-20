import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'Usuarios' })
export class Usuario extends Document {

  @ApiProperty({
    example: 'jdoe',
    description: 'Nombre único de usuario',
  })
  @Prop({ required: true })
  usuario: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  @Prop({ required: true })
  nombre: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: 'Contraseña del usuario encriptada',
  })
  @Prop({ required: true })
  contrasenia: string;

  @ApiProperty({
    example: 1,
    description: 'Tema visual preferido del usuario',
  })
  @Prop({ required: true })
  theme: number;

  @ApiProperty({
    example: false,
    description: 'Indica si el usuario tiene permisos de administrador',
  })
  @Prop({ required: true, default: false }) 
  admin: boolean;

  async compararContrasenia(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.contrasenia);
  }
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

UsuarioSchema.pre<Usuario>('save', async function (next) {
  const usuario = this;

  if (!usuario.isModified('contrasenia')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    usuario.contrasenia = await bcrypt.hash(usuario.contrasenia, salt);
    next();
  } catch (error) {
    next(error);
  }
});