import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { PoliciesBriefsService } from 'src/services/policies-briefs/policies-briefs.service';
import { PolicyBrief } from 'src/schemas/policies-briefs.schema';
import { Types } from 'mongoose';

@Controller('policies-briefs')
export class PoliciesBriefsController {
  constructor(private readonly policiesBriefsService: PoliciesBriefsService) {}

  // Obtener todos los policies-briefs
  @Get()
  async findAll(): Promise<PolicyBrief[]> {
    return this.policiesBriefsService.findAll();
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

  // Crear un policyBrief
  @Post()
  async create(@Body() policyBrief: PolicyBrief): Promise<PolicyBrief> {
    return this.policiesBriefsService.create(policyBrief);
  }

  // Actualizar un policyBrief por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() policyBrief: Partial<PolicyBrief>): Promise<PolicyBrief> {
    return this.policiesBriefsService.update(id, policyBrief);
  }

}
