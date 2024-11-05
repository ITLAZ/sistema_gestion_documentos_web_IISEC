import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query, InternalServerErrorException, Headers } from '@nestjs/common';
import { InfoIisecService } from 'src/services/info-iisec/info-iisec.service';
import { InfoIISEC } from 'src/schemas/info-iisec.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { ApiQuery, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { InfoIISECResponseDto } from 'src/dto/elasticsearch-by-collection-dto';
import { LogsService } from 'src/services/logs_service/logs.service';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Info-IISEC')
@Controller('info-iisec')
export class InfoIisecController {
  constructor(
    private readonly infoIisecService: InfoIisecService,
    private readonly searchService: SearchService,
    private readonly logsService: LogsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos Info IISEC' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de elementos por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el que ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del orden: "asc" o "desc"', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Filtrar por año de publicación', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autores', example: 'Maria Lopez' })
  @ApiResponse({ status: 200, description: 'Lista de documentos Info IISEC obtenida correctamente', type: InfoIISEC, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<InfoIISEC[]> {
    try {
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
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al obtener los documentos Info IISEC.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar documentos Info IISEC por un término' })
  @ApiQuery({ name: 'query', required: true, description: 'Término de búsqueda', example: 'Introducción a la Computación' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de resultados por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden ascendente o descendente', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Año de publicación para filtrar', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autor', example: 'Maria Lopez' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda obtenidos correctamente',
    type: InfoIISECResponseDto,
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
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al realizar la búsqueda de documentos Info IISEC.');
    }
  }

  @Get('titulo/:titulo')
  @ApiOperation({ summary: 'Buscar documentos Info IISEC por título' })
  @ApiParam({ name: 'titulo', description: 'Título del documento a buscar', example: 'Introducción a la Computación' })
  @ApiResponse({ status: 200, description: 'Encuentra documentos por título.', type: InfoIISEC, isArray: true })
  @ApiResponse({ status: 400, description: 'Título inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByTitulo(@Param('titulo') titulo: string): Promise<InfoIISEC[]> {
    try {
      return this.infoIisecService.findByTitulo(titulo);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar documentos Info IISEC por título.');
    }
  }

  @Get('autor/:autor')
  @ApiOperation({ summary: 'Buscar documentos Info IISEC por autor' })
  @ApiParam({ name: 'autor', description: 'Autor del documento a buscar', example: 'Maria Lopez' })
  @ApiResponse({ status: 200, description: 'Encuentra documentos por autor.', type: InfoIISEC, isArray: true })
  @ApiResponse({ status: 400, description: 'Nombre de autor inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByAutor(@Param('autor') autor: string): Promise<InfoIISEC[]> {
    try {
      return this.infoIisecService.findByAutor(autor);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar documentos Info IISEC por autor.');
    }
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener un documento Info IISEC por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a buscar', example: '6716be43bd17f2acd13f7119' })
  @ApiResponse({ status: 200, description: 'Encuentra un documento por su ID.', type: InfoIISEC })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findById(@Param('id') id: string): Promise<InfoIISEC> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.infoIisecService.findById(id);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar el documento Info IISEC por ID.');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un documento Info IISEC por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a eliminar', example: '6716be43bd17f2acd13f7119' })
  @ApiResponse({ status: 200, description: 'Elimina un documento por su ID.', type: InfoIISEC })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async delete(@Param('id') id: string): Promise<InfoIISEC> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.infoIisecService.delete(id);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al eliminar el documento Info IISEC.');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un documento Info IISEC por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a actualizar', example: '6716be43bd17f2acd13f7119' })
  @ApiBody({ type: InfoIISEC, description: 'Datos actualizados del documento' })
  @ApiResponse({ status: 200, description: 'Actualiza un documento por su ID.', type: InfoIISEC })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(@Param('id') id: string, @Body() infoIISEC: Partial<InfoIISEC>): Promise<InfoIISEC> {
    try {
      return this.infoIisecService.update(id, infoIISEC);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al actualizar el documento Info IISEC.');
    }
  }

  @Post('upload')
  @ApiOperation({ summary: 'Crear un documento Info IISEC con archivo de PDF' })
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del documento Info IISEC y archivo PDF a subir.',
    schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string', example: 'Introducción a la Computación', description: 'Título del documento' },
        anio_publicacion: { type: 'string', example: '2023', description: 'Año de publicación' },
        autores: {
          type: 'string',
          example: 'Juan Pérez, Maria Lopez',
          description: 'Lista de autores separados por comas',
        },
        observaciones: { type: 'string', example: 'Observaciones sobre el documento', description: 'Comentarios adicionales' },
        link_pdf: { type: 'string', example: 'http://example.com/documento.pdf', description: 'Enlace al archivo PDF' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF a subir',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Crea un documento con archivo de carga.', type: InfoIISEC })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(
    @Body() infoIISECData: any,
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<InfoIISEC> {
    try {
      if (!file) {
        throw new BadRequestException('El archivo PDF es obligatorio');
      }
      if (!infoIISECData || !infoIISECData.titulo || !infoIISECData.anio_publicacion || !infoIISECData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del documento Info IISEC');
      }

      const fecha = new Date();

      const autoresArray = typeof infoIISECData.autores === 'string'
        ? infoIISECData.autores.split(',').map((autor: string) => autor.trim())
        : infoIISECData.autores;

      const procesado = this.fileUploadService.procesarArchivo(
        file,
        infoIISECData.titulo ?? 'Sin título',
        autoresArray.join(' ') ?? 'Autor desconocido',
        infoIISECData.anio_publicacion?.toString() ?? '0000',
        'II',
        'C:/tmp'
      );

      const nuevoInfoIISEC: Partial<InfoIISEC> = {
        titulo: infoIISECData.titulo,
        anio_publicacion: parseInt(infoIISECData.anio_publicacion, 10),
        autores: autoresArray,
        observaciones: infoIISECData.observaciones,
        link_pdf: infoIISECData.link_pdf,
        direccion_archivo: procesado.path,
      };

      const infoCreado = await this.infoIisecService.create(nuevoInfoIISEC as InfoIISEC);
      
      await this.logsService.createLogDocument({
          id_usuario: usuarioId,
          id_documento:  infoCreado.id, // Usamos el ID del usuario retornado
          accion: 'Creacion documento',
          fecha: fecha,
      });
      
      return infoCreado;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al crear el documento Info IISEC.');
    }
  }

  @Post('no-upload')
  @ApiOperation({ summary: 'Crear un documento Info IISEC sin archivo de PDF' })
  @ApiBody({ type: InfoIISEC, description: 'Datos del documento sin archivo' })
  @ApiResponse({ status: 201, description: 'Crea un documento sin archivo de carga.', type: InfoIISEC })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createWithoutFile(
    @Body() infoIISECData: any,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<InfoIISEC> {
    try {
      if (!infoIISECData || !infoIISECData.titulo || !infoIISECData.anio_publicacion || !infoIISECData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del documento Info IISEC');
      }

      const fecha = new Date();

      const autoresArray = typeof infoIISECData.autores === 'string'
        ? infoIISECData.autores.split(',').map((autor: string) => autor.trim())
        : infoIISECData.autores;

      const nuevoInfoIISEC: Partial<InfoIISEC> = {
          titulo: infoIISECData.titulo,
          anio_publicacion: parseInt(infoIISECData.anio_publicacion, 10),
          autores: autoresArray,
          observaciones: infoIISECData.observaciones,
          link_pdf: infoIISECData.link_pdf
      };

      const infoCreado = await this.infoIisecService.create(nuevoInfoIISEC as InfoIISEC);

      await this.logsService.createLogDocument({
          id_usuario: usuarioId,
          id_documento:  infoCreado.id, // Usamos el ID del usuario retornado
          accion: 'Creacion documento',
          fecha: fecha,
      });
      
      return infoCreado;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al crear el documento Info IISEC sin archivo.');
    }
  }
}
