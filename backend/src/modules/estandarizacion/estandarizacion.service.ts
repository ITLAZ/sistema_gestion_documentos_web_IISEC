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
    // Función para eliminar caracteres especiales y tildes
    const normalizarTexto = (texto: string) => {
      return texto
        .normalize('NFD') // Descompone las letras con tildes
        .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
        .replace(/[^a-zA-Z0-9]/g, ''); // Elimina caracteres especiales y espacios
    };

    // Abreviar los campos y normalizar
    const abreviaturaTitulo = normalizarTexto(titulo).substring(0, 5); // Tomamos los primeros 5 caracteres del título
    const abreviaturaAutor = normalizarTexto(autores.split(' ')[0]).substring(0, 4); // Tomamos los primeros 4 caracteres del primer apellido
    const abreviaturaEditorial = normalizarTexto(editorial.split(' ')[0]).substring(0, 4); // Tomamos los primeros 4 caracteres de la editorial

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
