// Usar la versión correcta para módulos ES6
import * as Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';

import { deleteDocumentById, updateDocumentById, getDocumentById } from '../services/api_service.js';

function getCookieValue(name) {
    const cookieString = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    
    return cookieString ? cookieString.split('=')[1] : null;
}


export async function handleDocumentDeletion(documentType, documentId, cardElement) {

    let  usuarioId = getCookieValue('usuario');
    console.log('ID de usuario:', usuarioId);

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
                await deleteDocumentById(documentType, documentId, usuarioId);
                Sweetalert2.fire("El documento ha sido eliminado exitosamente.");
                // Remover la tarjeta del DOM
                console.log("llego hasta aqui");
                cardElement.remove();
            } catch (error) {
                console.error('Error al eliminar el documento:', error);
            }
        } else {
            Sweetalert2.fire('No se encontraron los parámetros necesarios para eliminar el documento.');
        }
    } else {
        Sweetalert2.fire('El mensaje ingresado no es correcto. Por favor, escribe exactamente: "si, deseo eliminar este archivo".');
    }
}

export async function loadDocumentData(documentType, documentId) {
    try {
        // Obtener los detalles del documento desde el backend.
        const data = await getDocumentById(documentType, documentId);

        // Imprimir los datos recibidos para depuración.
        console.log('Datos recibidos del documento:', data);

        // Mostrar los campos relevantes para el tipo de documento.
        displayFieldsByType(documentType);

        // Rellenar los campos del formulario según el tipo de documento.
        document.getElementById('cover').value = data.portada || '';
        document.getElementById('title').value = data.titulo || '';
        document.getElementById('authors').value = data.autores ? data.autores.join(', ') : '';
        document.getElementById('published').value = data.anio_publicacion || data.anio_revista || '';

        // Rellenar solo si el documento es un "libro"
        if (documentType === 'libros') {
            document.getElementById('editorial').value = data.editorial || '';
            document.getElementById('abstract').value = data.abstract || '';
        }

        // Rellenar solo si el documento es un "artículo de revista"
        if (documentType === 'articulos-revistas') {
            document.getElementById('numero_identificacion').value = data.numero_identificacion || '';
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
    };

    // Definir el orden de los campos por tipo de documento.
    const orderByType = {
        'libros': [
            'cover-group', 'title-group', 'authors-group', 'editorial-group', 
            'published-group', 'abstract-group', 'linkpdf-group'
        ],
        'articulos-revistas': [
            'cover-group','numero_articulo-group','numero_identificacion-group', 'title-group', 'authors-group', 'nombre_revista-group', 
            'published-group', 'editorial-group', 'abstract-group', 'linkpdf-group'
        ],
        'capitulos-libros': [
            'cover-group','numero_identificacion-group', 'titulo_libro-group', 'titulo_capitulo-group', 'authors-group', 
            'editores-group', 'editorial-group', 'published-group', 'linkpdf-group'
        ],
        'documentos-trabajo': [
            'cover-group','numero_identificacion-group', 'title-group', 'authors-group', 
            'published-group', 'abstract-group', 'linkpdf-group'
        ],
        'ideas-reflexiones': [
            'cover-group','title-group', 'authors-group', 'published-group', 'observacion-group', 
            'linkpdf-group'
        ],
        'info-iisec': [
            'cover-group','title-group', 'authors-group', 'published-group', 'observacion-group', 
            'linkpdf-group'
        ],
        'policies-briefs': [
            'cover-group','title-group', 'authors-group', 'published-group', 'msj_clave-group', 
            'linkpdf-group'
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

    export async function handleDocumentUpdate(documentType, documentId, usuarioId) {
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
    
            // Función para validar caracteres permitidos en ciertos campos
            function validarCaracteresPermitidos(event) {
                const pattern = /^[A-Za-zÀ-ÿáéíóúÁÉÍÓÚñÑ.&,\- ]*$/;
                const input = event.target.value;
                if (!pattern.test(input)) {
                    event.target.value = input.slice(0, -1);
                }
            }
    
            // Aplicar validación en autores y editores
            document.getElementById('authors').addEventListener('input', validarCaracteresPermitidos);
            if (document.getElementById('editores')) {
                document.getElementById('editores').addEventListener('input', validarCaracteresPermitidos);
            }
    
            // Lista de campos obligatorios por tipo de documento
            const requiredFieldsByType = {
                'libros': ['title','authors','published'],
                'articulos-revistas': ['title','authors','revista', 'published'],
                'capitulos-libros': ['authors','titulo_capitulo', 'titulo_libro', 'editores', 'published'],
                'documentos-trabajo': ['title', 'authors', 'published'],
                'ideas-reflexiones': ['title', 'authors', 'published'],
                'info-iisec': ['title', 'authors', 'published'],
                'policies-briefs': ['title', 'authors', 'published']
            };
    
            // Validación de campos obligatorios
            const missingFields = [];
            const requiredFields = requiredFieldsByType[documentType] || [];
    
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    missingFields.push(field.previousElementSibling.textContent);
                }
            });
    
            if (missingFields.length > 0) {
                Sweetalert2.fire(`Por favor, completa los siguientes campos: \n${missingFields.join('\n')}`);
                return;
            }
    
            // Crear un objeto con todos los datos a enviar
            const updatedData = {
                titulo: title,
                autores: authors,
                portada: cover,
                link_pdf: linkPdf
            };
    
            // Agregar campos específicos según el tipo de documento
            if (documentType === 'libros' || documentType === 'capitulos-libros' || documentType === 'documentos-trabajo') {
                updatedData.anio_publicacion = parseInt(published);
            } else if (documentType === 'articulos-revistas') {
                updatedData.anio_revista = parseInt(published);
            }
    
            if (documentType === 'libros') {
                updatedData.editorial = editorial;
                updatedData.abstract = abstract;
            }
    
            if (documentType === 'articulos-revistas') {
                updatedData.numero_identificacion = numeroIdentificacion;
                updatedData.numero_articulo = articleNumber;
                updatedData.nombre_revista = revista;
                updatedData.editorial = editorial;
                updatedData.abstract = abstract;
            }
    
            if (documentType === 'capitulos-libros') {
                updatedData.numero_identificacion = numeroIdentificacion;
                updatedData.titulo_libro = tituloLibro;
                updatedData.titulo_capitulo = tituloCapitulo;
                updatedData.editores = editores;
                updatedData.editorial = editorial;
            }
    
            if (documentType === 'documentos-trabajo') {
                updatedData.numero_identificacion = numeroIdentificacion;
                updatedData.abstract = abstract;
            }
    
            if (documentType === 'ideas-reflexiones' || documentType === 'info-iisec') {
                updatedData.observaciones = observation;
            }
    
            if (documentType === 'policies-briefs') {
                updatedData.mensaje_clave = msjClaves;
            }
    
            // Enviar la solicitud de actualización
            await updateDocumentById(documentType, documentId, updatedData, usuarioId);
            Sweetalert2.fire('Documento actualizado exitosamente.');
    
        } catch (error) {
            Sweetalert2.fire('Error al actualizar el documento:', error);
        }
    }


    