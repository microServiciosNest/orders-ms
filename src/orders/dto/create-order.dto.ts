
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {

    // ANTES DE LA CREACION DEL MICROSERVICIO
    // @IsNumber()
    // @IsPositive()
    // totalAmount: number;

    // @IsNumber()
    // @IsPositive()
    // totalItems: number;

    // @IsEnum(OrderStatusList, {
    //     message: `Possible status values are ${OrderStatusList}`
    // })
    // @IsOptional()
    // status: OrderStatus = OrderStatus.PENDING;
    
    // @IsBoolean()
    // @IsOptional()
    // paid: boolean = false;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto )
    items: OrderItemDto[]


}
