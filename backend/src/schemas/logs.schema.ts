import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Logs' })
export class Log extends Document {
  @Prop({ required: true })
  id_usuario: string; // Cambia el tipo según sea necesario (string o ObjectId)

  @Prop({ required: false })
  id_documento?: string; // Opcional, por lo que no es requerido

  @Prop({ required: true })
  accion: string; // Descripción de la acción realizada

  @Prop({ required: true, default: Date.now })
  fecha: Date; // Fecha y hora en que se realizó la acción
}

export const LogSchema = SchemaFactory.createForClass(Log);