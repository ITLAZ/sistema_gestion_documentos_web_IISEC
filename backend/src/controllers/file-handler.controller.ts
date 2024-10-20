import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { normalize } from 'path';

@ApiTags('File-Handler') 
@Controller('file-handler')
export class FileHandlerController {
    @Get('file/:filename')
    getPdf(@Param('filename') filename: string, @Res() res: Response) {
      // Aquí creas la ruta completa a tu archivo fuera de la carpeta del proyecto
      const filePath = normalize(`C:/tmp/${filename}`);
      return res.sendFile(filePath);  // Enviar el archivo PDF
    }
}
