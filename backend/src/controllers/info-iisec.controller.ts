import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common';
import { InfoIisecService } from 'src/services/info-iisec/info-iisec.service';
import { InfoIISEC } from 'src/schemas/info-iisec.schema';
import { Types } from 'mongoose';

@Controller('info-iisec')
export class InfoIisecController {
    constructor(private readonly infoIisecService: InfoIisecService) {}

  // Obtener todos los Info IISEC
  @Get()
  async findAll(): Promise<InfoIISEC[]> {
    return this.infoIisecService.findAll();
  }
  
  // Buscar Info IISEC por aproximación del título
  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<InfoIISEC[]> {
    return this.infoIisecService.findByTitulo(titulo);
  }

  // Buscar Info IISEC por aproximación del autor
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<InfoIISEC[]> {
    return this.infoIisecService.findByAutor(autor);
  }
  
  // Buscar un infoIISEC por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<InfoIISEC> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.infoIisecService.findById(id);
  }

  // Eliminar un InfoIISEC por su id
@Delete(':id')
async delete(@Param('id') id: string): Promise<InfoIISEC> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID no válido');
  }
  return this.infoIisecService.delete(id);
}

  // Crear un infoIISEC
  @Post()
  async create(@Body() infoIISEC: InfoIISEC): Promise<InfoIISEC> {
    return this.infoIisecService.create(infoIISEC);
  }

  // Actualizar un infoIISEC por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() infoIISEC: Partial<InfoIISEC>): Promise<InfoIISEC> {
    return this.infoIisecService.update(id, infoIISEC);
  }
}
