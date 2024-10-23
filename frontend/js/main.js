import { loadCards } from './handlers/card_handler.js';
import {  getAllDocuments, getDocumentById, getDocumentsByType } from './services/api_service.js';
import { loadNavbar } from './services/navbar_service.js';


// Verificar si el usuario está autenticado
(function verificarAutenticacion() {
    // Función para obtener una cookie por su nombre
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const idUsuario = getCookie('id_usuario');
    if (!idUsuario) {
        // Redirigir al login si no hay id_usuario en las cookies
        window.location.href = '/login';
    }
})();

// Cargar el navbar inmediatamente
loadNavbar(); 

// Variables para la paginación y el tipo seleccionado
let currentPage = 1; // Número de página actual
const itemsPerPage = 10; // Cantidad de elementos por página
let selectedType = '';

document.addEventListener('DOMContentLoaded', () => {
    const typeSelector = document.getElementById('type-selector');

    typeSelector.addEventListener('change', async () => {
        selectedType = typeSelector.value;
        console.log("tipo seleccionado:", selectedType);
        currentPage = 1; // Reiniciar a la primera página
        await fetchAndRenderDocuments();
    });

    document.getElementById('prev-page').addEventListener('click', prevPage);
    document.getElementById('next-page').addEventListener('click', nextPage);
});

// Función para obtener y renderizar documentos
export async function fetchAndRenderDocuments() {
    try {
        let documentsData;
        if (selectedType === 'all') {
            documentsData = await getAllDocuments('', currentPage, itemsPerPage);
        } else {
            documentsData = await getDocumentsByType(selectedType, currentPage, itemsPerPage);
        }

        console.log("Tipo seleccionado:", selectedType);
        console.log('Respuesta del backend:', documentsData);

        const data = documentsData.data || documentsData;

        // Verificar si la respuesta es un array vacío.
        if (Array.isArray(data) && data.length === 0) {
            // No hay resultados, ocultar los controles de paginación y mostrar un mensaje.
            document.getElementById('pagination-controls').style.display = 'none';
            document.getElementById('page-info').innerText = 'No se encontraron resultados.';
            loadCards([], selectedType); // Limpia las tarjetas mostradas.
            return;
        }

        // Si hay datos, mostrar las tarjetas y los controles de paginación.
        loadCards(data, selectedType);

        // Mostrar los controles de paginación.
        document.getElementById('pagination-controls').style.display = 'block';

        // Mostrar u ocultar el botón "Siguiente" dependiendo de si hay más elementos que el tamaño de la página.
        const nextPageButton = document.getElementById('next-page');
        nextPageButton.style.display = data.length < itemsPerPage ? 'none' : 'inline-block';

        // Mostrar u ocultar el botón "Anterior" si estamos en la primera página.
        const prevPageButton = document.getElementById('prev-page');
        prevPageButton.style.display = currentPage === 1 ? 'none' : 'inline-block';

        // Actualizar la información de la página actual.
        document.getElementById('page-info').innerText = `Página ${currentPage}`;

    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
    }
}

// Función para ir a la página siguiente
function nextPage() {
    currentPage++;
    fetchAndRenderDocuments();
}

// Función para ir a la página anterior
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchAndRenderDocuments();
    }
}



     
//Visualizacion de documento por id
document.addEventListener('DOMContentLoaded', () => {
    loadDocumentDetails();
});

export async function loadDocumentDetails() {
    const documentType = sessionStorage.getItem('documentType');
    const id = sessionStorage.getItem('documentId');

    let documentData;


    console.log("Tipo de documento recuperado:", documentType);
    console.log("ID del documento recuperado:", id);

    if (id && documentType) {
        try {
            documentData = await getDocumentById(documentType, id);
            console.log('Detalles del documento recibidos del backend:', documentData);

            documentData = documentData._source || documentData;

        } catch (error) {
            console.error('Error al obtener los detalles del documento:', error);
            return;
        }
    }

    if (documentData) {
        displayDocumentDetails(documentData, documentType);
    } else {
        console.error('No se encontraron parámetros válidos para el documento.');
    }
}



