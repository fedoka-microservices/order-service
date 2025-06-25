import { OrderStatus } from "@prisma/client";


export const OrderStatusList = [
    OrderStatus.CANCELLED,
    OrderStatus.PENDING,
    OrderStatus.PAID,
    OrderStatus.CREDIT,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
];