const { Router, request } = require('express')
const Product = require('../models/product')
const router = Router()
const auth = require('../middleware/auth')
const { productValidators } = require('../utils/validators')
const { validationResult } = require('express-validator/check')

router.get('/', auth, (req, res) => {
    res.render('add', {
        layout: 'admin',
        isAdmin: req.user.role === 'admin',
        title: 'Добавить товар',
        isAdd: true,
    })
})

router.post('/', auth, productValidators, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty) {
        return res.status(422).render('add', {
            title: 'Добавить товар',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
                description: req.body.description,
            },
        })
    }

    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        description: req.body.description,
        userId: req.user,
    })

    try {
        await product.save()
        res.redirect('/admin')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
