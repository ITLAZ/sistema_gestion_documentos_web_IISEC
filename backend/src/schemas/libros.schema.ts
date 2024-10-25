import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'Libros' })
export class Libro extends Document {

  @ApiProperty({ example: 'http://example.com/portada.jpg', description: 'URL de la portada del libro', required: true })
  @Prop({ required: true, trim: true })
  portada: string;

  @ApiProperty({ example: 2023, description: 'Año de publicación del libro', required: true })
  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @ApiProperty({ example: 'Título del libro', description: 'Título del libro', required: true })
  @Prop({ required: true, trim: true })
  titulo: string;

  @ApiProperty({ example: ['Autor 1', 'Autor 2'], description: 'Lista de autores del libro', required: true, type: [String] })
  @Prop({ required: true, type: [String] })
  autores: string[];

  @ApiProperty({ example: 'Editorial XYZ', description: 'Editorial del libro', required: false })
  @Prop({ trim: true })
  editorial: string;

  @ApiProperty({ example: 'Este libro trata sobre...', description: 'Resumen o abstract del libro', required: false })
  @Prop({ trim: true })
  abstract?: string;

  @ApiProperty({ example: 'http://example.com/libro.pdf', description: 'Link al archivo PDF del libro', required: false })
  @Prop({ trim: true })
  link_pdf: string;

  @ApiProperty({ example: '/path/to/file', description: 'Dirección física del archivo PDF', required: false })
  @Prop({ trim: true })
  direccion_archivo: string;
}

export const LibroSchema = SchemaFactory.createForClass(Libro);
