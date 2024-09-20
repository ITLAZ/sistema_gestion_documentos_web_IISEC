import { loadCards } from './handlers/card_handler.js';
import { getDocuments } from './services/api_service.js';
import { loadNavbar } from './services/navbar_service.js'; // Para cargar el menú de navegación

// Cargar el navbar inmediatamente
loadNavbar(); 

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener los documentos del backend
        const documentsData = await getDocuments();
        
        // Cargar las tarjetas con los datos del backend
        loadCards(documentsData);

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
