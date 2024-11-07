import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportsService } from 'src/services/reports/reports.service';

@ApiTags('Reportes')
@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
    ) {}

    @Get('getByType')
    @ApiQuery({ name: 'categoria', required: true, description: 'Tipo de documento a buscar (libros, articulosRevistas, etc.)', })
    @ApiQuery({ name: 'anioInicio', required: false, description: 'Año de inicio para filtrar los resultados',type: String,})
    @ApiQuery({ name: 'anioFin', required: false, description: 'Año de fin para filtrar los resultados', type: String, })
    @ApiQuery({ name: 'autores', required: false, description: 'Nombre del autor para filtrar los resultados', type: String, })
    @ApiResponse({ status: 200, description: 'Lista de documentos filtrados por el tipo y criterios especificados', type: Array, })
    @ApiResponse({ status: 400, description: 'Error de validación si la categoría no está especificada', })
    async findByType(
        @Query('categoria') categoria: string, // Tipo de documento (libros, articulosRevistas, etc.)
        @Query('anioInicio') anioInicio?: string, // Año de inicio opcional (recibido como string desde la query)
        @Query('anioFin') anioFin?: string, // Año de fin opcional (recibido como string desde la query)
        @Query('autores') autores?: string // Autor opcional
    ): Promise<any[]> {
        // Validación: Verificamos si la categoría es proporcionada
        if (!categoria) {
        throw new BadRequestException('La categoría es obligatoria');
        }

        const anioInicioNumber = anioInicio ? parseInt(anioInicio, 10) : undefined;
        const anioFinNumber = anioFin ? parseInt(anioFin, 10) : undefined;

        return await this.reportsService.findByType(
        categoria,
        anioInicioNumber,
        anioFinNumber,
        autores
        );
    }

    @Get('getAll')
    @ApiQuery({ name: 'anioInicio', required: false,  description: 'Año de inicio para filtrar los resultados',  type: String,})
    @ApiQuery({ name: 'anioFin',  required: false,description: 'Año de fin para filtrar los resultados',type: String,})
    @ApiQuery({ name: 'autores', required: false, description: 'Nombre del autor para filtrar los resultados', type: String,})
    @ApiResponse({ status: 200, description: 'Lista de todos los documentos según los filtros especificados'})
    async findAll(
        @Query('anioInicio') anioInicio?: string, // Año de inicio opcional (recibido como string desde la query)
        @Query('anioFin') anioFin?: string, // Año de fin opcional (recibido como string desde la query)
        @Query('autores') autores?: string // Autor opcional
    ): Promise<any[]> {

        const anioInicioNumber = anioInicio ? parseInt(anioInicio, 10) : undefined;
        const anioFinNumber = anioFin ? parseInt(anioFin, 10) : undefined;

        return await this.reportsService.findAll(
        anioInicioNumber,
        anioFinNumber,
        autores
        );
    }


    @Get('countByTypes')
    @ApiQuery({ name: 'categorias', required: true, isArray: true, description: 'Array de tipos de documento a contar (e.g., libros, articulosRevistas, etc.)' })
    @ApiQuery({ name: 'anioInicio', required: false, description: 'Año de inicio para filtrar los resultados', type: String })
    @ApiQuery({ name: 'anioFin', required: false, description: 'Año de fin para filtrar los resultados', type: String })
    @ApiQuery({ name: 'autores', required: false, description: 'Nombre del autor para filtrar los resultados', type: String })
    @ApiResponse({ status: 200, description: 'Cantidad de documentos por tipo según los criterios especificados', type: Array })
    @ApiResponse({ status: 400, description: 'Error de validación si los parámetros son incorrectos' })
    async countByTypes(
    @Query('categorias') categorias: string[], // Array de tipos de documento (libros, articulosRevistas, etc.)
    @Query('anioInicio') anioInicio?: string, // Año de inicio opcional (recibido como string desde la query)
    @Query('anioFin') anioFin?: string, // Año de fin opcional (recibido como string desde la query)
    @Query('autores') autores?: string // Autor opcional
    ): Promise<{ tipo: string; cantidad: number }[]> {
        // Convertimos los años a números si están presentes
        const anioInicioNumber = anioInicio ? parseInt(anioInicio, 10) : undefined;
        const anioFinNumber = anioFin ? parseInt(anioFin, 10) : undefined;

        // Llamamos al servicio que cuenta los documentos por tipo
        return await this.reportsService.findCount(
            categorias,
            anioInicioNumber,
            anioFinNumber,
            autores
        );
    }
}