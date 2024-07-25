'use strict'
import _, { Object } from'lodash'
import { Schema } from 'mongoose';

export const convertToObjectIdMongodb = (id: string) => new Schema.Types.ObjectId(id)

export const getInfoData = (field: string[],object: object)=>{
    return _.pick(object,field)
}

//['a','b'] => {a:1,b:1}
export const getSelectData = (select: string[])=>{
    return Object.fromEntries(select.map(element => [element,1]))
}

//['a','b'] => {a:0,b:0}
export const unGetSelectData = (select: string[])=>{
    return Object.fromEntries(select.map(element => [element,0]))
}
/**
 * Record<Keys, Type> 
 * construct an object type whose key are Keys and whose property value are Type
 * by default, key always string(Typescript) or symbol(Javascript)
 * here, we allows all type, but we remove all field has value null
 */
export const removeUndefinedObject = (object:Record<string,any>): Record<string,any> =>{
    Object.keys(object).forEach(key =>{
        if(object[key] == null){
            delete object[key]
        }
    })
    return object
}

/**
 * we use recursion 
 * first thing first, loop through object key 
 * && !Array because behind the scense, array is object, too
 * if key of object is object, we pass it to updateNestedObjectParser
 * which means it this is recursion
 * this allows us to wipe out null which is inside of nested object
 * a = {
 *    c:{
 *      d:1,
 *      e:2
 *    }
 *  };
 * 
 * db.collection.updateOne({
 *  `c.d`:1
 *  `c.e`:2
 * })
 * like this
 * example
 * this is final {
  'product_attributes.brand': 'Calvin Klein',
  'product_attributes.size': 'xl',
  'product_attributes.material': 'Cotton',
  product_name: 'quần lọt khe đen huyền ảo',
  product_price: 499000,
  product_shop: '66966a288e3d3d7e62886da3',
  product_type: 'Clothing'
    }
  when we have dots .  inside key of object
  mongoose understand that is nested fields.
  this allows us update nested field 
 */
export const updateNestedObjectParser =(object: Record<string, any>): Record<string, any> =>{
    if (!object) {
        return {};
    }
    const final: Record<string, any> = {}
    Object.keys(object).forEach(key =>{
        if(typeof object[key] === 'object' && !Array.isArray(object[key])){
            const response = updateNestedObjectParser(object[key])
            Object.keys(response).forEach(a =>{
                final[`${key}.${a}`] = response[a]
            })
        }else{
            final[key] = object[key]
        }
    })
    console.log('this is final',final)
    return final
}
