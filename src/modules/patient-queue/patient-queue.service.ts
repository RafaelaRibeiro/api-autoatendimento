import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PatientQueueResponse } from './interfaces/patient-queue.interface';
import { PatientQueueRepository } from './repositories/patient-queue.repository';
import { AddPassToPatientQueueDTO } from './dto/patient-queue.dto';

@Injectable()
export class PatientQueueService {
  private readonly logger = new Logger(PatientQueueService.name);

  constructor(
    private readonly patientQueueRepository: PatientQueueRepository,
  ) {}

  async findAll(doctorCode: number): Promise<PatientQueueResponse[]> {
    try {
      const patientQueue =
        await this.patientQueueRepository.findAll(doctorCode);

      if (patientQueue.length === 0) {
        throw new NotFoundException(
          `Nenhuma fila encontrada. Código do parâmetro: ${doctorCode}`,
        );
      }

      return patientQueue;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Error finding patient queues for doctor code ${doctorCode}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Erro ao buscar a fila do médico ${doctorCode}`,
      );
    }
  }

  async addPassToWaitingList(
    data: AddPassToPatientQueueDTO,
  ): Promise<{ message: string; passNumber: string; arrivalTime: Date }> {
    try {
      return await this.patientQueueRepository.addPassToPatientQueue(data);
    } catch (error) {
      this.logger.error('Error adding pass to patient queue', error.stack);
      throw new InternalServerErrorException(
        'Erro ao salvar a senha na fila de espera',
      );
    }
  }
}
