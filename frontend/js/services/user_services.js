
import * as Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';

export async function getUserById(usuarioId) { 
    try {
        const response = await fetch(`${API_URL}/usuarios/getById/${usuarioId}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const userData = await response.json();

        // Extraer solo los campos necesarios
        const result = {
            activo: userData.activo,
            admin: userData.admin
        };

        return result;

    } catch (error) {
        console.error(`Error al obtener los datos del usuario:`, error);
        Sweetalert2.fire(`Hubo un problema al obtener los datos del usuario. Por favor, intenta de nuevo más tarde.`);
        throw error;
    }
}


export async function createUser(userData) {
    try {
        const datosUsuario = {
            ...userData,
            theme: 1, // Siempre será 1
            admin: userData.admin ?? false, // Si no se envía, será false
            activo: userData.activo ?? true, // Si no se envía, será true
        };

        const response = await fetch(`${API_URL}/usuarios/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosUsuario),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Extrae el cuerpo de error
            throw new Error(errorData.message || 'Error desconocido al crear el usuario.');
        }

        const data = await response.json();
        return data; // Retorna el usuario creado desde el backend
    } catch (error) {
        console.error('Error en createUser:', error);
        throw error; // Re-lanza el error para manejarlo en el frontend
    }
}


export async function getAllUsers() {
    try {
        const response = await fetch(`${API_URL}/usuarios/getAll`);

        if (!response.ok) {
            throw new Error(`Error al obtener los usuarios: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Lista de todos los usuarios (user_service)');
        return data; // Retorna la lista de usuarios
        
    } catch (error) {
        console.error('Error en getAllUsers:', error);
        throw error;
    }
}


export async function estadoUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/usuarios/activar/${id}`, {
            method: 'PATCH', // PATCH porque se está modificando parcialmente un recurso
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al activar el usuario: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Retorna la respuesta del backend
    } catch (error) {
        console.error('Error en activarUsuario:', error);
        throw error;
    }
}


export async function fetchDeletedFiles(fileType) {
    try {
        // Determinar el endpoint según el tipo de archivo seleccionado
        const endpoint = `${API_URL}/${fileType}/eliminados`;

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const files = await response.json();
        return files;
    } catch (error) {
        console.error('Error al obtener los archivos eliminados:', error);
        Sweetalert2.fire('Hubo un error al cargar los archivos. Intente nuevamente.');
        throw error;
    }
}


export async function restoreFile(fileType, fileId, userId) {
    try {
        const endpoint = `${API_URL}/${fileType}/${fileId}/recuperar-eliminado`;

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-usuario-id': userId, // Header necesario según la imagen proporcionada
            },
        });

        if (!response.ok) {
            throw new Error(`Error al restaurar el archivo: ${response.status} - ${response.statusText}`);
        }

        return await response.json(); // Suponiendo que el backend devuelve algún mensaje o el archivo restaurado
    } catch (error) {
        console.error('Error en restoreFile:', error);
        Sweetalert2.fire('No se pudo restaurar el archivo. Intente nuevamente.');
        throw error;
    }
}

