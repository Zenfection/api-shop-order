import { validationResult } from 'express-validator'
import { MongoDB } from '@utils'
import { CartService } from '@services'
import createError from 'http-errors'
import httpStatus from 'http-status'

const handleRequest = async (req, res, next, action) => {
    //? Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() })
    }

    const { username, id_product, amount } = req.body
    try {
        const cart = new CartService(MongoDB.client)
        const result = await action(cart, username, id_product, amount)
        res.status(httpStatus.OK).json(result)
    } catch (exception) {
        throw createError(httpStatus.INTERNAL_SERVER_ERROR, exception)
    }
}

const getCart = async (req, res, next) => {
    handleRequest(req, res, next, async (cart, username) => {
        return await cart.findCart(username)
    })
}

const addToCart = async(req, res, next) => {
    handleRequest(req, res, next, async (cart, username, id_product, amount) => {
        return await cart.addToCart(username, id_product, amount)
    })
}

const deleteCart = async(req, res, next) => {
    handleRequest(req, res, next, async (cart, username, id_product, amount) => {
        return await cart.deleteCart(username, id_product, amount)
    })
}

export default {
    getCart,
    addToCart,
    deleteCart
}