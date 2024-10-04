import { loginUser } from './api_service.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form'); 

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usuario = document.getElementById('user').value;
        const contrasenia = document.getElementById('password').value;

        try {
            const result = await loginUser(usuario, contrasenia);

            // Verificar si la respuesta contiene el `id_usuario`
            if (result && result.id_usuario) {
                // Guardar el token en una cookie
                document.cookie = `id_usuario=${result.id_usuario}; path=/; max-age=86400`; // Expira en 1 día
                
                // Redirigir al dashboard o página principal
                window.location.href = '/index.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            alert('Verifica que todos los campos estén llenos');
        }
    });
});
