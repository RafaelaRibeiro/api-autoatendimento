import { Module } from '@nestjs/common';
import { MedicalFeesService } from './medical-fees.service';
import { MedicalFeesController } from './medical-fees.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { HelpersModule } from 'src/shared/helpers/helpers.module';

@Module({
  controllers: [MedicalFeesController],
  providers: [MedicalFeesService],
  imports: [PrismaModule, HelpersModule],
})
export class MedicalFeesModule {}
