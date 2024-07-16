import 'dotenv/config'
import compression from 'compression';
import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";

import instanceMongodb from "./database/init.mongodb";
import router from './routes';
import CheckConnect from './helper/check.connect';

const app: Express = express();

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

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
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        stack:error.stack,
        message:error.message || 'Internal Server Error'
    })
});

export default app