import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'ArticulosRevistas' })
export class ArticuloRevista extends Document {

  @ApiProperty({ example: 'http://example.com/portada.jpg', description: 'URL de la portada del libro', required: true })
  @Prop({ trim: true })
  portada: string;

  @ApiProperty({ example: '08/4', description: 'Número del artículo', required: false })
  @Prop()
  numero_articulo: string;

  @ApiProperty({ example: 'El título del artículo', description: 'Título del artículo', required: true })
  @Prop({ required: true, trim: true })
  titulo: string;

  @ApiProperty({ example: ['Juan Pérez', 'Luis García'], description: 'Autores del artículo', required: true, type: [String] })
  @Prop({ required: true, type: [String] })
  autores: string[];

  @ApiProperty({ example: 'Revista Científica XYZ', description: 'Nombre de la revista donde fue publicado', required: true })
  @Prop({ required: true, trim: true })
  nombre_revista: string;

  @ApiProperty({ example: 2022, description: 'Año de publicación de la revista', required: true })
  @Prop({ required: true, min: 0, max: new Date().getFullYear() })
  anio_revista: number;

  @ApiProperty({ example: 'Editorial ABC', description: 'Editorial del artículo', required: false })
  @Prop({ trim: true })
  editorial: string;

  @ApiProperty({ example: 'Un resumen breve del artículo', description: 'Abstract del artículo', required: false })
  @Prop({ trim: true })
  abstract: string;

  @ApiProperty({ example: 'http://example.com/article.pdf', description: 'Link al PDF del artículo', required: false })
  @Prop({ trim: true })
  link_pdf: string;

  @ApiProperty({ example: '/path/to/file', description: 'Dirección física del archivo PDF', required: false })
  @Prop({ trim: true })
  direccion_archivo: string;

  @ApiProperty({ example: 'false', description: 'Estado del documento(eliminado o no)', required: true })
  @Prop({ trim: true })
  eliminado: boolean;
}

export const ArticuloRevistaSchema = SchemaFactory.createForClass(ArticuloRevista);
