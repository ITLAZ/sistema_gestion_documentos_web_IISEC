// services/navbar_service.js
import { logoutUser } from './logout_service.js'; // Importar la función para cerrar sesión
import { getUserById } from './user_services.js';

export async function loadNavbar() {
    try {
        // Obtener el ID del usuario desde la cookie antes de cargar el menú
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
                // Redirigir al login y detener la carga de contenido
                window.location.href = '/login';
                alert('La cuenta no esta activa. Contacte con un adminsitrador.');
                return;
            }
        } catch (error) {
            console.error('Error al verificar el estado del usuario:', error);
            alert('Hubo un problema al verificar tu cuenta. Intenta más tarde.');
            window.location.href = '/login';
            return; // Detener la ejecución
        }

        // Si todo está bien, cargar el menú de navegación
        const response = await fetch('/components/menu_navegacion.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        document.getElementById('menu-container').innerHTML = data;

        // Mostrar u ocultar opciones del admin en el menú
        const user = await getUserById(idUsuario); // Obtener los datos del usuario nuevamente
        const usuariosOption = document.querySelector('.navbar-links li a[href="/usuarios"]').parentElement;
        const restoreOption = document.querySelector('.navbar-links li a[href="/restore"]').parentElement;

        if (user.admin) {
            usuariosOption.style.display = 'list-item';
            restoreOption.style.display = 'list-item';
        } else {
            usuariosOption.style.display = 'none';
            restoreOption.style.display = 'none';
        }

        // Añadir evento de logout después de cargar el menú
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                try {
                    const result = await logoutUser(idUsuario);
                    if (result.message === 'Logout exitoso') {
                        document.cookie = "id_usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        alert('Cierre de sesión exitoso.');
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
