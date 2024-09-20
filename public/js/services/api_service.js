export async function getDocuments() {
    try {
        const response = await fetch('http://localhost:3000/libros'); 
        return await response.json(); // Retorna la respuesta como JSON
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}
