import { ApiProperty } from '@nestjs/swagger';

export class ElasticsearchBaseResponseDto {
    @ApiProperty({ example: 'index-name' })
    _index: string;

    @ApiProperty({ example: '66edbb116890297dfd8c6a0b' })
    _id: string;

    @ApiProperty({ example: null })
    _score: number | null;
}

export class LibrosResponseDto extends ElasticsearchBaseResponseDto {
    @ApiProperty({
        example: {
            portada: 'https://example.com/image.jpg',
            titulo: 'Libro de ejemplo',
            autores: ['Autor 1', 'Autor 2'],
            anio_publicacion: 2023,
            editorial: 'Editorial Ejemplo',
            abstract: 'Este es un libro de ejemplo.',
            link_pdf: 'https://example.com/pdf',
            direccion_archivo: '/archivos/libro.pdf',
        },
    })
    _source: {
        portada: string;
        titulo: string;
        autores: string[];
        anio_publicacion: number;
        editorial?: string;
        abstract?: string;
        link_pdf?: string;
        direccion_archivo?: string;
    };

    @ApiProperty({ example: [2023] })
    sort: number[];
}

export class ArticuloRevistaResponseDto extends ElasticsearchBaseResponseDto {
    @ApiProperty({
        example: {
            numero_articulo: '12345',
            titulo: 'Artículo de revista de ejemplo',
            autores: ['Autor 1', 'Autor 2'],
            nombre_revista: 'Revista Científica',
            anio_revista: 2024,
            editorial: 'Editorial Científica',
            abstract: 'Este es un artículo de revista de ejemplo.',
            link_pdf: 'https://example.com/pdf',
            direccion_archivo: '/archivos/articulo.pdf',
        },
    })
    _source: {
        numero_articulo: string;
        titulo: string;
        autores: string[];
        nombre_revista: string;
        anio_revista: number;
        editorial?: string;
        abstract?: string;
        link_pdf?: string;
        direccion_archivo?: string;
    };
}

export class CapituloLibroResponseDto extends ElasticsearchBaseResponseDto {
    @ApiProperty({
        example: {
            numero_identificacion: '12345',
            titulo_libro: 'Libro de ejemplo',
            titulo_capitulo: 'Capítulo de ejemplo',
            autores: ['Autor 1', 'Autor 2'],
            anio_publicacion: 2023,
            editores: ['Editor 1'],
            editorial: 'Editorial de Ejemplo',
            link_pdf: 'https://example.com/pdf',
            direccion_archivo: '/archivos/capitulo.pdf',
        },
    })
    _source: {
        numero_identificacion: string;
        titulo_libro: string;
        titulo_capitulo: string;
        autores: string[];
        anio_publicacion: number;
        editores: string[];
        editorial?: string;
        link_pdf?: string;
        direccion_archivo?: string;
    };
}

export class DocumentoTrabajoResponseDto extends ElasticsearchBaseResponseDto {
    @ApiProperty({
        example: {
            numero_identificacion: '12345',
            titulo: 'Documento de Trabajo de ejemplo',
            autores: ['Autor 1', 'Autor 2'],
            anio_publicacion: 2022,
            editorial: 'Editorial de Ejemplo',
            link_pdf: 'https://example.com/pdf',
            direccion_archivo: '/archivos/documento.pdf',
        },
    })
    _source: {
        numero_identificacion: string;
        titulo: string;
        autores: string[];
        anio_publicacion: number;
        editorial?: string;
        link_pdf?: string;
        direccion_archivo?: string;
    };
}

export class InfoIISECResponseDto extends ElasticsearchBaseResponseDto {
    @ApiProperty({
        example: {
            titulo: 'Información del IISEC',
            autores: ['Autor 1', 'Autor 2'],
            anio_publicacion: 2020,
            observaciones: 'Observaciones sobre el IISEC',
            link_pdf: 'https://example.com/pdf',
            direccion_archivo: '/archivos/info.pdf',
        },
    })
    _source: {
        titulo: string;
        autores: string[];
        anio_publicacion: number;
        observaciones?: string;
        link_pdf?: string;
        direccion_archivo?: string;
    };
}

export class IdeaReflexionResponseDto extends ElasticsearchBaseResponseDto {
    @ApiProperty({
        example: {
            titulo: 'Idea de Reflexión',
            autores: ['Autor 1', 'Autor 2'],
            anio_publicacion: 2021,
            observaciones: 'Observaciones sobre la reflexión',
            link_pdf: 'https://example.com/pdf',
            direccion_archivo: '/archivos/idea.pdf',
        },
    })
    _source: {
        titulo: string;
        autores: string[];
        anio_publicacion: number;
        observaciones?: string;
        link_pdf?: string;
        direccion_archivo?: string;
    };
}

export class PolicyBriefResponseDto extends ElasticsearchBaseResponseDto {
    @ApiProperty({
        example: {
            titulo: 'Policy Brief de Ejemplo',
            autores: ['Autor 1', 'Autor 2'],
            anio_publicacion: 2023,
            mensaje_clave: 'Mensaje clave del documento',
            link_pdf: 'https://example.com/pdf',
            direccion_archivo: '/archivos/policy.pdf',
        },
    })
    _source: {
        titulo: string;
        autores: string[];
        anio_publicacion: number;
        mensaje_clave?: string;
        link_pdf?: string;
        direccion_archivo?: string;
    };
}
