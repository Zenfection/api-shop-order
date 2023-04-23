import express from 'express'
import { body, oneOf } from 'express-validator'
import { userController } from '@controllers'

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


router.post('/register', userController.register)

router.post('/getcart', [
    body('username').exists().isString()
], userController.getCart)

router.post('/addcart', [
    body('username').exists().isString(),
    body('id_product').exists().isString(),
    body('amount').exists().isInt({ min: 1 })
], userController.addToCart)

router.post('/removecart', [
    body('username').exists().isString(),
    body('id_product').exists().isString(),
    body('amount').exists().isInt({ min: 1 })
], userController.deleteCart)

router.post('/removecart', [
    body('username').exists().isString(),
    body('id_product').exists().isString(),
], userController.removeProductCart)


export default router