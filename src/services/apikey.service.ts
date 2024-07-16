import Apikey, { Iapikey } from '../models/apikey.model';
import crypto from 'node:crypto';

export const findById = async (key: string)=>{
    // const newKey = await Apikey.create({
    //     key:crypto.randomBytes(64).toString('hex'),
    //     permissions:['0000']
    // })
    // console.log(newKey)
    const objectKey = await Apikey.findOne({ key, status:true }).lean() as Iapikey
    return objectKey
}