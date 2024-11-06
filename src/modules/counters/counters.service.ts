import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CountersRepository } from './repositories/counters.repository';

@Injectable()
export class CountersService {
  private logger = new Logger(CountersService.name);

  constructor(private readonly countersRepository: CountersRepository) {}

  async incrementServiceOrderCounter(): Promise<number> {
    try {
      return await this.countersRepository.incrementServiceOrderCounter();
    } catch (error) {
      this.logger.error(
        'Error incrementing service order counter',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Erro ao incrementar contador de ordem de serviço',
      );
    }
  }

  async incrementPatientCounter(): Promise<number> {
    try {
      return await this.countersRepository.incrementPatientCounter();
    } catch (error) {
      this.logger.error('Error incrementing patient counter', error.stack);
      throw new InternalServerErrorException(
        'Erro ao incrementar contador de paciente',
      );
    }
  }
}
