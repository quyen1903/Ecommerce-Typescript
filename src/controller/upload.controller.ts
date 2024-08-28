import { Request, Response, NextFunction } from 'express'; 
import { BadRequestError } from '../core/error.response';
import { SuccessResponse } from "../core/success.response"
import { uploadImageFromLocal, uploadImageFromURL } from "../services/upload.service"

class UploadController{
    uploadFile = async (req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Upload Successfully ',
            metadata: await uploadImageFromURL()
        }).send(res);
    }

    uploadFileThumb = async function(req: Request, res: Response, next: NextFunction) {
        const {file} = req
        if(!file) throw new BadRequestError("Missing File")
        
        new SuccessResponse({
            message: 'Upload Successfully ',
            metadata: await uploadImageFromLocal({path: file.path})
        }).send(res);
    }
}

export default new UploadController()