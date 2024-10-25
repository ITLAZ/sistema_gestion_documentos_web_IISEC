import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { PoliciesBriefsService } from 'src/services/policies-briefs/policies-briefs.service';
import { PolicyBrief } from 'src/schemas/policies-briefs.schema';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from 'src/services/search/search.service';
import { PolicyBriefResponseDto } from 'src/dto/elasticsearch-by-collection-dto';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Policies-Briefs') 
@Controller('policies-briefs')
export class PoliciesBriefsController {
  constructor(
    private readonly policiesBriefsService: PoliciesBriefsService,
    private readonly searchService: SearchService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // Obtener todos los policies-briefs
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('sortBy') sortBy: string = 'anio_publicacion',
    @Query('sortOrder') sortOrder: string = 'asc',
    @Query('anio_publicacion') anio_publicacion?: string,
    @Query('autores') autores?: string,
  ): Promise<PolicyBrief[]> {
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
    type: PolicyBriefResponseDto, // El tipo correcto que retornas
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
  ) : Promise<any[]> {
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);
    const sortField = sortBy || 'anio_publicacion';  // Campo predeterminado si no se proporciona
    const sortDirection: 'asc' | 'desc' = (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'asc';  // Establecer 'asc' por defecto

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
  }
  
  
  // Buscar policies-briefs por aproximación del título
  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<PolicyBrief[]> {
    return this.policiesBriefsService.findByTitulo(titulo);
  }

  // Buscar policies-briefs por aproximación del autor
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<PolicyBrief[]> {
    return this.policiesBriefsService.findByAutor(autor);
  }
  
  // Buscar un policyBrief por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<PolicyBrief> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.policiesBriefsService.findById(id);
  }

  // Eliminar un policyBrief por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<PolicyBrief> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.policiesBriefsService.delete(id);
  }

  // Actualizar un policyBrief por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() policyBrief: Partial<PolicyBrief>): Promise<PolicyBrief> {
    return this.policiesBriefsService.update(id, policyBrief);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() policyBrief: PolicyBrief,
    @UploadedFile() file: Express.Multer.File
  ): Promise<PolicyBrief> {
    if (!file || !policyBrief) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      policyBrief.titulo ?? 'Sin título',
      policyBrief.autores?.join(' ') ?? 'Autor desconocido',
      policyBrief.anio_publicacion?.toString() ?? '0000',
      'PB',
      'C:/tmp'
    );

    const nuevoPolicyBrief: Partial<PolicyBrief> = {
      titulo: policyBrief.titulo,
      anio_publicacion: policyBrief.anio_publicacion,
      autores: policyBrief.autores,
      mensaje_clave: policyBrief.mensaje_clave,
      link_pdf: policyBrief.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.policiesBriefsService.create(nuevoPolicyBrief as PolicyBrief);
  }


  // Crear policyBrief-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() policyBrief: PolicyBrief): Promise<PolicyBrief> {
    if (!policyBrief) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoPolicyBrief: Partial<PolicyBrief> = {
      titulo: policyBrief.titulo,
      anio_publicacion: policyBrief.anio_publicacion,
      autores: policyBrief.autores,
      mensaje_clave: policyBrief.mensaje_clave,
      link_pdf: policyBrief.link_pdf,
    };
    
    return this.policiesBriefsService.create(nuevoPolicyBrief as PolicyBrief);
  }


}
