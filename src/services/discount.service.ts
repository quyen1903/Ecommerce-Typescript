import { IDiscountRequest } from "../controller/discount.controller";
import { BadRequestError, NotFoundError } from "../core/error.response";
import discount  from "../models/discount.model";
import { convertToObjectIdMongodb } from "../utils/utils";
import { findAllDiscountCodesSelect, checkDiscountExists } from "../models/repository/discount.repository";
import { findAllProducts } from "../models/repository/product.repository";
/*
    discount service
    1 generator discount code[shop/ admin]
    2 get discount amount[user]
    3 get all discount code [user/shop]
    4 verify discount code [user]
    5 delete discount code[admin/shop]
    6 cancel discount
*/

class DiscountService{
    static async createDiscountCode(payload:IDiscountRequest){
        const {
            name,
            description,
            type,
            value,
            code,
            start_date,
            end_date,
            max_uses,
            uses_count,
            users_used,
            max_uses_per_user,
            min_order_value,
            shopId,
            is_active,
            applies_to,
            product_ids
        } = payload

        const objectId_users_used = users_used.map((x)=> convertToObjectIdMongodb(x))

        //kiem tra
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
            throw new BadRequestError('Discount code has expired')
        }

        if(new Date(start_date) >= new Date(end_date)){
            throw new BadRequestError('start date must before end day')
        }

        //create index for discount
        const foundDiscount = await discount.findOne({
            discount_code:code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError('Discount existed!!!');
        }

        const newDiscount = await discount.create({
            discount_name:name,
            discount_description:description,
            discount_type:type,
            discount_value:value,
            discount_code:code,
            discount_start_dates:new Date(start_date),
            discount_end_dates:new Date(end_date),
            discount_max_uses:max_uses,
            discount_uses_count:uses_count,
            discount_users_used:objectId_users_used,
            discount_max_uses_per_user:max_uses_per_user,
            discount_min_order_value:min_order_value || 0,
            discount_shopId:shopId,
            discount_is_active:is_active,
            discount_applies_to:applies_to,
            discount_product_ids:product_ids
        })
        return newDiscount
    }

    /*
        get all discount code available with products
    */
    static async getAllDiscountCodesWithProduct({code, shopId, limit, page}:IDiscountRequest){
        //create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code:code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active){
            throw new NotFoundError('discount not existed!!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        console.log('this is discount_product_ids',discount_product_ids)
        let products;

        if(discount_applies_to === 'all'){
            products = await findAllProducts(
                limit,
                'ctime',
                page,
                {
                    product_shop:shopId,
                    isPublished:true
                },
                ['product_name']
            )
            console.log('this is products ',products)
        };

        if(discount_applies_to === 'specific'){
            products = await findAllProducts(
               limit,
               'ctime',
               page,
                {
                    _id: { $in: discount_product_ids },
                    isPublished:true
                },
                ['product_name']
            )
        }
        return products
    }

    /*
        get all discount code of shop
    */

    static async getAllDiscountCodesByShop(
        { limit, page, shopId }:IDiscountRequest
    ){
        console.log(`this is limit${limit} and page ${page} and shopId ${shopId}`)
        const discounts = await findAllDiscountCodesSelect(
            limit,
            page,
            "ctime",
            {
                discount_shopId:convertToObjectIdMongodb(shopId),
                discount_is_active:true,
            },
            ['discount_code', 'discount_name']
        )

        return discounts
    }

    static async getDiscountAmount( {codeId, userId, shopId,products}: IDiscountRequest ){
        const foundDiscount = await checkDiscountExists({
            discount_code:codeId,
            discount_shopId:convertToObjectIdMongodb(shopId),
        })

        if(!foundDiscount) throw new NotFoundError('discount doesnt exist')
        const {
            discount_start_dates,
            discount_end_dates,
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
        } = foundDiscount;
        if(!discount_is_active) throw new NotFoundError('discount is expired!')
        if(!discount_max_uses) throw new NotFoundError('discount are out!')

        if(new Date() < new Date(discount_start_dates) || new Date() > new Date(discount_end_dates)){
            throw new NotFoundError('discount code had expired!!')
        }

        //check wheather discount had minimum value
        let totalOrder = 0
        if(discount_min_order_value > 0){
            totalOrder = products.reduce((accumulator, product)=>{
                return accumulator + (product.quantity * product.price)
            },0)
            if(totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount require a minimum order of ${discount_min_order_value}`)
            }
        }

        //
        if(discount_max_uses_per_user > 0){
            const userUserDiscount = discount_users_used.find(element => element.toString() === userId)
            if(userUserDiscount){
                throw new BadRequestError('this user already use this discount')
            }
        }

        //check wheather discount is fixed amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount:amount,
            totalPrice:totalOrder - amount
        }
    }

    static async deleteDiscountCode({shopId, codeId}:IDiscountRequest){
        const deleted = await discount.findOneAndDelete({
            discount_code:codeId,
            discount_shopId:convertToObjectIdMongodb(shopId)
        })

        return deleted
        
    }

    static async cancelDiscountCode({ codeId, shopId, userId }:IDiscountRequest){
        const foundDiscount = await checkDiscountExists({
            model:discount,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongodb(shopId)
            }
        })
        if(!foundDiscount) throw new NotFoundError('discount doesnt exist')

        const result = await discount.findByIdAndUpdate(foundDiscount._id,{
            $pull: {
                discount_users_used:userId,
            },
            $inc:{
                discount_max_uses:1,
                discount_uses_count:-1
            }
        })

        return result
    }
}

export default DiscountService