import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticulosRevistasService } from './services/articulos-revistas/articulos-revistas.service';
import { ArticulosRevistasModule } from './modules/articulos-revistas/articulos-revistas.module';

@Module({
  imports: [ArticulosRevistasModule],
  controllers: [AppController],
  providers: [AppService, ArticulosRevistasService],
})
export class AppModule {}
