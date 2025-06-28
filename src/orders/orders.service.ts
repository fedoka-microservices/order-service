import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { ProductServiceClient} from 'src/common/clients/product-service-client';


@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService, private readonly productServiceClientTCP: ProductServiceClient){}

  async create(createOrderDto: CreateOrderDto) {
    const ids = createOrderDto.items.map(item => item.productId);
    const products = await this.productServiceClientTCP.validateProducts(ids)
    
    const totalAmount = createOrderDto.items.reduce((total, orderItem) => {
      const price = products.find(product => product.id === orderItem.productId)?.price ?? 0;
      return price * orderItem.quantity;
    }, 0)

    const totalItems = createOrderDto.items.reduce((total, orderItem) => {
      return total + orderItem.quantity;
    }, 0)

    const order = await this.prismaService.order.create({
      data: {
        totalAmount,
        totalItems,
        OrderItem: {
          createMany: {
            data:createOrderDto.items.map ( (orderItem) => ({
              price: products.find(product => product.id === orderItem.productId)?.price ?? 0,
              quantity: orderItem.quantity,
              productId: orderItem.productId
            }))
          }
        }
      },
      include: { OrderItem: {
        select:{
          price:true,
          quantity:true,
          productId:true,
        }
      }}
    });
    return  {...order, OrderItem: order.OrderItem.map(item => ({
      ...item,
      name: products.find(product => product.id === item.productId)?.name ?? 'Unknown Product',
    }))};
  }

  async findAll(orderPaginationDto:OrderPaginationDto) {
    const {status, page= 1, limit = 10} = orderPaginationDto;
    const where = status ? {status} : {};
    const totalPages = await this.prismaService.order.count({where});
    const skip = (page - 1) * limit;
    const take = limit;

    return {
      data: await this.prismaService.order.findMany({
        skip,
        take,
        where,
      }),
      meta: {
        totalPages: Math.ceil(totalPages / limit),
        currentPage: page,
      }
    }
  }

  async findOne(id: number) {
    const order = await this.prismaService.order.findFirst(
      {
      where:{id}, 
      include:{
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          }
        }
      }})
    if (!order) {
      throw new RpcException({status: HttpStatus.NOT_FOUND, message: 'order not found'})
    }
    const productIds = order.OrderItem.map(item => item.productId);
    const products = await this.productServiceClientTCP.validateProducts(productIds);
    return {...order, OrderItem: order.OrderItem.map(item => ({
      ...item,
      name: products.find(product => product.id === item.productId)?.name ?? 'Unknown Product',
    }))};
  }

  async updateStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }
    return  await this.prismaService.order.update({
      where: {id},
      data: {status}
    });
  }
}
