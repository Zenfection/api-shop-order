import { ObjectId } from 'mongodb'

class CartService {
    constructor(client) {
        this.Cart = client.db().collection('cart')
    }

    async findCart(username) {

        //? get cart with username
        const cart = await this.Cart.aggregate([
            {
                $match: {
                    username
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'id_product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            }
        ]).toArray()
        
        //? ignore _id, id_product, username, product.sold

        cart.forEach(item => {
            delete item.username
            delete item.product.sold
        })
        return cart
    }

    async addToCart(username, id_product, amount) {
        id_product = ObjectId.createFromHexString(id_product)
        const cart = await this.Cart.findOne({
            username,
            id_product
        })
        if (cart) {
            await this.Cart.updateOne({
                username,
                id_product
            }, {
                $inc: {
                    amount: +amount
                }
            })
        } else {
            await this.Cart.insertOne({
                username,
                id_product,
                amount
            })
        }
        // return _id, id_product, amount and product
        const result = await this.Cart.aggregate([
            {
                $match: {
                    id_product
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'id_product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            }
        ]).toArray()
        // ignore username
        delete result[0].username
        delete result[0].product.sold
        return result[0]
    }

    async deleteCart(username, id_product, amount) {
        id_product = ObjectId.createFromHexString(id_product)
        const cart = await this.Cart.findOne({
            username,
            id_product
        })

        if (cart) {
            if (cart.amount > amount) {
                await this.Cart.updateOne({
                    username,
                    id_product
                }, {
                    $inc: {
                        amount: -amount
                    }
                })
            } else {
                await this.Cart.deleteOne({
                    username,
                    id_product
                })
            }
        }
        return {
            message: 'Delete cart successfully'
        }
    }

}

export default CartService;