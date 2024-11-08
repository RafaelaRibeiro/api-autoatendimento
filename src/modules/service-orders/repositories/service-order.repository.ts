import { Injectable } from '@nestjs/common';
import { CountersService } from 'src/modules/counters/counters.service';
import { PatientsService } from 'src/modules/patients/patients.service';
import { HelpersService } from 'src/shared/helpers/helpers.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateServiceOrderDTO } from '../service-orders.dto';

@Injectable()
export class ServiceOrderRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patientsService: PatientsService,
    private readonly counterService: CountersService,
    private readonly helpersService: HelpersService,
  ) {}

  async CreateServiceOrder(data: CreateServiceOrderDTO) {
    let patient = await this.patientsService.checkBeneficiaryCode(
      data.beneficiaryCode,
    );
    if (!patient) {
      patient = await this.patientsService.checkBeneficiaryCPF(data.cpf);
    }

    const serviceOrderNumber =
      await this.counterService.incrementServiceOrderCounter();

    return await this.prisma.oSM.create({
      data: {
        OSM_SERIE: Number(this.helpersService.generateSeries()),
        OSM_PAC: patient.PAC_REG,
        OSM_NUM: serviceOrderNumber,
        OSM_DTHR: this.helpersService.getAdjustedCurrentDateTime(),
        OSM_CNV: data.insurance,
        OSM_MREQ: 999,
        OSM_PROC: 'A',
        OSM_STR: data.receptionDepartment,
        OSM_IND_URG: 'N',
        OSM_DT_RESULT: this.helpersService.getAdjustedCurrentDateTime(),
        OSM_ATEND: 'ASS',
        OSM_CID_COD: 'Z000',
        OSM_DT_SOLIC: this.helpersService.getAdjustedCurrentDateTime(),
        OSM_LEG_COD: 'WEB',
        OSM_USR_LOGIN_CAD: 'IUC',
        OSM_TIPO_ACIDENTE: 2,
        OSM_TISS_TIPO_SAIDA: '5',
        OSM_TISS_TIPO_ATENDE: '05',
        OSM_MREQ_IND_SLINE: 'S',
        FLE: {
          create: {
            FLE_DTHR_CHEGADA: this.helpersService.getAdjustedCurrentDateTime(),
            FLE_PSV_COD: data.waitingList || 294,
            FLE_STR_COD: data.receptionDepartment,
            FLE_PAC_REG: patient.PAC_REG,
            FLE_ORDEM: 1,
            FLE_STATUS: 'A',
            FLE_USR_LOGIN: 'IUC',
            FLE_OBS: 'AUTO ATENDIMENTO',
            FLE_PSV_RESP: data.waitingList || 294,
            FLE_DTHR_REG: this.helpersService.getAdjustedCurrentDateTime(),
            FLE_PROCED: 'TOT',
          },
        },
      },
    });
  }
}
