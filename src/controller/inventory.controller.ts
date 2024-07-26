import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import InventoryService from '../services/inventory.service';
import { Types } from 'mongoose';
import { Iinventory } from '../models/inventory.model';


class InventoryController{

    addStockToInventory = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'Add Stock To inventory Success',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)

        console.log(req)
    }

}


export default new InventoryController()