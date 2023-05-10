import express from 'express'
import { body, oneOf } from 'express-validator'
import { userController, cartController } from '@controllers'

const router = express.Router()

router.get('/:id', userController.getDetailUser)

router.post('/login', [
    oneOf([
        body('username')
            .exists()
            .isLength({ min: 5 }),
        body('email')
            .exists().isEmail()
    ]), body('password').exists().isString(),
], userController.login);


router.post('/register',[
    body('username').exists().isString().isLength({ min: 6 }),
    body('fullname').exists().isString().isLength({ min: 6 }),
    body('email').exists().isEmail(),
    body('password').exists().isString().isLength({ min: 6 }),
] ,userController.register)

router.patch('/update', [
    body('username').optional().isString(),
    body('fullname').optional().isString(),
    body('email').optional().isEmail(),
    body('password').optional().isString(),
    body('active').optional().isBoolean(),
    body('phone').optional().isString(),
    body('address').optional().isString(),
    body('province').optional().isString(),
    body('district').optional().isString(),
    body('ward').optional().isString()
], userController.updateUser)

router.post('/getcart', [
    body('username').exists().isString()
], cartController.getCart)

router.post('/addcart', [
    body('username').exists().isString(),
    body('id_product').exists().isString(),
    body('amount').exists().isInt({ min: 1 })
], cartController.addToCart)

router.post('/removecart', [
    body('username').exists().isString(),
    body('id_product').exists().isString(),
    body('amount').exists().isInt({ min: 1 })
], cartController.deleteCart)

export default router