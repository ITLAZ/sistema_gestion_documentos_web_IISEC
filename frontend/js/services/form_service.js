import { loadNavbar } from './navbar_service.js';

import { uploadBook } from './api_service.js'; // Importar la función para subir libros
import { uploadBookWithoutFile } from './api_service.js'; // Importar la función para subir libros

//REVISTAS
import { uploadArt } from './api_service.js'; 
import { uploadArtWithoutFile } from './api_service.js'; 

//CAPITULOS
import { uploadCapitulo } from './api_service.js'; 
import { uploadCapituloWithoutFile } from './api_service.js'; 

//DOCUMENTOS DE TRABAJO
import { uploadDocumentoTrabajo } from './api_service.js'; 
import { uploadDocumentoTrabajoWithoutFile } from './api_service.js'; 

//IDEAS Y REFLEXIONES
import { uploadIdeaReflexion } from './api_service.js'; 
import { uploadIdeaReflexionWithoutFile } from './api_service.js'; 

//INFO IISEC
import { uploadInfoIISEC } from './api_service.js'; 
import { uploadInfoIISECWithoutFile } from './api_service.js'; 

//POLICY AND BRIEFS
import { uploadPolicyBrief } from './api_service.js'; 
import { uploadPolicyBriefWithoutFile } from './api_service.js'; 

// Cargar el navbar inmediatamente
loadNavbar(); 

function getCookieValue(name) {
    const cookieString = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    
    return cookieString ? cookieString.split('=')[1] : null;
}

let  usuarioId = getCookieValue('id_usuario');
console.log('ID de usuario:', usuarioId);

