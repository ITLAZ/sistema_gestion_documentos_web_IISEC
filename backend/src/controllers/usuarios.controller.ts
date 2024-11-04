import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Usuario } from 'src/schemas/usuarios.schema';
import { LogsService } from 'src/services/logs_service/logs.service';
import { UsuariosService } from 'src/services/usuarios/usuarios.service';

@ApiTags('Usuarios') 
@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly logsService: LogsService, // Inyecta el servicio de logs
      ) {}

    @Post('crear')
    @ApiOperation({ summary: 'Crear una cuenta de usuario' })
    @ApiBody({
        description: 'Datos necesarios para crear un nuevo usuario',
        schema: {
            example: {
                usuario: 'jdoe',
                nombre: 'John Doe',
                contrasenia: 'password123',
                theme: 1
            }
        }
    })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: Usuario })
    @ApiResponse({ status: 400, description: 'Datos faltantes o inválidos' })
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
        throw new BadRequestException({
          message: 'No se pudo crear la cuenta de usuario',
          error: error.message,
        });
      }
    }

    @Post('login')
    @ApiOperation({ summary: 'Inicio de sesión de usuario' })
    @ApiBody({
        description: 'Credenciales del usuario para iniciar sesión',
        schema: {
            example: {
                usuario: 'jdoe',
                contrasenia: 'password123'
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Inicio de sesión exitoso',
        schema: {
            example: { message: 'Login exitoso', id_usuario: '60b8a8c2d8e59e6d1b5c60d4' }
        }
    })
    @ApiResponse({ status: 400, description: 'Usuario o contraseña incorrectos' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async login(@Body() body: { usuario: string, contrasenia: string }): Promise<{ message: string, id_usuario?: string }> {
        try {
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
            return { message: 'Login exitoso', id_usuario: idUsuario }; //token y theme
        } catch (error) {
            // Devuelve el error exacto
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw new InternalServerErrorException('Error interno del servidor');
        }
    }

      

    @Post('logout')
    @ApiOperation({ summary: 'Cerrar sesión de usuario' })
    @ApiBody({
        description: 'ID del usuario que cierra sesión',
        schema: {
            example: { id_usuario: '60b8a8c2d8e59e6d1b5c60d4' }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Logout exitoso',
        schema: {
            example: { message: 'Logout exitoso' }
        }
    })
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

    // Endpoint para obtener un usuario por su id
    @Get(':id_usuario')
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiParam({
        name: 'id_usuario',
        description: 'ID único del usuario a obtener',
        example: '60b8a8c2d8e59e6d1b5c60d4'
    })
    @ApiResponse({
        status: 200,
        description: 'Datos del usuario recuperados exitosamente',
        type: Usuario
    })
    @ApiResponse({ status: 400, description: 'ID de usuario inválido' })
    @ApiResponse({ status: 500, description: 'Error al obtener el usuario' })
    async getUserById(
      @Param('id_usuario') id_usuario: string
    ): Promise<Usuario> {
      try {
        return await this.usuariosService.getUserById(id_usuario);
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw new BadRequestException(error.message);
        }
        throw new InternalServerErrorException('Error al obtener el usuario');
      }
    }

    // Endpoint para actualizar el campo `theme`
    @Put('update-theme')
    @ApiOperation({ summary: 'Actualizar el tema del usuario' })
    @ApiBody({
        description: 'ID de usuario y valor de tema a actualizar',
        schema: {
            example: {
                id_usuario: '60b8a8c2d8e59e6d1b5c60d4',
                theme: 1
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Theme actualizado exitosamente',
        schema: {
            example: { message: 'Theme actualizado exitosamente', theme: 1 }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos faltantes o inválidos' })
    @ApiResponse({ status: 500, description: 'Error al actualizar el theme' })
    async updateTheme(
      @Body() body: { id_usuario: string; theme: number }
    ): Promise<{ message: string; theme: number }> {
      const { id_usuario, theme } = body;

      // Validación básica
      if (!id_usuario || theme === undefined) {
        throw new BadRequestException('ID de usuario y el valor de theme son requeridos');
      }

      try {
        const usuarioActualizado = await this.usuariosService.updateTheme(id_usuario, theme);
        return {
          message: 'Theme actualizado exitosamente',
          theme: usuarioActualizado.theme,
        };
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error al actualizar el theme');   
      }
    }
}