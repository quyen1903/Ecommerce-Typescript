import {
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsString,
    IsEnum,
    ValidateNested,
    IsObject,
    validate
} from 'class-validator';
import { Clothing } from './product/clothing.products';
import { Electronics } from './product/electronic.products';
import { Furniture } from './product/furniture.products';

enum ProductType {
    CLOTHING = 'Clothing',
    ELECTRONICS = 'Electronics',
    FURNITURE = 'Furniture',
}

export class CreateProductDTO {
    @IsNotEmpty()
    @IsString()
    product_name: string;

    @IsNotEmpty()
    @IsString()
    product_thumb: string;

    @IsNotEmpty()
    @IsString()
    product_description: string;

    @IsNotEmpty()
    @IsNumber()
    product_price: number;

    @IsNotEmpty()
    @IsNumber()
    product_quantity: number;

    @IsNotEmpty()
    @IsEnum(ProductType)
    product_type: ProductType;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested() // To recursively validate nested objects
    product_attributes: Clothing | Electronics | Furniture;

    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_attributes,
    }: {
        product_name: string;
        product_thumb: string;
        product_description: string;
        product_price: number;
        product_quantity: number;
        product_type: ProductType;
        product_attributes: Clothing | Electronics | Furniture;
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_attributes = product_attributes;
    }
}
  
export class UpdateProductDTO {
    @IsOptional()
    @IsString()
    product_name: string;

    @IsOptional()
    @IsString()
    product_thumb: string;

    @IsOptional()
    @IsString()
    product_description: string;

    @IsOptional()
    @IsNumber()
    product_price: number;

    @IsOptional()
    @IsNumber()
    product_quantity: number;

    @IsOptional()
    @IsEnum(ProductType)
    product_type:ProductType;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested() // To recursively validate nested objects
    product_attributes: Clothing | Electronics | Furniture;

    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_attributes
    }:{
        product_name: string,
        product_thumb: string,
        product_description: string,
        product_price: number,
        product_quantity: number,
        product_type: ProductType,
        product_attributes: any
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
    }
    
}