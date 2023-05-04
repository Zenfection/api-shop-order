class OrderService {
    constructor(client) {
        this.Order = client.db().collection('orders')
    }

    async getOrder(username) {
        const orders = await this.Order.find({
            username
        }).toArray()
        // ignore _id, username
        orders.forEach(order => {
            delete order._id
            delete order.username
        })
        return orders
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