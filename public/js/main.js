import { loadCards } from './handlers/card_handler.js';
import { getDocuments } from './services/api_service.js';
import { loadNavbar } from './services/navbar_service.js'; // Para cargar el menú de navegación

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar el menú de navegación
        await loadNavbar();

        // Aquí usamos datos de ejemplo
        const exampleData = [
            { id: 1, title: 'Documento 1', autors: 'Autor 1', published: '2021-01-01', type: 'Libro', description: 'Descripción del documento 1' },
            { id: 2, title: 'Documento 2', autors: 'Autor 2', published: '2021-02-01', type: 'Artículo', description: 'Descripción del documento 2' },
            { id: 3, title: 'Documento 3', autors: 'Autor 3', published: '2021-03-01', type: 'Revista', description: 'Descripción del documento 3' },
            { id: 4, title: 'Documento 4', autors: 'Autor 4', published: '2021-04-01', type: 'Informe', description: 'Descripción del documento 4' },
            { id: 5, title: 'Documento 5', autors: 'Autor 5', published: '2021-05-01', type: 'Tesis', description: 'Descripción del documento 5' }
        ];

        // Cargar las tarjetas con los datos de ejemplo
        loadCards(exampleData);

    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
});

// Manejo de eventos globales para los dropdowns
document.addEventListener('click', function(event) {
    const dropBtn = event.target.closest('.drop-btn');
    if (dropBtn) {
        const dropdownContent = dropBtn.nextElementSibling; // Asumiendo que el dropdown-content sigue al botón
        const isVisible = dropdownContent.style.display === 'block';
        document.querySelectorAll('.dropdown-content').forEach(content => content.style.display = 'none'); // Cierra otros dropdowns
        dropdownContent.style.display = isVisible ? 'none' : 'block'; // Alterna el estado del dropdown actual
        event.stopPropagation(); // Evita que el clic se propague
    } else {
        // Cierra todos los dropdowns si se hace clic fuera de ellos
        document.querySelectorAll('.dropdown-content').forEach(content => content.style.display = 'none');
    }
});

// Delegación de eventos para las opciones del menú dropdown
document.addEventListener('click', function(event) {
    const actionItem = event.target.closest('.dropdown-content a'); // Ajusta el selector según tu estructura
    if (actionItem) {
        event.preventDefault(); // Evita el comportamiento por defecto del enlace
        const targetUrl = actionItem.getAttribute('href'); // Obtén la URL del atributo href
        window.location.href = targetUrl; // Redirige a la URL
    }
});
