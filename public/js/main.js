import { loadCards } from './handlers/card_handler.js';
import { getBooks, getArticles, getChapters, getAllDocuments } from './services/api_service.js';
import { loadNavbar } from './services/navbar_service.js';

// Cargar el navbar inmediatamente
loadNavbar(); 

document.addEventListener('DOMContentLoaded', () => {
    const typeSelector = document.getElementById('type-selector');

    // Escuchar los cambios en el selector
    typeSelector.addEventListener('change', async () => {
        const selectedType = typeSelector.value;
        let documentsData = [];

        try {
            if (selectedType === 'books') {
                documentsData = await getBooks();
            } else if (selectedType === 'articles') {
                documentsData = await getArticles();
            } else if (selectedType === 'chapters') {
                documentsData = await getChapters();
            } else {
                documentsData = await getAllDocuments(); // Todos los documentos
            }

            // Cargar las tarjetas con los datos obtenidos
            loadCards(documentsData);

        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    });
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