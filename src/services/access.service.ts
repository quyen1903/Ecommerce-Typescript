import crypto from 'node:crypto';
import { LoginDTO,RegisterDTO } from '../dto/access.dto';
import { validate, ValidationError } from 'class-validator';
import Shop, { RoleShop } from '../models/shop.model';
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

    //when resolve, value of type will be string
    private static hashPassword(password:string, salt:string):Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100,64,'sha512', (err, key) => {
                if (err) return  reject(err)
                resolve(key.toString('hex'));
            })
        });
    }

    private static async findShop( email: string ){
        return await Shop.findOne({email}).select( {email:1, password:1, salt:1}).lean()
    };

    static handleRefreshToken = async( keyStore: IKeyToken, user: IdecodeUser, refreshToken: string )=>{
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

    static logout = async( keyStore: IKeyToken )=>{
        const delKey = await KeyTokenService.removeKeyById(keyStore._id as Types.ObjectId);
        return delKey 
    };

    static login = async(login:LoginDTO)=>{
        /*
            1 - check email in database
            2 - match password
            3 - create access token, refresh token and save
            4 - generate tokens
            5 - get data return login
        */

        // 1
        const foundShop = await this.findShop(login.email)
        if(!foundShop) throw new BadRequestError('Shop not registed');

        // 2
        const passwordHashed =await this.hashPassword(login.password, foundShop.salt);
        if (passwordHashed !== foundShop.password) throw new AuthFailureError('Wrong password!!!');
        
        /**
         * 3
         * re-create key-pair for each workstation
         * safer, but reduce our perfomance
        */

        const { publicKey, privateKey } = this.generateKeyPair();
        const { _id:userId } = foundShop;
        const tokens = await createTokenPair({userId,email: login.email}, publicKey, privateKey);

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

    static async register(register: RegisterDTO){
        /**
         * 1 - validate input dataa
         * 2 - check wheather shop existed or not
         * 3 - create salt and hashed password
         * 4 - create new shop
         * 5 - create public/private key pair and access/refresh token pair
         * 6 - create keytoken which store publickey and refresh token in database
        */

        //1
        const shopHolder = await this.findShop(register.email);
        if(shopHolder) throw new BadRequestError('Shop already existed');

        //2
        const salt = crypto.randomBytes(32).toString();
        const passwordHashed =await this.hashPassword(register.password, salt)
        console.log('this is password hashed',passwordHashed)

        //3
        const newShop = await Shop.create({
            name: register.name,
            salt,
            email: register.email,
            password:passwordHashed,
            roles:RoleShop.SHOP
        })

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