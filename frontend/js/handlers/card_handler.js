import { handleDocumentDeletion } from './actions_handler.js'; 

export function loadCards(dataArray) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas tarjetas

    dataArray.forEach(data => {
        fetch('/components/card.html')
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Pasamos el documentType desde el objeto data
                updateCardData(tempDiv, data, data.documentType);
                addEventListenersToCard(tempDiv, data);
                cardsContainer.appendChild(tempDiv.firstChild);
            })
            .catch(error => {
                console.error('Error al cargar el componente card:', error);
            });
    });
}


function updateCardData(cardElement, data, documentType) {
    console.log('Datos recibidos para la tarjeta:', data); // Para verificar los datos recibidos

    // Ocultar todos los campos opcionales al inicio
    ['#editorial', '#numero_articulo', '#nombre_revista', '#editores', '#descripcion', '#observacion', '#msj_clave'].forEach(selector => {
        const element = cardElement.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Asignación de valores comunes a todos los documentos
    const fields = [
        { id: 'title', value: data.titulo || data.titulo_capitulo || 'Título no disponible' },
        { id: 'authors', value: data.autores ? data.autores.join(', ') : 'Autores no disponibles' },
        { id: 'published', value: data.anio_publicacion || data.anio_revista || 'Fecha no disponible' },
        //{ id: 'linkpdf', value: data.link_pdf || 'Enlace no disponible' }
    ];

    // Para las imágenes de portada
    const coverElement = cardElement.querySelector('#cover');
    if (coverElement) {
        coverElement.src = data.portada || 'https://placehold.com/600x400';
    }

    // Asignar los valores comunes
    fields.forEach(field => {
        const element = cardElement.querySelector(`#${field.id}`);
        if (element) {
            element.textContent = field.value;
        } else {
            console.error(`El elemento con id "${field.id}" no se encontró en card.html`);
        }
    });

    // Asignación específica según el tipo de documento usando `documentType`
    switch (documentType) {
        case 'libros':
            cardElement.querySelector('#type').textContent = 'Libro';
            cardElement.querySelector('#editorial').style.display = 'block';
            cardElement.querySelector('#editorial-text').textContent = data.editorial || 'Editorial no disponible';
            cardElement.querySelector('#descripcion').style.display = 'block';
            cardElement.querySelector('#description').textContent = data.abstract || 'Descripción no disponible';
            break;

        case 'articulos-revistas':
            cardElement.querySelector('#type').textContent = 'Artículo de Revista';
            //cardElement.querySelector('#numero_articulo').style.display = 'block';
            //cardElement.querySelector('#article-number').textContent = data.numero_articulo || 'Número de artículo no disponible';
            cardElement.querySelector('#nombre_revista').style.display = 'block';
            cardElement.querySelector('#revista').textContent = data.nombre_revista || 'Nombre de la revista no disponible';
            cardElement.querySelector('#editorial').style.display = 'block';
            cardElement.querySelector('#editorial-text').textContent = data.editorial || 'Editorial no disponible';
            cardElement.querySelector('#descripcion').style.display = 'block';
            cardElement.querySelector('#description').textContent = data.abstract || 'Descripción no disponible';
                   
            break;

        case 'capitulos-capitulos':
            cardElement.querySelector('#type').textContent = 'Capítulo de Libro';
            cardElement.querySelector('#editores').style.display = 'block';
            cardElement.querySelector('#editors').textContent = data.editores || 'Editores no disponibles';
            cardElement.querySelector('#editorial').style.display = 'block';
            cardElement.querySelector('#editorial-text').textContent = data.editorial || 'Editorial no disponible';
            break;

        case 'documentos-trabajo':
            cardElement.querySelector('#type').textContent = 'Documento de Trabajo';
            cardElement.querySelector('#descripcion').style.display = 'block';
            cardElement.querySelector('#description').textContent = data.abstract || 'Descripción no disponible';
            break;

        case 'ideas-reflexiones':
        case 'info-iisec':
            cardElement.querySelector('#type').textContent = documentType === 'ideas-reflexiones' ? 'Ideas y Reflexiones' : 'Info IISEC';
            cardElement.querySelector('#observacion').style.display = 'block';
            cardElement.querySelector('#observation').textContent = data.observaciones || 'Observación no disponible';
            break;

        case 'policies-briefs':
            cardElement.querySelector('#type').textContent = 'Policy and Briefs';
            cardElement.querySelector('#msj_clave').style.display = 'block';
            cardElement.querySelector('#msj_claves').textContent = data.mensaje_clave || 'Mensaje clave no disponible';
            break;

        default:
            console.error('Tipo de documento desconocido:', documentType);
            alert('El tipo de documento no está disponible.');
            return; // Detener si no hay tipo
    }
}

export function addEventListenersToCard(cardElement, data) {
    const viewBtn = cardElement.querySelector('[data-action="view"]');
    const editBtn = cardElement.querySelector('[data-action="edit"]');
    const deleteBtn = cardElement.querySelector('[data-action="delete"]');

    // Al hacer clic en "Ver Detalle"
    viewBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el comportamiento por defecto del enlace

        // Guardar el tipo de documento y el ID en el Session Storage
        sessionStorage.setItem('documentType', data.documentType);
        sessionStorage.setItem('documentId', data._id);

        // Redirigir a la página de vista detallada
        window.location.href = `/preview`;
    });

    editBtn.addEventListener('click', () => {
        // Guardar tipo de documento e ID en el Session Storage para la edición
        sessionStorage.setItem('documentType', data.documentType);
        sessionStorage.setItem('documentId', data._id);

        window.location.href = `/edit`;
    });

    deleteBtn.addEventListener('click', () => {
        // Guardar tipo de documento e ID en el Session Storage para la eliminación
        sessionStorage.setItem('documentType', data.documentType);
        sessionStorage.setItem('documentId', data._id);

        // Recuperar los valores desde el Session Storage
        const documentType = sessionStorage.getItem('documentType');
        const documentId = sessionStorage.getItem('documentId');

        // Llamar a la función para manejar la eliminación del documento
        handleDocumentDeletion(documentType, documentId, cardElement);

        // Elimina los datos del Session Storage si el documento se eliminó exitosamente
        sessionStorage.removeItem('documentType');
        sessionStorage.removeItem('documentId');

    });
}
