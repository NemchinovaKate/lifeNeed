const { Router } = require('express')
const Product = require('../models/product')
const router = Router()

router.get('/', async (req, res) => {
    let products = await Product.find().select('title img').limit(8)
    res.render('index', {
        title: 'Главная страница',
        isHome: true,
        products,
    })
})

module.exports = router
