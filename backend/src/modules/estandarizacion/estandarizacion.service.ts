import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class EstandarizacionService {
  procesarArchivo(
    file: Express.Multer.File,
    titulo: string,
    autores: string,
    editorial: string,
    anio: string
  ) {
    // Abreviar los campos
    const abreviaturaTitulo = titulo.replace(/\s+/g, '').substring(0, 5); // Tomamos los primeros 5 caracteres del título
    const abreviaturaAutor = autores.split(' ')[0].substring(0, 4); // Tomamos los primeros 4 caracteres del primer apellido
    const abreviaturaEditorial = editorial.split(' ')[0].substring(0, 4); // Tomamos los primeros 4 caracteres de la editorial

    // Formatear la fecha actual (YYYYMMDD)
    const fechaActual = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    // Construir el nombre del archivo estandarizado
    const nombreEstandarizado = `Lib-${anio}${abreviaturaTitulo}${abreviaturaAutor}${abreviaturaEditorial}-${fechaActual}`;

    // Asegurarse de que el nombre tiene un máximo de 30 caracteres
    const nombreFinal = nombreEstandarizado.substring(0, 30);

    // Ruta final del archivo
    const nuevoNombreArchivo = `${nombreFinal}${path.extname(file.originalname)}`;
    const nuevoPath = path.join(file.destination, nuevoNombreArchivo);

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
}