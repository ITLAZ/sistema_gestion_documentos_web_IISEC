import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ collection: 'Usuarios' })
export class Usuario extends Document {
  @Prop({ required: true })
  usuario: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  contrasenia: string;

  @Prop({ required: true })
  theme: number;

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