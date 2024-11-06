import { Module } from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';
import { ServiceOrdersController } from './service-orders.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { HelpersModule } from 'src/shared/helpers/helpers.module';
import { CountersModule } from '../counters/counters.module';
import { PatientsModule } from '../patients/patients.module';

@Module({
  controllers: [ServiceOrdersController],
  providers: [ServiceOrdersService],
  imports: [PrismaModule, HelpersModule, CountersModule, PatientsModule],
})
export class ServiceOrdersModule {}
