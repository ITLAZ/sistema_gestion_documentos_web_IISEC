import { handleDocumentDeletion, loadDocumentData } from './actions_handler.js'; 
import { fetchAndRenderDocuments } from '../main.js';

export function loadCards(dataArray, selectedType) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas tarjetas

    dataArray.forEach(data => {
        fetch('/components/card.html')
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Usar `_index` como `documentType` si está presente (especial para `all-types`)
                const documentType = data._index || selectedType;

                const documentData = {
                    ...data._source || data, 
                    _id: data._id, 
                    documentType 
                };

                // Llamar a `updateCardData` con `documentType`
                updateCardData(tempDiv, documentData, documentType);
                addEventListenersToCard(tempDiv, documentData, documentType);
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
    const title = data.titulo || data.titulo_capitulo || 'Título no disponible';
    const authors = data.autores ? data.autores.join(', ') : 'Autores no disponibles';
    const published = data.anio_publicacion || data.anio_revista || 'Fecha no disponible';

    // Asignar los valores comunes
    const fields = [
        { id: 'title', value: title },
        { id: 'authors', value: authors },
        { id: 'published', value: published }
    ];

    // Asignar los valores a los campos de la tarjeta
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
            cardElement.querySelector('#nombre_revista').style.display = 'block';
            cardElement.querySelector('#revista').textContent = data.nombre_revista || 'Nombre de la revista no disponible';
            cardElement.querySelector('#editorial').style.display = 'block';
            cardElement.querySelector('#editorial-text').textContent = data.editorial || 'Editorial no disponible';
            cardElement.querySelector('#descripcion').style.display = 'block';
            cardElement.querySelector('#description').textContent = data.abstract || 'Descripción no disponible';
            break;

        case 'capitulos-libros':
            cardElement.querySelector('#type').textContent = 'Capítulo de Libro';
            cardElement.querySelector('#editores').style.display = 'block';
            cardElement.querySelector('#editors').textContent = data.editores ? data.editores.join(', ') : 'Editores no disponibles';
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



export function addEventListenersToCard(cardElement, data, documentType) {
    const viewBtn = cardElement.querySelector('[data-action="view"]');
    const editBtn = cardElement.querySelector('[data-action="edit"]');
    const deleteBtn = cardElement.querySelector('[data-action="delete"]');


    console.log("Tipo documento: ", documentType);

    // Verificar si `documentType` está definido
    if (!documentType) {
        console.error('Tipo de documento no definido:', data);
        return;
    }

    const documentId = data._id;

    // Evento para "Ver Detalles"
    viewBtn.addEventListener('click', (event) => {
        event.preventDefault(); 

        console.log('Tipo de documento al ver detalles:', documentType);
        console.log('ID del documento al ver detalles:', documentId);

        // Guardar solo `documentType` y `documentId` para usarlos en la vista de detalles
        sessionStorage.setItem('documentType', documentType);
        sessionStorage.setItem('documentId', documentId);

        // Redirigir a la página de vista detallada
        window.location.href = `/preview`;
    });

    // Evento para "Editar"
    editBtn.addEventListener('click', () => {
        sessionStorage.setItem('documentType', documentType);
        sessionStorage.setItem('documentId', documentId);

        console.log('Tipo de documento al editar:', documentType);
        console.log('ID del documento al editar:', documentId);

        window.location.href = '/edits';
    });

    // Evento para "Eliminar"
    deleteBtn.addEventListener('click', () => {
        console.log('Tipo de documento al eliminar:', documentType);
        console.log('ID del documento al eliminar:', documentId);

        handleDocumentDeletion(documentType, documentId, cardElement)
            .then(async () => {
                // Usa una función async para poder utilizar await aquí
                await fetchAndRenderDocuments(); 
            })
            .catch((error) => {
                console.error('Error al eliminar el documento:', error);
            })
            .finally(() => {
                // Limpia los datos del `sessionStorage` después de la eliminación
                sessionStorage.removeItem('documentType');
                sessionStorage.removeItem('documentId');
            });
    });

}

