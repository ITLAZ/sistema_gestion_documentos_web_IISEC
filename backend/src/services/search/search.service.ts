import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

   // Método para indexar documentos
   async indexDocument(index: string, id: string, body: any) {
    return this.elasticsearchService.index({
      index,
      id,
      body,
    });
  }

  // Método para actualizar documentos
  async updateDocument(index: string, id: string, body: any) {
    return this.elasticsearchService.update({
      index,
      id,
      body: {
        doc: body,
      },
    });
  }

  // Método para eliminar documentos
  async deleteDocument(index: string, id: string) {
    return this.elasticsearchService.delete({
      index,
      id,
    });
  }

  async indexData(index: string, data: any) {
    return this.elasticsearchService.index({
      index,
      body: data,
    });
  }

    // Búsqueda por tipo de documento (índice específico)
    async searchByType(
      type: string,
      query: string,
      page: number,
      size: number,
      filters: {
        anio_publicacion?: number,
        autores?: string,
      },
      sortBy: string = 'anio_publicacion',
      sortOrder: 'asc' | 'desc' = 'asc'
    ) {
      const from = (page - 1) * size;
      const filterConditions = [];
    
      // Siempre excluimos documentos eliminados
      filterConditions.push({ term: { 'eliminado': false } });
    
      // Agregar filtros según los campos opcionales que se pasen
      if (filters.anio_publicacion) {
        filterConditions.push({ term: { 'anio_publicacion': filters.anio_publicacion } });
      }
    
      if (filters.autores) {
        filterConditions.push({ match: { 'autores': filters.autores } });
      }
    
      // Si el tipo es 'articulos-revistas', ajustar el campo de ordenamiento
      if (type === 'articulos-revistas') {
        sortBy = 'anio_revista';
      }
    
      // Crear consulta principal
      const queryBody = {
        from: from,
        size: size,
        query: {
          bool: {
            filter: filterConditions, // Siempre se aplican los filtros
            ...(query.trim()
              ? {
                  should: [ // Si el query no está vacío, aplicar búsqueda
                    {
                      multi_match: {
                        query: query,
                        fields: [
                          'titulo^3',
                          'autores^2',
                          'editores^2',
                          'editorial',
                          'abstract',
                          'nombre_revista^3',
                          'titulo_capitulo^3',
                          'titulo_libro^3',
                          'observaciones',
                          'mensaje_clave'
                        ],
                        fuzziness: 'AUTO',
                        prefix_length: 1,
                        minimum_should_match: '60%'
                      }
                    },
                    {
                      wildcard: {
                        "titulo": {
                          value: `*${query.toLowerCase()}*`,
                          boost: 2
                        }
                      }
                    },
                    {
                      wildcard: {
                        "abstract": {
                          value: `*${query.toLowerCase()}*`
                        }
                      }
                    }
                  ]
                }
              : {})
          }
        },
        sort: [
          { [sortBy]: { order: sortOrder as 'asc' | 'desc' } }
        ]
      };
    
      // Realizar búsqueda en Elasticsearch
      const result = await this.elasticsearchService.search({
        index: type,
        body: queryBody
      });
    
      return result.hits.hits;
    }
    
    
    async searchAllCollections(
      query: string = '', // Valor por defecto: cadena vacía
      page: number,
      size: number,
      filters: {
        anio_publicacion?: number;
        autores?: string;
        tipo_documento?: string;
      },
      sortBy: string = 'anio_publicacion',
      sortOrder: 'asc' | 'desc' = 'asc'
    ) {
      const from = (page - 1) * size;
    
      const filterConditions = [];
      
      filterConditions.push({ term: { 'eliminado': false } });
    
      // Agregar filtros según los campos opcionales que se pasen
      if (filters.anio_publicacion) {
        filterConditions.push({ term: { 'anio_publicacion': filters.anio_publicacion } });
      }
    
      if (filters.autores) {
        filterConditions.push({ match: { 'autores': filters.autores } });
      }
    
      if (filters.tipo_documento) {
        filterConditions.push({ term: { '_index': filters.tipo_documento } }); // Filtro por índice (tipo de documento)
      }
    
      const shouldConditions = query.trim() // Verifica si query tiene contenido significativo
      ? [
          {
            multi_match: {
              query: query,
              fields: [
                'titulo^3',
                'autores^2',
                'editores^2',
                'editorial',
                'abstract',
                'nombre_revista^3',
                'titulo_capitulo^3',
                'titulo_libro^3',
                'observaciones',
                'mensaje_clave'
              ],
              fuzziness: 'AUTO',
              prefix_length: 1,
              minimum_should_match: '60%'
            }
          },
          {
            wildcard: {
              "titulo": {
                value: `*${query.toLowerCase()}*`,
                boost: 2
              }
            }
          },
          {
            wildcard: {
              "abstract": {
                value: `*${query.toLowerCase()}*`
              }
            }
          }
        ]
      : []; // Si query está vacío, no añade condiciones `should`.

    
      const result = await this.elasticsearchService.search({
        index: 'libros,articulos-revistas,capitulos-libros,documentos-trabajo,ideas-reflexiones,policies-briefs,info-iisec',
        body: {
          from: from,
          size: size,
          query: {
            bool: {
              should: shouldConditions, // Aplica `should` solo si hay condiciones
              filter: filterConditions  // Aplica los filtros adicionales si se pasan
            }
          },
          sort: [
            { [sortBy]: { order: sortOrder } } // Aplicar ordenamiento según los parámetros proporcionados
          ]
        }
      });
    
      return result.hits.hits;
    }
    
    
    
    async getAllCollections(
      query: string,
      page: number,
      size: number,
      filters: {
        anio_publicacion?: number;
        autores?: string;
        tipo_documento?: string;
      },
      sortBy: string = 'anio_publicacion', // Campo por el que se desea ordenar, por defecto 'anio_publicacion'
      sortOrder: 'asc' | 'desc' = 'asc'
    ) {
      const from = (page - 1) * size;
  
      const filterConditions = [];
      
      filterConditions.push({ term: { 'eliminado': false } });
      
      // Agregar filtros según los campos opcionales que se pasen
      if (filters.anio_publicacion) {
        filterConditions.push({ term: { 'anio_publicacion': filters.anio_publicacion } });
      }
  
      if (filters.autores) {
        filterConditions.push({ match: { 'autores': filters.autores } });
      }
  
      if (filters.tipo_documento) {
        filterConditions.push({ term: { '_index': filters.tipo_documento } }); // Filtro por índice (tipo de documento)
      }
  
      const result = await this.elasticsearchService.search({
        index: 'libros,articulos-revistas,capitulos-libros,documentos-trabajo,ideas-reflexiones,policies-briefs,info-iisec',
        body: {
          from: from,
          size: size,
          query: {
            bool: {
              must: query
                ? [
                    {
                      multi_match: {
                        query: query,
                        fields: ['titulo', 'autores', 'abstract'],  // Ajusta los campos según tus necesidades
                        fuzziness: 'AUTO'
                      }
                    }
                  ]
                : [
                    { match_all: {} }
                  ],
              filter: filterConditions
            }
          },
          sort: [
            { [sortBy]: { order: sortOrder } }
          ]
        }
      });      
      return result.hits.hits;
    }

    // Búsqueda en un índice único con campo `tipo_documento`
    async searchByDocumentType(type: string, query: string) {
      const result = await this.elasticsearchService.search({
        index: 'documentos', // Índice único
        body: {
          query: {
            bool: {
              must: [
                { match: { tipo_documento: type } },
                { multi_match: { 
                    query: query,
                    fields: ['titulo', 'autores', 'abstract', 'anio_publicacion']
                  }
                }
              ]
            }
          }
        }
      });
      return result.hits.hits;
    }
}