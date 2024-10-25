import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { DocumentosTrabajoService } from 'src/services/documentos-trabajo/documentos-trabajo.service';
import { DocumentoTrabajo } from 'src/schemas/documentos-trabajo.schema';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { DocumentoTrabajoResponseDto } from 'src/dto/elasticsearch-by-collection-dto';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Documentos-Trabajo') 
@Controller('documentos-trabajo')
export class DocumentosTrabajoController {
  constructor(
    private readonly documentosTrabajoService: DocumentosTrabajoService,
    private readonly searchService: SearchService,
    private readonly fileUploadService: FileUploadService
  ) {}
  
  // Obtener todos los documentos
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<DocumentoTrabajo[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(size, 10) || 10;
    const anio = anio_publicacion ? parseInt(anio_publicacion, 10) : undefined;

    return this.documentosTrabajoService.findAll(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      autores,
      anio
    );
  }

  @Get('search')
  @ApiQuery({ name: 'query', required: true, description: 'Search term' })  // Este es el único obligatorio
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })  // Opcional
  @ApiQuery({ name: 'size', required: false, description: 'Page size' })    // Opcional
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field for sort' })  // Opcional
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Form of order for sort' })  // Opcional
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Publication year' }) // Opcional
  @ApiQuery({ name: 'autores', required: false, description: 'Author filter' })  // Opcional
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: DocumentoTrabajoResponseDto, // El tipo correcto que retornas
    isArray: true // Si devuelves un array de resultados
  })
  async searchBooks(
    @Query('query') query: string,
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string,       // Campo por el que ordenar
    @Query('sortOrder') sortOrder: string,  // Dirección del orden: 'asc' o 'desc'
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);
    const sortField = sortBy || 'anio_publicacion';  // Campo predeterminado si no se proporciona
    const sortDirection: 'asc' | 'desc' = (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'asc';  // Establecer 'asc' por defecto

    const results = await this.searchService.searchByType(
      'documentos-trabajo', 
      query, 
      pageNumber, 
      pageSize,
        {
          anio_publicacion: anio_publicacion ? parseInt(anio_publicacion, 10) : undefined,
          autores
        }, 
      sortField, 
      sortDirection,
    );
    return results;
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

  // Actualizar un documentoTrabajo por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() documento: Partial<DocumentoTrabajo>): Promise<DocumentoTrabajo> {
    return this.documentosTrabajoService.update(id, documento);
  }

  // Eliminar un documentoTrabajo por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DocumentoTrabajo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.documentosTrabajoService.delete(id);
  }

  // Crear documento-libro en servidor y bd
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() documento: DocumentoTrabajo,
    @UploadedFile() file: Express.Multer.File
  ): Promise<DocumentoTrabajo> {
    if (!file || !documento) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      documento.titulo?? 'Sin título',
      documento.autores?.join(' ') ?? 'Autor desconocido',
      documento.anio_publicacion?.toString() ?? '0000',
      'DT',
      'C:/tmp'
    );

    const nuevoCapitulo: Partial<DocumentoTrabajo> = {
      numero_identificacion: documento.numero_identificacion,
      titulo: documento.titulo,
      anio_publicacion: documento.anio_publicacion,
      autores: documento.autores,
      abstract: documento.abstract,
      link_pdf: documento.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.documentosTrabajoService.create(nuevoCapitulo as DocumentoTrabajo);
  }


  // Crear documento-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() documento: DocumentoTrabajo): Promise<DocumentoTrabajo> {
    if (!documento) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoCapitulo: Partial<DocumentoTrabajo> = {
      numero_identificacion: documento.numero_identificacion,
      titulo: documento.titulo,
      anio_publicacion: documento.anio_publicacion,
      autores: documento.autores,
      abstract: documento.abstract,
      link_pdf: documento.link_pdf
    };
    
    return this.documentosTrabajoService.create(nuevoCapitulo as DocumentoTrabajo);
  }
}