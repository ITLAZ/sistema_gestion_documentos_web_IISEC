import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosController } from 'src/controllers/usuarios.controller';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { Usuario,UsuarioSchema } from 'src/schemas/Usuarios.schema';
import { LogsService } from 'src/services/logs_service/logs.service';
import { UsuariosService } from 'src/services/Usuarios/Usuarios.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Usuario.name, schema: UsuarioSchema },
    { name: Log.name, schema: LogSchema },
  ])],
  controllers: [UsuariosController],
  providers: [UsuariosService, LogsService],
  exports: [UsuariosService, LogsService],
})
export class UsuariosModule {}