import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticulosRevistasModule } from './modules/articulos-revistas/articulos-revistas.module'; // Importa el módulo
import { ArticulosRevistasService } from './services/articulos-revistas/articulos-revistas.service';
import { ArticuloRevista, ArticuloRevistaSchema } from './schemas/articulos-revistas.schema';

@Module({
  imports: [
    // Conexión a la base de datos MongoDB
    MongooseModule.forRoot('mongodb://localhost/8800'), 
 
    MongooseModule.forFeature([{ name: ArticuloRevista.name, schema: ArticuloRevistaSchema }]),

    ArticulosRevistasModule,
  ],
  controllers: [AppController],
  providers: [AppService, ArticulosRevistasService],
})
export class AppModule {}


