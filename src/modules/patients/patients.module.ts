import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PatientsRepository } from './repositories/patients.repository';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PatientsRepository],
  imports: [PrismaModule],
  exports: [PatientsService],
})
export class PatientsModule {}
