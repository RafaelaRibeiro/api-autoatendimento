import { Module } from '@nestjs/common';
import { CountersService } from './counters.service';
import { CountersController } from './counters.controller';
import { HelpersModule } from 'src/shared/helpers/helpers.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CountersRepository } from './repositories/counters.repository';

@Module({
  controllers: [CountersController],
  providers: [CountersService, CountersRepository],
  imports: [HelpersModule, PrismaModule],
  exports: [CountersService],
})
export class CountersModule {}
