const { User } = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get(`/`, async (req, res) => {
    const userList = await User.find().select("-passwordHash")

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList)
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.secret

    if (!user) {
        return res.status(400).send('The user not found')
    }

    console.log(bcrypt.compare(req.body.password, user.passwordHash))

    if (user && await bcrypt.compare(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            {
                expiresIn: '1d'
            }
        )

        return res.status(200).send({ user: user.email, token: token })
    }

    return res.status(400).send('Password is wrong!')
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select("-passwordHash")

    if (!user) {
        return res.status(404).json({ message: 'The user with the given ID was not found' })
    }

    return res.send(user)
})

router.post('/', async (req, res) => {
    const { body } = req
    let user = new User({
        name: body.name,
        email: body.email,
        passwordHash: bcrypt.hashSync(body.password, 10),
        phone: body.phone,
        isAdmin: body.isAdmin,
        street: body.street,
        apartment: body.apartment,
        zip: body.zip,
        city: body.city,
        country: body.country
    })

    user = await user.save()

    if (!user) {
        res.status(404).send('the user cannot be created')
    }

    return res.send(user)
})

module.exports = router