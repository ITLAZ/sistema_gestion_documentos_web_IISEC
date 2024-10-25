import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from 'src/services/reports/reports.service';

@ApiTags('Reportes')
@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
    ) {}

    @Get('getByType')
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

}
