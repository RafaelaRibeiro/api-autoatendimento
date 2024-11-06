import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PatientQueueService } from './patient-queue.service';
import { AddPassToPatientQueueDTO } from './dto/patient-queue.dto';

@Controller('patient-queue')
export class PatientQueueController {
  constructor(private readonly patientQueueService: PatientQueueService) {}

  @Get(':doctorCode')
  async findAll(@Param('doctorCode', ParseIntPipe) doctorCode: number) {
    return this.patientQueueService.findAll(doctorCode);
  }

  @Post()
  async addBipToWaitingList(@Body() data: AddPassToPatientQueueDTO) {
    return this.patientQueueService.addPassToWaitingList(data);
  }
}
