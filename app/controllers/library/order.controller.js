import { MongoDB } from '@utils'
import { OrderService, CartService } from '@services'
import createError from 'http-errors'
import httpStatus from 'http-status'
import { validationResult } from 'express-validator'
import { nanoid } from 'nanoid'

const handleRequest = async (req, res, next, action) => {
    try {
        // Validate request
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() })
        }

        const { username, orderID, customer, total_price, products } = req.body

        // Call the action with the order service
        const order = new OrderService(MongoDB.client)
        const result = await action({ order, username, orderID, customer, total_price, products })
        res.status(httpStatus.OK).json(result)
    } catch (exception) {
        // Handle any errors
        next(createError(httpStatus.INTERNAL_SERVER_ERROR, exception))
    }
}

const getOrder = async (req, res, next) => {
    handleRequest(req, res, next, async ({order, username, orderID}) => {
        const params = { username, orderID }
        const result = await order.getOrder(params)
        if(result){
            return result
        }
        throw new Error('Failed to get order')
    })
}

const createOrder = async (req, res, next) => {
    handleRequest(req, res, next, async (order, username, customer, total_price, products) => {
        const orderID = nanoid(10).toUpperCase() //? generate orderID
        const status = 0 //? 0: Peeding, 1: Shipping, 2: Delivered, -1: Cancelled
        const order_date = new Date().toLocaleDateString('en-GB') //? format dd/mm/yyyy
        
        const params = { orderID, username, customer, status, order_date, total_price, products }
        const result = await order.createOrder(params)
        if(result){
            // clearCart
            const cart = new CartService(MongoDB.client)
            await cart.clearCart(username)
            return result
        }
        throw new Error('Failed to create order')
    })
}

const updateOrder = async (req, res, next) => {

}

export default {
    getOrder,
    createOrder,
    updateOrder
}