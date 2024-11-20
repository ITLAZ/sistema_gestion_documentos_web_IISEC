import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'DocumentosTrabajo' })
export class DocumentoTrabajo extends Document {

  @ApiProperty({ example: 'http://example.com/portada.jpg', description: 'URL de la portada del libro', required: true })
  @Prop({ trim: true })
  portada: string;

  @ApiProperty({ example: 'DT-2024-001', description: 'Número de identificación del documento de trabajo', required: false })
  @Prop({ trim: true })
  numero_identificacion: string;

  @ApiProperty({ example: 'Título del documento de trabajo', description: 'Título del documento', required: true })
  @Prop({ required: true, trim: true })
  titulo: string;

  @ApiProperty({ example: ['Juan Pérez', 'Ana Gómez'], description: 'Autores del documento', required: true, type: [String] })
  @Prop({ required: true, type: [String] })
  autores: string[];

  @ApiProperty({ example: 2023, description: 'Año de publicación del documento de trabajo', required: true })
  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @ApiProperty({ example: 'Este documento de trabajo trata sobre...', description: 'Resumen o abstract del documento', required: false })
  @Prop({ trim: true })
  abstract: string;

  @ApiProperty({ example: 'http://example.com/document.pdf', description: 'Link al archivo PDF del documento', required: false })
  @Prop({ trim: true })
  link_pdf: string;

  @ApiProperty({ example: '/path/to/file', description: 'Dirección física del archivo PDF', required: false })
  @Prop({ trim: true })
  direccion_archivo: string;

  @ApiProperty({ example: 'false', description: 'Estado del documento(eliminado o no)', required: true })
  @Prop({ trim: true })
  eliminado: boolean;
}

export const DocumentoTrabajoSchema = SchemaFactory.createForClass(DocumentoTrabajo);
