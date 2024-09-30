import { Controller, Get, Post, Put, Param, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { LibrosService } from 'src/services/libros/libros.service';
import { Libro } from 'src/schemas/libros.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';  
import { Types } from 'mongoose';

// Función para obtener las opciones de Multer
const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@Controller('libros')
export class LibrosController {
  constructor(
    private readonly librosService: LibrosService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Get()
  async findAll(): Promise<Libro[]> {
    return this.librosService.findAll();
  }

  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<Libro[]> {
    return this.librosService.findByTitulo(titulo);
  }

  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<Libro[]> {
    return this.librosService.findByAutor(autor);
  }
  
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<Libro> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.librosService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() libro: Partial<Libro>): Promise<Libro> {
    return this.librosService.update(id, libro);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
  )
  async create(
    @Body() libro: Libro,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Libro> {
    if (!file || !libro) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      libro.titulo ?? 'Sin título',
      libro.autores?.join(' ') ?? 'Autor desconocido',
      libro.editorial ?? 'Editorial desconocida',
      libro.anio_publicacion?.toString() ?? '0000',
      'C:/tmp'
    );

    const nuevoLibro: Partial<Libro> = {
      portada: libro.portada,
      anio_publicacion: libro.anio_publicacion,
      titulo: libro.titulo,
      autores: libro.autores,
      editorial: libro.editorial,
      abstract: libro.abstract,
      link_pdf: libro.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.librosService.create(nuevoLibro as Libro);
  }

  @Post('no-upload')
  async createWithoutFile(@Body() libro: Libro): Promise<Libro> {
    if (!libro) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoLibro: Partial<Libro> = {
      portada: libro.portada,
      anio_publicacion: libro.anio_publicacion,
      titulo: libro.titulo,
      autores: libro.autores,
      editorial: libro.editorial,
      abstract: libro.abstract,
      link_pdf: libro.link_pdf,
    };

    return this.librosService.create(nuevoLibro as Libro);
  }
}
