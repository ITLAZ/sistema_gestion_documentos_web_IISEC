import { loadNavbar } from './navbar_service.js';
import { uploadBook } from './api_service.js'; // Importar la función para subir libros
import { uploadBookWithoutFile } from './api_service.js'; // Importar la función para subir libros

// Cargar el navbar inmediatamente
loadNavbar(); 

document.addEventListener('DOMContentLoaded', () => {
    const typeSelector = document.getElementById('type');
    const form = document.getElementById('document-form');
    const submitButton = form.querySelector('button[type="submit"]');

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
            'numero_articulo-group', 'title-group', 'authors-group', 'nombre_revista-group', 
            'published-group', 'editorial-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
        ],
        'capitulos-libros': [
            'numero_identificacion-group', 'titulo_libro-group', 'titulo_capitulo-group', 'authors-group', 
            'editores-group', 'editorial-group', 'published-group', 'abstract-group', 'linkpdf-group', 'pdf-upload-group'
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

    // Manejar el envío del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const type = typeSelector.value;

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

            const fileInput = document.getElementById('pdf-upload');
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null; // Verificar si hay un archivo
            console.log('Datos enviados sin archivo:', libroData);

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

                clearFields();
            } catch (error) {
                console.error('Error al subir el libro:', error);
            }
        }
    });
});
