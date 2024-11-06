import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HelpersService } from 'src/shared/helpers/helpers.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PatientQueueResponse } from '../interfaces/patient-queue.interface';
import { AddPassToPatientQueueDTO } from '../dto/patient-queue.dto';
import { PATIENT_QUEUE_CONSTANTS } from '../constants/patient-queue.constants';

@Injectable()
export class PatientQueueRepository {
  private readonly logger = new Logger(PatientQueueRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpersService: HelpersService,
  ) {}

  async findAll(doctorCode: number): Promise<PatientQueueResponse[]> {
    return this.prisma.psv_totem.findMany({
      where: {
        psv_t_psv_cod: doctorCode,
      },
      select: {
        psv_t_prefixo: true,
        psv_t_titulo: true,
      },
    });
  }

  async addPassToPatientQueue(
    data: AddPassToPatientQueueDTO,
  ): Promise<{ message: string; passNumber: string; arrivalTime: Date }> {
    const lastPassNumber = await this.getLastPassNumber(
      data.prefix,
      data.patientQueue,
    );
    const newPassNumber = this.generateNewPassNumber(
      data.prefix,
      lastPassNumber,
    );
    const currentDateTime = this.helpersService.getAdjustedCurrentDateTime();

    const list = await this.prisma.fLE.create({
      data: {
        FLE_DTHR_CHEGADA: currentDateTime,
        FLE_DTHR_CHEGADA_INICIAL: currentDateTime,

        FLE_PSV_COD: data.patientQueue,
        FLE_STR_COD: data.receptionDepartment,
        FLE_PAC_REG: PATIENT_QUEUE_CONSTANTS.REGISTER_PATIENT,
        FLE_ORDEM: PATIENT_QUEUE_CONSTANTS.ORDER, //AJUSTAR
        FLE_STATUS: PATIENT_QUEUE_CONSTANTS.LIST_STATUS,
        FLE_USR_LOGIN: PATIENT_QUEUE_CONSTANTS.USR_LOGIN,
        FLE_OBS: `SENHA #${newPassNumber} (Atendimento Normal)`,
        FLE_BIP: newPassNumber,
        FLE_PSV_RESP: data.patientQueue,
        FLE_DTHR_REG: currentDateTime,
        FLE_PROCED: PATIENT_QUEUE_CONSTANTS.PROCESS,
        fle_preferencial: 'N',
      },

      select: {
        FLE_DTHR_CHEGADA: true,
        FLE_BIP: true,
      },
    });

    console.log(list);

    return {
      message: 'Senha incluída com sucesso',
      passNumber: newPassNumber,
      arrivalTime: list.FLE_DTHR_CHEGADA,
    };
  }

  private async getLastPassNumber(prefix: string, patientQueue: number) {
    try {
      const { start, end } = this.helpersService.getDateRangeForToday();
      const lastPassNumber = await this.prisma.fLE.count({
        where: {
          FLE_BIP: { startsWith: prefix },
          FLE_PROCED: PATIENT_QUEUE_CONSTANTS.PROCESS,
          FLE_PSV_COD: patientQueue,
          FLE_DTHR_CHEGADA: {
            gte: start,
            lte: end,
          },
        },
      });

      console.log(lastPassNumber);

      return lastPassNumber;
    } catch (error) {
      this.logger.error('Error fetching last pass number', error.stack);
      throw new InternalServerErrorException('Erro ao buscar a última senha');
    }
  }

  generateNewPassNumber(prefix: string, lastPassNumber: number) {
    const newPassNumber = lastPassNumber + 1;
    const paddedPassNumber = String(newPassNumber).padStart(3, '0');
    return `${prefix}${paddedPassNumber}`;
  }
}
