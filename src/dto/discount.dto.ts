import { IsNotEmpty, IsInt, IsString, IsArray, ArrayMinSize, IsBoolean, isNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

enum Applies_to{
    ALL='all',
    SPECIFIC= 'specific'
}

export class CreateDiscountDTO{

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsInt()
    @IsNotEmpty()
    value:number;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsInt()
    @IsNotEmpty()
    max_value: number

    @IsString()
    @IsNotEmpty()    
    start_date: string;

    @IsString()
    @IsNotEmpty()    
    end_date: string;

    @IsInt()
    @IsNotEmpty()
    max_uses: number;

    @IsInt()
    @IsNotEmpty()
    uses_count: number;

    @IsArray()
    @IsString({ each: true })  // "each" tells class-validator to run the validation on each item of the array
    @ArrayMinSize(1)
    users_used: string[];
    
    @IsInt()
    @IsNotEmpty()
    max_uses_per_user: number;

    @IsInt()
    @IsNotEmpty()
    min_order_value: number;

    @IsString()
    @IsNotEmpty()    
    shopId: string;

    @IsBoolean()
    is_active: boolean;

    @IsNotEmpty()
    @IsEnum(Applies_to)
    applies_to: Applies_to;

    @IsArray()
    @IsString({ each: true })  // "each" tells class-validator to run the validation on each item of the array
    product_ids: string[];

    constructor({
        name,
        description,
        type,
        value,
        code,
        max_value,
        start_date,
        end_date,
        max_uses,
        uses_count,
        users_used,
        max_uses_per_user,
        min_order_value,
        is_active,
        applies_to,
        product_ids
    }:{
        name:string,
        description:string,
        type:string,
        value:number,
        code:string,
        max_value:number,
        start_date:string,
        end_date:string,
        max_uses:number,
        uses_count:number,
        users_used:string[],
        max_uses_per_user:number,
        min_order_value:number,
        is_active:true,
        applies_to:Applies_to,
        product_ids:string[]
    }){
        this.name=name,
        this.description=description,
        this.type=type,
        this.value=value,
        this.code=code,
        this. max_value=max_value,
        this.start_date=start_date,
        this.end_date=end_date,
        this.max_uses=max_uses,
        this.uses_count=uses_count,
        this.users_used=users_used,
        this.max_uses_per_user=max_uses_per_user,
        this.min_order_value=min_order_value,
        this.is_active=is_active,
        this.applies_to=applies_to,
        this.product_ids=product_ids
    }
}

class Product{
    @IsNotEmpty()
    @IsString()
    productId: string

    @IsInt()
    @IsNotEmpty()
    quantity: number

    @IsNumber()
    @IsNotEmpty()
    price: number
}

export class AmountDiscountDTO{
    @IsString()
    @IsNotEmpty()
    codeId:string

    @IsString()
    @IsNotEmpty()
    userId:string

    @IsString()
    @IsNotEmpty()
    shopId:string

    //When you are using arrays you must provide a type of the object that array contains.
    //This type, you specify in a @Type() decorator:
    @Type(()=>Product)
    products:Product[]

    constructor({codeId, userId, shopId, products}:{
        codeId: string,
        userId: string,
        shopId: string,
        products: Product[]
    }){
        this.codeId = codeId,
        this.userId = userId,
        this.shopId = shopId,
        this.products = products
    }
}

export class GetListDiscount{
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    shopId: string;

    @IsString()
    @IsNotEmpty()
    limit: number;

    @IsString()
    @IsNotEmpty()
    page: number;

    constructor({
        code,
        shopId,
        limit,
        page
    }:{
        code: string,
        shopId: string,
        limit: number,
        page: number
    }){
        this.code = code,
        this.shopId = shopId,
        this.limit =limit,
        this.page = page
    }
}