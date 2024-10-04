import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CapitulosLibrosService } from 'src/services/capitulos-libros/capitulos-libros.service';
import { CapituloLibro } from 'src/schemas/capitulos-libros.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';  

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@Controller('capitulos-capitulos')
export class CapitulosLibrosController {
  constructor(
    private readonly capitulosLibrosService: CapitulosLibrosService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // Obtener todos los capítulos
  @Get()
  async findAll(): Promise<CapituloLibro[]> {
    return this.capitulosLibrosService.findAll();
  }

  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<CapituloLibro[]> {
    return this.capitulosLibrosService.findByTitulo(titulo);
  }

  // Buscar capituloLibro por aproximación del autor  
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<CapituloLibro[]> {
    return this.capitulosLibrosService.findByAutor(autor);
  }
  
  // Buscar un capituloLibro por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<CapituloLibro> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.capitulosLibrosService.findById(id);
  }
  
  // Eliminar un capituloLibro por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CapituloLibro> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.capitulosLibrosService.delete(id);
  }

  // Actualizar un capituloLibro por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() capitulo: Partial<CapituloLibro>): Promise<CapituloLibro> {
    return this.capitulosLibrosService.update(id, capitulo);
  }

  // Crear capitulo-libro en servidor y bd
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() capitulo: CapituloLibro,
    @UploadedFile() file: Express.Multer.File
  ): Promise<CapituloLibro> {
    if (!file || !capitulo) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      capitulo.titulo_capitulo ?? 'Sin título',
      capitulo.autores?.join(' ') ?? 'Autor desconocido',
      capitulo.anio_publicacion?.toString() ?? '0000',
      'CL',
      'C:/tmp'
    );

    const nuevoCapitulo: Partial<CapituloLibro> = {
      numero_identificacion: capitulo.numero_identificacion,
      titulo_libro: capitulo.titulo_libro,
      titulo_capitulo: capitulo.titulo_capitulo,
      anio_publicacion: capitulo.anio_publicacion,
      autores: capitulo.autores,
      editorial: capitulo.editorial,
      editores: capitulo.editores,
      link_pdf: capitulo.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.capitulosLibrosService.create(nuevoCapitulo as CapituloLibro);
  }


  // Crear capitulo-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() capitulo: CapituloLibro): Promise<CapituloLibro> {
    if (!capitulo) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoCapitulo: Partial<CapituloLibro> = {
      numero_identificacion: capitulo.numero_identificacion,
      titulo_libro: capitulo.titulo_libro,
      titulo_capitulo: capitulo.titulo_capitulo,
      anio_publicacion: capitulo.anio_publicacion,
      autores: capitulo.autores,
      editorial: capitulo.editorial,
      editores: capitulo.editores,
      link_pdf: capitulo.link_pdf
    };
    
    return this.capitulosLibrosService.create(nuevoCapitulo as CapituloLibro);
  }
}
