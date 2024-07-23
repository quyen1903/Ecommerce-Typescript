'use strict'
import _, { Object } from'lodash'
import { Schema } from 'mongoose';

const convertToObjectIdMongodb = (id: string) => new Schema.Types.ObjectId(id)

const getInfoData = (field: string[],object: object)=>{
    return _.pick(object,field)
}

//['a','b'] => {a:1,b:1}
const getSelectData = (select: string[])=>{
    return Object.fromEntries(select.map(element => [element,1]))
}

//['a','b'] => {a:0,b:0}
const unGetSelectData = (select: string[])=>{
    return Object.fromEntries(select.map(element => [element,0]))
}
/**
 * Record<Keys, Type> 
 * construct an object type whose key are Keys and whose property value are Type
 * by default, key always string(Typescript) or symbol(Javascript)
 * here, we allows all type, but we remove all field has value null
 */
const removeUndefinedObject = (object:Record<string,any>): Record<string,any> =>{
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
 * a:{
 *    b:{
 *      c:null,
 *      d:'this not null'
 *    }
 *  };
 * like this
 */
// const updateNestedObjectParser = (object: Record<string, any>) =>{
//     const final = {}
//     Object.keys(object).forEach(key =>{
//         if(typeof object[key] === 'object' && !Array.isArray(object[key])){
//             const response = updateNestedObjectParser(object[key])
//             Object.keys(response).forEach(a =>{
//                 final[`${key}.${a}`] = response[a]
//             })
//         }else{
//             final[key] = object[key]
//         }
//     })
//     return final
// }




export {
    getInfoData ,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    convertToObjectIdMongodb,
}