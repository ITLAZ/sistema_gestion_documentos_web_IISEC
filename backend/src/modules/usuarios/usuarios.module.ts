import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario,UsuarioSchema } from 'src/schemas/Usuarios.schema';
import { UsuariosService } from 'src/services/Usuarios/Usuarios.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }])],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}