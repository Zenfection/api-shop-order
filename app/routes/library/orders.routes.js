import express from 'express'
import { body, check } from 'express-validator'
import { orderController } from '@controllers'

const router = express.Router()

router.post('/get', [
    body('username').exists().isString(),
    body('orderID').optional().isString()
], orderController.getOrder)

router.post('/create', [
    body('username').exists().isString(),
    body('customer').exists().isObject(),
        check('customer.fullname').exists().isString(),
        check('customer.email').exists().isEmail(),
        check('customer.phone').exists().isString(),
        check('customer.address').exists().isString(),
        check('customer.province').exists().isString(),
        check('customer.district').exists().isString(),
        check('customer.ward').exists().isString(),
    body('total_price').exists().isFloat({ min: 0.01 }),
    body('products').exists().isArray(),
        check('products.*.id').exists().isString(),
        check('products.*.amount').exists().isInt({ min: 1 }),
        check('products.*.price').exists().isDecimal({ min: 0 }),
        check('products.*.name').exists().isString(),
        check('products.*.image').exists().isString(),
], orderController.createOrder)

export default router