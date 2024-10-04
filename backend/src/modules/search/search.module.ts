import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from 'src/services/search/search.service';

@Module({
    imports: [
      ElasticsearchModule.register({
        node: 'http://localhost:9200', // Cambia según tu configuración de Elasticsearch
      }),
    ],
    providers: [SearchService],
    exports: [SearchService],
  })
  export class SearchModule {}
