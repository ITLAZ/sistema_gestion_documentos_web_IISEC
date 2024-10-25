import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { LibrosService } from 'src/services/libros/libros.service';
import { Libro } from 'src/schemas/libros.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';  
import { Types } from 'mongoose';
import { SearchService } from 'src/services/search/search.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LibrosResponseDto } from 'src/dto/elasticsearch-by-collection-dto';

// Función para obtener las opciones de Multer
const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Libros') 
@Controller('libros')
export class LibrosController {
  constructor(
    private readonly librosService: LibrosService,
    private readonly searchService: SearchService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get('update-libros')
  async updateLibros(): Promise<void> {
    this.librosService.updateAllLibros();
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
    type: LibrosResponseDto, // El tipo correcto que retornas
    isArray: true // Si devuelves un array de resultados
  })async searchBooks(
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
      'libros', 
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

  @Get()
  async findAll(
    @Query('page') page: string, 
    @Query('size') size: string,
    @Query('sortBy') sortBy: string,       // Campo por el que ordenar
    @Query('sortOrder') sortOrder: string,
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,  // Dirección del orden: 'asc' o 'desc'
  ): Promise<Libro[]>  {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(size, 10) || 10;
    const sortField = sortBy || 'titulo';  // Campo predeterminado si no se proporciona
    const sortDirection = sortOrder || 'asc';  // Dirección predeterminada si no se proporciona
    const anio = anio_publicacion ? parseInt(anio_publicacion, 10) : undefined;
    const _autores = autores

    return this.librosService.findAll(
      pageNumber, 
      pageSize, 
      sortField, 
      sortDirection,
      _autores,
      anio,
    );
  }

  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<Libro[]> {
    return this.librosService.findByTitulo(titulo);
  }

  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<Libro[]> {
    return this.librosService.findByAutor(autor);
  }
  
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<Libro> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.librosService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() libro: Partial<Libro>): Promise<Libro> {
    return this.librosService.update(id, libro);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Libro> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.librosService.delete(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() libro: Libro,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Libro> {
    if (!file || !libro) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      libro.titulo ?? 'Sin título',
      libro.autores?.join(' ') ?? 'Autor desconocido',
      libro.anio_publicacion?.toString() ?? '0000',
      'Lib',
      'C:/tmp'
    );

    const nuevoLibro: Partial<Libro> = {
      portada: libro.portada,
      anio_publicacion: libro.anio_publicacion,
      titulo: libro.titulo,
      autores: libro.autores,
      editorial: libro.editorial,
      abstract: libro.abstract,
      link_pdf: libro.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.librosService.create(nuevoLibro as Libro);
  }

  @Post('no-upload')
  async createWithoutFile(@Body() libro: Libro): Promise<Libro> {
    if (!libro) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoLibro: Partial<Libro> = {
      portada: libro.portada,
      anio_publicacion: libro.anio_publicacion,
      titulo: libro.titulo,
      autores: libro.autores,
      editorial: libro.editorial,
      abstract: libro.abstract,
      link_pdf: libro.link_pdf,
    };

    return this.librosService.create(nuevoLibro as Libro);
  }
}
