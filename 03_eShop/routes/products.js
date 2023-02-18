const { Product } = require('../models/product')
const express = require('express')
const router = express.Router()
const { Category } = require('../models/category')


router.get(`/`, async (req, res) => {

    let filter = {}

    if (req.query.categories) {
        filter = { category: req.query.categories.split(",") }
    }
    const productList = await Product.find(filter).populate("category")

    if (!productList) {
        return res.status(500).json({ success: false })
    }
    return res.send(productList)
})

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category")

    if (!product) {
        res.status(404).json({ message: 'The category with the given ID was not found' })
    }
    res.status(200).send(product)
})

router.post(`/`, async (req, res) => {
    const { body } = req
    const category = await Category.findById(body.category)
    if (!category) {
        return res.status(400).send('Invalid category')
    }

    let product = new Product({
        name: body.name,
        description: body.description,
        richDescription: body.richDescription,
        image: body.image,
        brand: body.brand,
        price: body.price,
        category: body.category,
        countInStock: body.countInStock,
        rating: body.rating,
        numReviews: body.numReviews,
        isFeatured: body.isFeatured
    })

    product = await product.save()

    if (!product) {
        return res.status(500).send("The product cannot be created")
    }

    return res.send(product)
})

router.put('/:id', async (req, res) => {
    const { body, params: { id } } = req
    const category = await Category.findById(body.category)
    if (!category) {
        return res.status(400).send('Invalid category')
    }
    const product = await Product.findByIdAndUpdate(
        id,
        {
            name: body.name,
            description: body.description,
            richDescription: body.richDescription,
            image: body.image,
            brand: body.brand,
            price: body.price,
            category: body.category,
            countInStock: body.countInStock,
            rating: body.rating,
            numReviews: body.numReviews,
            isFeatured: body.isFeatured

        },
        {
            new: true
        }
    )

    if (!product) {
        return res.status(500).send("The product cannot be update")
    }

    return res.send(product)
})

router.delete('/:id', async (req, res) => {
    await Product.findByIdAndRemove(req.params.id).then((product) => {
        if (product) {
            return res.status(200).json({ success: true, message: 'the product is deleted' })
        } else {
            res.status(404).json({ success: false, message: "product not found" })
        }
    }).catch((error) => {
        return res.status(400).json({ success: false, error: error })
    })
})

router.get('/get/count', async (req, res) => {
    const count = await Product.countDocuments()

    if (!count) {
        return res.status(500).json({ success: false })
    }

    return res.send({
        productCount: count
    })
})

router.get('/get/featured/:count', async (req, res) => {
    let { params: { count } } = req
    count = count ? count : 0

    const products = await Product.find({ isFeatured: true }).limit(+count)

    if (!products) {
        return res.status(500).json({ success: false })
    }

    return res.send(products)
})

module.exports = router