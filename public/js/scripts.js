function loadNavbar() {
    fetch('components/MenuNavegacion.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('menu-container').innerHTML = data;
            })
            .catch(error => console.log('Error al cargar el menú:', error));
}

document.addEventListener('DOMContentLoaded', loadNavbar);