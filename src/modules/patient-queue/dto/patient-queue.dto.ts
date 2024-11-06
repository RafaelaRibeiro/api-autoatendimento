import { IsInt, IsString } from 'class-validator';

export class AddPassToPatientQueueDTO {
  @IsInt()
  patientQueue: number;

  @IsString()
  receptionDepartment: string;

  @IsString()
  prefix: string;
}
