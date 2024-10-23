import { deleteDocumentById, updateDocumentById, getDocumentById } from '../services/api_service.js';

export async function handleDocumentDeletion(documentType, documentId, cardElement) {
    // Mostrar ventana emergente de confirmación
    const userConfirmation = prompt("Realmente desea eliminar este archivo? \nDe ser así, escriba: \"si, deseo eliminar este archivo\"");

    if (userConfirmation === "si, deseo eliminar este archivo") {
        console.log("documento tipo",documentType);
        console.log("documento id",documentId);
        if (documentType && documentId) {
            try {
                // Llamada al endpoint para eliminar el documento
                console.log("documentos",documentType);
                console.log("documentos",documentId);
                await deleteDocumentById(documentType, documentId);
                alert("El documento ha sido eliminado exitosamente.");
                // Remover la tarjeta del DOM
                console.log("llego hasta aqui");
                cardElement.remove();
            } catch (error) {
                console.error('Error al eliminar el documento:', error);
            }
        } else {
            alert('No se encontraron los parámetros necesarios para eliminar el documento.');
        }
    } else {
        alert('El mensaje ingresado no es correcto. Por favor, escribe exactamente: "si, deseo eliminar este archivo".');
    }
}

let originalData = {};
export async function loadDocumentData(documentType, documentId) {
    try {
        // Obtener los detalles del documento desde el backend.
        const data = await getDocumentById(documentType, documentId);

        originalData = { ...data };

        // Imprimir los datos recibidos para depuración.
        console.log('Datos recibidos del documento:', data);

        // Mostrar los campos relevantes para el tipo de documento.
        displayFieldsByType(documentType);

        // Rellenar los campos del formulario según el tipo de documento.
        document.getElementById('title').value = data.titulo || '';
        document.getElementById('authors').value = data.autores ? data.autores.join(', ') : '';
        document.getElementById('published').value = data.anio_publicacion || data.anio_revista || '';

        // Rellenar solo si el documento es un "libro"
        if (documentType === 'libros') {
            document.getElementById('cover').value = data.portada || '';
            document.getElementById('editorial').value = data.editorial || '';
            document.getElementById('abstract').value = data.abstract || '';
        }

        // Rellenar solo si el documento es un "artículo de revista"
        if (documentType === 'articulos-revistas') {
            document.getElementById('article-number').value = data.numero_articulo || '';
            document.getElementById('revista').value = data.nombre_revista || '';
            document.getElementById('editorial').value = data.editorial || '';
            document.getElementById('abstract').value = data.abstract || '';
        }

        // Rellenar solo si el documento es un "capítulo de libro"
        if (documentType === 'capitulos-libros') {
            document.getElementById('numero_identificacion').value = data.numero_identificacion || '';
            document.getElementById('titulo_libro').value = data.titulo_libro || '';
            document.getElementById('titulo_capitulo').value = data.titulo_capitulo || '';
            document.getElementById('authors').value = data.autores ? data.autores.join(', ') : '';
            document.getElementById('editores').value = data.editores ? data.editores.join(', ') : '';
            document.getElementById('editorial').value = data.editorial || '';
        }

        // Rellenar solo si el documento es un "documento de trabajo"
        if (documentType === 'documentos-trabajo') {
            document.getElementById('numero_identificacion').value = data.numero_identificacion || '';
            document.getElementById('abstract').value = data.abstract || '';
        }

        // Rellenar solo si el documento es "ideas y reflexiones" o "info IISEC"
        if (documentType === 'ideas-reflexiones' || documentType === 'info-iisec') {
            document.getElementById('observation').value = data.observaciones || '';
        }

        // Rellenar solo si el documento es un "policy brief"
        if (documentType === 'policies-briefs') {
            document.getElementById('msj_claves').value = data.mensaje_clave || '';
        }

        // Rellenar el campo del link PDF si existe para cualquier tipo de documento.
        document.getElementById('linkpdf').value = data.link_pdf || '';

    } catch (error) {
        console.error('Error al cargar el documento:', error);
    }
}


