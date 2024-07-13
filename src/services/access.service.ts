import crypto from 'node:crypto';
import Shop, { IShop, RoleShop } from '../models/shop.model';
import { BadRequestError, NotFoundError } from "../core/error.response";
import KeyTokenService from './keyToken.service';

class AccessService{
    static async register({name, email, password}: IShop){
        const shopHolder = await Shop.findOne({ email }).lean();
        if(shopHolder) throw new BadRequestError('Shop already existed');

        const salt = crypto.randomBytes(32)
        const passwordHashed = crypto.pbkdf2Sync(password,salt,100,64,'sha512').toString()

        const newShop = await Shop.create({name, salt, email, password:passwordHashed, roles:RoleShop.SHOP} as Partial<IShop>)
        if(newShop){
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                  type: 'spki',
                  format: 'pem',
                },
                privateKeyEncoding: {
                  type: 'pkcs8',
                  format: 'pem',
                  cipher: 'aes-256-cbc',
                  passphrase: 'top secret',
                },
              });
              
            const publicKeyString = await KeyTokenService.createKeyToken({
                user: newShop._id,
                publicKey,
                refreshToken:[]
            })

            
            console.log(publicKeyString)
        }
    }
}

export default AccessService