import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from 'src/controllers/reports.controller';
import { ArticuloRevista, ArticuloRevistaSchema } from 'src/schemas/articulos-revistas.schema';
import { CapituloLibro, CapituloLibroSchema } from 'src/schemas/capitulos-libros.schema';
import { DocumentoTrabajo, DocumentoTrabajoSchema } from 'src/schemas/documentos-trabajo.schema';
import { IdeaReflexion, IdeaReflexionSchema } from 'src/schemas/ideas-reflexiones.schema';
import { InfoIISEC, InfoIISECSchema } from 'src/schemas/info-iisec.schema';
import { Libro, LibroSchema } from 'src/schemas/libros.schema';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { PolicyBrief, PolicyBriefSchema } from 'src/schemas/policies-briefs.schema';
import { Usuario, UsuarioSchema } from 'src/schemas/usuarios.schema';
import { ReportsService } from 'src/services/reports/reports.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ArticuloRevista.name, schema: ArticuloRevistaSchema },
            { name: CapituloLibro.name, schema: CapituloLibroSchema },
            { name: Libro.name, schema: LibroSchema },
            { name: DocumentoTrabajo.name, schema: DocumentoTrabajoSchema },
            { name: Usuario.name, schema: UsuarioSchema },
            { name: InfoIISEC.name, schema: InfoIISECSchema },
            { name: IdeaReflexion.name, schema: IdeaReflexionSchema },
            { name: PolicyBrief.name, schema: PolicyBriefSchema},
            { name: Log.name, schema: LogSchema},
        ]),
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
    exports: [ReportsService],
    
})
export class ReportsModule {}
