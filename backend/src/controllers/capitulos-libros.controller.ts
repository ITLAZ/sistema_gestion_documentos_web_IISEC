import { Controller, Get, Post, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query, InternalServerErrorException, Headers } from '@nestjs/common';
import { CapitulosLibrosService } from 'src/services/capitulos-libros/capitulos-libros.service';
import { CapituloLibro } from 'src/schemas/capitulos-libros.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';  
import { ApiQuery, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { CapituloLibroResponseDto } from 'src/dto/elasticsearch-by-collection-dto';
import { LogsService } from 'src/services/logs_service/logs.service';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Capitulos-Libros')
@Controller('capitulos-libros')
export class CapitulosLibrosController {
  constructor(
    private readonly capitulosLibrosService: CapitulosLibrosService,
    private readonly searchService: SearchService,
    private readonly logsService: LogsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los capítulos de libros' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de elementos por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el que ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del orden: "asc" o "desc"', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Filtrar por año de publicación', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autores', example: 'Maria Lopez' })
  @ApiResponse({ status: 200, description: 'Lista de capítulos obtenida correctamente', type: CapituloLibro, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<CapituloLibro[]> {
    try {
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
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al obtener los capítulos de libros.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar capítulos de libros por un término' })
  @ApiQuery({ name: 'query', required: true, description: 'Término de búsqueda', example: 'Historia de la Ciencia' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de resultados por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden ascendente o descendente', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Año de publicación para filtrar', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autor', example: 'Maria Lopez' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda obtenidos correctamente',
    type: CapituloLibroResponseDto,
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
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al realizar la búsqueda de capítulos de libros.');
    }
  }

  @Get('titulo/:titulo')
  @ApiOperation({ summary: 'Buscar capítulos de libros por título' })
  @ApiParam({ name: 'titulo', description: 'Título del capítulo a buscar', example: 'Historia de la Ciencia' })
  @ApiResponse({ status: 200, description: 'Encuentra capítulos por título.', type: CapituloLibro, isArray: true })
  @ApiResponse({ status: 400, description: 'Título inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByTitulo(@Param('titulo') titulo: string): Promise<CapituloLibro[]> {
    try {
      return this.capitulosLibrosService.findByTitulo(titulo);
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al buscar capítulos por título.');
    }
  }

  @Get('autor/:autor')
  @ApiOperation({ summary: 'Buscar capítulos de libros por autor' })
  @ApiParam({ name: 'autor', description: 'Autor del capítulo a buscar', example: 'Maria Lopez' })
  @ApiResponse({ status: 200, description: 'Encuentra capítulos por autor.', type: CapituloLibro, isArray: true })
  @ApiResponse({ status: 400, description: 'Nombre de autor inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByAutor(@Param('autor') autor: string): Promise<CapituloLibro[]> {
    try {
      return this.capitulosLibrosService.findByAutor(autor);
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al buscar capítulos por autor.');
    }
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener un capítulo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del capítulo a buscar', example: '6716be59bd17f2acd13f76d5' })
  @ApiResponse({ status: 200, description: 'Encuentra un capítulo por su ID.', type: CapituloLibro })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findById(@Param('id') id: string): Promise<CapituloLibro> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.capitulosLibrosService.findById(id);
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al buscar el capítulo por ID.');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un capítulo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del capítulo a actualizar', example: '6716be59bd17f2acd13f76d5' })
  @ApiBody({ type: CapituloLibro, description: 'Datos actualizados del capítulo' })
  @ApiResponse({ status: 200, description: 'Actualiza un capítulo por su ID.', type: CapituloLibro })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(
    @Param('id') id: string,
    @Body() capitulo: Partial<CapituloLibro>,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<CapituloLibro> {
    try {

      const fecha = new Date();
      // Actualizar el libro
      const capituloActualizado = await this.capitulosLibrosService.update(id, capitulo);

      // Registrar el log de la acción
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,  // Usamos el ID del libro que se está actualizando
        accion: 'Actualización documento',
        fecha: fecha,
      });

      return capituloActualizado;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al actualizar el capítulo.');
    }
  }

  @Put('eliminar-logico/:id')
  @ApiOperation({ summary: 'Realizar un eliminado lógico de un capítulo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del capítulo a eliminar lógicamente', example: '6716be59bd17f2acd13f76d5' })
  @ApiResponse({ status: 200, description: 'Elimina lógicamente un capítulo por su ID.', type: CapituloLibro })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async deleteLogically(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<CapituloLibro> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      const capituloEliminado = await this.capitulosLibrosService.delete(id);

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Eliminación lógica de documento',
        fecha: fecha,
      });

      return capituloEliminado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al realizar la eliminación lógica del capítulo:', error.message);
      throw new InternalServerErrorException('Error al realizar la eliminación lógica del capítulo.');
    }
  }

  @Put(':id/recuperar-eliminado')
  @ApiOperation({ summary: 'Restaurar un capítulo de libro eliminado lógicamente' })
  @ApiParam({ name: 'id', description: 'ID del capítulo a restaurar', example: '6716be70bd17f2acd13f83c6' })
  @ApiResponse({ status: 200, description: 'Capítulo restaurado exitosamente.', type: CapituloLibro })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async restore(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<CapituloLibro> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      // Restaurar el capítulo (cambiar eliminado a false)
      const capituloRestaurado = await this.capitulosLibrosService.restore(id);
      if (!capituloRestaurado) {
        throw new BadRequestException('Capítulo no encontrado o no se pudo restaurar');
      }

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Restauración documento',
        fecha: fecha,
      });

      return capituloRestaurado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al restaurar el capítulo de libro:', error.message);
      throw new InternalServerErrorException('Error al restaurar el capítulo de libro.');
    }
  }



  @Post('upload')
  @ApiOperation({ summary: 'Crear un capítulo de libro con archivo de PDF' })
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del capítulo de libro y archivo PDF a subir.',
    schema: {
      type: 'object',
      properties: {
        numero_identificacion: { type: 'string', example: 'CH-320', description: 'Número de identificación del capítulo' },
        titulo_libro: { type: 'string', example: 'Machine Learning Básico', description: 'Título del libro' },
        titulo_capitulo: { type: 'string', example: 'Historia de la Ciencia', description: 'Título del capítulo' },
        anio_publicacion: { type: 'number', example: 2023, description: 'Año de publicación del capítulo' },
        autores: {
          type: 'string',
          example: 'Maria Lopez, Juan Pérez',
          description: 'Lista de autores del capítulo separados por comas',
        },
        editorial: { type: 'string', example: 'Editorial Delta', description: 'Editorial del capítulo' },
        editores: {
          type: 'string',
          example: 'Editor Alfa, Editor Beta',
          description: 'Lista de editores del libro separados por comas',
        },
        link_pdf: { type: 'string', example: 'http://library.com/books/file_856.pdf', description: 'Enlace al archivo PDF' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF del capítulo a cargar',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Crea un capítulo con archivo de carga.', type: CapituloLibro })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(
    @Body() capituloData: any,
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<CapituloLibro> {
    try {
      if (!file) {
        throw new BadRequestException('El archivo PDF es obligatorio');
      }
      if (!capituloData || !capituloData.titulo_capitulo || !capituloData.anio_publicacion || !capituloData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del capítulo');
      }

      const fecha = new Date();

      const autoresArray = typeof capituloData.autores === 'string'
        ? capituloData.autores.split(',').map((autor: string) => autor.trim())
        : capituloData.autores;

      const procesado = this.fileUploadService.procesarArchivo(
        file,
        capituloData.titulo_capitulo ?? 'Sin título',
        autoresArray.join(' ') ?? 'Autor desconocido',
        capituloData.anio_publicacion?.toString() ?? '0000',
        'CL',
        'C:/tmp'
      );

      const nuevoCapitulo: Partial<CapituloLibro> = {
        numero_identificacion: capituloData.numero_identificacion,
        titulo_libro: capituloData.titulo_libro,
        titulo_capitulo: capituloData.titulo_capitulo,
        anio_publicacion: parseInt(capituloData.anio_publicacion, 10),
        autores: autoresArray,
        editorial: capituloData.editorial,
        editores: capituloData.editores,
        link_pdf: capituloData.link_pdf,
        direccion_archivo: procesado.path,
      };

      const capituloCreado = await this.capitulosLibrosService.create(nuevoCapitulo as CapituloLibro);

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  capituloCreado.id, // Usamos el ID del usuario retornado
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return capituloCreado;

    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al crear el capítulo.');
    }
  }

  @Post('no-upload')
  @ApiOperation({ summary: 'Crear un capítulo de libro sin archivo de PDF' })
  @ApiBody({ type: CapituloLibro, description: 'Datos del capítulo de libro sin archivo' })
  @ApiResponse({ status: 201, description: 'Crea un capítulo sin archivo de carga.', type: CapituloLibro })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createWithoutFile(
    @Body() capituloData: any,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<CapituloLibro> {
    try {
      if (!capituloData || !capituloData.titulo_capitulo || !capituloData.anio_publicacion || !capituloData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del capítulo');
      }

      const fecha = new Date();

      const autoresArray = typeof capituloData.autores === 'string'
        ? capituloData.autores.split(',').map((autor: string) => autor.trim())
        : capituloData.autores;

      const nuevoCapitulo: Partial<CapituloLibro> = {
        numero_identificacion: capituloData.numero_identificacion,
        titulo_libro: capituloData.titulo_libro,
        titulo_capitulo: capituloData.titulo_capitulo,
        anio_publicacion: parseInt(capituloData.anio_publicacion, 10),
        autores: autoresArray,
        editorial: capituloData.editorial,
        editores: capituloData.editores,
        link_pdf: capituloData.link_pdf
      };

      const capituloCreado = await this.capitulosLibrosService.create(nuevoCapitulo as CapituloLibro);

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  capituloCreado.id, // Usamos el ID del usuario retornado
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return capituloCreado;
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al crear el capítulo sin archivo.');
    }
  }

  @Get('eliminados')
  @ApiOperation({ summary: 'Obtener todos los capítulos de libros eliminados' })
  @ApiResponse({ status: 200, description: 'Capítulos eliminados obtenidos correctamente', type: CapituloLibro, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findDeleted(): Promise<CapituloLibro[]> {
    try {
      return await this.capitulosLibrosService.findDeleted();
    } catch (error) {
      console.error('Error al obtener los capítulos eliminados:', error.message);
      throw new InternalServerErrorException('Error al obtener los capítulos eliminados.');
    }
  }

}