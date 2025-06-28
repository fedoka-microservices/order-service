import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ProductServiceClient } from 'src/common/clients/product-service-client';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [
    NatsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, ProductServiceClient],
})
export class OrdersModule {}
