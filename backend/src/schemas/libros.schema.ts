import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Libros' })
export class Libro extends Document {
  @Prop({ required: true, trim: true})
  portada: string;

  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ trim: true })
  editorial: string;

  @Prop({ trim: true })
  abstract?: string;

  @Prop({ trim: true })
  link_pdf: string;

  @Prop({ trim: true })
  direccion_archivo: string;
}

export const LibroSchema = SchemaFactory.createForClass(Libro);
