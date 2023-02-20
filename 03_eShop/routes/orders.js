const { Order } = require('../models/order')
const { OrderItems } = require('../models/order-item');
const express = require('express')
const router = express.Router()

router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name')
        .populate(
            {
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            }
        )
        .sort({ 'dateOrdered': -1 })

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList)
})

router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate(
            {
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            }
        )

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order)
})

router.post('/', async (req, res) => {
    const { body } = req

    const orderItemsIds = Promise.all(body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItems({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save()

        return newOrderItem._id
    }))

    const orderItemsIdsResolved = await orderItemsIds

    const totalPrices = await Promise.all(
        orderItemsIdsResolved.map(async orderItemId => {
            const orderItem = await OrderItems.findById(orderItemId).populate('product', 'price')
            const totalPrice = orderItem.product.price * orderItem.quantity

            return totalPrice
        })
    )

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: body.shippingAddress1,
        shippingAddress2: body.shippingAddress2,
        city: body.city,
        zip: body.zip,
        country: body.country,
        phone: body.phone,
        status: body.status,
        totalPrice: totalPrice,
        user: body.user
    })

    order = await order.save()

    if (!order) {
        return res.status(400).send('the order cannot be created')
    }

    return res.send(order)
})

router.put('/:id', async (req, res) => {
    const { body, params: { id } } = req
    const order = await Order.findByIdAndUpdate(
        id,
        {
            status: body.status,
        },
        { new: true },
    )

    if (!order) {
        return res.status(400).send('The order cannot be updated!')
    }

    return res.send(order)
})

router.delete('/:id', async (req, res) => {
    await Order.findByIdAndRemove(req.params.id).then(async (order) => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItems.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({ success: true, message: 'the order is deleted' })
        } else {
            res.status(404).json({ success: false, message: "order not found" })
        }
    }).catch((error) => {
        return res.status(400).json({ success: false, error: error })
    })
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null, totalsales: { $sum: '$totalPrice' }
            }
        }
    ])

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated!')
    }

    res.send({ totalsales: totalSales.pop().totalsales })
})

router.get('/get/count', async (req, res) => {
    const count = await Order.countDocuments()

    if (!count) {
        return res.status(500).json({ success: false })
    }

    return res.send({
        orderCount: count
    })
})

router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userid })
        .populate(
            {
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            }
        )
        .sort({ 'dateOrdered': -1 })

    if (!userOrderList) {
        res.status(500).json({ success: false })
    }
    res.send(userOrderList)
})
module.exports = router