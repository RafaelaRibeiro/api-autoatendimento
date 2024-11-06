import { Module } from '@nestjs/common';
import { ServiceOrderItemsService } from './service-order-items.service';
import { ServiceOrderItemsController } from './service-order-items.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { HelpersModule } from 'src/shared/helpers/helpers.module';

@Module({
  controllers: [ServiceOrderItemsController],
  providers: [ServiceOrderItemsService],
  imports: [PrismaModule, HelpersModule],
})
export class ServiceOrderItemsModule {}
