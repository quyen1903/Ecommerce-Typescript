import { Types } from "mongoose";
import Key,{ IKeyToken } from "../models/keytoken.model";


class KeyTokenService{

    static createKeyToken = async ({userId, publicKey, refreshToken}:Partial<IKeyToken>)=>{
        try {
            const filter = {userId:userId},
            replacement = {
                publicKey,refreshTokensUsed:[],refreshToken
            },
            options = {upsert:true,new:true}

            const tokens = await Key.findOneAndUpdate(filter,replacement,options);
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
    
    static findByUserId = async (userId: string | Types.ObjectId): Promise<IKeyToken | null> => {
        try {
            return await Key.findOne({ userId: userId }).exec();
        } catch (error) {
            return null;
        }
    }


    static removeKeyById = async(id: Types.ObjectId)=>{
        return await Key.deleteMany({_id:id})
    }
    
    static findByRefreshTokenUsed = async(refreshToken:IKeyToken)=>{
        return await Key.findOne({refreshTokensUsed:refreshToken})
    }

    static findByRefreshToken = async(refreshToken:IKeyToken)=>{
        return await Key.findOne({refreshToken})
    }

    static deleteKeyById = async(userId: string)=>{
        return await Key.deleteMany({userId:userId})
    }
}

export default KeyTokenService