import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { normalize } from 'path';

@ApiTags('File-Handler') 
@Controller('file-handler')
export class FileHandlerController {
    /**
       * Devuelve un archivo PDF en base al nombre de archivo proporcionado.
       * @param filename Nombre del archivo PDF a descargar.
       * @param res Respuesta Express que devuelve el archivo.
       */
    @Get('file/:filename')
    @ApiParam({
      name: 'filename',
      required: true,
      description: 'Nombre del archivo PDF a descargar',
      example: 'documento.pdf'
    })
    @ApiResponse({
      status: 200,
      description: 'Archivo PDF descargado exitosamente'
    })
    @ApiResponse({
      status: 404,
      description: 'Archivo no encontrado'
    })
    @ApiResponse({
      status: 500,
      description: 'Error interno del servidor'
    })
    @Get('file/:filename')
    getPdf(@Param('filename') filename: string, @Res() res: Response) {
      // Aquí creas la ruta completa a tu archivo fuera de la carpeta del proyecto
      const filePath = normalize(`C:/tmp/${filename}`);
      return res.sendFile(filePath);  // Enviar el archivo PDF
    }
}