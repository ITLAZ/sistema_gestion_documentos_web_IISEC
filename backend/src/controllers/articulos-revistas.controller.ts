import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query, InternalServerErrorException ,Headers} from '@nestjs/common';
import { ArticulosRevistasService } from 'src/services/articulos-revistas/articulos-revistas.service';
import { ArticuloRevista } from 'src/schemas/articulos-revistas.schema';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiConsumes, ApiBody, ApiHeader} from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { ArticuloRevistaResponseDto } from 'src/dto/elasticsearch-by-collection-dto';
import { LogsService } from 'src/services/logs_service/logs.service';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Articulos-Revistas')
@Controller('articulos-revistas')
export class ArticulosRevistasController {
  constructor(
    private readonly articulosRevistasService: ArticulosRevistasService,
    private readonly searchService: SearchService,
    private readonly logsService: LogsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los artículos de revistas' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de resultados por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'anio_revista' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden ascendente o descendente', example: 'asc' })
  @ApiQuery({ name: 'anio_revista', required: false, description: 'Año de la revista para filtrar', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autor', example: 'Luis Rodríguez' })
  @ApiResponse({ status: 200, description: 'Lista de artículos obtenida correctamente', type: ArticuloRevista, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_revista',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_revista') anio_revista?: string,
    @Query('autores') autores?: string,
  ): Promise<ArticuloRevista[]> {
    try {
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
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al obtener los artículos de revistas.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar artículos de revistas por un término' })
  @ApiQuery({ name: 'query', required: true, description: 'Término de búsqueda', example: 'Machine Learning Básico' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de resultados por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden ascendente o descendente', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Año de publicación para filtrar', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autor', example: 'Luis Rodríguez' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda obtenidos correctamente',
    type: ArticuloRevistaResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Parámetros de búsqueda inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async searchBooks(
    @Query('query') query: string,
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ) {
    try {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(size, 10);
      const sortField = sortBy || 'anio_publicacion';
      const sortDirection: 'asc' | 'desc' = (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'asc';

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
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al realizar la búsqueda de artículos de revistas.');
    }
  }

  @Get('titulo/:titulo')
  @ApiOperation({ summary: 'Buscar artículos de revistas por título' })
  @ApiParam({ name: 'titulo', description: 'Título del artículo a buscar', example: 'Machine Learning Básico' })
  @ApiResponse({ status: 200, description: 'Encuentra artículos por título.', type: ArticuloRevista, isArray: true })
  @ApiResponse({ status: 400, description: 'Título inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByTitulo(@Param('titulo') titulo: string): Promise<ArticuloRevista[]> {
    try {
      return this.articulosRevistasService.findByTitulo(titulo);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar artículos por título.');
    }
  }

  @Get('autor/:autor')
  @ApiOperation({ summary: 'Buscar artículos de revistas por autor' })
  @ApiParam({ name: 'autor', description: 'Autor del artículo a buscar', example: 'Luis Rodríguez' })
  @ApiResponse({ status: 200, description: 'Encuentra artículos por autor.', type: ArticuloRevista, isArray: true })
  @ApiResponse({ status: 400, description: 'Nombre de autor inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByAutor(@Param('autor') autor: string): Promise<ArticuloRevista[]> {
    try {
      return this.articulosRevistasService.findByAutor(autor);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar artículos por autor.');
    }
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener un artículo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del artículo a buscar', example: '6716be4bbd17f2acd13f7308' })
  @ApiResponse({ status: 200, description: 'Encuentra un artículo por su ID.', type: ArticuloRevista })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findById(@Param('id') id: string): Promise<ArticuloRevista> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.articulosRevistasService.findById(id);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar el artículo por ID.');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un artículo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del artículo a actualizar', example: '6716be4bbd17f2acd13f7308' })
  @ApiBody({ type: ArticuloRevista, description: 'Datos actualizados del artículo' })
  @ApiResponse({ status: 200, description: 'Actualiza un artículo por su ID.', type: ArticuloRevista })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(
    @Param('id') id: string, 
    @Body() articulo: Partial<ArticuloRevista>,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<ArticuloRevista> {
    try {
      const fecha = new Date();
      // Actualizar el libro
      const articuloActualizado = await this.articulosRevistasService.update(id, articulo);

      // Registrar el log de la acción
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,  // Usamos el ID del libro que se está actualizando
        accion: 'Actualización documento',
        fecha: fecha,
      });

      return articuloActualizado;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al actualizar el artículo.');
    }
  }

  @Put('eliminar-logico/:id')
  @ApiOperation({ summary: 'Realizar un eliminado lógico de un artículo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del artículo a eliminar lógicamente', example: '6716be4bbd17f2acd13f7308' })
  @ApiResponse({ status: 200, description: 'Elimina lógicamente un artículo por su ID.', type: ArticuloRevista })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async deleteLogically(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<ArticuloRevista> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      const articuloEliminado = await this.articulosRevistasService.delete(id);

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Eliminación lógica de documento',
        fecha: fecha,
      });

      return articuloEliminado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al realizar la eliminación lógica del artículo:', error.message);
      throw new InternalServerErrorException('Error al realizar la eliminación lógica del artículo.');
    }
  }

  @Put(':id/recuperar-eliminado')
  @ApiOperation({ summary: 'Restaurar un artículo de revista eliminado lógicamente' })
  @ApiParam({ name: 'id', description: 'ID del artículo a restaurar', example: '6716be70bd17f2acd13f83c6' })
  @ApiResponse({ status: 200, description: 'Artículo restaurado exitosamente.', type: ArticuloRevista })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async restore(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<ArticuloRevista> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      // Restaurar el artículo (cambiar eliminado a false)
      const articuloRestaurado = await this.articulosRevistasService.restore(id);
      if (!articuloRestaurado) {
        throw new BadRequestException('Artículo no encontrado o no se pudo restaurar');
      }

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Restauración documento',
        fecha: fecha,
      });

      return articuloRestaurado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al restaurar el artículo de revista:', error.message);
      throw new InternalServerErrorException('Error al restaurar el artículo de revista.');
    }
  }

  


  @Post('upload')
  @ApiOperation({ summary: 'Crear un artículo con archivo de PDF' })
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del artículo y archivo PDF a subir.',
    schema: {
      type: 'object',
      properties: {
        numero_articulo: { type: 'string', example: 'ART-4195', description: 'Número del artículo' },
        titulo: { type: 'string', example: 'Machine Learning Básico', description: 'Título del artículo' },
        anio_revista: { type: 'number', example: 2023, description: 'Año de la revista' },
        autores: {
          type: 'string',
          example: 'Luis Rodríguez, Juan Pérez',
          description: 'Lista de autores del artículo separados por comas',
        },
        nombre_revista: { type: 'string', example: 'Revista de Ingeniería', description: 'Nombre de la revista' },
        editorial: { type: 'string', example: 'Editorial Delta', description: 'Editorial de la revista' },
        abstract: { type: 'string', example: 'Este es un breve resumen...', description: 'Resumen del artículo' },
        link_pdf: { type: 'string', example: 'http://example.com/files/file_777.pdf', description: 'Enlace al archivo PDF' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF del artículo a cargar',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Crea un artículo con archivo de carga.', type: ArticuloRevista })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(
    @Body() articuloData: any,
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<ArticuloRevista> {
    try {
      if (!file) {
        throw new BadRequestException('El archivo PDF es obligatorio');
      }
      if (!articuloData || !articuloData.titulo || !articuloData.anio_revista || !articuloData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del artículo');
      }
      const fecha = new Date();
      const autoresArray = typeof articuloData.autores === 'string'
        ? articuloData.autores.split(',').map((autor: string) => autor.trim())
        : articuloData.autores;

      const procesado = this.fileUploadService.procesarArchivo(
        file,
        articuloData.titulo ?? 'Sin título',
        autoresArray.join(' ') ?? 'Autor desconocido',
        articuloData.anio_revista?.toString() ?? '0000',
        'AR',
        'C:/tmp'
      );

      const nuevoArticulo: Partial<ArticuloRevista> = {
        numero_articulo: articuloData.numero_articulo,
        titulo: articuloData.titulo,
        anio_revista: parseInt(articuloData.anio_revista, 10),
        autores: autoresArray,
        nombre_revista: articuloData.nombre_revista,
        editorial: articuloData.editorial,
        abstract: articuloData.abstract,
        link_pdf: articuloData.link_pdf,
        direccion_archivo: procesado.path,
      };

      const articuloCreado = await this.articulosRevistasService.create(nuevoArticulo as ArticuloRevista)

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  articuloCreado.id, // Usamos el ID del usuario retornado
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return articuloCreado;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al crear el artículo.');
    }
  }

  @Post('no-upload')
  @ApiOperation({ summary: 'Crear un artículo sin archivo de PDF' })
  @ApiBody({ type: ArticuloRevista, description: 'Datos del artículo sin archivo' })
  @ApiResponse({ status: 201, description: 'Crea un artículo sin archivo de carga.', type: ArticuloRevista })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createWithoutFile(
    @Body() articuloData: any,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<ArticuloRevista> {
    try {
      if (!articuloData || !articuloData.titulo || !articuloData.anio_revista || !articuloData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del artículo');
      }
      const fecha = new Date();

      const autoresArray = typeof articuloData.autores === 'string'
      ? articuloData.autores.split(',').map((autor: string) => autor.trim())
      : articuloData.autores;

      const nuevoArticulo: Partial<ArticuloRevista> = {
        numero_articulo: articuloData.numero_articulo,
        titulo: articuloData.titulo,
        anio_revista: parseInt(articuloData.anio_revista, 10),
        autores: autoresArray,
        nombre_revista: articuloData.nombre_revista,
        editorial: articuloData.editorial,
        abstract: articuloData.abstract,
        link_pdf: articuloData.link_pdf,
      };

      const articuloCreado = await this.articulosRevistasService.create(nuevoArticulo as ArticuloRevista)

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  articuloCreado.id, // Usamos el ID del usuario retornado
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return articuloCreado;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al crear el artículo sin archivo.');
    }
  }

  @Get('eliminados')
  @ApiOperation({ summary: 'Obtener todos los artículos de revistas eliminados' })
  @ApiResponse({ status: 200, description: 'Artículos eliminados obtenidos correctamente', type: ArticuloRevista, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findDeleted(): Promise<ArticuloRevista[]> {
    try {
      return await this.articulosRevistasService.findDeleted();
    } catch (error) {
      console.error('Error al obtener los artículos eliminados:', error.message);
      throw new InternalServerErrorException('Error al obtener los artículos eliminados.');
    }
  }

}
