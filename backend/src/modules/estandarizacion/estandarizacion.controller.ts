import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { EstandarizacionService } from './estandarizacion.service';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('estandarizacion')
  export class EstandarizacionController {
    constructor(private readonly estandarizacionService: EstandarizacionService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: 'C:/tmp',
        filename: (req, file, cb) => {
          const fileExtName = extname(file.originalname);
          const fileName = `temp-${Date.now()}${fileExtName}`;
          cb(null, fileName);
        },
      }),
    }))
    handleFileUpload(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: any
    ) {
      const { titulo, autores, editorial, anio_publicacion } = body;
      return this.estandarizacionService.procesarArchivo(file, titulo, autores, editorial, anio_publicacion);
    }
  }
  