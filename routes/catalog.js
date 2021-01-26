const { Router } = require('express')
const Product = require('../models/product')
const router = Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { productValidators } = require('../utils/validators')
const { validationResult } = require('express-validator/check')

function isOwner(product, req) {
    return product.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        let products = await Product.find()
            .populate('userId', 'email name')
            .select('price title img')
        res.render('catalog', {
            title: 'Каталог',
            isCatalog: true,
            userId: req.user ? req.user._id.toString() : null,
            products,
        })
    } catch (e) {
        console.log(e)
    }

    /*
получаем поле userId в котором хранятся все данные пользователя
   укажем .select('title') получим только это
    const products = await Product.find().populate('userId','email')
    */
})

router.post('/remove', admin, async (req, res) => {
    try {
        await Product.deleteOne({
            _id: req.body.id,
            userId: req.user._id,
        })
        res.redirect('/admin')
    } catch (e) {
        console.log(e)
    }
})

router.post('/edit', admin, productValidators, async (req, res) => {
    const errors = validationResult(req)
    const { id } = req.body
    if (!errors.isEmpty) {
        return res.status(422).redirect(`/catalog/${id}/edit?allow=true`)
    }
    try {
        delete req.body.id
        const product = await Product.findById(id)
        Object.assign(product, req.body)
        await product.save()
        res.redirect('/admin')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit', admin, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const product = await Product.findById(req.params.id)
        res.render('product-edit', {
            layout: 'admin',
            isAdmin: req.user.role === 'admin',
            title: 'Редактировать ${product.title}',
            product,
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    /*  res.render('product')*/
    try {
        const product = await Product.findById(req.params.id)
        res.render('product', {
            layout: 'main',
            title: `Товар ${product.title}`,
            product,
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
