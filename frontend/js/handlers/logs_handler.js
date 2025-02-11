import * as Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';
import { fetchLogs } from '../services/logs_services.js';

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('tbody');
    const typeSelector = document.getElementById('type-selector-logs');
    const thead = document.querySelector('thead');

    // Función para renderizar los logs en la tabla
    async function renderLogs(logType) {
        if (!logType || logType === "null") {
            tbody.innerHTML = '<tr><td colspan="3">Seleccione un tipo de log para cargar</td></tr>';
            return;
        }

        tbody.innerHTML = '<tr><td colspan="3">Cargando logs...</td></tr>';

        try {
            // Obtener los logs desde el backend
            const logs = await fetchLogs(logType);
            console.log("RESPUESTA LOG", logs);

            // Limpiar la tabla antes de renderizar
            tbody.innerHTML = '';

            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3">No se encontraron logs.</td></tr>';
                return;
            }

            // Modificar encabezado si el log es de tipo 'documento'
            if (logType === 'documento') {
                thead.innerHTML = `
                    <tr>
                        <th>Usuario</th>
                        <th>Documento</th>
                        <th>Acción</th>
                        <th>Fecha</th>
                    </tr>
                `;
            } else {
                thead.innerHTML = `
                    <tr>
                        <th>Usuario</th>
                        <th>Acción</th>
                        <th>Fecha</th>
                    </tr>
                `;
            }

            logs.forEach((log) => {
                const tr = document.createElement('tr');

                // Crear y llenar celdas
                const usuarioTd = document.createElement('td');
                usuarioTd.textContent = log.id_usuario;

                const accionTd = document.createElement('td');
                accionTd.textContent = log.accion;

                const fechaTd = document.createElement('td');
                fechaTd.textContent = new Date(log.fecha).toLocaleString(); // Formatear la fecha

                tr.appendChild(usuarioTd);

                // Si el log es de tipo 'documento', agregar la columna extra con enlace clickeable
                if (logType === 'documento') {
                    const documentoTd = document.createElement('td');

                    if (log.id_documento) {
                        const link = document.createElement('a');
                        link.href = "#"; // Se evita la navegación directa
                        link.textContent = log.id_documento;
                        link.style.color = "blue";
                        link.style.cursor = "pointer";

                        // Evento para manejar el clic en el documento
                        link.addEventListener('click', (event) => {
                            event.preventDefault(); 

                            console.log('Tipo de documento al ver detalles:', log.tipo);
                            console.log('ID del documento al ver detalles:', log.id_documento);

                            // Guardar `documentType` y `documentId` en sessionStorage
                            sessionStorage.setItem('documentType', log.tipo);
                            sessionStorage.setItem('documentId', log.id_documento);

                            // Redirigir a la página de vista detallada
                            window.location.href = `/preview`;
                        });

                        documentoTd.appendChild(link);
                    } else {
                        documentoTd.textContent = 'N/A';
                    }

                    tr.appendChild(documentoTd);
                }

                tr.appendChild(accionTd);
                tr.appendChild(fechaTd);

                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error al renderizar los logs:', error);
            tbody.innerHTML = '<tr><td colspan="3">Error al cargar los logs. Intente nuevamente.</td></tr>';
        }
    }

    // Escuchar cambios en el combobox y actualizar la tabla
    typeSelector.addEventListener('change', () => {
        const selectedType = typeSelector.value;

        if (!selectedType) {
            tbody.innerHTML = '<tr><td colspan="3">No se ha seleccionado ningún filtro.</td></tr>';
            return;
        }

        renderLogs(selectedType);
    });

    renderLogs('');
});
