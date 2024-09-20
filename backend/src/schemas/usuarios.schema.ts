import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Usuarios' })
export class Usuario extends Document {
  @Prop({ required: true })
  usuario: string;

  @Prop({ required: true })
  nombre: number;

  @Prop({ required: true })
  contrasenia: string;

  @Prop({ required: true })
  theme: number;

}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);