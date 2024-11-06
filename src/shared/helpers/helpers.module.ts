import { Module } from '@nestjs/common';
import { HelpersService } from './helpers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [HelpersService],
  exports: [HelpersService],
  imports: [PrismaModule],
})
export class HelpersModule {}
