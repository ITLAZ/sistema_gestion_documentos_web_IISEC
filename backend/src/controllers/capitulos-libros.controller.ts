import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common';
import { CapitulosLibrosService } from 'src/services/capitulos-libros/capitulos-libros.service';
import { CapituloLibro } from 'src/schemas/capitulos-libros.schema';
import { Types } from 'mongoose';

@Controller('capitulos-libros')
export class CapitulosLibrosController {
  constructor(private readonly capitulosLibrosService: CapitulosLibrosService) {}

  // Obtener todos los capítulos
  @Get()
  async findAll(): Promise<CapituloLibro[]> {
    return this.capitulosLibrosService.findAll();
  }

  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<CapituloLibro[]> {
    return this.capitulosLibrosService.findByTitulo(titulo);
  }

  // Buscar documentoTrabajo por aproximación del autor  
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<CapituloLibro[]> {
    return this.capitulosLibrosService.findByAutor(autor);
  }
  
  // Buscar un documentoTrabajo por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<CapituloLibro> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.capitulosLibrosService.findById(id);
  }

  // Eliminar un capítulo por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CapituloLibro> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.capitulosLibrosService.delete(id);
  }


  // Crear un nuevo capítulo
  @Post()
  async create(@Body() capitulo: CapituloLibro): Promise<CapituloLibro> {
    return this.capitulosLibrosService.create(capitulo);
  }

}