function displayFieldsByType(type) {
    const form = document.getElementById('document-form');
    const buttonsContainer = document.querySelector('.edit-actions');

    const fields = {
        'cover-group': document.getElementById('cover-group'),
        'title-group': document.getElementById('title-group'),
        'authors-group': document.getElementById('authors').parentElement,
        'editorial-group': document.getElementById('editorial-group'),
        'published-group': document.getElementById('published').parentElement,
        'abstract-group': document.getElementById('abstract-group'),
        'numero_articulo-group': document.getElementById('numero_articulo-group'),
        'nombre_revista-group': document.getElementById('nombre_revista-group'),
        'numero_identificacion-group': document.getElementById('numero_identificacion-group'),
        'titulo_capitulo-group': document.getElementById('titulo_capitulo-group'),
        'titulo_libro-group': document.getElementById('titulo_libro-group'),
        'editores-group': document.getElementById('editores-group'),
        'observacion-group': document.getElementById('observacion-group'),
        'msj_clave-group': document.getElementById('msj_clave-group'),
        'linkpdf-group': document.getElementById('linkpdf').parentElement,
        'pdf-upload-group': document.getElementById('pdf-upload').parentElement,
    };

    // Definir el orden de los campos por tipo de documento.
    const orderByType = {
        'libros': [
            'cover-group', 'title-group', 'authors-group', 'editorial-group', 
            'published-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'articulos-revistas': [
            'numero_articulo-group', 'title-group', 'authors-group', 'nombre_revista-group', 
            'published-group', 'editorial-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'capitulos-libros': [
            'numero_identificacion-group', 'titulo_libro-group', 'titulo_capitulo-group', 'authors-group', 
            'editores-group', 'editorial-group', 'published-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'documentos-trabajo': [
            'numero_identificacion-group', 'title-group', 'authors-group', 
            'published-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'ideas-reflexiones': [
            'title-group', 'authors-group', 'published-group', 'observacion-group', 
            'linkpdf-group', 'pdf-upload-group'
        ],
        'info-iisec': [
            'title-group', 'authors-group', 'published-group', 'observacion-group', 
            'linkpdf-group', 'pdf-upload-group'
        ],
        'policies-briefs': [
            'title-group', 'authors-group', 'published-group', 'msj_clave-group', 
            'linkpdf-group', 'pdf-upload-group'
        ]
    };

    // Ocultar todos los campos inicialmente.
    Object.values(fields).forEach(field => {
        if (field) field.style.display = 'none';
    });

    // Mostrar los campos según el tipo de documento.
    if (type && orderByType[type]) {
        const order = orderByType[type];
        order.forEach(id => {
            const field = fields[id];
            if (field) {
                field.style.display = 'flex';
                form.insertBefore(field, buttonsContainer); // Agregar los campos antes de los botones.
            }
        });
    }

    // Asegurar que el contenedor de botones esté al final del formulario.
    form.appendChild(buttonsContainer);
}

