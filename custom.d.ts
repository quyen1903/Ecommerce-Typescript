import { Request } from "express";
import { IKeyToken } from "./src/models/keytoken.model";
import { IdecodeUser } from "./src/auth/authUtils";
import { Iapikey } from "./src/models/apikey.model";

/*
    Extends Request interface
*/
declare module 'express-serve-static-core' {
    interface Request {
        keyStore: IKeyToken;
        user: IdecodeUser;
        refreshToken: string;
        apiKey: Iapikey
    }
}