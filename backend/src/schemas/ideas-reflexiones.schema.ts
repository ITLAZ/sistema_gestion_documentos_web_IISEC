import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'IdeasReflexiones' })
export class IdeaReflexion extends Document {

  @ApiProperty({ example: 'http://example.com/portada.jpg', description: 'URL de la portada del libro', required: true })
  @Prop({ trim: true })
  portada: string;

  @ApiProperty({ example: 'Título de la idea o reflexión', description: 'Título de la idea o reflexión', required: true })
  @Prop({ required: true, trim: true })
  titulo: string;

  @ApiProperty({ example: ['Autor 1', 'Autor 2'], description: 'Lista de autores de la idea o reflexión', required: true, type: [String] })
  @Prop({ required: true, type: [String] })
  autores: string[];

  @ApiProperty({ example: 2023, description: 'Año de publicación de la idea o reflexión', required: true })
  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @ApiProperty({ example: 'Algunas observaciones adicionales...', description: 'Observaciones adicionales sobre la idea o reflexión', required: false })
  @Prop({ trim: true })
  observaciones: string;

  @ApiProperty({ example: 'http://example.com/document.pdf', description: 'Link al archivo PDF de la idea o reflexión', required: false })
  @Prop({ trim: true })
  link_pdf: string;

  @ApiProperty({ example: '/path/to/file', description: 'Dirección física del archivo PDF', required: false })
  @Prop({ trim: true })
  direccion_archivo: string;

  @ApiProperty({ example: 'false', description: 'Estado del documento(eliminado o no)', required: true })
  @Prop({ trim: true })
  eliminado: boolean;
}

export const IdeaReflexionSchema = SchemaFactory.createForClass(IdeaReflexion);
