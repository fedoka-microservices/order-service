import {  Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ProductDto } from "./dto/product.dto";
import { NATS_SERVICE } from "src/orders/config/services";



@Injectable()
export class ProductServiceClientTCP {
    private readonly logger = new Logger('Product-service-client-tcp');
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy){}
    
    async validateProducts(ids:number[]):Promise<ProductDto[]> {
        try {
            return await firstValueFrom(this.client.send({cmd:'validate_product'}, ids));
        } catch(error) {
            this.logger.error(`error validating products: ${error}`);
            throw new RpcException(error)
        }
        
    }   
}