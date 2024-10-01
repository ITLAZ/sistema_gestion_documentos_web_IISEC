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


export async function getIdeasReflexiones() {
    try {
        const response = await fetch('http://localhost:3000/ideas-reflexiones');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener todas las ideas y reflexiones:', error);
        alert('Hubo un problema al obtener las ideas y reflexiones. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

export async function getInfoiisec() {
    try {
        const response = await fetch('http://localhost:3000/info-iisec');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener todos los info IISEC:', error);
        alert('Hubo un problema al obtener los infoIISEC. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

export async function getPoliciesBriefs() {
    try {
        const response = await fetch('http://localhost:3000/policies-briefs');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener todos los policies and briefs:', error);
        alert('Hubo un problema al obtener los policies and briefs. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}


export async function uploadBook(libroData, file) {
    const formData = new FormData();

    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    let autoresArray = libroData.autores;
    if (typeof autoresArray === 'string') {
        autoresArray = autoresArray.split(',').map(autor => autor.trim());
    }

    // Añadir los datos del libro al formData
    formData.append('portada', libroData.portada);
    formData.append('anio_publicacion', parseInt(libroData.anio_publicacion));
    formData.append('titulo', libroData.titulo);
    
    // Añadir cada autor al FormData si existe un array de autores
    if (Array.isArray(autoresArray)) {
        autoresArray.forEach((autor, index) => {
            formData.append(`autores[${index}]`, autor);
        });
    }
    formData.append('editorial', libroData.editorial);
    formData.append('abstract', libroData.abstract);
    formData.append('link_pdf', libroData.link_pdf);

    // Añadir el archivo PDF al formData
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/libros/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el libro:', error);
        alert('Hubo un problema al subir el libro. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}


export async function uploadBookWithoutFile(libroData) {
    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    let autoresArray = libroData.autores;
    if (typeof autoresArray === 'string') {
        autoresArray = autoresArray.split(',').map(autor => autor.trim());
    }

    // Añadir los datos del libro
    const nuevoLibro = {
        portada: libroData.portada,
        anio_publicacion: parseInt(libroData.anio_publicacion),
        titulo: libroData.titulo,
        autores: autoresArray,
        editorial: libroData.editorial,
        abstract: libroData.abstract,
        link_pdf: libroData.link_pdf
    };

    try {
        if (file) {
            // Si hay un archivo, consumir el endpoint de subir libro con archivo
            const result = await uploadBook(libroData, file);
            alert('Libro subido exitosamente con archivo!');
            console.log('Resultado:', result);
        } else {
            // Si no hay archivo, consumir otro endpoint
            const result = await uploadBookWithoutFile(libroData);
            alert('Libro subido exitosamente sin archivo!');
            console.log('Resultado:', result);
        }
    } catch (error) {
        console.error('Error al subir el libro:', error);
    }
}
