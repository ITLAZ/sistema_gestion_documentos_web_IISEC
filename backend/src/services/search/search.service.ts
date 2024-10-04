import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexData(index: string, data: any) {
    return this.elasticsearchService.index({
      index,
      body: data,
    });
  }

  async search(index: string, query: any): Promise<SearchResponse<any>> { // Asegúrate de que el tipo de retorno sea SearchResponse
    return this.elasticsearchService.search({
      index,
      body: {
        query,
      },
    });
  }
}