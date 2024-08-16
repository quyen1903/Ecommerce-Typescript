/*
    dont know why import from redis cause error
    Property 'on' does not exist on type 'RedisClientType<{ graph: { CONFIG_GET: typeof 
*/
const { createClient } = require('redis');
import { promisify } from 'util';
import { reservationInventory } from'../models/repository/inventory.repository';
const redisClient = createClient({
    password: process.env.REDIS_PASSWORD as string,
    socket: {
        host: process.env.REDIS_HOST as string,
        port: 16457
    }
});

redisClient.on('error', (error: Error) => {
    console.error('Redis Client Error', error);
});

(async () => {
    await redisClient.connect();
    console.log('Redis client connected');
})();

(async () => {
    await redisClient.ping();
})();

/**
 * acquireLock algorithm, this will prevent race conditions
 * how it's work? we "acquire" access to shared resource by "lock" that resource
 * once a process taken "lock", other process must wait until "lock" being release 
 */
export const acquireLock = async ( productId: string, quantity: number, cartId: string )=>{
    const key = `lock_v2024_${productId}`
    const retryTimes = 10;
    const expireTime = 3000;
    
    for (let i = 0; i < retryTimes; i++){
        const result = await redisClient.setNX(key, expireTime)
        console.log(`result :::` ,result)
        if(result === 1){
            const isReversation = await reservationInventory({
                productId, quantity, cartId
            })
            if(isReversation.modifiedCount) {
                await redisClient.pExpire(key, expireTime)
                return key
            }
            return null;
        }else{
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

export const releaseLock = async (keyLock: string) =>{
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

export default redisClient