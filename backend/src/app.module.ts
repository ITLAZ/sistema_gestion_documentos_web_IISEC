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
    ]),

    ArticulosRevistasModule,
    CapitulosLibrosModule,
    LibrosModule,
    DocumentosTrabajoModule,
    UsuariosModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    ArticulosRevistasService,
    CapitulosLibrosService,
    LibrosService,
    DocumentosTrabajoService,
    UsuariosService
  ],
})
export class AppModule {}


