import Key,{ IKeyToken } from "../models/keytoken.model";

class KeyTokenService{
    static async createKeyToken ({ user, publicKey, refreshToken }: Partial<IKeyToken>){
        try {
            const tokens = await Key.create({
                user,
                publicKey,
                refreshToken: refreshToken || []
            })
            return tokens ? publicKey : null
        } catch (error) {
            return error
        }
    }
}

export default KeyTokenService