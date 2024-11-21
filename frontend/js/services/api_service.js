
export async function getDocumentsByType(documentType, page, size, sortBy, sortOrder) {
    try {
        // Construir la URL usando el tipo de documento
        const url = `http://localhost:3000/${documentType}?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // Retornar los datos en formato JSON
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener los documentos de tipo ${documentType}:`, error);
        alert(`Hubo un problema al obtener los documentos de tipo ${documentType}. Por favor, intenta de nuevo más tarde.`);
        throw error;
    }
}

export async function getAllDocuments(query = '', page, size, sortBy = 'anio_publicacion', sortOrder= 'asc') {
    try {
        // Construir la URL con los parámetros de consulta
        const url = new URL('http://localhost:3000/all-types/all');
        url.searchParams.append('query', query);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);
        url.searchParams.append('sortBy', sortBy);
        url.searchParams.append('sortOrder', sortOrder);

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener todos los documentos:', error);
        alert('Hubo un problema al obtener todos los documentos. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}



export async function getDocumentById(documentType, id) {    
    try {        
        const url = `http://localhost:3000/${documentType}/id/${id}`;
        const response = await fetch(url);
        
        // Verifica si la respuesta es válida antes de intentar analizar el JSON
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
       
        const responseData = await response.json(); 
        console.log('Datos recibidos:', responseData);
        
        if (responseData) {
            console.log('Respuesta del servidor:', responseData); // Para depuración
            return responseData;
        } else {
            throw new Error('La respuesta está vacía.');
        }
    } catch (error) {
        console.error(`Error al obtener los detalles del documento (${documentType}) (${id}):`, error);
        throw error;
    }
}



export async function deleteDocumentById(documentType, id, usuarioId) {
    try {
        const response = await fetch(`http://localhost:3000/${documentType}/eliminar-logico/${id}`, {
            method: 'PUT',
            headers: {
                'x-usuario-id': usuarioId,  // Agregar el ID de usuario en el header
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al eliminar el documento (${documentType}):`, error);
        alert(`Hubo un problema al eliminar el documento (${documentType}). Por favor, intenta de nuevo más tarde.`);
        throw error;
    }
}


export async function updateDocumentById(documentType, id, updatedData, usuarioId) {
    try {
        const response = await fetch(`http://localhost:3000/${documentType}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-usuario-id': usuarioId,  // Agregar el ID de usuario en el header
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al editar el documento (${documentType}):`, error);
        alert(`Hubo un problema al editar el documento (${documentType}). Por favor, intenta de nuevo más tarde.`);
        throw error;
    }
}


export async function searchDocuments(documentType, query, page = 1, size = 10, anio_publicacion = '', autores = '', sortBy = 'anio_publicacion', sortOrder) {
    try {
        const url = new URL(`http://localhost:3000/${documentType}/search`);
        const params = {
            query,
            page,
            size,
            anio_publicacion,
            autores,
            sortBy,
            sortOrder
        };

        // Agregar los parámetros a la URL
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.append(key, params[key]);
            }
        });

        // Realizar la solicitud GET utilizando fetch
        const response = await fetch(url);

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Obtener los datos en formato JSON
        const data = await response.json();

        // Imprimir la respuesta para verificar los datos
        console.log('Respuesta del backend:', data);

        return data;
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
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
    const autoresArray = Array.isArray(libroData.autores) ? libroData.autores : libroData.autores.split(',').map(autor => autor.trim());

    // Añadir los datos del libro
    const nuevoLibro = {
        portada: libroData.portada,
        anio_publicacion: parseInt(libroData.anio_publicacion, 10),
        titulo: libroData.titulo,
        autores: autoresArray,
        editorial: libroData.editorial,
        abstract: libroData.abstract,
        link_pdf: libroData.link_pdf
    };

    console.log('Datos en JSON que se enviarán:', JSON.stringify(nuevoLibro)); // Log para ver los datos que se enviarán en formato JSON

    try {
        const response = await fetch('http://localhost:3000/libros/no-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoLibro)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el libro sin archivo:', error);
        alert('Hubo un problema al subir el libro sin archivo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

///SUBIDA DE ARCHIVOS ARTICULOS REVISTA
export async function uploadArt(artData, file) {
    const formData = new FormData();

    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    let autoresArray = artData.autores;
    if (typeof autoresArray === 'string') {
        autoresArray = autoresArray.split(',').map(autor => autor.trim());
    }

    // Añadir los datos del artículo al formData
    formData.append('numero_articulo', artData.numero_articulo);
    formData.append('titulo', artData.titulo);
    formData.append('anio_revista', parseInt(artData.anio_revista, 10));
    
    // Añadir cada autor al FormData si existe un array de autores
    if (Array.isArray(autoresArray)) {
        autoresArray.forEach((autor, index) => {
            formData.append(`autores[${index}]`, autor);
        });
    }
    formData.append('nombre_revista', artData.nombre_revista);
    formData.append('editorial', artData.editorial);
    formData.append('abstract', artData.abstract);
    formData.append('link_pdf', artData.link_pdf);

    // Añadir el archivo PDF al formData
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/articulos-revistas/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el artículo de revista:', error);
        alert('Hubo un problema al subir el artículo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}


// SUBIDA SIN ARCHIVO DE ARTICULOS REVISTA
export async function uploadArtWithoutFile(artData) {
    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    const autoresArray = Array.isArray(artData.autores) ? artData.autores : artData.autores.split(',').map(autor => autor.trim());

    // Añadir los datos del artículo
    const nuevoArticulo = {
        numero_articulo: artData.numero_articulo,
        titulo: artData.titulo,
        anio_revista: parseInt(artData.anio_revista, 10),
        autores: autoresArray,
        nombre_revista: artData.nombre_revista,
        editorial: artData.editorial,
        abstract: artData.abstract,
        link_pdf: artData.link_pdf
    };

    console.log('Datos en JSON que se enviarán:', JSON.stringify(nuevoArticulo)); // Log para ver los datos que se enviarán en formato JSON

    try {
        const response = await fetch('http://localhost:3000/articulos-revistas/no-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoArticulo)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el artículo sin archivo:', error);
        alert('Hubo un problema al subir el artículo sin archivo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}


// SUBIDA DE ARCHIVOS CAPÍTULOS DE LIBROS
export async function uploadCapitulo(capituloData, file) {
    const formData = new FormData();

    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    let autoresArray = capituloData.autores;
    if (typeof autoresArray === 'string') {
        autoresArray = autoresArray.split(',').map(autor => autor.trim());
    }

    // Verificar si editores es una cadena, y convertirla a un array si es necesario
    let editoresArray = capituloData.editores;
    if (typeof editoresArray === 'string') {
        editoresArray = editoresArray.split(',').map(editor => editor.trim());
    }

    // Añadir los datos del capítulo al formData
    formData.append('numero_identificacion', capituloData.numero_identificacion);
    formData.append('titulo_libro', capituloData.titulo_libro);
    formData.append('titulo_capitulo', capituloData.titulo_capitulo);
    formData.append('anio_publicacion', parseInt(capituloData.anio_publicacion, 10));

    // Añadir cada autor al FormData si existe un array de autores
    if (Array.isArray(autoresArray)) {
        autoresArray.forEach((autor, index) => {
            formData.append(`autores[${index}]`, autor);
        });
    }

    // Añadir cada editor al FormData si existe un array de editores
    if (Array.isArray(editoresArray)) {
        editoresArray.forEach((editor, index) => {
            formData.append(`editores[${index}]`, editor);
        });
    }

    formData.append('editorial', capituloData.editorial);
    formData.append('link_pdf', capituloData.link_pdf);

    // Añadir el archivo PDF al formData
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/capitulos-libros/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el capítulo de libro:', error);
        alert('Hubo un problema al subir el capítulo de libro. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}


// SUBIDA SIN ARCHIVO DE CAPÍTULOS DE LIBROS
export async function uploadCapituloWithoutFile(capituloData) {
    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    const autoresArray = Array.isArray(capituloData.autores) ? capituloData.autores : capituloData.autores.split(',').map(autor => autor.trim());

    // Verificar si editores es una cadena, y convertirla a un array si es necesario
    const editoresArray = Array.isArray(capituloData.editores) ? capituloData.editores : capituloData.editores.split(',').map(editor => editor.trim());

    // Añadir los datos del capítulo
    const nuevoCapitulo = {
        numero_identificacion: capituloData.numero_identificacion,
        titulo_libro: capituloData.titulo_libro,
        titulo_capitulo: capituloData.titulo_capitulo,
        anio_publicacion: parseInt(capituloData.anio_publicacion, 10),
        autores: autoresArray,
        editores: editoresArray,
        editorial: capituloData.editorial,
        link_pdf: capituloData.link_pdf
    };

    console.log('Datos en JSON que se enviarán:', JSON.stringify(nuevoCapitulo)); // Log para ver los datos que se enviarán en formato JSON

    try {
        const response = await fetch('http://localhost:3000/capitulos-libros/no-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCapitulo)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el capítulo de libro sin archivo:', error);
        alert('Hubo un problema al subir el capítulo de libro sin archivo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

// SUBIDA DE ARCHIVOS DOCUMENTOS DE TRABAJO
export async function uploadDocumentoTrabajo(docData, file) {
    const formData = new FormData();

    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    let autoresArray = docData.autores;
    if (typeof autoresArray === 'string') {
        autoresArray = autoresArray.split(',').map(autor => autor.trim());
    }

    // Añadir los datos del documento al formData
    formData.append('numero_identificacion', docData.numero_identificacion);
    formData.append('titulo', docData.titulo);
    formData.append('anio_publicacion', parseInt(docData.anio_publicacion, 10));
    
    // Añadir cada autor al FormData si existe un array de autores
    if (Array.isArray(autoresArray)) {
        autoresArray.forEach((autor, index) => {
            formData.append(`autores[${index}]`, autor);
        });
    }

    formData.append('abstract', docData.abstract);
    formData.append('link_pdf', docData.link_pdf);

    // Añadir el archivo PDF al formData
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/documentos-trabajo/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el documento de trabajo:', error);
        alert('Hubo un problema al subir el documento de trabajo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

// SUBIDA SIN ARCHIVO DE DOCUMENTOS DE TRABAJO
export async function uploadDocumentoTrabajoWithoutFile(docData) {
    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    const autoresArray = Array.isArray(docData.autores) ? docData.autores : docData.autores.split(',').map(autor => autor.trim());

    // Añadir los datos del documento
    const nuevoDocumento = {
        numero_identificacion: docData.numero_identificacion,
        titulo: docData.titulo,
        anio_publicacion: parseInt(docData.anio_publicacion, 10),
        autores: autoresArray,
        abstract: docData.abstract,
        link_pdf: docData.link_pdf
    };

    console.log('Datos en JSON que se enviarán:', JSON.stringify(nuevoDocumento)); // Log para ver los datos que se enviarán en formato JSON

    try {
        const response = await fetch('http://localhost:3000/documentos-trabajo/no-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoDocumento)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el documento de trabajo sin archivo:', error);
        alert('Hubo un problema al subir el documento de trabajo sin archivo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

// SUBIDA DE ARCHIVOS IDEAS Y REFLEXIONES
export async function uploadIdeaReflexion(ideaData, file) {
    const formData = new FormData();

    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    let autoresArray = ideaData.autores;
    if (typeof autoresArray === 'string') {
        autoresArray = autoresArray.split(',').map(autor => autor.trim());
    }

    // Añadir los datos de la idea/reflexión al formData
    formData.append('titulo', ideaData.titulo);
    formData.append('anio_publicacion', parseInt(ideaData.anio_publicacion, 10));

    // Añadir cada autor al FormData si existe un array de autores
    if (Array.isArray(autoresArray)) {
        autoresArray.forEach((autor, index) => {
            formData.append(`autores[${index}]`, autor);
        });
    }

    formData.append('observaciones', ideaData.observaciones);
    formData.append('link_pdf', ideaData.link_pdf);

    // Añadir el archivo PDF al formData
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/ideas-reflexiones/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir la idea o reflexión:', error);
        alert('Hubo un problema al subir la idea o reflexión. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

// SUBIDA SIN ARCHIVO DE IDEAS Y REFLEXIONES
export async function uploadIdeaReflexionWithoutFile(ideaData) {
    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    const autoresArray = Array.isArray(ideaData.autores) ? ideaData.autores : ideaData.autores.split(',').map(autor => autor.trim());

    // Añadir los datos de la idea/reflexión
    const nuevaIdeaReflexion = {
        titulo: ideaData.titulo,
        anio_publicacion: parseInt(ideaData.anio_publicacion, 10),
        autores: autoresArray,
        observaciones: ideaData.observaciones,
        link_pdf: ideaData.link_pdf
    };

    console.log('Datos en JSON que se enviarán:', JSON.stringify(nuevaIdeaReflexion)); // Log para ver los datos que se enviarán en formato JSON

    try {
        const response = await fetch('http://localhost:3000/ideas-reflexiones/no-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaIdeaReflexion)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir la idea o reflexión sin archivo:', error);
        alert('Hubo un problema al subir la idea o reflexión sin archivo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

// SUBIDA DE ARCHIVOS INFO IISEC
export async function uploadInfoIISEC(infoData, file) {
    const formData = new FormData();

    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    let autoresArray = infoData.autores;
    if (typeof autoresArray === 'string') {
        autoresArray = autoresArray.split(',').map(autor => autor.trim());
    }

    // Añadir los datos de Info IISEC al formData
    formData.append('titulo', infoData.titulo);
    formData.append('anio_publicacion', parseInt(infoData.anio_publicacion, 10));

    // Añadir cada autor al FormData si existe un array de autores
    if (Array.isArray(autoresArray)) {
        autoresArray.forEach((autor, index) => {
            formData.append(`autores[${index}]`, autor);
        });
    }

    formData.append('observaciones', infoData.observaciones);
    formData.append('link_pdf', infoData.link_pdf);

    // Añadir el archivo PDF al formData
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/info-iisec/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el documento Info IISEC:', error);
        alert('Hubo un problema al subir el documento Info IISEC. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

// SUBIDA SIN ARCHIVO DE INFO IISEC
export async function uploadInfoIISECWithoutFile(infoData) {
    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    const autoresArray = Array.isArray(infoData.autores) ? infoData.autores : infoData.autores.split(',').map(autor => autor.trim());

    // Añadir los datos de Info IISEC
    const nuevoInfoIISEC = {
        titulo: infoData.titulo,
        anio_publicacion: parseInt(infoData.anio_publicacion, 10),
        autores: autoresArray,
        observaciones: infoData.observaciones,
        link_pdf: infoData.link_pdf
    };

    console.log('Datos en JSON que se enviarán:', JSON.stringify(nuevoInfoIISEC)); // Log para ver los datos que se enviarán en formato JSON

    try {
        const response = await fetch('http://localhost:3000/info-iisec/no-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoInfoIISEC)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el documento Info IISEC sin archivo:', error);
        alert('Hubo un problema al subir el documento Info IISEC sin archivo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

// SUBIDA DE ARCHIVOS POLICY BRIEFS
export async function uploadPolicyBrief(policyData, file) {
    const formData = new FormData();

    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    let autoresArray = policyData.autores;
    if (typeof autoresArray === 'string') {
        autoresArray = autoresArray.split(',').map(autor => autor.trim());
    }

    // Añadir los datos del Policy Brief al formData
    formData.append('titulo', policyData.titulo);
    formData.append('anio_publicacion', parseInt(policyData.anio_publicacion, 10));

    // Añadir cada autor al FormData si existe un array de autores
    if (Array.isArray(autoresArray)) {
        autoresArray.forEach((autor, index) => {
            formData.append(`autores[${index}]`, autor);
        });
    }

    formData.append('mensaje_clave', policyData.mensaje_clave);
    formData.append('link_pdf', policyData.link_pdf);

    // Añadir el archivo PDF al formData
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/policies-briefs/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el Policy Brief:', error);
        alert('Hubo un problema al subir el Policy Brief. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}

// SUBIDA SIN ARCHIVO DE POLICY BRIEFS
export async function uploadPolicyBriefWithoutFile(policyData) {
    // Verificar si autores es una cadena, y convertirla a un array si es necesario
    const autoresArray = Array.isArray(policyData.autores) ? policyData.autores : policyData.autores.split(',').map(autor => autor.trim());

    // Añadir los datos del Policy Brief
    const nuevoPolicyBrief = {
        titulo: policyData.titulo,
        anio_publicacion: parseInt(policyData.anio_publicacion, 10),
        autores: autoresArray,
        mensaje_clave: policyData.mensaje_clave,
        link_pdf: policyData.link_pdf
    };

    console.log('Datos en JSON que se enviarán:', JSON.stringify(nuevoPolicyBrief)); // Log para ver los datos que se enviarán en formato JSON

    try {
        const response = await fetch('http://localhost:3000/policies-briefs/no-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoPolicyBrief)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al subir el Policy Brief sin archivo:', error);
        alert('Hubo un problema al subir el Policy Brief sin archivo. Por favor, intenta de nuevo más tarde.');
        throw error;
    }
}


export async function loginUser(usuario, contrasenia) {
    try {
        const response = await fetch('http://localhost:3000/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, contrasenia })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error de autenticación');
        }

        return await response.json();
    } catch (error) {
        console.error('Error durante el login:', error);
        throw error;
    }
}

export async function logoutUserApi(idUsuario) {
    try {
        const response = await fetch('http://localhost:3000/usuarios/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_usuario: idUsuario })
        });

        if (!response.ok) {
            throw new Error('Error al intentar cerrar sesión');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error en la solicitud de logout:', error);
        throw error;
    }
}