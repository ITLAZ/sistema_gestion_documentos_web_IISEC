import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'DocumentosTrabajo' })
export class DocumentoTrabajo extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ required: true })
  anio_publicacion: number;

  @Prop({ required: true })
  institucion: string;

  @Prop({ required: true })
  link_pdf: string;
}

export const DocumentoTrabajoSchema = SchemaFactory.createForClass(DocumentoTrabajo);
