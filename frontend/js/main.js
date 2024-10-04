import { loadCards } from './handlers/card_handler.js';
import { getBooks, getArticles, getChapters, getWorkDocuments, getIdeasReflexiones, getInfoiisec, getPoliciesBriefs, getAllDocuments, getDocumentById } from './services/api_service.js';
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
                const libros = documentsData.libros.map(doc => ({ ...doc, documentType: 'libros' }));
                const articulosRevistas = documentsData.articulosRevistas.map(doc => ({ ...doc, documentType: 'articulos-revistas' }));
                const capitulosLibros = documentsData.capitulosLibros.map(doc => ({ ...doc, documentType: 'capitulos-libros' }));
                const documentosTrabajo = documentsData.documentosTrabajo.map(doc => ({ ...doc, documentType: 'documentos-trabajo' }));
                const ideasReflexiones = documentsData.ideasReflexiones.map(doc => ({ ...doc, documentType: 'ideas-reflexiones' }));
                const infoIISEC = documentsData.infoIISEC.map(doc => ({ ...doc, documentType: 'info-iisec' }));
                const policiesBriefs = documentsData.policiesBriefs.map(doc => ({ ...doc, documentType: 'policies-briefs' }));

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

                // Actualizar la lógica para el tipo seleccionado
                } else if (selectedType === 'libros') {
                    documentsData = await getBooks();
                    totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'libros' }));
                } else if (selectedType === 'articulos-revistas') {
                    documentsData = await getArticles();
                    totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'articulos-revistas' }));
                } else if (selectedType === 'capitulos-libros') {
                    documentsData = await getChapters();
                    totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'capitulos-libros' }));
                } else if (selectedType === 'documentos-trabajo') {
                    documentsData = await getWorkDocuments();
                    totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'documentos-trabajo' }));
                } else if (selectedType === 'ideas-reflexiones') {
                    documentsData = await getIdeasReflexiones();
                    totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'ideas-reflexiones' }));
                } else if (selectedType === 'info-iisec') {
                    documentsData = await getInfoiisec();
                    totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'info-iisec' }));
                } else if (selectedType === 'policies-briefs') {
                    documentsData = await getPoliciesBriefs();
                    totalDocuments = documentsData.map(doc => ({ ...doc, documentType: 'policies-briefs' }));
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


//Visualizacion de documento por id
document.addEventListener('DOMContentLoaded', () => {
    // Llamar a la función para cargar los detalles del documento automáticamente
    loadDocumentDetails();
});

export async function loadDocumentDetails() {
    // Obtener el tipo de documento y el ID desde el Session Storage
    const documentType = sessionStorage.getItem('documentType');
    const id = sessionStorage.getItem('documentId');

    if (id && documentType) {
        try {
            // Llamada al endpoint para obtener los datos del documento
            const documentData = await getDocumentById(documentType, id);
            console.log('Error al obtener los detalles del documento:', documentData);
            console.log('Error al obtener los detalles del documento:', documentType);
            displayDocumentDetails(documentData, documentType);
        } catch (error) {
            console.error('Error al obtener los detalles del documento:', error);
            console.log('Error al obtener los detalles del documento:', documentData);
            console.log('Error al obtener los detalles del documento:', documentType);
        }
    } else {
        console.error('No se encontraron parámetros válidos para el documento.', error);
    }
}


// Función para mostrar los detalles del documento y adaptar la vista de acuerdo al tipo
function displayDocumentDetails(data, documentType) {
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
    document.getElementById('title').textContent = data.titulo || data.titulo_capitulo || 'Título no disponible';
    document.getElementById('cover').src = data.portada || 'https://placehold.com/600x400';
    document.getElementById('type').textContent = tipodoc || 'Tipo de documento no disponible';
    document.getElementById('authors').textContent = data.autores ? data.autores.join(', ') : 'Autores no disponibles';
    document.getElementById('published').textContent = data.anio_publicacion || data.anio_revista || 'Fecha no disponible';

    // Mostrar campos específicos según el tipo de documento
    switch (documentType) {
        case 'libros':
            document.getElementById('editorial').style.display = 'block';
            document.getElementById('editorial-text').textContent = data.editorial || 'Editorial no disponible';
            document.getElementById('descripcion').style.display = 'block';
            document.getElementById('description').textContent = data.abstract || 'Descripción no disponible';
            break;

        case 'articulos-revistas':
            document.getElementById('numero_articulo').style.display = 'block';
            document.getElementById('article-number').textContent = data.numero_articulo || 'Número de artículo no disponible';
            document.getElementById('nombre_revista').style.display = 'block';
            document.getElementById('revista').textContent = data.nombre_revista || 'Nombre de la revista no disponible';
            document.getElementById('editorial').style.display = 'block';
            document.getElementById('editorial-text').textContent = data.editorial || 'Editorial no disponible';
            document.getElementById('descripcion').style.display = 'block';
            document.getElementById('description').textContent = data.abstract || 'Descripción no disponible';
            break;

        case 'capitulos-libros':
            document.getElementById('numero_identificacion').style.display = 'block';
            document.getElementById('numero_identificacion_value').textContent = data.numero_identificacion || 'Número de identificación no disponible';
            document.getElementById('titulo_capitulo').style.display = 'block';
            document.getElementById('titulo_capitulo_value').textContent = data.titulo_capitulo || 'Título del capítulo no disponible';
            document.getElementById('titulo_libro').style.display = 'block';
            document.getElementById('titulo_libro_value').textContent = data.titulo_libro || 'Título del libro no disponible';
            document.getElementById('editores').style.display = 'block';
            document.getElementById('editors').textContent = data.editores || 'Editores no disponibles';
            document.getElementById('editorial').style.display = 'block';
            document.getElementById('editorial-text').textContent = data.editorial || 'Editorial no disponible';
            document.getElementById('descripcion').style.display = 'block';
            document.getElementById('description').textContent = data.abstract || 'Descripción no disponible';
            break;

        case 'documentos-trabajo':
            document.getElementById('numero_identificacion').style.display = 'block';
            document.getElementById('numero_identificacion_value').textContent = data.numero_identificacion || 'Número de identificación no disponible';
            document.getElementById('descripcion').style.display = 'block';
            document.getElementById('description').textContent = data.abstract || 'Descripción no disponible';
            break;

        case 'ideas-reflexiones':
        case 'info-iisec':
            document.getElementById('observacion').style.display = 'block';
            document.getElementById('observation').textContent = data.observaciones || 'Observación no disponible';
            break;

        case 'policies-briefs':
            document.getElementById('msj_clave').style.display = 'block';
            document.getElementById('msj_claves').textContent = data.mensaje_clave || 'Mensaje clave no disponible';
            break;

        default:
            console.error('Tipo de documento desconocido:', documentType);
            alert('El tipo de documento no está disponible.');
            return; // Detener si no hay tipo
    }

    // Mostrar el PDF si está disponible
    // Actualizar el iframe según la fuente del documento
    const pdfIframe = document.getElementById('pdf-frame');
    const pdfDownloadLink = document.getElementById('pdf-download-link');

    if (data.link_pdf) {
        pdfIframe.src = data.link_pdf;
        pdfDownloadLink.href = data.link_pdf;
    } else if (data.direccion_archivo) {
        const nombreArchivo = data.direccion_archivo.split('\\').pop(); // Obtener el nombre del archivo
        const archivoUrl = `http://localhost:3000/file-handler/file/${nombreArchivo}`;
        pdfIframe.src = archivoUrl;
        pdfDownloadLink.href = archivoUrl;
    } else {
        pdfIframe.src = '';
        pdfDownloadLink.href = '#';
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