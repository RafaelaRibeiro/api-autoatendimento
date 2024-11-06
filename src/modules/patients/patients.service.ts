import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PatientsRepository } from './repositories/patients.repository';

@Injectable()
export class PatientsService {
  private logger = new Logger(PatientsService.name);

  constructor(private readonly patientsRepository: PatientsRepository) {}

  async checkBeneficiaryCode(id: string): Promise<{ PAC_REG: number }> {
    return this.findPatient(
      () => this.patientsRepository.checkBeneficiaryCode(id),
      `Beneficiary Code: ${id}`,
    );
  }

  async checkBeneficiaryCPF(cpf: string): Promise<{ PAC_REG: number }> {
    return this.findPatient(
      () => this.patientsRepository.checkBeneficiaryCPF(cpf),
      `CPF: ${cpf}`,
    );
  }

  private async findPatient(
    findFunction: () => Promise<{ PAC_REG: number } | null>,
    contextInfo: string,
  ): Promise<{ PAC_REG: number }> {
    try {
      const patient = await findFunction();

      if (!patient) {
        throw new NotFoundException('Paciente não encontrado');
      }

      return patient;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error finding patient (${contextInfo}) in ${findFunction.name}`,
        error.stack,
      );
      throw new InternalServerErrorException('Erro ao buscar o paciente');
    }
  }
}
