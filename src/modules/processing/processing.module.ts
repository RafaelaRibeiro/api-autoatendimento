import { Module } from '@nestjs/common';
import { ProcessingService } from './processing.service';
import { ProcessingController } from './processing.controller';

@Module({
  controllers: [ProcessingController],
  providers: [ProcessingService],
})
export class ProcessingModule {}
