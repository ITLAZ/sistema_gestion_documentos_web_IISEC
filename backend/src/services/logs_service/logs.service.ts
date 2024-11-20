// src/services/logs/logs.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/schemas/logs.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  async createLog(logData: Partial<Log>): Promise<Log> {
    try {
      const newLog = new this.logModel(logData);
      return await newLog.save();
    } catch (error) {
      console.error('Error al crear el log:', error.message);
      throw new InternalServerErrorException('No se pudo crear el log');
    }
  }

  async createLogDocument(logData: Partial<Log>): Promise<Log>{
    try{
      const newLog = new this.logModel(logData);
      return await newLog.save();
    } catch(error) {
      console.error("Error el crear log: ",error);
      throw new InternalServerErrorException('No se pudo crear el log');
    }
  }
}
