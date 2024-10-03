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

  // Eliminar un documento por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DocumentoTrabajo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.documentosTrabajoService.delete(id);
  }

  // Crear un nuevo documento
  @Post()
  async create(@Body() documento: DocumentoTrabajo): Promise<DocumentoTrabajo> {
    return this.documentosTrabajoService.create(documento);
  }

}
