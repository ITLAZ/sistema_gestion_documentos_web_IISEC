export async function getUserById(usuarioId) { 
    try {
        const response = await fetch(`http://localhost:3000/usuarios/getById/${usuarioId}`);

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


export async function createUser(userData) {
    try {
        const datosUsuario = {
            ...userData,
            theme: 1, // Siempre será 1
            admin: userData.admin ?? false, // Si no se envía, será false
            activo: userData.activo ?? true, // Si no se envía, será true
        };

        const response = await fetch('http://localhost:3000/usuarios/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosUsuario),
        });

        if (!response.ok) {
            throw new Error(`Error al crear el usuario: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Retorna el usuario creado desde el backend
    } catch (error) {
        console.error('Error en createUser:', error);
        throw error;
    }
}


export async function getAllUsers() {
    try {
        const response = await fetch('http://localhost:3000/usuarios/getAll');

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





