import { IsInt, IsNotEmpty, IsString, IsNumber, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

class AddProduct{
    @IsString()
    @IsNotEmpty()
    productId:string

    @IsString()
    @IsNotEmpty()
    shopId:string

    @IsInt()
    @IsNotEmpty()
    quantity:number

    @IsString()
    @IsNotEmpty()
    name:string

    @IsNumber()
    @IsNotEmpty()
    "price":599000
}
export class AddCart{
    @IsInt()
    @IsNotEmpty()
    userId:number

    @ValidateNested()  // Validate nested class
    @Type(() => AddProduct)  // Correctly transform nested object
    product: AddProduct;
}


