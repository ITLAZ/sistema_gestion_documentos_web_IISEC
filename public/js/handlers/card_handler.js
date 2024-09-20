import { getBooks } from '../services/api_service.js'; //para futuro hacer el consumo

export function loadCards(dataArray) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas tarjetas

    dataArray.forEach(data => {
        fetch('/components/card.html')
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                updateCardData(tempDiv, data); // Actualiza los datos de la tarjeta
                addEventListenersToCard(tempDiv, data); // Añade los eventos a los botones
                cardsContainer.appendChild(tempDiv.firstChild);
            })
            .catch(error => {
                console.error('Error al cargar el componente card:', error);
            });
    });
}

function updateCardData(cardElement, data) {
    const titleElement = cardElement.querySelector('#title');
    const autorsElement = cardElement.querySelector('#autors');
    const publishedElement = cardElement.querySelector('#published');
    const typeElement = cardElement.querySelector('#type');
    const descriptionElement = cardElement.querySelector('#description');
    const coverElement = cardElement.querySelector('#cover');

    // Verificar que los elementos existen antes de actualizar
    if (titleElement) {
        titleElement.textContent = data.titulo;
    } else {
        console.error('El elemento con id "title" no se encontró en card.html');
    }

    if (autorsElement) {
        autorsElement.textContent = data.autores.join(', '); 
    } else {
        console.error('El elemento con id "autors" no se encontró en card.html');
    }

    if (publishedElement) {
        publishedElement.textContent = data.anio_publicacion;
    } else {
        console.error('El elemento con id "published" no se encontró en card.html');
    }

    if (typeElement) {
        typeElement.textContent = 'Libro'; 
    } else {
        console.error('El elemento con id "type" no se encontró en card.html');
    }

    if (descriptionElement) {
        descriptionElement.textContent = data.abstract;
    } else {
        console.error('El elemento con id "description" no se encontró en card.html');
    }

    if (coverElement) {
        coverElement.src = data.portada;
    } else {
        console.error('El elemento con id "cover" no se encontró en card.html');
    }
}

export function addEventListenersToCard(cardElement, data) {
    const viewBtn = cardElement.querySelector('[data-action="view"]');
    const editBtn = cardElement.querySelector('[data-action="edit"]');
    const deleteBtn = cardElement.querySelector('[data-action="delete"]');

    viewBtn.addEventListener('click', () => {
        window.location.href = `view/${data._id}`; 
    });

    editBtn.addEventListener('click', () => {
        window.location.href = `edit/${data._id}`; 
    });

    deleteBtn.addEventListener('click', () => {
        window.location.href = `delete/${data._id}`; 
    });
}
