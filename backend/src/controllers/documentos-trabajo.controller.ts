import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
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
  // Crear un nuevo documento
  @Post()
  async create(@Body() documento: DocumentoTrabajo): Promise<DocumentoTrabajo> {
    return this.documentosTrabajoService.create(documento);
  }

}
