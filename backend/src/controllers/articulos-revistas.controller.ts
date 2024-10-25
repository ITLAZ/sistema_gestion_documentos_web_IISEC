import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { ArticulosRevistasService } from 'src/services/articulos-revistas/articulos-revistas.service';
import { ArticuloRevista } from 'src/schemas/articulos-revistas.schema';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { ArticuloRevistaResponseDto } from 'src/dto/elasticsearch-by-collection-dto';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Articulos-Revistas') 
@Controller('articulos-revistas')
export class ArticulosRevistasController {
  constructor(
    private readonly articulosRevistasService: ArticulosRevistasService,
    private readonly searchService: SearchService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // Obtener todos los artículos
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_revista',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_revista') anio_revista?: string,
    @Query('autores') autores?: string,
  ): Promise<ArticuloRevista[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(size, 10) || 10;
    const anio = anio_revista ? parseInt(anio_revista, 10) : undefined;

    return this.articulosRevistasService.findAll(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      autores,
      anio,
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
    type: ArticuloRevistaResponseDto, // El tipo correcto que retornas
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
      'articulos-revistas', 
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
  

  // Buscar articulos por aproximación del título
  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<ArticuloRevista[]> {
    return this.articulosRevistasService.findByTitulo(titulo);
  }

  // Buscar articulos por aproximación del autor
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<ArticuloRevista[]> {
    return this.articulosRevistasService.findByAutor(autor);
  }

  // Buscar un articulos por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<ArticuloRevista> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.articulosRevistasService.findById(id);
  }

  // Eliminar un artículo por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ArticuloRevista> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.articulosRevistasService.delete(id);
  }

  // Actualizar un capituloLibro por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() articulo: Partial<ArticuloRevista>): Promise<ArticuloRevista> {
    return this.articulosRevistasService.update(id, articulo);
  }

  // Crear articulo-libro en servidor y bd
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
    )
    async create(
      @Body() articulo: ArticuloRevista,
      @UploadedFile() file: Express.Multer.File
    ): Promise<ArticuloRevista> {
      if (!file || !articulo) {
        throw new BadRequestException('Faltan datos necesarios');
      }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      articulo.titulo ?? 'Sin título',
      articulo.autores?.join(' ') ?? 'Autor desconocido',
      articulo.anio_revista?.toString() ?? '0000',
      'AR',
      'C:/tmp'
    );

    const nuevoArticulo: Partial<ArticuloRevista> = {
      numero_articulo: articulo.numero_articulo,
      titulo: articulo.titulo,
      anio_revista: articulo.anio_revista,
      autores: articulo.autores,
      nombre_revista: articulo.nombre_revista,
      editorial: articulo.editorial,
      abstract: articulo.abstract,
      link_pdf: articulo.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.articulosRevistasService.create(nuevoArticulo as ArticuloRevista);
  }


  // Crear articulo-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() articulo: ArticuloRevista): Promise<ArticuloRevista> {
    if (!articulo) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoArticulo: Partial<ArticuloRevista> = {
      numero_articulo: articulo.numero_articulo,
      titulo: articulo.titulo,
      anio_revista: articulo.anio_revista,
      autores: articulo.autores,
      nombre_revista: articulo.nombre_revista,
      editorial: articulo.editorial,
      abstract: articulo.abstract,
      link_pdf: articulo.link_pdf
    };
    
    return this.articulosRevistasService.create(nuevoArticulo as ArticuloRevista);
  }
}
