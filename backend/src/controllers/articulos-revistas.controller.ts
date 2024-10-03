import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common';
import { ArticulosRevistasService } from 'src/services/articulos-revistas/articulos-revistas.service';
import { ArticuloRevista } from 'src/schemas/articulos-revistas.schema';
import { Types } from 'mongoose';

@Controller('articulos-revistas')
export class ArticulosRevistasController {
  constructor(private readonly articulosRevistasService: ArticulosRevistasService) {}

  // Obtener todos los artículos
  @Get()
  async findAll(): Promise<ArticuloRevista[]> {
    return this.articulosRevistasService.findAll();
  }

  // Buscar articulos por aproximación del título
  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<ArticuloRevista[]> {
    return this.articulosRevistasService.findByTitulo(titulo);
  }

  // Buscar articulos por aproximación del autor
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<ArticuloRevista[]> {
    return this.articulosRevistasService.findByAutor(autor);
  }

  // Eliminar un artículo por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ArticuloRevista> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.articulosRevistasService.delete(id);
  }

  // Crear un nuevo artículo
  @Post()
  async create(@Body() articulo: ArticuloRevista): Promise<ArticuloRevista> {
    return this.articulosRevistasService.create(articulo);
  }

  
}
