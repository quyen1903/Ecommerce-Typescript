import JWT from 'jsonwebtoken'
import { Types } from 'mongoose'
import { BadRequestError } from '../core/error.response'
import asyncHandler from '../helper/async.handler'
import { Request, Response, NextFunction } from 'express'
import { AuthFailureError, NotFoundError } from '../core/error.response'
import  KeyTokenService  from '../services/keyToken.service'

const HEADER ={
    API_KEY : 'x-api-key',
    CLIENT_ID:'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'x-rtoken-id',
}

export const createTokenPair = async(payload: {
        userId: Types.ObjectId,
        email: string
    }, publicKey: string, privateKey: string)=>{
    try {
        const accessToken =  JWT.sign(payload,privateKey,{
            expiresIn:'2 days',
            algorithm:'RS256'
        })
        const refreshToken=  JWT.sign(payload,privateKey,{
            expiresIn:'7 days',
            algorithm:'RS256'
        })
    
        //
        JWT.verify(accessToken,publicKey,(err,decode)=>{
            if(err){
                throw new BadRequestError(' JWT verify error :::')
            }else{
                console.log(`decode verify`,decode)
            }
        })
        return {accessToken,refreshToken}
    } catch (error) {
        console.log('Authentication Utilities error:::',error)
        throw new BadRequestError('Error creating token pair');
    }
}

export interface IdecodeUser{
    userId:Types.ObjectId,
    email: string,
    iat: number,
    exp: number
}

export const authentication = asyncHandler(async(req:Request, res: Response, next: NextFunction)=>{
    /* 
    1 - check userId misssing
    2 - check keytoken referencing to currently userId

    3   - if refresh token existed, check user in database
    3.1 - extends request header with keytoken, userId and refreshtoken
    3.2 - OK => return next()

    4   - get acccess token, check user in database
    4.1 - extends request header with keytoken, userId
    4.2 - OK => return next()

    */

    //1
    const userId = req.headers[HEADER.CLIENT_ID] as string
    if(!userId) throw new AuthFailureError('Invalid Request, missing client ID')    

    //2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found Keystore')

    //3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string
            const decodeUser = JWT.verify(refreshToken ,keyStore.publicKey) as IdecodeUser
            if(userId !== decodeUser.userId.toString() ) throw new AuthFailureError('Invalid User Id')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    //4
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey) as IdecodeUser
        if( userId !== decodeUser.userId.toString() ) throw new AuthFailureError('Invalid User Id');
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

export async function verifyJWT(token: string, keySecret: string){
    return JWT.verify(token, keySecret)
} 
