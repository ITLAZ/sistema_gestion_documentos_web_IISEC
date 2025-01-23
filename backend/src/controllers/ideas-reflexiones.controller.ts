import { Controller, Get, Post, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query, InternalServerErrorException, Headers } from '@nestjs/common';
import { IdeasReflexionesService } from 'src/services/ideas-reflexiones/ideas-reflexiones.service';
import { IdeaReflexion } from 'src/schemas/ideas-reflexiones.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { ApiQuery, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { IdeaReflexionResponseDto } from 'src/dto/elasticsearch-by-collection-dto';
import { LogsService } from 'src/services/logs_service/logs.service';
import * as path from 'path';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Ideas-Reflexiones')
@Controller('ideas-reflexiones')
export class IdeasReflexionesController {
  constructor(
    private readonly ideaReflexionesService: IdeasReflexionesService,
    private readonly searchService: SearchService,
    private readonly logsService: LogsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ideas y reflexiones' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de elementos por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el que ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del orden: "asc" o "desc"', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Filtrar por año de publicación', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autores', example: 'Juan Pérez' })
  @ApiResponse({ status: 200, description: 'Lista de ideas y reflexiones obtenida correctamente', type: IdeaReflexion, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<IdeaReflexion[]> {
    try {
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
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al obtener las ideas y reflexiones.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar ideas y reflexiones por un término' })
  @ApiQuery({ name: 'query', required: true, description: 'Término de búsqueda', example: 'Introducción a la Computación' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de resultados por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden ascendente o descendente', example: 'asc' })
  @ApiQuery({ name: 'anio_inicio', required: false, description: 'Año inicial del rango de publicación', example: '2000' })
  @ApiQuery({ name: 'anio_fin', required: false, description: 'Año final del rango de publicación', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autor', example: 'Juan Pérez' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda obtenidos correctamente',
    type: IdeaReflexionResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Parámetros de búsqueda inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async searchIdeasAndReflections(
    @Query('query') query: string = '',
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('anio_inicio') anio_inicio?: string,
    @Query('anio_fin') anio_fin?: string,
    @Query('autores') autores?: string,
  ) {
    try {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(size, 10);
      const sortField = sortBy || 'anio_publicacion';
      const sortDirection: 'asc' | 'desc' = (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'asc';
  
      // Parsear los años de inicio y fin si están definidos
      const yearStart = anio_inicio ? parseInt(anio_inicio, 10) : undefined;
      const yearEnd = anio_fin ? parseInt(anio_fin, 10) : undefined;
  
      const results = await this.searchService.searchByType(
        'ideas-reflexiones',
        query,
        pageNumber,
        pageSize,
        {
          anio_publicacion: {
            start: yearStart,
            end: yearEnd,
          },
          autores
        },
        sortField,
        sortDirection,
      );
      return results;
    } catch (error) {
      console.error('Error al realizar la búsqueda de ideas y reflexiones:', error.message);
      throw new InternalServerErrorException('Error al realizar la búsqueda de ideas y reflexiones.');
    }
  }
  

  @Get('titulo/:titulo')
  @ApiOperation({ summary: 'Buscar ideas y reflexiones por título' })
  @ApiParam({ name: 'titulo', description: 'Título de la idea o reflexión a buscar', example: 'Introducción a la Computación' })
  @ApiResponse({ status: 200, description: 'Encuentra ideas y reflexiones por título.', type: IdeaReflexion, isArray: true })
  @ApiResponse({ status: 400, description: 'Título inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByTitulo(@Param('titulo') titulo: string): Promise<IdeaReflexion[]> {
    try {
      return this.ideaReflexionesService.findByTitulo(titulo);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar ideas y reflexiones por título.');
    }
  }

  @Get('autor/:autor')
  @ApiOperation({ summary: 'Buscar ideas y reflexiones por autor' })
  @ApiParam({ name: 'autor', description: 'Autor de la idea o reflexión a buscar', example: 'Juan Pérez' })
  @ApiResponse({ status: 200, description: 'Encuentra ideas y reflexiones por autor.', type: IdeaReflexion, isArray: true })
  @ApiResponse({ status: 400, description: 'Nombre de autor inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByAutor(@Param('autor') autor: string): Promise<IdeaReflexion[]> {
    try {
      return this.ideaReflexionesService.findByAutor(autor);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar ideas y reflexiones por autor.');
    }
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener una idea o reflexión por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la idea o reflexión a buscar', example: '6716be67bd17f2acd13f804b' })
  @ApiResponse({ status: 200, description: 'Encuentra una idea o reflexión por su ID.', type: IdeaReflexion })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findById(@Param('id') id: string): Promise<IdeaReflexion> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.ideaReflexionesService.findById(id);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar la idea o reflexión por ID.');
    }
  }

  @Put('eliminar-logico/:id')
  @ApiOperation({ summary: 'Realizar un eliminado lógico de una idea o reflexión por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la idea o reflexión a eliminar lógicamente', example: '6716be67bd17f2acd13f804b' })
  @ApiResponse({ status: 200, description: 'Elimina lógicamente una idea o reflexión por su ID.', type: IdeaReflexion })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async deleteLogically(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<IdeaReflexion> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      const ideaEliminada = await this.ideaReflexionesService.delete(id);

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Eliminación lógica de documento',
        fecha: fecha,
      });

      return ideaEliminada;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al realizar la eliminación lógica de la idea o reflexión:', error.message);
      throw new InternalServerErrorException('Error al realizar la eliminación lógica de la idea o reflexión.');
    }
  }

  @Put(':id/recuperar-eliminado')
  @ApiOperation({ summary: 'Restaurar una idea o reflexión eliminada lógicamente' })
  @ApiParam({ name: 'id', description: 'ID de la idea o reflexión a restaurar', example: '6716be70bd17f2acd13f83c6' })
  @ApiResponse({ status: 200, description: 'Idea o Reflexión restaurada exitosamente.', type: IdeaReflexion })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async restore(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<IdeaReflexion> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      // Restaurar la idea o reflexión (cambiar eliminado a false)
      const documentoRestaurado = await this.ideaReflexionesService.restore(id);
      if (!documentoRestaurado) {
        throw new BadRequestException('Idea o Reflexión no encontrada o no se pudo restaurar');
      }

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Restauración documento',
        fecha: fecha,
      });

      return documentoRestaurado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al restaurar la idea o reflexión:', error.message);
      throw new InternalServerErrorException('Error al restaurar la idea o reflexión.');
    }
  }



  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una idea o reflexión por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la idea o reflexión a actualizar', example: '6716be67bd17f2acd13f804b' })
  @ApiBody({ type: IdeaReflexion, description: 'Datos actualizados de la idea o reflexión' })
  @ApiResponse({ status: 200, description: 'Actualiza una idea o reflexión por su ID.', type: IdeaReflexion })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(
    @Param('id') id: string, 
    @Body() ideaReflexion: Partial<IdeaReflexion>,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<IdeaReflexion> {
    try {
      
      const fecha = new Date();
      // Actualizar el libro
      const ideaActualizado = await this.ideaReflexionesService.update(id, ideaReflexion);

      // Registrar el log de la acción
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,  // Usamos el ID del libro que se está actualizando
        accion: 'Actualización de documento',
        fecha: fecha,
      });

      return ideaActualizado;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al actualizar la idea o reflexión.');
    }
  }

  @Post('upload')
  @ApiOperation({ summary: 'Crear una idea o reflexión con archivo de PDF' })
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), path.join(__dirname, '../../../temp/IDEAS_Y_REFLEXIONES')))
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos de la idea o reflexión y archivo PDF a subir.',
    schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string', example: 'Introducción a la Computación', description: 'Título de la idea o reflexión' },
        anio_publicacion: { type: 'string', example: '2023', description: 'Año de publicación' },
        autores: {
          type: 'string',
          example: 'Juan Pérez, Ana López',
          description: 'Lista de autores separados por comas',
        },
        observaciones: { type: 'string', example: 'Observaciones sobre la idea', description: 'Comentarios adicionales' },
        link_pdf: { type: 'string', example: 'http://example.com/documento.pdf', description: 'Enlace al archivo PDF' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF a subir',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Crea una idea o reflexión con archivo de carga.', type: IdeaReflexion })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(
    @Body() ideaReflexionData: any,
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<IdeaReflexion> {
    try {
      if (!file) {
        throw new BadRequestException('El archivo PDF es obligatorio');
      }
      if (!ideaReflexionData || !ideaReflexionData.titulo || !ideaReflexionData.anio_publicacion || !ideaReflexionData.autores) {
        throw new BadRequestException('Faltan datos obligatorios de la idea o reflexión');
      }

      const fecha = new Date();

      const autoresArray = typeof ideaReflexionData.autores === 'string'
        ? ideaReflexionData.autores.split(',').map((autor: string) => autor.trim())
        : ideaReflexionData.autores;

      const procesado = this.fileUploadService.procesarArchivo(
        file,
        ideaReflexionData.titulo ?? 'Sin título',
        autoresArray.join(' ') ?? 'Autor desconocido',
        ideaReflexionData.anio_publicacion?.toString() ?? '0000',
        'IR',
        path.join(__dirname, '../../../temp/IDEAS_Y_REFLEXIONES')
      );

      const nuevoIdeaReflexion: Partial<IdeaReflexion> = {
        titulo: ideaReflexionData.titulo,
        anio_publicacion: parseInt(ideaReflexionData.anio_publicacion, 10),
        autores: autoresArray,
        observaciones: ideaReflexionData.observaciones,
        link_pdf: ideaReflexionData.link_pdf,
        direccion_archivo: procesado.path,
      };

      const ideaReflexionCreada = await this.ideaReflexionesService.create(nuevoIdeaReflexion as IdeaReflexion);

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  ideaReflexionCreada.id,
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return ideaReflexionCreada;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al crear la idea o reflexión.');
    }
  }

  @Post('no-upload')
  @ApiOperation({ summary: 'Crear una idea o reflexión sin archivo de PDF' })
  @ApiBody({ type: IdeaReflexion, description: 'Datos de la idea o reflexión sin archivo' })
  @ApiResponse({ status: 201, description: 'Crea una idea o reflexión sin archivo de carga.', type: IdeaReflexion })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createWithoutFile(
    @Body() ideaReflexionData: any,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<IdeaReflexion> {
    try {
      if (!ideaReflexionData || !ideaReflexionData.titulo || !ideaReflexionData.anio_publicacion || !ideaReflexionData.autores) {
        throw new BadRequestException('Faltan datos obligatorios de la idea o reflexión');
      }

      const fecha = new Date();

      const autoresArray = typeof ideaReflexionData.autores === 'string'
        ? ideaReflexionData.autores.split(',').map((autor: string) => autor.trim())
        : ideaReflexionData.autores;

      const nuevoIdeaReflexion: Partial<IdeaReflexion> = {
        titulo: ideaReflexionData.titulo,
        anio_publicacion: parseInt(ideaReflexionData.anio_publicacion, 10),
        autores: autoresArray,
        observaciones: ideaReflexionData.observaciones,
        link_pdf: ideaReflexionData.link_pdf
      };

      const ideaReflexionCreada = await this.ideaReflexionesService.create(nuevoIdeaReflexion as IdeaReflexion);

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  ideaReflexionCreada.id,
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return ideaReflexionCreada;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al crear la idea o reflexión sin archivo.');
    }
  }

  @Get('eliminados')
  @ApiOperation({ summary: 'Obtener todas las ideas y reflexiones eliminadas' })
  @ApiResponse({ status: 200, description: 'Ideas y reflexiones eliminadas obtenidas correctamente', type: IdeaReflexion, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findDeleted(): Promise<IdeaReflexion[]> {
    try {
      return await this.ideaReflexionesService.findDeleted();
    } catch (error) {
      console.error('Error al obtener las ideas y reflexiones eliminadas:', error.message);
      throw new InternalServerErrorException('Error al obtener las ideas y reflexiones eliminadas.');
    }
  }

}
