import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common';
import { DocumentosTrabajoService } from 'src/services/documentos-trabajo/documentos-trabajo.service';
import { DocumentoTrabajo } from 'src/schemas/documentos-trabajo.schema';
import { Types } from 'mongoose';

@Controller('documentos-trabajo')
export class DocumentosTrabajoController {
  constructor(private readonly documentosTrabajoService: DocumentosTrabajoService) {}

  // Obtener todos los documentos
  @Get()
  async findAll(): Promise<DocumentoTrabajo[]> {
    return this.documentosTrabajoService.findAll();
  }

  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<DocumentoTrabajo[]> {
    return this.documentosTrabajoService.findByTitulo(titulo);
  }

  // Buscar documentoTrabajo por aproximación del autor  
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<DocumentoTrabajo[]> {
    return this.documentosTrabajoService.findByAutor(autor);
  }
  
  // Buscar un documentoTrabajo por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<DocumentoTrabajo> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.documentosTrabajoService.findById(id);
  }

  // Eliminar un documentoTrabajo por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DocumentoTrabajo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.documentosTrabajoService.delete(id);
  }

  // Crear un nuevo documentoTrabajo
  @Post()
  async create(@Body() documento: DocumentoTrabajo): Promise<DocumentoTrabajo> {
    return this.documentosTrabajoService.create(documento);
  }

}
