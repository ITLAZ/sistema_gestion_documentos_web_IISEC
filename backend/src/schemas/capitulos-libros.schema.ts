import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'CapitulosLibros' })
export class CapituloLibro extends Document {

  @ApiProperty({ example: '08/4', description: 'Número de identificación del capítulo', required: false })
  @Prop({ trim: true })
  numero_identificacion: string;

  @ApiProperty({ example: 'El título del libro', description: 'Título del libro', required: true })
  @Prop({ required: true, trim: true })
  titulo_libro: string;

  @ApiProperty({ example: 'Capítulo 1: Introducción a...', description: 'Título del capítulo dentro del libro', required: true })
  @Prop({ required: true, trim: true })
  titulo_capitulo: string;

  @ApiProperty({ example: ['Juan Pérez', 'Luis García'], description: 'Autores del capítulo', required: true, type: [String] })
  @Prop({ required: true, type: [String] })
  autores: string[];

  @ApiProperty({ example: 2022, description: 'Año de publicación del capítulo', required: true })
  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @ApiProperty({ example: ['Carlos Sánchez', 'Marta Rodríguez'], description: 'Editores del libro', required: true, type: [String] })
  @Prop({ required: true, type: [String] })
  editores: string[];

  @ApiProperty({ example: 'Editorial ABC', description: 'Editorial del capítulo o del libro', required: false })
  @Prop({ trim: true })
  editorial: string;

  @ApiProperty({ example: 'http://example.com/chapter.pdf', description: 'Link al PDF del capítulo', required: false })
  @Prop({ trim: true })
  link_pdf: string;

  @ApiProperty({ example: '/path/to/file', description: 'Dirección física del archivo PDF', required: false })
  @Prop({ trim: true })
  direccion_archivo: string;
}

export const CapituloLibroSchema = SchemaFactory.createForClass(CapituloLibro);
