export async function getDocuments() {
    try {
        const response = await fetch('/api/documents');
        return await response.json();
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}
