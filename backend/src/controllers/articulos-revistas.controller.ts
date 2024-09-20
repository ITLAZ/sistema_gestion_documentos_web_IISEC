import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
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


  // Crear un nuevo artículo
  @Post()
  async create(@Body() articulo: ArticuloRevista): Promise<ArticuloRevista> {
    return this.articulosRevistasService.create(articulo);
  }

  
}
