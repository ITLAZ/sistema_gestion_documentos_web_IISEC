import { loginUser } from './api_service.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usuario = document.getElementById('user').value.trim();
        const contrasenia = document.getElementById('password').value.trim();

        // Verificar si los campos están vacíos
        if (!usuario || !contrasenia) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const result = await loginUser(usuario, contrasenia);
            console.log(result);

            if (result && result.id_usuario) {
                // Guardar el token en una cookie
                document.cookie = `id_usuario=${result.id_usuario}; path=/; max-age=86400`; // Expira en 1 día
                window.location.href = '/index.html';
            }
        } catch (error) {
            // Mostrar el mensaje de error devuelto por el servidor
            console.error('Error durante el proceso de autenticación:', error);
            alert(error.message);  //alerta del error en backend
        }
    });
});
