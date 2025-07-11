import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "./pagination.dto";

import { OrderStatusList } from "../enum/order.enum";
import { OrderStatus } from "@prisma/client";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {message:  `valid status are ${OrderStatusList}`})
    status: OrderStatus;
}