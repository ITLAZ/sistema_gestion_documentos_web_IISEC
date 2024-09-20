import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario,UsuarioSchema } from 'src/schemas/usuarios.schema';
import { UsuariosService } from 'src/services/usuarios/usuarios.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }])],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}