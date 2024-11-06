import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

type PatientCondition = { PAC_MCNV?: string; PAC_NUMCPF?: string };
@Injectable()
export class PatientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkBeneficiaryCode(id: string): Promise<{ PAC_REG: number } | null> {
    return this.findPatient({ PAC_MCNV: id });
  }

  async checkBeneficiaryCPF(cpf: string): Promise<{ PAC_REG: number } | null> {
    return this.findPatient({ PAC_NUMCPF: cpf });
  }
  /**
   * Reutiliza a lógica de busca de pacientes com base na condição fornecida.
   * Retorna o PAC_REG do paciente ou null se não encontrado.
   */
  private async findPatient(
    condition: PatientCondition,
  ): Promise<{ PAC_REG: number } | null> {
    return await this.prisma.pAC.findFirst({
      where: condition,
      select: { PAC_REG: true },
    });
  }
}
