import { loginUser } from "./api_service.js";
import * as Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
  
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const usuario = document.getElementById("user").value.trim();
      const contrasenia = document.getElementById("password").value.trim();
  
      // Verificar si los campos están vacíos
      if (!usuario || !contrasenia) {
        Sweetalert2.fire("Por favor, complete todos los campos."); // Usando Sweetalert2
        return;
      }
  
      try {
        const result = await loginUser(usuario, contrasenia);
        console.log(result);
  
        if (result && result.id_usuario) {
          // Guardar el token en una cookie
          document.cookie = `id_usuario=${result.id_usuario}; path=/; max-age=86400`; // Expira en 1 día
  
          // Obtener los datos del usuario
          const userData = result.id_usuario;
  
          // Verificar y guardar el tema del usuario
          if (userData && userData.theme !== undefined) {
            const theme = userData.theme === 0 ? "dark" : "light";
            document.cookie = `theme=${theme}; path=/; max-age=86400`; // Expira en 1 día
            console.log(`Tema del usuario guardado en cookie: ${theme}`);
          } else {
            console.warn("No se pudo obtener el tema del usuario.");
          }
  
          // Redirigir al usuario a la página principal
          window.location.href = "/index.html";
        }
      } catch (error) {
        // Mostrar el mensaje de error devuelto por el servidor
        console.error("Error durante el proceso de autenticación:", error);
        Sweetalert2.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      }
    });
  });
  