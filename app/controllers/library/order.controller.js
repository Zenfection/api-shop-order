import { MongoDB } from '@utils'
import { OrderService, CartService } from '@services'
import createError from 'http-errors'
import httpStatus from 'http-status'
import { validationResult } from 'express-validator'
import { nanoid } from 'nanoid'

const handleRequest = async (req, res, next, action) => {
    try {
        //? Validate request
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() })
        }

        const { username, customer, total_price, products } = req.body
        const orderID = req.params?.id || null

        //? Create params object with non-null and non-undefined values only
        const params = Object.fromEntries(
            Object.entries({ username, orderID, customer, total_price, products })
                .filter(([key, value]) => value != null)
        )

        //? Call the action with the order service
        const order = new OrderService(MongoDB.client)
        const result = await action(order, params)

        res.status(httpStatus.OK).json(result)
    } catch (exception) {
        // Handle any errors
        next(createError(httpStatus.INTERNAL_SERVER_ERROR, exception))
    }
}


const getAllOrder = async (req, res, next) => {
    handleRequest(req, res, next, async (order, params) => {
        const { username } = params
        const result = await order.getAllOrder(username)
        return (result) ? result : new Error('Failed to get order')
    })
}

const getOrderDetail = async(req, res, next) => {
    handleRequest(req, res, next, async (order, params) => {
        const { username, orderID } = params
        const result = await order.getOrderDetail(username, orderID)
        return (result) ? result : new Error('Failed to get order detail: ' + orderID)
    })
}

const createOrder = async (req, res, next) => {
    handleRequest(req, res, next, async (order, params) => {
        const { username } = params
        const orderID = nanoid(10).toUpperCase() //? generate orderID
        const status = 0 //? 0: Peeding, 1: Shipping, 2: Delivered, -1: Cancelled
        const order_date = new Date().toLocaleDateString('en-GB') //? format dd/mm/yyyy
        
        params = { ...params, orderID, status, order_date }
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

export default {
    getAllOrder,
    getOrderDetail,
    createOrder,
}