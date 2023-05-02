import { MongoDB } from '@utils'
import { OrderService } from '@services'
import createError from 'http-errors'
import httpStatus from 'http-status'

const handleRequest = async (req, res, next, action) => {
    //? Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() })
    }

    const { customer, products } = req.body
    /*
    username, customer[name, phone, address, email, province, district, ward], status, order_date, shipped_date, delivered_data, total_price, list_product (id_product, amount, price, name_product, image_product)
    */
    try {
        const order = new OrderService(MongoDB.client)
        const result = await action({
            order,
            customer,
            products
        })
        res.status(httpStatus.OK).json(result)
    } catch (exception) {
        throw createError(httpStatus.INTERNAL_SERVER_ERROR, exception)
    }
}

const createOrder = async (req, res) => {
    handleRequest(req, res, async (order, customer, products) => {
        return await order.createOrder(customer, products)
    })
}

export default {
    createOrder
}