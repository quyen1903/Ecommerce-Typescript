import redisPubsubService from "../services/redisPubSub.service";

class InventoryServiceTest{
    constructor(){
        redisPubsubService.subscribe('purchase_events', (message: string)=>{
            console.log('Received message',message)
            const order = JSON.parse(message);
            InventoryServiceTest.updateInventory(order.productId, order.quantity);
        })
    }

    static updateInventory(productId: string, quantity: number){
        console.log(`Update_inventory ${productId} with quantity of ${quantity}`)
    }
}

export default new InventoryServiceTest()