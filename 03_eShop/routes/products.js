const { Product } = require('../models/product')
const express = require('express')
const router = express.Router()
const { Category } = require('../models/category')
const multer = require('multer')
const { default: mongoose } = require('mongoose')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type')

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})


const uploadOptions = multer({ storage: storage })


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

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const { body } = req
    const category = await Category.findById(body.category)
    if (!category) {
        return res.status(400).send('Invalid category')
    }

    const file = req.file

    if (!file) return res.status(400).send('No image in request')
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`

    let product = new Product({
        name: body.name,
        description: body.description,
        richDescription: body.richDescription,
        image: `${basePath}/${fileName}`,
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

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    const { body, params: { id } } = req
    const category = await Category.findById(body.category)
    if (!category) {
        return res.status(400).send('Invalid category')
    }

    const product = Product.findById(id)
    if (!product) return res.status(400).send('Invalid Product!')

    const file = req.file;
    let imagePath;

    if (file) {
        const fileName = file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads`
        imagePath = `${basePath}/${fileName}`
    } else {
        imagePath = product.image
    }

    const newProduct = await Product.findByIdAndUpdate(
        id,
        {
            name: body.name,
            description: body.description,
            richDescription: body.richDescription,
            image: imagePath,
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

    if (!newProduct) {
        return res.status(500).send("The product cannot be update")
    }

    return res.send(newProduct)
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

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }

    const files = req.files
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`


    let imagesPath = []

    if (files) {
        files.map(file => {
            imagesPath.push(`${basePath}/${file.filename}`)
        })
    }


    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPath
        },
        { new: true }
    )

    if (!product) {
        return res.status(500).send("The product cannot be update")
    }

    return res.send(product)
})

module.exports = router