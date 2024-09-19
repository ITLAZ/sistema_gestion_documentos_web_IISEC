// controllers/libros.controller.ts
import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { LibrosService } from 'src/services/libros/libros.service';
import { Libro } from 'src/schemas/libros.schema';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  // Obtener todos los libros
  @Get()
  async findAll(): Promise<Libro[]> {
    return this.librosService.findAll();
  }

  // Obtener un libro por su título
  @Get(':titulo')
  async findOne(@Param('titulo') titulo: string): Promise<Libro> {
    return this.librosService.findOneByTitulo(titulo);
  }

  // Crear un libro
  @Post()
  async create(@Body() libro: Libro): Promise<Libro> {
    return this.librosService.create(libro);
  }

  // Actualizar un libro por su título
  @Put(':titulo')
  async update(@Param('titulo') titulo: string, @Body() libro: Partial<Libro>): Promise<Libro> {
    return this.librosService.update(titulo, libro);
  }

}
