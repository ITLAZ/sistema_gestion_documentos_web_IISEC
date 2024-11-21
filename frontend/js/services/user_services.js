export async function getUserById(usuarioId) { 
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);

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
        alert(`Hubo un problema al obtener los datos del usuario. Por favor, intenta de nuevo más tarde.`);
        throw error;
    }
}

//Función para Obtener id_usuario de la Cookie
function getCookieValue(name) {
    const cookieString = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    
    return cookieString ? cookieString.split('=')[1] : null;
}