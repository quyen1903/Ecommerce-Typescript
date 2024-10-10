import 'dotenv/config'
import compression from 'compression'
import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from 'morgan';
import 'reflect-metadata';

import instanceMongodb from "./database/init.mongodb";
import router from './routes';
import { IKeyToken } from './models/keytoken.model';
import { IdecodeUser } from './auth/authUtils';
import { Iapikey } from './models/apikey.model';
import CheckConnect from './shared/helper/check.connect';
import productTest from "./test/product.test"
import inventoryTest from './test/inventory.test';
import { v4 as uuidv4 } from 'uuid';

import myLogger from './middleware/mylogger.log';

declare global{
    namespace Express{   
        interface Request {
            keyStore: IKeyToken;
            user: IdecodeUser;
            refreshToken: string;
            apiKey: Iapikey
            requestId: string
        }
    }
}

const app: Express = express();

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.use((req: Request, res: Response, next: NextFunction)=>{
    const requestId = req.headers['x-request-id'] as string
    req.requestId = requestId ? requestId : uuidv4()
    myLogger.log(`input params ${req.method}`,[
        req.path,
        {requestId: req.requestId},
        req.method === 'POST' ? req.body : req.query
    ])
    next()
})

/*
    redis pubsub
    we create one object of inventory test to subscribe
    then we publish on product test
    and our code works
*/
inventoryTest;
productTest.purchaseProduct("product:001",10)

/* init mongodb */
instanceMongodb;

/* check for database connection */
// CheckConnect.checkOverload()

// init routes
app.use('/',router);

//error handling
interface CustomError extends Error {
    status?: number;
};

app.use((error: CustomError, req: Request ,res: Response, next: NextFunction)=>{
    const statusCode = error.status || 500
    const resMessage = `${error.status} - ${Date.now}ms Response: ${JSON.stringify(error)}`;
    myLogger.error(resMessage, [
        req.path,
        {requestId: req.requestId},
        {message: error.message}
    ])
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        stack:error.stack,
        message:error.message || 'Internal Server Error'
    })
});

export default app