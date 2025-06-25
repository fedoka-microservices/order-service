import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from './config/services';
import { envs } from './config/envs';
import { ProductServiceClientTCP } from 'src/common/clients/product-service-client.tcp';

@Module({
  imports: [
   ClientsModule.register([
      { name: PRODUCT_SERVICE, transport: Transport.TCP, options:{
        host: envs.productServiceHost,
        port: envs.productServicesPort,
      } },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, ProductServiceClientTCP],
})
export class OrdersModule {}
