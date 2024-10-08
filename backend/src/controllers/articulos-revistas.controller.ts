import { Controller, Get, Post, Delete, Put, Param, Body, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ArticulosRevistasService } from 'src/services/articulos-revistas/articulos-revistas.service';
import { ArticuloRevista } from 'src/schemas/articulos-revistas.schema';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/services/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

const getMulterOptions = (fileUploadService: FileUploadService, destination: string) => {
  return fileUploadService.getMulterOptions(destination);
};

@Controller('articulos-revistas')
export class ArticulosRevistasController {
  constructor(
    private readonly articulosRevistasService: ArticulosRevistasService,
    private readonly fileUploadService: FileUploadService
  ) {}

  // Obtener todos los artículos
  @Get()
  async findAll(): Promise<ArticuloRevista[]> {
    return this.articulosRevistasService.findAll();
  }

  // Buscar articulos por aproximación del título
  @Get('titulo/:titulo')
  async findByTitulo(@Param('titulo') titulo: string): Promise<ArticuloRevista[]> {
    return this.articulosRevistasService.findByTitulo(titulo);
  }

  // Buscar articulos por aproximación del autor
  @Get('autor/:autor')
  async findByAutor(@Param('autor') autor: string): Promise<ArticuloRevista[]> {
    return this.articulosRevistasService.findByAutor(autor);
  }

  // Buscar un articulos por su ID
  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<ArticuloRevista> {
    // Validación de ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.articulosRevistasService.findById(id);
  }

  // Eliminar un artículo por su id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ArticuloRevista> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID no válido');
    }
    return this.articulosRevistasService.delete(id);
  }

  // Actualizar un capituloLibro por su id
  @Put(':id')
  async update(@Param('id') id: string, @Body() articulo: Partial<ArticuloRevista>): Promise<ArticuloRevista> {
    return this.articulosRevistasService.update(id, articulo);
  }

  // Crear articulo-libro en servidor y bd
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', getMulterOptions(new FileUploadService(), 'C:/tmp'))
    )
    async create(
      @Body() articulo: ArticuloRevista,
      @UploadedFile() file: Express.Multer.File
    ): Promise<ArticuloRevista> {
      if (!file || !articulo) {
        throw new BadRequestException('Faltan datos necesarios');
      }

    const procesado = this.fileUploadService.procesarArchivo(
      file,
      articulo.titulo ?? 'Sin título',
      articulo.autores?.join(' ') ?? 'Autor desconocido',
      articulo.anio_revista?.toString() ?? '0000',
      'AR',
      'C:/tmp'
    );

    const nuevoArticulo: Partial<ArticuloRevista> = {
      numero_articulo: articulo.numero_articulo,
      titulo: articulo.titulo,
      anio_revista: articulo.anio_revista,
      autores: articulo.autores,
      nombre_revista: articulo.nombre_revista,
      editorial: articulo.editorial,
      abstract: articulo.abstract,
      link_pdf: articulo.link_pdf,
      direccion_archivo: procesado.path,
    };
    
    return this.articulosRevistasService.create(nuevoArticulo as ArticuloRevista);
  }


  // Crear articulo-libro solo en bd
  @Post('no-upload')
  async createWithoutFile(@Body() articulo: ArticuloRevista): Promise<ArticuloRevista> {
    if (!articulo) {
      throw new BadRequestException('Faltan datos necesarios');
    }

    const nuevoArticulo: Partial<ArticuloRevista> = {
      numero_articulo: articulo.numero_articulo,
      titulo: articulo.titulo,
      anio_revista: articulo.anio_revista,
      autores: articulo.autores,
      nombre_revista: articulo.nombre_revista,
      editorial: articulo.editorial,
      abstract: articulo.abstract,
      link_pdf: articulo.link_pdf
    };
    
    return this.articulosRevistasService.create(nuevoArticulo as ArticuloRevista);
  }
}
