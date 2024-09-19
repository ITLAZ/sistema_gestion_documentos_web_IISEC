import { IsString, IsInt} from 'class-validator';
export class CreateLibroDto {
  @IsString()
  usuario: string;

  @IsString()
  nombre: string;

  @IsString()
  contrasenia: string;

  @IsInt()
  theme: number;
}