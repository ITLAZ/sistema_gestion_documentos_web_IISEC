// controllers/libros.controller.ts
import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { LibrosService } from 'src/services/libros/libros.service';
import { Libro } from 'src/schemas/libros.schema';
import { Types } from 'mongoose';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  // Obtener todos los libros
  @Get()
  async findAll(): Promise<Libro[]> {
    return this.librosService.findAll();
  }
  
  // Buscar libros por aproximación del título
  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<Libro[]> {
    return this.librosService.findByTitulo(titulo);
  }

  // Buscar libros por aproximación del autor
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<Libro[]> {
    return this.librosService.findByAutor(autor);
  }
  
  // Buscar un libro por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<Libro> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.librosService.findById(id);
  }

  // Crear un libro
  @Post()
  async create(@Body() libro: Libro): Promise<Libro> {
    return this.librosService.create(libro);
  }

  // Actualizar un libro por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() libro: Partial<Libro>): Promise<Libro> {
    return this.librosService.update(id, libro);
  }

}
