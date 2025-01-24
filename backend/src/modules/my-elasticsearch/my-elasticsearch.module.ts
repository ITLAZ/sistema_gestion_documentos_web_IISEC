import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MyElasticsearchService } from 'src/services/my-elasticsearch/my-elasticsearch.service';

@Module({
    imports: [
        ElasticsearchModule.register({
            node: 'http://localhost:9200', // Asegúrate de que esta sea la URL correcta de tu instancia de Elasticsearch.
          }),
          
    ],
    providers: [MyElasticsearchService],
    exports: [ElasticsearchModule], // Exporta para otros módulos
  })
export class MyElasticsearchModule {}
