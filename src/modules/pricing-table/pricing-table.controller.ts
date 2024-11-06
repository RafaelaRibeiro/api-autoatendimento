import { Controller } from '@nestjs/common';
import { PricingTableService } from './pricing-table.service';

@Controller('pricing-table')
export class PricingTableController {
  constructor(private readonly pricingTableService: PricingTableService) {}
}
