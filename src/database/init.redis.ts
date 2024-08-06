// import Redis, {createClient} from"redis"

// import { RedisErrorResponse } from "../core/error.response";
// let client = {},
// statusConnectRedis = { 
//     CONNECT:'connect',
//     END:'end',
//     RECONNECT:'reconnecting',
//     ERROR:'error    '
// },connectionTimeout


// const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
//     code:-99,
//     message:{
//         english:'Service connect error',
//         francais:'erreur de connexion au service'
//     }
// }

// const handleTimeoutError = ()=>{
//     connectionTimeout = setTimeout(() => {
//         throw new RedisErrorResponse({
//             message:REDIS_CONNECT_MESSAGE.message.francais,
//             statusCode:REDIS_CONNECT_MESSAGE.code
//         })
//     }, REDIS_CONNECT_TIMEOUT);
// }
// const handleEventConnection =({
//     connectionRedis
// })=>{
//     connectionRedis.on(statusConnectRedis.CONNECT, ()=>{
//         console.log(`connectionRedis - Connection status: connected`)
//         clearTimeout(connectionTimeout)
//     })

//     connectionRedis.on(statusConnectRedis.END, ()=>{
//         console.log(`connectionRedis - Connection status: disconnected`)
//         handleTimeoutError()
//     })
    
//     connectionRedis.on(statusConnectRedis.RECONNECT, ()=>{
//         console.log(`connectionRedis - Connection status: reconnected`)
//         clearTimeout(connectionTimeout)
//     })
//     connectionRedis.on(statusConnectRedis.ERROR, (error)=>{
//         console.log(`connectionRedis - Connection status: ${error}`)
//         handleTimeoutError()
//     })
// }

// const initRedis = async()=>{
//     const instanceRedis = await createClient()
//     .on('error', err => console.log('Redis Client Error', err))
//     .connect();
//     client.instanceConnect = instanceRedis
//     console.log('is instance redis ready?',instanceRedis.isReady)
//     handleEventConnection({
//         connectionRedis:instanceRedis
//     })
// }

// const getRedis = ()=> client 
// console.log('this is client',client)

// const closeRedis = async()=>{
//     await instanceRedis.disconnect();
// }

// module.exports = {
//     initRedis,
//     getRedis,
//     closeRedis  
// }