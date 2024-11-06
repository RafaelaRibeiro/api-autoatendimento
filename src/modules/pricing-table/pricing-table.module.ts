import { Module } from '@nestjs/common';
import { PricingTableService } from './pricing-table.service';
import { PricingTableController } from './pricing-table.controller';

@Module({
  controllers: [PricingTableController],
  providers: [PricingTableService],
})
export class PricingTableModule {}
