import { IsNotEmpty, IsInt, IsString, MinLength, MaxLength, isInt } from 'class-validator';

export class DiscountDTO{
    @IsString()
    product_name: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    type: string;

    @IsInt()
    value:number;

    @IsString()
    code: string;

    
    start_date: string; 
    end_date: string; 
    max_uses: number;
    uses_count: number;
    users_used: string[];
    max_uses_per_user: number;
    min_order_value: number
    shopId: string;
    is_active: boolean;
    applies_to: string;
    product_ids: string[];
    limit: number;
    page: number;
    codeId: string;
    userId: string;
    products:{
        productId: string,
        quantity: number,
        price: number
    }[]
}