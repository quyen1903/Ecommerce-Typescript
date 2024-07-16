import JWT from 'jsonwebtoken'
import { Types } from 'mongoose'
import { BadRequestError } from '../core/error.response'
import asyncHandler from '../helper/async.handler'
import { Request, Response, NextFunction } from 'express'
import { AuthFailureError, NotFoundError } from '../core/error.response'
import  KeyTokenService  from '../services/keyToken.service'
import KeyToken, { IKeyToken } from '../models/keytoken.model';

const HEADER ={
    API_KEY : 'x-api-key',
    CLIENT_ID:'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'x-rtoken-id',
}

export const createTokenPair = async(payload: {
        userId: Types.ObjectId,
        email: string
    }, 
    publicKey: string, privateKey: string)=>{
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
    userId:string,
    email?: string,
    iat: number,
    exp: number
}

export const authentication = asyncHandler(async(req:Request, res: Response, next: NextFunction)=>{
        /* 
        1 - check userId misssing
        2 - get acccess token
        3 - verify Token
        4 - check user in database
        5 - check keyStore with this userId
        6 - OK => return next()
    */
    //1
    const userId = req.headers[HEADER.CLIENT_ID] as string
    if(!userId) throw new AuthFailureError('Invalid Request')

    //2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found Keystore')
    console.log('this is keystore: ',keyStore)

    //3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string
            const decodeUser = JWT.verify(refreshToken ,keyStore.publicKey) as IdecodeUser
            if(userId !== decodeUser.userId ) throw new AuthFailureError('Invalid User Id')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey) as IdecodeUser
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User Id');
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})