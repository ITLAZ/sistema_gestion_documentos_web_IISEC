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
      ): Promise<any[]> {
      
        // Creamos el objeto de filtro dinámicamente
        const filter: any = {};
      
        // Filtros comunes (aplicables a todas las colecciones)
        if (autores) {
          filter.autores = autores; // Filtrar por autor
        }
      
        // Filtro de años (aplicables a todas las colecciones)
         // Filtro de años (aplicables a todas las colecciones)
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
        // Si anioFiltro no está vacío, lo aplicamos
        const promesas: Promise<any>[] = [];

    // Campos a devolver por colección
    const camposPorColeccion = {
        libros: campos?.libros || '', // Campos específicos para libros
        articulosRevistas: campos?.articulosRevistas || '', // Campos específicos para artículos de revistas
        capitulosLibros: campos?.capitulosLibros || '', // Campos específicos para capítulos de libros
        documentosTrabajo: campos?.documentosTrabajo || '', // Campos específicos para documentos de trabajo
        ideasReflexiones: campos?.ideasReflexiones || '', // Campos específicos para ideas y reflexiones
        infoIIsec: campos?.infoIIsec || '', // Campos específicos para info IISEC
        policiesBriefs: campos?.policiesBriefs || '' // Campos específicos para briefs de políticas
    };

    // Realizamos la búsqueda en cada una de las colecciones
    promesas.push(
        this.libroModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(camposPorColeccion.libros)
            .exec()
    );
    promesas.push(
        this.articuloRevistaModel.find({ ...filter, ...(filtroAnio ? { anio_revista: filtroAnio } : {}) })
            .select(camposPorColeccion.articulosRevistas)
            .exec()
    );
    promesas.push(
        this.capituloLibroModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(camposPorColeccion.capitulosLibros)
            .exec()
    );
    promesas.push(
        this.documentoTrabajoModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(camposPorColeccion.documentosTrabajo)
            .exec()
    );
    promesas.push(
        this.ideaReflexionModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(camposPorColeccion.ideasReflexiones)
            .exec()
    );
    promesas.push(
        this.infoIIsecModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(camposPorColeccion.infoIIsec)
            .exec()
    );
    promesas.push(
        this.policiesBriefModel.find({ ...filter, ...(filtroAnio ? { anio_publicacion: filtroAnio } : {}) })
            .select(camposPorColeccion.policiesBriefs)
            .exec()
    );

    // Esperamos a que todas las promesas de búsqueda se resuelvan
    const resultados = await Promise.all(promesas);

    // Combinamos los resultados de todas las colecciones
    return resultados.flat();
      }

}