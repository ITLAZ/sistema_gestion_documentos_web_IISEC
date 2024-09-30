export async function getBooks() {
    try {
        const response = await fetch('http://localhost:3000/libros');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json(); 
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        alert('Hubo un problema al obtener los libros. Por favor, intenta de nuevo más tarde.');
        throw error; 
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

export async function getWorkDocuments() {
    try {
        const response = await fetch('http://localhost:3000/documentos-trabajo');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener todos los documentos de trabajo:', error);
        alert('Hubo un problema al obtener los documentos de trabajo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}
