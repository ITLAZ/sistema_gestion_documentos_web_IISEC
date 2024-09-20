export async function getBooks() {
    try {
        const response = await fetch('http://localhost:3000/libros');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json(); // Retorna la respuesta como JSON
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        alert('Hubo un problema al obtener los libros. Por favor, intenta de nuevo más tarde.');
        throw error; // Lanza el error para que pueda ser manejado en otras partes si es necesario
    }
}

export async function getArticles() {
    try {
        const response = await fetch('http://localhost:3000/articulos-revistas');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        alert('Hubo un problema al obtener los artículos. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

export async function getChapters() {
    try {
        const response = await fetch('http://localhost:3000/capitulos-libros');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los capítulos:', error);
        alert('Hubo un problema al obtener los capítulos. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

export async function getAllDocuments() {
    try {
        const response = await fetch('/api/documents');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener todos los documentos:', error);
        alert('Hubo un problema al obtener los documentos. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}
