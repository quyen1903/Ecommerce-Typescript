import { convertToObjectIdMongodb } from "../../utils/utils";
import cart from '../cart.model';

export const findCartById = async (cartId: string) =>{
    return await cart.findOne({_id: convertToObjectIdMongodb(cartId), cart_state:'active'}).lean();
}
