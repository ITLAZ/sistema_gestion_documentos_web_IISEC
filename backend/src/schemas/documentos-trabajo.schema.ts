import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'DocumentosTrabajo' })
export class DocumentoTrabajo extends Document {
  @Prop({ trim: true})
  numero_identificacion: string;
  
  @Prop({ required: true, trim: true})
  titulo: string;

  @Prop({ required: true, type: [String] })
  autores: string[];

  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @Prop({ trim: true })
  abstract: string;

  @Prop({ trim: true })
  link_pdf: string;

  @Prop({ trim: true })
  direccion_archivo: string;
}

export const DocumentoTrabajoSchema = SchemaFactory.createForClass(DocumentoTrabajo);
