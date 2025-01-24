import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

type ElasticsearchHit = {
  _id: string;
  _source: {
    titulo: string;
    autores: string[];
    abstract?: string;
    // Agrega otros campos relevantes aquí
  };
};

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

  async getAllDocuments(index: string): Promise<ElasticsearchHit[]> {
    try {
      const result = await this.elasticsearchService.search({
        index,
        body: {
          query: {
            match_all: {}, // Obtiene todos los documentos del índice
          },
        },
        size: 10000, // Ajusta el tamaño según la cantidad de documentos en tu índice
      });
  
      return result.hits.hits.map((hit: any) => ({
        _id: hit._id,
        _source: hit._source as ElasticsearchHit['_source'], // Casting explícito
      }));
    } catch (error) {
      console.error(`Error al obtener documentos del índice ${index}:`, error);
      throw new Error(`No se pudieron obtener documentos del índice ${index}.`);
    }
  }
   

    // Búsqueda por tipo de documento (índice específico)
    async searchByType(
      type: string,
      query: string,
      page: number,
      size: number,
      filters: {
        anio_publicacion?: { start?: number; end?: number }; // Rango de años
        autores?: string | string[]; // Lista de autores
      },
      sortBy: string = 'anio_publicacion',
      sortOrder: 'asc' | 'desc' = 'asc'
    ) {
      const from = (page - 1) * size;
      const filterConditions: any[] = [];
    
      // Siempre excluimos documentos eliminados
      filterConditions.push({ term: { eliminado: false } });
    
      // Filtrar por rango de años (anio_publicacion)
      if (filters.anio_publicacion) {
        const rangeFilter: any = {};
        if (filters.anio_publicacion.start !== undefined) {
          rangeFilter.gte = filters.anio_publicacion.start; // Mayor o igual que el año inicial
        }
        if (filters.anio_publicacion.end !== undefined) {
          rangeFilter.lte = filters.anio_publicacion.end; // Menor o igual que el año final
        }
        filterConditions.push({ range: { anio_publicacion: rangeFilter } });
      }
    
      // Filtrar por autores
      if (filters.autores) {
        const autoresArray = Array.isArray(filters.autores) ? filters.autores : [filters.autores];
        autoresArray.forEach((autor) => {
          filterConditions.push({
            match: {
              autores: {
                query: autor,
                operator: 'and', // Asegura coincidencia exacta para el autor
              },
            },
          });
        });
      }
    
      // Ajustar el ordenamiento
      if (type === 'articulos-revistas') {
        sortBy = 'anio_revista';
      }
    
      if (sortBy === 'titulo') {
        sortBy = 'titulo.keyword'; // Usa el subcampo keyword para evitar errores
      } else if (sortBy === 'autor') {
        sortBy = 'autor.keyword';
      }
    
      // Crear consulta principal
      const queryBody = {
        from,
        size,
        query: {
          bool: {
            must: query.trim()
              ? [
                  {
                    multi_match: {
                      query,
                      fields: [
                        'titulo^6',
                        'autores^4',
                        'editores^2',
                        'editorial^2',
                        'abstract^1',
                        'nombre_revista^6',
                        'titulo_capitulo^6',
                        'titulo_libro^6',
                        'observaciones^1',
                        'mensaje_clave^1',
                      ],
                      fuzziness: 'AUTO',
                      prefix_length: 1,
                      minimum_should_match: '60%',
                    },
                  },
                  {
                    match_phrase_prefix: {
                      titulo: {
                        query: query.toLowerCase(),
                        boost: 2,
                      },
                    },
                  },
                ]
              : [], // Si no hay query, no añadimos condiciones `must`
            filter: filterConditions, // Aplicar filtros
          },
        },
        sort: [{ [sortBy]: { order: sortOrder } }],
      };
    
      console.log(JSON.stringify(queryBody, null, 2));
    
      // Realizar búsqueda en Elasticsearch
      const result = await this.elasticsearchService.search({
        index: type,
        body: queryBody,
      });
    
      return result.hits.hits.map((hit: any) => hit._source);
    }    

    
    async searchAllCollections(
      query: string = '', // Valor por defecto: cadena vacía
      page: number,
      size: number,
      filters: {
        anio_publicacion?: { start?: number; end?: number }; // Rango de años
        autores?: string | string[]; // Lista de autores
        tipo_documento?: string;
      },
      sortBy: string = 'anio_publicacion',
      sortOrder: 'asc' | 'desc' = 'asc'
    ) {
      const from = (page - 1) * size;
      const filterConditions: any[] = [];

      // Siempre excluimos documentos eliminados
      filterConditions.push({ term: { eliminado: false } });

      // Agregar filtro por rango de años si se proporcionan los parámetros anio_inicio y anio_fin
      if (filters.anio_publicacion?.start || filters.anio_publicacion?.end) {
        filterConditions.push({
          range: {
            anio_publicacion: {
              gte: filters.anio_publicacion?.start || undefined, // A partir del año de inicio
              lte: filters.anio_publicacion?.end || undefined,   // Hasta el año de fin
            },
          },
        });
      }

      // Agregar filtro por autores
      if (filters.autores) {
        const autoresArray = Array.isArray(filters.autores) ? filters.autores : [filters.autores];
        autoresArray.forEach((autor) => {
          filterConditions.push({
            match: {
              autores: {
                query: autor,
                operator: 'and', // Asegura coincidencia exacta para el autor
              },
            },
          });
        });
      }

      // Agregar filtro por tipo de documento
      if (filters.tipo_documento) {
        filterConditions.push({ term: { '_index': filters.tipo_documento } }); // Filtro por índice
      }

      // Ajustar ordenamiento
      if (sortBy === 'titulo') {
        sortBy = 'titulo.keyword'; // Usa el subcampo keyword para evitar errores
      } else if (sortBy === 'autor') {
        sortBy = 'autor.keyword';
      }

      // Crear condiciones del query principal
      const queryBody = {
        from,
        size,
        query: {
          bool: {
            must: query.trim()
              ? [
                  {
                    multi_match: {
                      query,
                      fields: [
                        'titulo^6',
                        'autores^4',
                        'editores^2',
                        'editorial^2',
                        'abstract^1',
                        'nombre_revista^6',
                        'titulo_capitulo^6',
                        'titulo_libro^6',
                        'observaciones^1',
                        'mensaje_clave^1',
                      ],
                      fuzziness: 'AUTO',
                      prefix_length: 1,
                      minimum_should_match: '60%',
                    },
                  },
                  {
                    match_phrase_prefix: {
                      titulo: {
                        query: query.toLowerCase(),
                        boost: 2,
                      },
                    },
                  },
                ]
              : [], // Si no hay query, no añadimos condiciones `must`
            filter: filterConditions, // Aplicar filtros
          },
        },
        sort: [{ [sortBy]: { order: sortOrder } }],
      };

      console.log(JSON.stringify(queryBody, null, 2));

      // Realizar búsqueda en Elasticsearch
      const result = await this.elasticsearchService.search({
        index: 'libros,articulos-revistas,capitulos-libros,documentos-trabajo,ideas-reflexiones,policies-briefs,info-iisec', // Todos los índices
        body: queryBody,
      });

      return result.hits.hits;
    }
    
    async getAllCollections(
      query: string,
      page: number,
      size: number,
      filters: {
        anio_inicio?: number;  // Año de inicio
        anio_fin?: number;     // Año de fin
        autores?: string;      // Filtro por autor
        tipo_documento?: string;  // Filtro por tipo de documento
      },
      sortBy: string = 'anio_publicacion', // Campo por el que se desea ordenar, por defecto 'anio_publicacion'
      sortOrder: 'asc' | 'desc' = 'asc'
    ) {
      const from = (page - 1) * size;
    
      const filterConditions = [];
    
      // Siempre excluimos documentos eliminados
      filterConditions.push({ term: { 'eliminado': false } });
    
      // Agregar filtro por rango de años si se proporcionan los parámetros anio_inicio y anio_fin
      if (filters.anio_inicio || filters.anio_fin) {
        filterConditions.push({
          range: {
            anio_publicacion: {
              gte: filters.anio_inicio || undefined, // A partir del año de inicio
              lte: filters.anio_fin || undefined,     // Hasta el año de fin
            },
          },
        });
      }
    
      // Agregar filtro por autores
      if (filters.autores) {
        filterConditions.push({
          match: { 'autores': filters.autores }
        });
      }
    
      // Agregar filtro por tipo de documento
      if (filters.tipo_documento) {
        filterConditions.push({ term: { '_index': filters.tipo_documento } }); // Filtro por índice (tipo de documento)
      }
    
      // Ajustar ordenamiento por los campos especificados
      if (sortBy === 'titulo') {
        sortBy = 'titulo.keyword'; // Usa el subcampo keyword para evitar errores
      } else if (sortBy === 'autor') {
        sortBy = 'autor.keyword';
      }
    
      // Realizar la búsqueda en Elasticsearch
      const result = await this.elasticsearchService.search({
        index: 'libros,articulos-revistas,capitulos-libros,documentos-trabajo,ideas-reflexiones,policies-briefs,info-iisec', // Todos los índices
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
                        fuzziness: 'AUTO',
                      },
                    },
                  ]
                : [
                    { match_all: {} }, // Si no hay término de búsqueda, traer todos
                  ],
              filter: filterConditions, // Aplicar todos los filtros
            },
          },
          sort: [
            { [sortBy]: { order: sortOrder } },
          ],
        },
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