class OrderService {
    constructor(client) {
        this.Order = client.db().collection('orders')
    }

    /**
        params: {
            username,
            customer: {
                name,
                phone,
                address,
                email,
                province,
                district,
                ward
            },
            status,
            order_date,
            shipped_date,
            delivered_date,
            total_price,
            products: [
                {
                    id_product,
                    amount,
                    price,
                    name_product,
                    image_product
                }
            ]
        }
    */ 

    async createOrder(params) {
        const { username, customer, status, order_date, shipped_date, delivered_date, total_price, products } = params
        const order = {
            username,
            customer,
            status,
            order_date,
            shipped_date,
            delivered_date,
            total_price,
            products
        }
        const result = await this.Order.insertOne(order)
        return result.ops[0]
    }
}

export default OrderService;