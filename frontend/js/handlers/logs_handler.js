
import * as Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';

import { fetchLogs } from '../services/logs_services.js';

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('tbody');
    const typeSelector = document.getElementById('type-selector');

    // Función para renderizar los logs en la tabla
    async function renderLogs(logType) {
        tbody.innerHTML = '<tr><td colspan="3">Cargando logs...</td></tr>';
        try {
            // Obtener los logs desde el backend
            const logs = await fetchLogs(logType);

            // Limpiar la tabla antes de renderizar
            tbody.innerHTML = '';

            // Rellenar la tabla con los logs obtenidos
            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3">No se encontraron logs.</td></tr>';
                return;
            }

            logs.forEach((log) => {
                const tr = document.createElement('tr');

                const usuarioTd = document.createElement('td');
                usuarioTd.textContent = log.id_usuario;

                const accionTd = document.createElement('td');
                accionTd.textContent = log.accion;

                const fechaTd = document.createElement('td');
                const formattedDate = new Date(log.fecha).toLocaleString(); // Formatear la fecha
                fechaTd.textContent = formattedDate;

                tr.appendChild(usuarioTd);
                tr.appendChild(accionTd);
                tr.appendChild(fechaTd);

                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al renderizar los logs:', error);
        }
    }

    // Escuchar cambios en el combobox y actualizar la tabla
    typeSelector.addEventListener('change', () => {
        const selectedType = typeSelector.value;
    
        if (!selectedType) {
            // Si no se seleccionó nada, limpiar la tabla
            tbody.innerHTML = '<tr><td colspan="3">No se ha seleccionado ningún filtro.</td></tr>';
            return;
        }
    
        // Renderizar los logs según el tipo seleccionado
        renderLogs(selectedType);
    });
    
});
