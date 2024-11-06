import { Controller } from '@nestjs/common';
import { ServiceOrderItemsService } from './service-order-items.service';

@Controller('service-order-items')
export class ServiceOrderItemsController {
  constructor(private readonly serviceOrderItemsService: ServiceOrderItemsService) {}
}
