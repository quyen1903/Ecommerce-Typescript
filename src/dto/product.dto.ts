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
import { BadRequestError } from '../core/error.response';

enum ProductType {
    CLOTHING = 'Clothing',
    ELECTRONICS = 'Electronics',
    FURNITURE = 'Furniture',
}

class Factory {
    // Registry to hold product types and their corresponding DTO classes
    private static productRegistry: { [key: string]: typeof CreateProductDTO } = {};
  
    // Register a product type with its DTO class
    static registerProductType(type: string, classReference: typeof CreateProductDTO) {
      Factory.productRegistry[type] = classReference;
    }
  
    // Create a product and validate it based on the product type
    static async createProduct(type: CreateProductDTO['product_type'], payload: any) {
      const productClass = Factory.productRegistry[type];
      
      // Check if the product type is registered
      if (!productClass) throw new BadRequestError(`Invalid Product Type: ${type}`);
  
      // Instantiate the DTO class with payload
      const productInstance = new productClass(payload);
  
      // Validate the product attributes (class-validator validation)
      const errors = await validate(productInstance);
      if (errors.length > 0) {
        throw new BadRequestError('Validation failed for product attributes');
      }
  
      return productInstance;
    }
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

const registProduct = [
    {type: 'Clothing', class: Clothing},
    {type: 'Electronics', class: Electronics},
    {type: 'Furniture', class: Furniture}
]

registProduct.forEach((element: any)=>{
    Factory.registerProductType(element.type, element.class)
})