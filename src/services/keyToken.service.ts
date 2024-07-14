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
}

export default KeyTokenService