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
    console.log('Datos recibidos para la tarjeta:', data); // Para verificar los datos recibidos

    // Asignación del tipo basado en las propiedades
    if (!data.tipo) {
        if (data.portada && data.titulo && data.autores && data.anio_publicacion) {
            data.tipo = 'libro';
        } else if (data.numero_articulo && data.nombre_revista) {
            data.tipo = 'artículo';
        } else if (data.titulo_capitulo && data.titulo_libro) {
            data.tipo = 'capítulo';
        } else {
            alert('El tipo de documento no está disponible.');
            console.error('El tipo de documento no está presente en los datos:', data);
            return; // Detener si no hay tipo
        }
    }

    const fields = [
        { id: 'title', value: data.titulo || 'Título no disponible' },
        { id: 'autors', value: data.autores ? data.autores.join(', ') : 'Autores no disponibles' },
        { id: 'published', value: data.anio_publicacion || data.anio_revista || 'Fecha no disponible' },
        { id: 'editorial', value: data.editorial || 'Editorial no disponible' },
        { id: 'description', value: data.abstract || 'Descripción no disponible' },
        { id: 'cover', value: data.portada || 'https://placehold.com/600x400', isImage: true }
    ];

    fields.forEach(field => {
        const element = cardElement.querySelector(`#${field.id}`);
        if (element) {
            if (field.isImage) {
                element.src = field.value; 
            } else {
                element.textContent = field.value;
            }
        } else {
            console.error(`El elemento con id "${field.id}" no se encontró en card.html`);
        }
    });

    // Muestra u oculta campos según el tipo de documento
    if (data.tipo === 'libro') {
        cardElement.querySelector('#type').textContent = 'Libro';
        cardElement.querySelector('#nombre_revista').style.display = 'none';
        cardElement.querySelector('#numero_articulo').style.display = 'none';
        cardElement.querySelector('#titulo_libro').style.display = 'none';
    } else if (data.tipo === 'artículo') {
        cardElement.querySelector('#type').textContent = 'Artículo';
        cardElement.querySelector('#nombre_revista').style.display = 'block';
        cardElement.querySelector('#nombre_revista span').textContent = data.nombre_revista;
        cardElement.querySelector('#numero_articulo').style.display = 'block';
        cardElement.querySelector('#numero_articulo span').textContent = data.numero_articulo;
        cardElement.querySelector('#titulo_libro').style.display = 'none';
    } else if (data.tipo === 'capítulo') {
        cardElement.querySelector('#type').textContent = 'Capítulo';
        cardElement.querySelector('#titulo_libro').style.display = 'block';
        cardElement.querySelector('#titulo_libro span').textContent = data.titulo_libro;
        cardElement.querySelector('#nombre_revista').style.display = 'none';
        cardElement.querySelector('#numero_articulo').style.display = 'none';
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
