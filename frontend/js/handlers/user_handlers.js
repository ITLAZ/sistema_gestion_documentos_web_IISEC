
//GESTION DE USUARIOS
import { getAllUsers, createUser, estadoUsuario } from '../services/user_services.js';

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
