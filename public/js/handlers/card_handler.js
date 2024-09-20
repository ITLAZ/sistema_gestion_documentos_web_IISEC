import { getDocuments } from '../services/api_service.js';

export function loadCards(dataArray) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas tarjetas

    dataArray.forEach(data => {
        fetch('/components/card.html')
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                updateCardData(tempDiv, data);
                cardsContainer.appendChild(tempDiv.firstChild);
            })
            .catch(error => {
                console.error('Error al cargar el componente card:', error);
            });
    });
}

function updateCardData(cardElement, data) {
    cardElement.querySelector('#title').textContent = data.title;
    cardElement.querySelector('#autors').textContent = data.autors;
    cardElement.querySelector('#published').textContent = data.published;
    cardElement.querySelector('#type').textContent = data.type;
    cardElement.querySelector('#description').textContent = data.description;
}