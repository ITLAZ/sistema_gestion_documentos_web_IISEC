import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { CapitulosLibrosService } from 'src/services/capitulos-libros/capitulos-libros.service';
import { CapituloLibro } from 'src/schemas/capitulos-libros.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';  
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { CapituloLibroResponseDto } from 'src/dto/elasticsearch-by-collection-dto';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Capitulos-Libros') 
@Controller('capitulos-libros')
export class CapitulosLibrosController {
  constructor(
    private readonly capitulosLibrosService: CapitulosLibrosService,
    private readonly searchService: SearchService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // Obtener todos los capítulos
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<CapituloLibro[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(size, 10) || 10;
    const anio = anio_publicacion ? parseInt(anio_publicacion, 10) : undefined;

    return this.capitulosLibrosService.findAll(
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
    type: CapituloLibroResponseDto, // El tipo correcto que retornas
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
      'capitulos-libros', 
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
  async findByTitulo(@Param('titulo') titulo: string): Promise<CapituloLibro[]> {
    return this.capitulosLibrosService.findByTitulo(titulo);
  }

  // Buscar capituloLibro por aproximación del autor  
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<CapituloLibro[]> {
    return this.capitulosLibrosService.findByAutor(autor);
  }
  
  // Buscar un capituloLibro por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<CapituloLibro> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.capitulosLibrosService.findById(id);
  }
  
  // Eliminar un capituloLibro por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CapituloLibro> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.capitulosLibrosService.delete(id);
  }

  // Actualizar un capituloLibro por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() capitulo: Partial<CapituloLibro>): Promise<CapituloLibro> {
    return this.capitulosLibrosService.update(id, capitulo);
  }

  // Crear capitulo-libro en servidor y bd
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() capitulo: CapituloLibro,
    @UploadedFile() file: Express.Multer.File
  ): Promise<CapituloLibro> {
    if (!file || !capitulo) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      capitulo.titulo_capitulo ?? 'Sin título',
      capitulo.autores?.join(' ') ?? 'Autor desconocido',
      capitulo.anio_publicacion?.toString() ?? '0000',
      'CL',
      'C:/tmp'
    );

    const nuevoCapitulo: Partial<CapituloLibro> = {
      numero_identificacion: capitulo.numero_identificacion,
      titulo_libro: capitulo.titulo_libro,
      titulo_capitulo: capitulo.titulo_capitulo,
      anio_publicacion: capitulo.anio_publicacion,
      autores: capitulo.autores,
      editorial: capitulo.editorial,
      editores: capitulo.editores,
      link_pdf: capitulo.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.capitulosLibrosService.create(nuevoCapitulo as CapituloLibro);
  }


  // Crear capitulo-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() capitulo: CapituloLibro): Promise<CapituloLibro> {
    if (!capitulo) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoCapitulo: Partial<CapituloLibro> = {
      numero_identificacion: capitulo.numero_identificacion,
      titulo_libro: capitulo.titulo_libro,
      titulo_capitulo: capitulo.titulo_capitulo,
      anio_publicacion: capitulo.anio_publicacion,
      autores: capitulo.autores,
      editorial: capitulo.editorial,
      editores: capitulo.editores,
      link_pdf: capitulo.link_pdf
    };
    
    return this.capitulosLibrosService.create(nuevoCapitulo as CapituloLibro);
  }
}
