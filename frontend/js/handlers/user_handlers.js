
//GESTION DE USUARIOS
import { getAllUsers, createUser, estadoUsuario, fetchDeletedFiles, restoreFile } from '../services/user_services.js';
function getCookieValue(name) {
    const cookieString = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    
    return cookieString ? cookieString.split('=')[1] : null;
}
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('tbody');
    const addUserButton = document.getElementById('add-user-button');
    const addUserModal = document.getElementById('add-user-modal');

    // Crear la superposición para el modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(modalOverlay);

    // Renderizar usuarios en la tabla
    async function renderUsers() {
        try {
            // Obtener usuarios desde el backend
            const users = await getAllUsers();

            // Limpiar la tabla antes de renderizar
            tbody.innerHTML = '';

            // Generar filas para cada usuario
            users.forEach((user) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.usuario}</td>
                    <td>${user.nombre}</td>
                    <td>${user.admin ? 'Administrador' : 'Usuario'}</td>
                    <td>${user.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <div class="input-group">
                            <button type="button" class="toggle-status-button" data-id="${user._id}">
                                ${user.activo ? 'Desactivar' : 'Activar'}
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            alert('No se pudieron cargar los usuarios. Por favor, intente más tarde.');
        }
    }

    // Manejar clic en botones "Activar/Desactivar" usando delegación de eventos
    tbody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('toggle-status-button')) {
            const userId = e.target.getAttribute('data-id');
            try {
                // Cambiar el estado del usuario en el backend
                const updatedUser = await estadoUsuario(userId);

                // Mostrar mensaje de confirmación
                alert(`Estado de ${updatedUser.usuario} actualizado a ${updatedUser.activo ? 'Activo' : 'Inactivo'}.`);

                // Volver a renderizar la tabla para reflejar los cambios
                renderUsers();
            } catch (error) {
                console.error('Error al cambiar el estado del usuario:', error);
                alert('Error al actualizar el estado del usuario. Intente nuevamente.');
            }
        }
    });

    // Mostrar el modal
    function showAddUserModal() {
        addUserModal.classList.add('show');
        modalOverlay.classList.add('show');
        addUserModal.innerHTML = `
            <h2>Añadir Usuario</h2>
            <form id="add-user-form">
                <label>
                    Usuario:
                    <input type="text" name="usuario" required>
                </label>
                <label>
                    Nombre:
                    <input type="text" name="nombre" required>
                </label>
                <label>
                    Contraseña:
                    <input type="password" name="contrasenia" required>
                </label>
                <label>
                    ¿Administrador?
                    <input type="checkbox" name="admin">
                </label>
                <button type="submit">Guardar</button>
                <button type="button" id="cancel-add-user">Cancelar</button>
            </form>
        `;
    }

    // Cerrar el modal
    function closeModal() {
        addUserModal.classList.remove('show');
        modalOverlay.classList.remove('show');
    }

    // Manejar clic en "Añadir Usuario"
    addUserButton.addEventListener('click', showAddUserModal);

    // Cerrar el modal al hacer clic en la superposición o en "Cancelar"
    modalOverlay.addEventListener('click', closeModal);
    addUserModal.addEventListener('click', (e) => {
        if (e.target.id === 'cancel-add-user') {
            closeModal();
        }
    });

    // Manejar el envío del formulario de "Añadir Usuario"
    addUserModal.addEventListener('submit', async (e) => {
        if (e.target.id === 'add-user-form') {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newUser = {
                usuario: formData.get('usuario'),
                nombre: formData.get('nombre'),
                contrasenia: formData.get('contrasenia'),
                admin: formData.get('admin') === 'on', // Convertir checkbox a booleano
            };

            try {
                const createdUser = await createUser(newUser);
                alert(`Usuario ${createdUser.usuario} creado exitosamente.`);
                closeModal();
                renderUsers();
            } catch (error) {
                alert('Error al crear el usuario. Por favor, intente nuevamente.');
            }
        }
    });

    // Renderizar los usuarios iniciales desde el backend
    renderUsers();
});



// Manejo de eventos globales para los dropdowns
document.addEventListener("click", function (event) {
    const dropBtn = event.target.closest(".drop-btn");
    if (dropBtn) {
      const dropdownContent = dropBtn.nextElementSibling;
      const isVisible = dropdownContent.style.display === "block";
      document
        .querySelectorAll(".dropdown-content")
        .forEach((content) => (content.style.display = "none"));
      dropdownContent.style.display = isVisible ? "none" : "block";
      event.stopPropagation();
    } else {
      document
        .querySelectorAll(".dropdown-content")
        .forEach((content) => (content.style.display = "none"));
    }
  });
  
  // Delegación de eventos para las opciones del menú dropdown
  document.addEventListener("click", function (event) {
    const actionItem = event.target.closest(".dropdown-content a");
    if (actionItem) {
      event.preventDefault();
      const targetUrl = actionItem.getAttribute("href");
      window.location.href = targetUrl;
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('tbody');
    const typeSelector = document.getElementById('type-selector');

    // Obtener el ID de usuario desde la cookie
    const usuarioId = getCookieValue('id_usuario');
    console.log('ID de usuario:', usuarioId);

    // Verificar si el ID de usuario existe
    if (!usuarioId) {
        alert('No se encontró el ID del usuario en las cookies. Asegúrate de haber iniciado sesión.');
        return;
    }

    // Función para renderizar los archivos en la tabla
    async function renderFiles(fileType) {
        tbody.innerHTML = '<tr><td colspan="4">Cargando...</td></tr>';
        try {
            // Obtener datos del backend
            const files = await fetchDeletedFiles(fileType);

            // Limpiar tabla
            tbody.innerHTML = '';

            // Llenar tabla con los datos obtenidos
            files.forEach((file) => {
                const tr = document.createElement('tr');

                const nombreTd = document.createElement('td');
                nombreTd.textContent = file.titulo;

                const autorTd = document.createElement('td');
                autorTd.textContent = file.autores.join(', ');

                const anioTd = document.createElement('td');
                anioTd.textContent = file.anio_publicacion;

                const accionesTd = document.createElement('td');
                const restoreButton = document.createElement('button');
                restoreButton.textContent = 'Restaurar';
                restoreButton.addEventListener('click', async () => {
                    try {
                        const result = await restoreFile(file._id, usuarioId); // Restaurar archivo
                        alert(`Archivo "${file.titulo}" restaurado con éxito.`);
                        renderFiles(fileType); // Actualizar la tabla después de restaurar
                    } catch (error) {
                        console.error('Error al restaurar el archivo:', error);
                        alert('No se pudo restaurar el archivo. Intente nuevamente.');
                    }
                });

                accionesTd.appendChild(restoreButton);

                tr.appendChild(nombreTd);
                tr.appendChild(autorTd);
                tr.appendChild(anioTd);
                tr.appendChild(accionesTd);

                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al renderizar los archivos:', error);
        }
    }

    // Actualizar tabla cuando se cambia el tipo de archivo
    typeSelector.addEventListener('change', () => {
        const selectedType = typeSelector.value;
        renderFiles(selectedType);
    });

    // Renderizar todos los archivos eliminados al cargar la página
    renderFiles('');
});


