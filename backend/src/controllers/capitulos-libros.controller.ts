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