export async function handleDocumentUpdate(documentType, documentId) {
    try {
        // Obtener los valores de los campos del formulario.
        const title = document.getElementById('title').value;
        const authors = document.getElementById('authors').value.split(',').map(author => author.trim());
        const published = document.getElementById('published').value;
        const cover = document.getElementById('cover') ? document.getElementById('cover').value : '';
        const editorial = document.getElementById('editorial') ? document.getElementById('editorial').value : '';
        const abstract = document.getElementById('abstract') ? document.getElementById('abstract').value : '';
        const articleNumber = document.getElementById('article-number') ? document.getElementById('article-number').value : '';
        const revista = document.getElementById('revista') ? document.getElementById('revista').value : '';
        const numeroIdentificacion = document.getElementById('numero_identificacion') ? document.getElementById('numero_identificacion').value : '';
        const tituloCapitulo = document.getElementById('titulo_capitulo') ? document.getElementById('titulo_capitulo').value : '';
        const tituloLibro = document.getElementById('titulo_libro') ? document.getElementById('titulo_libro').value : '';
        const editores = document.getElementById('editores') ? document.getElementById('editores').value.split(',').map(editor => editor.trim()) : [];
        const observation = document.getElementById('observation') ? document.getElementById('observation').value : '';
        const msjClaves = document.getElementById('msj_claves') ? document.getElementById('msj_claves').value : '';
        const linkPdf = document.getElementById('linkpdf').value;

        // Crear un objeto para almacenar solo los datos que han sido modificados.
        const updatedData = {};

        // Comparar y almacenar solo los datos que han cambiado.
        if (title && title !== originalData.titulo) {
            updatedData.titulo = title;
        }

        if (authors && authors.join(', ') !== originalData.autores.join(', ')) {
            updatedData.autores = authors;
        }

        if (published && published !== (originalData.anio_publicacion || originalData.anio_revista).toString()) {
            if (documentType === 'libros' || documentType === 'capitulos-libros' || documentType === 'documentos-trabajo') {
                updatedData.anio_publicacion = parseInt(published);
            } else if (documentType === 'articulos-revistas') {
                updatedData.anio_revista = parseInt(published);
            }
        }

        // Comparar y almacenar datos específicos para cada tipo de documento.
        if (documentType === 'libros') {
            if (cover && cover !== originalData.portada) {
                updatedData.portada = cover;
            }
            if (editorial && editorial !== originalData.editorial) {
                updatedData.editorial = editorial;
            }
            if (abstract && abstract !== originalData.abstract) {
                updatedData.abstract = abstract;
            }
        }

        if (documentType === 'articulos-revistas') {
            if (articleNumber && articleNumber !== originalData.numero_articulo) {
                updatedData.numero_articulo = articleNumber;
            }
            if (revista && revista !== originalData.nombre_revista) {
                updatedData.nombre_revista = revista;
            }
            if (editorial && editorial !== originalData.editorial) {
                updatedData.editorial = editorial;
            }
            if (abstract && abstract !== originalData.abstract) {
                updatedData.abstract = abstract;
            }
        }

        if (documentType === 'capitulos-libros') {
            if (numeroIdentificacion && numeroIdentificacion !== originalData.numero_identificacion) {
                updatedData.numero_identificacion = numeroIdentificacion;
            }
            if (tituloLibro && tituloLibro !== originalData.titulo_libro) {
                updatedData.titulo_libro = tituloLibro;
            }
            if (tituloCapitulo && tituloCapitulo !== originalData.titulo_capitulo) {
                updatedData.titulo_capitulo = tituloCapitulo;
            }
            if (editores && editores.join(', ') !== originalData.editores.join(', ')) {
                updatedData.editores = editores;
            }
            if (editorial && editorial !== originalData.editorial) {
                updatedData.editorial = editorial;
            }
        }

        if (documentType === 'documentos-trabajo') {
            if (numeroIdentificacion && numeroIdentificacion !== originalData.numero_identificacion) {
                updatedData.numero_identificacion = numeroIdentificacion;
            }
            if (abstract && abstract !== originalData.abstract) {
                updatedData.abstract = abstract;
            }
        }

        if (documentType === 'ideas-reflexiones' || documentType === 'info-iisec') {
            if (observation && observation !== originalData.observaciones) {
                updatedData.observaciones = observation;
            }
        }

        if (documentType === 'policies-briefs') {
            if (msjClaves && msjClaves !== originalData.mensaje_clave) {
                updatedData.mensaje_clave = msjClaves;
            }
        }

        if (linkPdf && linkPdf !== originalData.link_pdf) {
            updatedData.link_pdf = linkPdf;
        }

        // Enviar la solicitud de actualización solo si hay datos modificados.
        if (Object.keys(updatedData).length > 0) {
            await updateDocumentById(documentType, documentId, updatedData);
            console.log('Documento actualizado exitosamente.');
        } else {
            alert('No se detectaron cambios para actualizar.');
        }
    } catch (error) {
        console.error('Error al actualizar el documento:', error);
    }
}


export async function onSaveButtonClick() {
    const documentType = sessionStorage.getItem('documentType');
    const documentId = sessionStorage.getItem('documentId');

    if (documentType && documentId) {
        await handleDocumentUpdate(documentType, documentId);
    } else {
        alert('No se encontraron los parámetros necesarios para la actualización.');
    }
}


