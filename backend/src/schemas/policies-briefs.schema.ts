import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'PoliciesBriefs' })
export class PolicyBrief extends Document {

  @ApiProperty({ example: 'Título del Policy Brief', description: 'Título del documento', required: true })
  @Prop({ required: true, trim: true })
  titulo: string;

  @ApiProperty({ example: ['Autor 1', 'Autor 2'], description: 'Lista de autores del Policy Brief', required: true, type: [String] })
  @Prop({ required: true, type: [String] })
  autores: string[];

  @ApiProperty({ example: 2023, description: 'Año de publicación del Policy Brief', required: true })
  @Prop({ required: true, min: 1900, max: new Date().getFullYear() })
  anio_publicacion: number;

  @ApiProperty({ example: 'Mensaje clave del Policy Brief', description: 'Mensaje clave o resumen del documento', required: false })
  @Prop({ trim: true })
  mensaje_clave: string;

  @ApiProperty({ example: 'http://example.com/policybrief.pdf', description: 'Link al archivo PDF del Policy Brief', required: false })
  @Prop({ trim: true })
  link_pdf: string;

  @ApiProperty({ example: '/path/to/file', description: 'Dirección física del archivo PDF', required: false })
  @Prop({ trim: true })
  direccion_archivo: string;
}

export const PolicyBriefSchema = SchemaFactory.createForClass(PolicyBrief);
