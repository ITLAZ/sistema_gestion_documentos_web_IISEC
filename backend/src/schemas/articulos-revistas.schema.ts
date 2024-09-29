import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'ArticulosRevistas' })
export class ArticuloRevista extends Document {
  @Prop()
  numero_articulo: string;

  @Prop({ required: true, trim: true })
  titulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ required: true, trim: true })
  nombre_revista: string;

  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_revista: number;

  @Prop({trim: true })
  editorial: string;

  @Prop({trim: true })
  abstract: string;

  @Prop({trim: true })
  link_pdf: string;

  @Prop({trim: true })
  direccion_archivo: string;
}

export const ArticuloRevistaSchema = SchemaFactory.createForClass(ArticuloRevista);