// Función para mostrar los detalles del documento y adaptar la vista de acuerdo al tipo
function displayDocumentDetails(data, documentType) {
    console.log('Detalles del documento recibidos:', data);
    console.log('Tipo de documento:', documentType);

    // Si el documento proviene de `all-types`, extraer el contenido de `_source`
    const documentData = data._source || data;

    // Ocultar todos los campos opcionales al inicio
    [
        '#cover-info', '#editorial', '#numero_articulo', '#nombre_revista',
        '#numero_identificacion', '#titulo_capitulo', '#titulo_libro',
        '#descripcion', '#observacion', '#msj_clave'
    ].forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Asignar el tipo de documento según el valor de documentType
    let tipodoc = '';

    switch (documentType) {
        case 'libros':
            tipodoc = 'Libros';
            break;
        case 'articulos-revistas':
            tipodoc = 'Artículo de Revista';
            break;
        case 'capitulos-libros':
            tipodoc = 'Capítulo de Libro';
            break;
        case 'documentos-trabajo':
            tipodoc = 'Documento de Trabajo';
            break;
        case 'ideas-reflexiones':
            tipodoc = 'Ideas y Reflexiones';
            break;
        case 'info-iisec':
            tipodoc = 'Info IISEC';
            break;
        case 'policies-briefs':
            tipodoc = 'Policy Briefs';
            break;
        default:
            console.error('Tipo de documento desconocido:', documentType);
            return; // Detener si no hay tipo
    }

    // Mostrar campos comunes
    document.getElementById('title').textContent = documentData.titulo || documentData.titulo_capitulo || 'Título no disponible';
    document.getElementById('cover').src = documentData.portada || 'https://placehold.com/600x400';
    document.getElementById('type').textContent = tipodoc || 'Tipo de documento no disponible';
    document.getElementById('authors').textContent = documentData.autores ? documentData.autores.join(', ') : 'Autores no disponibles';
    document.getElementById('published').textContent = documentData.anio_publicacion || documentData.anio_revista || 'Fecha no disponible';

    // Mostrar campos específicos según el tipo de documento
    switch (documentType) {
        case 'libros':
            document.getElementById('editorial').style.display = 'block';
            document.getElementById('editorial-text').textContent = documentData.editorial || 'Editorial no disponible';
            document.getElementById('descripcion').style.display = 'block';
            document.getElementById('description').textContent = documentData.abstract || 'Descripción no disponible';
            break;

        case 'articulos-revistas':
            document.getElementById('numero_articulo').style.display = 'block';
            document.getElementById('article-number').textContent = documentData.numero_articulo || 'Número de artículo no disponible';
            document.getElementById('nombre_revista').style.display = 'block';
            document.getElementById('revista').textContent = documentData.nombre_revista || 'Nombre de la revista no disponible';
            document.getElementById('editorial').style.display = 'block';
            document.getElementById('editorial-text').textContent = documentData.editorial || 'Editorial no disponible';
            document.getElementById('descripcion').style.display = 'block';
            document.getElementById('description').textContent = documentData.abstract || 'Descripción no disponible';
            break;

        case 'capitulos-libros':
            document.getElementById('numero_identificacion').style.display = 'block';
            document.getElementById('numero_identificacion_value').textContent = documentData.numero_identificacion || 'Número de identificación no disponible';
            document.getElementById('titulo_capitulo').style.display = 'block';
            document.getElementById('titulo_capitulo_value').textContent = documentData.titulo_capitulo || 'Título del capítulo no disponible';
            document.getElementById('titulo_libro').style.display = 'block';
            document.getElementById('titulo_libro_value').textContent = documentData.titulo_libro || 'Título del libro no disponible';
            document.getElementById('editores').style.display = 'block';
            document.getElementById('editores_value').textContent = documentData.editores ? documentData.editores.join(', ') : 'Editores no disponibles';
            document.getElementById('editorial').style.display = 'block';
            document.getElementById('editorial-text').textContent = documentData.editorial || 'Editorial no disponible';
            break;

        case 'documentos-trabajo':
            document.getElementById('numero_identificacion').style.display = 'block';
            document.getElementById('numero_identificacion_value').textContent = documentData.numero_identificacion || 'Número de identificación no disponible';
            document.getElementById('descripcion').style.display = 'block';
            document.getElementById('description').textContent = documentData.abstract || 'Descripción no disponible';
            break;

        case 'ideas-reflexiones':
        case 'info-iisec':
            document.getElementById('observacion').style.display = 'block';
            document.getElementById('observation').textContent = documentData.observaciones || 'Observación no disponible';
            break;

        case 'policies-briefs':
            document.getElementById('msj_clave').style.display = 'block';
            document.getElementById('msj_claves').textContent = documentData.mensaje_clave || 'Mensaje clave no disponible';
            break;

        default:
            console.error('Tipo de documento desconocido:', documentType);
            alert('El tipo de documento no está disponible.');
            return; // Detener si no hay tipo
    }

    // Mostrar el PDF si está disponible
    const pdfIframe = document.getElementById('pdf-frame');
    const pdfDownloadLink = document.getElementById('pdf-download-link');

    if (documentData.link_pdf && documentData.link_pdf.trim().toLowerCase().endsWith('.pdf')) {
        pdfIframe.src = documentData.link_pdf;
        pdfDownloadLink.href = documentData.link_pdf;
        pdfIframe.style.display = 'block';
    } else if (documentData.direccion_archivo) {
        const nombreArchivo = documentData.direccion_archivo.split('\\').pop();
        const archivoUrl = `http://localhost:3000/file-handler/file/${nombreArchivo}`;
        pdfIframe.src = archivoUrl;
        pdfDownloadLink.href = archivoUrl;
        pdfIframe.style.display = 'block';
    } else {
        pdfIframe.style.display = 'none';
        const pdfPreviewContainer = document.querySelector('.pdf-preview');

        const messageContainer = document.createElement('div');
        messageContainer.innerHTML = `
            <p>Lo sentimos, el documento no se encuentra actualmente disponible.</p>
            <p>Puede ingresar al siguiente link para encontrarlo: <a href="${documentData.link_pdf || '#'}" target="_blank">${documentData.link_pdf || 'No disponible'}</a></p>
        `;

        pdfPreviewContainer.appendChild(messageContainer);
    }
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