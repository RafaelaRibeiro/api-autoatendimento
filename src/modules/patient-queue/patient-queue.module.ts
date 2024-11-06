import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { HelpersModule } from 'src/shared/helpers/helpers.module';
import { PatientQueueService } from './patient-queue.service';
import { PatientQueueController } from './patient-queue.controller';
import { PatientQueueRepository } from './repositories/patient-queue.repository';

@Module({
  controllers: [PatientQueueController],
  providers: [PatientQueueService, PatientQueueRepository],
  imports: [PrismaModule, HelpersModule],
})
export class PatientQueueModule {}
