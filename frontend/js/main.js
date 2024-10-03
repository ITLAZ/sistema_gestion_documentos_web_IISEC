import { loadCards } from './handlers/card_handler.js';
import { getBooks, getArticles, getChapters, getWorkDocuments, getIdeasReflexiones, getInfoiisec, getPoliciesBriefs, getAllDocuments } from './services/api_service.js';
import { loadNavbar } from './services/navbar_service.js';

// Cargar el navbar inmediatamente
loadNavbar(); 

// Variables para la paginación y el tipo seleccionado
let currentPage = 1;
const itemsPerPage = 30;
let totalDocuments = [];
let selectedType = '';  // Variable global para almacenar el tipo de documento seleccionado

document.addEventListener('DOMContentLoaded', () => {
    const typeSelector = document.getElementById('type-selector');

    // Escuchar los cambios en el selector
    typeSelector.addEventListener('change', async () => {
        selectedType = typeSelector.value;

        try {
            let documentsData;
            if (selectedType === 'all') {
                documentsData = await getAllDocuments();

                // Agregar documentType a cada elemento dependiendo de su origen
                const libros = documentsData.libros.map(doc => ({ ...doc, documentType: 'books' }));
                const articulosRevistas = documentsData.articulosRevistas.map(doc => ({ ...doc, documentType: 'articles' }));
                const capitulosLibros = documentsData.capitulosLibros.map(doc => ({ ...doc, documentType: 'chapters' }));
                const documentosTrabajo = documentsData.documentosTrabajo.map(doc => ({ ...doc, documentType: 'work-documents' }));
                const ideasReflexiones = documentsData.ideasReflexiones.map(doc => ({ ...doc, documentType: 'ideas-reflex' }));
                const policiesBriefs = documentsData.policiesBriefs.map(doc => ({ ...doc, documentType: 'policy-briefs' }));
                const infoIISEC = documentsData.infoIISEC.map(doc => ({ ...doc, documentType: 'info-iisec' }));

                // Combinar todos los documentos en un solo array
                totalDocuments = [
                    ...libros,
                    ...articulosRevistas,
                    ...capitulosLibros,
                    ...documentosTrabajo,
                    ...ideasReflexiones,
                    ...policiesBriefs,
                    ...infoIISEC
                ];

            } else if (selectedType === 'books') {
                documentsData = await getBooks();
                totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'books' }));
            } else if (selectedType === 'articles') {
                documentsData = await getArticles();
                totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'articles' }));
            } else if (selectedType === 'chapters') {
                documentsData = await getChapters();
                totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'chapters' }));
            } else if (selectedType === 'work-documents') {
                documentsData = await getWorkDocuments();
                totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'work-documents' }));
            } else if (selectedType === 'ideas-reflex') {
                documentsData = await getIdeasReflexiones();
                totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'ideas-reflex' }));
            } else if (selectedType === 'info-iisec') {
                documentsData = await getInfoiisec();
                totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'info-iisec' }));
            } else if (selectedType === 'policy-briefs') {
                documentsData = await getPoliciesBriefs();
                totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'policy-briefs' }));
            }


            currentPage = 1; // Reiniciar a la primera página
            renderPage();
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
        }
    });

    // Asignar eventos a los botones de paginación
    document.getElementById('prev-page').addEventListener('click', prevPage);
    document.getElementById('next-page').addEventListener('click', nextPage);
});

// Función para ir a la página siguiente
function nextPage() {
    if (currentPage * itemsPerPage < totalDocuments.length) {
        currentPage++;
        renderPage();
    }
}

// Función para ir a la página anterior
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
}

// Función para renderizar la página actual
function renderPage() {
    const totalPages = Math.ceil(totalDocuments.length / itemsPerPage);
    const paginationControls = document.getElementById('pagination-controls');

    // Mostrar u ocultar los controles de paginación según el número de páginas
    if (totalPages > 1) {
        paginationControls.style.display = 'block'; // Mostrar los botones si hay más de una página
    } else {
        paginationControls.style.display = 'none'; // Ocultar los botones si solo hay una página
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const documentsToShow = totalDocuments.slice(start, end);

    // Actualizar las tarjetas con los datos de la página actual
    loadCards(documentsToShow, selectedType);

    // Actualizar la información de paginación
    document.getElementById('page-info').innerText = `Página ${currentPage} de ${totalPages}`;

    // Desactivar botones si estamos en el límite
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}




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