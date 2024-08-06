import { ICartRequest } from "../controller/cart.controller";
import cart from '../models/cart.model'
import { getProductById } from "../models/repository/product.repository";
import { NotFoundError } from '../core/error.response';

class CartService{
    static async createUserCart({userId, product}: Partial<ICartRequest>){
        const query = { cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet:{
                cart_products:product
            },
            $inc:{
                cart_count_product:1
            }
        },options = {upsert: true, new: true} 
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({userId, product}: Partial<ICartRequest>){
        const {productId, quantity} = product as {productId: string, quantity: number};

        const query = { 
            cart_userId: userId,
            "cart_products.productId": productId,
            cart_state: 'active'
        },updateSet = {
            $inc:{
                'cart_products.$.quantity': quantity
            }
        },options = {upsert:true, new:true};

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product}:ICartRequest){ 
        const userCart =await cart.findOne({cart_userId: userId})   

        //if cart not existed
        if(!userCart){
            return await CartService.createUserCart({userId, product})
        }

        //already have cart but not have product?
        if(!userCart.cart_products.length){
            userCart.cart_products = [product]
            return await userCart.save()
        }

        const checkCartProduct = userCart.cart_products.find((element)=>{
            element.productId === product.productId
        })

        if(!checkCartProduct){
            userCart.cart_products.push(product);
            userCart.cart_count_product +=1;
            return await userCart.save();
        }
    }

    static async update({ userId, shop_order_ids }: ICartRequest){
        const { productId, shopId, price, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotFoundError('product not found')

        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            throw new NotFoundError('Product not belong to the shop')
        }


        return await CartService.updateUserCartQuantity({
            userId,
            product:{
                productId,
                shopId,
                price,
                name: '',
                quantity:quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({userId, productId}: ICartRequest){
        const query = { cart_userId: userId, cart_state: 'active'},
        //$pull removes from an existing array all instances of a value or values that match a specified condition
        updateSet = {
            $pull:{
                cart_products:{
                    productId
                }
            }
        }
        const deleteCart = await cart.updateOne(query, updateSet)

        return deleteCart
    }

    static async getListUserCart({userId}:ICartRequest){
        const result = await cart.findOne({cart_userId: +userId}).lean()
        return result
    }
}
export default CartService