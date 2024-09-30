import { Controller, Get } from '@nestjs/common';
import { AllTypesService } from 'src/services/all-types/all-types.service';

@Controller('all-types')
export class AllTypesController {

    constructor(private readonly allTypesService: AllTypesService) {}

    @Get()
    async obtenerTodas(): Promise<any> {
        return await this.allTypesService.obtenerTodas();
    }
}
