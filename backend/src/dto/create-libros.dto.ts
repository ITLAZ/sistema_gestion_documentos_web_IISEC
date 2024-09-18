import { IsString, IsInt, IsArray, IsUrl, IsOptional } from 'class-validator';
export class CreateLibroDto {
  @IsString()
  portada: string;

  @IsInt()
  anio_publicacion: number;

  @IsString()
  titulo: string;

  @IsArray()
  @IsString({ each: true })
  autores: string[];

  @IsString()
  editorial: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsUrl()
  link_pdf: string;
}
