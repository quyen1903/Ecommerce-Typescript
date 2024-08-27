import { Request, Response, NextFunction } from 'express'; 

const { SuccessResponse } = require("../core/success.response")
const { uploadImageFromURL } = require("../services/upload.service")

class UploadController{
    uploadFile = async (req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'upload successfully ',
            metadata: await uploadImageFromURL()
        }).send(res);
    }
}

export default new UploadController()