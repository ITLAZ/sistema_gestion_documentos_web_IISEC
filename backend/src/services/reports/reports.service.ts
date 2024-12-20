import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticuloRevista } from 'src/schemas/articulos-revistas.schema';
import { CapituloLibro } from 'src/schemas/capitulos-libros.schema';
import { DocumentoTrabajo } from 'src/schemas/documentos-trabajo.schema';
import { IdeaReflexion } from 'src/schemas/ideas-reflexiones.schema';
import { InfoIISEC } from 'src/schemas/info-iisec.schema';
import { Libro } from 'src/schemas/libros.schema';
import { PolicyBrief } from 'src/schemas/policies-briefs.schema';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Libro.name) private libroModel: Model<Libro>,
        @InjectModel(ArticuloRevista.name) private articuloRevistaModel: Model<ArticuloRevista>,
        @InjectModel(CapituloLibro.name) private capituloLibroModel: Model<CapituloLibro>,
        @InjectModel(DocumentoTrabajo.name) private documentoTrabajoModel: Model<DocumentoTrabajo>,
        @InjectModel(IdeaReflexion.name) private ideaReflexionModel: Model<IdeaReflexion>,
        @InjectModel(InfoIISEC.name) private infoIIsecModel: Model<InfoIISEC>,
        @InjectModel(PolicyBrief.name) private policiesBriefModel: Model<PolicyBrief>,
    ){}
    
    async findByType(
        categoria: string, // Tipo de documento (libros, articulosRevistas, etc.)
        anioInicio?: number, // Parámetro opcional para el rango de año de inicio
        anioFin?: number, // Parámetro opcional para el rango de año de fin
        autores?: string
      ): Promise<any[]> {
      
        // Creamos el objeto de filtro dinámicamente
        const filter: any = {};
        
        // Switch para seleccionar la colección según la categoría
        let model;
        let anioCampo = 'anio_publicacion'; // Campo por defecto para el año
        let campos = 'titulo autores anio_publicacion';
        switch (categoria) {
          case 'libros':
            model = this.libroModel;
            break;
          case 'articulosRevistas':
            model = this.articuloRevistaModel;
            anioCampo = 'anio_revista'; // Campo específico para ArticuloRevista
            campos = 'titulo autores anio_revista';
            break;
          case 'capitulosLibros':
            model = this.capituloLibroModel;
            campos = 'titulo_capitulo autores anio_publicacion';
            break;
          case 'documentosTrabajo':
            model = this.documentoTrabajoModel;
            break;
          case 'ideasReflexiones':
            model = this.ideaReflexionModel;
            break;
          case 'infoIIsec':
            model = this.infoIIsecModel;
            break;
          case 'policiesBriefs':
            model = this.policiesBriefModel;
            break;
          default:
            throw new Error('Categoría no válida'); // Si la categoría no es válida
        }
      
        // Aplicamos los filtros según los parámetros proporcionados
        if (autores) {
          filter.autores = autores; // Filtrar por autor
        }
      
        if (anioInicio || anioFin) {
          filter[anioCampo] = {}; // Usamos el campo adecuado para el año
          if (anioInicio) {
            filter[anioCampo].$gte = anioInicio; // Mayor o igual que el año de inicio
          }
          if (anioFin) {
            filter[anioCampo].$lte = anioFin; // Menor o igual que el año de fin
          }
        }
      
        // Realizamos la consulta en el modelo seleccionado
        return model.find(filter).select(campos).sort({ [anioCampo]: 'desc' }).exec();
    }

    async findAll(
        anioInicio?: number, // Parámetro opcional para el rango de año de inicio
        anioFin?: number, // Parámetro opcional para el rango de año de fin
        autores?: string // Parámetro opcional para filtrar por autor
    ): Promise<any> {
    
        // Creamos el objeto de filtro dinámicamente
        const filter: any = {};
    
        // Filtro autores
        if (autores) {
            filter.autores = autores; // Filtrar por autor
        }
    
        // Filtro de anios 
        const anioFiltro: any = {};
        if (anioInicio) {
            anioFiltro.$gte = anioInicio; // Mayor o igual que el año de inicio
        }
        if (anioFin) {
            anioFiltro.$lte = anioFin; // Menor o igual que el año de fin
        }
    
        // Si anioFiltro no está vacío, lo aplicamos
        const filtroAnio = Object.keys(anioFiltro).length ? anioFiltro : undefined;
    
        const campos = {
            libros: 'titulo autores anio_publicacion',
            articulosRevistas: 'titulo autores anio_revista',
            capitulosLibros: 'titulo_capitulo autores anio_publicacion',
            documentosTrabajo: 'titulo autores anio_publicacion',
            ideasReflexiones: 'titulo autores anio_publicacion',
            infoIIsec: 'titulo autores anio_publicacion',
            policiesBriefs: 'titulo autores anio_publicacion'
        };
    
        // Realizamos las consultas a cada colección
        const librosPromise = this.libroModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(campos.libros)
            .exec();
    
        const articulosRevistasPromise = this.articuloRevistaModel.find({ ...filter, ...(filtroAnio ? { anio_revista: filtroAnio } : {}) })
            .select(campos.articulosRevistas)
            .exec();
    
        const capitulosLibrosPromise = this.capituloLibroModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(campos.capitulosLibros)
            .exec();
    
        const documentosTrabajoPromise = this.documentoTrabajoModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(campos.documentosTrabajo)
            .exec();
    
        const ideasReflexionesPromise = this.ideaReflexionModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(campos.ideasReflexiones)
            .exec();
    
        const infoIIsecPromise = this.infoIIsecModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(campos.infoIIsec)
            .exec();
    
        const policiesBriefsPromise = this.policiesBriefModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(campos.policiesBriefs)
            .exec();
    
        // Esperamos a que todas las promesas de búsqueda se resuelvan
        const [libros, articulosRevistas, capitulosLibros, documentosTrabajo, ideasReflexiones, infoIIsec, policiesBriefs] = await Promise.all([
            librosPromise,
            articulosRevistasPromise,
            capitulosLibrosPromise,
            documentosTrabajoPromise,
            ideasReflexionesPromise,
            infoIIsecPromise,
            policiesBriefsPromise
        ]);
    
        // Retornamos los resultados agrupados por categoría
        return {
            libros,
            articulosRevistas,
            capitulosLibros,
            documentosTrabajo,
            ideasReflexiones,
            infoIIsec,
            policiesBriefs
        };
    }

    async findCount(
      categorias: string[], // Array de tipos de documento (libros, articulosRevistas, etc.)
      anioInicio?: number, // Parámetro opcional para el rango de año de inicio
      anioFin?: number, // Parámetro opcional para el rango de año de fin
      autores?: string
    ): Promise<{ tipo: string; cantidad: number }[]> {
      
      const resultados: { tipo: string; cantidad: number }[] = [];
      
      // Si no se envían categorías, incluimos todas las posibles
      if (!categorias || categorias.length === 0) {
        categorias = [
          'libros',
          'articulosRevistas',
          'capitulosLibros',
          'documentosTrabajo',
          'ideasReflexiones',
          'infoIIsec',
          'policiesBriefs'
        ];
      }

      // Iteramos sobre cada categoría proporcionada
      for (const categoria of categorias) {
        // Creamos el objeto de filtro dinámicamente
        const filter: any = {};
    
        // Seleccionamos el modelo y el campo de año adecuado según la categoría
        let model;
        let anioCampo = 'anio_publicacion'; // Campo por defecto para el año
        switch (categoria) {
          case 'libros':
            model = this.libroModel;
            break;
          case 'articulosRevistas':
            model = this.articuloRevistaModel;
            anioCampo = 'anio_revista'; // Campo específico para ArticuloRevista
            break;
          case 'capitulosLibros':
            model = this.capituloLibroModel;
            break;
          case 'documentosTrabajo':
            model = this.documentoTrabajoModel;
            break;
          case 'ideasReflexiones':
            model = this.ideaReflexionModel;
            break;
          case 'infoIIsec':
            model = this.infoIIsecModel;
            break;
          case 'policiesBriefs':
            model = this.policiesBriefModel;
            break;
          default:
            continue; // Si la categoría no es válida, pasamos a la siguiente
        }
    
        // Aplicamos los filtros según los parámetros proporcionados
        if (autores) {
          filter.autores = autores; // Filtrar por autor
        }
    
        if (anioInicio || anioFin) {
          filter[anioCampo] = {}; // Usamos el campo adecuado para el año
          if (anioInicio) {
            filter[anioCampo].$gte = anioInicio; // Mayor o igual que el año de inicio
          }
          if (anioFin) {
            filter[anioCampo].$lte = anioFin; // Menor o igual que el año de fin
          }
        }
    
        // Utilizamos la agregación para contar la cantidad de documentos por categoría
        const result = await model.aggregate([
          { $match: filter }, // Aplicamos el filtro
          { $group: { _id: null, count: { $sum: 1 } } } // Agrupamos y contamos
        ]);
    
        // Agregamos el resultado al arreglo final con el formato solicitado
        resultados.push({
          tipo: categoria,
          cantidad: result.length > 0 ? result[0].count : 0 // Si no hay resultados, count es 0
        });
      }
    
      // Retornamos el resultado de todas las categorías solicitadas
      return resultados;
    }    

    async findDistributionByYear(
      categorias: string[], // Array de tipos de documento (libros, articulosRevistas, etc.)
      anioInicio?: number, // Parámetro opcional para el rango de año de inicio
      anioFin?: number, // Parámetro opcional para el rango de año de fin
      autores?: string // Parámetro opcional para filtrar por autor
    ): Promise<{ tipo: string; anio: number; cantidad: number }[]> {
    
      const resultados: { tipo: string; anio: number; cantidad: number }[] = [];
    
      // Si no se envían categorías, incluimos todas las posibles
      if (!categorias || categorias.length === 0) {
        categorias = [
          'libros',
          'articulosRevistas',
          'capitulosLibros',
          'documentosTrabajo',
          'ideasReflexiones',
          'infoIIsec',
          'policiesBriefs'
        ];
      }
    
      // Iteramos sobre cada categoría proporcionada
      for (const categoria of categorias) {
        // Creamos el objeto de filtro dinámicamente
        const filter: any = {};
    
        // Seleccionamos el modelo y el campo de año adecuado según la categoría
        let model;
        let anioCampo = 'anio_publicacion'; // Campo por defecto para el año
        switch (categoria) {
          case 'libros':
            model = this.libroModel;
            break;
          case 'articulosRevistas':
            model = this.articuloRevistaModel;
            anioCampo = 'anio_revista'; // Campo específico para ArticuloRevista
            break;
          case 'capitulosLibros':
            model = this.capituloLibroModel;
            break;
          case 'documentosTrabajo':
            model = this.documentoTrabajoModel;
            break;
          case 'ideasReflexiones':
            model = this.ideaReflexionModel;
            break;
          case 'infoIIsec':
            model = this.infoIIsecModel;
            break;
          case 'policiesBriefs':
            model = this.policiesBriefModel;
            break;
          default:
            continue; // Si la categoría no es válida, pasamos a la siguiente
        }
    
        // Aplicamos los filtros según los parámetros proporcionados
        if (autores) {
          filter.autores = autores; // Filtrar por autor
        }
    
        if (anioInicio || anioFin) {
          filter[anioCampo] = {}; // Usamos el campo adecuado para el año
          if (anioInicio) {
            filter[anioCampo].$gte = anioInicio; // Mayor o igual que el año de inicio
          }
          if (anioFin) {
            filter[anioCampo].$lte = anioFin; // Menor o igual que el año de fin
          }
        }
    
        // Utilizamos la agregación para contar la cantidad de documentos por año y categoría
        const result = await model.aggregate([
          { $match: filter }, // Aplicamos el filtro
          {
            $group: {
              _id: { anio: `$${anioCampo}` }, // Agrupamos por año
              count: { $sum: 1 } // Contamos la cantidad de documentos por año
            }
          },
          { $sort: { "_id.anio": 1 } } // Ordenamos los resultados por año ascendente
        ]);
    
        // Agregamos el resultado al arreglo final con el formato solicitado
        for (const item of result) {
          resultados.push({
            tipo: categoria,
            anio: item._id.anio, // Año de la publicación
            cantidad: item.count // Cantidad de documentos publicados en ese año
          });
        }
      }
    
      // Retornamos el resultado de todas las categorías solicitadas
      return resultados;
    }
}