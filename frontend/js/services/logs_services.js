
import * as Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';

export async function fetchLogs(logType) {
    try {
        // Determinar el endpoint según el tipo de log seleccionado
        const endpoint = logType
            ? `${API_URL}/logs/getAll?tipo=${logType}`
            : `${API_URL}/logs/getAll`;

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // Devolver los logs como un array
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los logs:', error);
        Sweetalert2.fire('Hubo un error al cargar los logs. Intente nuevamente.');
        throw error;
    }
} 

export async function getNameLogs(usuarioId) { 
    try {
        const response = await fetch(`${API_URL}/usuarios/getById/${usuarioId}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const userData = await response.json();

        // Extraer solo los campos necesarios
        const result = {
            nombre: userData.nombre,
            
        };

        return result;

    } catch (error) {
        console.error(`Error al obtener los datos del usuario:`, error);
        alert(`Hubo un problema al obtener los datos del usuario. Por favor, intenta de nuevo más tarde.`);
        throw error;
    }
}
