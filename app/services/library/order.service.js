class OrderService {
    constructor(client) {
        this.Order = client.db().collection('orders')
    }

    async getOrder(params) {
        //TODO username, orderID
        const { username, orderID } = params
        if(orderID){
            const order = await this.Order.findOne({
                orderID
            })
            if(order){
                delete order._id
                delete order.username
                return order
            }
            throw new Error('Order not found')
        } 
        if(username){
            const orders = await this.Order.find({
                username
            }).toArray()
            if(orders){
                orders.forEach(order => {
                    delete order._id
                    delete order.username
                })
                return orders
            }
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