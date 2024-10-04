import { logoutUserApi } from './api_service.js';

export async function logoutUser(idUsuario) {
    try {
        const result = await logoutUserApi(idUsuario);
        return result;
    } catch (error) {
        console.error('Error al intentar cerrar sesión:', error);
        throw error;
    }
}
