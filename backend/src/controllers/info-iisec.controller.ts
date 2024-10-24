import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { InfoIisecService } from 'src/services/info-iisec/info-iisec.service';
import { InfoIISEC } from 'src/schemas/info-iisec.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Info-IISEC') 
@Controller('info-iisec')
export class InfoIisecController {
    constructor(
      private readonly infoIisecService: InfoIisecService,
      private readonly searchService: SearchService,
      private readonly fileUploadService: FileUploadService
    ) {}

  // Obtener todos los Info IISEC
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<InfoIISEC[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(size, 10) || 10;
    const anio = anio_publicacion ? parseInt(anio_publicacion, 10) : undefined;
  
    return this.infoIisecService.findAll(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      autores,
      anio
    );
  }

  @Get('search')
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
      'info-iisec', 
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

  // Actualizar un infoIISEC por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() infoIISEC: Partial<InfoIISEC>): Promise<InfoIISEC> {
    return this.infoIisecService.update(id, infoIISEC);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() infoIISEC: InfoIISEC,
    @UploadedFile() file: Express.Multer.File
  ): Promise<InfoIISEC> {
    if (!file || !infoIISEC) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      infoIISEC.titulo ?? 'Sin título',
      infoIISEC.autores?.join(' ') ?? 'Autor desconocido',
      infoIISEC.anio_publicacion?.toString() ?? '0000',
      'II',
      'C:/tmp'
    );

    const nuevoinfoIISEC: Partial<InfoIISEC> = {
      titulo: infoIISEC.titulo,
      anio_publicacion: infoIISEC.anio_publicacion,
      autores: infoIISEC.autores,
      observaciones: infoIISEC.observaciones,
      link_pdf: infoIISEC.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.infoIisecService.create(nuevoinfoIISEC as InfoIISEC);
  }


  // Crear infoIISEC-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() infoIISEC: InfoIISEC): Promise<InfoIISEC> {
    if (!infoIISEC) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoinfoIISEC: Partial<InfoIISEC> = {
      titulo: infoIISEC.titulo,
      anio_publicacion: infoIISEC.anio_publicacion,
      autores: infoIISEC.autores,
      observaciones: infoIISEC.observaciones,
      link_pdf: infoIISEC.link_pdf,
    };
    
    return this.infoIisecService.create(nuevoinfoIISEC as InfoIISEC);
  }
}
