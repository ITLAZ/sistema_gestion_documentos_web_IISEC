import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'CapitulosLibros' })
export class CapituloLibro extends Document {
  @Prop({ trim: true})
  numero_identificacion: string;

  @Prop({ required: true, trim: true })
  titulo_libro: string;

  @Prop({ required: true, trim: true })
  titulo_capitulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @Prop({ required: true, type: [String] })
  editores: string[];

  @Prop({ trim: true })
  editorial: string;

  @Prop({ trim: true })
  link_pdf: string;

  @Prop({ trim: true })
  direccion_archivo: string;
}

export const CapituloLibroSchema = SchemaFactory.createForClass(CapituloLibro);
