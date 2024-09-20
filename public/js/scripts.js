async function loadNavbar() {
    try {
        const response = await fetch('components/menu_navegacion.html');
        const data = await response.text();
        document.getElementById('menu-container').innerHTML = data;
    } catch (error) {
        console.log('Error al cargar el menú:', error);
    }
}

loadNavbar();

// Función para cargar y manejar los componentes de la tarjeta dinámicamente
function loadCards(dataArray) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas tarjetas

    dataArray.forEach(data => {
        fetch('components/card.html')
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Actualiza los datos de la tarjeta con información dinámica
                updateCardData(tempDiv, data);

                // Añade la tarjeta al contenedor
                cardsContainer.appendChild(tempDiv.firstChild);
            })
            .catch(error => {
                console.error('Error al cargar el componente card:', error);
            });
    });
}

// Delegación de eventos para manejar los dropdowns
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

// Función para actualizar los datos del componente card
function updateCardData(cardElement, data) {
    cardElement.querySelector('#title').textContent = data.title;
    cardElement.querySelector('#autors').textContent = data.autors;
    cardElement.querySelector('#published').textContent = data.published;
    cardElement.querySelector('#type').textContent = data.type;
    cardElement.querySelector('#description').textContent = data.description;
}



// Función para añadir event listeners a los botones de la tarjeta
function addEventListenersToCard(cardElement, data) {
    const viewBtn = cardElement.querySelector('[data-action="view"]');
    const editBtn = cardElement.querySelector('[data-action="edit"]');
    const deleteBtn = cardElement.querySelector('[data-action="delete"]');

    viewBtn.addEventListener('click', () => {
        window.location.href = `view/${data.id}`; // URL para ver detalles
    });
    editBtn.addEventListener('click', () => {
        window.location.href = `edit/${data.id}`; // URL para editar
    });
    deleteBtn.addEventListener('click', () => {
        window.location.href = `delete/${data.id}`; // URL para eliminar
    });
}

// Ejemplo de uso: suponiendo que tenemos una lista de documentos
document.addEventListener('DOMContentLoaded', () => {
    const exampleData = [
        {id: 1, title: 'Documento 1', autors: 'Autor 1', published: '2021-01-01', type: 'Libro', description: 'Descripción del documento 1'},
        {id: 2, title: 'Documento 2', autors: 'Autor 2', published: '2021-02-01', type: 'Artículo', description: 'Descripción del documento 2'},
        {id: 3, title: 'Documento 3', autors: 'Autor 3', published: '2021-03-01', type: 'Revista', description: 'Descripción del documento 3'},
        {id: 4, title: 'Documento 4', autors: 'Autor 4', published: '2021-04-01', type: 'Informe', description: 'Descripción del documento 4'},
        {id: 5, title: 'Documento 5', autors: 'Autor 5', published: '2021-05-01', type: 'Tesis', description: 'Descripción del documento 5'}
    ];

    loadCards(exampleData);
});
