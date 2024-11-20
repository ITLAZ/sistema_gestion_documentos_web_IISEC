import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'InfoIISEC' })
export class InfoIISEC extends Document {

  @ApiProperty({ example: 'http://example.com/portada.jpg', description: 'URL de la portada del libro', required: true })
  @Prop({ trim: true })
  portada: string;

  @ApiProperty({ example: 'Título del informe IISEC', description: 'Título del documento de información de IISEC', required: true })
  @Prop({ required: true, trim: true })
  titulo: string;

  @ApiProperty({ example: ['Autor 1', 'Autor 2'], description: 'Lista de autores del documento de IISEC', required: true, type: [String] })
  @Prop({ required: true, type: [String] })
  autores: string[];

  @ApiProperty({ example: 2023, description: 'Año de publicación del documento IISEC', required: true })
  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @ApiProperty({ example: 'Observaciones adicionales sobre el informe...', description: 'Observaciones adicionales sobre el documento IISEC', required: false })
  @Prop({ trim: true })
  observaciones: string;

  @ApiProperty({ example: 'http://example.com/document.pdf', description: 'Link al archivo PDF del documento IISEC', required: false })
  @Prop({ trim: true })
  link_pdf: string;

  @ApiProperty({ example: '/path/to/file', description: 'Dirección física del archivo PDF', required: false })
  @Prop({ trim: true })
  direccion_archivo: string;
  
  @ApiProperty({ example: 'false', description: 'Estado del documento(eliminado o no)', required: true })
  @Prop({ trim: true })
  eliminado: boolean;
}

export const InfoIISECSchema = SchemaFactory.createForClass(InfoIISEC);
