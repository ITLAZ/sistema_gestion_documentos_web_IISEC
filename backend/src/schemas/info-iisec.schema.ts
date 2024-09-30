import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'InfoIISEC' })
export class InfoIISEC extends Document {
  @Prop({ required: true, trim: true})
  titulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @Prop({ trim: true })
  observaciones: string;

  @Prop({ trim: true })
  link_pdf: string;

  @Prop({ trim: true })
  direccion_archivo: string;
}

export const InfoIISECSchema = SchemaFactory.createForClass(InfoIISEC);
