import { Controller, Get, Query } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LibrosResponseDto, ArticuloRevistaResponseDto, CapituloLibroResponseDto, DocumentoTrabajoResponseDto, InfoIISECResponseDto, IdeaReflexionResponseDto, PolicyBriefResponseDto } from 'src/dto/elasticsearch-by-collection-dto';
import { AllTypesService } from 'src/services/all-types/all-types.service';
import { SearchService } from 'src/services/search/search.service';

@ApiTags('all-types') 
@Controller('all-types')
export class AllTypesController {
    
    constructor(
        private readonly allTypesService: AllTypesService,
        private searchService: SearchService,
    ) {}
    
    @ApiExcludeEndpoint()
    @Get('get')
    async obtenerTodas(): Promise<any> {
        return await this.allTypesService.obtenerTodas();
    }

    @Get('update')
    @ApiOperation({ summary: 'Indexar los archivos a elasticsearch' })
    @ApiResponse({ status: 200, description: 'Updated all types successfully' })
    async updateTodas(): Promise<any> {
        return await this.allTypesService.updateElasticTodas();
    }
    
    @Get('search')
    @ApiOperation({ summary: 'Busqueda de documento por palabra clave en elasticsearch' })
    @ApiExtraModels(LibrosResponseDto, ArticuloRevistaResponseDto, CapituloLibroResponseDto, DocumentoTrabajoResponseDto, InfoIISECResponseDto, IdeaReflexionResponseDto, PolicyBriefResponseDto)
    @ApiQuery({ name: 'query', required: true, description: 'Search term' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number' })
    @ApiQuery({ name: 'size', required: false, description: 'Page size' })
    @ApiQuery({ name: 'anio_inicio', required: false, description: 'Publication start year' })
    @ApiQuery({ name: 'anio_fin', required: false, description: 'Publication end year' })
    @ApiQuery({ name: 'autores', required: false, description: 'Author filter' })
    @ApiQuery({ name: 'tipo_documento', required: false, description: 'Document type filter' })
    @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'anio_publicacion' })
    @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden ascendente o descendente', example: 'asc' })
    async searchAll(
      @Query('query') query: string = '',
      @Query('page') page: string = '1',
      @Query('size') size: string = '10',
      @Query('anio_inicio') anio_inicio?: string,
      @Query('anio_fin') anio_fin?: string,
      @Query('autores') autores?: string,
      @Query('tipo_documento') tipo_documento?: string,
      @Query('sortBy') sortBy?: string,
      @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc'
    ) {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(size, 10);

      // Parseo de los años de inicio y fin
      const startYear = anio_inicio ? parseInt(anio_inicio, 10) : undefined;
      const endYear = anio_fin ? parseInt(anio_fin, 10) : undefined;

      // Llama al servicio con los parámetros modificados
      const results = await this.searchService.searchAllCollections(query, pageNumber, pageSize, {
        anio_publicacion: {
          start: startYear,
          end: endYear,
        },
        autores,
        tipo_documento,
      }, sortBy, sortOrder);

      return results;
    }


    @Get('all')
    @ApiOperation({ summary: 'Obtención de todos los documentos mediante Elasticsearch' })
    @ApiExtraModels(LibrosResponseDto, ArticuloRevistaResponseDto, CapituloLibroResponseDto, DocumentoTrabajoResponseDto, InfoIISECResponseDto, IdeaReflexionResponseDto, PolicyBriefResponseDto)
    @ApiQuery({ name: 'query', required: false, description: 'Search term' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number' })
    @ApiQuery({ name: 'size', required: false, description: 'Page size' })
    @ApiQuery({ name: 'anio_inicio', required: false, description: 'Publication start year' })
    @ApiQuery({ name: 'anio_fin', required: false, description: 'Publication end year' })
    @ApiQuery({ name: 'autores', required: false, description: 'Author filter' })
    @ApiQuery({ name: 'tipo_documento', required: false, description: 'Document type filter' })
    @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', example: 'anio_publicacion' })
    @ApiQuery({ name: 'sortOrder', required: false, description: 'Ascending or descending order', example: 'asc' })
    async getAll(
      @Query('query') query: string = '',
      @Query('page') page: string = '1',
      @Query('size') size: string = '10',
      @Query('anio_inicio') anio_inicio?: string,
      @Query('anio_fin') anio_fin?: string,
      @Query('autores') autores?: string,
      @Query('tipo_documento') tipo_documento?: string,
      @Query('sortBy') sortBy?: string,
      @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc'
    ) {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(size, 10);
    
      // Llama al servicio con los parámetros
      const results = await this.searchService.getAllCollections(query, pageNumber, pageSize, {
        anio_inicio: anio_inicio ? parseInt(anio_inicio, 10) : undefined,
        anio_fin: anio_fin ? parseInt(anio_fin, 10) : undefined,
        autores,
        tipo_documento,
      }, sortBy, sortOrder);
    
      return results;
    }    
}