document.addEventListener('DOMContentLoaded', () => {
    const typeSelector = document.getElementById('type-add');
    const form = document.getElementById('document-form');
    const submitButton = form.querySelector('button[type="submit"]');


    // Definir los campos obligatorios por tipo de documento
    const requiredFieldsByType = {
        'libros': ['title','authors','published'],
        'articulos-revistas': ['title','authors','revista', 'published'],
        'capitulos-libros': ['authors','titulo_capitulo', 'titulo_libro', 'editores', 'published'],
        'documentos-trabajo': ['title', 'authors', 'published'],
        'ideas-reflexiones': ['title', 'authors', 'published'],
        'info-iisec': ['title', 'authors', 'published'],
        'policies-briefs': ['title', 'authors', 'published']
    };


    // Definir los campos y los grupos de formularios
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
    
    // Definir el orden de los campos por tipo de documento
    const orderByType = {
        'libros': [
            'cover-group', 'title-group', 'authors-group', 'editorial-group', 
            'published-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'articulos-revistas': [
            'cover-group','numero_identificacion-group','numero_articulo-group', 'title-group', 'authors-group', 'nombre_revista-group', 
            'published-group', 'editorial-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'capitulos-libros': [
            'cover-group','numero_identificacion-group', 'titulo_libro-group', 'titulo_capitulo-group', 'authors-group', 
            'editores-group', 'editorial-group', 'published-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'documentos-trabajo': [
            'cover-group','numero_identificacion-group', 'title-group', 'authors-group', 
            'published-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'ideas-reflexiones': [
            'cover-group','title-group', 'authors-group', 'published-group', 'observacion-group', 
            'linkpdf-group', 'pdf-upload-group'
        ],
        'info-iisec': [
            'cover-group','title-group', 'authors-group', 'published-group', 'observacion-group', 
            'linkpdf-group', 'pdf-upload-group'
        ],
        'policies-briefs': [
            'cover-group','title-group', 'authors-group', 'published-group', 'msj_clave-group', 
            'linkpdf-group', 'pdf-upload-group'
        ]
    };



    // Función para limpiar los campos del formulario
    const clearFields = () => {
        // Limpia todos los campos de entrada y textarea del formulario
        const inputs = form.querySelectorAll('input');
        const textareas = form.querySelectorAll('textarea');

        inputs.forEach(input => {
            if (input.type !== 'submit' && input.type !== 'button') {
                if (input.type === 'file') {
                    // Para los campos de archivo, restablecer el valor a vacío
                    input.value = null;
                } else {
                    input.value = '';
                }
            }
        });

        textareas.forEach(textarea => {
            textarea.value = '';
        });
    };

    // Función para validar el input de los campos
    function validarCaracteresPermitidos(event) {
        const pattern = /^[A-Za-zÀ-ÿáéíóúÁÉÍÓÚñÑ.&,\- ]*$/;
        const input = event.target.value;
  
    // Si el valor actual no cumple con el patrón, eliminamos el último carácter
    if (!pattern.test(input)) {
      event.target.value = input.slice(0, -1);
    }
  }
  
    // Obtener los campos del formulario
    const authorsField = document.getElementById('authors');
    const editorsField = document.getElementById('editores');
    
    // Añadir el evento input a ambos campos
    authorsField.addEventListener('input', validarCaracteresPermitidos);
    editorsField.addEventListener('input', validarCaracteresPermitidos);


    // Mostrar/ocultar campos según el tipo de documento seleccionado
    typeSelector.addEventListener('change', function () {
        clearFields();
        const type = this.value;

        // Ocultar todos los campos inicialmente
        Object.values(fields).forEach(field => {
            if (field) field.style.display = 'none';
        });

        // Mostrar y reordenar los campos según el tipo de documento seleccionado
        if (type && orderByType[type]) {
            const order = orderByType[type];
            order.forEach(id => {
                const field = fields[id];
                if (field) {
                    field.style.display = 'flex';
                    form.insertBefore(field, submitButton);
                }
            });
        }

        // Asegurar que el botón de guardar esté al final del formulario
        form.appendChild(submitButton);
    });

    // Llamar la función de visualización para preseleccionar "Libros" cuando se carga la página
    typeSelector.dispatchEvent(new Event('change'));


    const fileInput = document.getElementById('pdf-upload');

    // Verificar el archivo seleccionado para asegurar que sea un PDF
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file && file.type !== 'application/pdf') {
            alert('Por favor, selecciona un archivo PDF.');
            fileInput.value = ''; // Limpiar la selección del archivo
        }
    });

    // Función para validar los campos obligatorios
    const validateRequiredFields = (type) => {
        const requiredFields = requiredFieldsByType[type];
        const missingFields = [];

        // Validar que los campos requeridos no estén vacíos
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                missingFields.push(field.previousElementSibling.textContent); // Capturar la etiqueta de cada campo
            }
        });

        // Mostrar alerta si faltan campos obligatorios
        if (missingFields.length > 0) {
            alert(`Por favor, completa los siguientes campos: \n${missingFields.join('\n')}`);
            return false;
        }

        // Validar año de publicación
        const publishedField = document.getElementById('published');
        if (publishedField) {
            const year = parseInt(publishedField.value, 10);
            const currentYear = new Date().getFullYear();
            if (year < 1900 || year > currentYear) {
                alert(`El año de publicación debe estar entre 1900 y ${currentYear}.`);
                return false;
            }
        }

        // Validar que al menos se suba un link PDF o un archivo PDF
        const linkPdfField = document.getElementById('linkpdf');
        const fileInput = document.getElementById('pdf-upload');

        if (!linkPdfField.value.trim() && (!fileInput.files || fileInput.files.length === 0)) {
            alert('Debe proporcionar un link PDF o subir un archivo PDF.');
            return false;
        }

        return true;
    };


    // Manejar el envío del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const type = typeSelector.value;

        // Validar los campos obligatorios según el tipo de documento seleccionado
        if (!validateRequiredFields(type)) {
            return; // No enviar el formulario si hay campos obligatorios faltantes o errores en la fecha
        }

        if (type === 'libros') {
            // Recoger los datos del formulario para libros
            const libroData = {
                portada: document.getElementById('cover').value,
                anio_publicacion: parseInt(document.getElementById('published').value, 10), // Convertir a número entero
                titulo: document.getElementById('title').value,
                autores: document.getElementById('authors').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                editorial: document.getElementById('editorial').value,
                abstract: document.getElementById('abstract').value,
                link_pdf: document.getElementById('linkpdf').value
            };

            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
            console.log('Datos enviados sin archivo:', libroData);

            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir libro con archivo
                    const result = await uploadBook(libroData, file, usuarioId);
                    alert('Libro subido exitosamente con archivo!');
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadBookWithoutFile(libroData, usuarioId);
                    alert('Libro subido exitosamente sin archivo!');
                    console.log('Resultado:', result);
                }

                clearFields();
            } catch (error) {
                console.error('Error al subir el libro:', error);
            }

        } else if (type === 'articulos-revistas') {
            // Recoger los datos del formulario para artículos de revista
            const artData = {
                portada: document.getElementById('cover').value,
                numero_identificacion: document.getElementById('numero_identificacion').value,
                numero_articulo: document.getElementById('article-number').value,
                titulo: document.getElementById('title').value,
                autores: document.getElementById('authors').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                anio_revista: parseInt(document.getElementById('published').value, 10), // Convertir a número entero
                nombre_revista: document.getElementById('revista').value,
                editorial: document.getElementById('editorial').value,
                abstract: document.getElementById('abstract').value,
                link_pdf: document.getElementById('linkpdf').value
            };
    
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
    
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir artículo con archivo
                    const result = await uploadArt(artData, file, usuarioId);
                    alert('Artículo de revista subido exitosamente con archivo!');
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadArtWithoutFile(artData, usuarioId);
                    alert('Artículo de revista subido exitosamente sin archivo!');
                    console.log('Resultado:', result);
                }
    
                clearFields();
            } catch (error) {
                console.error('Error al subir el artículo de revista:', error);
            }

        } else if (type === 'capitulos-libros') {
            // Recoger los datos del formulario para capítulos de libros
            const capituloData = {
                portada: document.getElementById('cover').value,
                numero_identificacion: document.getElementById('numero_identificacion').value,
                titulo_libro: document.getElementById('titulo_libro').value,
                titulo_capitulo: document.getElementById('titulo_capitulo').value,
                anio_publicacion: parseInt(document.getElementById('published').value, 10), // Convertir a número entero
                autores: document.getElementById('authors').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                editores: document.getElementById('editores').value.split(',').map(editor => editor.trim()), // Convertir editores a un array y eliminar espacios
                editorial: document.getElementById('editorial').value,
                link_pdf: document.getElementById('linkpdf').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir capítulo con archivo
                    const result = await uploadCapitulo(capituloData, file, usuarioId);
                    alert('Capítulo de libro subido exitosamente con archivo!');
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadCapituloWithoutFile(capituloData, usuarioId);
                    alert('Capítulo de libro subido exitosamente sin archivo!');
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir el capítulo de libro:', error);
            }
        } else if (type === 'documentos-trabajo') {
            // Recoger los datos del formulario para documentos de trabajo
            const docData = {
                portada: document.getElementById('cover').value,
                numero_identificacion: document.getElementById('numero_identificacion').value,
                titulo: document.getElementById('title').value,
                anio_publicacion: parseInt(document.getElementById('published').value, 10), // Convertir a número entero
                autores: document.getElementById('authors').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                abstract: document.getElementById('abstract').value,
                link_pdf: document.getElementById('linkpdf').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir documento con archivo
                    const result = await uploadDocumentoTrabajo(docData, file, usuarioId);
                    alert('Documento de trabajo subido exitosamente con archivo!');
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadDocumentoTrabajoWithoutFile(docData, usuarioId);
                    alert('Documento de trabajo subido exitosamente sin archivo!');
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir el documento de trabajo:', error);
            }
        } else if (type === 'ideas-reflexiones') {
            // Recoger los datos del formulario para ideas y reflexiones
            const ideaData = {
                portada: document.getElementById('cover').value,
                titulo: document.getElementById('title').value,
                anio_publicacion: parseInt(document.getElementById('published').value, 10), // Convertir a número entero
                autores: document.getElementById('authors').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                observaciones: document.getElementById('observation').value,
                link_pdf: document.getElementById('linkpdf').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir idea/reflexión con archivo
                    const result = await uploadIdeaReflexion(ideaData, file, usuarioId);
                    alert('Idea o reflexión subida exitosamente con archivo!');
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadIdeaReflexionWithoutFile(ideaData, usuarioId);
                    alert('Idea o reflexión subida exitosamente sin archivo!');
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir la idea o reflexión:', error);
            }
        } else if (type === 'info-iisec') {
            // Recoger los datos del formulario para Info IISEC
            const infoData = {
                portada: document.getElementById('cover').value,
                titulo: document.getElementById('title').value,
                anio_publicacion: parseInt(document.getElementById('published').value, 10), // Convertir a número entero
                autores: document.getElementById('authors').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                observaciones: document.getElementById('observation').value,
                link_pdf: document.getElementById('linkpdf').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir Info IISEC con archivo
                    const result = await uploadInfoIISEC(infoData, file, usuarioId);
                    alert('Documento Info IISEC subido exitosamente con archivo!');
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadInfoIISECWithoutFile(infoData, usuarioId);
                    alert('Documento Info IISEC subido exitosamente sin archivo!');
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir el documento Info IISEC:', error);
            }
        } else if (type === 'policies-briefs') {
            // Recoger los datos del formulario para Policy Briefs
            const policyData = {
                portada: document.getElementById('cover').value,
                titulo: document.getElementById('title').value,
                anio_publicacion: parseInt(document.getElementById('published').value, 10), // Convertir a número entero
                autores: document.getElementById('authors').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                mensaje_clave: document.getElementById('msj_claves').value,
                link_pdf: document.getElementById('linkpdf').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir Policy Brief con archivo
                    const result = await uploadPolicyBrief(policyData, file, usuarioId);
                    alert('Policy Brief subido exitosamente con archivo!');
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadPolicyBriefWithoutFile(policyData, usuarioId);
                    alert('Policy Brief subido exitosamente sin archivo!');
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir el Policy Brief:', error);
            }
        } 
    });
});