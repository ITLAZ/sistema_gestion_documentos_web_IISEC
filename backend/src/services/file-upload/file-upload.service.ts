import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  // Función para eliminar caracteres especiales y tildes
  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD') // Descompone las letras con tildes
      .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
      .replace(/[^a-zA-Z0-9]/g, ''); // Elimina caracteres especiales y espacios
  }

  // Función genérica para procesar y estandarizar archivos
  procesarArchivo(
    file: Express.Multer.File,
    titulo: string,
    autores: string,
    editorial: string,
    anio: string,
    destinationPath: string // La ruta donde guardar el archivo
  ): any {
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('El archivo debe ser un PDF');
    }

    // Abreviar los campos y normalizar
    const abreviaturaTitulo = this.normalizarTexto(titulo).substring(0, 5);
    const abreviaturaAutor = this.normalizarTexto(autores.split(' ')[0]).substring(0, 4);
    const abreviaturaEditorial = this.normalizarTexto(editorial.split(' ')[0]).substring(0, 4);

    // Formatear la fecha actual (YYYYMMDD)
    const fechaActual = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    // Construir el nombre del archivo estandarizado
    const nombreEstandarizado = `Lib-${anio}${abreviaturaTitulo}${abreviaturaAutor}${abreviaturaEditorial}-${fechaActual}`;

    // Asegurarse de que el nombre tiene un máximo de 30 caracteres
    const nombreFinal = nombreEstandarizado.substring(0, 30);

    // Ruta final del archivo
    const nuevoNombreArchivo = `${nombreFinal}${path.extname(file.originalname)}`;
    const nuevoPath = path.join(destinationPath, nuevoNombreArchivo);

    // Renombrar el archivo
    fs.renameSync(path.join(file.destination, file.filename), nuevoPath);

    return {
      message: 'Archivo cargado y estandarizado con éxito',
      path: nuevoPath,
      metadata: {
        titulo,
        autores,
        editorial,
        anio,
      },
    };
  }

  // Multer configuration, puedes reutilizar esto en todos los controladores
  getMulterOptions(destination: string) {
    return {
      storage: diskStorage({
        destination: destination, // El destino será pasado según el módulo
        filename: (req, file, cb) => {
          const fileExtName = path.extname(file.originalname);
          const fileName = `temp-${Date.now()}${fileExtName}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    };
  }
}
