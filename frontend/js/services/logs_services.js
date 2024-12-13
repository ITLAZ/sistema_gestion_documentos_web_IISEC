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
        alert('Hubo un error al cargar los logs. Intente nuevamente.');
        throw error;
    }
} 

export async function getNameLogs(usuarioId) { 
    try {
        const response = await fetch(`http://localhost:3000/usuarios/getById/${usuarioId}`);

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
