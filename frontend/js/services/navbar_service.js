// services/navbar_service.js
import { logoutUser } from './logout_service.js'; // Importar la función para cerrar sesión

export async function loadNavbar() {
    try {
        const response = await fetch('/components/menu_navegacion.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        document.getElementById('menu-container').innerHTML = data;

        // Añadir evento de logout después de cargar el menú
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                const idUsuario = getCookie('id_usuario');

                try {
                    // Llamar al servicio de logout
                    const result = await logoutUser(idUsuario);
                    if (result.message === 'Logout exitoso') {
                        // Eliminar la cookie
                        document.cookie = "id_usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                        // Confirmar con un alert
                        alert('Cierre de sesión exitoso.');

                        // Redirigir al login
                        window.location.href = '/login';
                    }
                } catch (error) {
                    console.error('Error al intentar cerrar sesión:', error);
                    alert('Hubo un problema al cerrar sesión. Intente de nuevo más tarde.');
                }
            });
        }

    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// Función para obtener una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
