import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ArticuloRevista extends Document {
  @Prop({ required: true })
  numero_articulo: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ required: true })
  nombre_revista: string;

  @Prop({ required: true })
  anio_revista: number;

  @Prop({ required: true })
  editorial: string;

  @Prop({ required: true })
  link_pdf: string;
}

export const ArticuloRevistaSchema = SchemaFactory.createForClass(ArticuloRevista);
