class OrderService {
    constructor(client) {
        this.Order = client.db().collection('orders')
    }

    // have name_customer, phone_customer, address_customer, email_customer, province_customer, district_customer, ward_customer, status (0: pending, 1: shipping, 2: delivered, 3: canceled), order_date, shipped_date, delivered_data ,total_price, list_product (id_product, amount, price, name_product, image_product)

    async createOrder({username, name_customer, phone_customer, address_customer, email_customer, province_customer, district_customer, ward_customer, status, order_date, shipped_date, delivered_data, total_price, list_product}) {
        const order = await this.Order.insertOne({
            username,
            name_customer,
            phone_customer,
            address_customer,
            email_customer,
            province_customer,
            district_customer,
            ward_customer,
            status,
            order_date,
            shipped_date,
            delivered_data,
            total_price,
            list_product
        })
        return order
    }
}

export default CategoryService;