import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PoliciesBriefsService } from 'src/services/policies-briefs/policies-briefs.service';
import { PolicyBrief } from 'src/schemas/policies-briefs.schema';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@Controller('policies-briefs')
export class PoliciesBriefsController {
  constructor(
    private readonly policiesBriefsService: PoliciesBriefsService,
    private readonly fileUploadService: FileUploadService
  ) {}

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
