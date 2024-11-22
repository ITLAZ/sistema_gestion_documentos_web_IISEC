import { Controller, Get, InternalServerErrorException, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogsService } from 'src/services/logs_service/logs.service';
import { Log } from 'src/schemas/logs.schema';

@ApiTags('Logs')
@Controller('logs')
export class LogsController {

    constructor(
        private readonly logsService: LogsService,
    ) {}

    @Get("getAll")
    @ApiOperation({ summary: 'Obtener todos los Logs con opción de filtrado' })
    @ApiQuery({
        name: 'tipo',
        required: false,
        description: 'Filtrar logs por tipo: "documento" para logs de creación/edición/eliminación de documentos o "login" para login/logout',
        example: 'documento',
    })
    @ApiResponse({ status: 200, description: 'Lista de documentos Logs', type: Log, isArray: true })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getAll(
        @Query('tipo') tipo?: string,
    ): Promise<Log[]> {
    try {
        if (tipo === 'documento') {
        // Filtro para acciones relacionadas con documentos
        return await this.logsService.getLogsByActions(['Creacion documento', 'Actualización de documento','Actualización documento','Eliminación lógica de documento', 'Eliminación lógica documento', 'Restauración documento']);
        } else if (tipo === 'login') {
        // Filtro para acciones relacionadas con login/logout
        return await this.logsService.getLogsByActions(['login', 'logout']);
        }
        // Sin filtro: devuelve todos los logs
        return await this.logsService.getAll();
    } catch (error) {
        console.error(error.message);
        throw new InternalServerErrorException('Error al obtener los logs.');
    }
    }
}
