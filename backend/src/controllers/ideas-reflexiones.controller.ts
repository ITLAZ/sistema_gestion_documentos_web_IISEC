import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { IdeasReflexionesService } from 'src/services/ideas-reflexiones/ideas-reflexiones.service';
import { IdeaReflexion } from 'src/schemas/ideas-reflexiones.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { ApiTags } from '@nestjs/swagger';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@ApiTags('Ideas-Reflexiones') 
@Controller('ideas-reflexiones')
export class IdeasReflexionesController {
  constructor(
    private readonly ideaReflexionesService: IdeasReflexionesService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // Obtener todos los ideas-reflexiones
  @Get()
  async findAll(): Promise<IdeaReflexion[]> {
    return this.ideaReflexionesService.findAll();
  }
  
  // Buscar ideas-reflexiones por aproximación del título
  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<IdeaReflexion[]> {
    return this.ideaReflexionesService.findByTitulo(titulo);
  }

  // Buscar ideas-reflexiones por aproximación del autor
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<IdeaReflexion[]> {
    return this.ideaReflexionesService.findByAutor(autor);
  }
  
  // Buscar un ideaReflexion por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<IdeaReflexion> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.ideaReflexionesService.findById(id);
  }

  // Eliminar un ideaReflexion por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IdeaReflexion> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.ideaReflexionesService.delete(id);
  }
  
  // Actualizar un ideaReflexion por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() ideaReflexion: Partial<IdeaReflexion>): Promise<IdeaReflexion> {
    return this.ideaReflexionesService.update(id, ideaReflexion);
  }

  // Crear ideaReflexion-libro en servidor y bd
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() ideaReflexion: IdeaReflexion,
    @UploadedFile() file: Express.Multer.File
  ): Promise<IdeaReflexion> {
    if (!file || !ideaReflexion) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      ideaReflexion.titulo ?? 'Sin título',
      ideaReflexion.autores?.join(' ') ?? 'Autor desconocido',
      ideaReflexion.anio_publicacion?.toString() ?? '0000',
      'IR',
      'C:/tmp'
    );

    const nuevoIdeaReflexion: Partial<IdeaReflexion> = {
      titulo: ideaReflexion.titulo,
      anio_publicacion: ideaReflexion.anio_publicacion,
      autores: ideaReflexion.autores,
      observaciones: ideaReflexion.observaciones,
      link_pdf: ideaReflexion.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.ideaReflexionesService.create(nuevoIdeaReflexion as IdeaReflexion);
  }


  // Crear ideaReflexion-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() ideaReflexion: IdeaReflexion): Promise<IdeaReflexion> {
    if (!ideaReflexion) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoIdeaReflexion: Partial<IdeaReflexion> = {
      titulo: ideaReflexion.titulo,
      anio_publicacion: ideaReflexion.anio_publicacion,
      autores: ideaReflexion.autores,
      observaciones: ideaReflexion.observaciones,
      link_pdf: ideaReflexion.link_pdf,
    };
    
    return this.ideaReflexionesService.create(nuevoIdeaReflexion as IdeaReflexion);
  }

}
