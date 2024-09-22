import cart from '../models/cart.model';
import { getProductById } from "../models/repository/product.repository";
import { NotFoundError } from '../core/error.response';
import { AddCart, DeleteCart, UpdateCart } from "../dto/cart.dto";

class CartService{
    static async createUserCart({userId, product}: AddCart){
        const query = { cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet:{ cart_products:product },
            $inc:{ cart_count_product:1 }
        },options = {upsert: true, new: true} 
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }: AddCart) {
        const { productId, quantity } = product as { productId: string, quantity: number };
    
        // First check if the product exists in the user's cart
        const existingCart = await cart.findOne({
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        });
    
        if (existingCart) {
            // If the product exists, update the quantity using the positional operator
            return await cart.findOneAndUpdate(
                {
                    cart_userId: userId,
                    'cart_products.productId': productId,
                    cart_state: 'active'
                },
                {
                    $inc: {
                        'cart_products.$.quantity': quantity
                    },
                    $set: {
                        modifiedOn: new Date() // Update modified date
                    }
                },
                { new: true }
            );
        } else {
            // If the product doesn't exist, push a new product into the cart
            const newProduct = {
                productId: productId,
                shopId: product.shopId,
                quantity: quantity,
                name: product.name,
                price: product.price
            };
    
            return await cart.findOneAndUpdate(
                { cart_userId: userId, cart_state: 'active' },
                {
                    $push: { cart_products: newProduct },
                    $set: { modifiedOn: new Date() }
                },
                { upsert: true, new: true }
            );
        }
    }
    

    static async addToCart({userId, product}:AddCart){ 
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

    static async update({ userId, shop_order_ids }: UpdateCart){
        const { productId, shopId, price, quantity, old_quantity, name } = shop_order_ids[0]?.item_products[0];
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
                name,
                quantity:quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({userId, productId}: DeleteCart){
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

    static async getListUserCart({userId}:AddCart){
        const result = await cart.findOne({cart_userId: +userId}).lean()
        return result
    }
}
export default CartService