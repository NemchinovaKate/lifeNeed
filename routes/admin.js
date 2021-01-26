const { Router } = require('express')
const Product = require('../models/product')
const router = Router()
const admin = require('../middleware/admin')

router.get('/', admin, async (req, res) => {
    try {
        let products = await Product.find()
            .populate('userId', 'email name')
            .select('price title img')
        res.render('catalog', {
            title: 'Каталог',
            layout: 'admin',
            isCatalog: true,
            isAdmin: req.user.role === 'admin',
            products,
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
