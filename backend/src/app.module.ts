import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticulosRevistasModule } from './modules/articulos-revistas/articulos-revistas.module'; // Importa el módulo
import { ArticulosRevistasService } from './services/articulos-revistas/articulos-revistas.service';
import { ArticuloRevista, ArticuloRevistaSchema } from './schemas/articulos-revistas.schema';
import { CapituloLibro, CapituloLibroSchema } from './schemas/capitulos-libros.schema';
import { Libro, LibroSchema } from './schemas/libros.schema';
import { DocumentoTrabajo, DocumentoTrabajoSchema } from './schemas/documentos-trabajo.schema';
import { LibrosModule } from './modules/libros/libros.module';
import { DocumentosTrabajoModule } from './modules/documentos-trabajo/documentos-trabajo.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { Usuario, UsuarioSchema } from './schemas/usuarios.schema';
import { CapitulosLibrosModule } from './modules/capitulo-libros/capitulos-libros.module';
import { CapitulosLibrosService } from './services/capitulos-libros/capitulos-libros.service';
import { LibrosService } from './services/libros/libros.service';
import { DocumentosTrabajoService } from './services/documentos-trabajo/documentos-trabajo.service';
import { UsuariosService } from './services/Usuarios/Usuarios.service';
import { EstandarizacionoNombreModule } from './modules/estandarizacion/estandarizacion.module';
import { InfoIISEC, InfoIISECSchema } from './schemas/info-iisec.schema';
import { IdeaReflexion, IdeaReflexionSchema } from './schemas/ideas-reflexiones.schema';
import { PolicyBrief, PolicyBriefSchema } from './schemas/policies-briefs.schema';
import { IdeasReflexionesModule } from './modules/ideas-reflexiones/ideas-reflexiones.module';
import { InfoIisecModule } from './modules/info-iisec/info-iisec.module';
import { PoliciesBriefsModule } from './modules/policies-briefs/policies-briefs.module';
import { IdeasReflexionesService } from './services/ideas-reflexiones/ideas-reflexiones.service';
import { InfoIisecService } from './services/info-iisec/info-iisec.service';
import { PoliciesBriefsService } from './services/policies-briefs/policies-briefs.service';

@Module({
  imports: [
    // Conexión a la base de datos MongoDB
    MongooseModule.forRoot('mongodb://localhost:27017/BibliotecaIISEC'), 
 
    MongooseModule.forFeature([
      { name: ArticuloRevista.name, schema: ArticuloRevistaSchema },
      { name: CapituloLibro.name, schema: CapituloLibroSchema },
      { name: Libro.name, schema: LibroSchema },
      { name: DocumentoTrabajo.name, schema: DocumentoTrabajoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: InfoIISEC.name, schema: InfoIISECSchema },
      { name: IdeaReflexion.name, schema: IdeaReflexionSchema },
      { name: PolicyBrief.name, schema: PolicyBriefSchema},
    ]),

    ArticulosRevistasModule,
    CapitulosLibrosModule,
    LibrosModule,
    DocumentosTrabajoModule,
    UsuariosModule,
    EstandarizacionoNombreModule,
    IdeasReflexionesModule,
    InfoIisecModule,
    PoliciesBriefsModule,
  ], 
  controllers: [AppController],
  providers: [
    AppService, 
    ArticulosRevistasService,
    CapitulosLibrosService,
    LibrosService,
    DocumentosTrabajoService,
    UsuariosService,
    IdeasReflexionesService,
    InfoIisecService,
    PoliciesBriefsService,
  ],
})
export class AppModule {}


