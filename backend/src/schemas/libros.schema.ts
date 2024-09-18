import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Libro extends Document {
  @Prop({ required: true })
  portada: string;

  @Prop({ required: true })
  anio_publicacion: number;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ required: true })
  editorial: string;

  @Prop()
  abstract?: string;

  @Prop({ required: true })
  link_pdf: string;
}

export const LibroSchema = SchemaFactory.createForClass(Libro);
