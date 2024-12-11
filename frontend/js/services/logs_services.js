
import * as Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';

export async function fetchLogs(logType) {
    try {
        // Determinar el endpoint según el tipo de log seleccionado
        const endpoint = logType
            ? `http://localhost:3000/logs/getAll?tipo=${logType}`
            : 'http://localhost:3000/logs/getAll';

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
