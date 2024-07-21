import crypto from 'node:crypto';
import Shop, { IShop, RoleShop } from '../models/shop.model';
import { BadRequestError, ForbiddenError, AuthFailureError } from "../core/error.response";
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import { getInfoData } from '../utils/utils';
import { IKeyToken } from '../models/keytoken.model';
import { Types } from 'mongoose';
import { IdecodeUser } from '../auth/authUtils';

class AccessService{
    private static generateKeyPair(){
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',{
            modulusLength:4096,
            publicKeyEncoding:{
                type:'pkcs1',
                format:'pem'
            },
            privateKeyEncoding:{
                type:'pkcs1',
                format:'pem'
            }
        })
        return {publicKey, privateKey}
    }

    private static async findShop( email: string ){
        return await Shop.findOne({email}).select( {email:1, password:1, salt:1}).lean()
    };

    public static handleRefreshToken = async( keyStore: IKeyToken, user: IdecodeUser, refreshToken: string )=>{
        /**
         * 1 check wheather user's token been used or not, if been used, remove key and for them to relogin
         * 2 if user's token is not valid token, force them to relogin, too
         * 3 if this accesstoken is valid, create new accesstoken, refreshtoken
         * 4 update keytoken in database
        */

        //1
        const {userId, email} = user;
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('Something wrong happended, please relogin')
        }

        //2
        if(keyStore.refreshToken !== refreshToken)throw new AuthFailureError('something was wrong happended, please relogin')
        const foundShop = await this.findShop(email)
        if(!foundShop) throw new AuthFailureError('shop not registed');

        //3
        const { publicKey, privateKey } = this.generateKeyPair()
        const tokens = await createTokenPair({userId,email},publicKey,privateKey)

        //4
        await keyStore.updateOne({
            $set:{//replace value of field with specific value
                publicKey,
                refreshToken:tokens.refreshToken
            },
            $addToSet:{//adds a value to an array unless the value is already present, in which case it does nothing to array
                refreshTokensUsed:refreshToken
            }
        })

        return {
            user,
            tokens  
        }
    };

    public static logout = async( keyStore: IKeyToken )=>{
        const delKey = await KeyTokenService.removeKeyById(keyStore._id as Types.ObjectId);
        return delKey 
    };

    public static login = async({ email, password }:IShop)=>{
        /*
            1 - check email in database
            2 - match password
            3 - create access token, refresh token and save
            4 - generate tokens
            5 - get data return login
        */
        // 1
        const foundShop = await this.findShop(email)
        if(!foundShop) throw new BadRequestError('Shop not registed');

        // 2
        const isPasswordValid = await (async () => {
            const salt = foundShop.salt;
            return new Promise( function(resolve,reject){
                crypto.pbkdf2( password, salt, 100, 64, 'sha512', function(err, derivedKey){
                    if(err) reject;
                    resolve (derivedKey.toString('hex') === foundShop.password)
                })
            })
        })();
        if (!isPasswordValid) throw new AuthFailureError('wrong password !!!');

        /**
         * 3
         * re-create key-pair for each workstation
         * safer, but reduce our perfomance
        */

        const { publicKey, privateKey } = this.generateKeyPair();
        const { _id:userId } = foundShop;
        const tokens = await createTokenPair({userId,email}, publicKey, privateKey);

        //4n
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            refreshToken:tokens.refreshToken,
        })

        //5
        return{
            shop:getInfoData(['_id','email'],foundShop),
            tokens
        }
    }

    public static async register({name, email, password}: IShop){
        /**
         * 1 - check wheather shop existed or not
         * 2 - create salt and hashed password
         * 3 - create new shop
         * 4 - create public/private key pair and access/refresh token pair
         * 5 - create keytoken which store publickey and refresh token in database
        */

        //1
        const shopHolder = await this.findShop(email);
        if(shopHolder) throw new BadRequestError('Shop already existed');

        //2
        const salt = crypto.randomBytes(32).toString()
        const passwordHashed = crypto.pbkdf2Sync(password,salt,100,64,'sha512').toString('hex')

        //3
        const newShop = await Shop.create({name, salt, email, password:passwordHashed, roles:RoleShop.SHOP} as IShop)

        if(newShop){
            //4
            const { publicKey, privateKey } = this.generateKeyPair();
            const tokens =await createTokenPair({userId:newShop._id, email: newShop.email},publicKey, privateKey)
            if(!tokens)throw new BadRequestError('create tokens error!!!!!!')

            //5
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey
            })
            if(!keyStore) throw new Error('cannot generate keytoken');

            return{
                shop:getInfoData(['_id','email'],newShop),
                tokens
            }
        }
        return {
            code:200,
            metadata:null
        }
    }
}

export default AccessService