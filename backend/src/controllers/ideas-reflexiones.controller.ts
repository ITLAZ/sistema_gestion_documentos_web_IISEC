import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { IdeasReflexionesService } from 'src/services/ideas-reflexiones/ideas-reflexiones.service';
import { IdeaReflexion } from 'src/schemas/ideas-reflexiones.schema';
import { Types } from 'mongoose';

@Controller('ideas-reflexiones')
export class IdeasReflexionesController {
  constructor(private readonly ideaReflexionesService: IdeasReflexionesService) {}

  // Obtener todos los ideas-reflexiones
  @Get()
  async findAll(): Promise<IdeaReflexion[]> {
    return this.ideaReflexionesService.findAll();
  }
  
  // Buscar ideas-reflexiones por aproximación del título
  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<IdeaReflexion[]> {
    return this.ideaReflexionesService.findByTitulo(titulo);
  }

  // Buscar ideas-reflexiones por aproximación del autor
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<IdeaReflexion[]> {
    return this.ideaReflexionesService.findByAutor(autor);
  }
  
  // Buscar un ideaReflexion por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<IdeaReflexion> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.ideaReflexionesService.findById(id);
  }

  // Crear un ideaReflexion
  @Post()
  async create(@Body() ideaReflexion: IdeaReflexion): Promise<IdeaReflexion> {
    return this.ideaReflexionesService.create(ideaReflexion);
  }

  // Actualizar un ideaReflexion por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() ideaReflexion: Partial<IdeaReflexion>): Promise<IdeaReflexion> {
    return this.ideaReflexionesService.update(id, ideaReflexion);
  }

}
