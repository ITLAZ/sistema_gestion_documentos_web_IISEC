import { IsString, IsInt, IsArray, IsUrl } from 'class-validator';

export class CreateArticuloDto {
  @IsString()
  numero_articulo: string;

  @IsString()
  titulo: string;

  @IsArray()
  @IsString({ each: true })
  autores: string[];

  @IsString()
  nombre_revista: string;

  @IsInt()
  anio_revista: number;

  @IsString()
  editorial: string;

  @IsUrl()
  link_pdf: string;
}
