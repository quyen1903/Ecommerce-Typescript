import crypto from 'node:crypto';
import JWT from "jsonwebtoken";
import Shop, { IShop, RoleShop } from '../models/shop.model';
import { BadRequestError, NotFoundError, AuthFailureError } from "../core/error.response";
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import { findByEmail } from './shop.service';
import { getInfoData } from '../utils/utils';
import { IKeyToken } from '../models/keytoken.model';
import { Types } from 'mongoose';

class AccessService{
  static logout = async( keyStore: IKeyToken )=>{
    const delKey = await KeyTokenService.removeKeyById(keyStore._id as Types.ObjectId);
    
    console.log({delKey})
    return delKey 
  }

  static login = async({ email, password }:IShop)=>{
      /*
          1 - check email in database
          2 - match password
          3 - create access token, refresh token and save
          4 - generate tokens
          5 - get data return login
        */
      // 1
      const foundShop = await findByEmail(email)
      if(!foundShop) throw new BadRequestError('Shop not registed');
      // 2
      const isPasswordValid = await (async () => {
        const salt = foundShop.salt;
        return new Promise(function(resolve,reject){
          crypto.pbkdf2(password,salt,100,64,'sha512',(err, derivedKey)=>{
            if(err) reject
            resolve (derivedKey.toString('hex') === foundShop.password)
          })
        })
      })();
      if (!isPasswordValid) {
        throw new AuthFailureError('wrong password !!!');
      }

      //3
      /**
       * re-create key-pair for each workstation
       * safer, but reduce our perfomance
       */
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
      const { _id:userId } = foundShop
      const tokens = await createTokenPair({userId,email},publicKey,privateKey)
      //4n
      await KeyTokenService.createKeyToken({
        userId: foundShop._id,
        publicKey,
        refreshToken:tokens.refreshToken,
      })  
      //5
      const decoded = JWT.verify(tokens.refreshToken, publicKey)
      console.log('this is decode jwt',JWT.verify(tokens.refreshToken, publicKey))
      console.log('this is decode jwt userId type',typeof(decoded))
      
      return{
        shop:getInfoData(['_id','email'],foundShop),
        tokens
      }
  }

  static async register({name, email, password}: IShop){
      const shopHolder = await Shop.findOne({ email }).lean();
      if(shopHolder) throw new BadRequestError('Shop already existed');

      const salt = crypto.randomBytes(32).toString()
      const passwordHashed = crypto.pbkdf2Sync(password,salt,100,64,'sha512').toString('hex')

      const newShop = await Shop.create({name, salt, email, password:passwordHashed, roles:RoleShop.SHOP} as Partial<IShop>)
      if(newShop){
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

        const tokens =await createTokenPair({userId:newShop._id, email: newShop.email},publicKey, privateKey)
        if(!tokens)throw new BadRequestError('create tokens error!!!!!!')
        
        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey
        })

        if(!keyStore) throw new Error('cannot generate keytoken')
        console.log('this is token', tokens.refreshToken)
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