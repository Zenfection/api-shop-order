class OrderService {
    constructor(client) {
        this.Order = client.db().collection('orders')
    }
    async getAllOrder(username) {
        const orders = await this.Order.find({
            username
        }).toArray()

        if(!orders) throw new Error('Failed to get orders')
        return orders
    }

    async getOrderDetail(username, orderID) {
        if(orderID){
            const order = await this.Order.findOne({
                username,
                orderID
            })
            if(!order) throw new Error('Failed to get order detail')
            return order
        } 
    }

    async createOrder(params) {
        const { orderID, username, customer, status, order_date, total_price, products } = params
        const order = {
            orderID,
            username,
            customer,
            status,
            order_date,
            total_price,
            products
        }
        try {
            await this.Order.insertOne(order)
            return {
                ...order,
                username: undefined,
                _id: undefined
            }
        } catch (error) {
            throw new Error(`Failed to create order: ${error.message}`)
        }
    }

}

export default OrderService;