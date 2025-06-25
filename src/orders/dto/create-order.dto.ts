
import { ArrayMinSize, IsArray, Validate } from "class-validator";
import { OrderItemDto } from "./OrderItem.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1)
    @Validate(OrderItemDto, { each: true } )
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}
