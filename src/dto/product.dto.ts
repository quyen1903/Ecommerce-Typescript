import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEnum, IsIn } from 'class-validator';
import {CreateClothingDTO, UpdateClothingDTO} from './product/clothing.products';
import {CreateElectronicsDTO, UpdateElectronicsDTO} from './product/electronic.products';
import {CreateFurnitureDTO, UpdateFurnitureDTO} from './product/furniture.products';

enum ProductType{
    CLOTHING = 'Clothing',
    ELECTRONICS= 'Electronics',
    FURNITURE= 'Furniture'
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
    product_type: ProductType

    @IsNotEmpty()
    @IsIn([CreateClothingDTO, CreateElectronicsDTO, CreateFurnitureDTO])
    product_attributes: CreateClothingDTO| CreateElectronicsDTO | CreateFurnitureDTO

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
        product_type:ProductType,
        product_attributes: CreateClothingDTO | CreateElectronicsDTO | CreateFurnitureDTO
    }
        
    ) {
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

    @IsOptional()
    @IsIn([UpdateClothingDTO, UpdateElectronicsDTO, UpdateFurnitureDTO])
    product_attributes: UpdateClothingDTO| UpdateElectronicsDTO | UpdateFurnitureDTO

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
        product_attributes: UpdateClothingDTO | UpdateElectronicsDTO | UpdateFurnitureDTO
    }
        
    ) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_attributes = product_attributes;
    }
}