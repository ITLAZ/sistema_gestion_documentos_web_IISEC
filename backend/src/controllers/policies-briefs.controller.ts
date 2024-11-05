import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query, InternalServerErrorException, Headers } from '@nestjs/common';
import { PoliciesBriefsService } from 'src/services/policies-briefs/policies-briefs.service';
import { PolicyBrief } from 'src/schemas/policies-briefs.schema';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { PolicyBriefResponseDto } from 'src/dto/elasticsearch-by-collection-dto';
import { LogsService } from 'src/services/logs_service/logs.service';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Policies-Briefs')
@Controller('policies-briefs')
export class PoliciesBriefsController {
  constructor(
    private readonly policiesBriefsService: PoliciesBriefsService,
    private readonly searchService: SearchService,
    private readonly logsService: LogsService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos Policy Briefs' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de elementos por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el que ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del orden: "asc" o "desc"', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Filtrar por año de publicación', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autores', example: 'Ana García' })
  @ApiResponse({ status: 200, description: 'Lista de documentos Policy Briefs obtenida correctamente', type: PolicyBrief, isArray: true })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<PolicyBrief[]> {
    try {
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(size, 10) || 10;
      const anio = anio_publicacion ? parseInt(anio_publicacion, 10) : undefined;

      return this.policiesBriefsService.findAll(
        pageNumber,
        pageSize,
        sortBy,
        sortOrder,
        autores,
        anio
      );
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al obtener los documentos Policy Briefs.');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar documentos Policy Briefs por un término' })
  @ApiQuery({ name: 'query', required: true, description: 'Término de búsqueda', example: 'Redes y Comunicaciones' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'size', required: false, description: 'Cantidad de resultados por página', example: '10' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'anio_publicacion' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden ascendente o descendente', example: 'asc' })
  @ApiQuery({ name: 'anio_publicacion', required: false, description: 'Año de publicación para filtrar', example: '2023' })
  @ApiQuery({ name: 'autores', required: false, description: 'Filtrar por autor', example: 'Juan Pérez' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda obtenidos correctamente',
    type: PolicyBriefResponseDto,
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
  ): Promise<any[]> {
    try {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(size, 10);
      const sortField = sortBy || 'anio_publicacion';
      const sortDirection: 'asc' | 'desc' = (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'asc';

      const results = await this.searchService.searchByType(
        'policies-briefs',
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
      throw new InternalServerErrorException('Error al realizar la búsqueda de documentos Policy Briefs.');
    }
  }

  @Get('titulo/:titulo')
  @ApiOperation({ summary: 'Buscar documentos Policy Briefs por título' })
  @ApiParam({ name: 'titulo', description: 'Título del documento a buscar', example: 'Redes y Comunicaciones' })
  @ApiResponse({ status: 200, description: 'Encuentra documentos por título.', type: PolicyBrief, isArray: true })
  @ApiResponse({ status: 400, description: 'Título inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByTitulo(@Param('titulo') titulo: string): Promise<PolicyBrief[]> {
    try {
      return this.policiesBriefsService.findByTitulo(titulo);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar documentos Policy Briefs por título.');
    }
  }

  @Get('autor/:autor')
  @ApiOperation({ summary: 'Buscar documentos Policy Briefs por autor' })
  @ApiParam({ name: 'autor', description: 'Autor del documento a buscar', example: 'Ana García' })
  @ApiResponse({ status: 200, description: 'Encuentra documentos por autor.', type: PolicyBrief, isArray: true })
  @ApiResponse({ status: 400, description: 'Nombre de autor inválido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByAutor(@Param('autor') autor: string): Promise<PolicyBrief[]> {
    try {
      return this.policiesBriefsService.findByAutor(autor);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar documentos Policy Briefs por autor.');
    }
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener un documento Policy Brief por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a buscar', example: '6716be70bd17f2acd13f83c6' })
  @ApiResponse({ status: 200, description: 'Encuentra un documento por su ID.', type: PolicyBrief })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findById(@Param('id') id: string): Promise<PolicyBrief> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.policiesBriefsService.findById(id);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al buscar el documento Policy Brief por ID.');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un documento Policy Brief por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a eliminar', example: '6716be70bd17f2acd13f83c6' })
  @ApiResponse({ status: 200, description: 'Elimina un documento por su ID.', type: PolicyBrief })
  @ApiResponse({ status: 400, description: 'ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async delete(@Param('id') id: string): Promise<PolicyBrief> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID no válido');
      }
      return this.policiesBriefsService.delete(id);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al eliminar el documento Policy Brief.');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un documento Policy Brief por su ID' })
  @ApiParam({ name: 'id', description: 'ID del documento a actualizar', example: '6716be70bd17f2acd13f83c6' })
  @ApiBody({ type: PolicyBrief, description: 'Datos actualizados del documento' })
  @ApiResponse({ status: 200, description: 'Actualiza un documento por su ID.', type: PolicyBrief })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ID no válido' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async update(@Param('id') id: string, @Body() policyBrief: Partial<PolicyBrief>): Promise<PolicyBrief> {
    try {
      return this.policiesBriefsService.update(id, policyBrief);
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al actualizar el documento Policy Brief.');
    }
  }

  @Post('upload')
  @ApiOperation({ summary: 'Crear un documento Policy Brief con archivo de PDF' })
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del documento Policy Brief y archivo PDF a subir.',
    schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string', example: 'Redes y Comunicaciones', description: 'Título del documento' },
        anio_publicacion: { type: 'string', example: '2023', description: 'Año de publicación' },
        autores: {
          type: 'string',
          example: 'Ana García, Juan Pérez',
          description: 'Lista de autores separados por comas',
        },
        mensaje_clave: { type: 'string', example: 'Mensaje clave sobre el contenido del documento', description: 'Resumen importante' },
        link_pdf: { type: 'string', example: 'http://example.com/documento.pdf', description: 'Enlace al archivo PDF' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo PDF a subir',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Crea un documento con archivo de carga.', type: PolicyBrief })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async create(
    @Body() policyBriefData: any,
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<PolicyBrief> {
    try {
      if (!file) {
        throw new BadRequestException('El archivo PDF es obligatorio');
      }
      if (!policyBriefData || !policyBriefData.titulo || !policyBriefData.anio_publicacion || !policyBriefData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del documento Policy Brief');
      }

      const fecha = new Date();

      const autoresArray = typeof policyBriefData.autores === 'string'
        ? policyBriefData.autores.split(',').map((autor: string) => autor.trim())
        : policyBriefData.autores;

      const procesado = this.fileUploadService.procesarArchivo(
        file,
        policyBriefData.titulo ?? 'Sin título',
        autoresArray.join(' ') ?? 'Autor desconocido',
        policyBriefData.anio_publicacion?.toString() ?? '0000',
        'PB',
        'C:/tmp'
      );

      const nuevoPolicyBrief: Partial<PolicyBrief> = {
        titulo: policyBriefData.titulo,
        anio_publicacion: parseInt(policyBriefData.anio_publicacion, 10),
        autores: autoresArray,
        mensaje_clave: policyBriefData.mensaje_clave,
        link_pdf: policyBriefData.link_pdf,
        direccion_archivo: procesado.path,
      };
      
      const creadoPolicyBrief = await this.policiesBriefsService.create(nuevoPolicyBrief as PolicyBrief);

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  creadoPolicyBrief.id, // Usamos el ID del usuario retornado
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return creadoPolicyBrief;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al crear el documento Policy Brief.');
    }
  }

  @Post('no-upload')
  @ApiOperation({ summary: 'Crear un documento Policy Brief sin archivo de PDF' })
  @ApiBody({ type: PolicyBrief, description: 'Datos del documento sin archivo' })
  @ApiResponse({ status: 201, description: 'Crea un documento sin archivo de carga.', type: PolicyBrief })
  @ApiResponse({ status: 400, description: 'Faltan datos necesarios' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createWithoutFile(
    @Body() policyBriefData: any,
    @Headers('x-usuario-id') usuarioId: string
  ): Promise<PolicyBrief> {
    try {
      if (!policyBriefData || !policyBriefData.titulo || !policyBriefData.anio_publicacion || !policyBriefData.autores) {
        throw new BadRequestException('Faltan datos obligatorios del documento Policy Brief');
      }

      const fecha = new Date();

      const autoresArray = typeof policyBriefData.autores === 'string'
        ? policyBriefData.autores.split(',').map((autor: string) => autor.trim())
        : policyBriefData.autores;

      const nuevoPolicyBrief: Partial<PolicyBrief> = {
          titulo: policyBriefData.titulo,
          anio_publicacion: parseInt(policyBriefData.anio_publicacion, 10),
          autores: autoresArray,
          mensaje_clave: policyBriefData.mensaje_clave,
          link_pdf: policyBriefData.link_pdf
      };
      
      const creadoPolicyBrief = await this.policiesBriefsService.create(nuevoPolicyBrief as PolicyBrief);

      await this.logsService.createLogDocument({
        id_usuario: usuarioId,
        id_documento:  creadoPolicyBrief.id, // Usamos el ID del usuario retornado
        accion: 'Creacion documento',
        fecha: fecha,
      });

      return creadoPolicyBrief;
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Error al crear el documento Policy Brief sin archivo.');
    }
  }
}
  