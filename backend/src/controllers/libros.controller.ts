import { Controller, Get, Post, Put, Param, Body, UploadedFile, UseInterceptors, BadRequestException, Query, InternalServerErrorException, Headers } from '@nestjs/common';
import { LibrosService } from 'src/services/libros/libros.service';
import { Libro } from 'src/schemas/libros.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { Types } from 'mongoose';
import { SearchService } from 'src/services/search/search.service';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { LibrosResponseDto } from 'src/dto/elasticsearch-by-collection-dto';
import { LogsService } from 'src/services/logs_service/logs.service';
import * as path from 'path';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Libros')
@Controller('libros')
export class LibrosController {
  constructor(
    private readonly librosService: LibrosService,
    private readonly logsService: LogsService,
    private readonly searchService: SearchService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get('update-libros')
  @ApiOperation({ summary: ' Actualizar la indexación de todos los libros en Elasticsearch' })
  @ApiResponse({ status: 200, description: ' Actualiza todos los libros en Elasticsearch.' })
  @ApiResponse({ status: 500, description: ' Error interno del servidor' })
  async updateLibros(): Promise<void> {
    try {
      this.librosService.updateAllLibros();
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al actualizar los libros en Elasticsearch.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: ' Buscar libros por un término' })
  @ApiQuery({ name: 'query', required: true, description: ' Término de búsqueda', example: 'Análisis de Datos' })
  @ApiQuery({ name: 'page', required: false, description: ' Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: ' Cantidad de resultados por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: ' Campo por el cual ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: ' Orden ascendente o descendente', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: ' Año de publicación para filtrar', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: ' Filtrar por autor', example: 'Maria Lopez' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda obtenidos correctamente',
    type: LibrosResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: ' Parámetros de búsqueda inválidos' })
  @ApiResponse({ status: 500, description: ' Error interno del servidor' })
  async searchBooks(
    @Query('query') query: string = '',
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
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al realizar la búsqueda de libros.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los libros' })
  @ApiQuery({ name: 'page', required: false, description: ' Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: ' Cantidad de elementos por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: ' Campo por el que ordenar', example: 'titulo' })
  @ApiQuery({ name: 'sortOrder', required: false, description: ' Dirección del orden: "asc" o "desc"', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: ' Filtrar por año de publicación', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: ' Filtrar por autores', example: 'Carlos Martínez' })
  @ApiResponse({ status: 200, description: ' Obtiene todos los libros.', type: Libro, isArray: true })
  @ApiResponse({ status: 500, description: ' Error interno del servidor' })
  async findAll(
    @Query('page') page: string,
    @Query('size') size: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<Libro[]> {
    try {
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(size, 10) || 10;
      const sortField = sortBy || 'titulo';
      const sortDirection = sortOrder || 'asc';
      const anio = anio_publicacion ? parseInt(anio_publicacion, 10) : undefined;

      return this.librosService.findAll(
        pageNumber, 
        pageSize, 
        sortField, 
        sortDirection,
        autores,
        anio,
      );
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al obtener los libros.');
    }
  }

  @Get('titulo/:titulo')
  @ApiOperation({ summary: 'Buscar libros por título' })
  @ApiParam({ name: 'titulo', description: 'Título del libro a buscar', example: 'Análisis de Datos' })
  @ApiResponse({ status: 200, description: 'Encuentra libros por título.', type: Libro, isArray: true })
  @ApiResponse({ status: 400, description: 'Título inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByTitulo(@Param('titulo') titulo: string): Promise<Libro[]> {
    try {
      return this.librosService.findByTitulo(titulo);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar libros por título.');
    }
  }

  @Get('autor/:autor')
  @ApiOperation({ summary: 'Buscar libros por autor' })
  @ApiParam({ name: 'autor', description: 'Autor del libro a buscar', example: 'Maria Lopez' })
  @ApiResponse({ status: 200, description: 'Encuentra libros por autor.', type: Libro, isArray: true })
  @ApiResponse({ status: 400, description: 'Nombre de autor inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByAutor(@Param('autor') autor: string): Promise<Libro[]> {
    try {
      return this.librosService.findByAutor(autor);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar libros por autor.');
    }
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener un libro por su ID' })
  @ApiParam({ name: 'id', description: 'ID del libro a buscar', example: '6715d835ce1db7b621aa7790' })
  @ApiResponse({ status: 200, description: 'Encuentra un libro por su ID.', type: Libro })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findById(@Param('id') id: string): Promise<Libro> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.librosService.findById(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el libro por ID.');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un libro por su ID' })
  @ApiParam({ name: 'id', description: 'ID del libro a actualizar', example: '6715d835ce1db7b621aa7790' })
  @ApiBody({ type: Libro, description: 'Datos actualizados del libro' })
  @ApiResponse({ status: 200, description: 'Actualiza un libro por su ID.', type: Libro })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(
    @Param('id') id: string, 
    @Body() libro: Partial<Libro>,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<Libro> {
    try {
      const fecha = new Date();
      // Actualizar el libro
      const libroActualizado = await this.librosService.update(id, libro);

      // Registrar el log de la acción
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,  // Usamos el ID del libro que se está actualizando
        accion: 'Actualización de documento',
        fecha: fecha,
      });

      return libroActualizado;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al actualizar el libro.');
    }
  }

  @Put('eliminar-logico/:id')
  @ApiOperation({ summary: 'Realizar un eliminado lógico de un libro por su ID' })
  @ApiParam({ name: 'id', description: 'ID del libro a eliminar lógicamente', example: '6715d835ce1db7b621aa7790' })
  @ApiResponse({ status: 200, description: 'Elimina lógicamente un libro por su ID.', type: Libro })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async deleteLogically(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<Libro> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      const libroEliminado = await this.librosService.delete(id);

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Eliminación lógica de documento',
        fecha: fecha,
      });

      return libroEliminado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al realizar la eliminación lógica del libro:', error.message);
      throw new InternalServerErrorException('Error al realizar la eliminación lógica del libro.');
    }
  }

  @Put(':id/recuperar-eliminado')
  @ApiOperation({ summary: 'Restaurar un libro eliminado lógicamente' })
  @ApiParam({ name: 'id', description: 'ID del libro a restaurar', example: '6716be70bd17f2acd13f83c6' })
  @ApiResponse({ status: 200, description: 'Libro restaurado exitosamente.', type: Libro })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async restore(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<Libro> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      // Restaurar el libro (cambiar eliminado a false)
      const libroRestaurado = await this.librosService.restore(id);
      if (!libroRestaurado) {
        throw new BadRequestException('Libro no encontrado o no se pudo restaurar');
      }

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Restauración documento',
        fecha: fecha,
      });

