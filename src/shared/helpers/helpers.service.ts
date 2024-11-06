import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HelpersService {
  constructor(private readonly prisma: PrismaService) {}
  getAdjustedCurrentDateTime() {
    const now = new Date();
    now.setHours(now.getHours() - 3);
    return now;
  }

  generateSeries(): string {
    return '' + 1 + (Number(new Date().getFullYear()) % 100);
  }

  getDateRangeForToday(): { start: Date; end: Date } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return { start: today, end: tomorrow };
  }

  async findAllHolidays() {
    const year = new Date().getFullYear();

    try {
      const holidays = await this.prisma.cAL.findMany({
        where: {
          CAL_STR_COD: '999',
          CAL_DTHR1: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1),
          },
        },
        select: {
          CAL_DTHR1: true,
          CAL_DTHR2: true,
        },
      });

      return holidays;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar os feriados: ${error}`,
      );
    }
  }
}
