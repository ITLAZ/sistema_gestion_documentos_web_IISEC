import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class MyElasticsearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200', // URL desde variable de entorno
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME || '', // Usuario opcional
          password: process.env.ELASTICSEARCH_PASSWORD || '', // Contraseña opcional
        },
      });
  }

  /**
   * Actualiza un documento en Elasticsearch
   * @param index Índice donde se encuentra el documento
   * @param id ID del documento a actualizar
   * @param body Contenido de la actualización
   */
  async update(index: string, id: string, body: object): Promise<any> {
    try {
      if (!index || !id || !body) {
        throw new InternalServerErrorException(
          'El índice, el ID y el cuerpo de la actualización son obligatorios.'
        );
      }

      return await this.client.update({
        index,
        id,
        body,
      });
    } catch (error) {
      console.error('Error al actualizar el documento en Elasticsearch:', error);
      throw new InternalServerErrorException(
        'Error al actualizar el documento en Elasticsearch.'
      );
    }
  }

  /**
   * Obtiene un documento por su ID
   * @param index Índice donde se encuentra el documento
   * @param id ID del documento
   */
  async getById(index: string, id: string): Promise<any> {
    try {
      return await this.client.get({
        index,
        id,
      });
    } catch (error) {
      console.error('Error al obtener el documento en Elasticsearch:', error);
      throw new InternalServerErrorException(
        'Error al obtener el documento en Elasticsearch.'
      );
    }
  }

  /**
   * Elimina un documento por su ID
   * @param index Índice donde se encuentra el documento
   * @param id ID del documento a eliminar
   */
  async delete(index: string, id: string): Promise<any> {
    try {
      return await this.client.delete({
        index,
        id,
      });
    } catch (error) {
      console.error('Error al eliminar el documento en Elasticsearch:', error);
      throw new InternalServerErrorException(
        'Error al eliminar el documento en Elasticsearch.'
      );
    }
  }
}