      return libroRestaurado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al restaurar el libro:', error.message);
      throw new InternalServerErrorException('Error al restaurar el libro.');
    }
  }


  @Post('upload')
  @ApiOperation({ summary: 'Crear un libro con archivo de PDF' })
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), path.join(__dirname, '../../../temp/LIBROS')))
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del libro y archivo PDF a subir.',
    schema: {
      type: 'object',
      properties: {
        portada: { type: 'string', example: 'portada.jpg', description: 'URL de la portada del libro' },
        anio_publicacion: { type: 'string', example: '2023', description: 'Año de publicación del libro' },
        titulo: { type: 'string', example: 'Título de prueba', description: 'Título del libro' },
        autores: {
          type: 'string',
          example: 'Autor 1, Autor 2',
          description: 'Lista de autores del libro separados por comas',
        },
        editorial: { type: 'string', example: 'Editorial de prueba', description: 'Editorial del libro' },
        abstract: { type: 'string', example: 'Abstract de prueba', description: 'Resumen del libro' },
        link_pdf: { type: 'string', example: 'http://example.com/libro.pdf', description: 'Enlace al archivo PDF' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF del libro a cargar',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Crea un libro con archivo de carga.', type: Libro })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(
    @Body() libroData: any,
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<Libro> {
    try {
      // Validar que el archivo y los datos del libro estén presentes
      if (!file) {
        throw new BadRequestException('El archivo PDF es obligatorio');
      }
      if (!libroData || !libroData.titulo || !libroData.anio_publicacion || !libroData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del libro');
      }
      const fecha = new Date();
      // Convertir autores a un arreglo si es necesario
      const autoresArray = typeof libroData.autores === 'string'
        ? libroData.autores.split(',').map((autor: string) => autor.trim())
        : libroData.autores;

      // Procesar el archivo subido
      const procesado = this.fileUploadService.procesarArchivo(
        file,
        libroData.titulo ?? 'Sin título',
        autoresArray.join(' ') ?? 'Autor desconocido',
        libroData.anio_publicacion?.toString() ?? '0000',
        'Lib',
        path.join(__dirname, '../../../temp/LIBROS')
      );

      // Crear un nuevo objeto de libro con los datos procesados
      const nuevoLibro: Partial<Libro> = {
        portada: libroData.portada,
        anio_publicacion: parseInt(libroData.anio_publicacion, 10),
        titulo: libroData.titulo,
        autores: autoresArray,
        editorial: libroData.editorial,
        abstract: libroData.abstract,
        link_pdf: libroData.link_pdf,
        direccion_archivo: procesado.path,
      };
      
      const libroCreado = await this.librosService.create(nuevoLibro as Libro);

      // Registrar el log de la acción

      await this.logsService.createLogDocument({
          id_usuario: usuarioId,
          id_documento:  libroCreado.id, // Usamos el ID del usuario retornado
          accion: 'Creacion documento',
          fecha: fecha,
      });
      
      // Guardar el libro en la base de datos
      return libroCreado;
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al crear el libro.');
    }
  }



  @Post('no-upload')
  @ApiOperation({ summary: 'Crear un libro sin archivo de PDF' })
  @ApiBody({ type: Libro, description: 'Datos del libro sin archivo' })
  @ApiResponse({ status: 201, description: 'Crea un libro sin archivo de carga.', type: Libro })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createWithoutFile(
    @Body() libroData: any,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<Libro> {
    try {
      if (!libroData || !libroData.titulo || !libroData.anio_publicacion || !libroData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del libro');
      }

      const fecha = new Date();
            // Convertir autores a un arreglo si es necesario
      // Convertir autores a un arreglo si es necesario
      const autoresArray = typeof libroData.autores === 'string'
        ? libroData.autores.split(',').map((autor: string) => autor.trim())
        : libroData.autores;
        
      const nuevoLibro: Partial<Libro> = {
        portada: libroData.portada,
        anio_publicacion: parseInt(libroData.anio_publicacion, 10),
        titulo: libroData.titulo,
        autores: autoresArray,
        editorial: libroData.editorial,
        abstract: libroData.abstract,
        link_pdf: libroData.link_pdf,
      };
      const libroCreado = await this.librosService.create(nuevoLibro as Libro);

      await this.logsService.createLogDocument({
          id_usuario: usuarioId,
          id_documento:  libroCreado.id, // Usamos el ID del usuario retornado
          accion: 'Creacion documento',
          fecha: fecha,
      });
      
      return libroCreado;
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al crear el libro sin archivo.');
    }
  }

  @Get('eliminados')
  @ApiOperation({ summary: 'Obtener todos los libros eliminados' })
  @ApiResponse({ status: 200, description: 'Libros eliminados obtenidos correctamente', type: Libro, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findDeletedBooks(): Promise<Libro[]> {
    try {
      return await this.librosService.findDeleted();
    } catch (error) {
      console.error('Error al obtener los libros eliminados:', error.message);
      throw new InternalServerErrorException('Error al obtener los libros eliminados.');
    }
  }
}