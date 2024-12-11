// services/navbar_service.js
import { logoutUser } from './logout_service.js'; // Importar la función para cerrar sesión
import { getUserById } from './user_services.js';

export async function loadNavbar() {
    try {
        // Cargar el menú de navegación
        const response = await fetch('/components/menu_navegacion.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        document.getElementById('menu-container').innerHTML = data;

        // Obtener el ID del usuario desde la cookie
        const idUsuario = getCookie('id_usuario');

        if (!idUsuario) {
            // Si no hay ID de usuario, redirigir al login
            window.location.href = '/login';
            return; // Detener la ejecución
        }

        try {
            const user = await getUserById(idUsuario);

            // Verificar si el usuario está activo
            if (!user.activo) {
                alert('La cuenta no está activa. Contacte con un administrador.');
                window.location.href = '/login'; // Redirigir al login
                return;
            }

            // Mostrar u ocultar opciones del admin en el menú
            const usuariosOption = document.querySelector('.navbar-links li a[href="/usuarios"]').parentElement;
            const restoreOption = document.querySelector('.navbar-links li a[href="/restore"]').parentElement;
            const logsOption = document.querySelector('.navbar-links li a[href="/mostlogs"]').parentElement;

            if (user.admin) {
                usuariosOption.style.display = 'list-item';
                restoreOption.style.display = 'list-item';
                logsOption.style.display = 'list-item';
            } else {
                usuariosOption.style.display = 'none';
                restoreOption.style.display = 'none';
                logsOption.style.display = 'none';
            }

        } catch (error) {
            console.error('Error al verificar el estado del usuario:', error);
            alert('Hubo un problema al verificar tu cuenta. Intenta más tarde.');
            window.location.href = '/login';
        }

        // Añadir evento de logout después de cargar el menú
        const logoutButton = document.querySelector('.navbar-links a[href=""]'); // Selecciona el enlace vacío
        if (logoutButton) {
            logoutButton.addEventListener('click', logout);
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

// Función para manejar el cierre de sesión
function logout() {
    // Eliminar cookies relacionadas con la sesión
    document.cookie = "__client_uat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "__client_uat_2FGVYXKM=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "__session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "__session_2FGVYXKM=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "id_usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Redirigir al login o página principal
    window.location.href = "/login"; // Redirigir a la página de login después de cerrar sesión
}