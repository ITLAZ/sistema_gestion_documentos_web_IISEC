// src/services/logs/logs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/schemas/logs.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  async createLog(logData: Partial<Log>): Promise<Log> {
    const newLog = new this.logModel(logData);
    return await newLog.save();
  }
}
