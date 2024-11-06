import { Controller } from '@nestjs/common';
import { MedicalFeesService } from './medical-fees.service';

@Controller('medical-fees')
export class MedicalFeesController {
  constructor(private readonly medicalFeesService: MedicalFeesService) {}
}
