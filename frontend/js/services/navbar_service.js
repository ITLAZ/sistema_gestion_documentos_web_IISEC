export async function loadNavbar() {
    try {
        const response = await fetch('/components/menu_navegacion.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        document.getElementById('menu-container').innerHTML = data;
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}
