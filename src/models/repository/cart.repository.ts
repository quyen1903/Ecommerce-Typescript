import { convertToObjectIdMongodb } from "../../utils/utils";
const { cart } = require('../cart.model');

const findCartById = async (cartId: string) =>{
    return await cart.findOne({_id: convertToObjectIdMongodb(cartId), cart_state:'active'}).lean();
}

module.exports = {
    findCartById
}