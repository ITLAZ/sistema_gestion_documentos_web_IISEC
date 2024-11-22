import { Controller, Get, Post, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query, InternalServerErrorException, Headers} from '@nestjs/common';
import { DocumentosTrabajoService } from 'src/services/documentos-trabajo/documentos-trabajo.service';
import { DocumentoTrabajo } from 'src/schemas/documentos-trabajo.schema';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiBody, ApiConsumes} from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { DocumentoTrabajoResponseDto } from 'src/dto/elasticsearch-by-collection-dto';
import { LogsService } from 'src/services/logs_service/logs.service';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Documentos-Trabajo')
@Controller('documentos-trabajo')
export class DocumentosTrabajoController {
  constructor(
    private readonly documentosTrabajoService: DocumentosTrabajoService,
    private readonly searchService: SearchService,
    private readonly logsService: LogsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos de trabajo' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de elementos por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el que ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del orden: "asc" o "desc"', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Filtrar por año de publicación', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autores', example: 'Carmen Torres' })
  @ApiResponse({ status: 200, description: 'Lista de documentos obtenida correctamente', type: DocumentoTrabajo, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<DocumentoTrabajo[]> {
    try {
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
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al obtener los documentos de trabajo.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar documentos de trabajo por un término' })
  @ApiQuery({ name: 'query', required: true, description: 'Término de búsqueda', example: 'Redes y Comunicaciones' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de resultados por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden ascendente o descendente', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Año de publicación para filtrar', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autor', example: 'Ana García' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda obtenidos correctamente',
    type: DocumentoTrabajoResponseDto,
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
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al realizar la búsqueda de documentos de trabajo.');
    }
  }

  @Get('titulo/:titulo')
  @ApiOperation({ summary: 'Buscar documentos de trabajo por título' })
  @ApiParam({ name: 'titulo', description: 'Título del documento a buscar', example: 'Redes y Comunicaciones' })
  @ApiResponse({ status: 200, description: 'Encuentra documentos por título.', type: DocumentoTrabajo, isArray: true })
  @ApiResponse({ status: 400, description: 'Título inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByTitulo(@Param('titulo') titulo: string): Promise<DocumentoTrabajo[]> {
    try {
      return this.documentosTrabajoService.findByTitulo(titulo);
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al buscar documentos por título.');
    }
  }

  @Get('autor/:autor')
  @ApiOperation({ summary: 'Buscar documentos de trabajo por autor' })
  @ApiParam({ name: 'autor', description: 'Autor del documento a buscar', example: 'Ana García' })
  @ApiResponse({ status: 200, description: 'Encuentra documentos por autor.', type: DocumentoTrabajo, isArray: true })
  @ApiResponse({ status: 400, description: 'Nombre de autor inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByAutor(@Param('autor') autor: string): Promise<DocumentoTrabajo[]> {
    try {
      return this.documentosTrabajoService.findByAutor(autor);
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al buscar documentos por autor.');
    }
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener un documento de trabajo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a buscar', example: '6716be60bd17f2acd13f7b5d' })
  @ApiResponse({ status: 200, description: 'Encuentra un documento por su ID.', type: DocumentoTrabajo })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findById(@Param('id') id: string): Promise<DocumentoTrabajo> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.documentosTrabajoService.findById(id);
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al buscar el documento por ID.');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un documento de trabajo por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a actualizar', example: '6716be60bd17f2acd13f7b5d' })
  @ApiBody({ type: DocumentoTrabajo, description: 'Datos actualizados del documento' })
  @ApiResponse({ status: 200, description: 'Actualiza un documento por su ID.', type: DocumentoTrabajo })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(
    @Param('id') id: string, 
    @Body() documento: Partial<DocumentoTrabajo>,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<DocumentoTrabajo> {
    try {
      const fecha = new Date();
      // Actualizar el libro
      const documentoActualizado = await this.documentosTrabajoService.update(id, documento);

      // Registrar el log de la acción
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,  // Usamos el ID del libro que se está actualizando
        accion: 'Actualización documento',
        fecha: fecha,
      });

      return documentoActualizado;
      return 
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al actualizar el documento.');
    }
  }

  @Put('eliminar-logico/:id')
  @ApiOperation({ summary: 'Realizar un eliminado lógico de un documento por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a eliminar lógicamente', example: '6716be60bd17f2acd13f7b5d' })
  @ApiResponse({ status: 200, description: 'Elimina lógicamente un documento por su ID.', type: DocumentoTrabajo })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async deleteLogically(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<DocumentoTrabajo> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      const documentoEliminado = await this.documentosTrabajoService.delete(id);

      // Registrar el log de la acción
      const fecha = new Date();
      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento: id,
        accion: 'Eliminación lógica de documento',
        fecha: fecha,
      });

      return documentoEliminado;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al realizar la eliminación lógica del documento:', error.message);
      throw new InternalServerErrorException('Error al realizar la eliminación lógica del documento.');
    }
  }

  @Put(':id/recuperar-eliminado')
  @ApiOperation({ summary: 'Restaurar un documento de trabajo eliminado lógicamente' })
  @ApiParam({ name: 'id', description: 'ID del documento a restaurar', example: '6716be70bd17f2acd13f83c6' })
  @ApiResponse({ status: 200, description: 'Documento restaurado exitosamente.', type: DocumentoTrabajo })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async restore(
    @Param('id') id: string,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<DocumentoTrabajo> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }

      if (!usuarioId) {
        throw new BadRequestException('ID del usuario no proporcionado en el header x-usuario-id');
      }

      // Restaurar el documento (cambiar eliminado a false)
      const documentoRestaurado = await this.documentosTrabajoService.restore(id);
      if (!documentoRestaurado) {
        throw new BadRequestException('Documento no encontrado o no se pudo restaurar');
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
      console.error('Error al restaurar el documento de trabajo:', error.message);
      throw new InternalServerErrorException('Error al restaurar el documento de trabajo.');
    }
  }


  @Post('upload')
  @ApiOperation({ summary: 'Crear un documento de trabajo con archivo de PDF' })
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del documento de trabajo y archivo PDF a subir.',
    schema: {
      type: 'object',
      properties: {
        numero_identificacion: { type: 'string', example: 'DOC-3182', description: 'Número de identificación del documento' },
        titulo: { type: 'string', example: 'Redes y Comunicaciones', description: 'Título del documento' },
        anio_publicacion: { type: 'number', example: 2023, description: 'Año de publicación del documento' },
        autores: {
          type: 'string',
          example: 'Carmen Torres, Carlos Martínez',
          description: 'Lista de autores del documento separados por comas',
        },
        abstract: { type: 'string', example: 'Resumen del documento', description: 'Resumen del contenido del documento' },
        link_pdf: { type: 'string', example: 'http://example.com/documento.pdf', description: 'Enlace al archivo PDF' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF del documento a cargar',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Crea un documento con archivo de carga.', type: DocumentoTrabajo })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(
    @Body() documentoData: any,
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<DocumentoTrabajo> {
    try {
      if (!file) {
        throw new BadRequestException('El archivo PDF es obligatorio');
      }
      if (!documentoData || !documentoData.titulo || !documentoData.anio_publicacion || !documentoData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del documento');
      }
      const fecha = new Date();

      const autoresArray = typeof documentoData.autores === 'string'
        ? documentoData.autores.split(',').map((autor: string) => autor.trim())
        : documentoData.autores;

      const procesado = this.fileUploadService.procesarArchivo(
        file,
        documentoData.titulo ?? 'Sin título',
        autoresArray.join(' ') ?? 'Autor desconocido',
        documentoData.anio_publicacion?.toString() ?? '0000',
        'DT',
        'C:/tmp'
      );

      const nuevoDocumento: Partial<DocumentoTrabajo> = {
        numero_identificacion: documentoData.numero_identificacion,
        titulo: documentoData.titulo,
        anio_publicacion: parseInt(documentoData.anio_publicacion, 10),
        autores: autoresArray,
        abstract: documentoData.abstract,
        link_pdf: documentoData.link_pdf,
        direccion_archivo: procesado.path,
      };

      const documentoCreado = await this.documentosTrabajoService.create(nuevoDocumento as DocumentoTrabajo);

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  documentoCreado.id, // Usamos el ID del usuario retornado
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return documentoCreado;
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al crear el documento.');
    }
  }

  @Post('no-upload')
  @ApiOperation({ summary: 'Crear un documento de trabajo sin archivo de PDF' })
  @ApiBody({ type: DocumentoTrabajo, description: 'Datos del documento de trabajo sin archivo' })
  @ApiResponse({ status: 201, description: 'Crea un documento sin archivo de carga.', type: DocumentoTrabajo })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createWithoutFile(
    @Body() documentoData: any,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<DocumentoTrabajo> {
    try {
      if (!documentoData || !documentoData.titulo || !documentoData.anio_publicacion || !documentoData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del documento');
      }

      const fecha = new Date();

      const autoresArray = typeof documentoData.autores === 'string'
        ? documentoData.autores.split(',').map((autor: string) => autor.trim())
        : documentoData.autores;

      const nuevoDocumento: Partial<DocumentoTrabajo> = {
        numero_identificacion: documentoData.numero_identificacion,
        titulo: documentoData.titulo,
        anio_publicacion: parseInt(documentoData.anio_publicacion, 10),
        autores: autoresArray,
        abstract: documentoData.abstract,
        link_pdf: documentoData.link_pdf,
      };
      const documentoCreado = await this.documentosTrabajoService.create(nuevoDocumento as DocumentoTrabajo);

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  documentoCreado.id, // Usamos el ID del usuario retornado
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return documentoCreado;
    } catch (error) {
      console.error('Error al crear el libro:', error.message);
      throw new InternalServerErrorException('Error al crear el documento sin archivo.');
    }
  }

  @Get('eliminados')
  @ApiOperation({ summary: 'Obtener todos los documentos de trabajo eliminados' })
  @ApiResponse({ status: 200, description: 'Documentos eliminados obtenidos correctamente', type: DocumentoTrabajo, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findDeleted(): Promise<DocumentoTrabajo[]> {
    try {
      return await this.documentosTrabajoService.findDeleted();
    } catch (error) {
      console.error('Error al obtener los documentos eliminados:', error.message);
      throw new InternalServerErrorException('Error al obtener los documentos eliminados.');
    }
  }

}
