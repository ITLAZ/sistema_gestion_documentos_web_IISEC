import { loadCards } from './handlers/card_handler.js';
import { getBooks, getArticles, getChapters, getWorkDocuments, getIdeasReflexiones, getInfoiisec, getPoliciesBriefs } from './services/api_service.js';
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
            } else if (selectedType === 'work-documents') {
                documentsData = await getWorkDocuments();
            } else if (selectedType === 'ideas-reflex') {
                documentsData = await getIdeasReflexiones();
            } else if (selectedType === 'info-iisec') {
                documentsData = await getInfoiisec();
            } else if (selectedType === 'policy-briefs') {
                documentsData = await getPoliciesBriefs();
            }

            // Cargar las tarjetas con los datos obtenidos
            loadCards(documentsData, selectedType);

        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    });
});

//Busqueda 
document.addEventListener('DOMContentLoaded', () => {
    const typeSelector = document.getElementById('type-selector');
    const searchInput = document.getElementById('keywords');
    const searchButton = document.getElementById('search-button');

    async function performSearch(query, type) {
        let documentsData = [];

        try {
            // Buscar por tipo de archivo
            if (type === 'books') {
                const byTitle = await fetch(`http://localhost:3000/libros/titulo/${query}`).then(res => res.json());
                const byAuthor = await fetch(`http://localhost:3000/libros/autor/${query}`).then(res => res.json());
            
                // Combina los dos arrays
                documentsData = [...byTitle, ...byAuthor];
            
                // Filtrar documentos duplicados basados en el campo '_id'
                const uniqueDocuments = [];
                const seenIds = new Set();
            
                documentsData.forEach(doc => {
                    if (!seenIds.has(doc._id)) {
                        seenIds.add(doc._id);  // Añadir el ID al Set
                        uniqueDocuments.push(doc);  // Añadir el documento a la lista única
                    }
                });
            
                documentsData = uniqueDocuments; // Actualizar documentsData con los únicos
            } else if (type === 'articles') {
                const byTitle = await fetch(`http://localhost:3000/articulos-revistas/titulo/${query}`).then(res => res.json());
                const byAuthor = await fetch(`http://localhost:3000/articulos-revistas/autor/${query}`).then(res => res.json());
                
                documentsData = [...byTitle, ...byAuthor];
            
                // Filtrar documentos duplicados basados en el campo '_id'
                const uniqueDocuments = [];
                const seenIds = new Set();
            
                documentsData.forEach(doc => {
                    if (!seenIds.has(doc._id)) {
                        seenIds.add(doc._id);  
                        uniqueDocuments.push(doc);  
                    }
                });
            
                documentsData = uniqueDocuments; 
            } else if (type === 'chapters') {
                documentsData = await fetch(`http://localhost:3000/capitulos-libros/titulo/${query}`).then(res => res.json());
            } else if (type === 'work-documents') {
                documentsData = await fetch(`http://localhost:3000/documentos-trabajo/titulo/${query}`).then(res => res.json());
            }

            // Mostrar los resultados en las tarjetas
            if (documentsData.length > 0) {
                loadCards(documentsData);
            } else {
                alert('No se encontraron resultados para la búsqueda realizada.');
            }
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
            alert('Hubo un problema al realizar la búsqueda. Por favor, intenta de nuevo más tarde.');
        }
    }

    // Evento para el botón de búsqueda
    searchButton.addEventListener('click', () => {
        const selectedType = typeSelector.value; // Tipo de documento seleccionado
        const query = searchInput.value; // Palabra clave de búsqueda

        if (selectedType && query) {
            // Ejecutar la búsqueda si hay un tipo de archivo y una palabra clave
            performSearch(query, selectedType);
        } else {
            alert('Por favor, selecciona un tipo de archivo e ingresa una palabra clave.');
        }
    });
});

// Manejo de eventos globales para los dropdowns
document.addEventListener('click', function(event) {
    const dropBtn = event.target.closest('.drop-btn');
    if (dropBtn) {
        const dropdownContent = dropBtn.nextElementSibling; 
        const isVisible = dropdownContent.style.display === 'block';
        document.querySelectorAll('.dropdown-content').forEach(content => content.style.display = 'none'); 
        dropdownContent.style.display = isVisible ? 'none' : 'block'; 
        event.stopPropagation(); 
    } else {
        document.querySelectorAll('.dropdown-content').forEach(content => content.style.display = 'none');
    }
});

// Delegación de eventos para las opciones del menú dropdown
document.addEventListener('click', function(event) {
    const actionItem = event.target.closest('.dropdown-content a'); 
    if (actionItem) {
        event.preventDefault(); 
        const targetUrl = actionItem.getAttribute('href'); 
        window.location.href = targetUrl; 
    }
});