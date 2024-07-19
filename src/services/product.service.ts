import { Types } from "mongoose";
import { IProduct, product } from "../models/product.model"

class Product{
    product_attributes: Types.Subdocument;
    product_description: string;
    product_name: string;
    product_price: number;
    product_quantity: number;
    product_shop: Types.ObjectId;
    product_thumb: string;
    product_type: 'Electronics' | 'Clothing' | 'Furniture';
    constructor({
        product_attributes,
        product_description,
        product_name,
        product_price,
        product_quantity,
        product_shop,
        product_thumb,
        product_type
    }:IProduct){
        this.product_attributes = product_attributes,
        this.product_description = product_description,
        this.product_name = product_name,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_shop = product_shop,
        this.product_thumb = product_thumb,
        this.product_type = product_type
    }
}