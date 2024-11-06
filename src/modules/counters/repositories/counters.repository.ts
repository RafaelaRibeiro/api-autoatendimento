import { Injectable } from '@nestjs/common';
import { HelpersService } from 'src/shared/helpers/helpers.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CounterType } from '../types/counters.types';

@Injectable()
export class CountersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpersService: HelpersService,
  ) {}

  private async incrementCounter(
    type: CounterType,
    series: number,
  ): Promise<number> {
    const counter = await this.prisma.cNT.findFirst({
      where: { CNT_TIPO: type, CNT_SERIE: series },
    });

    const newCounterValue = counter ? counter.CNT_NUM + 1 : 1;

    await this.prisma.cNT.upsert({
      where: { CNT_TIPO_CNT_SERIE: { CNT_TIPO: type, CNT_SERIE: series } },
      create: { CNT_TIPO: type, CNT_SERIE: series, CNT_NUM: newCounterValue },
      update: { CNT_NUM: newCounterValue },
    });

    return newCounterValue;
  }

  async incrementServiceOrderCounter(): Promise<number> {
    return this.incrementCounter(
      'OSM',
      Number(this.helpersService.generateSeries()),
    );
  }

  async incrementPatientCounter(): Promise<number> {
    return this.incrementCounter('PAC', 0);
  }
}
