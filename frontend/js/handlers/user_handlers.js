
//GESTION DE USUARIOS

import { createUser } from '../services/user_services.js';

document.addEventListener('DOMContentLoaded', () => {
    const users = []; // Lista local de usuarios
    const tbody = document.querySelector('tbody');
    const addUserButton = document.getElementById('add-user-button');
    const addUserModal = document.getElementById('add-user-modal');

    // Crear la superposición para el modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(modalOverlay);

    // Renderizar usuarios en la tabla
    function renderUsers() {
        tbody.innerHTML = '';
        users.forEach((user) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.usuario}</td>
                <td>${user.nombre}</td>
                <td>${user.admin ? 'Administrador' : 'Usuario'}</td>
                <td>
                    <div class="input-group">
                        <button type="button" class="del-user-button">Eliminar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

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
              console.log('Enviando datos al backend:', newUser);
              const createdUser = await createUser(newUser); // Llama a la función corregida
              console.log('Usuario creado en el backend:', createdUser);
  
              // Mostrar mensaje de confirmación
              alert(`Usuario ${createdUser.usuario} creado exitosamente.`);
  
              // Actualizar la lista local y renderizar
              closeModal();
              renderUsers(); // Vuelve a renderizar la tabla
          } catch (error) {
              alert('Error al crear el usuario. Por favor, intente nuevamente.');
          }
      }
  });
  

    // Renderizar los usuarios iniciales
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
