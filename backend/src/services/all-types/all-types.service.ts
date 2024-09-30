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
export class AllTypesService {
    constructor(
        @InjectModel(Libro.name) private readonly libroModel: Model<Libro>,
        @InjectModel(ArticuloRevista.name) private readonly articuloRevistaModel: Model<ArticuloRevista>,
        @InjectModel(CapituloLibro.name) private readonly capituloLibroModel: Model<CapituloLibro>,
        @InjectModel(DocumentoTrabajo.name) private readonly documentoTrabajoModel: Model<DocumentoTrabajo>,
        @InjectModel(IdeaReflexion.name) private readonly ideaReflexionModel: Model<IdeaReflexion>,
        @InjectModel(PolicyBrief.name) private readonly policyBriefModel: Model<PolicyBrief>,
        @InjectModel(InfoIISEC.name) private readonly infoIISECModel: Model<InfoIISEC>,
      ) {}
    
      async obtenerTodas(): Promise<any> {
        const libros = await this.libroModel.find().exec();
        const articulosRevistas = await this.articuloRevistaModel.find().exec();
        const capitulosLibros = await this.capituloLibroModel.find().exec();
        const documentosTrabajo = await this.documentoTrabajoModel.find().exec();
        const ideasReflexiones = await this.ideaReflexionModel.find().exec();
        const policiesBriefs = await this.policyBriefModel.find().exec();
        const infoIISEC = await this.infoIISECModel.find().exec();
    
        return {
          libros,
          articulosRevistas,
          capitulosLibros,
          documentosTrabajo,
          ideasReflexiones,
          policiesBriefs,
          infoIISEC,
        };
      }
}
