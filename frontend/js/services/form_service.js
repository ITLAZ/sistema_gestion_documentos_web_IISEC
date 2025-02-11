
import * as Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';

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

let  usuarioId = getCookieValue('usuario');
console.log('ID de usuario:', usuarioId);

document.addEventListener('DOMContentLoaded', () => {
    const typeSelector = document.getElementById('type-add');
    const form = document.getElementById('document-form');
    const submitButton = form.querySelector('button[type="submit"]');


    // Definir los campos obligatorios por tipo de documento
    const requiredFieldsByType = {
        'libros': ['title-add','authors-add','published-add'],
        'articulos-revistas': ['title-add','authors-add','revista-add', 'published-add'],
        'capitulos-libros': ['authors-add','titulo_capitulo-add', 'titulo_libro-add', 'editores-add', 'published-add'],
        'documentos-trabajo': ['title-add', 'authors-add', 'published-add'],
        'ideas-reflexiones': ['title-add', 'authors-add', 'published-add'],
        'info-iisec': ['title-add', 'authors-add', 'published-add'],
        'policies-briefs': ['title-add', 'authors-add', 'published-add']
    };


    // Definir los campos y los grupos de formularios
    const fields = {
        'cover-group-add': document.getElementById('cover-group-add'),
        'title-group-add': document.getElementById('title-group-add'),
        'authors-group-add': document.getElementById('authors-add').parentElement,
        'editorial-group-add': document.getElementById('editorial-group-add'),
        'published-group-add': document.getElementById('published-add').parentElement,
        'abstract-group-add': document.getElementById('abstract-group-add'),
        'numero_articulo-group-add': document.getElementById('numero_articulo-group-add'),
        'nombre_revista-group-add': document.getElementById('nombre_revista-group-add'),
        'numero_identificacion-group-add': document.getElementById('numero_identificacion-group-add'),
        'titulo_capitulo-group-add': document.getElementById('titulo_capitulo-group-add'),
        'titulo_libro-group-add': document.getElementById('titulo_libro-group-add'),
        'editores-group-add': document.getElementById('editores-group-add'),
        'observacion-group-add': document.getElementById('observacion-group-add'),
        'msj_clave-group-add': document.getElementById('msj_clave-group-add'),
        'linkpdf-group-add': document.getElementById('linkpdf-add').parentElement,
        'pdf-upload-group-add': document.getElementById('pdf-upload-add').parentElement,
    };
    
    // Definir el orden de los campos por tipo de documento
    const orderByType = {
        'libros': [
            'cover-group-add', 'title-group-add', 'authors-group-add', 'editorial-group-add', 
            'published-group-add', 'abstract-group-add', 'linkpdf-group-add', 'pdf-upload-group-add'
        ],
        'articulos-revistas': [
            'cover-group-add', 'numero_identificacion-group-add', 'numero_articulo-group-add', 'title-group-add', 
            'authors-group-add', 'nombre_revista-group-add', 'published-group-add', 'editorial-group-add', 
            'abstract-group-add', 'linkpdf-group-add', 'pdf-upload-group-add'
        ],
        'capitulos-libros': [
            'cover-group-add', 'numero_identificacion-group-add', 'titulo_libro-group-add', 'titulo_capitulo-group-add', 
            'authors-group-add', 'editores-group-add', 'editorial-group-add', 'published-group-add', 
            'abstract-group-add', 'linkpdf-group-add', 'pdf-upload-group-add'
        ],
        'documentos-trabajo': [
            'cover-group-add', 'numero_identificacion-group-add', 'title-group-add', 'authors-group-add', 
            'published-group-add', 'abstract-group-add', 'linkpdf-group-add', 'pdf-upload-group-add'
        ],
        'ideas-reflexiones': [
            'cover-group-add', 'title-group-add', 'authors-group-add', 'published-group-add', 'observacion-group-add', 
            'linkpdf-group-add', 'pdf-upload-group-add'
        ],
        'info-iisec': [
            'cover-group-add', 'title-group-add', 'authors-group-add', 'published-group-add', 'observacion-group-add', 
            'linkpdf-group-add', 'pdf-upload-group-add'
        ],
        'policies-briefs': [
            'cover-group-add', 'title-group-add', 'authors-group-add', 'published-group-add', 'msj_clave-group-add', 
            'linkpdf-group-add', 'pdf-upload-group-add'
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
    const authorsField = document.getElementById('authors-add');
    const editorsField = document.getElementById('editores-add');
    
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


    const fileInput = document.getElementById('pdf-upload-add');

    // Verificar el archivo seleccionado para asegurar que sea un PDF
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file && file.type !== 'application/pdf') {
            Sweetalert2.fire('Por favor, selecciona un archivo PDF.');
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
            Sweetalert2.fire(`Por favor, completa los siguientes campos: \n${missingFields.join('\n')}`);
            return false;
        }

        // Validar que al menos se suba un link PDF o un archivo PDF
        const linkPdfField = document.getElementById('linkpdf-add');
        const fileInput = document.getElementById('pdf-upload-add');

        if (!linkPdfField.value.trim() && (!fileInput.files || fileInput.files.length === 0)) {
            Sweetalert2.fire('Debe proporcionar un link PDF o subir un archivo PDF.');
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
                portada: document.getElementById('cover-add').value,
                anio_publicacion: parseInt(document.getElementById('published-add').value, 10), // Convertir a número entero
                titulo: document.getElementById('title-add').value,
                autores: document.getElementById('authors-add').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                editorial: document.getElementById('editorial-add').value,
                abstract: document.getElementById('abstract-add').value,
                link_pdf: document.getElementById('linkpdf-add').value
            };

            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
            console.log('Datos enviados sin archivo:', libroData);

            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir libro con archivo
                    const result = await uploadBook(libroData, file, usuarioId);
                    Sweetalert2.fire('Libro subido exitosamente con archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadBookWithoutFile(libroData, usuarioId);
                    Sweetalert2.fire('Libro subido exitosamente sin archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                }

                clearFields();
            } catch (error) {
                console.error('Error al subir el libro:', error);
            }

        } else if (type === 'articulos-revistas') {
            // Recoger los datos del formulario para artículos de revista
            const artData = {
                portada: document.getElementById('cover-add').value,
                numero_identificacion: document.getElementById('numero_identificacion-add').value,
                numero_articulo: document.getElementById('article-number-add').value,
                titulo: document.getElementById('title-add').value,
                autores: document.getElementById('authors-add').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                anio_revista: parseInt(document.getElementById('published-add').value, 10), // Convertir a número entero
                nombre_revista: document.getElementById('revista-add').value,
                editorial: document.getElementById('editorial-add').value,
                abstract: document.getElementById('abstract-add').value,
                link_pdf: document.getElementById('linkpdf-add').value
            };
    
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
    
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir artículo con archivo
                    const result = await uploadArt(artData, file, usuarioId);
                    Sweetalert2.fire('Artículo de revista subido exitosamente con archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadArtWithoutFile(artData, usuarioId);
                    Sweetalert2.fire('Artículo de revista subido exitosamente sin archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                }
    
                clearFields();
            } catch (error) {
                console.error('Error al subir el artículo de revista:', error);
            }

        } else if (type === 'capitulos-libros') {
            // Recoger los datos del formulario para capítulos de libros
            const capituloData = {
                portada: document.getElementById('cover-add').value,
                numero_identificacion: document.getElementById('numero_identificacion-add').value,
                titulo_libro: document.getElementById('titulo_libro-add').value,
                titulo_capitulo: document.getElementById('titulo_capitulo-add').value,
                anio_publicacion: parseInt(document.getElementById('published-add').value, 10), // Convertir a número entero
                autores: document.getElementById('authors-add').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                editores: document.getElementById('editores-add').value.split(',').map(editor => editor.trim()), // Convertir editores a un array y eliminar espacios
                editorial: document.getElementById('editorial-add').value,
                link_pdf: document.getElementById('linkpdf-add').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir capítulo con archivo
                    const result = await uploadCapitulo(capituloData, file, usuarioId);
                    Sweetalert2.fire('Capítulo de libro subido exitosamente con archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadCapituloWithoutFile(capituloData, usuarioId);
                    Sweetalert2.fire('Capítulo de libro subido exitosamente sin archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir el capítulo de libro:', error);
            }
        } else if (type === 'documentos-trabajo') {
            // Recoger los datos del formulario para documentos de trabajo
            const docData = {
                portada: document.getElementById('cover-add').value,
                numero_identificacion: document.getElementById('numero_identificacion-add').value,
                titulo: document.getElementById('title-add').value,
                anio_publicacion: parseInt(document.getElementById('published-add').value, 10), // Convertir a número entero
                autores: document.getElementById('authors-add').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                abstract: document.getElementById('abstract-add').value,
                link_pdf: document.getElementById('linkpdf-add').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir documento con archivo
                    const result = await uploadDocumentoTrabajo(docData, file, usuarioId);
                    Sweetalert2.fire('Documento de trabajo subido exitosamente con archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadDocumentoTrabajoWithoutFile(docData, usuarioId);
                    Sweetalert2.fire('Documento de trabajo subido exitosamente sin archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir el documento de trabajo:', error);
            }
        } else if (type === 'ideas-reflexiones') {
            // Recoger los datos del formulario para ideas y reflexiones
            const ideaData = {
                portada: document.getElementById('cover-add').value,
                titulo: document.getElementById('title-add').value,
                anio_publicacion: parseInt(document.getElementById('published-add').value, 10), // Convertir a número entero
                autores: document.getElementById('authors-add').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                observaciones: document.getElementById('observation-add').value,
                link_pdf: document.getElementById('linkpdf-add').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir idea/reflexión con archivo
                    const result = await uploadIdeaReflexion(ideaData, file, usuarioId);
                    Sweetalert2.fire('Idea o reflexión subida exitosamente con archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadIdeaReflexionWithoutFile(ideaData, usuarioId);
                    Sweetalert2.fire('Idea o reflexión subida exitosamente sin archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir la idea o reflexión:', error);
            }
        } else if (type === 'info-iisec') {
            // Recoger los datos del formulario para Info IISEC
            const infoData = {
                portada: document.getElementById('cover-add').value,
                titulo: document.getElementById('title-add').value,
                anio_publicacion: parseInt(document.getElementById('published-add').value, 10), // Convertir a número entero
                autores: document.getElementById('authors-add').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                observaciones: document.getElementById('observation-add').value,
                link_pdf: document.getElementById('linkpdf-add').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir Info IISEC con archivo
                    const result = await uploadInfoIISEC(infoData, file, usuarioId);
                    Sweetalert2.fire('Documento Info IISEC subido exitosamente con archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadInfoIISECWithoutFile(infoData, usuarioId);
                    Sweetalert2.fire('Documento Info IISEC subido exitosamente sin archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir el documento Info IISEC:', error);
            }
        } else if (type === 'policies-briefs') {
            // Recoger los datos del formulario para Policy Briefs
            const policyData = {
                portada: document.getElementById('cover-add').value,
                titulo: document.getElementById('title-add').value,
                anio_publicacion: parseInt(document.getElementById('published-add').value, 10), // Convertir a número entero
                autores: document.getElementById('authors-add').value.split(',').map(autor => autor.trim()), // Convertir autores a un array y eliminar espacios
                mensaje_clave: document.getElementById('msj_claves-add').value,
                link_pdf: document.getElementById('linkpdf-add').value
            };
        
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
        
            try {
                if (file) {
                    // Si hay un archivo, consumir el endpoint de subir Policy Brief con archivo
                    const result = await uploadPolicyBrief(policyData, file, usuarioId);
                    Sweetalert2.fire('Policy Brief subido exitosamente con archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                } else {
                    // Si no hay archivo, consumir otro endpoint
                    const result = await uploadPolicyBriefWithoutFile(policyData, usuarioId);
                    Sweetalert2.fire('Policy Brief subido exitosamente sin archivo!');
                    clearFields();
                    console.log('Resultado:', result);
                }
        
                clearFields();
            } catch (error) {
                console.error('Error al subir el Policy Brief:', error);
            }
        } 
    });
});