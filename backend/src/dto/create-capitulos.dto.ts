import { IsString, IsInt, IsArray, IsUrl } from 'class-validator';

export class CreateCapituloDto {
  @IsString()
  titulo_libro: string;

  @IsString()
  titulo_capitulo: string;

  @IsArray()
  @IsString({ each: true })
  autores: string[];

  @IsInt()
  anio_publicacion: number;

  @IsString()
  editorial: string;

  @IsUrl()
  link_pdf: string;
}
