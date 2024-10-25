import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { IdeasReflexionesService } from 'src/services/ideas-reflexiones/ideas-reflexiones.service';
import { IdeaReflexion } from 'src/schemas/ideas-reflexiones.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Ideas-Reflexiones') 
@Controller('ideas-reflexiones')
export class IdeasReflexionesController {
  constructor(
    private readonly ideaReflexionesService: IdeasReflexionesService,
    private readonly searchService: SearchService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // Obtener todos los ideas-reflexiones
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<IdeaReflexion[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(size, 10) || 10;
    const anio = anio_publicacion ? parseInt(anio_publicacion, 10) : undefined;
  
    return this.ideaReflexionesService.findAll(
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
      'ideas-reflexiones', 
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

  // Eliminar un ideaReflexion por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IdeaReflexion> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.ideaReflexionesService.delete(id);
  }
  
  // Actualizar un ideaReflexion por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() ideaReflexion: Partial<IdeaReflexion>): Promise<IdeaReflexion> {
    return this.ideaReflexionesService.update(id, ideaReflexion);
  }

  // Crear ideaReflexion-libro en servidor y bd
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() ideaReflexion: IdeaReflexion,
    @UploadedFile() file: Express.Multer.File
  ): Promise<IdeaReflexion> {
    if (!file || !ideaReflexion) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      ideaReflexion.titulo ?? 'Sin título',
      ideaReflexion.autores?.join(' ') ?? 'Autor desconocido',
      ideaReflexion.anio_publicacion?.toString() ?? '0000',
      'IR',
      'C:/tmp'
    );

    const nuevoIdeaReflexion: Partial<IdeaReflexion> = {
      titulo: ideaReflexion.titulo,
      anio_publicacion: ideaReflexion.anio_publicacion,
      autores: ideaReflexion.autores,
      observaciones: ideaReflexion.observaciones,
      link_pdf: ideaReflexion.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.ideaReflexionesService.create(nuevoIdeaReflexion as IdeaReflexion);
  }


  // Crear ideaReflexion-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() ideaReflexion: IdeaReflexion): Promise<IdeaReflexion> {
    if (!ideaReflexion) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoIdeaReflexion: Partial<IdeaReflexion> = {
      titulo: ideaReflexion.titulo,
      anio_publicacion: ideaReflexion.anio_publicacion,
      autores: ideaReflexion.autores,
      observaciones: ideaReflexion.observaciones,
      link_pdf: ideaReflexion.link_pdf,
    };
    
    return this.ideaReflexionesService.create(nuevoIdeaReflexion as IdeaReflexion);
  }

}
