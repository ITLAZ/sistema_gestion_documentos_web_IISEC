import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { Usuario } from 'src/schemas/Usuarios.schema';
import { LogsService } from 'src/services/logs/logs.service';
import { UsuariosService } from 'src/services/Usuarios/Usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly logsService: LogsService, // Inyecta el servicio de logs
      ) {}

    @Post('crear')
    async createAccount(@Body() createUserDto: Partial<Usuario>): Promise<Usuario> {
      // Validación básica
      if (!createUserDto.usuario || !createUserDto.nombre || !createUserDto.contrasenia) {
        throw new BadRequestException('Faltan datos necesarios para crear el usuario');
      }

      // Lógica de creación de usuario
      try {
        const nuevoUsuario = await this.usuariosService.create(createUserDto);
        return nuevoUsuario;
      } catch (error) {
        throw new BadRequestException('No se pudo crear la cuenta de usuario');
      }
    }

    @Post('login')
    async login(@Body() body: { usuario: string, contrasenia: string }): Promise<{ message: string, id_usuario?: string }> {
        const { usuario, contrasenia } = body;
        const fecha = new Date();

        // Validar las credenciales del usuario
        const idUsuario = await this.usuariosService.validarCredenciales(usuario, contrasenia);
        
        if (!idUsuario) {
            throw new BadRequestException('Usuario o contraseña incorrectos');
        }
        
        
        // Registrar la acción de login en la colección de logs
        await this.logsService.createLog({
            id_usuario: idUsuario,  // Usamos el ID del usuario retornado
            accion: 'login',
            fecha: fecha,
        });

        // Retorna un mensaje de éxito y el ID del usuario
        return { message: 'Login exitoso', id_usuario: idUsuario };
    }
      

    @Post('logout')
      async logout(@Body() body: { id_usuario: string }): Promise<{ message: string }> {
        const fecha = new Date();
      
        // Registrar la acción de logout en la colección de logs
        await this.logsService.createLog({
          id_usuario: body.id_usuario,
          accion: 'logout',
          fecha: fecha,
        });
      
        return { message: 'Logout exitoso' };
    }
}