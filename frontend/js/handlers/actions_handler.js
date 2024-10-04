import { deleteDocumentById } from '../services/api_service.js';


export async function handleDocumentDeletion(documentType, documentId, cardElement) {
    // Mostrar ventana emergente de confirmación
    const userConfirmation = prompt("Realmente desea eliminar este archivo? \nDe ser así, escriba: \"si, deseo eliminar este archivo\"");

    if (userConfirmation === "si, deseo eliminar este archivo") {
        console.log("documentos",documentType);
        console.log("documentos",documentId);
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
