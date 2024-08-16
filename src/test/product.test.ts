import redisPubsubService from "../services/redisPubSub.service";

class ProductServiceTest{
    purchaseProduct(productId: string, quantity: number){
        const order = { 
            productId, 
            quantity 
        }
        redisPubsubService.publish('purchase_events', JSON.stringify(order))
    }
}

export default new ProductServiceTest()