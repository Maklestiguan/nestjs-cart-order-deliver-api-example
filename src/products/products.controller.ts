import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ProductDto, ProductQuantityDto } from './dtos/product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
    constructor(private readonly _productsService: ProductsService) {}

    @Get('/:productId')
    async get(
        @Param('productId', new ParseIntPipe()) id: number,
    ): Promise<ProductDto> {
        const product = await this._productsService.getOneById(id)

        return {
            productId: product.id,
            ...product,
        }
    }

    @Get('/:productId/quantity')
    async getProductQuantity(
        @Param('productId') id: number,
        @Query('storeIds')
        storeIds: number[],
    ): Promise<ProductQuantityDto | Partial<ProductQuantityDto>> {
        return await this._productsService.getProductQuantity({
            productId: id,
            storeIds,
        })
    }
}
