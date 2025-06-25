import { OrderStatus } from "@prisma/client";
import { IsEnum, IsNumber } from "class-validator";

export class ChangeOrderStatusDto {
    @IsNumber()
    id: number;
    @IsEnum(OrderStatus, {message: `valid status are ${Object.values(OrderStatus).join(', ')}`})
    status: OrderStatus;
}