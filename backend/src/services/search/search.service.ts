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
    async searchByType(type: string, query: string) {
      const result = await this.elasticsearchService.search({
        index: type,  // Especifica el índice (tipo de documento) en el que se va a realizar la búsqueda
        body: {
          query: {
            multi_match: {  // Utiliza multi_match para buscar en varios campos
              query: query,  // El término de búsqueda
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
              ]
            }
          }
        }
      });
      return result.hits.hits;  // Devuelve los documentos que coinciden con la búsqueda
    }
    
    
    async searchInAll(query: string) {
      const result = await this.elasticsearchService.search({
        index: 'libros,articulos-revistas,capitulos-libros,documentos-trabajo,ideas-reflexiones,policies-briefs,info-iisec',
        body: {
          query: {
            dis_max: {
              queries: [
                { match: { 'titulo': query } },
                { match: { 'autores': query } },
                { match: { 'abstract': query } },
                { match: { 'nombre_revista': query } },
                { match: { 'titulo_capitulo': query } },
                { match: { 'titulo_libro': query } },
                { match: { 'observaciones': query } },
                { match: { 'mensaje_clave': query } },
                { match: {'editorial': query } },
                { match: {'editores': query } },
              ],
              tie_breaker: 0.7 // Esto permite que las colecciones que no tienen el mejor match sigan apareciendo
            }
          }
        }
      });
    
      return result.hits.hits;
    }
    
    async searchAllCollections(query: string, page: number, size: number, filters: { anio_publicacion?: number, autores?: string, tipo_documento?: string }) {
      const from = (page - 1) * size;
    
      const filterConditions = [];
    
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
          from: from,    // Para la paginación: desde qué registro comenzar
          size: size,    // Tamaño de página: cuántos registros devolver
          query: {
            bool: {
              must: [
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
                    ]
                  }
                }
              ],
              filter: filterConditions  // Aplica los filtros adicionales si se pasan
            }
          }
        }
      });
    
      return result.hits.hits;
    }
    
    async getAllCollections(query: string, page: number, size: number, filters: { anio_publicacion?: number; autores?: string; tipo_documento?: string; }) {
      const from = (page - 1) * size;
    
      const filterConditions = [];
    
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
          from: from,    // Para la paginación: desde qué registro comenzar
          size: size,    // Tamaño de página: cuántos registros devolver
          query: {
            bool: {
              must: [
                { match_all: {} }  // Devuelve todos los documentos
              ],
              filter: filterConditions  // Aplica los filtros adicionales si se pasan
            }
          },
          sort: [
            { 'anio_publicacion': { order: 'desc' } }  // Ordenar por anio_publicacion de mayor a menor
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