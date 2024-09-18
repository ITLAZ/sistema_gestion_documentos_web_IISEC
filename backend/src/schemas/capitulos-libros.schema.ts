import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CapituloLibro extends Document {
  @Prop({ required: true })
  titulo_libro: string;

  @Prop({ required: true })
  titulo_capitulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ required: true })
  anio_publicacion: number;

  @Prop({ required: true })
  editorial: string;

  @Prop({ required: true })
  link_pdf: string;
}

export const CapituloLibroSchema = SchemaFactory.createForClass(CapituloLibro);
